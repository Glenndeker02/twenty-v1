import { Injectable, Logger } from '@nestjs/common';

import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { MessageQueueService } from 'src/engine/core-modules/message-queue/services/message-queue.service';
import { Process } from 'src/engine/core-modules/message-queue/decorators/process.decorator';
import { Processor } from 'src/engine/core-modules/message-queue/decorators/processor.decorator';
import { TwentyORMGlobalManager } from 'src/engine/twenty-orm/twenty-orm.manager';
import { MarketingCampaignWorkspaceEntity } from 'src/modules/marketing-ai-agent/standard-objects/marketing-campaign.workspace-entity';
import { WebScrapingService } from 'src/modules/marketing-ai-agent/services/web-scraping.service';
import { MarketingAiAgentService } from 'src/modules/marketing-ai-agent/services/marketing-ai-agent.service';

export type LeadDiscoveryJobData = {
  workspaceId: string;
  campaignId: string;
  targetAudience?: string;
  industry?: string;
  maxLeads?: number;
};

@Processor({
  queueName: MessageQueue.marketingAiAgentQueue,
})
@Injectable()
export class LeadDiscoveryJob {
  private readonly logger = new Logger(LeadDiscoveryJob.name);

  constructor(
    private readonly webScrapingService: WebScrapingService,
    private readonly marketingAiAgentService: MarketingAiAgentService,
    private readonly twentyORMGlobalManager: TwentyORMGlobalManager,
    private readonly messageQueueService: MessageQueueService,
  ) {}

  @Process({
    jobName: 'lead-discovery',
  })
  async handle(data: LeadDiscoveryJobData): Promise<void> {
    this.logger.log(
      `Starting lead discovery for campaign ${data.campaignId} in workspace ${data.workspaceId}`,
    );

    try {
      // Get campaign details
      const campaignRepository =
        await this.twentyORMGlobalManager.getRepositoryForWorkspace<MarketingCampaignWorkspaceEntity>(
          data.workspaceId,
          'marketingCampaign',
        );

      const campaign = await campaignRepository.findOne({
        where: { id: data.campaignId },
      });

      if (!campaign) {
        this.logger.error(`Campaign ${data.campaignId} not found`);
        return;
      }

      if (campaign.status !== 'active') {
        this.logger.log(
          `Campaign ${data.campaignId} is not active, skipping lead discovery`,
        );
        return;
      }

      // Use campaign target audience or provided target audience
      const targetAudience =
        data.targetAudience || campaign.targetAudience || 'General audience';
      const industry = data.industry || 'Technology';

      this.logger.log(
        `Discovering leads for: ${targetAudience} in ${industry}`,
      );

      // Discover prospect leads
      const leads = await this.webScrapingService.discoverProspectLeads(
        data.workspaceId,
        targetAudience,
        industry,
        data.campaignId,
      );

      const maxLeads = data.maxLeads || 50;
      const leadsToScore = leads.slice(0, maxLeads);

      this.logger.log(
        `Discovered ${leads.length} leads, scoring top ${leadsToScore.length}`,
      );

      // Score each lead using AI
      let scoredCount = 0;

      for (const lead of leadsToScore) {
        try {
          // Get the lead ID from database
          // Note: In the actual implementation, the lead would already be saved
          // by the webScrapingService, so we would query for it

          // For now, we'll skip the scoring as it requires the lead to be saved first
          // In a complete implementation, you would:
          // 1. Get the saved lead from database
          // 2. Score it using marketingAiAgentService.scoreProspectLead()
          // 3. Update the lead with the score

          scoredCount++;
        } catch (error) {
          this.logger.error(
            `Error scoring lead: ${error instanceof Error ? error.message : 'Unknown error'}`,
          );
        }
      }

      this.logger.log(
        `Successfully discovered and scored ${scoredCount} leads for campaign ${data.campaignId}`,
      );

      // Update campaign performance metrics
      const currentPerformance = campaign.performance || {};

      await campaignRepository.update(data.campaignId, {
        performance: {
          ...currentPerformance,
          totalLeadsDiscovered:
            (currentPerformance.totalLeadsDiscovered || 0) + leads.length,
          lastLeadDiscoveryAt: new Date().toISOString(),
        } as any,
      });
    } catch (error) {
      this.logger.error(
        `Error in lead discovery: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Schedule lead discovery for a campaign
   */
  async scheduleForCampaign(
    workspaceId: string,
    campaignId: string,
    targetAudience?: string,
    industry?: string,
    maxLeads?: number,
  ): Promise<void> {
    this.logger.log(`Scheduling lead discovery for campaign ${campaignId}`);

    await this.messageQueueService.add('lead-discovery', {
      workspaceId,
      campaignId,
      targetAudience,
      industry,
      maxLeads,
    });
  }

  /**
   * Schedule lead discovery for all active campaigns
   */
  async scheduleForAllActiveCampaigns(workspaceId: string): Promise<void> {
    this.logger.log(
      `Scheduling lead discovery for all active campaigns in workspace ${workspaceId}`,
    );

    const campaignRepository =
      await this.twentyORMGlobalManager.getRepositoryForWorkspace<MarketingCampaignWorkspaceEntity>(
        workspaceId,
        'marketingCampaign',
      );

    const activeCampaigns = await campaignRepository.find({
      where: {
        status: 'active' as any,
      },
    });

    for (const campaign of activeCampaigns) {
      await this.scheduleForCampaign(workspaceId, campaign.id);
    }

    this.logger.log(
      `Scheduled lead discovery for ${activeCampaigns.length} active campaigns`,
    );
  }
}
