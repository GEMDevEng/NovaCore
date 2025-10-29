import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load environment variables
dotenv.config({ path: '../.env.local' });

// Import routes
import aiRoutes from './routes/ai.js';
import leadsRoutes from './routes/leads.js';
import healthRoutes from './routes/health.js';
import analyticsRoutes from './routes/analytics.js';
import reportsRoutes from './routes/reports.js';
import calendarRoutes from './routes/calendar.js';
import paymentsRoutes from './routes/payments.js';
import authRoutes from './routes/auth.js';

// Import middleware
import { errorHandler, requestLogger } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());

// CORS configuration - allow requests from frontend domains
const corsOptions = {
  origin: function (origin, callback) {
    // Allowed origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://novacore-frontend-seven.vercel.app',
      'https://novacore-frontend-dai0ahnbf-gem-devs-projects.vercel.app',
      'https://novacore-frontend-nja6wepwl-gem-devs-projects.vercel.app',
      'https://novacore-frontend-mm8iom1p7-gem-devs-projects.vercel.app',
      'https://novacore-frontend-5v8omroam-gem-devs-projects.vercel.app',
      'https://novacore-frontend-q81lobvox-gem-devs-projects.vercel.app',
      'https://novacore-frontend-fularmolf-gem-devs-projects.vercel.app',
      'https://novacore-frontend-ngsbk1vy0-gem-devs-projects.vercel.app',
      process.env.FRONTEND_URL,
    ].filter(Boolean);

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use(requestLogger);

// Routes
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/leads', leadsRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/reports', reportsRoutes);
app.use('/api/v1/calendar', calendarRoutes);
app.use('/api/v1/payments', paymentsRoutes);
app.use('/api/v1/auth', authRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'NovaCore Backend API',
    version: '1.0.3',
    status: 'running',
    timestamp: new Date().toISOString(),
    commit: '0ca4590',
    endpoints: {
      health: '/api/v1/health',
      ai: '/api/v1/ai',
      leads: '/api/v1/leads',
      analytics: '/api/v1/analytics',
      reports: '/api/v1/reports',
      calendar: '/api/v1/calendar',
      payments: '/api/v1/payments',
      auth: '/api/v1/auth',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    code: 'ROUTE_NOT_FOUND',
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server only in local development (not in Vercel serverless)
// In Vercel, the app is exported and handled by the serverless runtime
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`✅ NovaCore Backend running on http://localhost:${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api/v1/health`);
    console.log(`🔌 AI Endpoints: http://localhost:${PORT}/api/v1/ai`);
    console.log(`👥 Leads Endpoints: http://localhost:${PORT}/api/v1/leads`);
  });
} else if (process.env.VERCEL) {
  console.log(`✅ NovaCore Backend running on Vercel serverless environment`);
  console.log(`📚 API Documentation: /api/v1/health`);
  console.log(`🔌 AI Endpoints: /api/v1/ai`);
  console.log(`👥 Leads Endpoints: /api/v1/leads`);
}

export default app;

