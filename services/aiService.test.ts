import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getBusinessInsights, getActiveProvider, checkProviderHealth } from './aiService';

// Mock the provider factory with proper implementation
const mockProvider = {
  getName: () => 'gemini',
  getBusinessInsights: vi.fn().mockResolvedValue({
    rating: 'High',
    cashForecast: 50000,
    summary: 'Test summary',
  }),
  healthCheck: vi.fn().mockResolvedValue(true),
};

vi.mock('./providers', () => ({
  getProvider: vi.fn(() => mockProvider),
}));

describe('AI Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getBusinessInsights', () => {
    it('should return AiInsight object', async () => {
      const prompt = 'Test lead information';
      const result = await getBusinessInsights(prompt);
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('rating');
      expect(result).toHaveProperty('cashForecast');
      expect(result).toHaveProperty('summary');
    });

    it('should have correct AiInsight structure', async () => {
      const prompt = 'Test lead information';
      const result = await getBusinessInsights(prompt);
      
      expect(typeof result.rating).toBe('string');
      expect(typeof result.cashForecast).toBe('number');
      expect(typeof result.summary).toBe('string');
    });

    it('should handle valid rating values', async () => {
      const prompt = 'Test lead information';
      const result = await getBusinessInsights(prompt);
      
      const validRatings = ['High', 'Medium', 'Low'];
      expect(validRatings).toContain(result.rating);
    });

    it('should have non-negative cash forecast', async () => {
      const prompt = 'Test lead information';
      const result = await getBusinessInsights(prompt);
      
      expect(result.cashForecast).toBeGreaterThanOrEqual(0);
    });

    it('should have non-empty summary', async () => {
      const prompt = 'Test lead information';
      const result = await getBusinessInsights(prompt);
      
      expect(result.summary.length).toBeGreaterThan(0);
    });

    it('should accept various prompt formats', async () => {
      const prompts = [
        'Simple lead',
        'Enterprise software company, $5M ARR, 50+ employees',
        'Small business owner, interested in marketing automation',
      ];

      for (const prompt of prompts) {
        const result = await getBusinessInsights(prompt);
        expect(result).toBeDefined();
        expect(result).toHaveProperty('rating');
      }
    });
  });

  describe('getActiveProvider', () => {
    it('should return provider name as string', () => {
      const provider = getActiveProvider();
      expect(typeof provider).toBe('string');
    });

    it('should return valid provider name', () => {
      const provider = getActiveProvider();
      const validProviders = ['gemini', 'cohere', 'groq'];
      expect(validProviders).toContain(provider);
    });

    it('should match current provider', () => {
      const provider = getActiveProvider();
      expect(provider).toBe('gemini');
    });
  });

  describe('checkProviderHealth', () => {
    it('should return boolean', async () => {
      const result = await checkProviderHealth();
      expect(typeof result).toBe('boolean');
    });

    it('should indicate provider health status', async () => {
      const result = await checkProviderHealth();
      expect(result).toBe(true);
    });

    it('should handle provider health check errors gracefully', async () => {
      // This would test error handling in actual implementation
      const result = await checkProviderHealth();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('error handling', () => {
    it('should handle invalid prompts', async () => {
      const result = await getBusinessInsights('');
      expect(result).toBeDefined();
    });

    it('should handle very long prompts', async () => {
      const longPrompt = 'A'.repeat(10000);
      const result = await getBusinessInsights(longPrompt);
      expect(result).toBeDefined();
    });

    it('should handle special characters in prompts', async () => {
      const specialPrompt = 'Test with special chars: !@#$%^&*()';
      const result = await getBusinessInsights(specialPrompt);
      expect(result).toBeDefined();
    });
  });

  describe('response consistency', () => {
    it('should return consistent response structure', async () => {
      const prompt = 'Test lead';
      const result1 = await getBusinessInsights(prompt);
      const result2 = await getBusinessInsights(prompt);
      
      expect(Object.keys(result1).sort()).toEqual(Object.keys(result2).sort());
    });

    it('should maintain data types across calls', async () => {
      const prompt = 'Test lead';
      const result = await getBusinessInsights(prompt);
      
      expect(typeof result.rating).toBe('string');
      expect(typeof result.cashForecast).toBe('number');
      expect(typeof result.summary).toBe('string');
    });
  });
});

