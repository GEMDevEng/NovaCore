# NovaCore Full-Stack Testing Guide

**Last Updated**: October 29, 2025  
**Frontend**: https://novacore-frontend-seven.vercel.app  
**Backend**: https://backend-q4s5npax9-gem-devs-projects.vercel.app

---

## Quick Start

### 1. Open the Application
Visit: https://novacore-frontend-seven.vercel.app

You should see the NovaCore dashboard with:
- Header with navigation
- Sidebar with menu options
- Main content area with dashboard cards
- AI Query Card for business insights

---

## Testing Scenarios

### Scenario 1: Verify Frontend Loads ✅

**Steps**:
1. Open https://novacore-frontend-seven.vercel.app
2. Wait for page to fully load (should see dashboard)
3. Open DevTools (F12) → Console tab
4. Check for any JavaScript errors

**Expected Results**:
- ✅ Page loads without errors
- ✅ Dashboard is visible
- ✅ No red errors in console
- ✅ All UI components render correctly

---

### Scenario 2: Test Lead Creation

**Steps**:
1. Open the application
2. Look for "Create Lead" or "Add Lead" button/form
3. Fill in the form with:
   - Name: "Test Lead"
   - Email: "test@example.com"
   - Company: "Test Company"
   - Source: "web"
4. Click "Create" or "Submit"

**Expected Results**:
- ✅ Lead is created successfully
- ✅ Success message appears
- ✅ Lead appears in the leads list
- ✅ No CORS errors in DevTools Network tab

**Debugging**:
- Open DevTools → Network tab
- Look for POST request to `/api/v1/leads`
- Check response status (should be 201)
- If CORS error: Backend CORS not configured correctly

---

### Scenario 3: Test Lead Listing

**Steps**:
1. Navigate to Leads section
2. View the list of leads
3. Verify pagination works (if multiple leads)

**Expected Results**:
- ✅ All created leads are displayed
- ✅ Lead details show correctly
- ✅ Pagination controls work

---

### Scenario 4: Test AI Query (After COHERE_API_KEY is Set)

**Steps**:
1. Open the AI Query Card
2. Enter a lead description:
   ```
   Lead: John Doe
   Company: Tech Startup
   Budget: $100,000
   Timeline: Q1 2026
   ```
3. Click "Get Insights" or "Analyze"

**Expected Results**:
- ✅ Request sent to backend
- ✅ AI analysis returned
- ✅ Shows rating (High/Medium/Low)
- ✅ Shows cash forecast
- ✅ Shows summary

**Note**: This requires COHERE_API_KEY to be set in backend Vercel environment

---

### Scenario 5: Test API Directly (CLI)

#### Health Check
```bash
curl https://backend-q4s5npax9-gem-devs-projects.vercel.app/api/v1/health
```

#### Create Lead
```bash
curl -X POST https://backend-q4s5npax9-gem-devs-projects.vercel.app/api/v1/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "CLI Test Lead",
    "email": "cli@test.com",
    "company": "CLI Test Co",
    "source": "web"
  }'
```

#### List Leads
```bash
curl https://backend-q4s5npax9-gem-devs-projects.vercel.app/api/v1/leads
```

#### AI Query (requires COHERE_API_KEY)
```bash
curl -X POST https://backend-q4s5npax9-gem-devs-projects.vercel.app/api/v1/ai/query \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Lead: John Doe, Company: Tech Startup, Budget: $100k"
  }'
```

---

## Troubleshooting

### Issue: Blank Page
**Solution**:
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+Shift+R)
- Check DevTools Console for errors
- Verify JavaScript is enabled

### Issue: CORS Error
**Error Message**: "Access to XMLHttpRequest blocked by CORS policy"
**Solution**:
- Backend CORS configuration needs to include frontend domain
- Check backend/src/index.js CORS settings
- Verify frontend URL is in allowedOrigins list
- Redeploy backend after changes

### Issue: Lead Creation Fails
**Error**: "Validation Error: 'source' is required"
**Solution**:
- Ensure all required fields are filled:
  - name (required)
  - email (required, must be valid email)
  - company (required)
  - source (required, must be: web, email, phone, or referral)

### Issue: AI Query Returns Error
**Error**: "AI service not available - COHERE_API_KEY not configured"
**Solution**:
1. Go to Vercel backend project settings
2. Add environment variable: `COHERE_API_KEY=<your_key>`
3. Redeploy the backend
4. Wait 2-3 minutes for deployment to complete
5. Try AI query again

---

## DevTools Debugging

### Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Perform an action (create lead, query AI)
4. Look for requests to backend
5. Check:
   - Status code (200, 201, 400, 500, etc.)
   - Response body
   - Headers (especially CORS headers)

### Console Tab
1. Open DevTools (F12)
2. Go to Console tab
3. Look for errors (red text)
4. Check for warnings (yellow text)
5. Use `console.log()` to debug

### Application Tab
1. Open DevTools (F12)
2. Go to Application tab
3. Check Local Storage for environment variables
4. Verify API URL is correct

---

## Performance Metrics

**Expected Response Times**:
- Health check: < 100ms
- Create lead: < 200ms
- List leads: < 200ms
- AI query: 1-3 seconds (depends on Cohere API)

**Expected Bundle Size**:
- HTML: ~2 KB
- JavaScript: ~1.5 MB (gzipped: ~350 KB)
- CSS: Included in JS (Tailwind)

---

## Success Criteria

✅ **Full-Stack Integration is Working When**:
1. Frontend loads without errors
2. Can create leads through UI
3. Leads appear in the list
4. No CORS errors in console
5. Backend API responds to requests
6. All HTTP status codes are correct

✅ **AI Features Working When**:
1. COHERE_API_KEY is set in backend
2. AI query endpoint returns 200 status
3. Response includes rating, cashForecast, summary
4. Frontend displays AI insights correctly

---

## Support

For issues or questions:
1. Check this guide first
2. Review FULL_STACK_INTEGRATION_VERIFICATION.md
3. Check backend logs in Vercel dashboard
4. Check frontend console in DevTools

