import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export interface YouTubeChatMessage {
  id: string;
  authorChannelId: string;
  authorDisplayName: string;
  messageText: string;
  publishedAt: string;
}

export interface YouTubeLiveChatConfig {
  apiKey: string;
  liveChatId: string;
}

/**
 * Service to monitor YouTube Live Chat and fetch messages.
 *
 * This service polls the YouTube Live Chat API to retrieve new messages
 * from a live stream chat. It supports pagination and rate limiting.
 *
 * API Documentation: https://developers.google.com/youtube/v3/live/docs/liveChatMessages
 */
@Injectable()
export class YouTubeLiveChatService {
  private readonly logger = new Logger(YouTubeLiveChatService.name);
  private nextPageToken: string | null = null;
  private pollingIntervalMs: number = 5000; // Default 5 seconds

  constructor() {}

  /**
   * Fetch new messages from YouTube Live Chat
   *
   * @param config - YouTube API configuration
   * @returns Array of chat messages
   */
  async fetchMessages(
    config: YouTubeLiveChatConfig,
  ): Promise<YouTubeChatMessage[]> {
    try {
      const url = this.buildApiUrl(config);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `YouTube API error: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      // Update pagination token for next request
      this.nextPageToken = data.nextPageToken || null;
      this.pollingIntervalMs = data.pollingIntervalMillis || 5000;

      const messages: YouTubeChatMessage[] = (data.items || []).map(
        (item: any) => ({
          id: item.id,
          authorChannelId: item.authorDetails?.channelId || '',
          authorDisplayName: item.authorDetails?.displayName || 'Unknown',
          messageText: item.snippet?.displayMessage || '',
          publishedAt: item.snippet?.publishedAt || new Date().toISOString(),
        }),
      );

      this.logger.log(
        `Fetched ${messages.length} messages from YouTube Live Chat`,
      );

      return messages;
    } catch (error) {
      this.logger.error('Error fetching YouTube Live Chat messages', error);
      throw error;
    }
  }

  /**
   * Post a message to YouTube Live Chat
   *
   * @param config - YouTube API configuration
   * @param messageText - Message to post
   * @returns Posted message ID
   */
  async postMessage(
    config: YouTubeLiveChatConfig,
    messageText: string,
  ): Promise<string> {
    try {
      const url = `https://www.googleapis.com/youtube/v3/liveChat/messages?part=snippet&key=${config.apiKey}`;

      const requestBody = {
        snippet: {
          liveChatId: config.liveChatId,
          type: 'textMessageEvent',
          textMessageDetails: {
            messageText: messageText,
          },
        },
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `YouTube API error: ${response.status} - ${JSON.stringify(errorData)}`,
        );
      }

      const data = await response.json();
      this.logger.log(`Posted message to YouTube Live Chat: ${messageText}`);

      return data.id;
    } catch (error) {
      this.logger.error('Error posting message to YouTube Live Chat', error);
      throw error;
    }
  }

  /**
   * Get the recommended polling interval in milliseconds
   */
  getPollingInterval(): number {
    return this.pollingIntervalMs;
  }

  /**
   * Reset pagination state (useful when starting a new session)
   */
  resetPagination(): void {
    this.nextPageToken = null;
    this.pollingIntervalMs = 5000;
  }

  /**
   * Build the API URL for fetching messages
   */
  private buildApiUrl(config: YouTubeLiveChatConfig): string {
    const baseUrl =
      'https://www.googleapis.com/youtube/v3/liveChat/messages';
    const params = new URLSearchParams({
      part: 'snippet,authorDetails',
      liveChatId: config.liveChatId,
      key: config.apiKey,
    });

    if (this.nextPageToken) {
      params.append('pageToken', this.nextPageToken);
    }

    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Get live chat ID from a video ID
   *
   * @param videoId - YouTube video ID
   * @param apiKey - YouTube API key
   * @returns Live chat ID
   */
  async getLiveChatId(videoId: string, apiKey: string): Promise<string> {
    try {
      const url = `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${videoId}&key=${apiKey}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `YouTube API error: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        throw new Error(`Video not found: ${videoId}`);
      }

      const liveChatId =
        data.items[0].liveStreamingDetails?.activeLiveChatId;

      if (!liveChatId) {
        throw new Error(`No active live chat for video: ${videoId}`);
      }

      this.logger.log(`Retrieved live chat ID: ${liveChatId}`);

      return liveChatId;
    } catch (error) {
      this.logger.error('Error getting live chat ID', error);
      throw error;
    }
  }
}
