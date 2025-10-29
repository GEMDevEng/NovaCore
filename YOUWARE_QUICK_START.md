# YouWare Quick Start Guide for NovaCore

## 5-Minute Setup

### 1. Install YouWare Extension
- Open VS Code/Cursor
- Search for "YouWare" in Extensions
- Click Install and Sign In

### 2. Prepare Project
```bash
cd NovaCore
npm install
cd backend && npm install && cd ..
npm run build
```

### 3. Configure Environment
Create `.env.local`:
```
VITE_API_URL=https://your-backend.youware.app
COHERE_API_KEY=your_key_here
```

Create `backend/.env.local`:
```
PORT=3001
NODE_ENV=production
COHERE_API_KEY=your_key_here
FRONTEND_URL=https://your-frontend.youware.app
```

### 4. Deploy
1. Open YouWare extension in VS Code
2. Click "Deploy Frontend"
3. Copy the frontend URL
4. Update backend environment with frontend URL
5. Click "Deploy Backend"
6. Copy the backend URL
7. Update frontend environment with backend URL
8. Redeploy frontend

### 5. Share
- Get your shareable URL from YouWare extension
- Share with others
- Publish to community (optional)

## Key Files

| File | Purpose |
|------|---------|
| `youware.json` | Project manifest and configuration |
| `docs/YOUWARE_SETUP.md` | Detailed setup instructions |
| `docs/YOUWARE_DEPLOYMENT.md` | Step-by-step deployment guide |
| `docs/YOUWARE_FORK_INSTRUCTIONS.md` | How to create separate fork |

## Project Structure

```
NovaCore/
├── youware.json                    # ← YouWare manifest
├── package.json                    # Frontend config
├── vite.config.ts                  # Frontend build
├── index.html                      # Frontend entry
├── src/                            # Frontend code
├── backend/
│   ├── package.json                # Backend config
│   ├── src/                        # Backend code
│   ├── api/index.js                # Serverless handler
│   └── vercel.json                 # Backend config
└── docs/
    ├── YOUWARE_SETUP.md            # ← Setup guide
    ├── YOUWARE_DEPLOYMENT.md       # ← Deployment guide
    └── YOUWARE_FORK_INSTRUCTIONS.md # ← Fork guide
```

## What's Included

✅ **Frontend (React + Vite)**
- Dashboard with 5 sections
- Authentication (Google OAuth + Email/Password)
- Dark mode support
- Responsive design
- AI-powered insights

✅ **Backend (Express.js)**
- REST API with Cohere AI integration
- Authentication endpoints
- Payment processing (PayPal, Stripe, Razorpay)
- Health checks
- CORS configured

✅ **Features**
- Dashboard with analytics
- Reports and calendar
- Contact management
- AI business insights
- Payment integration
- User authentication

## Environment Variables Needed

### Frontend
- `VITE_API_URL` - Backend API URL
- `COHERE_API_KEY` - Cohere API key

### Backend
- `COHERE_API_KEY` - Cohere API key
- `FRONTEND_URL` - Frontend URL for CORS
- `GOOGLE_CLIENT_ID` - Google OAuth ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth secret
- `PAYPAL_CLIENT_ID` - PayPal client ID
- `STRIPE_SECRET_KEY` - Stripe secret key
- `RAZORPAY_KEY_ID` - Razorpay key ID
- `RAZORPAY_KEY_SECRET` - Razorpay secret

## Getting API Keys

### Cohere API
1. Visit https://cohere.com
2. Sign up (free tier available)
3. Create API key
4. Copy to environment variables

### Google OAuth
1. Go to https://console.cloud.google.com
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Copy Client ID and Secret

### Payment Providers
- **PayPal**: https://developer.paypal.com
- **Stripe**: https://stripe.com/docs
- **Razorpay**: https://razorpay.com/docs

## Deployment Checklist

- [ ] YouWare account created
- [ ] YouWare extension installed
- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] Project builds successfully
- [ ] youware.json present
- [ ] Frontend deployed
- [ ] Backend deployed
- [ ] URLs updated
- [ ] Integration tested
- [ ] Shared with community (optional)

## Troubleshooting

**Build fails?**
```bash
rm -rf node_modules dist
npm install
npm run build
```

**Backend not responding?**
- Check backend URL in frontend environment
- Verify backend deployment completed
- Check browser console for CORS errors

**Authentication not working?**
- Verify Google OAuth credentials
- Check FRONTEND_URL in backend
- Clear browser cookies

**API calls failing?**
- Check VITE_API_URL matches backend URL
- Verify backend is running
- Check network tab in browser DevTools

## Next Steps

1. **Setup**: Follow [YOUWARE_SETUP.md](docs/YOUWARE_SETUP.md)
2. **Deploy**: Follow [YOUWARE_DEPLOYMENT.md](docs/YOUWARE_DEPLOYMENT.md)
3. **Fork**: Follow [YOUWARE_FORK_INSTRUCTIONS.md](docs/YOUWARE_FORK_INSTRUCTIONS.md)
4. **Share**: Get your URL and share with others
5. **Monetize**: Join Creator Incentive Program

## Resources

- **YouWare**: https://www.youware.com
- **YouWare Docs**: https://i.youware.com
- **YouWare Community**: https://discord.gg/6fBAZ2tzfK
- **NovaCore Repo**: https://github.com/GEMDevEng/NovaCore
- **API Docs**: [backend/API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md)

## Support

- 📧 Email: support@youware.com
- 💬 Discord: https://discord.gg/6fBAZ2tzfK
- 🐛 Issues: https://github.com/GEMDevEng/NovaCore/issues
- 📚 Docs: https://www.youware.com

---

**Ready to deploy?** Start with the [Setup Guide](docs/YOUWARE_SETUP.md)!

