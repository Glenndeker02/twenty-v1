import { Injectable, Logger } from '@nestjs/common';

import { generateText } from 'ai';

import { AiModelRegistryService } from 'src/engine/core-modules/ai/services/ai-model-registry.service';
import { AIBillingService } from 'src/engine/core-modules/ai/services/ai-billing.service';
import { AI_TELEMETRY_CONFIG } from 'src/engine/core-modules/ai/constants/ai-telemetry.const';
import { TwentyORMManager } from 'src/engine/twenty-orm/twenty-orm.manager';
import { TrendingTopicWorkspaceEntity } from 'src/modules/marketing-ai-agent/standard-objects/trending-topic.workspace-entity';
import { ProspectLeadWorkspaceEntity } from 'src/modules/marketing-ai-agent/standard-objects/prospect-lead.workspace-entity';

export type TrendingTopicData = {
  topic: string;
  description: string;
  source: string;
  sourceUrl?: string;
  relevanceScore: number;
  category: string;
  keywords: string[];
};

export type ProspectLeadData = {
  name: string;
  email?: string;
  source: string;
  sourceUrl?: string;
  socialMediaHandles?: Record<string, string>;
};

@Injectable()
export class WebScrapingService {
  private readonly logger = new Logger(WebScrapingService.name);

  constructor(
    private readonly aiModelRegistryService: AiModelRegistryService,
    private readonly aiBillingService: AIBillingService,
    private readonly twentyORMManager: TwentyORMManager,
  ) {}

  /**
   * Discover trending topics using AI-powered web analysis
   * In a production environment, this would integrate with real APIs like:
   * - Google Trends API
   * - Twitter/X API
   * - Reddit API
   * - News APIs
   */
  async discoverTrendingTopics(
    workspaceId: string,
    category: string,
    keywords: string[],
  ): Promise<TrendingTopicData[]> {
    this.logger.log(
      `Discovering trending topics for category: ${category}, keywords: ${keywords.join(', ')}`,
    );

    // In production, you would:
    // 1. Call Google Trends API
    // 2. Fetch from Twitter/X Trending API
    // 3. Scrape Reddit popular posts
    // 4. Query news aggregators
    //
    // For now, we'll use AI to simulate trend discovery
    // based on the provided keywords and category

    const prompt = `As a trend analyst, identify current trending topics related to:
Category: ${category}
Keywords: ${keywords.join(', ')}

For each trending topic, provide:
1. Topic name
2. Brief description (1-2 sentences)
3. Relevance score (0-100)
4. Related hashtags/keywords
5. Why it's trending

Format each topic as:
TOPIC: [name]
DESCRIPTION: [description]
RELEVANCE: [score]
KEYWORDS: [comma-separated list]
REASON: [why it's trending]

Provide 5-10 trending topics.`;

    const registeredModel =
      await this.aiModelRegistryService.resolveModelForAgent(null);

    const response = await generateText({
      model: registeredModel.model,
      system: `You are a trend analysis expert tracking real-time trends across social media, news, and online communities.`,
      prompt,
      experimental_telemetry: AI_TELEMETRY_CONFIG,
    });

    await this.aiBillingService.calculateAndBillUsage(
      'auto',
      response.usage,
      workspaceId,
    );

    // Parse the AI response into structured data
    const topics = this.parseTrendingTopics(response.text, category);

    // Save topics to database
    await this.saveTrendingTopics(workspaceId, topics);

    this.logger.log(`Discovered ${topics.length} trending topics`);

    return topics;
  }

  /**
   * Discover potential customers/leads using AI-powered web search
   * In production, this would integrate with:
   * - LinkedIn Sales Navigator API
   * - Twitter/X Search API
   * - Company databases (Clearbit, Hunter.io, etc.)
   * - Public social media profiles
   */
  async discoverProspectLeads(
    workspaceId: string,
    targetAudience: string,
    industry: string,
    campaignId?: string,
  ): Promise<ProspectLeadData[]> {
    this.logger.log(
      `Discovering prospect leads for: ${targetAudience} in ${industry}`,
    );

    // In production, you would:
    // 1. Use LinkedIn Sales Navigator API
    // 2. Search Twitter for relevant profiles
    // 3. Query company databases
    // 4. Use lead generation tools
    //
    // For now, we'll use AI to simulate lead discovery

    const prompt = `As a lead generation specialist, identify potential customers/leads matching:
Target Audience: ${targetAudience}
Industry: ${industry}

For each prospect, provide:
1. Full name
2. Job title/role
3. Company (if applicable)
4. Why they're a good fit
5. Potential contact method

Format each lead as:
NAME: [full name]
TITLE: [job title]
COMPANY: [company name]
FIT_REASON: [why they match]
CONTACT: [suggested platform]

Provide 10-15 realistic prospect profiles.`;

    const registeredModel =
      await this.aiModelRegistryService.resolveModelForAgent(null);

    const response = await generateText({
      model: registeredModel.model,
      system: `You are a B2B lead generation expert identifying high-quality prospects.
      Create realistic prospect profiles based on the target criteria.`,
      prompt,
      experimental_telemetry: AI_TELEMETRY_CONFIG,
    });

    await this.aiBillingService.calculateAndBillUsage(
      'auto',
      response.usage,
      workspaceId,
    );

    // Parse the AI response into structured data
    const leads = this.parseProspectLeads(
      response.text,
      'AI-Generated',
      industry,
    );

    // Save leads to database
    await this.saveProspectLeads(workspaceId, leads, campaignId);

    this.logger.log(`Discovered ${leads.length} prospect leads`);

    return leads;
  }

  /**
   * Analyze a URL and extract relevant information
   * This could be used to analyze competitor websites, blog posts, etc.
   */
  async analyzeUrl(
    workspaceId: string,
    url: string,
  ): Promise<{
    title: string;
    description: string;
    keywords: string[];
    insights: string;
  }> {
    this.logger.log(`Analyzing URL: ${url}`);

    // In production, you would:
    // 1. Fetch the actual webpage content
    // 2. Parse HTML/metadata
    // 3. Extract structured data
    //
    // For now, we'll use AI to simulate analysis

    const prompt = `Analyze the following URL and provide insights:
URL: ${url}

Note: Since we cannot fetch the actual content, provide a general analysis based on the URL structure and domain.

Provide:
1. Likely page title
2. Expected content description
3. Relevant keywords
4. Marketing insights`;

    const registeredModel =
      await this.aiModelRegistryService.resolveModelForAgent(null);

    const response = await generateText({
      model: registeredModel.model,
      system: `You are a web content analyst providing insights about web pages.`,
      prompt,
      experimental_telemetry: AI_TELEMETRY_CONFIG,
    });

    await this.aiBillingService.calculateAndBillUsage(
      'auto',
      response.usage,
      workspaceId,
    );

    return {
      title: 'Analyzed Content',
      description: response.text,
      keywords: [],
      insights: response.text,
    };
  }

  // Private helper methods

  private parseTrendingTopics(
    aiResponse: string,
    category: string,
  ): TrendingTopicData[] {
    const topics: TrendingTopicData[] = [];
    const sections = aiResponse.split(/(?=TOPIC:)/i);

    for (const section of sections) {
      if (!section.trim()) continue;

      const topicMatch = section.match(/TOPIC:\s*(.+?)(?:\n|$)/i);
      const descMatch = section.match(/DESCRIPTION:\s*(.+?)(?:\n|$)/i);
      const relevanceMatch = section.match(/RELEVANCE:\s*(\d+)/i);
      const keywordsMatch = section.match(/KEYWORDS:\s*(.+?)(?:\n|$)/i);

      if (topicMatch) {
        topics.push({
          topic: topicMatch[1].trim(),
          description: descMatch?.[1]?.trim() || '',
          source: 'AI Analysis',
          relevanceScore: relevanceMatch ? parseInt(relevanceMatch[1], 10) : 50,
          category,
          keywords: keywordsMatch
            ? keywordsMatch[1].split(',').map((k) => k.trim())
            : [],
        });
      }
    }

    return topics;
  }

  private parseProspectLeads(
    aiResponse: string,
    source: string,
    industry: string,
  ): ProspectLeadData[] {
    const leads: ProspectLeadData[] = [];
    const sections = aiResponse.split(/(?=NAME:)/i);

    for (const section of sections) {
      if (!section.trim()) continue;

      const nameMatch = section.match(/NAME:\s*(.+?)(?:\n|$)/i);
      const titleMatch = section.match(/TITLE:\s*(.+?)(?:\n|$)/i);
      const companyMatch = section.match(/COMPANY:\s*(.+?)(?:\n|$)/i);

      if (nameMatch) {
        const name = nameMatch[1].trim();
        const title = titleMatch?.[1]?.trim();
        const company = companyMatch?.[1]?.trim();

        leads.push({
          name: `${name}${title ? ` - ${title}` : ''}${company ? ` @ ${company}` : ''}`,
          source,
          socialMediaHandles: {},
        });
      }
    }

    return leads;
  }

  private async saveTrendingTopics(
    workspaceId: string,
    topics: TrendingTopicData[],
  ): Promise<void> {
    const repository =
      await this.twentyORMManager.getRepository<TrendingTopicWorkspaceEntity>(
        'trendingTopic',
      );

    for (const topicData of topics) {
      try {
        await repository.create({
          topic: topicData.topic,
          description: topicData.description,
          source: topicData.source,
          sourceUrl: topicData.sourceUrl || null,
          relevanceScore: topicData.relevanceScore,
          category: topicData.category,
          keywords: topicData.keywords,
          discoveredAt: new Date(),
        });
      } catch (error) {
        this.logger.error(
          `Error saving trending topic: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }
    }
  }

  private async saveProspectLeads(
    workspaceId: string,
    leads: ProspectLeadData[],
    campaignId?: string,
  ): Promise<void> {
    const repository =
      await this.twentyORMManager.getRepository<ProspectLeadWorkspaceEntity>(
        'prospectLead',
      );

    for (const leadData of leads) {
      try {
        await repository.create({
          name: leadData.name,
          email: leadData.email || null,
          source: leadData.source,
          sourceUrl: leadData.sourceUrl || null,
          socialMediaHandles: leadData.socialMediaHandles || null,
          status: 'new',
          discoveredAt: new Date(),
          campaignId: campaignId || null,
        });
      } catch (error) {
        this.logger.error(
          `Error saving prospect lead: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }
    }
  }
}
