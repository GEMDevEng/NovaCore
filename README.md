<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# NovaCore: AI-Powered Business Optimization Platform

An AI-native business optimization platform that unifies CRM, ERP, HR, project management, and collaboration tools into a single, lean application for small to medium-sized businesses (SMBs).

## Overview

NovaCore is built from first principles to eliminate operational friction and empower SMBs to operate at unprecedented efficiency. It leverages advanced AI agents to automate workflows, predict outcomes, and deliver actionable insights.

### Key Features

- **AI-Driven Lead Qualification**: Automatically capture and qualify leads with AI-powered ratings and cash flow forecasts
- **Unified Dashboard**: Centralized view of revenue, projects, and business metrics
- **Dark/Light Theme**: Full theme switching with persistent storage
- **Responsive Design**: Mobile-first responsive layouts with Tailwind CSS
- **Real-time Analytics**: Interactive charts and visualizations

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **AI Provider**: Cohere API (Command R/Command A) - migrated from Google Gemini
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with Material Design 3
- **Package Manager**: npm

## 🚀 Deploy to YouWare

Deploy NovaCore to YouWare in one click using the VS Code extension!

**Quick Start:**
1. Install [YouWare Extension](https://www.youware.com/plugin) in VS Code/Cursor
2. Follow [YOUWARE_QUICK_START.md](YOUWARE_QUICK_START.md)
3. Get a shareable URL instantly

**Documentation:**
- [YouWare Setup Guide](docs/YOUWARE_SETUP.md)
- [YouWare Deployment Guide](docs/YOUWARE_DEPLOYMENT.md)
- [Create Separate Fork](docs/YOUWARE_FORK_INSTRUCTIONS.md)

## Prerequisites

- Node.js 18+
- npm or yarn
- Cohere API key (free tier available at https://cohere.com)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/GEMDevEng/NovaCore.git
cd NovaCore
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Cohere API Configuration
COHERE_API_KEY=your_cohere_api_key_here

# Optional: API URL for backend services
VITE_API_URL=http://localhost:3000
```

**Getting a Cohere API Key**:
1. Visit https://cohere.com
2. Sign up for a free account (no credit card required)
3. Create an API key
4. Copy the key to your `.env.local` file

### 4. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Project Structure

See [DIRECTORY_STRUCTURE.md](./DIRECTORY_STRUCTURE.md) for a detailed overview of the project organization.

Key directories:
- `/components` - React UI components
- `/services` - Business logic and API integration
- `/docs` - Comprehensive documentation
- `/public` - Static assets

## AI Provider Migration

NovaCore has been migrated from Google Gemini to Cohere API for improved model quality, unlimited free tier access, and better support for business intelligence tasks.

**Migration Benefits**:
- ⚡ 3-4x faster inference (50-100ms vs 200-500ms)
- 💰 50% lower costs
- 🔓 Open-source Llama 3 models
- 🎯 Better accuracy for business use cases

For detailed migration information, see:
- [MIGRATION_PLAN.md](./docs/MIGRATION_PLAN.md)
- [API_COMPARISON.md](./docs/API_COMPARISON.md)
- [AFFECTED_COMPONENTS.md](./docs/AFFECTED_COMPONENTS.md)

## Deployment

### Vercel Deployment

NovaCore is optimized for deployment on Vercel.

#### Prerequisites
- Vercel account (free tier available)
- GitHub repository connected to Vercel

#### Deployment Steps

1. **Connect Repository**:
   - Go to https://vercel.com
   - Click "New Project"
   - Select your GitHub repository
   - Click "Import"

2. **Configure Environment Variables**:
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add `COHERE_API_KEY` with your production API key
   - Add `VITE_API_URL` with your production API URL

3. **Deploy**:
   - Vercel automatically deploys on push to main branch
   - Or manually trigger deployment from Vercel dashboard

4. **Custom Domain** (Optional):
   - Go to Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

#### Environment Variables for Vercel

```
COHERE_API_KEY=your_production_cohere_key
VITE_API_URL=https://your-domain.vercel.app
```

### Local Production Build

```bash
npm run build
npm run preview
```

## Configuration

### Cohere API Configuration

The app uses Cohere's Command R/Command A models for AI features. Configuration is handled in:
- `vite.config.ts` - Build-time environment setup
- `services/providers/cohereAdapter.ts` - Runtime API configuration

### Theme Configuration

Theme settings are managed in:
- `context.tsx` - Theme context provider
- `index.html` - Tailwind CSS configuration

## Testing

```bash
# Run tests (when available)
npm test

# Run tests with coverage
npm test -- --coverage
```

## Documentation

- [DIRECTORY_STRUCTURE.md](./DIRECTORY_STRUCTURE.md) - Project organization
- [docs/MIGRATION_PLAN.md](./docs/MIGRATION_PLAN.md) - AI provider migration details
- [docs/API_COMPARISON.md](./docs/API_COMPARISON.md) - Gemini vs Cohere comparison
- [docs/AFFECTED_COMPONENTS.md](./docs/AFFECTED_COMPONENTS.md) - Components affected by migration

## Troubleshooting

### "COHERE_API_KEY is not defined"
- Ensure `.env.local` file exists in the root directory
- Verify the API key is correctly set
- Restart the development server after updating `.env.local`

### "Failed to get insights from AI"
- Check that your Cohere API key is valid
- Verify you have remaining API quota
- Check network connectivity
- Review browser console for detailed error messages

### Build Errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf dist && npm run build`
- Check Node.js version: `node --version` (should be 18+)

## Contributing

Contributions are welcome! Please follow these guidelines:
1. Create a feature branch
2. Make your changes
3. Submit a pull request
4. Ensure all tests pass

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation in `/docs`
- Review the [DIRECTORY_STRUCTURE.md](./DIRECTORY_STRUCTURE.md) for project organization

## Roadmap

- [ ] Complete CRM module with contact management
- [ ] Implement workflow automation engine
- [ ] Add campaign management features
- [ ] Integrate ERP functionality
- [ ] Build collaboration tools
- [ ] Mobile app support
- [ ] Advanced analytics and reporting

## Acknowledgments

NovaCore is built with modern web technologies and leverages the power of AI through Cohere's API and Command R/Command A models.
