# Frontend Vercel Deployment Guide

**Date**: 2025-10-29
**Status**: Ready for Deployment
**Platform**: Vercel
**Estimated Time**: 10-15 minutes

## Prerequisites

- Vercel account (free at https://vercel.com)
- GitHub account with access to NovaCore repository
- Backend deployed at: https://backend-2xzzobsd9-gem-devs-projects.vercel.app

## Deployment Steps

### Step 1: Prepare Repository

Ensure all changes are committed:

```bash
git add .
git commit -m "feat: Add backend API integration for frontend"
git push origin main
```

### Step 2: Create Vercel Project

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Click "Import Git Repository"
4. Search for "NovaCore" repository
5. Click on "GEMDevEng/NovaCore" to import

### Step 3: Configure Project Settings

**Project Name**: `novacore-frontend` (or similar)

**Root Directory**: Leave as default (root of repository)

**Framework Preset**: Vite

**Build Command**: `npm run build`

**Output Directory**: `dist`

**Install Command**: `npm install`

### Step 4: Set Environment Variables

In Vercel dashboard, go to Settings → Environment Variables and add:

```
AI_PROVIDER=backend
VITE_API_URL=https://backend-2xzzobsd9-gem-devs-projects.vercel.app
COHERE_API_KEY=dyfJLrucN9sINeHUyWKhflGuoJPIltrLdYVZdA9u
```

**Note**: These can be set for different environments:
- **Preview**: For pull requests
- **Production**: For main branch

### Step 5: Deploy

1. Click "Deploy" button
2. Wait for build to complete (typically 1-2 minutes)
3. Verify deployment status shows "Success"

### Step 6: Get Frontend URL

1. Go to "Deployments" tab
2. Copy the production URL from latest deployment
3. Save URL for testing

Example: `https://novacore-frontend-xyz.vercel.app`

## Post-Deployment Testing

### Test 1: Frontend Loads

```bash
curl https://[FRONTEND_URL]
```

- Should return HTML page
- Status code: 200

### Test 2: AI Query Works

1. Open frontend in browser
2. Navigate to AI Query Card
3. Enter lead information
4. Click "Get Insights"
5. Should see results from backend API

### Test 3: Check Network Requests

1. Open DevTools → Network tab
2. Perform AI query
3. Look for requests to `/api/v1/ai/query`
4. Should see successful responses from backend

## Environment Variables

### Staging
```
AI_PROVIDER=backend
VITE_API_URL=https://backend-kjjvcfoin-gem-devs-projects.vercel.app
```

### Production
```
AI_PROVIDER=backend
VITE_API_URL=https://backend-kjjvcfoin-gem-devs-projects.vercel.app
```

## Troubleshooting

### Build Fails

**Error**: "Cannot find module"
- Ensure all dependencies are in `package.json`
- Check `npm install` runs successfully locally

**Error**: "TypeScript errors"
- Run `npm run build` locally to check for errors
- Fix any TypeScript issues before deploying

### Frontend Loads But AI Doesn't Work

**Error**: "Cannot reach backend"
- Verify `VITE_API_URL` is set correctly in Vercel
- Check backend is running and accessible
- Verify CORS is configured on backend

**Error**: "Invalid response"
- Check backend API response format
- Verify backend is returning correct data structure

### Deployment Protection

If you see "Authentication Required":
- Disable Vercel deployment protection on frontend
- Or configure bypass tokens

## Rollback

If deployment has issues:

1. Go to "Deployments" tab
2. Find previous working deployment
3. Click the deployment
4. Look for "Promote to Production" option
5. Confirm rollback

## Next Steps

1. ✅ Frontend code updated with backend integration
2. ✅ Environment variables configured
3. → Deploy frontend to Vercel
4. → Run integration tests
5. → Deploy to production

## Files Reference

- `vercel-frontend.json` - Vercel configuration template
- `.env.local` - Local environment variables
- `vite.config.ts` - Build configuration
- `services/providers/backendAdapter.ts` - Backend API adapter
- `FRONTEND_BACKEND_INTEGRATION.md` - Integration guide

## Support

For issues:
1. Check Vercel deployment logs
2. Review backend API logs
3. Check browser console for errors
4. Verify environment variables are set correctly

