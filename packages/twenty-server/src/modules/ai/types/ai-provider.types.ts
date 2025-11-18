export enum AIProvider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
}

export type AICompletionRequest = {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  context?: Record<string, unknown>;
};

export type AICompletionResponse = {
  text: string;
  tokensUsed: number;
  model: string;
  provider: AIProvider;
};

export type AISentimentResult = {
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  confidence: number;
};

export type AILeadScore = {
  score: number; // 0-100
  factors: Array<{
    factor: string;
    impact: number;
    reason: string;
  }>;
  recommendation: string;
};
