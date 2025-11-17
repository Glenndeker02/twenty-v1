import { Injectable, Logger } from '@nestjs/common';

import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { MessageQueueService } from 'src/engine/core-modules/message-queue/services/message-queue.service';
import { Process } from 'src/engine/core-modules/message-queue/decorators/process.decorator';
import { Processor } from 'src/engine/core-modules/message-queue/decorators/processor.decorator';
import { TwentyORMManager } from 'src/engine/twenty-orm/twenty-orm.manager';
import { MarketingCampaignWorkspaceEntity } from 'src/modules/marketing-ai-agent/standard-objects/marketing-campaign.workspace-entity';
import { ProspectLeadWorkspaceEntity } from 'src/modules/marketing-ai-agent/standard-objects/prospect-lead.workspace-entity';
import { OutreachMessageWorkspaceEntity } from 'src/modules/marketing-ai-agent/standard-objects/outreach-message.workspace-entity';
import { MarketingAiAgentService } from 'src/modules/marketing-ai-agent/services/marketing-ai-agent.service';
import { SocialMediaOutreachService } from 'src/modules/marketing-ai-agent/services/social-media-outreach.service';

export type OutreachAutomationJobData = {
  workspaceId: string;
  campaignId: string;
  platform?: 'email' | 'twitter' | 'linkedin' | 'instagram' | 'facebook';
  maxMessagesToSend?: number;
  generateMessages?: boolean;
};

@Processor({
  queueName: MessageQueue.marketingAiAgentQueue,
})
@Injectable()
export class OutreachAutomationJob {
  private readonly logger = new Logger(OutreachAutomationJob.name);

  constructor(
    private readonly marketingAiAgentService: MarketingAiAgentService,
    private readonly socialMediaOutreachService: SocialMediaOutreachService,
    private readonly twentyORMManager: TwentyORMManager,
    private readonly messageQueueService: MessageQueueService,
  ) {}

  @Process({
    jobName: 'outreach-automation',
  })
  async handle(data: OutreachAutomationJobData): Promise<void> {
    this.logger.log(
      `Starting outreach automation for campaign ${data.campaignId} in workspace ${data.workspaceId}`,
    );

    try {
      // Get campaign details
      const campaignRepository =
        await this.twentyORMManager.getRepository<MarketingCampaignWorkspaceEntity>(
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
          `Campaign ${data.campaignId} is not active, skipping outreach`,
        );
        return;
      }

      // Get leads that need outreach
      const leadRepository =
        await this.twentyORMManager.getRepository<ProspectLeadWorkspaceEntity>(
          'prospectLead',
        );

      // Find leads that are new or contacted (but not engaged/converted)
      const leadsNeedingOutreach = await leadRepository.find({
        where: {
          campaignId: data.campaignId as any,
          status: { in: ['new', 'contacted'] } as any,
        },
        take: data.maxMessagesToSend || 50,
        order: {
          leadScore: 'DESC' as any, // Prioritize higher-scored leads
        },
      });

      if (leadsNeedingOutreach.length === 0) {
        this.logger.log(
          `No leads needing outreach for campaign ${data.campaignId}`,
        );
        return;
      }

      this.logger.log(
        `Found ${leadsNeedingOutreach.length} leads needing outreach`,
      );

      const messageRepository =
        await this.twentyORMManager.getRepository<OutreachMessageWorkspaceEntity>(
          'outreachMessage',
        );

      let messagesSent = 0;
      let messagesGenerated = 0;

      for (const lead of leadsNeedingOutreach) {
        try {
          // Determine platform to use
          const platform =
            data.platform || this.selectBestPlatform(lead);

          // Check if we should generate a new message or send existing ones
          if (data.generateMessages !== false) {
            // Generate personalized outreach message
            this.logger.log(
              `Generating outreach message for lead ${lead.id} on ${platform}`,
            );

            const { subject, content } =
              await this.marketingAiAgentService.generateOutreachMessage(
                data.workspaceId,
                lead.id,
                platform,
              );

            // Create outreach message
            const message = await messageRepository.create({
              subject: platform === 'email' ? subject : null,
              content,
              platform,
              status: 'draft',
              aiGenerated: true,
              campaignId: data.campaignId,
              leadId: lead.id,
              personalizationData: {
                leadName: lead.name,
                leadScore: lead.leadScore,
              } as any,
            });

            messagesGenerated++;

            // Send the message immediately
            await this.socialMediaOutreachService.sendMessage(
              data.workspaceId,
              message.id,
            );

            messagesSent++;
          } else {
            // Send existing draft/scheduled messages for this lead
            const existingMessages = await messageRepository.find({
              where: {
                leadId: lead.id as any,
                status: { in: ['draft', 'scheduled'] } as any,
              },
              take: 1,
            });

            for (const message of existingMessages) {
              await this.socialMediaOutreachService.sendMessage(
                data.workspaceId,
                message.id,
              );

              messagesSent++;
            }
          }

          // Update lead status
          if (lead.status === 'new') {
            await leadRepository.update(lead.id, {
              status: 'contacted',
            });
          }

          // Add small delay to avoid rate limiting
          await this.delay(2000); // 2 seconds between messages
        } catch (error) {
          this.logger.error(
            `Error processing lead ${lead.id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          );
          // Continue with next lead
        }
      }

      this.logger.log(
        `Outreach automation complete: generated ${messagesGenerated} messages, sent ${messagesSent} messages`,
      );

      // Update campaign performance
      const currentPerformance = campaign.performance || {};

      await campaignRepository.update(data.campaignId, {
        performance: {
          ...currentPerformance,
          totalMessagesSent:
            (currentPerformance.totalMessagesSent || 0) + messagesSent,
          lastOutreachAt: new Date().toISOString(),
        } as any,
      });
    } catch (error) {
      this.logger.error(
        `Error in outreach automation: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Schedule outreach automation for a campaign
   */
  async scheduleForCampaign(
    workspaceId: string,
    campaignId: string,
    platform?: 'email' | 'twitter' | 'linkedin' | 'instagram' | 'facebook',
    maxMessagesToSend?: number,
    generateMessages?: boolean,
  ): Promise<void> {
    this.logger.log(
      `Scheduling outreach automation for campaign ${campaignId}`,
    );

    await this.messageQueueService.add('outreach-automation', {
      workspaceId,
      campaignId,
      platform,
      maxMessagesToSend,
      generateMessages,
    });
  }

  /**
   * Schedule outreach automation for all active campaigns
   */
  async scheduleForAllActiveCampaigns(workspaceId: string): Promise<void> {
    this.logger.log(
      `Scheduling outreach automation for all active campaigns in workspace ${workspaceId}`,
    );

    const campaignRepository =
      await this.twentyORMManager.getRepository<MarketingCampaignWorkspaceEntity>(
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
      `Scheduled outreach automation for ${activeCampaigns.length} active campaigns`,
    );
  }

  // Private helper methods

  private selectBestPlatform(
    lead: ProspectLeadWorkspaceEntity,
  ): 'email' | 'twitter' | 'linkedin' | 'instagram' | 'facebook' {
    // Logic to select the best platform based on lead data
    // Priority: Email > LinkedIn > Twitter > Instagram > Facebook

    if (lead.email) {
      return 'email';
    }

    const socialHandles = lead.socialMediaHandles || {};

    if (socialHandles.linkedin) {
      return 'linkedin';
    }

    if (socialHandles.twitter) {
      return 'twitter';
    }

    if (socialHandles.instagram) {
      return 'instagram';
    }

    if (socialHandles.facebook) {
      return 'facebook';
    }

    // Default to email even if we don't have it
    // In production, you might want to skip leads without contact info
    return 'email';
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
