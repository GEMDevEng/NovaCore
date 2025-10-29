# Frontend Backend Integration Guide

**Date**: 2025-10-29
**Status**: ✅ Configured for Staging
**Backend URL**: https://backend-kjjvcfoin-gem-devs-projects.vercel.app

## Overview

The NovaCore frontend has been configured to use the backend API for AI-powered lead qualification. This provides:

- ✅ Secure API key management (key on backend, not exposed in frontend)
- ✅ Lead persistence and analytics
- ✅ Scalable architecture
- ✅ Batch processing capabilities
- ✅ Production-ready deployment

## Configuration Changes Made

### 1. Created Backend API Adapter
**File**: `services/providers/backendAdapter.ts`

A new provider adapter that implements the `IAiProvider` interface and calls the backend API:

```typescript
// Automatically uses VITE_API_URL environment variable
const provider = new BackendAdapter();
const insights = await provider.getBusinessInsights(prompt);
```

### 2. Updated Provider Factory
**File**: `services/providers/index.ts`

Added support for 'backend' provider:

```typescript
// Supported providers now include:
// - 'gemini': Google Gemini API
// - 'cohere': Cohere API (frontend-only)
// - 'backend': Backend API (recommended)
```

### 3. Updated Provider Configuration
**File**: `services/providers/types.ts`

Added `apiUrl` to `ProviderConfig` interface for flexible configuration.

### 4. Updated Environment Configuration
**File**: `.env.local`

```bash
# AI Provider Selection
AI_PROVIDER=backend

# Backend API URL (Staging)
VITE_API_URL=https://backend-kjjvcfoin-gem-devs-projects.vercel.app
```

### 5. Updated Vite Configuration
**File**: `vite.config.ts`

Exposed `VITE_API_URL` environment variable to the frontend build.

## How It Works

### Request Flow

```
Frontend (React)
    ↓
BackendAdapter (services/providers/backendAdapter.ts)
    ↓
Backend API (https://backend-kjjvcfoin-gem-devs-projects.vercel.app)
    ↓
Cohere API
```

### Example Usage

```typescript
import { getBusinessInsights } from './services/aiService';

// Automatically uses backend provider
const insights = await getBusinessInsights('Lead: John Doe...');

// Returns:
// {
//   rating: 'High',
//   cashForecast: 100000,
//   summary: 'High-quality lead with strong budget'
// }
```

## Environment Variables

### Development
```bash
AI_PROVIDER=backend
VITE_API_URL=http://localhost:3001
```

### Staging
```bash
AI_PROVIDER=backend
VITE_API_URL=https://backend-kjjvcfoin-gem-devs-projects.vercel.app
```

### Production
```bash
AI_PROVIDER=backend
VITE_API_URL=https://your-production-backend-url.vercel.app
```

## Switching Providers

To switch back to frontend-only mode:

```bash
# Use Cohere directly from frontend
AI_PROVIDER=cohere
COHERE_API_KEY=your_key_here
```

To use Gemini:

```bash
AI_PROVIDER=gemini
GEMINI_API_KEY=your_key_here
```

## Testing the Integration

### 1. Start Frontend
```bash
npm run dev
```

### 2. Test in Browser
- Navigate to http://localhost:3000
- Enter lead information in the AI Query Card
- Click "Get Insights"
- Should see results from backend API

### 3. Check Network Tab
- Open DevTools → Network tab
- Look for requests to `/api/v1/ai/query`
- Should see successful responses from backend

## Troubleshooting

### "Cannot reach backend"
- Verify backend URL in `.env.local`
- Check if backend is running/deployed
- Verify CORS is configured correctly

### "Invalid response structure"
- Check backend API response format
- Verify backend is returning `data` object with `rating`, `cashForecast`, `summary`

### "Deployment protection enabled"
- Disable Vercel deployment protection on backend
- Or use bypass token in requests

## Next Steps

1. ✅ Backend API adapter created
2. ✅ Frontend configuration updated
3. → Deploy frontend to Vercel staging
4. → Run integration tests
5. → Deploy to production

## Files Modified

- `services/providers/backendAdapter.ts` (NEW)
- `services/providers/index.ts` (UPDATED)
- `services/providers/types.ts` (UPDATED)
- `.env.local` (UPDATED)
- `vite.config.ts` (UPDATED)

