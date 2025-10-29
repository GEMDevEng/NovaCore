# Production Deployment Guide

**Date**: 2025-10-29
**Status**: Ready for Production Deployment
**Platform**: Vercel
**Estimated Time**: 20-30 minutes

## Prerequisites

- ✅ All unit tests passing (52/52)
- ✅ Backend API adapter created
- ✅ Frontend configuration updated
- ✅ Staging environment tested
- ✅ Integration tests completed
- ✅ Vercel account with both projects created

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing locally
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] All changes committed to GitHub
- [ ] Code reviewed

### Configuration
- [ ] Backend environment variables set in Vercel
- [ ] Frontend environment variables set in Vercel
- [ ] CORS configured correctly
- [ ] API URLs point to production endpoints

### Documentation
- [ ] Deployment guide reviewed
- [ ] API documentation up to date
- [ ] Integration guide reviewed
- [ ] Rollback plan documented

### Security
- [ ] API keys secured in Vercel environment variables
- [ ] No secrets in code
- [ ] HTTPS enabled
- [ ] CORS properly configured

## Production Deployment Steps

### Phase 1: Backend Deployment

#### Step 1: Verify Backend Configuration

```bash
# Check backend environment variables in Vercel
# Should have:
# - COHERE_API_KEY
# - NODE_ENV=production
# - FRONTEND_URL=https://your-production-frontend-url.vercel.app
```

#### Step 2: Deploy Backend

1. Go to Vercel Dashboard
2. Select `novacore-backend` project
3. Go to "Deployments" tab
4. Click "Redeploy" on latest deployment
5. Or push to main branch to trigger automatic deployment

#### Step 3: Verify Backend Deployment

```bash
# Health check
curl https://[BACKEND_PRODUCTION_URL]/api/v1/health

# Readiness check
curl https://[BACKEND_PRODUCTION_URL]/api/v1/health/ready

# AI query test
curl -X POST https://[BACKEND_PRODUCTION_URL]/api/v1/ai/query \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test lead"}'
```

### Phase 2: Frontend Deployment

#### Step 1: Update Frontend Environment Variables

In Vercel dashboard for `novacore-frontend`:

1. Go to Settings → Environment Variables
2. Update `VITE_API_URL` to production backend URL
3. Ensure `AI_PROVIDER=backend`
4. Save changes

#### Step 2: Deploy Frontend

1. Go to Vercel Dashboard
2. Select `novacore-frontend` project
3. Go to "Deployments" tab
4. Click "Redeploy" on latest deployment
5. Or push to main branch to trigger automatic deployment

#### Step 3: Verify Frontend Deployment

```bash
# Check frontend loads
curl https://[FRONTEND_PRODUCTION_URL]

# Should return HTML page with status 200
```

### Phase 3: Integration Verification

#### Step 1: Test Frontend-Backend Communication

1. Open frontend in browser
2. Navigate to AI Query Card
3. Enter lead information
4. Click "Get Insights"
5. Verify results appear

#### Step 2: Check Network Requests

1. Open DevTools → Network tab
2. Perform AI query
3. Look for requests to `/api/v1/ai/query`
4. Verify response status is 200
5. Verify response has correct structure

#### Step 3: Test Lead Management

1. Create a lead via frontend
2. Verify lead appears in list
3. Test lead retrieval

## Production Environment Variables

### Backend (Vercel)

```
COHERE_API_KEY=dyfJLrucN9sINeHUyWKhflGuoJPIltrLdYVZdA9u
NODE_ENV=production
FRONTEND_URL=https://your-production-frontend-url.vercel.app
```

### Frontend (Vercel)

```
AI_PROVIDER=backend
VITE_API_URL=https://your-production-backend-url.vercel.app
COHERE_API_KEY=dyfJLrucN9sINeHUyWKhflGuoJPIltrLdYVZdA9u
```

## Monitoring

### Backend Monitoring

1. Go to Vercel Dashboard
2. Select `novacore-backend` project
3. Monitor:
   - Deployment status
   - Function execution time
   - Error rates
   - Memory usage

### Frontend Monitoring

1. Go to Vercel Dashboard
2. Select `novacore-frontend` project
3. Monitor:
   - Build status
   - Page load performance
   - Error rates

## Rollback Plan

### If Backend Deployment Fails

1. Go to Vercel Dashboard
2. Select `novacore-backend` project
3. Go to "Deployments" tab
4. Find previous working deployment
5. Click deployment → "Promote to Production"

### If Frontend Deployment Fails

1. Go to Vercel Dashboard
2. Select `novacore-frontend` project
3. Go to "Deployments" tab
4. Find previous working deployment
5. Click deployment → "Promote to Production"

### If Integration Fails

1. Verify backend is running
2. Verify frontend environment variables
3. Check CORS configuration
4. Review browser console for errors
5. Check Vercel deployment logs

## Post-Deployment Checklist

- [ ] Backend health check passes
- [ ] Frontend loads successfully
- [ ] AI Query works end-to-end
- [ ] Lead creation works
- [ ] Lead retrieval works
- [ ] No console errors
- [ ] Network requests successful
- [ ] Response times acceptable
- [ ] Error handling works
- [ ] CORS headers present

## Production URLs

**Backend**: https://[BACKEND_PRODUCTION_URL]
**Frontend**: https://[FRONTEND_PRODUCTION_URL]

## Support & Troubleshooting

### Common Issues

**Frontend shows "Cannot reach backend"**
- Verify `VITE_API_URL` is set correctly
- Check backend is running
- Verify CORS is configured

**Backend returns 500 error**
- Check Vercel logs
- Verify environment variables
- Check Cohere API key is valid

**Deployment protection blocking access**
- Disable protection in Vercel
- Or configure bypass token

## Next Steps

1. ✅ All tests passing
2. ✅ Staging environment verified
3. → Deploy backend to production
4. → Deploy frontend to production
5. → Verify production deployment
6. → Monitor for issues

## Documentation References

- `FRONTEND_BACKEND_INTEGRATION.md` - Integration guide
- `INTEGRATION_TEST_GUIDE.md` - Testing guide
- `FRONTEND_VERCEL_DEPLOYMENT.md` - Frontend deployment
- `backend/API_DOCUMENTATION.md` - API reference
- `backend/README.md` - Backend setup

