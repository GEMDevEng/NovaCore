import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Joi from 'joi';
import { ApiError } from '../middleware/errorHandler.js';

const router = express.Router();

// Force Vercel redeploy - v1.0.3

/**
 * In-memory storage for leads (replace with database in production)
 */
const leadsStore = new Map();

/**
 * Initialize with sample leads
 */
const initializeLeads = () => {
  const sampleLeads = [
    { id: uuidv4(), name: 'John Smith', email: 'john.smith@techcorp.com', company: 'TechCorp Inc', phone: '(555) 123-4567', source: 'web', notes: 'Interested in enterprise solution', rating: 'High', cashForecast: 125000, createdAt: new Date(Date.now() - 30*24*60*60*1000).toISOString(), updatedAt: new Date(Date.now() - 5*24*60*60*1000).toISOString() },
    { id: uuidv4(), name: 'Sarah Johnson', email: 'sarah.j@innovate.io', company: 'Innovate Solutions', phone: '(555) 234-5678', source: 'email', notes: 'Referred by existing client', rating: 'High', cashForecast: 95000, createdAt: new Date(Date.now() - 25*24*60*60*1000).toISOString(), updatedAt: new Date(Date.now() - 3*24*60*60*1000).toISOString() },
    { id: uuidv4(), name: 'Michael Chen', email: 'mchen@globaltech.com', company: 'Global Tech Solutions', phone: '(555) 345-6789', source: 'web', notes: 'Attended webinar, high engagement', rating: 'High', cashForecast: 150000, createdAt: new Date(Date.now() - 20*24*60*60*1000).toISOString(), updatedAt: new Date(Date.now() - 2*24*60*60*1000).toISOString() },
    { id: uuidv4(), name: 'Emily Rodriguez', email: 'emily.r@startupx.com', company: 'StartupX', phone: '(555) 456-7890', source: 'referral', notes: 'Startup looking for scalable solution', rating: 'Medium', cashForecast: 65000, createdAt: new Date(Date.now() - 18*24*60*60*1000).toISOString(), updatedAt: new Date(Date.now() - 1*24*60*60*1000).toISOString() },
    { id: uuidv4(), name: 'David Williams', email: 'dwilliams@enterprise.com', company: 'Enterprise Corp', phone: '(555) 567-8901', source: 'web', notes: 'Large enterprise, multiple stakeholders', rating: 'High', cashForecast: 200000, createdAt: new Date(Date.now() - 15*24*60*60*1000).toISOString(), updatedAt: new Date().toISOString() },
    { id: uuidv4(), name: 'Lisa Anderson', email: 'lisa.a@midmarket.net', company: 'MidMarket Inc', phone: '(555) 678-9012', source: 'email', notes: 'Interested in demo', rating: 'Medium', cashForecast: 75000, createdAt: new Date(Date.now() - 12*24*60*60*1000).toISOString(), updatedAt: new Date(Date.now() - 4*24*60*60*1000).toISOString() },
    { id: uuidv4(), name: 'James Martinez', email: 'jmartinez@techventures.com', company: 'Tech Ventures', phone: '(555) 789-0123', source: 'web', notes: 'Looking for integration capabilities', rating: 'Medium', cashForecast: 85000, createdAt: new Date(Date.now() - 10*24*60*60*1000).toISOString(), updatedAt: new Date(Date.now() - 6*24*60*60*1000).toISOString() },
    { id: uuidv4(), name: 'Jennifer Lee', email: 'jlee@cloudservices.io', company: 'Cloud Services Ltd', phone: '(555) 890-1234', source: 'referral', notes: 'Existing customer referral', rating: 'High', cashForecast: 110000, createdAt: new Date(Date.now() - 8*24*60*60*1000).toISOString(), updatedAt: new Date().toISOString() },
    { id: uuidv4(), name: 'Robert Taylor', email: 'rtaylor@digitalsolutions.com', company: 'Digital Solutions Group', phone: '(555) 901-2345', source: 'web', notes: 'Needs custom implementation', rating: 'Low', cashForecast: 45000, createdAt: new Date(Date.now() - 7*24*60*60*1000).toISOString(), updatedAt: new Date(Date.now() - 7*24*60*60*1000).toISOString() },
    { id: uuidv4(), name: 'Amanda White', email: 'awhite@businesspro.com', company: 'Business Pro Services', phone: '(555) 012-3456', source: 'email', notes: 'Qualified lead, ready for proposal', rating: 'High', cashForecast: 135000, createdAt: new Date(Date.now() - 5*24*60*60*1000).toISOString(), updatedAt: new Date().toISOString() },
    { id: uuidv4(), name: 'Christopher Brown', email: 'cbrown@innovativetech.net', company: 'Innovative Tech', phone: '(555) 123-9876', source: 'web', notes: 'Budget approved for Q4', rating: 'High', cashForecast: 175000, createdAt: new Date(Date.now() - 4*24*60*60*1000).toISOString(), updatedAt: new Date().toISOString() },
    { id: uuidv4(), name: 'Michelle Davis', email: 'mdavis@smartbusiness.com', company: 'Smart Business Solutions', phone: '(555) 234-9876', source: 'referral', notes: 'Referred by partner network', rating: 'Medium', cashForecast: 70000, createdAt: new Date(Date.now() - 3*24*60*60*1000).toISOString(), updatedAt: new Date(Date.now() - 1*24*60*60*1000).toISOString() },
    { id: uuidv4(), name: 'Kevin Garcia', email: 'kgarcia@futuretech.io', company: 'Future Tech Innovations', phone: '(555) 345-9876', source: 'web', notes: 'Early stage discussion', rating: 'Low', cashForecast: 50000, createdAt: new Date(Date.now() - 2*24*60*60*1000).toISOString(), updatedAt: new Date(Date.now() - 2*24*60*60*1000).toISOString() },
    { id: uuidv4(), name: 'Patricia Moore', email: 'pmoore@corporateplus.com', company: 'Corporate Plus', phone: '(555) 456-9876', source: 'email', notes: 'Sent proposal, awaiting feedback', rating: 'Medium', cashForecast: 90000, createdAt: new Date(Date.now() - 1*24*60*60*1000).toISOString(), updatedAt: new Date().toISOString() },
    { id: uuidv4(), name: 'Daniel Jackson', email: 'djackson@nexustech.com', company: 'Nexus Technologies', phone: '(555) 567-9876', source: 'web', notes: 'Competitor evaluation stage', rating: 'Medium', cashForecast: 80000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: uuidv4(), name: 'Rachel Green', email: 'rgreen@advancedsys.net', company: 'Advanced Systems', phone: '(555) 678-9876', source: 'referral', notes: 'High-value opportunity', rating: 'High', cashForecast: 160000, createdAt: new Date(Date.now() - 6*24*60*60*1000).toISOString(), updatedAt: new Date(Date.now() - 2*24*60*60*1000).toISOString() },
    { id: uuidv4(), name: 'Thomas Harris', email: 'tharris@modernbiz.com', company: 'Modern Business Inc', phone: '(555) 789-9876', source: 'web', notes: 'Needs ROI analysis', rating: 'Low', cashForecast: 55000, createdAt: new Date(Date.now() - 9*24*60*60*1000).toISOString(), updatedAt: new Date(Date.now() - 8*24*60*60*1000).toISOString() },
    { id: uuidv4(), name: 'Victoria Clark', email: 'vclark@premiumsolutions.io', company: 'Premium Solutions', phone: '(555) 890-9876', source: 'email', notes: 'VIP account, executive sponsor', rating: 'High', cashForecast: 220000, createdAt: new Date(Date.now() - 11*24*60*60*1000).toISOString(), updatedAt: new Date(Date.now() - 1*24*60*60*1000).toISOString() },
    { id: uuidv4(), name: 'Andrew Lewis', email: 'alewis@dynamictech.com', company: 'Dynamic Technologies', phone: '(555) 901-9876', source: 'web', notes: 'Pilot program candidate', rating: 'Medium', cashForecast: 100000, createdAt: new Date(Date.now() - 13*24*60*60*1000).toISOString(), updatedAt: new Date(Date.now() - 5*24*60*60*1000).toISOString() },
    { id: uuidv4(), name: 'Stephanie Walker', email: 'swalker@progressivebiz.net', company: 'Progressive Business Group', phone: '(555) 012-9876', source: 'referral', notes: 'Warm introduction from CEO', rating: 'High', cashForecast: 145000, createdAt: new Date(Date.now() - 14*24*60*60*1000).toISOString(), updatedAt: new Date(Date.now() - 3*24*60*60*1000).toISOString() },
    { id: uuidv4(), name: 'Mark Thompson', email: 'mthompson@eliteservices.com', company: 'Elite Services Corp', phone: '(555) 123-5555', source: 'web', notes: 'Interested in premium tier', rating: 'High', cashForecast: 190000, createdAt: new Date(Date.now() - 16*24*60*60*1000).toISOString(), updatedAt: new Date().toISOString() },
  ];
  sampleLeads.forEach(lead => leadsStore.set(lead.id, lead));
};

initializeLeads();

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

