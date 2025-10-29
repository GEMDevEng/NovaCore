# Cohere Integration Guide

## Quick Start

### 1. Get Cohere API Key
1. Visit https://cohere.com
2. Sign up for free account (no credit card required)
3. Navigate to API Keys section
4. Generate new API key
5. Copy the key

### 2. Configure Environment
Create or update `.env.local` in project root:
```bash
COHERE_API_KEY=your_actual_api_key_here
AI_PROVIDER=cohere
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Test Integration
Open the AI Query Card component and test with sample lead data.

---

## Architecture

### Provider Factory Pattern
```typescript
// services/providers/index.ts
import { getProvider } from './providers';

// Automatically selects provider based on AI_PROVIDER env var
const provider = getProvider();
const insights = await provider.getBusinessInsights(prompt);
```

### Adapter Implementation
```typescript
// services/providers/cohereAdapter.ts
export class CohereAdapter implements IAiProvider {
  async getBusinessInsights(prompt: string): Promise<AiInsight>
  getName(): string
  async healthCheck(): Promise<boolean>
}
```

### Service Layer
```typescript
// services/aiService.ts
export const getBusinessInsights = async (prompt: string): Promise<AiInsight>
export const getActiveProvider = (): string
export const checkProviderHealth = async (): Promise<boolean>
```

---

## Configuration Options

### Environment Variables
```bash
# Required
COHERE_API_KEY=your_key_here

# Optional
AI_PROVIDER=cohere          # Default: gemini
```

### Model Selection
Edit `services/providers/cohereAdapter.ts`:
```typescript
private model: string = 'command-r-plus';  // Change to 'command-r' if needed
```

---

## API Response Format

### Request
```typescript
{
  model: "command-r-plus",
  messages: [
    {
      role: "user",
      content: "Lead Information: ..."
    }
  ],
  system: "You are a business intelligence expert...",
  temperature: 0.7,
  maxTokens: 1024
}
```

### Response
```typescript
{
  rating: "High",           // High, Medium, or Low
  cashForecast: 50000,      // Estimated cash flow
  summary: "Enterprise..."  // Brief analysis
}
```

---

## Switching Providers

### Use Cohere
```bash
AI_PROVIDER=cohere
COHERE_API_KEY=your_key_here
```

### Use Gemini (Default)
```bash
AI_PROVIDER=gemini
GEMINI_API_KEY=your_key_here
```

### Programmatic Switching
```typescript
import { setProvider } from './services/providers';
import { CohereAdapter } from './services/providers/cohereAdapter';

// Switch to Cohere
setProvider(new CohereAdapter());

// Switch to Gemini
setProvider(new GeminiAdapter());
```

---

## Error Handling

### Common Errors

**"Cohere API key not configured"**
- Solution: Add `COHERE_API_KEY` to `.env.local`

**"No JSON found in Cohere response"**
- Solution: Check system prompt, verify model supports JSON

**"Invalid response structure from Cohere"**
- Solution: Verify response contains rating, cashForecast, summary

**"Failed to get insights from Cohere API"**
- Solution: Check API key validity, verify network connectivity

---

## Testing

### Health Check
```typescript
import { checkProviderHealth } from './services/aiService';

const isHealthy = await checkProviderHealth();
console.log(`Provider healthy: ${isHealthy}`);
```

### Get Active Provider
```typescript
import { getActiveProvider } from './services/aiService';

const provider = getActiveProvider();
console.log(`Active provider: ${provider}`);  // Output: "cohere"
```

### Test with Sample Lead
```typescript
import { getBusinessInsights } from './services/aiService';

const prompt = "Enterprise software company, $5M ARR, 50+ employees";
const insights = await getBusinessInsights(prompt);
console.log(insights);
// Output: { rating: "High", cashForecast: 250000, summary: "..." }
```

---

## Performance Tips

### Optimize Response Time
1. Use `command-r` instead of `command-r-plus` for faster responses
2. Reduce `maxTokens` if summary can be shorter
3. Adjust `temperature` for consistency (lower = faster)

### Reduce Costs
1. Use `command-r` model (cheaper than `command-r-plus`)
2. Reduce `maxTokens` to minimum needed
3. Batch requests when possible

### Improve Quality
1. Use `command-r-plus` for better accuracy
2. Increase `maxTokens` for detailed analysis
3. Refine system prompt for specific use cases

---

## Troubleshooting

### Provider Not Initializing
```bash
# Check environment variables
echo $COHERE_API_KEY
echo $AI_PROVIDER

# Verify .env.local exists
ls -la .env.local
```

### API Errors in Console
```typescript
// Enable detailed logging
console.log("Querying Cohere with prompt:", prompt);
// Check browser console for full error messages
```

### Response Format Issues
```typescript
// Verify response structure
const response = await getBusinessInsights(prompt);
console.log(response);
// Should have: rating, cashForecast, summary
```

---

## Cohere API Documentation

- **Official Docs**: https://docs.cohere.com/
- **SDK Reference**: https://github.com/cohere-ai/cohere-typescript
- **Models**: https://docs.cohere.com/docs/models
- **Pricing**: https://cohere.com/pricing

---

## Support

For issues or questions:
1. Check error messages in browser console
2. Review Cohere API documentation
3. Verify API key and environment variables
4. Check network connectivity
5. Review implementation in `services/providers/cohereAdapter.ts`


