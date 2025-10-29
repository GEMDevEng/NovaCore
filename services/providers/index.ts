/**
 * AI Provider Factory
 * 
 * Manages provider selection and instantiation
 * Supports multiple providers with easy switching via environment variables
 */

import { IAiProvider, ProviderConfig } from './types';
import { GeminiAdapter } from './geminiAdapter';
import { CohereAdapter } from './cohereAdapter';

// Singleton instance of the current provider
let currentProvider: IAiProvider | null = null;

/**
 * Get the active AI provider
 * 
 * Uses the AI_PROVIDER environment variable to determine which provider to use.
 * Defaults to 'gemini' for backward compatibility.
 * 
 * Supported providers:
 * - 'gemini': Google Gemini API (default)
 * - 'cohere': Cohere API (Phase 3)
 * - 'groq': Groq API (future)
 * 
 * @returns IAiProvider - The configured AI provider instance
 * @throws Error if the provider is not supported or not configured
 */
export function getProvider(): IAiProvider {
  if (currentProvider) {
    return currentProvider;
  }

  const providerName = (process.env.AI_PROVIDER || 'gemini').toLowerCase();

  try {
    switch (providerName) {
      case 'gemini':
        currentProvider = new GeminiAdapter();
        break;

      case 'cohere':
        currentProvider = new CohereAdapter();
        break;

      case 'groq':
        // Groq provider will be implemented in future phases
        throw new Error('Groq provider not yet implemented. Use AI_PROVIDER=gemini, cohere, or leave unset.');

      default:
        throw new Error(`Unknown AI provider: ${providerName}. Supported providers: gemini, cohere`);
    }

    console.log(`AI Provider initialized: ${providerName}`);
    return currentProvider;
  } catch (error) {
    console.error(`Failed to initialize AI provider (${providerName}):`, error);
    throw error;
  }
}

/**
 * Set a custom provider instance
 * Useful for testing or advanced configurations
 * 
 * @param provider - The provider instance to use
 */
export function setProvider(provider: IAiProvider): void {
  currentProvider = provider;
  console.log(`AI Provider set to: ${provider.getName()}`);
}

/**
 * Reset the provider to null
 * Forces re-initialization on next getProvider() call
 */
export function resetProvider(): void {
  currentProvider = null;
}

/**
 * Create a provider instance with custom configuration
 * 
 * @param providerName - The name of the provider ('gemini', 'groq', etc.)
 * @param config - Optional configuration for the provider
 * @returns IAiProvider - The configured provider instance
 * @throws Error if the provider is not supported
 */
export function createProvider(providerName: string, config?: ProviderConfig): IAiProvider {
  const name = providerName.toLowerCase();

  switch (name) {
    case 'gemini':
      return new GeminiAdapter(config);

    case 'cohere':
      return new CohereAdapter(config);

    case 'groq':
      throw new Error('Groq provider not yet implemented.');

    default:
      throw new Error(`Unknown AI provider: ${name}`);
  }
}

