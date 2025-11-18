import { Injectable, Logger } from '@nestjs/common';

export interface TikTokLiveComment {
  id: string;
  username: string;
  userId: string;
  messageText: string;
  timestamp: Date;
}

export interface TikTokLiveConfig {
  accessToken: string;
  liveRoomId: string;
  appId: string;
}

/**
 * Service to monitor TikTok Live comments and send responses.
 *
 * TikTok Live API is less mature than YouTube/Twitch. This service provides
 * a foundation for integration when TikTok's official Live API becomes
 * more widely available.
 *
 * Current approach uses TikTok Events API (webhook-based) or polling.
 *
 * API Documentation: https://developers.tiktok.com/doc/live-events-api-get-started
 */
@Injectable()
export class TikTokLiveService {
  private readonly logger = new Logger(TikTokLiveService.name);
  private lastCommentId: string | null = null;

  constructor() {}

  /**
   * Fetch comments from TikTok Live room
   *
   * Note: TikTok Live API access is limited and requires approval.
   * This is a placeholder implementation for when access is available.
   *
   * @param config - TikTok configuration
   * @returns Array of comments
   */
  async fetchComments(config: TikTokLiveConfig): Promise<TikTokLiveComment[]> {
    try {
      // TikTok Live API endpoint (may vary based on region)
      const url = `https://open-api.tiktok.com/live/comment/list/?room_id=${config.liveRoomId}&cursor=${this.lastCommentId || '0'}`;

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `TikTok API error: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      if (data.data?.error_code !== 0) {
        throw new Error(`TikTok API error: ${data.data?.description}`);
      }

      const comments: TikTokLiveComment[] = (data.data?.comments || []).map(
        (comment: any) => ({
          id: comment.comment_id || Date.now().toString(),
          username: comment.user?.nickname || 'Unknown',
          userId: comment.user?.user_id || '',
          messageText: comment.text || '',
          timestamp: new Date(comment.create_time * 1000),
        }),
      );

      // Update cursor for next request
      if (data.data?.cursor) {
        this.lastCommentId = data.data.cursor;
      }

      this.logger.log(
        `Fetched ${comments.length} comments from TikTok Live`,
      );

      return comments;
    } catch (error) {
      this.logger.error('Error fetching TikTok Live comments', error);
      throw error;
    }
  }

  /**
   * Send a comment to TikTok Live
   *
   * Note: TikTok does not currently support posting comments via API.
   * This would require a different approach (e.g., browser automation)
   * or waiting for official API support.
   *
   * @param config - TikTok configuration
   * @param messageText - Message text
   */
  async sendComment(
    config: TikTokLiveConfig,
    messageText: string,
  ): Promise<boolean> {
    this.logger.warn(
      'TikTok does not support sending comments via API. Message queued for alternative delivery.',
    );

    // In a real implementation, you might:
    // 1. Queue message for manual sending
    // 2. Use browser automation (Puppeteer/Playwright)
    // 3. Send via DM if user follows the account

    return false;
  }

  /**
   * Send a direct message to a TikTok user
   *
   * Note: TikTok DM API has strict requirements:
   * - User must follow the business account
   * - 24-hour messaging window after user interaction
   *
   * @param config - TikTok configuration
   * @param userId - TikTok user ID
   * @param messageText - Message text
   */
  async sendDirectMessage(
    config: TikTokLiveConfig,
    userId: string,
    messageText: string,
  ): Promise<boolean> {
    try {
      const url = 'https://open-api.tiktok.com/message/send/';

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.accessToken}`,
        },
        body: JSON.stringify({
          recipient: {
            user_id: userId,
          },
          message: {
            text: messageText,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        this.logger.error(
          `TikTok DM API error: ${response.status} - ${JSON.stringify(errorData)}`,
        );
        return false;
      }

      const data = await response.json();

      if (data.data?.error_code !== 0) {
        this.logger.error(`TikTok DM error: ${data.data?.description}`);
        return false;
      }

      this.logger.log(`Sent DM to TikTok user ${userId}`);
      return true;
    } catch (error) {
      this.logger.error('Error sending TikTok DM', error);
      return false;
    }
  }

  /**
   * Register webhook for TikTok Live events
   *
   * TikTok uses webhooks to push live events (comments, gifts, etc.)
   * in real-time instead of polling.
   *
   * @param config - TikTok configuration
   * @param webhookUrl - Your server's webhook endpoint
   */
  async registerWebhook(
    config: TikTokLiveConfig,
    webhookUrl: string,
  ): Promise<boolean> {
    try {
      const url = 'https://open-api.tiktok.com/webhook/register/';

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.accessToken}`,
        },
        body: JSON.stringify({
          webhook_url: webhookUrl,
          events: ['live.comment', 'live.gift', 'live.viewer_join'],
        }),
      });

      if (!response.ok) {
        throw new Error(
          `TikTok Webhook API error: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      if (data.data?.error_code !== 0) {
        throw new Error(`TikTok Webhook error: ${data.data?.description}`);
      }

      this.logger.log(`Registered TikTok webhook: ${webhookUrl}`);
      return true;
    } catch (error) {
      this.logger.error('Error registering TikTok webhook', error);
      return false;
    }
  }

  /**
   * Process incoming webhook payload from TikTok
   *
   * @param payload - Webhook payload
   * @returns Processed comment or null
   */
  processWebhookPayload(payload: any): TikTokLiveComment | null {
    try {
      if (payload.event_type !== 'live.comment') {
        return null;
      }

      const comment = payload.data;

      return {
        id: comment.comment_id || Date.now().toString(),
        username: comment.user?.nickname || 'Unknown',
        userId: comment.user?.user_id || '',
        messageText: comment.text || '',
        timestamp: new Date(comment.create_time * 1000),
      };
    } catch (error) {
      this.logger.error('Error processing TikTok webhook payload', error);
      return null;
    }
  }

  /**
   * Verify TikTok webhook signature
   *
   * Important: Always verify webhook signatures to prevent spoofing
   *
   * @param payload - Webhook payload
   * @param signature - TikTok signature header
   * @param appSecret - Your TikTok app secret
   */
  verifyWebhookSignature(
    payload: string,
    signature: string,
    appSecret: string,
  ): boolean {
    try {
      // TikTok uses HMAC-SHA256 for webhook verification
      const crypto = require('crypto');
      const hmac = crypto.createHmac('sha256', appSecret);
      hmac.update(payload);
      const expectedSignature = hmac.digest('hex');

      return signature === expectedSignature;
    } catch (error) {
      this.logger.error('Error verifying TikTok webhook signature', error);
      return false;
    }
  }

  /**
   * Get live stream status
   *
   * @param config - TikTok configuration
   * @returns Live stream status
   */
  async getLiveStatus(config: TikTokLiveConfig): Promise<{
    isLive: boolean;
    viewerCount: number;
    startTime: Date | null;
  }> {
    try {
      const url = `https://open-api.tiktok.com/live/room/info/?room_id=${config.liveRoomId}`;

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `TikTok API error: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      if (data.data?.error_code !== 0) {
        throw new Error(`TikTok API error: ${data.data?.description}`);
      }

      const roomInfo = data.data?.room_info || {};

      return {
        isLive: roomInfo.status === 'LIVE',
        viewerCount: roomInfo.viewer_count || 0,
        startTime: roomInfo.start_time
          ? new Date(roomInfo.start_time * 1000)
          : null,
      };
    } catch (error) {
      this.logger.error('Error getting TikTok live status', error);
      throw error;
    }
  }

  /**
   * Reset comment cursor (useful when starting a new session)
   */
  resetCursor(): void {
    this.lastCommentId = null;
  }
}
