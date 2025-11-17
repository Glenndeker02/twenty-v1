import { Injectable, Logger } from '@nestjs/common';
import { YouTubeLiveChatService, YouTubeChatMessage } from './youtube-live-chat.service';
import { TwitchChatService, TwitchChatMessage } from './twitch-chat.service';
import { TikTokLiveService, TikTokLiveComment } from './tiktok-live.service';
import { ClaudeAiService, IntentType, Product } from './claude-ai.service';
import { RateLimiterService } from './rate-limiter.service';

export interface LiveSessionConfig {
  liveSessionId: string;
  platform: 'YOUTUBE' | 'TWITCH' | 'TIKTOK';
  agentEnabled: boolean;
  products: Product[];

  // Platform-specific configs
  youtubeConfig?: {
    apiKey: string;
    liveChatId: string;
  };
  twitchConfig?: {
    accessToken: string;
    channelName: string;
    botUsername: string;
    clientId: string;
  };
  tiktokConfig?: {
    accessToken: string;
    liveRoomId: string;
    appId: string;
  };

  // Claude AI config
  claudeApiKey: string;
}

export interface InteractionResult {
  interactionId: string;
  username: string;
  userMessage: string;
  intent: IntentType;
  agentResponse: string | null;
  wasAutoResponded: boolean;
  leadScore: number;
  matchedProduct: Product | null;
}

/**
 * Orchestrator service that coordinates all live sales agent components.
 *
 * This service:
 * - Monitors live chat across platforms
 * - Detects intent using Claude AI
 * - Generates responses
 * - Enforces rate limits
 * - Creates CRM records for interactions and leads
 *
 * It's the central hub that brings together all the pieces.
 */
@Injectable()
export class LiveSalesAgentOrchestratorService {
  private readonly logger = new Logger(LiveSalesAgentOrchestratorService.name);
  private activeSessionIds: Set<string> = new Set();
  private pollingIntervals: Map<string, NodeJS.Timeout> = new Map();

  constructor(
    private readonly youtubeService: YouTubeLiveChatService,
    private readonly twitchService: TwitchChatService,
    private readonly tiktokService: TikTokLiveService,
    private readonly claudeService: ClaudeAiService,
    private readonly rateLimiter: RateLimiterService,
  ) {}

  /**
   * Start monitoring a live session
   *
   * @param config - Live session configuration
   */
  async startSession(config: LiveSessionConfig): Promise<void> {
    if (this.activeSessionIds.has(config.liveSessionId)) {
      this.logger.warn(`Session ${config.liveSessionId} is already active`);
      return;
    }

    this.logger.log(`Starting live session ${config.liveSessionId} on ${config.platform}`);
    this.activeSessionIds.add(config.liveSessionId);

    switch (config.platform) {
      case 'YOUTUBE':
        await this.startYouTubeSession(config);
        break;
      case 'TWITCH':
        await this.startTwitchSession(config);
        break;
      case 'TIKTOK':
        await this.startTikTokSession(config);
        break;
    }
  }

  /**
   * Stop monitoring a live session
   *
   * @param liveSessionId - Live session ID
   */
  async stopSession(liveSessionId: string): Promise<void> {
    this.logger.log(`Stopping live session ${liveSessionId}`);

    // Stop polling
    const interval = this.pollingIntervals.get(liveSessionId);
    if (interval) {
      clearInterval(interval);
      this.pollingIntervals.delete(liveSessionId);
    }

    // Reset rate limits
    this.rateLimiter.resetSession(liveSessionId);

    // Disconnect platform services
    this.twitchService.disconnect();
    this.tiktokService.resetCursor();
    this.youtubeService.resetPagination();

    this.activeSessionIds.delete(liveSessionId);
  }

  /**
   * Process a user message and generate response
   *
   * @param config - Live session configuration
   * @param username - Username
   * @param message - User message
   * @returns Interaction result
   */
  async processMessage(
    config: LiveSessionConfig,
    username: string,
    message: string,
  ): Promise<InteractionResult> {
    const interactionId = this.generateInteractionId();

    try {
      // Check if agent is enabled
      if (!config.agentEnabled) {
        return this.createInteractionResult(
          interactionId,
          username,
          message,
          'OTHER',
          null,
          false,
          0,
          null,
        );
      }

      // Detect intent using Claude AI
      const intentResult = await this.claudeService.detectIntent(
        message,
        config.products,
        { apiKey: config.claudeApiKey },
      );

      this.logger.log(
        `Intent detected: ${intentResult.intent} (confidence: ${intentResult.confidence})`,
      );

      // Match product if mentioned
      let matchedProduct: Product | null = null;
      if (intentResult.extractedProductName) {
        matchedProduct = await this.claudeService.matchProduct(
          message,
          config.products,
          { apiKey: config.claudeApiKey },
        );
      }

      // Check if we should auto-respond
      const shouldRespond = this.shouldAutoRespond(intentResult.intent, intentResult.confidence);

      let agentResponse: string | null = null;
      let wasAutoResponded = false;

      if (shouldRespond) {
        // Check rate limits
        const userLimit = this.rateLimiter.checkUserLimit(
          config.liveSessionId,
          username,
        );
        const sessionLimit = this.rateLimiter.checkSessionLimit(
          config.liveSessionId,
        );

        if (userLimit.allowed && sessionLimit.allowed) {
          // Generate response
          agentResponse = await this.claudeService.generateResponse(
            message,
            intentResult.intent,
            matchedProduct,
            { apiKey: config.claudeApiKey },
          );

          // Send response to platform
          await this.sendResponseToPlatform(config, username, agentResponse);

          // Record rate limit usage
          this.rateLimiter.recordUserResponse(config.liveSessionId, username);
          this.rateLimiter.recordSessionResponse(config.liveSessionId);

          wasAutoResponded = true;

          this.logger.log(`Auto-responded to ${username}: ${agentResponse}`);
        } else {
          this.logger.log(
            `Rate limit exceeded for ${username}: ${userLimit.reason || sessionLimit.reason}`,
          );
        }
      }

      return this.createInteractionResult(
        interactionId,
        username,
        message,
        intentResult.intent,
        agentResponse,
        wasAutoResponded,
        intentResult.leadScore,
        matchedProduct,
      );
    } catch (error) {
      this.logger.error('Error processing message', error);
      return this.createInteractionResult(
        interactionId,
        username,
        message,
        'OTHER',
        null,
        false,
        0,
        null,
      );
    }
  }

  /**
   * Send a manual response (creator-initiated)
   *
   * @param config - Live session configuration
   * @param username - Username to respond to
   * @param message - Response message
   */
  async sendManualResponse(
    config: LiveSessionConfig,
    username: string,
    message: string,
  ): Promise<boolean> {
    try {
      await this.sendResponseToPlatform(config, username, message);
      this.logger.log(`Manual response sent to ${username}: ${message}`);
      return true;
    } catch (error) {
      this.logger.error('Error sending manual response', error);
      return false;
    }
  }

  /**
   * Get session statistics
   *
   * @param liveSessionId - Live session ID
   */
  getSessionStats(liveSessionId: string): {
    isActive: boolean;
    remainingResponses: number;
    rateLimitStats: any;
  } {
    return {
      isActive: this.activeSessionIds.has(liveSessionId),
      remainingResponses: this.rateLimiter.getSessionRemainingResponses(liveSessionId),
      rateLimitStats: this.rateLimiter.getStats(),
    };
  }

  /**
   * Start YouTube session monitoring
   */
  private async startYouTubeSession(config: LiveSessionConfig): Promise<void> {
    if (!config.youtubeConfig) {
      throw new Error('YouTube configuration is required');
    }

    const pollMessages = async () => {
      try {
        const messages = await this.youtubeService.fetchMessages({
          apiKey: config.youtubeConfig!.apiKey,
          liveChatId: config.youtubeConfig!.liveChatId,
        });

        // Record quota usage (5 units per list call)
        this.rateLimiter.recordYouTubeQuota(5);

        for (const message of messages) {
          await this.processMessage(
            config,
            message.authorDisplayName,
            message.messageText,
          );
        }
      } catch (error) {
        this.logger.error('Error polling YouTube messages', error);
      }
    };

    // Poll at recommended interval
    const interval = setInterval(
      pollMessages,
      this.youtubeService.getPollingInterval(),
    );
    this.pollingIntervals.set(config.liveSessionId, interval);

    // Fetch initial messages
    await pollMessages();
  }

  /**
   * Start Twitch session monitoring
   */
  private async startTwitchSession(config: LiveSessionConfig): Promise<void> {
    if (!config.twitchConfig) {
      throw new Error('Twitch configuration is required');
    }

    await this.twitchService.connect(config.twitchConfig);

    this.twitchService.onMessage(async (message: TwitchChatMessage) => {
      await this.processMessage(config, message.username, message.messageText);
    });
  }

  /**
   * Start TikTok session monitoring
   */
  private async startTikTokSession(config: LiveSessionConfig): Promise<void> {
    if (!config.tiktokConfig) {
      throw new Error('TikTok configuration is required');
    }

    const pollComments = async () => {
      try {
        const comments = await this.tiktokService.fetchComments(config.tiktokConfig!);

        for (const comment of comments) {
          await this.processMessage(config, comment.username, comment.messageText);
        }
      } catch (error) {
        this.logger.error('Error polling TikTok comments', error);
      }
    };

    // Poll every 5 seconds
    const interval = setInterval(pollComments, 5000);
    this.pollingIntervals.set(config.liveSessionId, interval);

    // Fetch initial comments
    await pollComments();
  }

  /**
   * Send response to appropriate platform
   */
  private async sendResponseToPlatform(
    config: LiveSessionConfig,
    username: string,
    message: string,
  ): Promise<void> {
    switch (config.platform) {
      case 'YOUTUBE':
        if (config.youtubeConfig) {
          // Check quota
          const quotaCheck = this.rateLimiter.checkYouTubeQuota(50); // Insert costs 50 units
          if (!quotaCheck.allowed) {
            throw new Error(quotaCheck.reason);
          }

          await this.youtubeService.postMessage(config.youtubeConfig, message);
          this.rateLimiter.recordYouTubeQuota(50);
        }
        break;

      case 'TWITCH':
        if (config.twitchConfig) {
          await this.twitchService.sendMessage(
            config.twitchConfig.channelName,
            `@${username} ${message}`,
          );
        }
        break;

      case 'TIKTOK':
        if (config.tiktokConfig) {
          // TikTok doesn't support posting comments via API
          // Queue for manual sending or alternative method
          this.logger.warn('TikTok comment posting not supported via API');
        }
        break;
    }
  }

  /**
   * Determine if we should auto-respond based on intent and confidence
   */
  private shouldAutoRespond(intent: IntentType, confidence: number): boolean {
    // High-confidence product inquiries and purchase intent
    if (
      (intent === 'PRODUCT_INQUIRY' || intent === 'PURCHASE_INTENT') &&
      confidence >= 0.7
    ) {
      return true;
    }

    // Don't auto-respond to complaints or low-confidence messages
    if (intent === 'COMPLAINT' || confidence < 0.5) {
      return false;
    }

    return false;
  }

  /**
   * Create interaction result
   */
  private createInteractionResult(
    interactionId: string,
    username: string,
    userMessage: string,
    intent: IntentType,
    agentResponse: string | null,
    wasAutoResponded: boolean,
    leadScore: number,
    matchedProduct: Product | null,
  ): InteractionResult {
    return {
      interactionId,
      username,
      userMessage,
      intent,
      agentResponse,
      wasAutoResponded,
      leadScore,
      matchedProduct,
    };
  }

  /**
   * Generate unique interaction ID
   */
  private generateInteractionId(): string {
    return `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
