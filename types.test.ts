import { describe, it, expect } from 'vitest';
import type { AiInsight } from './types';

describe('Type Definitions', () => {
  describe('AiInsight', () => {
    it('should have rating property', () => {
      const insight: AiInsight = {
        rating: 'High',
        cashForecast: 50000,
        summary: 'Test summary',
      };
      
      expect(insight).toHaveProperty('rating');
      expect(typeof insight.rating).toBe('string');
    });

    it('should have cashForecast property', () => {
      const insight: AiInsight = {
        rating: 'Medium',
        cashForecast: 25000,
        summary: 'Test summary',
      };
      
      expect(insight).toHaveProperty('cashForecast');
      expect(typeof insight.cashForecast).toBe('number');
    });

    it('should have summary property', () => {
      const insight: AiInsight = {
        rating: 'Low',
        cashForecast: 5000,
        summary: 'Test summary',
      };
      
      expect(insight).toHaveProperty('summary');
      expect(typeof insight.summary).toBe('string');
    });

    it('should accept valid rating values', () => {
      const validRatings: AiInsight['rating'][] = ['High', 'Medium', 'Low'];
      
      for (const rating of validRatings) {
        const insight: AiInsight = {
          rating,
          cashForecast: 50000,
          summary: 'Test',
        };
        expect(insight.rating).toBe(rating);
      }
    });

    it('should accept non-negative cash forecast', () => {
      const testValues = [0, 1000, 50000, 1000000];
      
      for (const value of testValues) {
        const insight: AiInsight = {
          rating: 'High',
          cashForecast: value,
          summary: 'Test',
        };
        expect(insight.cashForecast).toBeGreaterThanOrEqual(0);
      }
    });

    it('should accept any string for summary', () => {
      const testSummaries = [
        'Short summary',
        'A much longer summary with more details about the lead and analysis',
        'Summary with special chars: !@#$%^&*()',
      ];
      
      for (const summary of testSummaries) {
        const insight: AiInsight = {
          rating: 'High',
          cashForecast: 50000,
          summary,
        };
        expect(insight.summary).toBe(summary);
      }
    });

    it('should create valid AiInsight objects', () => {
      const insights: AiInsight[] = [
        {
          rating: 'High',
          cashForecast: 100000,
          summary: 'Enterprise prospect with strong budget',
        },
        {
          rating: 'Medium',
          cashForecast: 50000,
          summary: 'Mid-market opportunity',
        },
        {
          rating: 'Low',
          cashForecast: 10000,
          summary: 'Small business, long sales cycle',
        },
      ];
      
      expect(insights).toHaveLength(3);
      insights.forEach(insight => {
        expect(insight).toHaveProperty('rating');
        expect(insight).toHaveProperty('cashForecast');
        expect(insight).toHaveProperty('summary');
      });
    });
  });

  describe('AiInsight validation', () => {
    it('should validate complete AiInsight object', () => {
      const insight: AiInsight = {
        rating: 'High',
        cashForecast: 50000,
        summary: 'Valid insight',
      };

      const isValid =
        !!insight.rating &&
        typeof insight.cashForecast === 'number' &&
        !!insight.summary;

      expect(isValid).toBe(true);
    });

    it('should have all required properties', () => {
      const insight: AiInsight = {
        rating: 'High',
        cashForecast: 50000,
        summary: 'Test',
      };
      
      const requiredProps = ['rating', 'cashForecast', 'summary'];
      requiredProps.forEach(prop => {
        expect(insight).toHaveProperty(prop);
      });
    });

    it('should not have extra properties', () => {
      const insight: AiInsight = {
        rating: 'High',
        cashForecast: 50000,
        summary: 'Test',
      };
      
      const keys = Object.keys(insight);
      expect(keys).toHaveLength(3);
      expect(keys.sort()).toEqual(['cashForecast', 'rating', 'summary'].sort());
    });
  });
});

