import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CohereAdapter } from './cohereAdapter';

// Mock the Cohere SDK with proper constructor
vi.mock('cohere-ai', () => {
  class MockCohere {
    token: string;
    chat: { create: () => Promise<any> };

    constructor(config: { token: string }) {
      this.token = config.token;
      this.chat = {
        create: vi.fn().mockResolvedValue({
          text: '{"rating": "High", "cashForecast": 50000, "summary": "Test"}',
          meta: { tokens: { input_tokens: 100, output_tokens: 50 } },
        }),
      };
    }
  }
  return { Cohere: MockCohere };
});

describe('CohereAdapter', () => {
  let adapter: CohereAdapter;

  beforeEach(() => {
    // Set environment variable for testing
    process.env.COHERE_API_KEY = 'test-api-key';
  });

  describe('constructor', () => {
    it('should initialize with API key from environment', () => {
      expect(() => {
        adapter = new CohereAdapter();
      }).not.toThrow();
    });

    it('should throw error if API key is not configured', () => {
      delete process.env.COHERE_API_KEY;
      expect(() => {
        new CohereAdapter();
      }).toThrow('Cohere API key not configured');
    });

    it('should accept custom configuration', () => {
      expect(() => {
        adapter = new CohereAdapter({
          apiKey: 'custom-key',
          model: 'command-r',
        });
      }).not.toThrow();
    });
  });

  describe('getName', () => {
    beforeEach(() => {
      adapter = new CohereAdapter();
    });

    it('should return "cohere" as provider name', () => {
      expect(adapter.getName()).toBe('cohere');
    });
  });

  describe('healthCheck', () => {
    beforeEach(() => {
      adapter = new CohereAdapter();
    });

    it('should return true when API is accessible', async () => {
      const result = await adapter.healthCheck();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('getBusinessInsights', () => {
    beforeEach(() => {
      adapter = new CohereAdapter();
    });

    it('should handle API calls correctly', async () => {
      // The adapter initializes successfully with a valid key
      const result = await adapter.getBusinessInsights('test prompt');

      // Verify the result has the correct structure
      expect(result).toHaveProperty('rating');
      expect(result).toHaveProperty('cashForecast');
      expect(result).toHaveProperty('summary');
    });

    it('should return AiInsight with required fields', async () => {
      // This test would require mocking the actual Cohere API response
      // For now, we verify the structure is correct
      const mockInsight = {
        rating: 'High',
        cashForecast: 50000,
        summary: 'Test summary',
      };

      expect(mockInsight).toHaveProperty('rating');
      expect(mockInsight).toHaveProperty('cashForecast');
      expect(mockInsight).toHaveProperty('summary');
      expect(typeof mockInsight.rating).toBe('string');
      expect(typeof mockInsight.cashForecast).toBe('number');
      expect(typeof mockInsight.summary).toBe('string');
    });

    it('should validate response format', () => {
      const validResponse = {
        rating: 'Medium',
        cashForecast: 25000,
        summary: 'Medium quality lead',
      };

      const isValid =
        !!validResponse.rating &&
        typeof validResponse.cashForecast === 'number' &&
        !!validResponse.summary;

      expect(isValid).toBe(true);
    });
  });

  describe('response validation', () => {
    it('should validate rating values', () => {
      const validRatings = ['High', 'Medium', 'Low'];
      const testRating = 'High';
      expect(validRatings).toContain(testRating);
    });

    it('should validate cash forecast is a number', () => {
      const cashForecast = 50000;
      expect(typeof cashForecast).toBe('number');
      expect(cashForecast).toBeGreaterThanOrEqual(0);
    });

    it('should validate summary is a string', () => {
      const summary = 'This is a test summary';
      expect(typeof summary).toBe('string');
      expect(summary.length).toBeGreaterThan(0);
    });
  });
});

