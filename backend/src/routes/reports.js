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
    { id: uuidv4(), name: 'Q3 Performance', source: 'web', leads: 120, converted: 35, revenue: 157500, date: '2025-09-30' },
    { id: uuidv4(), name: 'Email Campaign', source: 'email', leads: 85, converted: 18, revenue: 81000, date: '2025-09-15' },
    { id: uuidv4(), name: 'Phone Outreach', source: 'phone', leads: 45, converted: 12, revenue: 54000, date: '2025-09-10' },
    { id: uuidv4(), name: 'Referral Program', source: 'referral', leads: 30, converted: 10, revenue: 45000, date: '2025-09-05' },
    { id: uuidv4(), name: 'Q2 Summary', source: 'web', leads: 110, converted: 32, revenue: 144000, date: '2025-06-30' },
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

