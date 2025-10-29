/**
 * Provider Interface Types
 * 
 * Defines the contract that all AI providers must implement
 */

import { AiInsight } from '../../types';

/**
 * Base interface for all AI providers
 * Any new provider must implement these methods
 */
export interface IAiProvider {
  /**
   * Get business insights from the provider
   * @param prompt - The lead information or query to analyze
   * @returns Promise<AiInsight> - The AI analysis result
   */
  getBusinessInsights(prompt: string): Promise<AiInsight>;

  /**
   * Get the name of the provider
   * @returns string - Provider name (e.g., 'gemini', 'groq')
   */
  getName(): string;

  /**
   * Health check for the provider
   * Verifies that the provider is properly configured and accessible
   * @returns Promise<boolean> - True if provider is healthy
   */
  healthCheck(): Promise<boolean>;
}

/**
 * Provider configuration options
 */
export interface ProviderConfig {
  apiKey?: string;
  model?: string;
  timeout?: number;
  apiUrl?: string;  // For backend adapter
}

