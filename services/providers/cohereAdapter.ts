/**
 * Cohere AI Provider Adapter
 * 
 * Implements the IAiProvider interface for Cohere's API
 * Uses the Command R or Command R Plus model for business insights
 */

import { Cohere } from 'cohere-ai';
import { AiInsight } from '../../types';
import { IAiProvider, ProviderConfig } from './types';

export class CohereAdapter implements IAiProvider {
  private apiKey: string;
  private model: string = 'command-r-plus';
  private client: Cohere | null = null;

  constructor(config?: ProviderConfig) {
    this.apiKey = config?.apiKey || process.env.COHERE_API_KEY || '';
    if (config?.model) {
      this.model = config.model;
    }

    if (!this.apiKey) {
      throw new Error('Cohere API key not configured. Set COHERE_API_KEY environment variable.');
    }

    this.client = new Cohere({ token: this.apiKey });
  }

  async getBusinessInsights(prompt: string): Promise<AiInsight> {
    if (!this.client) {
      throw new Error('Cohere client not initialized');
    }

    console.log("Querying Cohere with prompt:", prompt);

    try {
      const systemPrompt = `You are a business intelligence expert specializing in lead qualification and cash flow forecasting. 
Based on the provided lead information, analyze and respond with a JSON object containing:
1. rating: Lead quality rating (High, Medium, or Low)
2. cashForecast: Estimated cash flow from this lead (as a number)
3. summary: A brief 1-2 sentence summary of the lead qualification

Respond ONLY with valid JSON, no additional text.`;

      const userMessage = `Lead Information: "${prompt}"

Please analyze this lead and provide your assessment in JSON format with the fields: rating, cashForecast, and summary.`;

      const response = await this.client.chat.create({
        model: this.model,
        messages: [
          {
            role: 'user',
            content: userMessage,
          },
        ],
        system: systemPrompt,
        temperature: 0.7,
        maxTokens: 1024,
      });

      // Extract the text content from the response
      const responseText = response.text || '';
      
      // Parse the JSON response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in Cohere response');
      }

      const result = JSON.parse(jsonMatch[0]);
      
      // Validate the response structure
      if (!result.rating || result.cashForecast === undefined || !result.summary) {
        throw new Error('Invalid response structure from Cohere');
      }

      // Ensure cashForecast is a number
      const cashForecast = typeof result.cashForecast === 'string' 
        ? parseInt(result.cashForecast, 10) 
        : result.cashForecast;

      return {
        rating: result.rating,
        cashForecast,
        summary: result.summary,
      } as AiInsight;
    } catch (error) {
      console.error("Error calling Cohere API:", error);
      throw new Error("Failed to get insights from Cohere API.");
    }
  }

  getName(): string {
    return 'cohere';
  }

  async healthCheck(): Promise<boolean> {
    try {
      if (!this.client) {
        return false;
      }

      // Simple health check by attempting a minimal request
      const response = await this.client.chat.create({
        model: this.model,
        messages: [
          {
            role: 'user',
            content: "Say 'OK'",
          },
        ],
        maxTokens: 10,
      });

      return !!response.text;
    } catch (error) {
      console.error("Cohere health check failed:", error);
      return false;
    }
  }
}

