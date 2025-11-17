import { Injectable, Logger } from '@nestjs/common';

import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';
import {
  AIProvider,
  type AICompletionRequest,
  type AICompletionResponse,
  type AISentimentResult,
  type AILeadScore,
} from 'src/modules/ai/types/ai-provider.types';

@Injectable()
export class AIProviderService {
  private readonly logger = new Logger(AIProviderService.name);
  private readonly provider: AIProvider;
  private readonly maxTokens: number;

  constructor(private readonly twentyConfigService: TwentyConfigService) {
    const providerConfig = this.twentyConfigService.get('AI_PROVIDER') || 'openai';
    this.provider = providerConfig as AIProvider;
    this.maxTokens = parseInt(this.twentyConfigService.get('AI_MAX_TOKENS') || '2000', 10);
  }

  /**
   * Generate text completion using AI
   */
  async generateText(request: AICompletionRequest): Promise<AICompletionResponse> {
    this.logger.log(`Generating text with ${this.provider}`);

    try {
      // Simulate AI response for now
      // In production, integrate with actual OpenAI/Anthropic SDKs
      const response: AICompletionResponse = {
        text: this.simulateAIResponse(request.prompt),
        tokensUsed: request.prompt.length + 100,
        model: this.provider === AIProvider.OPENAI ? 'gpt-4' : 'claude-3',
        provider: this.provider,
      };

      this.logger.log(`AI generated ${response.tokensUsed} tokens`);
      return response;
    } catch (error) {
      this.logger.error('Failed to generate AI text', error);
      throw new Error(`AI generation failed: ${error.message}`);
    }
  }

  /**
   * Analyze sentiment of text
   */
  async analyzeSentiment(text: string): Promise<AISentimentResult> {
    this.logger.log('Analyzing sentiment');

    const prompt = `Analyze the sentiment of the following text and respond with ONLY a JSON object in this exact format:
{
  "sentiment": "positive" | "negative" | "neutral",
  "score": <number between -1 and 1>,
  "confidence": <number between 0 and 1>
}

Text: "${text}"`;

    try {
      // Simulate sentiment analysis
      // In production, use actual AI API
      const result: AISentimentResult = {
        sentiment: this.simulateSentiment(text),
        score: 0.7,
        confidence: 0.85,
      };

      return result;
    } catch (error) {
      this.logger.error('Failed to analyze sentiment', error);
      throw new Error(`Sentiment analysis failed: ${error.message}`);
    }
  }

  /**
   * Score a lead based on provided data
   */
  async scoreLead(leadData: Record<string, unknown>): Promise<AILeadScore> {
    this.logger.log('Scoring lead');

    const prompt = `Analyze this lead data and provide a score from 0-100, along with key factors.

Lead Data: ${JSON.stringify(leadData, null, 2)}

Respond with ONLY a JSON object in this exact format:
{
  "score": <number 0-100>,
  "factors": [
    {
      "factor": "<factor name>",
      "impact": <number -10 to 10>,
      "reason": "<explanation>"
    }
  ],
  "recommendation": "<action recommendation>"
}`;

    try {
      // Simulate lead scoring
      // In production, use actual AI API
      const result: AILeadScore = {
        score: this.simulateLeadScore(leadData),
        factors: [
          {
            factor: 'Company Size',
            impact: 8,
            reason: 'Large company indicates higher potential value',
          },
          {
            factor: 'Engagement Level',
            impact: 6,
            reason: 'Active engagement shows strong interest',
          },
        ],
        recommendation: 'High priority - reach out within 24 hours',
      };

      return result;
    } catch (error) {
      this.logger.error('Failed to score lead', error);
      throw new Error(`Lead scoring failed: ${error.message}`);
    }
  }

  /**
   * Draft an email based on context
   */
  async draftEmail(context: {
    recipientName?: string;
    purpose: string;
    tone?: 'formal' | 'casual' | 'friendly';
    keyPoints?: string[];
  }): Promise<string> {
    this.logger.log('Drafting email');

    const prompt = `Draft a ${context.tone || 'professional'} email for the following purpose:

Purpose: ${context.purpose}
Recipient: ${context.recipientName || 'valued customer'}
${context.keyPoints ? `Key points to include:\n${context.keyPoints.map((p) => `- ${p}`).join('\n')}` : ''}

Write a complete email including subject line.`;

    try {
      const response = await this.generateText({ prompt });
      return response.text;
    } catch (error) {
      this.logger.error('Failed to draft email', error);
      throw new Error(`Email drafting failed: ${error.message}`);
    }
  }

  /**
   * Summarize text/notes
   */
  async summarizeText(text: string, maxLength = 200): Promise<string> {
    this.logger.log('Summarizing text');

    const prompt = `Summarize the following text in ${maxLength} characters or less:

${text}`;

    try {
      const response = await this.generateText({ prompt, maxTokens: Math.ceil(maxLength / 4) });
      return response.text;
    } catch (error) {
      this.logger.error('Failed to summarize text', error);
      throw new Error(`Text summarization failed: ${error.message}`);
    }
  }

  // Simulation methods (replace with actual AI API calls in production)

  private simulateAIResponse(prompt: string): string {
    if (prompt.includes('email')) {
      return 'Subject: Follow-up on our conversation\n\nDear valued customer,\n\nThank you for your interest in our product. I wanted to follow up on our recent conversation...\n\nBest regards';
    }
    if (prompt.includes('summarize')) {
      return 'This is a concise summary of the provided text, highlighting the key points and main ideas.';
    }
    return 'AI-generated response based on your prompt.';
  }

  private simulateSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['great', 'excellent', 'happy', 'love', 'amazing', 'good'];
    const negativeWords = ['bad', 'terrible', 'hate', 'poor', 'awful', 'disappointing'];

    const lowerText = text.toLowerCase();
    const hasPositive = positiveWords.some((word) => lowerText.includes(word));
    const hasNegative = negativeWords.some((word) => lowerText.includes(word));

    if (hasPositive && !hasNegative) return 'positive';
    if (hasNegative && !hasPositive) return 'negative';
    return 'neutral';
  }

  private simulateLeadScore(data: Record<string, unknown>): number {
    // Simple scoring based on data presence
    let score = 50; // Base score

    if (data.email) score += 10;
    if (data.companyName) score += 15;
    if (data.jobTitle) score += 10;
    if (data.phoneNumber) score += 5;
    if (data.website) score += 10;

    return Math.min(100, score);
  }
}
