import express from 'express';
import { ApiError } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * In-memory storage for analytics data
 */
const analyticsStore = {
  conversionRate: 32.5,
  totalLeads: 487,
  convertedLeads: 158,
  averageDealSize: 52500,
  revenueGrowth: 28.3,
  monthlyRevenue: 8312500,
  quarterlyRevenue: 24937500,
  averageLeadValue: 10750,
  topSource: 'Website',
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
      { month: 'Jan', rate: 22, leads: 320, converted: 70 },
      { month: 'Feb', rate: 25, leads: 340, converted: 85 },
      { month: 'Mar', rate: 28, leads: 360, converted: 101 },
      { month: 'Apr', rate: 30, leads: 380, converted: 114 },
      { month: 'May', rate: 31, leads: 410, converted: 127 },
      { month: 'Jun', rate: 32.5, leads: 487, converted: 158 },
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
      { month: 'Jan', revenue: 3640000, deals: 70 },
      { month: 'Feb', revenue: 4420000, deals: 85 },
      { month: 'Mar', revenue: 5292000, deals: 101 },
      { month: 'Apr', revenue: 5985000, deals: 114 },
      { month: 'May', revenue: 6682500, deals: 127 },
      { month: 'Jun', revenue: 8312500, deals: 158 },
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
      { name: 'Website', value: 215, percentage: 44.1, revenue: 3665625 },
      { name: 'Email Campaign', value: 146, percentage: 29.9, revenue: 2481750 },
      { name: 'Social Media', value: 73, percentage: 15.0, revenue: 1243875 },
      { name: 'Referral', value: 36, percentage: 7.4, revenue: 612500 },
      { name: 'Phone', value: 17, percentage: 3.5, revenue: 289375 },
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

