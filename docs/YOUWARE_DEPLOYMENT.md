# YouWare Deployment Guide for NovaCore

## Overview

This guide provides step-by-step instructions for publishing NovaCore to YouWare using the VS Code extension.

## Pre-Deployment Checklist

- [ ] YouWare account created and verified
- [ ] YouWare extension installed in VS Code/Cursor
- [ ] All dependencies installed (`npm install` in root and `backend/`)
- [ ] Environment variables configured (`.env.local` files)
- [ ] Project builds successfully (`npm run build`)
- [ ] Backend builds successfully (`cd backend && npm install`)
- [ ] All tests passing (if applicable)
- [ ] Code committed to git
- [ ] youware.json manifest present in root directory

## Deployment Steps

### Step 1: Open Project in VS Code/Cursor

```bash
cd /path/to/NovaCore
code .  # or cursor .
```

### Step 2: Access YouWare Extension

1. Look for the YouWare icon in the VS Code sidebar (or use Command Palette)
2. Click on the YouWare extension
3. Ensure you're logged in to your YouWare account
4. You should see your project listed

### Step 3: Configure Deployment Settings

In the YouWare extension panel:

1. **Project Name**: NovaCore
2. **Project Type**: Full-Stack (Monorepo)
3. **Frontend Path**: `./` (root directory)
4. **Backend Path**: `./backend`
5. **Privacy**: Choose between:
   - Public (shareable with anyone)
   - Private (only you can access)
   - Password-protected (share with password)

### Step 4: Set Environment Variables

In the YouWare extension:

1. Click "Environment Variables"
2. Add Frontend Variables:
   ```
   VITE_API_URL=https://[backend-url].youware.app
   COHERE_API_KEY=[your-cohere-key]
   ```
3. Add Backend Variables:
   ```
   PORT=3001
   NODE_ENV=production
   COHERE_API_KEY=[your-cohere-key]
   FRONTEND_URL=https://[frontend-url].youware.app
   GOOGLE_CLIENT_ID=[your-google-id]
   GOOGLE_CLIENT_SECRET=[your-google-secret]
   PAYPAL_CLIENT_ID=[your-paypal-id]
   STRIPE_SECRET_KEY=[your-stripe-key]
   RAZORPAY_KEY_ID=[your-razorpay-id]
   RAZORPAY_KEY_SECRET=[your-razorpay-secret]
   ```

### Step 5: Deploy Frontend

1. In YouWare extension, click "Deploy Frontend"
2. Wait for build to complete
3. You'll receive a shareable URL (e.g., `https://novacore-abc123.youware.app`)
4. Copy this URL for backend configuration

### Step 6: Deploy Backend

1. Update backend environment variables with frontend URL
2. In YouWare extension, click "Deploy Backend"
3. Wait for build to complete
4. You'll receive a backend URL (e.g., `https://novacore-backend-abc123.youware.app`)
5. Copy this URL for frontend configuration

### Step 7: Update Frontend with Backend URL

1. Redeploy frontend with updated `VITE_API_URL` pointing to backend
2. In YouWare extension, click "Redeploy Frontend"
3. Wait for build to complete

### Step 8: Verify Deployment

1. Visit your frontend URL
2. Test authentication (Google OAuth or email/password)
3. Test AI features (business insights)
4. Test payment integration (if applicable)
5. Check browser console for errors

## Deployment Verification

### Frontend Checks

- [ ] Dashboard loads without errors
- [ ] Navigation works (Dashboard, Analytics, Reports, Calendar, Contacts)
- [ ] Dark mode toggle works
- [ ] Responsive design works on mobile
- [ ] Authentication flow works

### Backend Checks

- [ ] Health endpoint responds: `GET /api/v1/health`
- [ ] AI provider initialized: `GET /api/v1/ai/provider`
- [ ] AI query works: `POST /api/v1/ai/query`
- [ ] CORS headers present in responses

### Integration Checks

- [ ] Frontend can reach backend API
- [ ] Authentication tokens work
- [ ] AI features return results
- [ ] Error handling works properly

## Troubleshooting

### Build Failures

**Frontend build fails:**
```bash
# Clear cache and rebuild
rm -rf dist node_modules
npm install
npm run build
```

**Backend build fails:**
```bash
cd backend
rm -rf node_modules
npm install
```

### Deployment Errors

**"Cannot find youware.json"**
- Ensure youware.json exists in project root
- Check file is valid JSON

**"Environment variables missing"**
- Add all required variables in YouWare extension
- Verify variable names match exactly

**"Backend URL not accessible"**
- Check backend deployment completed successfully
- Verify CORS configuration in backend
- Check environment variables in backend

### Runtime Issues

**"API calls failing"**
- Check VITE_API_URL in frontend matches backend URL
- Verify backend is running
- Check browser console for CORS errors

**"Authentication not working"**
- Verify Google OAuth credentials are correct
- Check FRONTEND_URL in backend matches frontend URL
- Clear browser cookies and try again

## Publishing to YouWare Community

After successful deployment:

1. In YouWare extension, click "Publish to Community"
2. Add project description and tags
3. Upload project thumbnail/screenshot
4. Submit for community review
5. Share your project URL with others

## Monetization (Creator Incentive Program)

To earn from your project:

1. Publish to YouWare community
2. Users spend credits to use your app
3. Earn a percentage of credits spent
4. Track earnings in YouWare dashboard

## Updating Your Project

To update NovaCore on YouWare:

1. Make changes locally
2. Test thoroughly
3. Commit changes to git
4. In YouWare extension, click "Redeploy"
5. Select which components to redeploy (frontend/backend)
6. Wait for deployment to complete

## Support

- **YouWare Documentation**: https://www.youware.com
- **YouWare Community**: https://discord.gg/6fBAZ2tzfK
- **NovaCore Repository**: https://github.com/GEMDevEng/NovaCore
- **Report Issues**: https://github.com/GEMDevEng/NovaCore/issues

