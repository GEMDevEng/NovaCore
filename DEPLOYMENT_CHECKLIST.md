# Deployment Checklist - Step by Step

## Pre-Deployment Verification ✅

### Code Quality
- [x] Frontend builds successfully
- [x] Backend syntax validated
- [x] No TypeScript errors
- [x] No console errors
- [x] All imports resolved

### Security
- [x] No API keys hardcoded in source
- [x] No API keys in git history
- [x] `.env.local` in `.gitignore`
- [x] No secrets in error messages
- [x] No secrets in logs

### Git
- [x] All changes committed
- [x] Changes pushed to GitHub
- [x] Commit: c77f961
- [x] Branch: main
- [x] No uncommitted changes

---

## Frontend Deployment

### Step 1: Access Vercel Dashboard
- [ ] Go to https://vercel.com
- [ ] Log in with your account
- [ ] Select "NovaCore Frontend" project
- [ ] Click "Deployments" tab

### Step 2: Redeploy Frontend
- [ ] Find the latest deployment
- [ ] Click the three dots menu
- [ ] Select "Redeploy"
- [ ] Confirm redeploy
- [ ] Wait for deployment to complete (2-3 minutes)

### Step 3: Monitor Deployment
- [ ] Watch "Building" status
- [ ] Check for any build errors
- [ ] Verify deployment completes successfully
- [ ] Note the deployment URL

### Step 4: Verify Frontend
- [ ] Visit: https://novacore-frontend-6nlesuvn3-gem-devs-projects.vercel.app
- [ ] Dashboard should load immediately
- [ ] No login screen shown
- [ ] User shows as "Demo User"
- [ ] All navigation sections accessible

---

## Backend Environment Variable Setup

### Step 1: Access Vercel Dashboard
- [ ] Go to https://vercel.com
- [ ] Log in with your account
- [ ] Select "NovaCore Backend" project
- [ ] Click "Settings" tab

### Step 2: Add Environment Variable
- [ ] Click "Environment Variables"
- [ ] Click "Add New"
- [ ] **Name:** `COHERE_API_KEY`
- [ ] **Value:** `lwywziC4aMW6UTPjf8TyhxlsEcrGBrE924i9eHsc`
- [ ] **Environments:** Select all (Production, Preview, Development)
- [ ] Click "Save"

### Step 3: Verify Variable
- [ ] Variable appears in the list
- [ ] Status shows it's enabled
- [ ] All environments are selected

---

## Backend Deployment

### Step 1: Access Vercel Dashboard
- [ ] Go to https://vercel.com
- [ ] Select "NovaCore Backend" project
- [ ] Click "Deployments" tab

### Step 2: Redeploy Backend
- [ ] Find the latest deployment
- [ ] Click the three dots menu
- [ ] Select "Redeploy"
- [ ] Confirm redeploy
- [ ] Wait for deployment to complete (2-3 minutes)

### Step 3: Monitor Deployment
- [ ] Watch "Building" status
- [ ] Check for any build errors
- [ ] Verify deployment completes successfully
- [ ] Click on deployment to view logs

### Step 4: Check Logs
- [ ] Click "Function Logs"
- [ ] Look for: `[AiService] Environment: Vercel=true`
- [ ] Look for: `[AiService] COHERE_API_KEY present: true`
- [ ] Look for: `✅ Initializing Cohere client with API key`
- [ ] No error messages about missing API key

---

## Post-Deployment Verification

### Test 1: Frontend Access
- [ ] Visit frontend URL
- [ ] Dashboard loads immediately
- [ ] No login screen
- [ ] User: "Demo User" (demo@novacore.app)
- [ ] All sections accessible (Dashboard, Analytics, Reports, Calendar, Contacts)

### Test 2: Backend Health Check
```bash
curl https://backend-hlzualdvn-gem-devs-projects.vercel.app/api/v1/health
```
- [ ] Response status: 200
- [ ] `"status": "healthy"`
- [ ] AI service status: `"healthy"`
- [ ] AI service status: `"initialized"`

### Test 3: Backend AI Provider
```bash
curl https://backend-hlzualdvn-gem-devs-projects.vercel.app/api/v1/ai/provider
```
- [ ] Response status: 200
- [ ] `"provider": "cohere"`
- [ ] `"status": "initialized"`
- [ ] `"model": "command-r-plus"`

### Test 4: AI Query (Optional)
```bash
curl -X POST https://backend-hlzualdvn-gem-devs-projects.vercel.app/api/v1/ai/query \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test lead: Company ABC, $100k revenue"}'
```
- [ ] Response status: 200
- [ ] Contains: `"rating"`, `"cashForecast"`, `"summary"`
- [ ] `"provider": "cohere"`
- [ ] No error messages

---

## Troubleshooting

### Issue: Frontend Shows Login Screen
- [ ] Check: `BYPASS_AUTH = true` in `context/AuthContext.tsx`
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Hard refresh (Ctrl+F5)
- [ ] Redeploy frontend

### Issue: Backend Health Shows "unhealthy"
- [ ] Check: COHERE_API_KEY is set in Vercel Dashboard
- [ ] Check: Variable is enabled for Production
- [ ] Check: Redeploy backend after setting variable
- [ ] Check: Function Logs for error messages

### Issue: AI Service Shows "not_initialized"
- [ ] Check: COHERE_API_KEY is present in environment
- [ ] Check: Variable name is exactly `COHERE_API_KEY`
- [ ] Check: Function Logs for initialization errors
- [ ] Redeploy backend

### Issue: CORS Errors
- [ ] Check: Frontend URL is in CORS allowlist
- [ ] Current URL: `https://novacore-frontend-6nlesuvn3-gem-devs-projects.vercel.app`
- [ ] If different, add to `backend/src/index.js` CORS config
- [ ] Redeploy backend

---

## Rollback Plan

If deployment fails:

### Rollback Frontend
1. Go to Vercel Dashboard → Frontend → Deployments
2. Find previous successful deployment
3. Click three dots → "Redeploy"
4. Confirm

### Rollback Backend
1. Go to Vercel Dashboard → Backend → Deployments
2. Find previous successful deployment
3. Click three dots → "Redeploy"
4. Confirm

### Remove Environment Variable
1. Go to Vercel Dashboard → Backend → Settings → Environment Variables
2. Find `COHERE_API_KEY`
3. Click delete
4. Redeploy backend

---

## Sign-Off

### Deployment Completed
- [ ] Frontend deployed successfully
- [ ] Backend environment variable set
- [ ] Backend deployed successfully
- [ ] All verification tests passed
- [ ] No errors in logs
- [ ] Users can access dashboard
- [ ] AI service is operational

### Date Deployed: _______________
### Deployed By: _______________
### Notes: _______________

---

## Support

For issues:
1. Check DEPLOYMENT_STEPS.md for detailed guide
2. Check VERCEL_ENV_VAR_FIX.md for env var troubleshooting
3. Review Vercel Function Logs
4. Check git commit c77f961 for exact changes

---

**Status:** READY FOR DEPLOYMENT
**Last Updated:** 2025-10-29
**Commit:** c77f961

