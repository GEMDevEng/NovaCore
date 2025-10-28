# NovaCore Vercel Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying NovaCore to Vercel, a modern cloud platform optimized for frontend applications.

## Prerequisites

- GitHub account with NovaCore repository
- Vercel account (free tier available at https://vercel.com)
- Groq API key (from https://console.groq.com)

## Step 1: Prepare Your Repository

### 1.1 Ensure Repository is Ready

```bash
# Verify you're on the main branch
git branch

# Ensure all changes are committed
git status

# Push to GitHub
git push origin main
```

### 1.2 Verify Build Configuration

Ensure `vite.config.ts` is properly configured:

```typescript
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.GROQ_API_KEY': JSON.stringify(env.GROQ_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
```

### 1.3 Verify package.json Scripts

Ensure build and preview scripts are present:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## Step 2: Connect to Vercel

### 2.1 Create Vercel Project

1. Go to https://vercel.com
2. Click "New Project"
3. Select "Import Git Repository"
4. Search for your NovaCore repository
5. Click "Import"

### 2.2 Configure Project Settings

In the import dialog:

- **Project Name**: `novacore` (or your preferred name)
- **Framework Preset**: Select "Vite"
- **Root Directory**: Leave as `.` (root)
- **Build Command**: `npm run build` (should auto-detect)
- **Output Directory**: `dist` (should auto-detect)
- **Install Command**: `npm install` (should auto-detect)

### 2.3 Add Environment Variables

Before deploying, add environment variables:

1. In the import dialog, click "Environment Variables"
2. Add the following variables:

```
GROQ_API_KEY = your_production_groq_key_here
VITE_API_URL = https://your-domain.vercel.app
```

3. Click "Deploy"

## Step 3: Monitor Initial Deployment

### 3.1 Watch Deployment Progress

- Vercel will automatically build and deploy your project
- Monitor progress in the Vercel dashboard
- Check build logs for any errors

### 3.2 Verify Deployment

Once deployment completes:

1. Click the deployment URL
2. Verify the app loads correctly
3. Test the AI lead qualification feature
4. Check browser console for errors

## Step 4: Configure Custom Domain (Optional)

### 4.1 Add Custom Domain

1. Go to your Vercel project settings
2. Click "Domains"
3. Enter your custom domain (e.g., `novacore.com`)
4. Click "Add"

### 4.2 Configure DNS

Follow Vercel's DNS configuration instructions:

- For root domain: Add A record pointing to Vercel
- For subdomain: Add CNAME record pointing to Vercel

DNS changes may take 24-48 hours to propagate.

## Step 5: Setup Continuous Deployment

### 5.1 Automatic Deployments

Vercel automatically deploys when you push to your main branch:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically builds and deploys
```

### 5.2 Preview Deployments

For pull requests, Vercel creates preview deployments:

1. Create a feature branch
2. Make changes and push
3. Create a pull request on GitHub
4. Vercel automatically creates a preview deployment
5. Review changes before merging

## Step 6: Environment Variables Management

### 6.1 Update Environment Variables

To update environment variables after deployment:

1. Go to Vercel project settings
2. Click "Environment Variables"
3. Edit or add variables
4. Redeploy for changes to take effect

### 6.2 Environment Variable Best Practices

- Never commit `.env.local` to Git
- Use `.env.example` for documentation
- Rotate API keys regularly
- Use different keys for staging/production

## Step 7: Monitoring and Logs

### 7.1 View Deployment Logs

1. Go to Vercel project dashboard
2. Click "Deployments"
3. Select a deployment
4. Click "Logs" to view build and runtime logs

### 7.2 Monitor Performance

1. Go to "Analytics" tab
2. Monitor:
   - Page load times
   - Core Web Vitals
   - Error rates
   - API response times

### 7.3 Setup Alerts

1. Go to project settings
2. Click "Alerts"
3. Configure alerts for:
   - Build failures
   - High error rates
   - Performance degradation

## Step 8: Troubleshooting

### Issue: Build Fails

**Solution**:
1. Check build logs in Vercel dashboard
2. Verify `vite.config.ts` is correct
3. Ensure all dependencies are in `package.json`
4. Test build locally: `npm run build`

### Issue: Environment Variables Not Working

**Solution**:
1. Verify variables are set in Vercel dashboard
2. Check variable names match code
3. Redeploy after updating variables
4. Check browser console for errors

### Issue: API Calls Fail

**Solution**:
1. Verify `GROQ_API_KEY` is set correctly
2. Check Groq API quota
3. Verify API endpoint is correct
4. Check CORS settings if calling external APIs

### Issue: Performance Issues

**Solution**:
1. Check Vercel Analytics
2. Optimize bundle size: `npm run build -- --analyze`
3. Enable caching headers
4. Consider upgrading Vercel plan

## Step 9: Rollback Procedure

### 9.1 Rollback to Previous Deployment

1. Go to Vercel project dashboard
2. Click "Deployments"
3. Find the previous stable deployment
4. Click the three dots menu
5. Select "Promote to Production"

### 9.2 Rollback via Git

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Vercel automatically deploys the reverted version
```

## Step 10: Maintenance

### 10.1 Regular Updates

- Update dependencies: `npm update`
- Test locally: `npm run dev`
- Deploy to staging first
- Monitor production after deployment

### 10.2 Security

- Rotate API keys regularly
- Monitor for security vulnerabilities
- Keep dependencies updated
- Review access logs

### 10.3 Performance Optimization

- Monitor Core Web Vitals
- Optimize images and assets
- Enable compression
- Use CDN caching

## Vercel Pricing

### Free Tier
- Unlimited deployments
- Automatic HTTPS
- Global CDN
- Serverless functions (limited)
- Analytics

### Pro Tier ($20/month)
- Priority support
- Advanced analytics
- More serverless function execution
- Team collaboration

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)
- [Groq API Documentation](https://console.groq.com/docs)
- [NovaCore README](../README.md)

## Support

For deployment issues:
1. Check Vercel documentation
2. Review build logs
3. Test locally with `npm run build && npm run preview`
4. Open an issue on GitHub

## Checklist

- [ ] Repository pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables configured
- [ ] Initial deployment successful
- [ ] App loads and functions correctly
- [ ] Custom domain configured (optional)
- [ ] Monitoring and alerts setup
- [ ] Team members have access
- [ ] Documentation updated
- [ ] Rollback plan documented

