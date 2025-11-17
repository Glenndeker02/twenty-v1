import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AgentEntity } from 'src/engine/metadata-modules/agent/agent.entity';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { AiCoreModule } from 'src/engine/core-modules/ai/ai-core.module';
import { MessageQueueModule } from 'src/engine/core-modules/message-queue/message-queue.module';
import { TwentyORMModule } from 'src/engine/twenty-orm/twenty-orm.module';

// Services
import { MarketingAiAgentService } from 'src/modules/marketing-ai-agent/services/marketing-ai-agent.service';
import { CrmInsightsService } from 'src/modules/marketing-ai-agent/services/crm-insights.service';
import { WebScrapingService } from 'src/modules/marketing-ai-agent/services/web-scraping.service';
import { SocialMediaOutreachService } from 'src/modules/marketing-ai-agent/services/social-media-outreach.service';

// Jobs
import { TrendingTopicsScraperJob } from 'src/modules/marketing-ai-agent/jobs/trending-topics-scraper.job';
import { LeadDiscoveryJob } from 'src/modules/marketing-ai-agent/jobs/lead-discovery.job';
import { OutreachAutomationJob } from 'src/modules/marketing-ai-agent/jobs/outreach-automation.job';

// Resolvers
import { MarketingCampaignResolver } from 'src/modules/marketing-ai-agent/resolvers/marketing-campaign.resolver';

// Workspace Entities (these are managed by TwentyORM, not TypeORM)
// They are registered in the workspace sync metadata system
import { MarketingCampaignWorkspaceEntity } from 'src/modules/marketing-ai-agent/standard-objects/marketing-campaign.workspace-entity';
import { TrendingTopicWorkspaceEntity } from 'src/modules/marketing-ai-agent/standard-objects/trending-topic.workspace-entity';
import { ProspectLeadWorkspaceEntity } from 'src/modules/marketing-ai-agent/standard-objects/prospect-lead.workspace-entity';
import { OutreachMessageWorkspaceEntity } from 'src/modules/marketing-ai-agent/standard-objects/outreach-message.workspace-entity';

@Module({
  imports: [
    // Import core modules
    AiCoreModule,
    MessageQueueModule,
    TwentyORMModule.register([
      MarketingCampaignWorkspaceEntity,
      TrendingTopicWorkspaceEntity,
      ProspectLeadWorkspaceEntity,
      OutreachMessageWorkspaceEntity,
    ]),
    // Import TypeORM entities (non-workspace entities)
    TypeOrmModule.forFeature([AgentEntity, WorkspaceEntity]),
  ],
  providers: [
    // Services
    MarketingAiAgentService,
    CrmInsightsService,
    WebScrapingService,
    SocialMediaOutreachService,

    // Jobs
    TrendingTopicsScraperJob,
    LeadDiscoveryJob,
    OutreachAutomationJob,

    // Resolvers
    MarketingCampaignResolver,
  ],
  exports: [
    // Export services so they can be used by other modules
    MarketingAiAgentService,
    CrmInsightsService,
    WebScrapingService,
    SocialMediaOutreachService,

    // Export jobs so they can be scheduled from other modules
    TrendingTopicsScraperJob,
    LeadDiscoveryJob,
    OutreachAutomationJob,
  ],
})
export class MarketingAiAgentModule {}
