# NovaCore Backend API Documentation

**Version**: 1.0.0  
**Base URL**: `http://localhost:3001/api/v1`  
**Environment**: Development

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Error Handling](#error-handling)
4. [AI Endpoints](#ai-endpoints)
5. [Leads Endpoints](#leads-endpoints)
6. [Health Endpoints](#health-endpoints)
7. [Examples](#examples)

---

## Overview

NovaCore Backend provides REST API endpoints for:
- **AI-Powered Business Intelligence**: Query Cohere API for lead qualification
- **Lead Management**: CRUD operations for leads
- **Health Monitoring**: System health and readiness checks

### Architecture

```
Frontend (React/Vite)
    ↓
Backend API (Express.js)
    ↓
AI Service (Cohere API)
```

The backend integrates with the frontend's provider abstraction pattern, allowing seamless switching between AI providers.

---

## Authentication

Currently, the API does not require authentication. In production, implement JWT-based authentication:

```javascript
// Future: Add Authorization header
Authorization: Bearer <jwt_token>
```

---

## Error Handling

All errors follow a consistent format:

```json
{
  "error": "Error Type",
  "message": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `INVALID_PROMPT` | 400 | Invalid AI prompt |
| `LEAD_NOT_FOUND` | 404 | Lead not found |
| `AI_SERVICE_ERROR` | 500 | AI service error |
| `INTERNAL_SERVER_ERROR` | 500 | Server error |

---

## AI Endpoints

### POST /ai/query

Get business insights for a lead using AI analysis.

**Request**:
```bash
curl -X POST http://localhost:3001/api/v1/ai/query \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Lead: John Doe, Company: Acme Corp, Industry: Tech, Budget: $100k"
  }'
```

**Request Body**:
```json
{
  "prompt": "string (required, max 5000 chars)"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "rating": "High",
    "cashForecast": 50000,
    "summary": "High-quality lead with strong budget and decision-making authority",
    "provider": "cohere",
    "timestamp": "2025-10-29T10:30:00Z"
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "error": "Validation Error",
  "message": "Prompt must be a non-empty string",
  "code": "INVALID_PROMPT"
}
```

---

### GET /ai/health

Check AI service health and provider status.

**Request**:
```bash
curl http://localhost:3001/api/v1/ai/health
```

**Response** (200 OK):
```json
{
  "status": "healthy",
  "provider": "cohere",
  "model": "command-r-plus",
  "status": "initialized",
  "timestamp": "2025-10-29T10:30:00Z"
}
```

---

### GET /ai/provider

Get current AI provider information.

**Request**:
```bash
curl http://localhost:3001/api/v1/ai/provider
```

**Response** (200 OK):
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

---

### POST /ai/batch

Process multiple queries in batch (max 10 per request).

**Request**:
```bash
curl -X POST http://localhost:3001/api/v1/ai/batch \
  -H "Content-Type: application/json" \
  -d '{
    "queries": [
      { "prompt": "Lead 1 info" },
      { "prompt": "Lead 2 info" }
    ]
  }'
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "count": 2,
    "results": [
      {
        "rating": "High",
        "cashForecast": 50000,
        "summary": "..."
      },
      {
        "rating": "Medium",
        "cashForecast": 25000,
        "summary": "..."
      }
    ]
  }
}
```

---

## Leads Endpoints

### POST /leads

Create a new lead.

**Request**:
```bash
curl -X POST http://localhost:3001/api/v1/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Acme Corp",
    "phone": "+1-555-0123",
    "source": "web",
    "notes": "Referred by existing customer"
  }'
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Acme Corp",
    "phone": "+1-555-0123",
    "source": "web",
    "notes": "Referred by existing customer",
    "rating": null,
    "cashForecast": null,
    "createdAt": "2025-10-29T10:30:00Z",
    "updatedAt": "2025-10-29T10:30:00Z"
  }
}
```

---

### GET /leads

List all leads with pagination and filtering.

**Query Parameters**:
- `source`: Filter by source (web, email, phone, referral)
- `rating`: Filter by rating (High, Medium, Low)
- `limit`: Results per page (default: 50)
- `offset`: Pagination offset (default: 0)

**Request**:
```bash
curl "http://localhost:3001/api/v1/leads?source=web&limit=10&offset=0"
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "leads": [...],
    "pagination": {
      "total": 100,
      "limit": 10,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

---

### GET /leads/:id

Get a specific lead by ID.

**Request**:
```bash
curl http://localhost:3001/api/v1/leads/550e8400-e29b-41d4-a716-446655440000
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    ...
  }
}
```

---

### PATCH /leads/:id

Update a lead.

**Request**:
```bash
curl -X PATCH http://localhost:3001/api/v1/leads/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "rating": "High",
    "cashForecast": 50000,
    "notes": "Updated notes"
  }'
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "rating": "High",
    "cashForecast": 50000,
    ...
  }
}
```

---

### DELETE /leads/:id

Delete a lead.

**Request**:
```bash
curl -X DELETE http://localhost:3001/api/v1/leads/550e8400-e29b-41d4-a716-446655440000
```

**Response** (204 No Content)

---

## Health Endpoints

### GET /health

Overall system health check.

**Response** (200 OK):
```json
{
  "status": "healthy",
  "timestamp": "2025-10-29T10:30:00Z",
  "uptime": 3600,
  "services": {
    "ai": {
      "status": "healthy",
      "provider": "cohere",
      "model": "command-r-plus"
    },
    "api": {
      "status": "healthy",
      "version": "1.0.0"
    }
  }
}
```

---

### GET /health/ready

Readiness probe (for Kubernetes).

**Response** (200 OK):
```json
{
  "ready": true
}
```

---

### GET /health/live

Liveness probe (for Kubernetes).

**Response** (200 OK):
```json
{
  "alive": true
}
```

---

## Examples

### Complete Workflow

1. **Create a lead**:
```bash
curl -X POST http://localhost:3001/api/v1/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "company": "Tech Innovations",
    "source": "email"
  }'
```

2. **Get AI insights for the lead**:
```bash
curl -X POST http://localhost:3001/api/v1/ai/query \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Lead: Jane Smith, Company: Tech Innovations, Industry: SaaS, Budget: $250k"
  }'
```

3. **Update lead with AI insights**:
```bash
curl -X PATCH http://localhost:3001/api/v1/leads/<lead_id> \
  -H "Content-Type: application/json" \
  -d '{
    "rating": "High",
    "cashForecast": 250000
  }'
```

---

## Integration with Frontend

The backend seamlessly integrates with the frontend's provider abstraction:

```typescript
// Frontend (React)
import { getProvider } from './services/providers';

const provider = getProvider();
const insights = await provider.getBusinessInsights(prompt);

// Backend (Express)
// POST /api/v1/ai/query
// Returns same structure as frontend provider
```

---

## Deployment

### Environment Variables

```bash
# .env.local
PORT=3001
NODE_ENV=development
COHERE_API_KEY=your_api_key_here
AI_PROVIDER=cohere
FRONTEND_URL=http://localhost:3000
```

### Running the Backend

```bash
# Development
npm run dev

# Production
npm start

# Tests
npm test
```

---

## Performance Considerations

- **AI Query Timeout**: 30 seconds
- **Batch Size Limit**: 10 queries per batch
- **Prompt Length Limit**: 5000 characters
- **Rate Limiting**: Implement in production

---

## Future Enhancements

- [ ] Database integration (PostgreSQL)
- [ ] JWT authentication
- [ ] Rate limiting
- [ ] Caching layer (Redis)
- [ ] GraphQL endpoint
- [ ] WebSocket support for real-time updates
- [ ] Advanced analytics and reporting


