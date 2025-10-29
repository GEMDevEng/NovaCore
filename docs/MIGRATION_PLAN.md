# NovaCore AI Provider Migration Plan

## Executive Summary

This document outlines the migration strategy from Google Gemini API to an alternative AI provider. The migration is designed to reduce vendor lock-in, improve cost efficiency, and align with the NovaCore architecture's vision of leveraging "Grok-like" intelligence for business optimization.

## Current State Analysis

### Existing Gemini Integration
- **Current Provider**: Google Gemini API (`@google/genai` v1.27.0)
- **Primary Usage**: Lead qualification and business insights generation
- **Integration Point**: `services/geminiService.ts`
- **API Key**: `GEMINI_API_KEY` environment variable
- **Model Used**: `gemini-2.5-flash`
- **Response Format**: JSON with structured schema (rating, cashForecast, summary)

### Current Dependencies
- `@google/genai` package in `package.json`
- Vite config defines `process.env.GEMINI_API_KEY`
- `AiQueryCard.tsx` component depends on `getBusinessInsights()` function
- Type definitions in `types.ts` define `AiInsight` interface

## Migration Target: Cohere API (Command R/Command A)

### Rationale
- **True Free Tier**: Unlimited API calls with no rate limits on trial tier
- **No Credit Card Required**: Completely free to start
- **High-Quality Models**: Command R and Command A excel at business intelligence tasks
- **Cost-Effective**: Competitive pricing if scaling beyond free tier
- **Flexibility**: Easy to switch to other providers (OpenAI, Anthropic) if needed

### Target Provider Details
- **Provider**: Cohere (https://cohere.com)
- **Model**: Command R or Command A (latest)
- **Package**: REST API with TypeScript SDK support
- **Authentication**: API key via `COHERE_API_KEY` environment variable

## Migration Scope

### Phase 1: Planning & Documentation (Current)
- [ ] Analyze current Gemini integration
- [ ] Document all affected components
- [ ] Create migration strategy
- [ ] Identify potential blockers

### Phase 2: API Abstraction Layer
- [ ] Create provider-agnostic AI service interface
- [ ] Implement adapter pattern for multiple providers
- [ ] Add configuration for provider selection

### Phase 3: Cohere Integration
- [ ] Install Cohere SDK
- [ ] Implement Cohere service adapter
- [ ] Update environment configuration
- [ ] Test with sample data

### Phase 4: Testing & Validation
- [ ] Unit tests for new service
- [ ] Integration tests with frontend
- [ ] Performance benchmarking
- [ ] Accuracy validation (>90% target)

### Phase 5: Deployment & Cleanup
- [ ] Remove Gemini dependencies
- [ ] Update documentation
- [ ] Deploy to production
- [ ] Monitor and optimize

## Affected Components

### Code Files
1. **services/geminiService.ts** - Main AI service (CRITICAL)
2. **components/AiQueryCard.tsx** - UI component using AI service (HIGH)
3. **package.json** - Dependencies (HIGH)
4. **vite.config.ts** - Environment variable configuration (MEDIUM)
5. **types.ts** - Type definitions (LOW - may need updates)
6. **.env.local** - Environment configuration (HIGH)
7. **README.md** - Setup instructions (MEDIUM)

### Configuration Files
- `.env.local` - API key configuration
- `vite.config.ts` - Build-time environment setup
- `package.json` - Dependencies and scripts

## API Changes Required

### Current Gemini API Call
```typescript
const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: `Based on the following lead information...`,
  config: {
    responseMimeType: "application/json",
    responseSchema: { /* schema */ }
  }
});
```

### New Cohere API Call (Proposed)
```typescript
const response = await cohere.chat.create({
  model: "command-r-plus",
  messages: [{ role: "user", content: prompt }],
  temperature: 0.7,
  max_tokens: 1024
});
```

## Implementation Phases

### Phase 1: Setup (Days 1-2)
- Create `/docs/MIGRATION_PLAN.md` (this file)
- Create `/docs/IMPLEMENTATION_ROADMAP.md`
- Create `/docs/API_COMPARISON.md`
- Document all Gemini usage patterns

### Phase 2: Abstraction (Days 3-4)
- Create provider-agnostic interface
- Implement adapter pattern
- Add provider configuration

### Phase 3: Integration (Days 5-7)
- Implement Cohere adapter
- Update components
- Test locally

### Phase 4: Validation (Days 8-9)
- Run comprehensive tests
- Performance benchmarking
- Accuracy validation

### Phase 5: Deployment (Days 10-11)
- Deploy to staging
- Final validation
- Deploy to production

## Risk Assessment

### High Risk
- **Breaking Changes**: API response format differences
- **Mitigation**: Comprehensive testing and gradual rollout

### Medium Risk
- **Performance Variance**: Different model performance
- **Mitigation**: Benchmarking and model selection

### Low Risk
- **Dependency Updates**: Package management
- **Mitigation**: Standard npm update procedures

## Success Criteria

- [ ] All tests passing (>90% coverage)
- [ ] API response time < 500ms
- [ ] AI accuracy > 90%
- [ ] Zero breaking changes to frontend
- [ ] Documentation updated
- [ ] Deployment successful

## Next Steps

1. Review this migration plan
2. Proceed to Phase 2: API Abstraction Layer
3. Create detailed implementation roadmap
4. Begin code modifications (with approval)

