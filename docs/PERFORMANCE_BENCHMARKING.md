# Performance Benchmarking Guide - Phase 3

## Overview

This guide provides instructions for benchmarking the Cohere API integration and comparing it with the existing Gemini implementation.

## Benchmarking Metrics

### 1. Response Time (Latency)
**Measurement**: Time from API request to response received

**How to Measure**:
```typescript
const startTime = performance.now();
const result = await getBusinessInsights(prompt);
const endTime = performance.now();
const latency = endTime - startTime;
console.log(`Response time: ${latency}ms`);
```

**Expected Range**:
- Gemini: 500-2000ms
- Cohere: 500-2000ms

### 2. Token Usage
**Measurement**: Input and output tokens consumed

**Cohere Response Includes**:
- `meta.tokens.input_tokens`
- `meta.tokens.output_tokens`

**Calculation**:
```
Total tokens = input_tokens + output_tokens
Cost = (input_tokens * input_rate) + (output_tokens * output_rate)
```

### 3. Response Quality
**Measurement**: Accuracy and consistency of lead qualification

**Evaluation Criteria**:
- Rating accuracy (High/Medium/Low)
- Cash forecast reasonableness
- Summary relevance and clarity

### 4. Error Rate
**Measurement**: Percentage of failed requests

**Tracking**:
```typescript
let totalRequests = 0;
let failedRequests = 0;

try {
  const result = await getBusinessInsights(prompt);
  totalRequests++;
} catch (error) {
  failedRequests++;
  totalRequests++;
}

const errorRate = (failedRequests / totalRequests) * 100;
```

### 5. Cost Efficiency
**Measurement**: Cost per successful request

**Formula**:
```
Cost per request = Total API cost / Number of successful requests
```

---

## Test Data

### Sample Leads for Testing

**Lead 1 - High Quality**
```
"Enterprise software company, $5M ARR, 50+ employees, 
looking to implement CRM system, budget $200K, 
decision maker available, 30-day sales cycle"
```

**Lead 2 - Medium Quality**
```
"Small business owner, interested in marketing automation, 
budget $5K-10K, needs to discuss with team, 
60-day evaluation period"
```

**Lead 3 - Low Quality**
```
"Just browsing, no immediate need, small budget, 
multiple decision makers, long sales cycle"
```

**Lead 4 - Complex**
```
"Mid-market company, $2M revenue, expanding to new market, 
needs integration with existing systems, 
technical evaluation required, 90-day timeline"
```

**Lead 5 - Urgent**
```
"Enterprise prospect, immediate need, $500K budget, 
executive sponsor engaged, 2-week decision timeline"
```

---

## Benchmarking Procedure

### Step 1: Setup
```bash
# Ensure .env.local is configured
COHERE_API_KEY=your_key_here
AI_PROVIDER=cohere

# Start dev server
npm run dev
```

### Step 2: Create Test Script
```typescript
// benchmarkTest.ts
import { getBusinessInsights } from './services/aiService';

const testLeads = [
  // Insert sample leads here
];

async function runBenchmark() {
  const results = [];
  
  for (const lead of testLeads) {
    const startTime = performance.now();
    try {
      const insight = await getBusinessInsights(lead);
      const endTime = performance.now();
      
      results.push({
        lead: lead.substring(0, 50),
        latency: endTime - startTime,
        rating: insight.rating,
        cashForecast: insight.cashForecast,
        success: true,
      });
    } catch (error) {
      results.push({
        lead: lead.substring(0, 50),
        success: false,
        error: error.message,
      });
    }
  }
  
  return results;
}
```

### Step 3: Run Tests
```bash
# Run benchmark
npm run dev

# In browser console or test runner:
// Execute benchmark and collect results
```

### Step 4: Analyze Results
```typescript
function analyzeResults(results) {
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  const avgLatency = successful.reduce((sum, r) => sum + r.latency, 0) / successful.length;
  const minLatency = Math.min(...successful.map(r => r.latency));
  const maxLatency = Math.max(...successful.map(r => r.latency));
  
  return {
    totalTests: results.length,
    successful: successful.length,
    failed: failed.length,
    errorRate: (failed.length / results.length) * 100,
    avgLatency,
    minLatency,
    maxLatency,
  };
}
```

---

## Comparison: Gemini vs Cohere

### Response Time Comparison
| Provider | Min | Avg | Max | Std Dev |
|----------|-----|-----|-----|---------|
| Gemini | - | - | - | - |
| Cohere | - | - | - | - |

### Quality Comparison
| Aspect | Gemini | Cohere |
|--------|--------|--------|
| Rating Accuracy | - | - |
| Forecast Accuracy | - | - |
| Summary Quality | - | - |

### Cost Comparison
| Provider | Cost/Request | Tokens/Request | Cost/1000 Requests |
|----------|--------------|----------------|-------------------|
| Gemini | - | - | - |
| Cohere | - | - | - |

---

## Benchmarking Results Template

```markdown
# Benchmarking Results - [Date]

## Test Configuration
- Provider: Cohere
- Model: command-r-plus
- Test Leads: 5
- Test Duration: [time]

## Performance Metrics
- Total Requests: 5
- Successful: 5
- Failed: 0
- Error Rate: 0%

## Latency Analysis
- Average: XXXms
- Minimum: XXXms
- Maximum: XXXms
- Std Dev: XXXms

## Response Quality
- High Ratings: X
- Medium Ratings: X
- Low Ratings: X
- Average Cash Forecast: $X

## Comparison with Gemini
- Latency Difference: +/- XXms
- Quality Difference: [Better/Worse/Similar]
- Cost Difference: [Better/Worse/Similar]

## Recommendations
- [Recommendation 1]
- [Recommendation 2]
- [Recommendation 3]
```

---

## Troubleshooting

### Issue: API Key Not Found
**Solution**: Verify `.env.local` contains `COHERE_API_KEY`

### Issue: Slow Response Times
**Solution**: 
- Check network connectivity
- Verify API key is valid
- Check Cohere API status

### Issue: Invalid Response Format
**Solution**:
- Check system prompt in cohereAdapter.ts
- Verify model supports JSON responses
- Check API response in browser console

### Issue: High Error Rate
**Solution**:
- Verify API key has sufficient quota
- Check rate limiting
- Review error messages in console

---

## Next Steps

1. Run benchmarks with sample leads
2. Document results in this file
3. Compare with Gemini performance
4. Optimize based on findings
5. Consider provider-specific tuning


