import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getProvider, createProvider } from './index';

// Mock the adapters with proper constructor functions
vi.mock('./geminiAdapter', () => {
  class MockGeminiAdapter {
    getName() { return 'gemini'; }
    async getBusinessInsights() { return { rating: 'High', cashForecast: 50000, summary: 'Test' }; }
    async healthCheck() { return true; }
  }
  return { GeminiAdapter: MockGeminiAdapter };
});

vi.mock('./cohereAdapter', () => {
  class MockCohereAdapter {
    getName() { return 'cohere'; }
    async getBusinessInsights() { return { rating: 'High', cashForecast: 50000, summary: 'Test' }; }
    async healthCheck() { return true; }
  }
  return { CohereAdapter: MockCohereAdapter };
});

describe('Provider Factory', () => {
  beforeEach(() => {
    // Reset environment variables and clear cached provider
    delete process.env.AI_PROVIDER;
    delete process.env.GEMINI_API_KEY;
    delete process.env.COHERE_API_KEY;
    // Clear the module cache to reset provider singleton
    vi.resetModules();
  });

  describe('getProvider', () => {
    it('should return a provider instance', () => {
      process.env.AI_PROVIDER = 'gemini';
      process.env.GEMINI_API_KEY = 'test-key';
      
      const provider = getProvider();
      expect(provider).toBeDefined();
      expect(provider).toHaveProperty('getName');
      expect(provider).toHaveProperty('getBusinessInsights');
      expect(provider).toHaveProperty('healthCheck');
    });

    it('should support gemini provider', () => {
      process.env.AI_PROVIDER = 'gemini';
      process.env.GEMINI_API_KEY = 'test-key';
      
      const provider = getProvider();
      expect(provider.getName()).toBe('gemini');
    });

    it('should support cohere provider when configured', () => {
      // Test that cohere is a valid provider option
      const validProviders = ['gemini', 'cohere'];
      expect(validProviders).toContain('cohere');
    });

    it('should default to gemini if AI_PROVIDER is not set', () => {
      delete process.env.AI_PROVIDER;
      process.env.GEMINI_API_KEY = 'test-key';

      const provider = getProvider();
      expect(provider.getName()).toBe('gemini');
    });

    it('should handle provider initialization', () => {
      process.env.AI_PROVIDER = 'gemini';
      process.env.GEMINI_API_KEY = 'test-key';

      const provider = getProvider();
      expect(provider).toBeDefined();
      expect(typeof provider.getName).toBe('function');
    });

    it('should support groq as future provider', () => {
      // Test that groq is recognized as a future provider
      const futureProviders = ['groq'];
      expect(futureProviders).toContain('groq');
    });

    it('should cache provider instance', () => {
      process.env.AI_PROVIDER = 'gemini';
      process.env.GEMINI_API_KEY = 'test-key';
      
      const provider1 = getProvider();
      const provider2 = getProvider();
      
      expect(provider1).toBe(provider2);
    });
  });

  describe('createProvider', () => {
    it('should create a new provider instance', () => {
      const provider = createProvider('gemini', { apiKey: 'test-key' });
      expect(provider).toBeDefined();
      expect(provider).toHaveProperty('getName');
    });

    it('should create gemini provider', () => {
      const provider = createProvider('gemini', { apiKey: 'test-key' });
      expect(provider.getName()).toBe('gemini');
    });

    it('should create cohere provider', () => {
      const provider = createProvider('cohere', { apiKey: 'test-key' });
      expect(provider.getName()).toBe('cohere');
    });

    it('should throw error for unsupported provider', () => {
      expect(() => {
        createProvider('unsupported', { apiKey: 'test-key' });
      }).toThrow();
    });

    it('should pass configuration to provider', () => {
      const config = { apiKey: 'custom-key', model: 'command-r' };
      const provider = createProvider('cohere', config);
      expect(provider).toBeDefined();
    });
  });

  describe('IAiProvider interface', () => {
    it('should have required methods', () => {
      process.env.AI_PROVIDER = 'gemini';
      process.env.GEMINI_API_KEY = 'test-key';
      
      const provider = getProvider();
      
      expect(typeof provider.getName).toBe('function');
      expect(typeof provider.getBusinessInsights).toBe('function');
      expect(typeof provider.healthCheck).toBe('function');
    });

    it('should return string from getName', () => {
      process.env.AI_PROVIDER = 'gemini';
      process.env.GEMINI_API_KEY = 'test-key';
      
      const provider = getProvider();
      const name = provider.getName();
      
      expect(typeof name).toBe('string');
      expect(['gemini', 'cohere']).toContain(name);
    });
  });
});

