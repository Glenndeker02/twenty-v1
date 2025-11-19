import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { MessageQueueService } from 'src/engine/core-modules/message-queue/services/message-queue.service';
import { Process } from 'src/engine/core-modules/message-queue/decorators/process.decorator';
import { Processor } from 'src/engine/core-modules/message-queue/decorators/processor.decorator';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { TwentyORMGlobalManager } from 'src/engine/twenty-orm/twenty-orm.manager';
import { MarketingCampaignWorkspaceEntity } from 'src/modules/marketing-ai-agent/standard-objects/marketing-campaign.workspace-entity';
import { WebScrapingService } from 'src/modules/marketing-ai-agent/services/web-scraping.service';

export type TrendingTopicsScraperJobData = {
  workspaceId: string;
  category?: string;
  keywords?: string[];
};

@Processor({
  queueName: MessageQueue.marketingAiAgentQueue,
})
@Injectable()
export class TrendingTopicsScraperJob {
  private readonly logger = new Logger(TrendingTopicsScraperJob.name);

  constructor(
    private readonly webScrapingService: WebScrapingService,
    private readonly twentyORMGlobalManager: TwentyORMGlobalManager,
    private readonly messageQueueService: MessageQueueService,
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
  ) {}

  @Process({
    jobName: 'trending-topics-scraper',
  })
  async handle(data: TrendingTopicsScraperJobData): Promise<void> {
    this.logger.log(
      `Starting trending topics scraper for workspace ${data.workspaceId}`,
    );

    try {
      const workspace = await this.workspaceRepository.findOne({
        where: { id: data.workspaceId },
      });

      if (!workspace) {
        this.logger.error(`Workspace ${data.workspaceId} not found`);
        return;
      }

      // Get active campaigns to determine relevant categories and keywords
      const campaignRepository =
        await this.twentyORMGlobalManager.getRepository<MarketingCampaignWorkspaceEntity>(
          'marketingCampaign',
        );

      const activeCampaigns = await campaignRepository.find({
        where: {
          status: 'active' as any,
        },
      });

      if (activeCampaigns.length === 0) {
        this.logger.log(
          `No active campaigns found for workspace ${data.workspaceId}`,
        );
        return;
      }

      // Extract keywords and categories from active campaigns
      const categories = new Set<string>();
      const keywords = new Set<string>();

      for (const campaign of activeCampaigns) {
        if (campaign.targetAudience) {
          // Extract keywords from target audience description
          const audienceKeywords = this.extractKeywords(
            campaign.targetAudience,
          );

          audienceKeywords.forEach((kw) => keywords.add(kw));
        }
      }

      // Use provided category or default to "marketing"
      const category = data.category || 'marketing';

      // Use provided keywords or extracted keywords
      const keywordArray = data.keywords || Array.from(keywords);

      if (keywordArray.length === 0) {
        keywordArray.push('marketing', 'business', 'trends');
      }

      this.logger.log(
        `Discovering trending topics for category: ${category}, keywords: ${keywordArray.join(', ')}`,
      );

      // Discover trending topics
      const topics = await this.webScrapingService.discoverTrendingTopics(
        data.workspaceId,
        category,
        keywordArray.slice(0, 10), // Limit to 10 keywords
      );

      this.logger.log(
        `Successfully discovered ${topics.length} trending topics for workspace ${data.workspaceId}`,
      );
    } catch (error) {
      this.logger.error(
        `Error in trending topics scraper: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Schedule recurring job for all workspaces
   */
  async scheduleForAllWorkspaces(): Promise<void> {
    this.logger.log('Scheduling trending topics scraper for all workspaces');

    const workspaces = await this.workspaceRepository.find({
      where: { deletedAt: null as any },
    });

    for (const workspace of workspaces) {
      await this.messageQueueService.add('trending-topics-scraper', {
        workspaceId: workspace.id,
      });
    }

    this.logger.log(
      `Scheduled trending topics scraper for ${workspaces.length} workspaces`,
    );
  }

  /**
   * Schedule job for a specific workspace
   */
  async scheduleForWorkspace(
    workspaceId: string,
    category?: string,
    keywords?: string[],
  ): Promise<void> {
    this.logger.log(
      `Scheduling trending topics scraper for workspace ${workspaceId}`,
    );

    await this.messageQueueService.add('trending-topics-scraper', {
      workspaceId,
      category,
      keywords,
    });
  }

  // Private helper methods

  private extractKeywords(text: string): string[] {
    // Simple keyword extraction
    // In production, you might use NLP libraries or AI for better extraction
    const words = text
      .toLowerCase()
      .split(/\W+/)
      .filter((word) => word.length > 3);

    // Remove common stop words
    const stopWords = new Set([
      'this',
      'that',
      'with',
      'from',
      'have',
      'they',
      'will',
      'what',
      'when',
      'where',
      'which',
      'their',
      'about',
      'would',
      'there',
      'could',
      'other',
    ]);

    return words.filter((word) => !stopWords.has(word)).slice(0, 20);
  }
}
