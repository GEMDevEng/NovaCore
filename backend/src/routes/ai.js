import express from 'express';
import Joi from 'joi';
import aiService from '../services/aiService.js';
import { ApiError } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * Validation schemas
 */
const querySchema = Joi.object({
  prompt: Joi.string().required().min(1).max(5000),
});

/**
 * POST /api/v1/ai/query
 * Get business insights for a lead
 * 
 * Request body:
 * {
 *   "prompt": "Lead information to analyze"
 * }
 * 
 * Response:
 * {
 *   "rating": "High|Medium|Low",
 *   "cashForecast": 50000,
 *   "summary": "Analysis summary",
 *   "provider": "cohere",
 *   "timestamp": "2025-10-29T..."
 * }
 */
router.post('/query', async (req, res, next) => {
  try {
    // Validate request
    const { error, value } = querySchema.validate(req.body);
    if (error) {
      const err = new ApiError(error.message, 400, 'VALIDATION_ERROR');
      err.isJoi = true;
      err.details = error.details;
      throw err;
    }

    // Get insights
    const insights = await aiService.getBusinessInsights(value.prompt);

    res.status(200).json({
      success: true,
      data: insights,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/ai/health
 * Check AI service health
 * 
 * Response:
 * {
 *   "status": "healthy|unhealthy",
 *   "provider": "cohere",
 *   "model": "command-r-plus",
 *   "timestamp": "2025-10-29T..."
 * }
 */
router.get('/health', async (req, res, next) => {
  try {
    const isHealthy = await aiService.healthCheck();
    const providerInfo = aiService.getProviderInfo();

    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      ...providerInfo,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/ai/provider
 * Get current AI provider information
 * 
 * Response:
 * {
 *   "provider": "cohere",
 *   "model": "command-r-plus",
 *   "status": "initialized"
 * }
 */
router.get('/provider', (req, res) => {
  const providerInfo = aiService.getProviderInfo();
  res.status(200).json({
    success: true,
    data: providerInfo,
  });
});

/**
 * POST /api/v1/ai/batch
 * Process multiple queries in batch
 * 
 * Request body:
 * {
 *   "queries": [
 *     { "prompt": "Lead 1 info" },
 *     { "prompt": "Lead 2 info" }
 *   ]
 * }
 * 
 * Response:
 * {
 *   "results": [
 *     { "rating": "High", "cashForecast": 50000, "summary": "..." },
 *     { "rating": "Medium", "cashForecast": 25000, "summary": "..." }
 *   ]
 * }
 */
router.post('/batch', async (req, res, next) => {
  try {
    const { queries } = req.body;

    if (!Array.isArray(queries) || queries.length === 0) {
      throw new ApiError(
        'Queries must be a non-empty array',
        400,
        'INVALID_QUERIES'
      );
    }

    if (queries.length > 10) {
      throw new ApiError(
        'Maximum 10 queries per batch',
        400,
        'BATCH_TOO_LARGE'
      );
    }

    const results = await Promise.all(
      queries.map(q => aiService.getBusinessInsights(q.prompt))
    );

    res.status(200).json({
      success: true,
      data: {
        count: results.length,
        results,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;

