import { Injectable, Logger } from '@nestjs/common';

export type IntentType =
  | 'PRODUCT_INQUIRY'
  | 'PURCHASE_INTENT'
  | 'GENERAL_QUESTION'
  | 'COMPLAINT'
  | 'PRAISE'
  | 'OTHER';

export interface IntentDetectionResult {
  intent: IntentType;
  confidence: number; // 0-1
  extractedProductName?: string;
  suggestedResponse?: string;
  leadScore: number; // 0-100
  requiresHumanReview: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: {
    amountMicros: number;
    currencyCode: string;
  };
  purchaseLink: string;
}

export interface ClaudeApiConfig {
  apiKey: string;
  model?: string;
  maxTokens?: number;
}

/**
 * Service to integrate with Claude AI API for intent detection,
 * lead qualification, and response generation.
 *
 * This service uses Claude's powerful language understanding to:
 * - Detect user intent from chat messages
 * - Extract product mentions
 * - Generate contextual responses
 * - Score lead quality
 *
 * API Documentation: https://docs.anthropic.com/claude/reference
 */
@Injectable()
export class ClaudeAiService {
  private readonly logger = new Logger(ClaudeAiService.name);
  private readonly defaultModel = 'claude-3-5-sonnet-20241022';
  private readonly defaultMaxTokens = 1024;

  constructor() {}

  /**
   * Detect intent from a user message
   *
   * @param message - User's chat message
   * @param products - Available products
   * @param config - Claude API configuration
   * @returns Intent detection result
   */
  async detectIntent(
    message: string,
    products: Product[],
    config: ClaudeApiConfig,
  ): Promise<IntentDetectionResult> {
    try {
      const prompt = this.buildIntentDetectionPrompt(message, products);
      const response = await this.callClaudeApi(prompt, config);

      return this.parseIntentResponse(response);
    } catch (error) {
      this.logger.error('Error detecting intent', error);
      // Return safe default
      return {
        intent: 'OTHER',
        confidence: 0,
        leadScore: 0,
        requiresHumanReview: true,
      };
    }
  }

  /**
   * Generate a response to a user message
   *
   * @param message - User's chat message
   * @param intent - Detected intent
   * @param product - Related product (if any)
   * @param config - Claude API configuration
   * @returns Generated response
   */
  async generateResponse(
    message: string,
    intent: IntentType,
    product: Product | null,
    config: ClaudeApiConfig,
  ): Promise<string> {
    try {
      const prompt = this.buildResponseGenerationPrompt(
        message,
        intent,
        product,
      );
      const response = await this.callClaudeApi(prompt, config);

      return this.extractResponse(response);
    } catch (error) {
      this.logger.error('Error generating response', error);
      // Return generic fallback
      return "Thanks for your message! I'll make sure the creator sees this.";
    }
  }

  /**
   * Calculate lead score based on interaction history
   *
   * @param messages - User's message history
   * @param config - Claude API configuration
   * @returns Lead score (0-100)
   */
  async calculateLeadScore(
    messages: Array<{ text: string; intent: IntentType }>,
    config: ClaudeApiConfig,
  ): Promise<number> {
    try {
      const prompt = this.buildLeadScoringPrompt(messages);
      const response = await this.callClaudeApi(prompt, config);

      return this.extractLeadScore(response);
    } catch (error) {
      this.logger.error('Error calculating lead score', error);
      return 50; // Default medium score
    }
  }

  /**
   * Match a message to a product from the catalog
   *
   * @param message - User's chat message
   * @param products - Available products
   * @param config - Claude API configuration
   * @returns Matched product or null
   */
  async matchProduct(
    message: string,
    products: Product[],
    config: ClaudeApiConfig,
  ): Promise<Product | null> {
    try {
      const prompt = this.buildProductMatchingPrompt(message, products);
      const response = await this.callClaudeApi(prompt, config);

      const productId = this.extractProductId(response);
      return products.find((p) => p.id === productId) || null;
    } catch (error) {
      this.logger.error('Error matching product', error);
      return null;
    }
  }

  /**
   * Call Claude API
   */
  private async callClaudeApi(
    prompt: string,
    config: ClaudeApiConfig,
  ): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: config.model || this.defaultModel,
        max_tokens: config.maxTokens || this.defaultMaxTokens,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `Claude API error: ${response.status} - ${errorData}`,
      );
    }

    const data = await response.json();

    if (!data.content || !data.content[0]?.text) {
      throw new Error('Invalid Claude API response');
    }

    return data.content[0].text;
  }

  /**
   * Build intent detection prompt
   */
  private buildIntentDetectionPrompt(
    message: string,
    products: Product[],
  ): string {
    const productList = products
      .map((p) => {
        const price =
          p.price.amountMicros / 1000000;
        return `- ${p.name}: $${price} ${p.price.currencyCode}`;
      })
      .join('\n');

    return `You are an AI assistant helping a content creator sell products during a live stream.

Available products:
${productList}

User message: "${message}"

Analyze this message and respond with a JSON object containing:
{
  "intent": "PRODUCT_INQUIRY" | "PURCHASE_INTENT" | "GENERAL_QUESTION" | "COMPLAINT" | "PRAISE" | "OTHER",
  "confidence": 0.0 to 1.0,
  "extractedProductName": "product name if mentioned, otherwise null",
  "leadScore": 0 to 100 (based on purchase likelihood),
  "requiresHumanReview": true if complex or sensitive, false otherwise
}

Intent definitions:
- PRODUCT_INQUIRY: Asking about product details, price, features
- PURCHASE_INTENT: Expressing desire to buy or asking how to purchase
- GENERAL_QUESTION: Questions about the stream, creator, or unrelated topics
- COMPLAINT: Expressing dissatisfaction or problems
- PRAISE: Positive feedback or compliments
- OTHER: Everything else

Respond ONLY with the JSON object, no other text.`;
  }

  /**
   * Build response generation prompt
   */
  private buildResponseGenerationPrompt(
    message: string,
    intent: IntentType,
    product: Product | null,
  ): string {
    const productInfo = product
      ? `Product: ${product.name}
Description: ${product.description}
Price: $${product.price.amountMicros / 1000000} ${product.price.currencyCode}
Link: ${product.purchaseLink}`
      : 'No specific product context';

    return `You are an AI assistant helping a content creator respond to viewers during a live stream.

User message: "${message}"
Detected intent: ${intent}
${productInfo}

Generate a friendly, concise response (max 280 characters) that:
1. Directly addresses the user's message
2. Provides helpful information about the product (if applicable)
3. Includes the product link if relevant
4. Is conversational and engaging
5. Encourages purchase without being pushy

Respond with ONLY the message text, no extra formatting or quotes.`;
  }

  /**
   * Build lead scoring prompt
   */
  private buildLeadScoringPrompt(
    messages: Array<{ text: string; intent: IntentType }>,
  ): string {
    const messageHistory = messages
      .map((m, i) => `${i + 1}. [${m.intent}] ${m.text}`)
      .join('\n');

    return `You are an AI assistant scoring lead quality for a content creator selling products.

Message history:
${messageHistory}

Analyze this interaction and provide a lead score from 0-100 based on:
- Purchase intent signals (40 points)
- Engagement level (30 points)
- Specificity of questions (20 points)
- Positive sentiment (10 points)

Scoring guide:
- 0-25: Cold lead (minimal engagement, no purchase signals)
- 26-50: Warm lead (engaged but no clear purchase intent)
- 51-75: Hot lead (strong interest, asking about purchase details)
- 76-100: Very hot lead (ready to buy, asking how to purchase)

Respond with ONLY a number from 0 to 100, no other text.`;
  }

  /**
   * Build product matching prompt
   */
  private buildProductMatchingPrompt(
    message: string,
    products: Product[],
  ): string {
    const productList = products
      .map((p) => `- ID: ${p.id}, Name: ${p.name}, Description: ${p.description}`)
      .join('\n');

    return `You are an AI assistant matching user messages to products.

Available products:
${productList}

User message: "${message}"

Which product is the user asking about? Consider:
- Direct product name mentions
- Description keywords
- Fuzzy matching (e.g., "blue hoodie" matches "Ocean Blue Pullover Hoodie")

Respond with ONLY the product ID if there's a match, or "NONE" if no clear match.`;
  }

  /**
   * Parse intent detection response
   */
  private parseIntentResponse(response: string): IntentDetectionResult {
    try {
      const json = JSON.parse(response);

      return {
        intent: json.intent || 'OTHER',
        confidence: Math.max(0, Math.min(1, json.confidence || 0)),
        extractedProductName: json.extractedProductName || undefined,
        leadScore: Math.max(0, Math.min(100, json.leadScore || 50)),
        requiresHumanReview: json.requiresHumanReview || false,
      };
    } catch (error) {
      this.logger.error('Error parsing intent response', error);
      return {
        intent: 'OTHER',
        confidence: 0,
        leadScore: 0,
        requiresHumanReview: true,
      };
    }
  }

  /**
   * Extract response text
   */
  private extractResponse(response: string): string {
    return response.trim().replace(/^["']|["']$/g, '');
  }

  /**
   * Extract lead score
   */
  private extractLeadScore(response: string): number {
    const score = parseInt(response.trim(), 10);
    return Math.max(0, Math.min(100, isNaN(score) ? 50 : score));
  }

  /**
   * Extract product ID
   */
  private extractProductId(response: string): string | null {
    const id = response.trim();
    return id === 'NONE' ? null : id;
  }
}
