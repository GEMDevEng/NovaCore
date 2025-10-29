import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Joi from 'joi';
import { ApiError } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * In-memory storage for leads (replace with database in production)
 */
const leadsStore = new Map();

/**
 * Validation schemas
 */
const createLeadSchema = Joi.object({
  name: Joi.string().required().min(1).max(255),
  email: Joi.string().email().required(),
  company: Joi.string().required().min(1).max(255),
  phone: Joi.string().optional(),
  source: Joi.string().required().valid('web', 'email', 'phone', 'referral'),
  notes: Joi.string().optional().max(1000),
});

const updateLeadSchema = Joi.object({
  name: Joi.string().optional().min(1).max(255),
  email: Joi.string().email().optional(),
  company: Joi.string().optional().min(1).max(255),
  phone: Joi.string().optional(),
  source: Joi.string().optional().valid('web', 'email', 'phone', 'referral'),
  notes: Joi.string().optional().max(1000),
  rating: Joi.string().optional().valid('High', 'Medium', 'Low'),
  cashForecast: Joi.number().optional().min(0),
});

/**
 * POST /api/v1/leads
 * Create a new lead
 */
router.post('/', (req, res, next) => {
  try {
    const { error, value } = createLeadSchema.validate(req.body);
    if (error) {
      const err = new ApiError(error.message, 400, 'VALIDATION_ERROR');
      err.isJoi = true;
      err.details = error.details;
      throw err;
    }

    const lead = {
      id: uuidv4(),
      ...value,
      rating: null,
      cashForecast: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    leadsStore.set(lead.id, lead);

    res.status(201).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/leads
 * List all leads with optional filtering
 */
router.get('/', (req, res) => {
  const { source, rating, limit = 50, offset = 0 } = req.query;

  let leads = Array.from(leadsStore.values());

  if (source) {
    leads = leads.filter(l => l.source === source);
  }

  if (rating) {
    leads = leads.filter(l => l.rating === rating);
  }

  const total = leads.length;
  const paginated = leads.slice(Number(offset), Number(offset) + Number(limit));

  res.status(200).json({
    success: true,
    data: {
      leads: paginated,
      pagination: {
        total,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: Number(offset) + Number(limit) < total,
      },
    },
  });
});

/**
 * GET /api/v1/leads/:id
 * Get a specific lead
 */
router.get('/:id', (req, res, next) => {
  try {
    const lead = leadsStore.get(req.params.id);

    if (!lead) {
      throw new ApiError('Lead not found', 404, 'LEAD_NOT_FOUND');
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/v1/leads/:id
 * Update a lead
 */
router.patch('/:id', (req, res, next) => {
  try {
    const lead = leadsStore.get(req.params.id);

    if (!lead) {
      throw new ApiError('Lead not found', 404, 'LEAD_NOT_FOUND');
    }

    const { error, value } = updateLeadSchema.validate(req.body);
    if (error) {
      const err = new ApiError(error.message, 400, 'VALIDATION_ERROR');
      err.isJoi = true;
      err.details = error.details;
      throw err;
    }

    const updated = {
      ...lead,
      ...value,
      updatedAt: new Date().toISOString(),
    };

    leadsStore.set(req.params.id, updated);

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/v1/leads/:id
 * Delete a lead
 */
router.delete('/:id', (req, res, next) => {
  try {
    if (!leadsStore.has(req.params.id)) {
      throw new ApiError('Lead not found', 404, 'LEAD_NOT_FOUND');
    }

    leadsStore.delete(req.params.id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;

