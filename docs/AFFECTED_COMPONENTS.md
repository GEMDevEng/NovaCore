# Affected Components - Gemini to Groq Migration

## Summary
This document identifies all code files, configurations, and components that will be affected by the migration from Google Gemini to Groq API.

## Critical Components (Must Update)

### 1. services/geminiService.ts
**Severity**: CRITICAL  
**Current State**: Main AI service using Gemini API  
**Changes Required**:
- Replace `@google/genai` import with Groq SDK
- Update API call structure
- Modify response parsing logic
- Update error handling

**Current Code**:
```typescript
import { GoogleGenAI, Type } from "@google/genai";

export const getBusinessInsights = async (prompt: string): Promise<AiInsight> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Based on the following lead information...`,
    config: {
      responseMimeType: "application/json",
      responseSchema: { /* schema */ }
    }
  });
  const result = JSON.parse(response.text);
  return result as AiInsight;
};
```

**Proposed Changes**:
- Rename to `aiService.ts` (provider-agnostic)
- Create adapter pattern
- Support multiple providers

---

### 2. components/AiQueryCard.tsx
**Severity**: HIGH  
**Current State**: UI component using `getBusinessInsights()`  
**Changes Required**:
- Update import path if service is renamed
- Verify response format compatibility
- No UI changes needed if response format is preserved

**Current Usage**:
```typescript
import { getBusinessInsights } from '../services/geminiService';

const result = await getBusinessInsights(prompt);
setInsight(result);
```

**Impact**: LOW - No changes needed if service maintains same interface

---

## High Priority Components

### 3. package.json
**Severity**: HIGH  
**Current State**: Contains `@google/genai` dependency  
**Changes Required**:
- Remove `@google/genai` package
- Add `@groq/sdk` package
- Update version numbers

**Current Dependencies**:
```json
{
  "@google/genai": "^1.27.0"
}
```

**New Dependencies**:
```json
{
  "@groq/sdk": "^0.x.x"
}
```

---

### 4. vite.config.ts
**Severity**: HIGH  
**Current State**: Defines environment variables  
**Changes Required**:
- Update `GEMINI_API_KEY` to `GROQ_API_KEY`
- Maintain backward compatibility if needed

**Current Code**:
```typescript
define: {
  'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
  'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
}
```

**Proposed Changes**:
```typescript
define: {
  'process.env.API_KEY': JSON.stringify(env.GROQ_API_KEY),
  'process.env.GROQ_API_KEY': JSON.stringify(env.GROQ_API_KEY)
}
```

---

### 5. .env.local
**Severity**: HIGH  
**Current State**: Contains API key configuration  
**Changes Required**:
- Replace `GEMINI_API_KEY` with `GROQ_API_KEY`
- Update documentation

**Current**:
```
GEMINI_API_KEY=your_gemini_key_here
```

**New**:
```
GROQ_API_KEY=your_groq_key_here
```

---

## Medium Priority Components

### 6. README.md
**Severity**: MEDIUM  
**Current State**: Setup instructions reference Gemini  
**Changes Required**:
- Update setup instructions
- Update environment variable documentation
- Add Groq API key setup steps
- Update deployment instructions

**Sections to Update**:
- Prerequisites
- Installation steps
- Environment setup
- Deployment instructions

---

### 7. types.ts
**Severity**: LOW  
**Current State**: Contains `AiInsight` interface  
**Changes Required**:
- Verify interface matches Groq response format
- No changes needed if response format is preserved

**Current Interface**:
```typescript
export interface AiInsight {
  rating: string;
  cashForecast: number;
  summary: string;
}
```

**Status**: No changes needed ✅

---

## Low Priority Components

### 8. index.html
**Severity**: LOW  
**Current State**: Contains import map for `@google/genai`  
**Changes Required**:
- Update import map to use Groq SDK
- Update CDN references if applicable

**Current Code**:
```html
"@google/genai": "https://aistudiocdn.com/@google/genai@^1.27.0"
```

**New Code**:
```html
"@groq/sdk": "https://aistudiocdn.com/@groq/sdk@^0.x.x"
```

---

### 9. App.tsx
**Severity**: LOW  
**Current State**: Main app component  
**Changes Required**: None - no direct Gemini usage

---

### 10. Other Components
**Severity**: LOW  
**Components**: Header.tsx, Sidebar.tsx, StatCard.tsx, etc.  
**Changes Required**: None - no AI service usage

---

## Configuration Files

### .gitignore
**Status**: No changes needed ✅

### tsconfig.json
**Status**: No changes needed ✅

### metadata.json
**Status**: No changes needed ✅

---

## Testing Files (To Be Created)

### services/__tests__/aiService.test.ts
**Status**: NEW - Create comprehensive tests
- Test Groq adapter
- Test response parsing
- Test error handling
- Test performance

### components/__tests__/AiQueryCard.test.tsx
**Status**: UPDATE - Verify compatibility
- Test with new service
- Verify response handling
- Test error states

---

## Summary Table

| Component | File | Severity | Changes | Status |
|-----------|------|----------|---------|--------|
| AI Service | services/geminiService.ts | CRITICAL | Major | PENDING |
| UI Component | components/AiQueryCard.tsx | HIGH | Minor | PENDING |
| Dependencies | package.json | HIGH | Update | PENDING |
| Build Config | vite.config.ts | HIGH | Update | PENDING |
| Environment | .env.local | HIGH | Update | PENDING |
| Documentation | README.md | MEDIUM | Update | PENDING |
| Types | types.ts | LOW | None | ✅ |
| HTML | index.html | LOW | Update | PENDING |
| App | App.tsx | LOW | None | ✅ |
| Tests | __tests__/* | NEW | Create | PENDING |

---

## Migration Checklist

- [ ] Update services/geminiService.ts
- [ ] Verify components/AiQueryCard.tsx compatibility
- [ ] Update package.json dependencies
- [ ] Update vite.config.ts
- [ ] Update .env.local
- [ ] Update README.md
- [ ] Update index.html import map
- [ ] Create/update tests
- [ ] Test locally
- [ ] Deploy to staging
- [ ] Deploy to production

---

## Notes

- All changes maintain backward compatibility where possible
- Response format is preserved to minimize UI changes
- Error handling patterns are similar between providers
- Testing is critical for validation

