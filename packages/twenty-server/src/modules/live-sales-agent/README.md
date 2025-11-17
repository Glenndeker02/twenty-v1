# Live Sales Agent Module

AI-powered sales assistant for content creators selling products during live streaming sessions.

## Overview

The Live Sales Agent helps content creators:
- Monitor chat across YouTube, Twitch, and TikTok live streams
- Detect purchase intent and product inquiries using Claude AI
- Automatically respond to viewer questions with product info
- Capture qualified leads in CRM
- Enforce rate limits to prevent spam

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│           Live Streaming Platforms                      │
│     (YouTube / Twitch / TikTok)                         │
└───────────────┬─────────────────────────────────────────┘
                │ Chat Messages
                ↓
┌─────────────────────────────────────────────────────────┐
│      Platform Services                                  │
│  - YouTubeLiveChatService                               │
│  - TwitchChatService                                    │
│  - TikTokLiveService                                    │
└───────────────┬─────────────────────────────────────────┘
                │
                ↓
┌─────────────────────────────────────────────────────────┐
│   LiveSalesAgentOrchestratorService                     │
│   (Main Coordinator)                                    │
└───────┬──────────────────────┬──────────────────────────┘
        │                      │
        ↓                      ↓
┌──────────────┐      ┌────────────────────┐
│ ClaudeAI     │      │ RateLimiter        │
│ Service      │      │ Service            │
│              │      │                    │
│ - Intent     │      │ - User limits      │
│ - Responses  │      │ - Session limits   │
│ - Scoring    │      │ - Platform quotas  │
└──────────────┘      └────────────────────┘
        │
        ↓
┌─────────────────────────────────────────────────────────┐
│               Twenty CRM                                │
│  - LiveSessionInteraction                               │
│  - LiveSessionLead                                      │
│  - Person (Contact)                                     │
└─────────────────────────────────────────────────────────┘
```

## Services

### LiveSalesAgentOrchestratorService

Main service that coordinates everything. Use this to start/stop sessions and process messages.

**Methods:**
- `startSession(config)` - Start monitoring a live session
- `stopSession(sessionId)` - Stop monitoring
- `processMessage(config, username, message)` - Process a chat message
- `sendManualResponse(config, username, message)` - Send creator-initiated response
- `getSessionStats(sessionId)` - Get session statistics

### YouTubeLiveChatService

YouTube Live Chat API integration.

**Methods:**
- `fetchMessages(config)` - Poll for new chat messages
- `postMessage(config, text)` - Post message to chat
- `getLiveChatId(videoId, apiKey)` - Get live chat ID from video

**API Limits:**
- 10,000 quota units per day
- List messages: 5 units
- Post message: 50 units

### TwitchChatService

Twitch IRC and Whispers API integration.

**Methods:**
- `connect(config)` - Connect to Twitch IRC
- `disconnect()` - Disconnect
- `onMessage(handler)` - Register message handler
- `sendMessage(channel, text)` - Send public chat message
- `sendWhisper(config, text)` - Send DM (whisper)
- `getUserId(username, config)` - Get user ID from username

**API Limits:**
- **40 whispers per day (HARD LIMIT)**
- No rate limits on public chat messages

### TikTokLiveService

TikTok Live Events API integration.

**Methods:**
- `fetchComments(config)` - Poll for comments
- `sendDirectMessage(config, userId, text)` - Send DM
- `registerWebhook(config, webhookUrl)` - Register webhook for real-time events
- `processWebhookPayload(payload)` - Process incoming webhook
- `getLiveStatus(config)` - Get live stream status

**API Limits:**
- Requires TikTok Business account
- DM requires user to follow account
- 24-hour messaging window

### ClaudeAiService

Claude AI integration for NLP and response generation.

**Methods:**
- `detectIntent(message, products, config)` - Detect intent from message
- `generateResponse(message, intent, product, config)` - Generate response
- `calculateLeadScore(messages, config)` - Calculate lead quality score
- `matchProduct(message, products, config)` - Match message to product

**Intent Types:**
- `PRODUCT_INQUIRY` - Questions about product details, price, features
- `PURCHASE_INTENT` - Expressing desire to buy
- `GENERAL_QUESTION` - Unrelated questions
- `COMPLAINT` - Dissatisfaction
- `PRAISE` - Positive feedback
- `OTHER` - Everything else

### RateLimiterService

Prevents spam and enforces platform limits.

**Methods:**
- `checkUserLimit(sessionId, username, config)` - Check if user can receive response
- `checkSessionLimit(sessionId, config)` - Check session response limit
- `checkTwitchWhisperLimit(config)` - Check Twitch whisper availability
- `checkYouTubeQuota(units, config)` - Check YouTube quota
- `recordUserResponse(sessionId, username)` - Record response sent
- `resetSession(sessionId)` - Reset limits for session

**Default Limits:**
- Max 3 responses per user per session
- Max 100 responses per session
- Min 30 seconds between responses to same user
- 40 Twitch whispers per day
- 10,000 YouTube quota per day

## Usage Example

### Start a YouTube Live Session

```typescript
import { LiveSalesAgentOrchestratorService } from './services/live-sales-agent-orchestrator.service';

// Inject service
constructor(
  private readonly orchestrator: LiveSalesAgentOrchestratorService,
) {}

// Configure session
const config = {
  liveSessionId: 'session-123',
  platform: 'YOUTUBE',
  agentEnabled: true,
  products: [
    {
      id: 'prod-1',
      name: 'Blue Hoodie',
      description: 'Ocean blue pullover hoodie',
      price: {
        amountMicros: 49990000, // $49.99
        currencyCode: 'USD',
      },
      purchaseLink: 'https://store.example.com/blue-hoodie',
    },
  ],
  youtubeConfig: {
    apiKey: process.env.YOUTUBE_API_KEY,
    liveChatId: 'xyz123abc',
  },
  claudeApiKey: process.env.CLAUDE_API_KEY,
};

// Start monitoring
await orchestrator.startSession(config);

// Session will now:
// 1. Poll YouTube Live Chat every 5 seconds
// 2. Detect intent using Claude AI
// 3. Auto-respond to product inquiries
// 4. Save interactions to CRM

// Stop when stream ends
await orchestrator.stopSession('session-123');
```

### Start a Twitch Session

```typescript
const config = {
  liveSessionId: 'session-456',
  platform: 'TWITCH',
  agentEnabled: true,
  products: [...],
  twitchConfig: {
    accessToken: process.env.TWITCH_ACCESS_TOKEN,
    channelName: 'mychannel',
    botUsername: 'mybot',
    clientId: process.env.TWITCH_CLIENT_ID,
  },
  claudeApiKey: process.env.CLAUDE_API_KEY,
};

await orchestrator.startSession(config);
```

### Manual Response (Creator-Initiated)

```typescript
await orchestrator.sendManualResponse(
  config,
  'viewer_username',
  'Thanks for asking! The hoodie comes in sizes S-XXL.',
);
```

### Get Session Stats

```typescript
const stats = orchestrator.getSessionStats('session-123');
console.log(stats);
// {
//   isActive: true,
//   remainingResponses: 87,
//   rateLimitStats: {
//     twitchWhispersUsed: 15,
//     youtubeQuotaUsed: 2450,
//     activeUserLimits: 23,
//     activeSessions: 1,
//   }
// }
```

## Environment Variables

Add to `.env`:

```bash
# YouTube API
YOUTUBE_API_KEY=your_youtube_api_key

# Twitch API
TWITCH_CLIENT_ID=your_twitch_client_id
TWITCH_ACCESS_TOKEN=your_twitch_access_token

# TikTok API
TIKTOK_APP_ID=your_tiktok_app_id
TIKTOK_ACCESS_TOKEN=your_tiktok_access_token

# Claude AI
CLAUDE_API_KEY=your_claude_api_key
```

## Platform Setup

### YouTube

1. Create project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable YouTube Data API v3
3. Create API key
4. Get live chat ID from video URL or API

### Twitch

1. Register app at [Twitch Developers](https://dev.twitch.tv/console/apps)
2. Get Client ID
3. Generate OAuth token with scopes:
   - `chat:read`
   - `chat:edit`
   - `whispers:read`
   - `whispers:edit`
   - `user:read:email`

### TikTok

1. Apply for [TikTok for Business](https://developers.tiktok.com/)
2. Create app and get credentials
3. Request Live Events API access (requires approval)
4. Configure webhook URL for real-time events

### Claude AI

1. Sign up at [Anthropic Console](https://console.anthropic.com/)
2. Generate API key
3. Choose model (default: `claude-3-5-sonnet-20241022`)

## Rate Limits & Best Practices

### YouTube
- **Quota**: 10,000 units/day
- **List messages**: 5 units per call
- **Post message**: 50 units per call
- **Best Practice**: Use recommended polling interval from API response

### Twitch
- **Whispers**: 40 per day (HARD LIMIT)
- **Public chat**: No rate limit
- **Best Practice**: Reserve whispers for hot leads only

### TikTok
- **DMs**: Requires user follow + 24hr window
- **Webhooks**: More reliable than polling
- **Best Practice**: Use webhooks for real-time events

### AI Agent
- **Max 3 responses per user** - Prevents spam
- **30s delay** between responses to same user
- **Max 100 responses per session** - Prevents bot-like behavior
- **Auto-respond only to high-confidence** (≥70%) product inquiries

## Lead Scoring

Leads are scored 0-100 based on:

| Score | Status | Criteria |
|-------|--------|----------|
| 0-25  | Cold   | Minimal engagement, no purchase signals |
| 26-50 | Warm   | Engaged but no clear purchase intent |
| 51-75 | Hot    | Strong interest, asking about purchase details |
| 76-100| Very Hot | Ready to buy, asking how to purchase |

Factors:
- **Purchase intent signals** (40 points): "buy", "how much", "link", "purchase"
- **Engagement level** (30 points): Multiple messages, detailed questions
- **Specificity** (20 points): Asking about specific product features
- **Positive sentiment** (10 points): Enthusiastic tone

## Troubleshooting

### "YouTube API quota exceeded"
- Check usage with `rateLimiter.getStats()`
- Reduce polling frequency
- Wait for quota to reset (24 hours)

### "Twitch whisper limit reached"
- You hit the 40/day limit
- Use public chat instead
- Prioritize highest-scored leads for whispers

### "Claude API error"
- Check API key is valid
- Verify account has credits
- Check rate limits on Anthropic dashboard

### "No messages detected"
- Verify live chat ID is correct (YouTube)
- Check OAuth scopes are correct (Twitch)
- Ensure stream is actually live

## Next Steps

1. **Connect to Twenty CRM**: Save interactions and leads to database
2. **Build Dashboard UI**: Real-time view of sessions and leads
3. **Post-Session Automation**: Email campaigns for leads
4. **Analytics**: Track conversion rates and ROI
5. **Multi-Session Support**: Monitor multiple streams simultaneously

## License

Part of Twenty CRM - Open Source CRM
