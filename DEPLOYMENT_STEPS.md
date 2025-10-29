# Deployment Steps - Complete Guide

## Current Status
✅ Code changes committed and pushed to GitHub
✅ Frontend builds successfully
✅ Backend syntax validated
⏳ Ready for Vercel deployment

---

## Step 1: Verify GitHub Push

```bash
# Check that changes are on GitHub
git log --oneline -5
# Should show: c77f961 Fix: Disable authentication bypass and fix COHERE_API_KEY loading on Vercel
```

**Expected Output:**
```
c77f961 Fix: Disable authentication bypass and fix COHERE_API_KEY loading on Vercel
95624ba Previous commit...
```

---

## Step 2: Deploy Frontend to Vercel

### Option A: Automatic Deployment (Recommended)
1. Go to Vercel Dashboard
2. Select "NovaCore Frontend" project
3. Go to "Deployments" tab
4. Click "Redeploy" on the latest deployment
5. Wait for deployment to complete (usually 2-3 minutes)

### Option B: Manual Trigger
1. Push a new commit to main branch
2. Vercel automatically detects and deploys
3. Check Deployments tab for status

### Verification
1. Visit: `https://novacore-frontend-6nlesuvn3-gem-devs-projects.vercel.app`
2. Should see dashboard immediately (no login screen)
3. User info shows: "Demo User" (demo@novacore.app)
4. All navigation sections should be accessible

---

## Step 3: Configure Backend Environment Variables

### CRITICAL: Set COHERE_API_KEY in Vercel Dashboard

1. **Go to Vercel Dashboard**
   - Navigate to "NovaCore Backend" project
   - Click "Settings" tab

2. **Add Environment Variable**
   - Click "Environment Variables"
   - Click "Add New"
   - **Name:** `COHERE_API_KEY`
   - **Value:** `lwywziC4aMW6UTPjf8TyhxlsEcrGBrE924i9eHsc`
   - **Environments:** Select all (Production, Preview, Development)
   - Click "Save"

3. **Verify Variable is Set**
   - Should see `COHERE_API_KEY` in the list
   - Status should show it's enabled

---

## Step 4: Deploy Backend to Vercel

### Deploy with New Environment Variables

1. **Go to Deployments Tab**
   - In Vercel Dashboard → Backend Project → Deployments
   - Find the latest deployment

2. **Redeploy**
   - Click the three dots menu on latest deployment
   - Select "Redeploy"
   - Confirm redeploy
   - Wait for deployment to complete (usually 2-3 minutes)

### Monitor Deployment
- Watch the "Building" status
- Check "Function Logs" for any errors
- Should see: `[AiService] COHERE_API_KEY present: true`

---

## Step 5: Verify Backend Deployment

### Test Health Endpoint
```bash
curl https://backend-hlzualdvn-gem-devs-projects.vercel.app/api/v1/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-29T...",
  "uptime": 123.45,
  "services": {
    "ai": {
      "status": "healthy",
      "provider": "cohere",
      "model": "command-r-plus",
      "status": "initialized"
    },
    "api": {
      "status": "healthy",
      "version": "1.0.0"
    }
  },
  "environment": {
    "nodeVersion": "v18.x.x",
    "platform": "linux"
  }
}
```

### Test AI Provider Endpoint
```bash
curl https://backend-hlzualdvn-gem-devs-projects.vercel.app/api/v1/ai/provider
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "provider": "cohere",
    "model": "command-r-plus",
    "status": "initialized"
  }
}
```

### Check Deployment Logs
1. Go to Vercel Dashboard → Backend Project → Deployments
2. Click on latest deployment
3. Click "Function Logs"
4. Look for messages like:
   - `[AiService] Environment: Vercel=true, NODE_ENV=production`
   - `[AiService] COHERE_API_KEY present: true`
   - `✅ Initializing Cohere client with API key`

---

## Step 6: End-to-End Testing

### Test 1: Frontend Access
- [ ] Visit frontend URL
- [ ] Dashboard loads immediately (no login)
- [ ] User shows as "Demo User"
- [ ] All navigation sections accessible

### Test 2: Backend Health
- [ ] Health endpoint returns "healthy"
- [ ] AI service shows "initialized"
- [ ] No "not configured" warnings

### Test 3: AI Functionality (Optional)
```bash
curl -X POST https://backend-hlzualdvn-gem-devs-projects.vercel.app/api/v1/ai/query \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test lead: Company ABC, $100k revenue, 5 employees"}'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "rating": "High|Medium|Low",
    "cashForecast": 50000,
    "summary": "Analysis summary...",
    "provider": "cohere",
    "timestamp": "2025-10-29T..."
  }
}
```

---

## Troubleshooting

### Frontend Shows Login Screen
- **Issue:** Authentication bypass not working
- **Solution:** 
  - Verify `BYPASS_AUTH = true` in `context/AuthContext.tsx`
  - Redeploy frontend
  - Clear browser cache (Ctrl+Shift+Delete)

### Backend Health Shows "unhealthy"
- **Issue:** COHERE_API_KEY not set or not loaded
- **Solution:**
  - Verify variable is set in Vercel Dashboard
  - Check it's enabled for Production environment
  - Redeploy backend
  - Check Function Logs for errors

### AI Service Shows "not_initialized"
- **Issue:** COHERE_API_KEY not present in environment
- **Solution:**
  - Same as above - verify and redeploy

### CORS Errors in Frontend
- **Issue:** Frontend can't reach backend
- **Solution:**
  - Verify frontend URL is in CORS allowlist in `backend/src/index.js`
  - Current URL: `https://novacore-frontend-6nlesuvn3-gem-devs-projects.vercel.app`
  - If different, add to allowlist and redeploy

---

## Rollback Plan

If something goes wrong:

1. **Frontend Issues**
   - Go to Vercel Dashboard → Deployments
   - Click on previous deployment
   - Click "Redeploy"

2. **Backend Issues**
   - Same process as frontend
   - Or remove COHERE_API_KEY from environment variables and redeploy

---

## Success Criteria

✅ All items below should be true:
- [ ] Frontend deployed and accessible
- [ ] Dashboard loads without login
- [ ] Backend deployed and accessible
- [ ] Health endpoint returns "healthy"
- [ ] AI service shows "initialized"
- [ ] No error messages in logs
- [ ] COHERE_API_KEY is set in Vercel Dashboard
- [ ] All tests pass

---

## Support

If you encounter issues:
1. Check Function Logs in Vercel Dashboard
2. Review VERCEL_ENV_VAR_FIX.md for environment variable troubleshooting
3. Check FIXES_SUMMARY.md for overview of changes
4. Verify all steps in this guide were completed

