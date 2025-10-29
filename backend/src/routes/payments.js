import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Joi from 'joi';
import { ApiError } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * In-memory storage for payments and subscriptions
 */
const paymentsStore = new Map();
const subscriptionsStore = new Map();

/**
 * Pricing tiers
 */
const PRICING_TIERS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    features: ['Basic analytics', 'Up to 10 leads', 'Email support'],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 29.99,
    features: ['Advanced analytics', 'Unlimited leads', 'Priority support', 'Custom reports'],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99.99,
    features: ['All Pro features', 'Dedicated account manager', 'API access', 'Custom integrations'],
  },
};

/**
 * Validation schemas
 */
const createPaymentSessionSchema = Joi.object({
  userId: Joi.string().required(),
  tier: Joi.string().required().valid('free', 'pro', 'enterprise'),
  provider: Joi.string().required().valid('paypal', 'stripe', 'razorpay'),
  successUrl: Joi.string().uri().required(),
  cancelUrl: Joi.string().uri().required(),
});

const webhookSchema = Joi.object({
  provider: Joi.string().required().valid('paypal', 'stripe', 'razorpay'),
  eventType: Joi.string().required(),
  data: Joi.object().required(),
});

/**
 * GET /api/v1/payments/pricing
 * Get pricing tiers
 */
router.get('/pricing', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        tiers: Object.values(PRICING_TIERS),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pricing',
    });
  }
});

/**
 * POST /api/v1/payments/session
 * Create a payment session
 */
router.post('/session', (req, res, next) => {
  try {
    const { error, value } = createPaymentSessionSchema.validate(req.body);
    if (error) {
      const err = new ApiError(error.message, 400, 'VALIDATION_ERROR');
      err.isJoi = true;
      err.details = error.details;
      throw err;
    }

    const { userId, tier, provider, successUrl, cancelUrl } = value;
    const tierData = PRICING_TIERS[tier];

    if (!tierData) {
      throw new ApiError('Invalid tier', 400, 'INVALID_TIER');
    }

    const sessionId = uuidv4();
    const payment = {
      id: sessionId,
      userId,
      tier,
      provider,
      amount: tierData.price,
      currency: 'USD',
      status: 'pending',
      successUrl,
      cancelUrl,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    paymentsStore.set(sessionId, payment);

    // In production, this would create actual payment sessions with PayPal, Stripe, or Razorpay
    const providerSessionUrl = {
      paypal: `https://sandbox.paypal.com/checkoutnow?token=${sessionId}`,
      stripe: `https://checkout.stripe.com/pay/${sessionId}`,
      razorpay: `https://checkout.razorpay.com/v2/checkout.js?key=${sessionId}`,
    };

    res.status(201).json({
      success: true,
      data: {
        sessionId,
        checkoutUrl: providerSessionUrl[provider],
        payment,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/payments/session/:sessionId
 * Get payment session details
 */
router.get('/session/:sessionId', (req, res, next) => {
  try {
    const payment = paymentsStore.get(req.params.sessionId);

    if (!payment) {
      throw new ApiError('Payment session not found', 404, 'SESSION_NOT_FOUND');
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/payments/webhook
 * Handle payment provider webhooks
 */
router.post('/webhook', (req, res, next) => {
  try {
    const { error, value } = webhookSchema.validate(req.body);
    if (error) {
      const err = new ApiError(error.message, 400, 'VALIDATION_ERROR');
      err.isJoi = true;
      err.details = error.details;
      throw err;
    }

    const { provider, eventType, data } = value;

    // Handle different webhook events
    if (eventType === 'payment.completed' || eventType === 'charge.succeeded') {
      const { sessionId, userId, tier } = data;
      const payment = paymentsStore.get(sessionId);

      if (payment) {
        payment.status = 'completed';
        payment.completedAt = new Date().toISOString();
        paymentsStore.set(sessionId, payment);

        // Create subscription
        const subscription = {
          id: uuidv4(),
          userId,
          tier,
          provider,
          status: 'active',
          startDate: new Date().toISOString(),
          renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          paymentId: sessionId,
        };
        subscriptionsStore.set(subscription.id, subscription);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Webhook processed',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/payments/subscription/:userId
 * Get user subscription
 */
router.get('/subscription/:userId', (req, res) => {
  try {
    const subscriptions = Array.from(subscriptionsStore.values()).filter(
      s => s.userId === req.params.userId && s.status === 'active'
    );

    const subscription = subscriptions[0] || null;

    res.status(200).json({
      success: true,
      data: {
        subscription,
        tier: subscription ? subscription.tier : 'free',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch subscription',
    });
  }
});

export default router;

