# Vercel Environment Variables Fix - Technical Guide

## Problem Analysis

### What Was Happening
The backend was deployed on Vercel but couldn't access the `COHERE_API_KEY` environment variable, even though it was set in the Vercel Dashboard.

### Why It Failed
1. **dotenv.config() in Serverless:** The code was calling `dotenv.config({ path: '../.env.local' })` unconditionally
2. **No .env Files in Serverless:** Vercel's serverless functions don't have access to `.env` files from the local filesystem
3. **Environment Variables Are Different:** In Vercel, environment variables are injected by the platform and available via `process.env`

---

## The Fix

### 1. Conditional dotenv Loading
**File:** `backend/src/index.js`

```javascript
// BEFORE (Always tried to load .env file)
dotenv.config({ path: '../.env.local' });

// AFTER (Only load in local development)
if (!process.env.VERCEL) {
  dotenv.config({ path: '../.env.local' });
}
```

**Why This Works:**
- `process.env.VERCEL` is automatically set by Vercel in serverless environment
- In local development, `process.env.VERCEL` is undefined, so dotenv loads the file
- In Vercel, environment variables are already available from Dashboard

### 2. Debug Logging
**File:** `backend/src/services/aiService.js`

Added logging to help diagnose environment variable issues:

```javascript
const isVercel = !!process.env.VERCEL;
const nodeEnv = process.env.NODE_ENV;
console.log(`[AiService] Environment: Vercel=${isVercel}, NODE_ENV=${nodeEnv}`);
console.log(`[AiService] COHERE_API_KEY present: ${!!apiKey}`);
```

**Benefits:**
- Logs show whether running on Vercel or locally
- Shows if COHERE_API_KEY is detected
- Helps troubleshoot future environment variable issues

### 3. Vercel Configuration
**File:** `backend/vercel.json`

Added `buildEnv` section:

```json
"buildEnv": {
  "COHERE_API_KEY": "@cohere_api_key"
}
```

**Purpose:**
- Explicitly references environment variables for the build process
- Ensures variables are available to serverless functions

---

## How Environment Variables Work in Vercel

### Local Development
1. Code calls `dotenv.config({ path: '../.env.local' })`
2. dotenv reads `.env.local` file
3. Variables are loaded into `process.env`
4. Code accesses via `process.env.COHERE_API_KEY`

### Vercel Deployment
1. You set variables in Vercel Dashboard (Settings → Environment Variables)
2. Vercel injects them into the serverless function environment
3. Variables are available in `process.env` automatically
4. Code accesses via `process.env.COHERE_API_KEY` (same as local)

---

## Setting Up Environment Variables in Vercel

### Step 1: Go to Vercel Dashboard
- Navigate to your backend project
- Click "Settings"
- Select "Environment Variables"

### Step 2: Add COHERE_API_KEY
- **Name:** `COHERE_API_KEY`
- **Value:** `lwywziC4aMW6UTPjf8TyhxlsEcrGBrE924i9eHsc`
- **Environments:** Select all (Production, Preview, Development)

### Step 3: Redeploy
- Go to "Deployments"
- Click "Redeploy" on the latest deployment
- Or push a new commit to trigger automatic deployment

### Step 4: Verify
- Call `/api/v1/health` endpoint
- Check logs for `[AiService] COHERE_API_KEY present: true`
- Verify AI service status is "initialized"

---

## Troubleshooting

### Issue: Still seeing "COHERE_API_KEY not configured"

**Check 1: Variable is Set in Dashboard**
- Go to Vercel Dashboard → Settings → Environment Variables
- Confirm `COHERE_API_KEY` is listed
- Confirm it's enabled for Production environment

**Check 2: Redeploy After Setting Variable**
- Environment variables set in Dashboard don't apply to existing deployments
- Must redeploy after setting variables
- Go to Deployments → Click "Redeploy" on latest

**Check 3: Check Deployment Logs**
- Go to Deployments → Click on latest deployment
- Check "Function Logs" for `[AiService]` messages
- Should see: `COHERE_API_KEY present: true`

**Check 4: Verify Variable Name**
- Code expects: `COHERE_API_KEY` (exact case)
- Dashboard must have: `COHERE_API_KEY` (exact case)
- Variable names are case-sensitive

### Issue: Works Locally but Not on Vercel

**Likely Cause:** Variable not set in Vercel Dashboard

**Solution:**
1. Verify `.env.local` exists locally with the key
2. Add same key to Vercel Dashboard
3. Redeploy backend
4. Check logs to confirm variable is present

---

## Best Practices

1. **Never Commit .env Files**
   - `.env.local` should be in `.gitignore`
   - Never hardcode API keys in source code

2. **Use Different Keys for Different Environments**
   - Development: Use test/development API key
   - Production: Use production API key
   - Set different values in Vercel for Preview vs Production

3. **Rotate Keys Regularly**
   - If a key is exposed, rotate it immediately
   - Update in Vercel Dashboard
   - Redeploy to apply changes

4. **Monitor Logs**
   - Check deployment logs for environment variable issues
   - Look for `[AiService]` debug messages
   - Verify "COHERE_API_KEY present: true" on each deployment

---

## Reference

- **Vercel Docs:** https://vercel.com/docs/projects/environment-variables
- **Node.js dotenv:** https://github.com/motdotla/dotenv
- **Cohere API:** https://docs.cohere.com/

