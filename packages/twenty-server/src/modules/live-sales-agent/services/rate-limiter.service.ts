import { Injectable, Logger } from '@nestjs/common';

export interface RateLimitConfig {
  maxResponsesPerUser: number;
  maxResponsesPerSession: number;
  minDelayBetweenResponsesMs: number;
  twitchWhispersPerDay: number;
  youtubeQuotaPerDay: number;
}

export interface RateLimitResult {
  allowed: boolean;
  reason?: string;
  retryAfterMs?: number;
}

interface UserRateLimit {
  responseCount: number;
  lastResponseTime: number;
  firstResponseTime: number;
}

/**
 * Service to enforce rate limits for AI agent responses.
 *
 * Prevents:
 * - Spamming individual users
 * - Exceeding platform API limits
 * - Over-responding during a single session
 *
 * Implements sliding window and token bucket algorithms.
 */
@Injectable()
export class RateLimiterService {
  private readonly logger = new Logger(RateLimiterService.name);

  // Per-user rate limits (keyed by liveSessionId:username)
  private userLimits: Map<string, UserRateLimit> = new Map();

  // Per-session rate limits (keyed by liveSessionId)
  private sessionResponseCounts: Map<string, number> = new Map();

  // Platform-specific limits
  private twitchWhisperCount = 0;
  private twitchWhisperResetTime = Date.now() + 24 * 60 * 60 * 1000;

  private youtubeQuotaUsed = 0;
  private youtubeQuotaResetTime = Date.now() + 24 * 60 * 60 * 1000;

  private readonly defaultConfig: RateLimitConfig = {
    maxResponsesPerUser: 3,
    maxResponsesPerSession: 100,
    minDelayBetweenResponsesMs: 30000, // 30 seconds
    twitchWhispersPerDay: 40,
    youtubeQuotaPerDay: 10000,
  };

  constructor() {
    // Clean up old entries every 10 minutes
    setInterval(() => this.cleanup(), 10 * 60 * 1000);
  }

  /**
   * Check if a response is allowed for a user
   *
   * @param liveSessionId - Live session ID
   * @param username - Username
   * @param config - Rate limit configuration
   * @returns Rate limit result
   */
  checkUserLimit(
    liveSessionId: string,
    username: string,
    config: Partial<RateLimitConfig> = {},
  ): RateLimitResult {
    const fullConfig = { ...this.defaultConfig, ...config };
    const key = `${liveSessionId}:${username}`;
    const now = Date.now();

    let userLimit = this.userLimits.get(key);

    if (!userLimit) {
      userLimit = {
        responseCount: 0,
        lastResponseTime: 0,
        firstResponseTime: now,
      };
      this.userLimits.set(key, userLimit);
    }

    // Check max responses per user
    if (userLimit.responseCount >= fullConfig.maxResponsesPerUser) {
      return {
        allowed: false,
        reason: `Maximum ${fullConfig.maxResponsesPerUser} responses per user reached`,
      };
    }

    // Check minimum delay between responses
    const timeSinceLastResponse = now - userLimit.lastResponseTime;
    if (
      userLimit.lastResponseTime > 0 &&
      timeSinceLastResponse < fullConfig.minDelayBetweenResponsesMs
    ) {
      return {
        allowed: false,
        reason: 'Too soon since last response to this user',
        retryAfterMs:
          fullConfig.minDelayBetweenResponsesMs - timeSinceLastResponse,
      };
    }

    return { allowed: true };
  }

  /**
   * Check if a response is allowed for the session
   *
   * @param liveSessionId - Live session ID
   * @param config - Rate limit configuration
   * @returns Rate limit result
   */
  checkSessionLimit(
    liveSessionId: string,
    config: Partial<RateLimitConfig> = {},
  ): RateLimitResult {
    const fullConfig = { ...this.defaultConfig, ...config };
    const count = this.sessionResponseCounts.get(liveSessionId) || 0;

    if (count >= fullConfig.maxResponsesPerSession) {
      return {
        allowed: false,
        reason: `Maximum ${fullConfig.maxResponsesPerSession} responses per session reached`,
      };
    }

    return { allowed: true };
  }

  /**
   * Check if a Twitch whisper is allowed
   *
   * Twitch has a hard limit of 40 whispers per day
   *
   * @param config - Rate limit configuration
   * @returns Rate limit result
   */
  checkTwitchWhisperLimit(
    config: Partial<RateLimitConfig> = {},
  ): RateLimitResult {
    const fullConfig = { ...this.defaultConfig, ...config };
    const now = Date.now();

    // Reset counter if 24 hours have passed
    if (now >= this.twitchWhisperResetTime) {
      this.twitchWhisperCount = 0;
      this.twitchWhisperResetTime = now + 24 * 60 * 60 * 1000;
      this.logger.log('Twitch whisper limit reset');
    }

    if (this.twitchWhisperCount >= fullConfig.twitchWhispersPerDay) {
      return {
        allowed: false,
        reason: `Twitch whisper daily limit reached (${fullConfig.twitchWhispersPerDay})`,
        retryAfterMs: this.twitchWhisperResetTime - now,
      };
    }

    return { allowed: true };
  }

  /**
   * Check if YouTube API quota allows the operation
   *
   * YouTube has a daily quota of 10,000 units
   * - List messages: 5 units per call
   * - Insert message: 50 units per call
   *
   * @param units - Quota units to consume
   * @param config - Rate limit configuration
   * @returns Rate limit result
   */
  checkYouTubeQuota(
    units: number,
    config: Partial<RateLimitConfig> = {},
  ): RateLimitResult {
    const fullConfig = { ...this.defaultConfig, ...config };
    const now = Date.now();

    // Reset quota if 24 hours have passed
    if (now >= this.youtubeQuotaResetTime) {
      this.youtubeQuotaUsed = 0;
      this.youtubeQuotaResetTime = now + 24 * 60 * 60 * 1000;
      this.logger.log('YouTube quota reset');
    }

    if (this.youtubeQuotaUsed + units > fullConfig.youtubeQuotaPerDay) {
      return {
        allowed: false,
        reason: `YouTube daily quota limit reached (${fullConfig.youtubeQuotaPerDay})`,
        retryAfterMs: this.youtubeQuotaResetTime - now,
      };
    }

    return { allowed: true };
  }

  /**
   * Record a response to a user
   *
   * @param liveSessionId - Live session ID
   * @param username - Username
   */
  recordUserResponse(liveSessionId: string, username: string): void {
    const key = `${liveSessionId}:${username}`;
    const now = Date.now();

    const userLimit = this.userLimits.get(key) || {
      responseCount: 0,
      lastResponseTime: 0,
      firstResponseTime: now,
    };

    userLimit.responseCount++;
    userLimit.lastResponseTime = now;

    this.userLimits.set(key, userLimit);

    this.logger.log(
      `Recorded response to ${username} in session ${liveSessionId} (${userLimit.responseCount} total)`,
    );
  }

  /**
   * Record a session response
   *
   * @param liveSessionId - Live session ID
   */
  recordSessionResponse(liveSessionId: string): void {
    const count = this.sessionResponseCounts.get(liveSessionId) || 0;
    this.sessionResponseCounts.set(liveSessionId, count + 1);

    this.logger.log(
      `Recorded session response for ${liveSessionId} (${count + 1} total)`,
    );
  }

  /**
   * Record a Twitch whisper
   */
  recordTwitchWhisper(): void {
    this.twitchWhisperCount++;
    this.logger.log(
      `Recorded Twitch whisper (${this.twitchWhisperCount} today)`,
    );
  }

  /**
   * Record YouTube quota usage
   *
   * @param units - Quota units consumed
   */
  recordYouTubeQuota(units: number): void {
    this.youtubeQuotaUsed += units;
    this.logger.log(
      `Recorded YouTube quota usage: ${units} units (${this.youtubeQuotaUsed} total today)`,
    );
  }

  /**
   * Get remaining limits for a user
   *
   * @param liveSessionId - Live session ID
   * @param username - Username
   * @param config - Rate limit configuration
   */
  getUserRemainingResponses(
    liveSessionId: string,
    username: string,
    config: Partial<RateLimitConfig> = {},
  ): number {
    const fullConfig = { ...this.defaultConfig, ...config };
    const key = `${liveSessionId}:${username}`;
    const userLimit = this.userLimits.get(key);

    if (!userLimit) {
      return fullConfig.maxResponsesPerUser;
    }

    return Math.max(
      0,
      fullConfig.maxResponsesPerUser - userLimit.responseCount,
    );
  }

  /**
   * Get remaining session responses
   *
   * @param liveSessionId - Live session ID
   * @param config - Rate limit configuration
   */
  getSessionRemainingResponses(
    liveSessionId: string,
    config: Partial<RateLimitConfig> = {},
  ): number {
    const fullConfig = { ...this.defaultConfig, ...config };
    const count = this.sessionResponseCounts.get(liveSessionId) || 0;

    return Math.max(0, fullConfig.maxResponsesPerSession - count);
  }

  /**
   * Get remaining Twitch whispers
   */
  getTwitchRemainingWhispers(
    config: Partial<RateLimitConfig> = {},
  ): number {
    const fullConfig = { ...this.defaultConfig, ...config };
    return Math.max(
      0,
      fullConfig.twitchWhispersPerDay - this.twitchWhisperCount,
    );
  }

  /**
   * Get remaining YouTube quota
   */
  getYouTubeRemainingQuota(
    config: Partial<RateLimitConfig> = {},
  ): number {
    const fullConfig = { ...this.defaultConfig, ...config };
    return Math.max(0, fullConfig.youtubeQuotaPerDay - this.youtubeQuotaUsed);
  }

  /**
   * Reset limits for a session (useful when session ends)
   *
   * @param liveSessionId - Live session ID
   */
  resetSession(liveSessionId: string): void {
    // Remove all user limits for this session
    const keysToDelete: string[] = [];
    for (const key of this.userLimits.keys()) {
      if (key.startsWith(`${liveSessionId}:`)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach((key) => this.userLimits.delete(key));

    // Remove session count
    this.sessionResponseCounts.delete(liveSessionId);

    this.logger.log(`Reset limits for session ${liveSessionId}`);
  }

  /**
   * Clean up old entries
   */
  private cleanup(): void {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    // Clean up user limits
    for (const [key, limit] of this.userLimits.entries()) {
      if (now - limit.firstResponseTime > maxAge) {
        this.userLimits.delete(key);
      }
    }

    this.logger.log('Cleaned up old rate limit entries');
  }

  /**
   * Get current rate limit stats
   */
  getStats(): {
    twitchWhispersUsed: number;
    youtubeQuotaUsed: number;
    activeUserLimits: number;
    activeSessions: number;
  } {
    return {
      twitchWhispersUsed: this.twitchWhisperCount,
      youtubeQuotaUsed: this.youtubeQuotaUsed,
      activeUserLimits: this.userLimits.size,
      activeSessions: this.sessionResponseCounts.size,
    };
  }
}
