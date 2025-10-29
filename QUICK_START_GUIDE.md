# NovaCore Quick Start Guide

**Version**: 1.0.0  
**Last Updated**: 2025-10-29

---

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 18+
- npm or yarn
- Cohere API key (free at https://cohere.com)

---

## Option 1: Frontend Only (Fastest)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
# Create .env.local if it doesn't exist
echo "COHERE_API_KEY=your_api_key_here" > .env.local
echo "AI_PROVIDER=cohere" >> .env.local
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Open in Browser
```
http://localhost:3000
```

### 5. Test AI Features
- Navigate to the AI Query Card
- Enter a lead description
- Get instant AI insights

---

## Option 2: Frontend + Backend (Recommended)

### Terminal 1: Start Backend

```bash
cd backend
npm install
cp .env.example .env.local
# Edit .env.local with your Cohere API key
npm run dev
```

Backend will start on `http://localhost:3001`

### Terminal 2: Start Frontend

```bash
npm install
npm run dev
```

Frontend will start on `http://localhost:3000`

### Terminal 3: Run Tests (Optional)

```bash
npm test
```

---

## 🧪 Test the API

### Health Check
```bash
curl http://localhost:3001/api/v1/health
```

### Get AI Insights
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
curl http://localhost:3001/api/v1/leads
```

---

## 📁 Project Structure

```
NovaCore/
├── src/                          # Frontend source
│   ├── components/
│   │   └── AiQueryCard.tsx       # AI query component
│   ├── services/
│   │   ├── aiService.ts          # AI service
│   │   └── providers/            # Provider abstraction
│   │       ├── index.ts          # Provider factory
│   │       ├── cohereAdapter.ts  # Cohere implementation
│   │       └── geminiAdapter.ts  # Gemini implementation
│   └── types/
│       └── index.ts              # Type definitions
├── backend/                      # Backend API
│   ├── src/
│   │   ├── index.js              # Main server
│   │   ├── routes/               # API routes
│   │   ├── services/             # Business logic
│   │   └── middleware/           # Middleware
│   ├── package.json
│   └── README.md
├── docs/                         # Documentation
├── tests/                        # Test files
└── package.json
```

---

## 🔧 Configuration

### Frontend (.env.local)
```bash
# AI Provider
COHERE_API_KEY=your_cohere_api_key_here
AI_PROVIDER=cohere

# Backend (optional)
VITE_API_URL=http://localhost:3001
```

### Backend (backend/.env.local)
```bash
# Server
PORT=3001
NODE_ENV=development

# AI Provider
COHERE_API_KEY=your_cohere_api_key_here
AI_PROVIDER=cohere

# Frontend
FRONTEND_URL=http://localhost:3000
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `FINAL_PROJECT_STATUS.md` | Project completion report |
| `PHASE_3_AND_BACKEND_COMPLETION.md` | Phase 3 & backend summary |
| `TEST_RESULTS.md` | Test execution report |
| `backend/README.md` | Backend setup guide |
| `backend/API_DOCUMENTATION.md` | Complete API reference |
| `docs/BACKEND_INTEGRATION_GUIDE.md` | Integration guide |
| `docs/COHERE_INTEGRATION_GUIDE.md` | Cohere setup guide |

---

## 🧪 Running Tests

### All Tests
```bash
npm test
```

### Tests in Watch Mode
```bash
npm run test
```

### Tests with UI
```bash
npm run test:ui
```

### Backend Tests
```bash
cd backend
npm test
```

---

## 🚀 Deployment

### Frontend Deployment

```bash
# Build
npm run build

# Deploy dist/ to Vercel, Netlify, or static host
```

### Backend Deployment

```bash
cd backend

# Build
npm run build

# Deploy to Heroku, Railway, or Docker
npm start
```

---

## 🐛 Troubleshooting

### "COHERE_API_KEY not configured"
- Check `.env.local` has valid API key
- Get key from https://cohere.com

### "Cannot reach backend"
- Verify backend is running: `curl http://localhost:3001/api/v1/health`
- Check CORS configuration
- Verify VITE_API_URL is correct

### "Port already in use"
- Change port in `.env.local`: `PORT=3002`
- Or kill process: `lsof -ti:3001 | xargs kill -9`

### Tests failing
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm run test -- --clearCache`

---

## 📖 API Quick Reference

### AI Endpoints
- `POST /api/v1/ai/query` - Get insights
- `GET /api/v1/ai/health` - Check health
- `GET /api/v1/ai/provider` - Provider info
- `POST /api/v1/ai/batch` - Batch queries

### Lead Endpoints
- `POST /api/v1/leads` - Create
- `GET /api/v1/leads` - List
- `GET /api/v1/leads/:id` - Get
- `PATCH /api/v1/leads/:id` - Update
- `DELETE /api/v1/leads/:id` - Delete

### Health Endpoints
- `GET /api/v1/health` - System health
- `GET /api/v1/health/ready` - Readiness
- `GET /api/v1/health/live` - Liveness

---

## 🎯 Next Steps

1. ✅ Get Cohere API key
2. ✅ Configure environment
3. ✅ Start frontend/backend
4. ✅ Test AI features
5. ✅ Run tests
6. ✅ Deploy to production

---

## 📞 Support

- **GitHub**: https://github.com/GEMDevEng/NovaCore
- **Cohere**: https://cohere.com
- **Documentation**: See `/docs` directory

---

## 🎓 Learn More

- [Backend Integration Guide](docs/BACKEND_INTEGRATION_GUIDE.md)
- [API Documentation](backend/API_DOCUMENTATION.md)
- [Backend README](backend/README.md)
- [Cohere Integration Guide](docs/COHERE_INTEGRATION_GUIDE.md)

---

**Happy coding! 🚀**


