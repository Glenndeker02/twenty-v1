import { Injectable, Logger } from '@nestjs/common';
import WebSocket from 'ws';

export interface TwitchChatMessage {
  id: string;
  username: string;
  displayName: string;
  messageText: string;
  timestamp: Date;
  userId: string;
}

export interface TwitchConfig {
  accessToken: string;
  channelName: string;
  botUsername: string;
  clientId: string;
}

export interface TwitchWhisperConfig extends TwitchConfig {
  fromUserId: string;
  toUserId: string;
}

/**
 * Service to monitor Twitch chat using IRC and send whispers.
 *
 * This service connects to Twitch IRC to receive chat messages in real-time
 * and uses the Twitch API to send whispers (DMs).
 *
 * IRC Documentation: https://dev.twitch.tv/docs/irc
 * Whispers API: https://dev.twitch.tv/docs/api/reference#send-whisper
 */
@Injectable()
export class TwitchChatService {
  private readonly logger = new Logger(TwitchChatService.name);
  private ws: WebSocket | null = null;
  private messageHandlers: Array<(message: TwitchChatMessage) => void> = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private whispersSentToday = 0;
  private whisperDailyLimit = 40;
  private lastWhisperReset = new Date();

  constructor() {}

  /**
   * Connect to Twitch IRC
   *
   * @param config - Twitch configuration
   */
  async connect(config: TwitchConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443');

        this.ws.on('open', () => {
          this.logger.log('Connected to Twitch IRC');

          // Send authentication
          this.ws?.send(`PASS oauth:${config.accessToken}`);
          this.ws?.send(`NICK ${config.botUsername}`);
          this.ws?.send(`JOIN #${config.channelName}`);

          // Request capabilities for tags (user-id, display-name, etc.)
          this.ws?.send('CAP REQ :twitch.tv/tags twitch.tv/commands');

          this.reconnectAttempts = 0;
          resolve();
        });

        this.ws.on('message', (data: Buffer) => {
          const message = data.toString();
          this.handleIrcMessage(message);
        });

        this.ws.on('close', () => {
          this.logger.warn('Disconnected from Twitch IRC');
          this.attemptReconnect(config);
        });

        this.ws.on('error', (error) => {
          this.logger.error('Twitch IRC error', error);
          reject(error);
        });
      } catch (error) {
        this.logger.error('Error connecting to Twitch IRC', error);
        reject(error);
      }
    });
  }

  /**
   * Disconnect from Twitch IRC
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Register a message handler
   *
   * @param handler - Function to call when a message is received
   */
  onMessage(handler: (message: TwitchChatMessage) => void): void {
    this.messageHandlers.push(handler);
  }

  /**
   * Send a message to Twitch chat
   *
   * @param channelName - Channel to send message to
   * @param messageText - Message text
   */
  async sendMessage(channelName: string, messageText: string): Promise<void> {
    if (!this.ws) {
      throw new Error('Not connected to Twitch IRC');
    }

    this.ws.send(`PRIVMSG #${channelName} :${messageText}`);
    this.logger.log(`Sent message to #${channelName}: ${messageText}`);
  }

  /**
   * Send a whisper (DM) to a user using Twitch API
   *
   * IMPORTANT: Limited to 40 whispers per day
   *
   * @param config - Twitch whisper configuration
   * @param messageText - Message text
   * @returns Success status
   */
  async sendWhisper(
    config: TwitchWhisperConfig,
    messageText: string,
  ): Promise<boolean> {
    try {
      // Check daily limit
      this.checkWhisperLimit();

      const url = `https://api.twitch.tv/helix/whispers?from_user_id=${config.fromUserId}&to_user_id=${config.toUserId}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Client-Id': config.clientId,
          Authorization: `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        this.logger.error(
          `Twitch Whisper API error: ${response.status} - ${errorData}`,
        );
        return false;
      }

      this.whispersSentToday++;
      this.logger.log(
        `Sent whisper to user ${config.toUserId} (${this.whispersSentToday}/${this.whisperDailyLimit} today)`,
      );

      return true;
    } catch (error) {
      this.logger.error('Error sending Twitch whisper', error);
      return false;
    }
  }

  /**
   * Get remaining whispers available today
   */
  getRemainingWhispers(): number {
    return Math.max(0, this.whisperDailyLimit - this.whispersSentToday);
  }

  /**
   * Get user ID from username
   *
   * @param username - Twitch username
   * @param config - Twitch configuration
   * @returns User ID
   */
  async getUserId(username: string, config: TwitchConfig): Promise<string> {
    try {
      const url = `https://api.twitch.tv/helix/users?login=${username}`;

      const response = await fetch(url, {
        headers: {
          'Client-Id': config.clientId,
          Authorization: `Bearer ${config.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Twitch API error: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      if (!data.data || data.data.length === 0) {
        throw new Error(`User not found: ${username}`);
      }

      return data.data[0].id;
    } catch (error) {
      this.logger.error('Error getting Twitch user ID', error);
      throw error;
    }
  }

  /**
   * Handle incoming IRC message
   */
  private handleIrcMessage(message: string): void {
    // Respond to PING to keep connection alive
    if (message.startsWith('PING')) {
      this.ws?.send('PONG :tmi.twitch.tv');
      return;
    }

    // Parse PRIVMSG (chat message)
    if (message.includes('PRIVMSG')) {
      const chatMessage = this.parsePrivMsg(message);
      if (chatMessage) {
        this.messageHandlers.forEach((handler) => handler(chatMessage));
      }
    }
  }

  /**
   * Parse PRIVMSG into TwitchChatMessage
   */
  private parsePrivMsg(message: string): TwitchChatMessage | null {
    try {
      // Extract tags
      const tagsMatch = message.match(/^@([^ ]+)/);
      const tags: Record<string, string> = {};

      if (tagsMatch) {
        tagsMatch[1].split(';').forEach((tag) => {
          const [key, value] = tag.split('=');
          tags[key] = value || '';
        });
      }

      // Extract username and message text
      const userMatch = message.match(/:(\w+)!\w+@\w+\.tmi\.twitch\.tv/);
      const textMatch = message.match(/PRIVMSG #\w+ :(.+)$/);

      if (!userMatch || !textMatch) {
        return null;
      }

      return {
        id: tags['id'] || Date.now().toString(),
        username: userMatch[1],
        displayName: tags['display-name'] || userMatch[1],
        userId: tags['user-id'] || '',
        messageText: textMatch[1],
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error('Error parsing PRIVMSG', error);
      return null;
    }
  }

  /**
   * Attempt to reconnect to Twitch IRC
   */
  private attemptReconnect(config: TwitchConfig): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.logger.error('Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

    this.logger.log(
      `Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
    );

    setTimeout(() => {
      this.connect(config);
    }, delay);
  }

  /**
   * Check whisper daily limit and reset if needed
   */
  private checkWhisperLimit(): void {
    const now = new Date();
    const hoursSinceReset =
      (now.getTime() - this.lastWhisperReset.getTime()) / (1000 * 60 * 60);

    // Reset counter every 24 hours
    if (hoursSinceReset >= 24) {
      this.whispersSentToday = 0;
      this.lastWhisperReset = now;
      this.logger.log('Whisper limit reset');
    }

    if (this.whispersSentToday >= this.whisperDailyLimit) {
      throw new Error(
        `Daily whisper limit reached (${this.whisperDailyLimit})`,
      );
    }
  }
}
