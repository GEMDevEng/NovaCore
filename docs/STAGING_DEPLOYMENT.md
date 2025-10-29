# Staging Deployment Guide - Vercel

**Version**: 2.0.0
**Date**: 2025-10-29
**Platform**: Vercel
**Environment**: Staging

---

## Overview

This guide documents the deployment of the NovaCore backend to Vercel's serverless platform. Vercel provides a free tier suitable for testing and staging deployments with serverless functions. The Express.js backend is wrapped in a Vercel serverless function handler for seamless deployment.

---

## Prerequisites

- Vercel account (free at https://vercel.com)
- GitHub account (for connecting repository)
- Cohere API key (from `.env.local`)
- Node.js 18+ (for local testing)

---

## Deployment Steps

### Step 1: Create Vercel Account

1. Visit https://vercel.com
2. Click "Sign Up"
3. Sign up with GitHub (recommended for easy integration)
4. Authorize Vercel to access your GitHub account

### Step 2: Create New Project

1. In Vercel dashboard, click "Add New..." → "Project"
2. Select "Import Git Repository"
3. Search for and select `NovaCore` repository
4. Click "Import"

### Step 3: Configure Project Settings

1. In the import dialog, configure:
   - **Project Name**: `novacore-backend` (or your preferred name)
   - **Root Directory**: `backend`
   - **Framework Preset**: `Other` (since we're using Express.js)
   - **Build Command**: `npm install`
   - **Output Directory**: Leave empty (not needed for serverless)

2. Click "Deploy"

### Step 4: Configure Environment Variables

After project creation, add environment variables:

1. Go to your project settings in Vercel dashboard
2. Click "Settings" → "Environment Variables"
3. Add the following environment variables:

```
COHERE_API_KEY=dyfJLrucN9sINeHUyWKhflGuoJPIltrLdYVZdA9u
NODE_ENV=staging
FRONTEND_URL=http://localhost:3000
```

**Important**:
- `NODE_ENV=staging` enables staging-specific logging
- `FRONTEND_URL` can be updated later when frontend is deployed
- Vercel automatically sets `VERCEL=1` environment variable

### Step 5: Deploy

1. Vercel automatically deploys when you push to GitHub
2. Or manually trigger deployment:
   - Click "Deployments" tab
   - Click "Redeploy" on the latest deployment
   - Wait for build to complete (usually 1-2 minutes)

### Step 6: Get Staging URL

1. After deployment completes, go to "Deployments" tab
2. Click on the latest deployment
3. Copy the production URL (format: `https://novacore-backend-[random].vercel.app`)
4. This is your **Staging Backend URL**

---

## Staging Backend URL

```
https://novacore-backend-[random].vercel.app
```

**Note**: Replace with actual URL after deployment. The URL is shown in Vercel dashboard under "Deployments".

---

## Testing Staging Endpoints

### 1. Health Check

```bash
curl https://novacore-backend-staging.railway.app/api/v1/health
```

**Expected Response**:
```json
{
  "status": "healthy",
  "uptime": 123.45,
  "services": {
    "database": "connected",
    "ai": "ready"
  },
  "environment": "staging",
  "timestamp": "2025-10-29T10:30:00Z"
}
```

### 2. Readiness Check

```bash
curl https://novacore-backend-staging.railway.app/api/v1/health/ready
```

**Expected Response**:
```json
{
  "ready": true,
  "services": {
    "ai": "ready"
  }
}
```

### 3. AI Query Endpoint

```bash
curl -X POST https://novacore-backend-staging.railway.app/api/v1/ai/query \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Lead: John Doe, Company: Acme Corp, Budget: $100k, Timeline: Q1 2025"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "rating": "High",
    "cashForecast": 100000,
    "summary": "High-quality lead with strong budget and clear timeline",
    "provider": "cohere",
    "timestamp": "2025-10-29T10:30:00Z"
  }
}
```

### 4. Create Lead

```bash
curl -X POST https://novacore-backend-staging.railway.app/api/v1/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Acme Corp",
    "source": "web"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Acme Corp",
    "source": "web",
    "createdAt": "2025-10-29T10:30:00Z"
  }
}
```

### 5. List Leads

```bash
curl https://novacore-backend-staging.railway.app/api/v1/leads
```

---

## Redeployment Process

### Automatic Redeployment

Vercel automatically redeploys when you push changes to the main branch:

```bash
# Make changes locally
git add .
git commit -m "feat: Update backend feature"
git push origin main

# Vercel automatically detects and deploys
# Check deployment status in Vercel dashboard
```

### Manual Redeployment

1. Go to Vercel dashboard
2. Select your project
3. Go to "Deployments" tab
4. Click "Redeploy" on the latest deployment
5. Wait for deployment to complete

### Rollback to Previous Deployment

1. Go to "Deployments" tab
2. Find the previous working deployment
3. Click the three-dot menu
4. Select "Promote to Production"
5. Confirm rollback

---

## Environment Variables Configuration

### Staging Environment Variables

```bash
# Required
COHERE_API_KEY=dyfJLrucN9sINeHUyWKhflGuoJPIltrLdYVZdA9u
NODE_ENV=staging

# Optional
FRONTEND_URL=http://localhost:3000
```

**Note**: Vercel automatically sets `VERCEL=1` environment variable in production.

### Updating Environment Variables

1. Go to Vercel dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Edit or add variables
5. Changes take effect on next deployment (redeploy to apply immediately)

---

## Monitoring and Logs

### View Logs

1. Go to Vercel dashboard
2. Select your project
3. Go to "Deployments" tab
4. Click on the latest deployment
5. Go to "Logs" tab to view real-time logs

### Common Log Messages

```
✅ NovaCore Backend running on http://localhost:3001
📚 API Documentation: http://localhost:3001/api/v1/health
🔌 AI Endpoints: http://localhost:3001/api/v1/ai
👥 Leads Endpoints: http://localhost:3001/api/v1/leads
```

### Error Monitoring

- Check logs for any error messages
- Verify environment variables are set correctly
- Ensure Cohere API key is valid
- Check CORS configuration for frontend URL

---

## Troubleshooting

### Deployment Failed

**Problem**: Build fails during deployment

**Solution**:
1. Check logs in Vercel dashboard (Deployments → Latest → Logs)
2. Verify `backend/package.json` exists
3. Ensure Node.js version is 18+
4. Check for syntax errors in code
5. Verify `backend/api/index.js` exists and exports the app

### Health Check Fails

**Problem**: `/api/v1/health` returns error

**Solution**:
1. Verify backend is running: Check logs
2. Verify environment variables are set
3. Check Cohere API key is valid
4. Verify network connectivity

### AI Query Returns Error

**Problem**: `/api/v1/ai/query` returns error

**Solution**:
1. Verify `COHERE_API_KEY` is set correctly
2. Check Cohere API status at https://status.cohere.com
3. Verify prompt is valid JSON
4. Check logs for detailed error message

### CORS Errors

**Problem**: Frontend cannot reach backend

**Solution**:
1. Update `FRONTEND_URL` environment variable
2. Ensure frontend URL is correct
3. Check browser console for CORS error details
4. Verify backend is accessible from frontend

---

## Performance Considerations

### Response Times

- **Health Check**: <100ms
- **AI Query**: 200-500ms (depends on Cohere API)
- **Lead Operations**: <50ms
- **Batch Queries**: 500-2000ms (depends on batch size)
- **Cold Start**: 1-3 seconds (first request after deployment or inactivity)

### Scaling

Vercel automatically scales based on traffic:
- Free tier: Limited concurrent executions and invocations
- Serverless functions: Auto-scale based on demand
- Monitor usage in Vercel dashboard
- Note: Free tier has limitations on function invocations per month

---

## Security

### API Key Management

- ✅ Cohere API key stored in Railway environment variables
- ✅ Never commit API keys to repository
- ✅ Use `.env.local` for local development only
- ✅ Rotate API keys periodically

### CORS Configuration

- ✅ CORS enabled for specified frontend URL
- ✅ Credentials allowed for authenticated requests
- ✅ Update `FRONTEND_URL` when deploying frontend

### HTTPS

- ✅ Railway provides HTTPS by default
- ✅ All traffic encrypted in transit
- ✅ SSL certificate auto-renewed

---

## Maintenance

### Regular Tasks

- [ ] Monitor logs for errors
- [ ] Check API response times
- [ ] Verify health endpoints
- [ ] Update dependencies monthly
- [ ] Review and rotate API keys quarterly

### Backup and Recovery

- Railway automatically backs up deployments
- Previous deployments available for rollback
- No manual backup needed for staging

---

## Next Steps

1. ✅ Deploy backend to Railway
2. ✅ Test all endpoints
3. → Update frontend to use staging backend URL
4. → Deploy frontend to staging
5. → Run integration tests
6. → Deploy to production

---

## Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel Documentation**: https://vercel.com/docs
- **Vercel Serverless Functions**: https://vercel.com/docs/functions/serverless-functions
- **Cohere API Status**: https://status.cohere.com
- **Backend API Documentation**: `backend/API_DOCUMENTATION.md`

---

## Support

For issues or questions:
1. Check Railway logs in dashboard
2. Review this guide's troubleshooting section
3. Check Cohere API status
4. Review backend code in `backend/src/`

---

**Last Updated**: 2025-10-29
**Status**: Ready for Vercel Staging Deployment
**Platform**: Vercel Serverless Functions


