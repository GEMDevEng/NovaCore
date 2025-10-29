# Vercel Staging Deployment - Step-by-Step Instructions

**Date**: 2025-10-29
**Status**: Ready to Deploy
**Platform**: Vercel
**Estimated Time**: 10-15 minutes

---

## Prerequisites

Before starting, ensure you have:
- [ ] Vercel account (free at https://vercel.com)
- [ ] GitHub account with access to NovaCore repository
- [ ] Cohere API key: `dyfJLrucN9sINeHUyWKhflGuoJPIltrLdYVZdA9u`
- [ ] Internet connection

---

## Step 1: Create Vercel Account (If Needed)

### 1.1 Visit Vercel
```
Go to https://vercel.com
```

### 1.2 Sign Up
```
Click "Sign Up"
Select "Continue with GitHub"
Authorize Vercel to access your GitHub account
```

### 1.3 Verify Email
```
Check your email for verification link
Click link to verify account
```

---

## Step 2: Create New Project

### 2.1 Go to Dashboard
```
After signing in, you'll see the Vercel dashboard
Click "Add New..." → "Project"
```

### 2.2 Select Deployment Method
```
Click "Import Git Repository"
```

### 2.3 Search for Repository
```
Search for "NovaCore" in the search box
Click on "GEMDevEng/NovaCore" repository
```

### 2.4 Authorize Vercel
```
If prompted, authorize Vercel to access your repository
Click "Authorize"
```

### 2.5 Configure Import Settings
```
Project Name: novacore-backend
Root Directory: backend
Framework Preset: Other
Click "Import"
```

---

## Step 3: Configure Build Settings

### 3.1 Wait for Initial Detection
```
Vercel will automatically detect Node.js project
Wait for detection to complete (usually 30 seconds)
```

### 3.2 Verify Root Directory
```
Root Directory should be: backend
This was set during import
```

### 3.3 Verify Build Command
```
Build Command should be: npm install
Vercel will auto-detect from package.json
```

### 3.4 Verify Node Version
```
Node.js version should be 18+
Vercel will auto-detect from package.json
```

---

## Step 4: Set Environment Variables

### 4.1 Go to Environment Variables
```
In Vercel dashboard:
1. Click on your project
2. Go to "Settings" tab
3. Click "Environment Variables"
```

### 4.2 Add Environment Variables
```
Click "Add New" button
Add the following variables:

Variable 1:
  Key: COHERE_API_KEY
  Value: dyfJLrucN9sINeHUyWKhflGuoJPIltrLdYVZdA9u

Variable 2:
  Key: NODE_ENV
  Value: staging

Variable 3:
  Key: FRONTEND_URL
  Value: http://localhost:3000
```

### 4.3 Verify Variables
```
All three variables should be visible in the Environment Variables list
They will be applied to the next deployment
```

---

## Step 5: Deploy Backend

### 5.1 Trigger Deployment
```
Option A (Automatic):
- Vercel automatically deploys when you push to GitHub
- Changes are already pushed, so deployment should start

Option B (Manual):
- Go to "Deployments" tab
- Click "Redeploy" on the latest deployment
- Wait for deployment to start
```

### 5.2 Monitor Deployment
```
Go to "Deployments" tab
Watch the deployment progress
You should see:
  - Building... (1-2 minutes)
  - Deploying... (30 seconds)
  - Success ✓
```

### 5.3 Wait for Completion
```
Deployment typically takes 1-2 minutes
You'll see a green checkmark when complete
```

---

## Step 6: Get Staging URL

### 6.1 Find Public URL
```
In Vercel dashboard:
1. Go to "Deployments" tab
2. Click on the latest deployment
3. Look for the production URL at the top
4. Copy the URL
```

### 6.2 Save Staging URL
```
Example format:
https://novacore-backend-[random].vercel.app

Save this URL for testing
```

### 6.3 Update Documentation
```
Update TASK_1_DEPLOYMENT_SUMMARY.md with actual URL
Update docs/STAGING_DEPLOYMENT.md with actual URL
```

---

## Step 7: Test Staging Endpoints

### 7.1 Test Health Check
```bash
curl https://[STAGING_URL]/api/v1/health
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

### 7.2 Test Readiness
```bash
curl https://[STAGING_URL]/api/v1/health/ready
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

### 7.3 Test AI Query
```bash
curl -X POST https://[STAGING_URL]/api/v1/ai/query \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Lead: John Doe, Company: Acme Corp, Budget: $100k"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "rating": "High",
    "cashForecast": 100000,
    "summary": "High-quality lead with strong budget",
    "provider": "cohere",
    "timestamp": "2025-10-29T10:30:00Z"
  }
}
```

### 7.4 Test Create Lead
```bash
curl -X POST https://[STAGING_URL]/api/v1/leads \
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

### 7.5 Test List Leads
```bash
curl https://[STAGING_URL]/api/v1/leads
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "leads": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1
    }
  }
}
```

---

## Step 8: Verify Logs

### 8.1 Check Deployment Logs
```
In Vercel dashboard:
1. Go to "Deployments" tab
2. Click on the latest deployment
3. Go to "Logs" tab
4. Look for startup messages
5. Verify no error messages
```

### 8.2 Expected Log Messages
```
✅ NovaCore Backend running on Vercel serverless environment
📚 API Documentation: /api/v1/health
🔌 AI Endpoints: /api/v1/ai
👥 Leads Endpoints: /api/v1/leads
```

### 8.3 Check for Errors
```
If you see error messages:
1. Check environment variables are set correctly
2. Verify Cohere API key is valid
3. Verify backend/api/index.js exists
4. Check logs for detailed error message
5. See troubleshooting section below
```

---

## Troubleshooting

### Issue: Deployment Failed

**Solution**:
1. Check logs in Vercel dashboard (Deployments → Latest → Logs)
2. Verify `backend/package.json` exists
3. Verify `backend/api/index.js` exists
4. Ensure Node.js version is 18+
5. Check for syntax errors in code
6. Try redeploying

### Issue: Health Check Returns Error

**Solution**:
1. Verify backend is running (check logs)
2. Verify environment variables are set in Vercel dashboard
3. Check Cohere API key is valid
4. Wait 30 seconds and try again (cold start)

### Issue: AI Query Returns Error

**Solution**:
1. Verify `COHERE_API_KEY` is set correctly in Vercel
2. Check Cohere API status at https://status.cohere.com
3. Verify prompt is valid JSON
4. Check logs for detailed error message

### Issue: Cannot Access Staging URL

**Solution**:
1. Verify URL is correct (from Vercel dashboard)
2. Check if deployment is complete
3. Wait 1-2 minutes for DNS propagation
4. Try accessing health endpoint
5. Check for cold start delays (first request may take 1-3 seconds)

---

## Success Checklist

After deployment, verify:

- [ ] Deployment shows "Success" in Railway dashboard
- [ ] Staging URL is accessible
- [ ] Health check returns 200 status
- [ ] Readiness check returns ready: true
- [ ] AI query returns insights
- [ ] Create lead returns 201 status
- [ ] List leads returns leads array
- [ ] No error messages in logs
- [ ] Response times are acceptable (<500ms)

---

## Next Steps

After successful deployment:

1. ✅ Backend deployed to Railway
2. ✅ All endpoints tested
3. ✅ Staging URL verified
4. → Update frontend to use staging backend URL
5. → Deploy frontend to staging
6. → Run integration tests
7. → Deploy to production

---

## Important Notes

### Automatic Redeployment
```
Railway automatically redeploys when you push to GitHub:
git add .
git commit -m "feat: Update backend"
git push origin main
# Railway automatically deploys
```

### Manual Redeployment
```
In Railway dashboard:
1. Click "Redeploy" button
2. Wait for deployment to complete
```

### Rollback
```
If deployment has issues:
1. Go to "Deployments" tab
2. Find previous working deployment
3. Click "Rollback" button
4. Confirm rollback
```

---

## Support Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Vercel Serverless Functions**: https://vercel.com/docs/functions/serverless-functions
- **Cohere API Status**: https://status.cohere.com
- **Backend API Documentation**: `backend/API_DOCUMENTATION.md`
- **Staging Deployment Guide**: `docs/STAGING_DEPLOYMENT.md`

---

**Status**: Ready to Deploy
**Estimated Time**: 10-15 minutes
**Difficulty**: Easy
**Platform**: Vercel Serverless Functions


