import express from 'express';
import { ApiError } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * In-memory storage for analytics data
 */
const analyticsStore = {
  conversionRate: 32.5,
  totalLeads: 245,
  convertedLeads: 79,
  averageDealSize: 45000,
  revenueGrowth: 18.5,
  lastUpdated: new Date().toISOString(),
};

/**
 * GET /api/v1/analytics/summary
 * Get analytics summary data
 */
router.get('/summary', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: analyticsStore,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics summary',
    });
  }
});

/**
 * GET /api/v1/analytics/conversion-trend
 * Get conversion rate trend data
 */
router.get('/conversion-trend', (req, res) => {
  try {
    const conversionTrendData = [
      { month: 'Jan', rate: 22 },
      { month: 'Feb', rate: 25 },
      { month: 'Mar', rate: 28 },
      { month: 'Apr', rate: 30 },
      { month: 'May', rate: 31 },
      { month: 'Jun', rate: 32.5 },
    ];

    res.status(200).json({
      success: true,
      data: conversionTrendData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch conversion trend',
    });
  }
});

/**
 * GET /api/v1/analytics/revenue-trend
 * Get revenue trend data
 */
router.get('/revenue-trend', (req, res) => {
  try {
    const revenueTrendData = [
      { month: 'Jan', revenue: 45000 },
      { month: 'Feb', revenue: 52000 },
      { month: 'Mar', revenue: 58000 },
      { month: 'Apr', revenue: 65000 },
      { month: 'May', revenue: 72000 },
      { month: 'Jun', revenue: 85000 },
    ];

    res.status(200).json({
      success: true,
      data: revenueTrendData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch revenue trend',
    });
  }
});

/**
 * GET /api/v1/analytics/lead-sources
 * Get lead source distribution
 */
router.get('/lead-sources', (req, res) => {
  try {
    const leadSourceData = [
      { name: 'Web', value: 45 },
      { name: 'Email', value: 30 },
      { name: 'Phone', value: 15 },
      { name: 'Referral', value: 10 },
    ];

    res.status(200).json({
      success: true,
      data: leadSourceData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch lead sources',
    });
  }
});

export default router;

