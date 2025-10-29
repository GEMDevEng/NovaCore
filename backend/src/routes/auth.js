import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Joi from 'joi';
import { ApiError } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * In-memory storage for users and sessions
 */
const usersStore = new Map();
const sessionsStore = new Map();

/**
 * Validation schemas
 */
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const oauthSchema = Joi.object({
  provider: Joi.string().required().valid('google'),
  token: Joi.string().required(),
  email: Joi.string().email().required(),
  name: Joi.string().required(),
});

/**
 * Helper function to create JWT-like token
 */
const createToken = (userId) => {
  return Buffer.from(`${userId}:${Date.now()}`).toString('base64');
};

/**
 * POST /api/v1/auth/register
 * Register a new user
 */
router.post('/register', (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      const err = new ApiError(error.message, 400, 'VALIDATION_ERROR');
      err.isJoi = true;
      err.details = error.details;
      throw err;
    }

    const { email, password, name } = value;

    // Check if user already exists
    const existingUser = Array.from(usersStore.values()).find(u => u.email === email);
    if (existingUser) {
      throw new ApiError('User already exists', 409, 'USER_EXISTS');
    }

    const userId = uuidv4();
    const user = {
      id: userId,
      email,
      name,
      password: Buffer.from(password).toString('base64'), // Simple encoding (not secure for production)
      provider: 'email',
      subscription: 'free',
      createdAt: new Date().toISOString(),
    };

    usersStore.set(userId, user);

    const token = createToken(userId);
    const session = {
      id: uuidv4(),
      userId,
      token,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
    sessionsStore.set(session.id, session);

    res.status(201).json({
      success: true,
      data: {
        user: { id: user.id, email: user.email, name: user.name },
        token,
        session: session.id,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/auth/login
 * Login with email and password
 */
router.post('/login', (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      const err = new ApiError(error.message, 400, 'VALIDATION_ERROR');
      err.isJoi = true;
      err.details = error.details;
      throw err;
    }

    const { email, password } = value;
    const user = Array.from(usersStore.values()).find(u => u.email === email);

    if (!user || Buffer.from(password).toString('base64') !== user.password) {
      throw new ApiError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    const token = createToken(user.id);
    const session = {
      id: uuidv4(),
      userId: user.id,
      token,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
    sessionsStore.set(session.id, session);

    res.status(200).json({
      success: true,
      data: {
        user: { id: user.id, email: user.email, name: user.name },
        token,
        session: session.id,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/auth/oauth
 * OAuth login (Google)
 */
router.post('/oauth', (req, res, next) => {
  try {
    const { error, value } = oauthSchema.validate(req.body);
    if (error) {
      const err = new ApiError(error.message, 400, 'VALIDATION_ERROR');
      err.isJoi = true;
      err.details = error.details;
      throw err;
    }

    const { provider, email, name } = value;

    // Find or create user
    let user = Array.from(usersStore.values()).find(u => u.email === email);

    if (!user) {
      const userId = uuidv4();
      user = {
        id: userId,
        email,
        name,
        provider,
        subscription: 'free',
        createdAt: new Date().toISOString(),
      };
      usersStore.set(userId, user);
    }

    const token = createToken(user.id);
    const session = {
      id: uuidv4(),
      userId: user.id,
      token,
      provider,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
    sessionsStore.set(session.id, session);

    res.status(200).json({
      success: true,
      data: {
        user: { id: user.id, email: user.email, name: user.name },
        token,
        session: session.id,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/auth/profile
 * Get current user profile
 */
router.get('/profile', (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new ApiError('No token provided', 401, 'NO_TOKEN');
    }

    const session = Array.from(sessionsStore.values()).find(s => s.token === token);
    if (!session) {
      throw new ApiError('Invalid token', 401, 'INVALID_TOKEN');
    }

    const user = usersStore.get(session.userId);
    if (!user) {
      throw new ApiError('User not found', 404, 'USER_NOT_FOUND');
    }

    res.status(200).json({
      success: true,
      data: {
        user: { id: user.id, email: user.email, name: user.name, subscription: user.subscription },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/auth/logout
 * Logout user
 */
router.post('/logout', (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new ApiError('No token provided', 401, 'NO_TOKEN');
    }

    const session = Array.from(sessionsStore.values()).find(s => s.token === token);
    if (session) {
      sessionsStore.delete(session.id);
    }

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;

