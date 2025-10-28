/**
 * Google Gemini AI Provider Adapter
 * 
 * Implements the IAiProvider interface for Google's Gemini API
 * This adapter maintains backward compatibility with the existing Gemini integration
 */

import { GoogleGenAI, Type } from "@google/genai";
import { AiInsight } from '../../types';
import { IAiProvider, ProviderConfig } from './types';

export class GeminiAdapter implements IAiProvider {
  private apiKey: string;
  private model: string = "gemini-2.5-flash";
  private client: GoogleGenAI | null = null;

  constructor(config?: ProviderConfig) {
    this.apiKey = config?.apiKey || process.env.GEMINI_API_KEY || process.env.API_KEY || '';
    if (config?.model) {
      this.model = config.model;
    }

    if (!this.apiKey) {
      throw new Error('Gemini API key not configured. Set GEMINI_API_KEY or API_KEY environment variable.');
    }

    this.client = new GoogleGenAI({ apiKey: this.apiKey });
  }

  async getBusinessInsights(prompt: string): Promise<AiInsight> {
    if (!this.client) {
      throw new Error('Gemini client not initialized');
    }

    console.log("Querying Gemini with prompt:", prompt);

    try {
      const response = await this.client.models.generateContent({
        model: this.model,
        contents: `Based on the following lead information, provide a qualification rating, a cash forecast, and a brief summary. Lead info: "${prompt}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              rating: { type: Type.STRING, description: 'Lead rating (e.g., High, Medium, Low)' },
              cashForecast: { type: Type.NUMBER, description: 'Estimated cash flow from this lead' },
              summary: { type: Type.STRING, description: 'A brief summary of the lead qualification.' },
            },
            required: ['rating', 'cashForecast', 'summary'],
          },
        },
      });

      const result = JSON.parse(response.text);
      return result as AiInsight;
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      throw new Error("Failed to get insights from Gemini API.");
    }
  }

  getName(): string {
    return 'gemini';
  }

  async healthCheck(): Promise<boolean> {
    try {
      if (!this.client) {
        return false;
      }
      // Simple health check by attempting a minimal request
      const response = await this.client.models.generateContent({
        model: this.model,
        contents: "Say 'OK'",
      });
      return !!response.text;
    } catch (error) {
      console.error("Gemini health check failed:", error);
      return false;
    }
  }
}

