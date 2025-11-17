# Marketing AI Agent Module

An AI-powered marketing automation system for the Twenty CRM that helps automate customer discovery, content creation, and outreach campaigns.

## Overview

The Marketing AI Agent module provides autonomous marketing capabilities including:

- **Trending Topics Discovery**: AI-powered web scraping to identify trending topics relevant to your industry
- **Lead Discovery**: Automated prospect identification based on target audience criteria
- **Marketing Plan Generation**: AI-generated comprehensive marketing strategies
- **Outreach Automation**: Personalized message generation and autonomous social media DMs
- **CRM Integration**: Deep integration with Twenty CRM data for context-aware marketing

## Features

### 1. Marketing Campaigns (`MarketingCampaign`)

Create and manage AI-powered marketing campaigns with:
- Campaign objectives and target audience
- AI-generated marketing plans
- Performance tracking
- Budget management
- Timeline and milestone tracking

### 2. Trending Topics (`TrendingTopic`)

Discover trending topics for content creation:
- AI-powered topic discovery
- Relevance scoring
- Category tagging
- Source tracking
- Related keywords extraction

### 3. Prospect Leads (`ProspectLead`)

Automated lead discovery and qualification:
- AI-powered lead discovery from web sources
- Automated lead scoring (0-100)
- AI-generated prospect profiles
- Social media handle tracking
- CRM integration (link to Person/Company)

### 4. Outreach Messages (`OutreachMessage`)

Personalized, multi-platform outreach:
- AI-generated personalized messages
- Multi-platform support (Email, Twitter, LinkedIn, Instagram, Facebook)
- Delivery tracking and engagement metrics
- Automated follow-ups
- A/B testing support

## Architecture

```
marketing-ai-agent/
├── standard-objects/         # Workspace entities (data models)
│   ├── marketing-campaign.workspace-entity.ts
│   ├── trending-topic.workspace-entity.ts
│   ├── prospect-lead.workspace-entity.ts
│   └── outreach-message.workspace-entity.ts
├── services/                 # Business logic services
│   ├── marketing-ai-agent.service.ts      # Core AI functionality
│   ├── crm-insights.service.ts            # CRM data analysis
│   ├── web-scraping.service.ts            # Web scraping/discovery
│   └── social-media-outreach.service.ts   # Multi-platform messaging
├── jobs/                     # Background automation jobs
│   ├── trending-topics-scraper.job.ts
│   ├── lead-discovery.job.ts
│   └── outreach-automation.job.ts
├── resolvers/                # GraphQL API
│   └── marketing-campaign.resolver.ts
└── marketing-ai-agent.module.ts
```

## Usage

### GraphQL API

#### 1. Generate Marketing Plan

```graphql
query GenerateMarketingPlan($campaignId: String!, $trendingTopicIds: [String!]!) {
  generateMarketingPlan(
    campaignId: $campaignId
    trendingTopicIds: $trendingTopicIds
  )
}
```

**Example Variables:**
```json
{
  "campaignId": "campaign-uuid",
  "trendingTopicIds": ["topic-uuid-1", "topic-uuid-2"]
}
```

#### 2. Score Prospect Lead

```graphql
mutation ScoreProspectLead($leadId: String!) {
  scoreProspectLead(leadId: $leadId)
}
```

#### 3. Generate Outreach Message

```graphql
mutation GenerateOutreachMessage(
  $leadId: String!
  $platform: String!
) {
  generateOutreachMessage(
    leadId: $leadId
    platform: $platform  # "email", "twitter", "linkedin", "instagram", "facebook"
  )
}
```

#### 4. Start Trending Topics Scraper

```graphql
mutation StartTrendingTopicsScraper(
  $category: String
  $keywords: [String!]
) {
  startTrendingTopicsScraper(
    category: $category
    keywords: $keywords
  )
}
```

**Example Variables:**
```json
{
  "category": "marketing",
  "keywords": ["content marketing", "social media", "SEO"]
}
```

#### 5. Start Lead Discovery

```graphql
mutation StartLeadDiscovery(
  $campaignId: String!
  $targetAudience: String
  $industry: String
  $maxLeads: Int
) {
  startLeadDiscovery(
    campaignId: $campaignId
    targetAudience: $targetAudience
    industry: $industry
    maxLeads: $maxLeads
  )
}
```

**Example Variables:**
```json
{
  "campaignId": "campaign-uuid",
  "targetAudience": "B2B SaaS founders",
  "industry": "Technology",
  "maxLeads": 50
}
```

#### 6. Start Outreach Automation

```graphql
mutation StartOutreachAutomation(
  $campaignId: String!
  $platform: String
  $maxMessagesToSend: Int
) {
  startOutreachAutomation(
    campaignId: $campaignId
    platform: $platform
    maxMessagesToSend: $maxMessagesToSend
  )
}
```

#### 7. Activate Campaign

```graphql
mutation ActivateCampaign($campaignId: String!) {
  activateCampaign(campaignId: $campaignId)
}
```

This automatically:
- Sets campaign status to "active"
- Starts lead discovery job
- Starts outreach automation job

## Workflow Example

### Complete Marketing Campaign Workflow

1. **Create Campaign** (via standard CRM UI)
   ```
   - Name: "Q1 2024 Content Marketing Campaign"
   - Description: "Target SaaS founders with content marketing services"
   - Target Audience: "B2B SaaS founders, 10-100 employees"
   - Budget: $10,000
   ```

2. **Discover Trending Topics**
   ```graphql
   mutation {
     startTrendingTopicsScraper(
       category: "marketing"
       keywords: ["SaaS", "content marketing", "growth"]
     )
   }
   ```

3. **Generate Marketing Plan**
   ```graphql
   query {
     generateMarketingPlan(
       campaignId: "campaign-uuid"
       trendingTopicIds: ["topic-1", "topic-2", "topic-3"]
     )
   }
   ```

4. **Discover Leads**
   ```graphql
   mutation {
     startLeadDiscovery(
       campaignId: "campaign-uuid"
       targetAudience: "B2B SaaS founders"
       industry: "Technology"
       maxLeads: 100
     )
   }
   ```

5. **Activate Automated Outreach**
   ```graphql
   mutation {
     activateCampaign(campaignId: "campaign-uuid")
   }
   ```

6. **Monitor Results** (via standard CRM UI)
   - View discovered leads
   - Check lead scores
   - Monitor outreach message status
   - Track engagement (opens, clicks, replies)

## Services

### MarketingAiAgentService

Core service providing AI-powered marketing functionality:

- `generateMarketingPlan()`: Create comprehensive marketing strategies
- `generateOutreachMessage()`: Generate personalized messages
- `scoreProspectLead()`: Calculate lead quality scores

### CrmInsightsService

Analyzes CRM data to provide context for AI decisions:

- `getWorkspaceInsights()`: Overall workspace metrics
- `getPersonInsights()`: Individual contact analysis
- `getCompanyInsights()`: Company-level analytics

### WebScrapingService

Discovers trending topics and potential customers:

- `discoverTrendingTopics()`: Find trending topics by category/keywords
- `discoverProspectLeads()`: Identify potential customers
- `analyzeUrl()`: Extract insights from URLs

**Note**: Current implementation uses AI simulation. Production deployment should integrate with:
- Google Trends API
- Twitter/X API
- Reddit API
- LinkedIn Sales Navigator
- Lead generation tools (Clearbit, Hunter.io)

### SocialMediaOutreachService

Multi-platform message delivery:

- `sendMessage()`: Send to specified platform
- `scheduleMessage()`: Schedule for future delivery
- `sendBatchMessages()`: Bulk message sending
- `trackEngagement()`: Monitor opens, clicks, replies

**Supported Platforms**:
- Email (ready for integration with SendGrid/AWS SES)
- Twitter/X DMs
- LinkedIn Messages
- Instagram DMs
- Facebook Messages

**Note**: Current implementation simulates message sending. Production deployment requires:
- OAuth integrations for each platform
- API credentials and rate limit handling
- Webhook setup for engagement tracking

## Background Jobs

### TrendingTopicsScraperJob

**Schedule**: Can be run on-demand or scheduled (e.g., daily)

**Purpose**: Discovers trending topics for all active campaigns

**Configuration**:
```typescript
await trendingTopicsScraperJob.scheduleForWorkspace(
  workspaceId,
  'marketing',  // category
  ['keyword1', 'keyword2']  // keywords
);
```

### LeadDiscoveryJob

**Schedule**: On-demand or triggered by campaign activation

**Purpose**: Discovers and scores potential customers for campaigns

**Configuration**:
```typescript
await leadDiscoveryJob.scheduleForCampaign(
  workspaceId,
  campaignId,
  'B2B SaaS founders',  // targetAudience
  'Technology',  // industry
  50  // maxLeads
);
```

### OutreachAutomationJob

**Schedule**: On-demand or triggered by campaign activation

**Purpose**: Generates and sends personalized outreach messages

**Configuration**:
```typescript
await outreachAutomationJob.scheduleForCampaign(
  workspaceId,
  campaignId,
  'email',  // platform (optional)
  50,  // maxMessagesToSend
  true  // generateMessages
);
```

## Integration Points

### With Existing Twenty CRM

- **Person**: Links discovered leads to existing contacts
- **Company**: Associates leads with companies in CRM
- **Opportunity**: Can auto-create opportunities from qualified leads
- **Timeline**: Tracks all marketing activities
- **AI Agent**: Uses existing AI infrastructure for LLM calls

### With External Services (Production Setup Required)

1. **Social Media APIs**:
   - Twitter/X API for DMs and trend discovery
   - LinkedIn API for B2B outreach
   - Instagram Graph API for DMs
   - Facebook Messenger API

2. **Lead Generation**:
   - LinkedIn Sales Navigator
   - Clearbit/Hunter.io for email discovery
   - Company databases (Crunchbase, etc.)

3. **Email Delivery**:
   - SendGrid
   - AWS SES
   - Mailgun

4. **Trend Analysis**:
   - Google Trends API
   - Reddit API
   - News aggregator APIs

## AI Billing

All AI operations are automatically tracked and billed through Twenty's existing AI billing system:

- Marketing plan generation
- Lead scoring
- Message personalization
- Topic analysis

## Security & Privacy

- All operations are workspace-scoped (multi-tenant)
- User consent required for social media integrations
- Respects platform rate limits and terms of service
- No storage of social media credentials (use OAuth tokens)
- GDPR/privacy-compliant lead data handling

## Future Enhancements

1. **A/B Testing**: Test different message variations
2. **Advanced Scheduling**: Smart send time optimization
3. **Reply Detection**: Automated response handling
4. **Lead Enrichment**: Integrate with data enrichment services
5. **Performance Analytics**: Advanced campaign ROI tracking
6. **Multi-language**: Support for international campaigns
7. **Custom AI Models**: Fine-tuned models per workspace
8. **Integration Marketplace**: Pre-built integrations with marketing tools

## Development

### Running Tests

```bash
npx nx test twenty-server --testPathPattern=marketing-ai-agent
```

### Building

```bash
npx nx build twenty-server
```

### Debugging

Enable debug logging:
```typescript
// In your .env
LOG_LEVEL=debug
```

## Support

For issues or feature requests:
- GitHub Issues: https://github.com/twentyhq/twenty/issues
- Documentation: https://docs.twenty.com

## License

AGPL-3.0 License - see LICENSE file for details
