/**
 * Backend API Provider Adapter
 * 
 * Implements the IAiProvider interface by calling the NovaCore backend API
 * This allows the frontend to delegate AI operations to the backend
 * 
 * Benefits:
 * - API key secure on backend
 * - Lead persistence
 * - Scalable
 * - Batch processing
 * - Analytics
 */

import { AiInsight } from '../../types';
import { IAiProvider, ProviderConfig } from './types';

export class BackendAdapter implements IAiProvider {
  private apiUrl: string;

  constructor(config?: ProviderConfig) {
    // Get API URL from config, environment variable, or default to localhost
    this.apiUrl = config?.apiUrl || 
                  process.env.VITE_API_URL || 
                  'http://localhost:3001';
    
    // Remove trailing slash if present
    if (this.apiUrl.endsWith('/')) {
      this.apiUrl = this.apiUrl.slice(0, -1);
    }
  }

  async getBusinessInsights(prompt: string): Promise<AiInsight> {
    if (!prompt || typeof prompt !== 'string') {
      throw new Error('Prompt must be a non-empty string');
    }

    try {
      const response = await fetch(`${this.apiUrl}/api/v1/ai/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || 
          `Backend API error: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      
      // Extract data from response
      const data = result.data || result;
      
      // Validate response structure
      if (!data.rating || data.cashForecast === undefined || !data.summary) {
        throw new Error('Invalid response structure from backend API');
      }

      return {
        rating: data.rating,
        cashForecast: typeof data.cashForecast === 'string' 
          ? parseInt(data.cashForecast, 10) 
          : data.cashForecast,
        summary: data.summary,
      } as AiInsight;
    } catch (error) {
      console.error('Error calling backend API:', error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Failed to get insights from backend API'
      );
    }
  }

  getName(): string {
    return 'backend';
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/api/v1/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`Backend health check failed: ${response.status}`);
        return false;
      }

      const data = await response.json();
      return data.status === 'healthy' || data.ready === true;
    } catch (error) {
      console.error('Backend health check error:', error);
      return false;
    }
  }

  /**
   * Get the backend API URL
   * Useful for debugging and configuration verification
   */
  getApiUrl(): string {
    return this.apiUrl;
  }
}

