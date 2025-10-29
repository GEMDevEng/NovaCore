# Vercel Staging Deployment Checklist

**Date**: 2025-10-29  
**Status**: Ready for Deployment  
**Platform**: Vercel

---

## Pre-Deployment Checklist

### Code Quality
- [x] All tests passing (52/52)
- [x] No TypeScript errors
- [x] No console errors
- [x] Code committed to GitHub
- [x] Backend code in `backend/` directory

### Configuration Files
- [x] `backend/package.json` - Configured with correct scripts
- [x] `backend/vercel.json` - Vercel configuration created
- [x] `backend/.vercelignore` - Vercel ignore file created
- [x] `backend/api/index.js` - Serverless handler created
- [x] `.env.local` - Local environment configured

### Documentation
- [x] `docs/STAGING_DEPLOYMENT.md` - Deployment guide updated for Vercel
- [x] `backend/README.md` - Backend setup guide
- [x] `backend/API_DOCUMENTATION.md` - API reference

### Dependencies
- [x] All dependencies in `package.json`
- [x] Node.js 18+ requirement specified
- [x] No missing dependencies

---

## Deployment Steps

### Step 1: Prepare Repository
```bash
# Ensure all changes are committed
git add .
git commit -m "chore: Switch deployment platform from Railway to Vercel"
git push origin main
```

### Step 2: Create Vercel Account
- [ ] Visit https://vercel.com
- [ ] Sign up with GitHub
- [ ] Authorize Vercel access

### Step 3: Create New Project
- [ ] Click "Add New..." → "Project" in Vercel dashboard
- [ ] Select "Import Git Repository"
- [ ] Search for "NovaCore" repository
- [ ] Click "Import"

### Step 4: Configure Project Settings
- [ ] Set Project Name: `novacore-backend`
- [ ] Set Root Directory: `backend`
- [ ] Set Framework Preset: `Other`
- [ ] Verify Build Command: `npm install`

### Step 5: Set Environment Variables
- [ ] Add `COHERE_API_KEY=dyfJLrucN9sINeHUyWKhflGuoJPIltrLdYVZdA9u`
- [ ] Add `NODE_ENV=staging`
- [ ] Add `FRONTEND_URL=http://localhost:3000`
- [ ] Verify all variables are set

### Step 6: Deploy
- [ ] Click "Deploy" button
- [ ] Wait for build to complete (1-2 minutes)
- [ ] Verify deployment status shows "Success"

### Step 7: Get Staging URL
- [ ] Go to "Deployments" tab
- [ ] Copy production URL from latest deployment
- [ ] Save URL for testing

---

## Post-Deployment Testing

### Test 1: Health Check
```bash
curl https://[STAGING_URL]/api/v1/health
```
- [ ] Returns 200 status
- [ ] Response includes status, uptime, services
- [ ] Environment shows "staging"

### Test 2: Readiness Check
```bash
curl https://[STAGING_URL]/api/v1/health/ready
```
- [ ] Returns 200 status
- [ ] Response shows ready: true
- [ ] All services ready

### Test 3: AI Query
```bash
curl -X POST https://[STAGING_URL]/api/v1/ai/query \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test lead"}'
```
- [ ] Returns 200 status
- [ ] Response includes rating, cashForecast, summary
- [ ] Provider shows "cohere"

### Test 4: Create Lead
```bash
curl -X POST https://[STAGING_URL]/api/v1/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "company": "Test Co",
    "source": "web"
  }'
```
- [ ] Returns 201 status
- [ ] Response includes lead ID
- [ ] Lead data matches request

### Test 5: List Leads
```bash
curl https://[STAGING_URL]/api/v1/leads
```
- [ ] Returns 200 status
- [ ] Response includes leads array
- [ ] Pagination info included

### Test 6: Get Lead
```bash
curl https://[STAGING_URL]/api/v1/leads/[LEAD_ID]
```
- [ ] Returns 200 status
- [ ] Response includes lead details
- [ ] Lead ID matches request

### Test 7: Update Lead
```bash
curl -X PATCH https://[STAGING_URL]/api/v1/leads/[LEAD_ID] \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Name"}'
```
- [ ] Returns 200 status
- [ ] Response includes updated lead
- [ ] Changes reflected in data

### Test 8: Delete Lead
```bash
curl -X DELETE https://[STAGING_URL]/api/v1/leads/[LEAD_ID]
```
- [ ] Returns 200 status
- [ ] Response confirms deletion
- [ ] Lead no longer in list

### Test 9: Batch Query
```bash
curl -X POST https://[STAGING_URL]/api/v1/ai/batch \
  -H "Content-Type: application/json" \
  -d '{
    "queries": [
      {"prompt": "Lead 1"},
      {"prompt": "Lead 2"}
    ]
  }'
```
- [ ] Returns 200 status
- [ ] Response includes results array
- [ ] All queries processed

### Test 10: Error Handling
```bash
curl -X POST https://[STAGING_URL]/api/v1/ai/query \
  -H "Content-Type: application/json" \
  -d '{}'
```
- [ ] Returns 400 status
- [ ] Response includes error message
- [ ] Error code provided

---

## Monitoring

### Check Logs
- [ ] Go to Vercel dashboard
- [ ] Select project
- [ ] Go to "Deployments" tab
- [ ] Click latest deployment
- [ ] Go to "Logs" tab
- [ ] Verify no error messages

### Monitor Performance
- [ ] Response times acceptable (<500ms for AI queries)
- [ ] No timeout errors
- [ ] No memory issues
- [ ] CPU usage reasonable

### Verify Uptime
- [ ] Service running continuously
- [ ] No unexpected restarts
- [ ] Health checks passing

---

## Vercel-Specific Considerations

### Cold Starts
- [ ] First request after deployment may take 1-3 seconds
- [ ] Subsequent requests are faster
- [ ] Monitor cold start times in logs

### Serverless Limitations
- [ ] Function timeout: 30 seconds (configured in vercel.json)
- [ ] Memory: 1024 MB (configured in vercel.json)
- [ ] Free tier has monthly invocation limits
- [ ] Monitor usage in Vercel dashboard

### Environment Variables
- [ ] Variables set in Vercel dashboard (not in code)
- [ ] Changes require redeployment
- [ ] Use "Redeploy" button to apply changes

---

## Troubleshooting

### If Deployment Fails
- [ ] Check logs in Vercel dashboard
- [ ] Verify `backend/package.json` exists
- [ ] Verify `backend/api/index.js` exists
- [ ] Ensure Node.js version is 18+
- [ ] Check for syntax errors in code
- [ ] Verify all dependencies are listed

### If Health Check Fails
- [ ] Verify backend is running (check logs)
- [ ] Verify environment variables are set in Vercel
- [ ] Check Cohere API key is valid
- [ ] Verify network connectivity
- [ ] Wait for cold start to complete

### If AI Query Fails
- [ ] Verify `COHERE_API_KEY` is set correctly in Vercel
- [ ] Check Cohere API status
- [ ] Verify prompt is valid JSON
- [ ] Check logs for detailed error

### If CORS Errors Occur
- [ ] Update `FRONTEND_URL` environment variable
- [ ] Ensure frontend URL is correct
- [ ] Check browser console for error details
- [ ] Verify backend is accessible

---

## Deployment Information

### Staging Backend URL
```
https://[STAGING_URL]
```

**To be filled after deployment**

### Environment Variables Set
- ✅ COHERE_API_KEY
- ✅ NODE_ENV=staging
- ✅ FRONTEND_URL=http://localhost:3000

### Deployment Date
- **Date**: 2025-10-29
- **Time**: [To be filled]
- **Status**: [To be filled]

---

## Next Steps After Deployment

1. ✅ Deploy backend to Vercel
2. ✅ Test all endpoints
3. → Update frontend to use staging backend URL
4. → Deploy frontend to staging
5. → Run integration tests
6. → Deploy to production

---

## Rollback Plan

If deployment has issues:

1. Go to Vercel dashboard
2. Select project
3. Go to "Deployments" tab
4. Find previous working deployment
5. Click the three-dot menu
6. Select "Promote to Production"
7. Verify service is restored

---

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Serverless**: https://vercel.com/docs/functions/serverless-functions
- **Cohere Status**: https://status.cohere.com
- **Backend API Docs**: `backend/API_DOCUMENTATION.md`
- **Staging Guide**: `docs/STAGING_DEPLOYMENT.md`

---

**Status**: Ready for Deployment  
**Last Updated**: 2025-10-29  
**Platform**: Vercel Serverless Functions

