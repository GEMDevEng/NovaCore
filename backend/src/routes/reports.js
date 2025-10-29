import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Joi from 'joi';
import { ApiError } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * In-memory storage for reports
 */
const reportsStore = new Map();

// Initialize with sample reports
const initializeReports = () => {
  const sampleReports = [
    { id: uuidv4(), name: 'Q3 Performance Summary', source: 'web', leads: 215, converted: 70, revenue: 3640000, date: '2025-09-30', status: 'completed' },
    { id: uuidv4(), name: 'September Email Campaign', source: 'email', leads: 146, converted: 38, revenue: 1995000, date: '2025-09-28', status: 'completed' },
    { id: uuidv4(), name: 'Social Media Outreach', source: 'web', leads: 73, converted: 18, revenue: 945000, date: '2025-09-25', status: 'completed' },
    { id: uuidv4(), name: 'Referral Program Results', source: 'referral', leads: 36, converted: 12, revenue: 630000, date: '2025-09-20', status: 'completed' },
    { id: uuidv4(), name: 'Phone Outreach Campaign', source: 'phone', leads: 17, converted: 5, revenue: 262500, date: '2025-09-18', status: 'completed' },
    { id: uuidv4(), name: 'August Performance Report', source: 'web', leads: 195, converted: 58, revenue: 3045000, date: '2025-08-31', status: 'completed' },
    { id: uuidv4(), name: 'August Email Blast', source: 'email', leads: 128, converted: 32, revenue: 1680000, date: '2025-08-28', status: 'completed' },
    { id: uuidv4(), name: 'LinkedIn Campaign', source: 'web', leads: 89, converted: 22, revenue: 1155000, date: '2025-08-25', status: 'completed' },
    { id: uuidv4(), name: 'Partner Referrals', source: 'referral', leads: 42, converted: 14, revenue: 735000, date: '2025-08-20', status: 'completed' },
    { id: uuidv4(), name: 'July Monthly Summary', source: 'web', leads: 180, converted: 52, revenue: 2730000, date: '2025-07-31', status: 'completed' },
    { id: uuidv4(), name: 'July Email Marketing', source: 'email', leads: 112, converted: 28, revenue: 1470000, date: '2025-07-28', status: 'completed' },
    { id: uuidv4(), name: 'Trade Show Leads', source: 'referral', leads: 54, converted: 18, revenue: 945000, date: '2025-07-22', status: 'completed' },
    { id: uuidv4(), name: 'Q2 Final Report', source: 'web', leads: 165, converted: 48, revenue: 2520000, date: '2025-06-30', status: 'completed' },
    { id: uuidv4(), name: 'June Email Campaign', source: 'email', leads: 98, converted: 24, revenue: 1260000, date: '2025-06-28', status: 'completed' },
    { id: uuidv4(), name: 'Webinar Attendees', source: 'web', leads: 76, converted: 19, revenue: 997500, date: '2025-06-20', status: 'completed' },
    { id: uuidv4(), name: 'May Performance Metrics', source: 'web', leads: 150, converted: 42, revenue: 2205000, date: '2025-05-31', status: 'completed' },
  ];
  sampleReports.forEach(report => reportsStore.set(report.id, report));
};

initializeReports();

/**
 * Validation schemas
 */
const createReportSchema = Joi.object({
  name: Joi.string().required().min(1).max(255),
  source: Joi.string().required().valid('web', 'email', 'phone', 'referral'),
  leads: Joi.number().required().min(0),
  converted: Joi.number().required().min(0),
  revenue: Joi.number().required().min(0),
  date: Joi.string().required(),
});

/**
 * GET /api/v1/reports
 * List all reports with optional filtering
 */
router.get('/', (req, res) => {
  try {
    const { source, startDate, endDate, limit = 50, offset = 0 } = req.query;

    let reports = Array.from(reportsStore.values());

    if (source) {
      reports = reports.filter(r => r.source === source);
    }

    if (startDate || endDate) {
      reports = reports.filter(r => {
        const reportDate = new Date(r.date);
        if (startDate && reportDate < new Date(startDate)) return false;
        if (endDate && reportDate > new Date(endDate)) return false;
        return true;
      });
    }

    const total = reports.length;
    const paginated = reports.slice(Number(offset), Number(offset) + Number(limit));

    res.status(200).json({
      success: true,
      data: {
        reports: paginated,
        pagination: {
          total,
          limit: Number(limit),
          offset: Number(offset),
          hasMore: Number(offset) + Number(limit) < total,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reports',
    });
  }
});

/**
 * POST /api/v1/reports
 * Create a new report
 */
router.post('/', (req, res, next) => {
  try {
    const { error, value } = createReportSchema.validate(req.body);
    if (error) {
      const err = new ApiError(error.message, 400, 'VALIDATION_ERROR');
      err.isJoi = true;
      err.details = error.details;
      throw err;
    }

    const report = {
      id: uuidv4(),
      ...value,
      createdAt: new Date().toISOString(),
    };

    reportsStore.set(report.id, report);

    res.status(201).json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/reports/:id
 * Get a specific report
 */
router.get('/:id', (req, res, next) => {
  try {
    const report = reportsStore.get(req.params.id);

    if (!report) {
      throw new ApiError('Report not found', 404, 'REPORT_NOT_FOUND');
    }

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/v1/reports/:id
 * Delete a report
 */
router.delete('/:id', (req, res, next) => {
  try {
    if (!reportsStore.has(req.params.id)) {
      throw new ApiError('Report not found', 404, 'REPORT_NOT_FOUND');
    }

    reportsStore.delete(req.params.id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;

