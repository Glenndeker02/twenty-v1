import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { generateText } from 'ai';
import { Repository } from 'typeorm';

import { AiModelRegistryService } from 'src/engine/core-modules/ai/services/ai-model-registry.service';
import { AIBillingService } from 'src/engine/core-modules/ai/services/ai-billing.service';
import { AI_TELEMETRY_CONFIG } from 'src/engine/core-modules/ai/constants/ai-telemetry.const';
import { AgentEntity } from 'src/engine/metadata-modules/agent/agent.entity';
import { TwentyORMManager } from 'src/engine/twenty-orm/twenty-orm.manager';
import { MarketingCampaignWorkspaceEntity } from 'src/modules/marketing-ai-agent/standard-objects/marketing-campaign.workspace-entity';
import { TrendingTopicWorkspaceEntity } from 'src/modules/marketing-ai-agent/standard-objects/trending-topic.workspace-entity';
import { ProspectLeadWorkspaceEntity } from 'src/modules/marketing-ai-agent/standard-objects/prospect-lead.workspace-entity';
import { OutreachMessageWorkspaceEntity } from 'src/modules/marketing-ai-agent/standard-objects/outreach-message.workspace-entity';
import { CrmInsightsService } from 'src/modules/marketing-ai-agent/services/crm-insights.service';

export type MarketingPlan = {
  objectives: string[];
  targetAudience: string;
  strategies: string[];
  contentIdeas: string[];
  timeline: string;
  estimatedBudget: number;
};

@Injectable()
export class MarketingAiAgentService {
  private readonly logger = new Logger(MarketingAiAgentService.name);

  constructor(
    private readonly aiModelRegistryService: AiModelRegistryService,
    private readonly aiBillingService: AIBillingService,
    private readonly twentyORMManager: TwentyORMManager,
    private readonly crmInsightsService: CrmInsightsService,
    @InjectRepository(AgentEntity)
    private readonly agentRepository: Repository<AgentEntity>,
  ) {}

  /**
   * Generate a marketing plan using AI based on user context and trending topics
   */
  async generateMarketingPlan(
    workspaceId: string,
    campaignId: string,
    trendingTopicIds: string[],
  ): Promise<MarketingPlan> {
    this.logger.log(
      `Generating marketing plan for campaign ${campaignId} in workspace ${workspaceId}`,
    );

    // Get CRM insights about the user and their customers
    const crmInsights =
      await this.crmInsightsService.getWorkspaceInsights(workspaceId);

    // Get trending topics
    const trendingTopicRepository =
      await this.twentyORMManager.getRepository<TrendingTopicWorkspaceEntity>(
        'trendingTopic',
      );
    const trendingTopics = await trendingTopicRepository.find({
      where: {
        id: { in: trendingTopicIds } as any,
      },
    });

    // Get campaign details
    const campaignRepository =
      await this.twentyORMManager.getRepository<MarketingCampaignWorkspaceEntity>(
        'marketingCampaign',
      );
    const campaign = await campaignRepository.findOne({
      where: { id: campaignId },
    });

    if (!campaign) {
      throw new Error(`Campaign ${campaignId} not found`);
    }

    // Prepare prompt for AI
    const prompt = this.buildMarketingPlanPrompt(
      campaign,
      trendingTopics,
      crmInsights,
    );

    // Get AI model
    const registeredModel =
      await this.aiModelRegistryService.resolveModelForAgent(null);

    // Generate marketing plan using AI
    const response = await generateText({
      model: registeredModel.model,
      system: `You are an expert marketing strategist specializing in content marketing and customer outreach.
      Generate comprehensive, actionable marketing plans based on CRM data, customer insights, and trending topics.
      Focus on practical strategies that can be executed immediately.`,
      prompt,
      experimental_telemetry: AI_TELEMETRY_CONFIG,
    });

    // Bill for AI usage
    await this.aiBillingService.calculateAndBillUsage(
      'auto',
      response.usage,
      workspaceId,
    );

    // Parse the response into a structured plan
    const plan = this.parseMarketingPlan(response.text);

    // Update campaign with AI-generated plan
    await campaignRepository.update(campaignId, {
      aiGeneratedPlan: response.text,
    });

    this.logger.log(
      `Successfully generated marketing plan for campaign ${campaignId}`,
    );

    return plan;
  }

  /**
   * Generate personalized outreach message for a prospect lead
   */
  async generateOutreachMessage(
    workspaceId: string,
    leadId: string,
    platform: 'email' | 'twitter' | 'linkedin' | 'instagram' | 'facebook',
  ): Promise<{ subject: string; content: string }> {
    this.logger.log(
      `Generating outreach message for lead ${leadId} on ${platform}`,
    );

    // Get prospect lead details
    const leadRepository =
      await this.twentyORMManager.getRepository<ProspectLeadWorkspaceEntity>(
        'prospectLead',
      );
    const lead = await leadRepository.findOne({
      where: { id: leadId },
      relations: ['campaign', 'person', 'company'],
    });

    if (!lead) {
      throw new Error(`Lead ${leadId} not found`);
    }

    // Get CRM insights
    const crmInsights =
      await this.crmInsightsService.getWorkspaceInsights(workspaceId);

    // Build prompt for message generation
    const prompt = this.buildOutreachMessagePrompt(
      lead,
      platform,
      crmInsights,
    );

    // Get AI model
    const registeredModel =
      await this.aiModelRegistryService.resolveModelForAgent(null);

    // Generate message using AI
    const response = await generateText({
      model: registeredModel.model,
      system: `You are an expert at writing personalized, engaging outreach messages that convert.
      Write messages that are:
      - Personalized based on the recipient's profile and interests
      - Concise and to the point
      - Focused on value proposition
      - Include a clear call-to-action
      - Appropriate for the platform (${platform})
      - Professional yet friendly in tone`,
      prompt,
      experimental_telemetry: AI_TELEMETRY_CONFIG,
    });

    // Bill for AI usage
    await this.aiBillingService.calculateAndBillUsage(
      'auto',
      response.usage,
      workspaceId,
    );

    // Parse response
    const message = this.parseOutreachMessage(response.text, platform);

    this.logger.log(`Successfully generated outreach message for lead ${leadId}`);

    return message;
  }

  /**
   * Analyze and score a prospect lead using AI
   */
  async scoreProspectLead(
    workspaceId: string,
    leadId: string,
  ): Promise<{ score: number; profile: string }> {
    this.logger.log(`Scoring prospect lead ${leadId}`);

    // Get prospect lead details
    const leadRepository =
      await this.twentyORMManager.getRepository<ProspectLeadWorkspaceEntity>(
        'prospectLead',
      );
    const lead = await leadRepository.findOne({
      where: { id: leadId },
      relations: ['campaign', 'person', 'company'],
    });

    if (!lead) {
      throw new Error(`Lead ${leadId} not found`);
    }

    // Get CRM insights
    const crmInsights =
      await this.crmInsightsService.getWorkspaceInsights(workspaceId);

    // Build prompt for lead scoring
    const prompt = `Analyze this prospect lead and provide a quality score (0-100) and profile:

Lead Information:
- Name: ${lead.name}
- Email: ${lead.email || 'Not available'}
- Source: ${lead.source || 'Unknown'}
- Social Media: ${JSON.stringify(lead.socialMediaHandles || {})}

Campaign Context:
${lead.campaign ? `- Campaign: ${(lead.campaign as any).name}\n- Target Audience: ${(lead.campaign as any).targetAudience}` : 'No campaign'}

CRM Context:
${this.formatCrmInsights(crmInsights)}

Please provide:
1. A lead quality score from 0-100 (where 100 is highest quality)
2. A brief profile analyzing why this lead is a good/bad fit
3. Recommendations for outreach approach

Format your response as:
SCORE: [number]
PROFILE: [your analysis and recommendations]`;

    // Get AI model
    const registeredModel =
      await this.aiModelRegistryService.resolveModelForAgent(null);

    // Score lead using AI
    const response = await generateText({
      model: registeredModel.model,
      system: `You are an expert at qualifying sales leads based on fit, intent, and potential value.
      Provide accurate, data-driven lead scoring.`,
      prompt,
      experimental_telemetry: AI_TELEMETRY_CONFIG,
    });

    // Bill for AI usage
    await this.aiBillingService.calculateAndBillUsage(
      'auto',
      response.usage,
      workspaceId,
    );

    // Parse score and profile
    const { score, profile } = this.parseLeadScore(response.text);

    // Update lead with score and profile
    await leadRepository.update(leadId, {
      leadScore: score,
      aiProfile: profile,
    });

    this.logger.log(
      `Successfully scored prospect lead ${leadId} with score ${score}`,
    );

    return { score, profile };
  }

  // Private helper methods

  private buildMarketingPlanPrompt(
    campaign: MarketingCampaignWorkspaceEntity,
    trendingTopics: TrendingTopicWorkspaceEntity[],
    crmInsights: any,
  ): string {
    return `Create a comprehensive marketing plan for the following campaign:

Campaign Details:
- Name: ${campaign.name}
- Description: ${campaign.description || 'Not provided'}
- Target Audience: ${campaign.targetAudience || 'Not specified'}
- Budget: $${campaign.budget || 'Not specified'}
- Start Date: ${campaign.startDate || 'Not set'}
- End Date: ${campaign.endDate || 'Not set'}

Trending Topics to Consider:
${trendingTopics.map((topic) => `- ${topic.topic}: ${topic.description || ''} (Relevance: ${topic.relevanceScore || 'N/A'})`).join('\n')}

CRM Insights:
${this.formatCrmInsights(crmInsights)}

Please create a detailed marketing plan including:
1. Campaign Objectives (3-5 specific, measurable goals)
2. Target Audience Definition (detailed personas)
3. Marketing Strategies (channels, tactics, approaches)
4. Content Ideas (at least 5 content pieces based on trending topics)
5. Timeline (key milestones and phases)
6. Estimated Budget Breakdown

Make the plan actionable and specific to the business context.`;
  }

  private buildOutreachMessagePrompt(
    lead: ProspectLeadWorkspaceEntity,
    platform: string,
    crmInsights: any,
  ): string {
    return `Generate a personalized outreach message for this prospect:

Prospect Information:
- Name: ${lead.name}
- Email: ${lead.email || 'Not available'}
- Source: ${lead.source || 'Unknown'}
- AI Profile: ${lead.aiProfile || 'Not analyzed yet'}
- Social Media: ${JSON.stringify(lead.socialMediaHandles || {})}

Platform: ${platform.toUpperCase()}
${platform === 'email' ? 'Include both subject line and message body.' : 'Create a direct message.'}

${lead.campaign ? `Campaign: ${(lead.campaign as any).name}\nTarget Audience: ${(lead.campaign as any).targetAudience}` : ''}

Business Context:
${this.formatCrmInsights(crmInsights)}

Create a compelling, personalized message that:
1. Addresses the prospect by name
2. Shows you understand their needs/interests
3. Clearly states your value proposition
4. Includes a specific call-to-action
5. Is appropriate for ${platform}

${platform === 'email' ? 'Format:\nSUBJECT: [subject line]\n\nMESSAGE:\n[message body]' : 'MESSAGE:\n[message content]'}`;
  }

  private formatCrmInsights(insights: any): string {
    return `- Total Customers: ${insights.totalCustomers || 0}
- Total Companies: ${insights.totalCompanies || 0}
- Top Industries: ${insights.topIndustries?.join(', ') || 'Unknown'}
- Customer Interests: ${insights.customerInterests?.join(', ') || 'Not analyzed'}`;
  }

  private parseMarketingPlan(aiResponse: string): MarketingPlan {
    // Simple parsing logic - in production, you might want more robust parsing
    return {
      objectives: this.extractSection(aiResponse, 'objectives'),
      targetAudience:
        this.extractSection(aiResponse, 'target audience')[0] ||
        'Not specified',
      strategies: this.extractSection(aiResponse, 'strategies'),
      contentIdeas: this.extractSection(aiResponse, 'content'),
      timeline:
        this.extractSection(aiResponse, 'timeline')[0] || 'To be determined',
      estimatedBudget: 0, // Would need more sophisticated parsing
    };
  }

  private parseOutreachMessage(
    aiResponse: string,
    platform: string,
  ): { subject: string; content: string } {
    if (platform === 'email') {
      const subjectMatch = aiResponse.match(/SUBJECT:\s*(.+?)(?:\n|$)/i);
      const messageMatch = aiResponse.match(
        /MESSAGE:\s*(.+)/is,
      );

      return {
        subject: subjectMatch?.[1]?.trim() || 'Reaching out',
        content:
          messageMatch?.[1]?.trim() || aiResponse,
      };
    }

    return {
      subject: '',
      content: aiResponse.replace(/MESSAGE:\s*/i, '').trim(),
    };
  }

  private parseLeadScore(aiResponse: string): {
    score: number;
    profile: string;
  } {
    const scoreMatch = aiResponse.match(/SCORE:\s*(\d+)/i);
    const profileMatch = aiResponse.match(/PROFILE:\s*(.+)/is);

    return {
      score: scoreMatch ? parseInt(scoreMatch[1], 10) : 50,
      profile: profileMatch?.[1]?.trim() || aiResponse,
    };
  }

  private extractSection(text: string, sectionName: string): string[] {
    const regex = new RegExp(
      `${sectionName}[:\\s]+([\\s\\S]*?)(?=\\n\\n|$)`,
      'i',
    );
    const match = text.match(regex);

    if (!match) return [];

    return match[1]
      .split('\n')
      .filter((line) => line.trim().match(/^[-*•]\s+/))
      .map((line) => line.replace(/^[-*•]\s+/, '').trim())
      .filter((line) => line.length > 0);
  }
}
