# NovaCore Project Directory Structure

## Overview
This document describes the complete project organization for NovaCore, an AI-powered business optimization platform. The structure is designed to support scalability, maintainability, and the planned migration from Google Gemini to Groq API.

## Root Level Files

```
/Users/user/NovaCore/
├── README.md                    # Project overview and setup instructions
├── DIRECTORY_STRUCTURE.md       # This file - project organization guide
├── package.json                 # Node.js dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite build configuration
├── index.html                   # HTML entry point
├── index.tsx                    # React app entry point
├── App.tsx                      # Main app component
├── context.tsx                  # React context for theming
├── types.ts                     # Global TypeScript type definitions
├── metadata.json                # App metadata
└── .gitignore                   # Git ignore rules
```

## Directory Structure

### `/components` - React Components
Contains all React UI components organized by feature.

```
components/
├── AiQueryCard.tsx              # AI-powered lead qualification UI
├── Header.tsx                   # Top navigation bar
├── Sidebar.tsx                  # Left sidebar navigation
├── StatCard.tsx                 # Statistics display card
├── RevenueChart.tsx             # Revenue visualization
├── RecentActivity.tsx           # Recent activity feed
└── icons.tsx                    # Icon components library
```

**Purpose**: Reusable UI components for the dashboard and features.

---

### `/services` - Business Logic & API Integration
Contains service layers for API calls and business logic.

```
services/
├── geminiService.ts             # [DEPRECATED] Google Gemini API service
├── aiService.ts                 # [NEW] Provider-agnostic AI service
├── providers/
│   ├── index.ts                 # Provider factory and configuration
│   ├── geminiAdapter.ts         # Gemini API adapter (legacy)
│   ├── groqAdapter.ts           # Groq API adapter (new)
│   └── __tests__/
│       ├── geminiAdapter.test.ts
│       └── groqAdapter.test.ts
└── __tests__/
    └── aiService.test.ts        # AI service tests
```

**Purpose**: Encapsulates API calls and business logic, supporting multiple AI providers.

---

### `/docs` - Documentation
Contains comprehensive project documentation.

```
docs/
├── MIGRATION_PLAN.md            # Gemini to Groq migration strategy
├── IMPLEMENTATION_ROADMAP.md    # Detailed implementation phases
├── API_COMPARISON.md            # Gemini vs Groq API comparison
├── AFFECTED_COMPONENTS.md       # Components affected by migration
├── ARCHITECTURE.md              # System architecture overview
├── DEPLOYMENT.md                # Deployment instructions
├── VERCEL_SETUP.md              # Vercel deployment guide
└── API_REFERENCE.md             # API endpoint documentation
```

**Purpose**: Centralized documentation for development, deployment, and migration.

---

### `/public` - Static Assets
Contains static files served by the web server.

```
public/
├── favicon.ico                  # Browser tab icon
├── logo.png                     # Application logo
└── images/
    └── [other static assets]
```

**Purpose**: Static assets that don't require processing.

---

### `/tests` - Test Files
Contains test suites for components and services.

```
tests/
├── unit/
│   ├── services/
│   │   └── aiService.test.ts
│   └── components/
│       └── AiQueryCard.test.tsx
├── integration/
│   └── aiFlow.test.ts
├── e2e/
│   └── leadQualification.test.ts
└── fixtures/
    └── mockData.ts
```

**Purpose**: Organized test structure for unit, integration, and E2E tests.

---

### `/config` - Configuration Files
Contains environment and build configurations.

```
config/
├── .env.example                 # Example environment variables
├── .env.local                   # Local environment (git ignored)
├── .env.production              # Production environment
└── providers.config.ts          # AI provider configuration
```

**Purpose**: Centralized configuration management.

---

## File Organization Principles

### 1. Feature-Based Organization
- Components are grouped by feature (e.g., AI, CRM, ERP)
- Services are organized by domain (e.g., providers, auth)
- Tests mirror the source structure

### 2. Separation of Concerns
- **Components**: UI and presentation logic only
- **Services**: Business logic and API integration
- **Types**: Shared type definitions
- **Docs**: Documentation and guides

### 3. Scalability
- Structure supports adding new features without disruption
- Provider abstraction allows easy addition of new AI providers
- Test organization supports comprehensive coverage

### 4. Maintainability
- Clear naming conventions
- Logical grouping of related files
- Documentation co-located with code

---

## Key Directories for Migration

### Services Directory
The `/services` directory is critical for the Gemini to Groq migration:

1. **Provider Abstraction**: `providers/` subdirectory contains adapters
2. **Factory Pattern**: `providers/index.ts` manages provider selection
3. **Testing**: `__tests__/` subdirectories for comprehensive testing
4. **Backward Compatibility**: Old Gemini adapter can be retained as fallback

### Documentation Directory
The `/docs` directory contains all migration-related documentation:

1. **Migration Plan**: Overall strategy and timeline
2. **Implementation Roadmap**: Detailed task breakdown
3. **API Comparison**: Technical comparison of providers
4. **Affected Components**: List of files requiring changes

---

## Vercel Deployment Structure

For Vercel deployment, the structure supports:

```
Root
├── package.json                 # Vercel detects Node.js project
├── vite.config.ts               # Build configuration
├── index.html                   # Entry point
├── src/                         # Source code (optional)
└── public/                      # Static assets
```

**Deployment**: Vercel automatically builds with `npm run build` and serves from `dist/`.

---

## Environment Variables

### Local Development (.env.local)
```
GROQ_API_KEY=your_groq_key_here
VITE_API_URL=http://localhost:3000
```

### Production (.env.production)
```
GROQ_API_KEY=your_production_groq_key
VITE_API_URL=https://novacore.vercel.app
```

---

## Build Output

After running `npm run build`, the structure becomes:

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [other assets]
└── favicon.ico
```

---

## Future Expansion

As NovaCore grows, consider adding:

```
├── /hooks                       # Custom React hooks
├── /utils                       # Utility functions
├── /constants                   # Application constants
├── /middleware                  # Express middleware
├── /models                      # Data models
├── /validators                  # Input validation
└── /scripts                     # Build and utility scripts
```

---

## Summary

| Directory | Purpose | Key Files |
|-----------|---------|-----------|
| `/components` | React UI components | AiQueryCard.tsx, Header.tsx |
| `/services` | Business logic & APIs | aiService.ts, providers/ |
| `/docs` | Documentation | MIGRATION_PLAN.md, API_COMPARISON.md |
| `/public` | Static assets | favicon.ico, images/ |
| `/tests` | Test suites | unit/, integration/, e2e/ |
| `/config` | Configuration | .env files, providers.config.ts |

This structure supports the current MVP and scales for future features while maintaining clean separation of concerns.

