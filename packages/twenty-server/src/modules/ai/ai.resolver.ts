import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/engine/guards/jwt.auth.guard';
import { AIProviderService } from 'src/modules/ai/services/ai-provider.service';

@Resolver()
@UseGuards(JwtAuthGuard)
export class AIResolver {
  constructor(private readonly aiProviderService: AIProviderService) {}

  @Mutation(() => String)
  async aiGenerateText(
    @Args('prompt') prompt: string,
    @Args('maxTokens', { nullable: true }) maxTokens?: number,
  ): Promise<string> {
    const response = await this.aiProviderService.generateText({
      prompt,
      maxTokens,
    });
    return response.text;
  }

  @Mutation(() => String)
  async aiAnalyzeSentiment(@Args('text') text: string): Promise<string> {
    const result = await this.aiProviderService.analyzeSentiment(text);
    return JSON.stringify(result);
  }

  @Mutation(() => String)
  async aiScoreLead(
    @Args('leadData') leadData: string, // JSON string
  ): Promise<string> {
    const data = JSON.parse(leadData);
    const result = await this.aiProviderService.scoreLead(data);
    return JSON.stringify(result);
  }

  @Mutation(() => String)
  async aiDraftEmail(
    @Args('purpose') purpose: string,
    @Args('recipientName', { nullable: true }) recipientName?: string,
    @Args('tone', { nullable: true }) tone?: string,
  ): Promise<string> {
    return await this.aiProviderService.draftEmail({
      purpose,
      recipientName,
      tone: tone as 'formal' | 'casual' | 'friendly',
    });
  }

  @Mutation(() => String)
  async aiSummarizeText(
    @Args('text') text: string,
    @Args('maxLength', { nullable: true }) maxLength?: number,
  ): Promise<string> {
    return await this.aiProviderService.summarizeText(text, maxLength);
  }
}
