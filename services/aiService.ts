/**
 * Provider-agnostic AI Service
 * 
 * This service provides a unified interface for AI operations, abstracting away
 * the specific provider implementation (Gemini, Groq, etc.). This allows for
 * easy switching between providers without changing frontend code.
 */

import { AiInsight } from '../types';
import { getProvider } from './providers';

/**
 * Get business insights from the configured AI provider
 * 
 * @param prompt - The lead information or query to analyze
 * @returns Promise<AiInsight> - The AI analysis result
 * @throws Error if the AI provider fails or is not configured
 */
export const getBusinessInsights = async (prompt: string): Promise<AiInsight> => {
  try {
    const provider = getProvider();
    return await provider.getBusinessInsights(prompt);
  } catch (error) {
    console.error("Error calling AI provider:", error);
    throw new Error("Failed to get insights from AI.");
  }
};

/**
 * Get the name of the currently active AI provider
 * 
 * @returns string - The name of the active provider (e.g., 'gemini', 'groq')
 */
export const getActiveProvider = (): string => {
  const provider = getProvider();
  return provider.getName();
};

/**
 * Health check for the AI provider
 * Verifies that the provider is properly configured and accessible
 * 
 * @returns Promise<boolean> - True if provider is healthy, false otherwise
 */
export const checkProviderHealth = async (): Promise<boolean> => {
  try {
    const provider = getProvider();
    return await provider.healthCheck();
  } catch (error) {
    console.error("Provider health check failed:", error);
    return false;
  }
};

