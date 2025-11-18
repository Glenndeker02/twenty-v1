import { Module } from '@nestjs/common';
import { YouTubeLiveChatService } from './services/youtube-live-chat.service';
import { TwitchChatService } from './services/twitch-chat.service';
import { TikTokLiveService } from './services/tiktok-live.service';
import { ClaudeAiService } from './services/claude-ai.service';
import { RateLimiterService } from './services/rate-limiter.service';
import { LiveSalesAgentOrchestratorService } from './services/live-sales-agent-orchestrator.service';

/**
 * Live Sales Agent Module
 *
 * This module provides AI-powered sales assistance for content creators
 * during live streaming sessions across multiple platforms.
 *
 * Features:
 * - Real-time chat monitoring (YouTube, Twitch, TikTok)
 * - AI-powered intent detection and lead qualification
 * - Automated response generation with rate limiting
 * - Lead capture and CRM integration
 *
 * Services:
 * - YouTubeLiveChatService: YouTube Live Chat API integration
 * - TwitchChatService: Twitch IRC and Whispers API integration
 * - TikTokLiveService: TikTok Live Events API integration
 * - ClaudeAiService: Claude AI for NLP and response generation
 * - RateLimiterService: Rate limiting and spam prevention
 * - LiveSalesAgentOrchestratorService: Main coordinator service
 */
@Module({
  providers: [
    YouTubeLiveChatService,
    TwitchChatService,
    TikTokLiveService,
    ClaudeAiService,
    RateLimiterService,
    LiveSalesAgentOrchestratorService,
  ],
  exports: [
    YouTubeLiveChatService,
    TwitchChatService,
    TikTokLiveService,
    ClaudeAiService,
    RateLimiterService,
    LiveSalesAgentOrchestratorService,
  ],
})
export class LiveSalesAgentModule {}
