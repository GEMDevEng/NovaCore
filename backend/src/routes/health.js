import express from 'express';
import aiService from '../services/aiService.js';

const router = express.Router();

/**
 * GET /api/v1/health
 * Overall system health check
 */
router.get('/', async (req, res) => {
  try {
    const aiHealthy = await aiService.healthCheck();
    const providerInfo = aiService.getProviderInfo();

    const overallStatus = aiHealthy ? 'healthy' : 'degraded';

    res.status(aiHealthy ? 200 : 503).json({
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        ai: {
          status: aiHealthy ? 'healthy' : 'unhealthy',
          ...providerInfo,
        },
        api: {
          status: 'healthy',
          version: '1.0.0',
        },
      },
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
      },
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

/**
 * GET /api/v1/health/ready
 * Readiness probe for Kubernetes/container orchestration
 */
router.get('/ready', async (req, res) => {
  try {
    const aiHealthy = await aiService.healthCheck();

    if (aiHealthy) {
      res.status(200).json({ ready: true });
    } else {
      res.status(503).json({ ready: false, reason: 'AI service not ready' });
    }
  } catch (error) {
    res.status(503).json({ ready: false, reason: error.message });
  }
});

/**
 * GET /api/v1/health/live
 * Liveness probe for Kubernetes/container orchestration
 */
router.get('/live', (req, res) => {
  res.status(200).json({ alive: true });
});

export default router;

