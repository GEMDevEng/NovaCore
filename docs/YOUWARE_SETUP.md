# YouWare Setup Guide for NovaCore

## Overview

This guide explains how to set up and prepare NovaCore for publishing on the YouWare platform using the VS Code extension.

## What is YouWare?

YouWare is an all-in-one AI coding platform that allows you to:
- Build and deploy full-stack applications instantly
- Publish projects directly from VS Code or Cursor IDE
- Get shareable URLs for your applications
- Connect with a vibrant community of creators
- Monetize your projects through the Creator Incentive Program

## NovaCore on YouWare

NovaCore is a **full-stack application** consisting of:
- **Frontend**: React-based dashboard with Vite build tool
- **Backend**: Express.js API server with AI integration
- **Features**: Authentication, payments, AI-powered business insights

## Prerequisites

1. **YouWare Account**: Sign up at https://www.youware.com
2. **VS Code or Cursor**: Install the YouWare extension
3. **Node.js 18+**: Required for both frontend and backend
4. **Git**: For version control
5. **API Keys**: 
   - Cohere API key (for AI features)
   - Google OAuth credentials (for authentication)
   - Payment provider keys (PayPal, Stripe, Razorpay)

## Installation Steps

### Step 1: Install YouWare Extension

**For VS Code:**
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "YouWare"
4. Click Install
5. Sign in with your YouWare account

**For Cursor:**
1. Open Cursor
2. Go to Extensions
3. Search for "YouWare"
4. Click Install
5. Sign in with your YouWare account

### Step 2: Prepare Your Project

```bash
# Clone or navigate to NovaCore repository
cd NovaCore

# Install all dependencies
npm install
cd backend && npm install && cd ..

# Verify build works
npm run build
cd backend && npm install && cd ..
```

### Step 3: Configure Environment Variables

Create `.env.local` in the root directory:

```bash
# Frontend Configuration
VITE_API_URL=https://your-backend-youware-url.youware.app
COHERE_API_KEY=your_cohere_api_key

# Optional: AI Provider
AI_PROVIDER=cohere
```

Create `backend/.env.local`:

```bash
# Backend Configuration
PORT=3001
NODE_ENV=production
COHERE_API_KEY=your_cohere_api_key
FRONTEND_URL=https://your-frontend-youware-url.youware.app

# Authentication
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Payments
PAYPAL_CLIENT_ID=your_paypal_client_id
STRIPE_SECRET_KEY=your_stripe_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### Step 4: Verify Project Structure

YouWare expects:
```
NovaCore/
├── youware.json              # Project manifest
├── package.json              # Frontend dependencies
├── vite.config.ts            # Frontend build config
├── index.html                # Frontend entry point
├── dist/                      # Frontend build output
├── backend/
│   ├── package.json          # Backend dependencies
│   ├── src/                  # Backend source code
│   ├── api/index.js          # Serverless handler
│   └── vercel.json           # Backend deployment config
└── docs/
    └── YOUWARE_DEPLOYMENT.md # Deployment guide
```

## Project Configuration

### Frontend Configuration (youware.json)

The `youware.json` file contains:
- Project metadata
- Build commands
- Environment variables
- Feature flags
- Deployment settings

### Backend Configuration

Backend is configured for serverless deployment:
- Handler: `backend/api/index.js`
- Runtime: Node.js 18+
- Port: 3001 (for local development)

## Testing Locally

Before publishing to YouWare:

```bash
# Terminal 1: Start frontend
npm run dev

# Terminal 2: Start backend
cd backend && npm run dev

# Test at http://localhost:3000
```

## Next Steps

After setup, proceed to: [YOUWARE_DEPLOYMENT.md](./YOUWARE_DEPLOYMENT.md)

