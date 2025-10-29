# Integration Test Guide

**Date**: 2025-10-29
**Status**: Ready for Testing
**Scope**: Frontend-Backend Integration Testing

## Overview

This guide covers testing the complete integration between the NovaCore frontend and backend, ensuring they work together correctly in the staging environment.

## Test Scenarios

### Scenario 1: Health Check Integration

**Objective**: Verify both frontend and backend are healthy

**Steps**:
1. Start backend: `cd backend && npm run dev`
2. Start frontend: `npm run dev`
3. Run health check:

```bash
# Backend health
curl http://localhost:3001/api/v1/health

# Backend readiness
curl http://localhost:3001/api/v1/health/ready
```

**Expected Results**:
- Backend returns 200 status
- Response includes `status: "healthy"`
- Response includes `ready: true`

### Scenario 2: AI Query Integration

**Objective**: Test complete AI query flow from frontend to backend

**Steps**:
1. Open frontend at http://localhost:3000
2. Navigate to AI Query Card
3. Enter lead information:
   ```
   Name: John Doe
   Company: Acme Corp
   Budget: $100,000
   ```
4. Click "Get Insights"
5. Observe response

**Expected Results**:
- Request sent to backend `/api/v1/ai/query`
- Backend calls Cohere API
- Response includes:
  - `rating`: "High", "Medium", or "Low"
  - `cashForecast`: number (e.g., 100000)
  - `summary`: string with analysis

**Verification**:
- Open DevTools → Network tab
- Look for POST request to `/api/v1/ai/query`
- Verify response status is 200
- Verify response body has correct structure

### Scenario 3: Lead Creation Integration

**Objective**: Test lead creation through backend API

**Steps**:
1. Create a lead via API:

```bash
curl -X POST http://localhost:3001/api/v1/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "company": "Tech Startup",
    "source": "web"
  }'
```

**Expected Results**:
- Status code: 201 (Created)
- Response includes lead ID
- Response includes all submitted fields

### Scenario 4: Lead Retrieval Integration

**Objective**: Test retrieving leads from backend

**Steps**:
1. Get all leads:

```bash
curl http://localhost:3001/api/v1/leads
```

2. Get specific lead:

```bash
curl http://localhost:3001/api/v1/leads/{id}
```

**Expected Results**:
- Status code: 200
- Response includes array of leads
- Each lead has: id, name, email, company, source, createdAt

### Scenario 5: Error Handling Integration

**Objective**: Test error handling across frontend-backend

**Steps**:
1. Send invalid prompt:

```bash
curl -X POST http://localhost:3001/api/v1/ai/query \
  -H "Content-Type: application/json" \
  -d '{"prompt": ""}'
```

2. Send missing required field:

```bash
curl -X POST http://localhost:3001/api/v1/leads \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

**Expected Results**:
- Status code: 400 (Bad Request)
- Response includes error message
- Error message is descriptive

### Scenario 6: CORS Integration

**Objective**: Verify CORS is configured correctly

**Steps**:
1. Frontend makes request to backend
2. Check response headers

**Expected Results**:
- Response includes `Access-Control-Allow-Origin` header
- Header value matches frontend URL
- Preflight requests (OPTIONS) return 200

## Automated Testing

### Run Unit Tests

```bash
npm test
```

**Expected Output**:
```
Test Files  4 passed (4)
Tests       52 passed (52)
Duration    2.87s
```

### Run Backend Tests

```bash
cd backend
npm test
```

### Test Coverage

```bash
npm run test:coverage
```

## Staging Environment Testing

### Prerequisites

- Backend deployed at: https://backend-kjjvcfoin-gem-devs-projects.vercel.app
- Frontend deployed at: https://novacore-frontend-xyz.vercel.app
- Deployment protection disabled or bypass token configured

### Test Steps

1. **Health Check**:
```bash
curl https://backend-kjjvcfoin-gem-devs-projects.vercel.app/api/v1/health
```

2. **AI Query**:
```bash
curl -X POST https://backend-kjjvcfoin-gem-devs-projects.vercel.app/api/v1/ai/query \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Lead: John Doe, Company: Acme Corp, Budget: $100k"}'
```

3. **Frontend Integration**:
- Open frontend URL in browser
- Test AI Query Card
- Verify requests go to backend

## Troubleshooting

### "Cannot reach backend"
- Verify backend URL is correct
- Check backend is running/deployed
- Verify CORS is configured

### "Invalid response"
- Check backend API response format
- Verify all required fields are present
- Check data types match expected

### "Deployment protection"
- Disable protection in Vercel dashboard
- Or configure bypass token

## Test Results Template

```markdown
# Integration Test Results

**Date**: [DATE]
**Environment**: [LOCAL/STAGING/PRODUCTION]
**Tester**: [NAME]

## Test Scenarios

### Scenario 1: Health Check
- [ ] Backend health check passes
- [ ] Backend readiness check passes

### Scenario 2: AI Query
- [ ] Frontend sends request to backend
- [ ] Backend calls Cohere API
- [ ] Response has correct structure
- [ ] Frontend displays results

### Scenario 3: Lead Creation
- [ ] Lead created successfully
- [ ] Lead has correct fields
- [ ] Lead ID returned

### Scenario 4: Lead Retrieval
- [ ] Leads retrieved successfully
- [ ] All leads returned
- [ ] Correct fields present

### Scenario 5: Error Handling
- [ ] Invalid prompts rejected
- [ ] Missing fields rejected
- [ ] Error messages descriptive

### Scenario 6: CORS
- [ ] CORS headers present
- [ ] Preflight requests work
- [ ] Cross-origin requests allowed

## Summary

- Total Scenarios: 6
- Passed: [ ]
- Failed: [ ]
- Issues: [ ]
```

## Next Steps

1. ✅ Backend API adapter created
2. ✅ Frontend configuration updated
3. ✅ Frontend deployment guide created
4. → Run integration tests
5. → Deploy to production

