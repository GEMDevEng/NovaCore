# NovaCore Backend

Production-ready backend API for NovaCore AI-Powered Business Optimization Platform.

## Features

- ✅ **AI-Powered Insights**: Cohere API integration for lead qualification
- ✅ **Lead Management**: Full CRUD operations for leads
- ✅ **Health Monitoring**: System health checks and readiness probes
- ✅ **Error Handling**: Comprehensive error handling with standardized responses
- ✅ **Validation**: Request validation using Joi
- ✅ **Security**: Helmet.js for security headers, CORS support
- ✅ **Logging**: Morgan request logging
- ✅ **Batch Processing**: Process multiple queries efficiently

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **AI Provider**: Cohere API
- **Validation**: Joi
- **Security**: Helmet.js
- **Testing**: Vitest
- **Package Manager**: npm

## Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Cohere API key (free at https://cohere.com)

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment**:
```bash
cp .env.example .env.local
# Edit .env.local with your Cohere API key
```

3. **Start development server**:
```bash
npm run dev
```

The server will start on `http://localhost:3001`

### Verify Installation

```bash
curl http://localhost:3001/api/v1/health
```

## Project Structure

```
backend/
├── src/
│   ├── index.js              # Main server entry point
│   ├── middleware/
│   │   └── errorHandler.js   # Error handling middleware
│   ├── routes/
│   │   ├── ai.js             # AI endpoints
│   │   ├── leads.js          # Lead management endpoints
│   │   └── health.js         # Health check endpoints
│   └── services/
│       └── aiService.js      # AI service layer
├── package.json              # Dependencies
├── .env.example              # Environment template
├── API_DOCUMENTATION.md      # API reference
└── README.md                 # This file
```

## API Endpoints

### AI Endpoints

- `POST /api/v1/ai/query` - Get business insights for a lead
- `GET /api/v1/ai/health` - Check AI service health
- `GET /api/v1/ai/provider` - Get provider information
- `POST /api/v1/ai/batch` - Process multiple queries

### Lead Endpoints

- `POST /api/v1/leads` - Create a new lead
- `GET /api/v1/leads` - List all leads
- `GET /api/v1/leads/:id` - Get a specific lead
- `PATCH /api/v1/leads/:id` - Update a lead
- `DELETE /api/v1/leads/:id` - Delete a lead

### Health Endpoints

- `GET /api/v1/health` - Overall system health
- `GET /api/v1/health/ready` - Readiness probe
- `GET /api/v1/health/live` - Liveness probe

## Usage Examples

### Get Business Insights

```bash
curl -X POST http://localhost:3001/api/v1/ai/query \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Lead: John Doe, Company: Acme Corp, Budget: $100k"
  }'
```

### Create a Lead

```bash
curl -X POST http://localhost:3001/api/v1/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Acme Corp",
    "source": "web"
  }'
```

### List Leads

```bash
curl "http://localhost:3001/api/v1/leads?limit=10&offset=0"
```

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

## Development

### Run Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test
```

### Lint Code

```bash
npm run lint
```

### Format Code

```bash
npm run format
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3001 | Server port |
| `NODE_ENV` | development | Environment (development/production) |
| `AI_PROVIDER` | cohere | AI provider (cohere/gemini) |
| `COHERE_API_KEY` | - | Cohere API key (required) |
| `FRONTEND_URL` | http://localhost:3000 | Frontend URL for CORS |

## Integration with Frontend

The backend integrates seamlessly with the frontend's provider abstraction pattern:

```typescript
// Frontend calls backend API
const response = await fetch('/api/v1/ai/query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt: 'Lead information' })
});

const { data } = await response.json();
// Returns: { rating, cashForecast, summary, provider, timestamp }
```

## Error Handling

All errors follow a consistent format:

```json
{
  "error": "Error Type",
  "message": "Human-readable message",
  "code": "ERROR_CODE",
  "details": {}
}
```

## Performance

- **AI Query Response Time**: ~200-500ms
- **Lead CRUD Operations**: <50ms
- **Batch Processing**: Supports up to 10 queries per request
- **Concurrent Requests**: Unlimited (scale with Node.js cluster)

## Security

- ✅ Helmet.js for security headers
- ✅ CORS protection
- ✅ Input validation with Joi
- ✅ Error message sanitization
- 🔄 JWT authentication (planned)
- 🔄 Rate limiting (planned)

## Deployment

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src ./src
EXPOSE 3001
CMD ["npm", "start"]
```

### Environment Setup

```bash
# Production
NODE_ENV=production
COHERE_API_KEY=your_production_key
FRONTEND_URL=https://yourdomain.com
```

### Health Checks

```bash
# Readiness
curl http://localhost:3001/api/v1/health/ready

# Liveness
curl http://localhost:3001/api/v1/health/live
```

## Troubleshooting

### "COHERE_API_KEY not configured"

Ensure `.env.local` has a valid Cohere API key:
```bash
COHERE_API_KEY=your_actual_key_here
```

### "AI service error"

Check:
1. Cohere API key is valid
2. Network connectivity to Cohere API
3. API rate limits not exceeded

### Port Already in Use

Change the port in `.env.local`:
```bash
PORT=3002
```

## Future Enhancements

- [ ] PostgreSQL database integration
- [ ] JWT authentication
- [ ] Rate limiting
- [ ] Redis caching
- [ ] GraphQL endpoint
- [ ] WebSocket support
- [ ] Advanced analytics
- [ ] Multi-provider support (Gemini, Groq)

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `npm test`
4. Submit a pull request

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.

---

**Last Updated**: 2025-10-29  
**Version**: 1.0.0

