import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Injectable, UseGuards } from '@nestjs/common';

import { Workspace } from 'src/engine/core-modules/workspace/workspace.entity';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { JwtAuthGuard } from 'src/engine/guards/jwt.auth.guard';
import { TwentyORMGlobalManager } from 'src/engine/twenty-orm/twenty-orm.manager';
import { MarketingCampaignWorkspaceEntity } from 'src/modules/marketing-ai-agent/standard-objects/marketing-campaign.workspace-entity';
import { MarketingAiAgentService } from 'src/modules/marketing-ai-agent/services/marketing-ai-agent.service';
import { TrendingTopicsScraperJob } from 'src/modules/marketing-ai-agent/jobs/trending-topics-scraper.job';
import { LeadDiscoveryJob } from 'src/modules/marketing-ai-agent/jobs/lead-discovery.job';
import { OutreachAutomationJob } from 'src/modules/marketing-ai-agent/jobs/outreach-automation.job';

@Injectable()
@Resolver()
export class MarketingCampaignResolver {
  constructor(
    private readonly twentyORMGlobalManager: TwentyORMGlobalManager,
    private readonly marketingAiAgentService: MarketingAiAgentService,
    private readonly trendingTopicsScraperJob: TrendingTopicsScraperJob,
    private readonly leadDiscoveryJob: LeadDiscoveryJob,
    private readonly outreachAutomationJob: OutreachAutomationJob,
  ) {}

  @Query(() => String)
  @UseGuards(JwtAuthGuard)
  async generateMarketingPlan(
    @AuthWorkspace() workspace: Workspace,
    @Args('campaignId') campaignId: string,
    @Args('trendingTopicIds', { type: () => [String] })
    trendingTopicIds: string[],
  ): Promise<string> {
    const plan = await this.marketingAiAgentService.generateMarketingPlan(
      workspace.id,
      campaignId,
      trendingTopicIds,
    );

    return JSON.stringify(plan);
  }

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard)
  async scoreProspectLead(
    @AuthWorkspace() workspace: Workspace,
    @Args('leadId') leadId: string,
  ): Promise<string> {
    const result = await this.marketingAiAgentService.scoreProspectLead(
      workspace.id,
      leadId,
    );

    return JSON.stringify(result);
  }

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard)
  async generateOutreachMessage(
    @AuthWorkspace() workspace: Workspace,
    @Args('leadId') leadId: string,
    @Args('platform') platform: string,
  ): Promise<string> {
    const validPlatform = platform as
      | 'email'
      | 'twitter'
      | 'linkedin'
      | 'instagram'
      | 'facebook';

    const message =
      await this.marketingAiAgentService.generateOutreachMessage(
        workspace.id,
        leadId,
        validPlatform,
      );

    return JSON.stringify(message);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async startTrendingTopicsScraper(
    @AuthWorkspace() workspace: Workspace,
    @Args('category', { nullable: true }) category?: string,
    @Args('keywords', { type: () => [String], nullable: true })
    keywords?: string[],
  ): Promise<boolean> {
    await this.trendingTopicsScraperJob.scheduleForWorkspace(
      workspace.id,
      category,
      keywords,
    );

    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async startLeadDiscovery(
    @AuthWorkspace() workspace: Workspace,
    @Args('campaignId') campaignId: string,
    @Args('targetAudience', { nullable: true }) targetAudience?: string,
    @Args('industry', { nullable: true }) industry?: string,
    @Args('maxLeads', { nullable: true }) maxLeads?: number,
  ): Promise<boolean> {
    await this.leadDiscoveryJob.scheduleForCampaign(
      workspace.id,
      campaignId,
      targetAudience,
      industry,
      maxLeads,
    );

    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async startOutreachAutomation(
    @AuthWorkspace() workspace: Workspace,
    @Args('campaignId') campaignId: string,
    @Args('platform', { nullable: true }) platform?: string,
    @Args('maxMessagesToSend', { nullable: true }) maxMessagesToSend?: number,
  ): Promise<boolean> {
    const validPlatform = platform
      ? (platform as
          | 'email'
          | 'twitter'
          | 'linkedin'
          | 'instagram'
          | 'facebook')
      : undefined;

    await this.outreachAutomationJob.scheduleForCampaign(
      workspace.id,
      campaignId,
      validPlatform,
      maxMessagesToSend,
      true, // generateMessages
    );

    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async activateCampaign(
    @AuthWorkspace() workspace: Workspace,
    @Args('campaignId') campaignId: string,
  ): Promise<boolean> {
    const campaignRepository =
      await this.twentyORMGlobalManager.getRepositoryForWorkspace<MarketingCampaignWorkspaceEntity>(
        workspace.id,
        'marketingCampaign',
      );

    await campaignRepository.update(campaignId, {
      status: 'active',
    });

    // Start all automation jobs for this campaign
    await this.leadDiscoveryJob.scheduleForCampaign(workspace.id, campaignId);

    await this.outreachAutomationJob.scheduleForCampaign(
      workspace.id,
      campaignId,
    );

    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async pauseCampaign(
    @AuthWorkspace() workspace: Workspace,
    @Args('campaignId') campaignId: string,
  ): Promise<boolean> {
    const campaignRepository =
      await this.twentyORMGlobalManager.getRepositoryForWorkspace<MarketingCampaignWorkspaceEntity>(
        workspace.id,
        'marketingCampaign',
      );

    await campaignRepository.update(campaignId, {
      status: 'paused',
    });

    return true;
  }
}
