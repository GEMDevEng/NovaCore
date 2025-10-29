import { Cohere } from 'cohere-ai';
import { ApiError } from '../middleware/errorHandler.js';

/**
 * AI Service - Handles business intelligence queries
 * Integrates with Cohere API for lead qualification and insights
 */

class AiService {
  constructor() {
    this.client = null;
    this.provider = process.env.AI_PROVIDER || 'cohere';
    this.initializeClient();
  }

  initializeClient() {
    if (this.provider === 'cohere') {
      const apiKey = process.env.COHERE_API_KEY;
      if (!apiKey) {
        throw new ApiError(
          'COHERE_API_KEY not configured',
          500,
          'MISSING_API_KEY'
        );
      }
      this.client = new Cohere({ token: apiKey });
    }
  }

  /**
   * Get business insights for a lead
   * @param {string} prompt - The query prompt
   * @returns {Promise<Object>} - Business insights with rating, forecast, and summary
   */
  async getBusinessInsights(prompt) {
    if (!prompt || typeof prompt !== 'string') {
      throw new ApiError(
        'Prompt must be a non-empty string',
        400,
        'INVALID_PROMPT'
      );
    }

    if (prompt.length > 5000) {
      throw new ApiError(
        'Prompt exceeds maximum length of 5000 characters',
        400,
        'PROMPT_TOO_LONG'
      );
    }

    try {
      const systemPrompt = `You are a business intelligence expert. Analyze the provided lead information and return a JSON response with:
- rating: "High", "Medium", or "Low" (lead quality)
- cashForecast: estimated deal value in dollars (number)
- summary: brief analysis (string)

Return ONLY valid JSON, no additional text.`;

      const response = await this.client.chat.create({
        model: 'command-r-plus',
        messages: [
          {
            role: 'user',
            content: `${systemPrompt}\n\nLead Information:\n${prompt}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      });

      const content = response.text || '';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new ApiError(
          'Failed to parse AI response',
          500,
          'PARSE_ERROR'
        );
      }

      const insight = JSON.parse(jsonMatch[0]);

      // Validate response structure
      if (!insight.rating || !insight.cashForecast || !insight.summary) {
        throw new ApiError(
          'Invalid response structure from AI',
          500,
          'INVALID_RESPONSE'
        );
      }

      return {
        rating: insight.rating,
        cashForecast: Number(insight.cashForecast),
        summary: insight.summary,
        provider: this.provider,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      
      console.error('AI Service Error:', error);
      throw new ApiError(
        `AI service error: ${error.message}`,
        500,
        'AI_SERVICE_ERROR'
      );
    }
  }

  /**
   * Health check for AI service
   * @returns {Promise<boolean>}
   */
  async healthCheck() {
    try {
      if (!this.client) {
        return false;
      }
      // Simple test to verify API connectivity
      const response = await this.client.chat.create({
        model: 'command-r-plus',
        messages: [{ role: 'user', content: 'ping' }],
        max_tokens: 10,
      });
      return !!response;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  /**
   * Get provider information
   * @returns {Object}
   */
  getProviderInfo() {
    return {
      provider: this.provider,
      model: 'command-r-plus',
      status: this.client ? 'initialized' : 'not_initialized',
    };
  }
}

export default new AiService();

