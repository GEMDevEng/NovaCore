import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Joi from 'joi';
import { ApiError } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * In-memory storage for calendar events
 */
const eventsStore = new Map();

// Initialize with sample events
const initializeEvents = () => {
  const sampleEvents = [
    { id: uuidv4(), title: 'Client Meeting', date: '2025-10-29', time: '10:00', description: 'Discuss Q4 strategy', type: 'meeting', createdAt: new Date().toISOString() },
    { id: uuidv4(), title: 'Sales Call', date: '2025-10-30', time: '14:00', description: 'Follow up with prospect', type: 'call', createdAt: new Date().toISOString() },
    { id: uuidv4(), title: 'Project Deadline', date: '2025-11-05', time: '17:00', description: 'Submit final deliverables', type: 'deadline', createdAt: new Date().toISOString() },
    { id: uuidv4(), title: 'Team Standup', date: '2025-10-31', time: '09:00', description: 'Daily sync', type: 'meeting', createdAt: new Date().toISOString() },
  ];
  sampleEvents.forEach(event => eventsStore.set(event.id, event));
};

initializeEvents();

/**
 * Validation schemas
 */
const createEventSchema = Joi.object({
  title: Joi.string().required().min(1).max(255),
  date: Joi.string().required(),
  time: Joi.string().optional(),
  description: Joi.string().optional().max(1000),
  type: Joi.string().required().valid('meeting', 'call', 'task', 'deadline'),
});

const updateEventSchema = Joi.object({
  title: Joi.string().optional().min(1).max(255),
  date: Joi.string().optional(),
  time: Joi.string().optional(),
  description: Joi.string().optional().max(1000),
  type: Joi.string().optional().valid('meeting', 'call', 'task', 'deadline'),
});

/**
 * GET /api/v1/calendar/events
 * List all calendar events with optional filtering
 */
router.get('/events', (req, res) => {
  try {
    const { date, type, limit = 50, offset = 0 } = req.query;

    let events = Array.from(eventsStore.values());

    if (date) {
      events = events.filter(e => e.date === date);
    }

    if (type) {
      events = events.filter(e => e.type === type);
    }

    const total = events.length;
    const paginated = events.slice(Number(offset), Number(offset) + Number(limit));

    res.status(200).json({
      success: true,
      data: {
        events: paginated,
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
      error: 'Failed to fetch events',
    });
  }
});

/**
 * POST /api/v1/calendar/events
 * Create a new calendar event
 */
router.post('/events', (req, res, next) => {
  try {
    const { error, value } = createEventSchema.validate(req.body);
    if (error) {
      const err = new ApiError(error.message, 400, 'VALIDATION_ERROR');
      err.isJoi = true;
      err.details = error.details;
      throw err;
    }

    const event = {
      id: uuidv4(),
      ...value,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    eventsStore.set(event.id, event);

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/calendar/events/:id
 * Get a specific calendar event
 */
router.get('/events/:id', (req, res, next) => {
  try {
    const event = eventsStore.get(req.params.id);

    if (!event) {
      throw new ApiError('Event not found', 404, 'EVENT_NOT_FOUND');
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/v1/calendar/events/:id
 * Update a calendar event
 */
router.patch('/events/:id', (req, res, next) => {
  try {
    const event = eventsStore.get(req.params.id);

    if (!event) {
      throw new ApiError('Event not found', 404, 'EVENT_NOT_FOUND');
    }

    const { error, value } = updateEventSchema.validate(req.body);
    if (error) {
      const err = new ApiError(error.message, 400, 'VALIDATION_ERROR');
      err.isJoi = true;
      err.details = error.details;
      throw err;
    }

    const updated = {
      ...event,
      ...value,
      updatedAt: new Date().toISOString(),
    };

    eventsStore.set(req.params.id, updated);

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/v1/calendar/events/:id
 * Delete a calendar event
 */
router.delete('/events/:id', (req, res, next) => {
  try {
    if (!eventsStore.has(req.params.id)) {
      throw new ApiError('Event not found', 404, 'EVENT_NOT_FOUND');
    }

    eventsStore.delete(req.params.id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;

