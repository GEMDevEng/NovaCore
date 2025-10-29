# Backend Integration Guide

**Version**: 1.0.0  
**Date**: 2025-10-29  
**Status**: Production Ready

---

## Overview

This guide explains how the NovaCore backend integrates with the frontend and maintains the provider abstraction pattern established in Phase 2 and Phase 3.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React/Vite)                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  AiQueryCard.tsx                                     │  │
│  │  - Displays AI insights                              │  │
│  │  - Calls aiService.getBusinessInsights()            │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  aiService.ts (Provider Abstraction)                │  │
│  │  - getBusinessInsights(prompt)                       │  │
│  │  - getProvider()                                     │  │
│  │  - Can call backend OR use local provider            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                  Backend (Express.js)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  POST /api/v1/ai/query                               │  │
│  │  - Receives prompt                                   │  │
│  │  - Calls AI service                                  │  │
│  │  - Returns insights                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  aiService.js (Backend)                              │  │
│  │  - Integrates with Cohere API                        │  │
│  │  - Validates responses                               │  │
│  │  - Returns structured insights                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Cohere API                                          │  │
│  │  - command-r-plus model                              │  │
│  │  - Returns AI-generated insights                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Response Format Consistency

Both frontend and backend return the same response structure:

```typescript
interface AiInsight {
  rating: "High" | "Medium" | "Low";
  cashForecast: number;
  summary: string;
  provider?: string;
  timestamp?: string;
}
```

### Frontend Response (Local Provider)
```json
{
  "rating": "High",
  "cashForecast": 50000,
  "summary": "High-quality lead with strong budget"
}
```

### Backend Response (API)
```json
{
  "success": true,
  "data": {
    "rating": "High",
    "cashForecast": 50000,
    "summary": "High-quality lead with strong budget",
    "provider": "cohere",
    "timestamp": "2025-10-29T10:30:00Z"
  }
}
```

## Integration Modes

### Mode 1: Frontend-Only (Current)

The frontend uses the local provider abstraction without backend:

```typescript
// src/services/aiService.ts
import { getProvider } from './providers';

export async function getBusinessInsights(prompt: string) {
  const provider = getProvider();
  return provider.getBusinessInsights(prompt);
}
```

**Pros**:
- No backend required
- Faster response times
- Works offline

**Cons**:
- API key exposed in frontend
- Limited scalability
- No lead persistence

### Mode 2: Backend Integration (Recommended)

The frontend calls the backend API:

```typescript
// src/services/aiService.ts
export async function getBusinessInsights(prompt: string) {
  const response = await fetch('/api/v1/ai/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  
  const { data } = await response.json();
  return data;
}
```

**Pros**:
- API key secure on backend
- Lead persistence
- Scalable
- Batch processing
- Analytics

**Cons**:
- Requires backend
- Slightly higher latency
- Network dependency

## Switching Between Modes

### To Use Backend API

1. **Update aiService.ts**:
```typescript
const API_URL = process.env.VITE_API_URL || 'http://localhost:3001';

export async function getBusinessInsights(prompt: string) {
  const response = await fetch(`${API_URL}/api/v1/ai/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  
  const { data } = await response.json();
  return data;
}
```

2. **Update .env.local**:
```bash
VITE_API_URL=http://localhost:3001
```

3. **Start backend**:
```bash
cd backend
npm install
npm run dev
```

### To Use Frontend Provider

Keep the current implementation:
```typescript
import { getProvider } from './providers';

export async function getBusinessInsights(prompt: string) {
  const provider = getProvider();
  return provider.getBusinessInsights(prompt);
}
```

## Provider Abstraction Pattern

The provider abstraction allows switching between implementations:

```typescript
// Interface (same for frontend and backend)
interface IAiProvider {
  getBusinessInsights(prompt: string): Promise<AiInsight>;
  getName(): string;
  healthCheck(): Promise<boolean>;
}

// Frontend: Local provider
class CohereAdapter implements IAiProvider {
  async getBusinessInsights(prompt: string): Promise<AiInsight> {
    // Direct Cohere API call
  }
}

// Backend: API provider
// POST /api/v1/ai/query
// Returns same structure
```

## Backward Compatibility

The implementation maintains 100% backward compatibility:

1. **Frontend components unchanged**: `AiQueryCard.tsx` works with both modes
2. **Type definitions unchanged**: `AiInsight` interface remains the same
3. **Response format unchanged**: Same structure from both sources
4. **Environment variables**: Both modes support configuration

## Testing Integration

### Test Frontend-Only Mode

```bash
# Terminal 1: Start frontend
npm run dev

# Terminal 2: Run tests
npm test
```

### Test Backend Integration

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
npm run dev

# Terminal 3: Run tests
npm test
```

### Test Backend API

```bash
# Health check
curl http://localhost:3001/api/v1/health

# Query AI
curl -X POST http://localhost:3001/api/v1/ai/query \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test lead"}'

# Create lead
curl -X POST http://localhost:3001/api/v1/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Acme",
    "source": "web"
  }'
```

## Performance Comparison

| Metric | Frontend-Only | Backend API |
|--------|---------------|------------|
| Response Time | ~200-500ms | ~300-600ms |
| Throughput | Limited | Scalable |
| Concurrency | Single user | Multiple users |
| Lead Persistence | No | Yes |
| Batch Processing | No | Yes (10 max) |
| API Key Security | Low | High |

## Migration Path

### Phase 1: Current State ✅
- Frontend-only with local provider
- All tests passing
- No backend required

### Phase 2: Backend Ready (This Phase)
- Backend API implemented
- Can be deployed independently
- Frontend can switch to backend mode

### Phase 3: Gradual Migration (Future)
- Deploy backend to production
- Update frontend to use backend API
- Monitor performance and errors
- Maintain fallback to local provider

### Phase 4: Full Backend Integration (Future)
- All requests go through backend
- Database integration
- Advanced analytics
- Multi-provider support

## Configuration

### Frontend Configuration

```bash
# .env.local
VITE_API_URL=http://localhost:3001
AI_PROVIDER=cohere
COHERE_API_KEY=your_key_here  # Only needed for frontend-only mode
```

### Backend Configuration

```bash
# backend/.env.local
PORT=3001
NODE_ENV=development
AI_PROVIDER=cohere
COHERE_API_KEY=your_key_here
FRONTEND_URL=http://localhost:3000
```

## Error Handling

### Frontend Error Handling

```typescript
try {
  const insights = await getBusinessInsights(prompt);
  // Use insights
} catch (error) {
  console.error('Failed to get insights:', error);
  // Show error to user
}
```

### Backend Error Handling

```javascript
// All errors return consistent format
{
  "error": "Error Type",
  "message": "Human-readable message",
  "code": "ERROR_CODE"
}
```

## Security Considerations

### Frontend-Only Mode
- ⚠️ API key exposed in browser
- ⚠️ Rate limiting not enforced
- ✅ Works offline

### Backend Mode
- ✅ API key secure on server
- ✅ Rate limiting enforced
- ✅ Request validation
- ✅ CORS protection
- 🔄 JWT authentication (planned)

## Deployment

### Frontend Deployment

```bash
npm run build
# Deploy dist/ to Vercel, Netlify, or static host
```

### Backend Deployment

```bash
cd backend
npm install --production
npm start
# Deploy to Heroku, Railway, or Docker container
```

### Environment Variables

**Frontend** (Vercel/Netlify):
```
VITE_API_URL=https://api.yourdomain.com
```

**Backend** (Heroku/Railway):
```
COHERE_API_KEY=your_production_key
FRONTEND_URL=https://yourdomain.com
NODE_ENV=production
```

## Monitoring

### Frontend Monitoring
- Error tracking (Sentry)
- Performance monitoring (Vercel Analytics)
- User analytics (Mixpanel)

### Backend Monitoring
- Health checks: `/api/v1/health`
- Readiness probe: `/api/v1/health/ready`
- Liveness probe: `/api/v1/health/live`
- Request logging: Morgan middleware
- Error logging: Console + external service

## Troubleshooting

### "Cannot reach backend"
- Verify backend is running: `curl http://localhost:3001/api/v1/health`
- Check CORS configuration
- Verify VITE_API_URL is correct

### "API key not configured"
- Check `.env.local` has COHERE_API_KEY
- Verify key is valid at https://cohere.com

### "Response format mismatch"
- Ensure both frontend and backend return same structure
- Check API response wrapper (success, data)

## Next Steps

1. ✅ Backend API implemented
2. ✅ All tests passing
3. → Deploy backend to staging
4. → Update frontend to use backend API
5. → Monitor performance
6. → Deploy to production

---

**For more details, see**:
- [Backend API Documentation](../backend/API_DOCUMENTATION.md)
- [Backend README](../backend/README.md)
- [Phase 3 Completion Report](./PHASE_3_COMPLETION.md)


