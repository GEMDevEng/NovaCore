# NovaCore Frontend - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Backend running at: `https://backend-q4s5npax9-gem-devs-projects.vercel.app`

### Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start development server
npm run dev
```

## 📱 Navigation Sections

### 1. Dashboard (`/`)
**Overview of key metrics and recent activity**
- Stat cards showing important KPIs
- Revenue chart visualization
- AI query card for insights
- Recent activity feed

### 2. Analytics (`/analytics`)
**Business metrics and performance trends**
- 5 key metrics: Conversion Rate, Total Leads, Converted Leads, Avg Deal Size, Revenue Growth
- Conversion Rate Trend (Line Chart)
- Revenue Trend (Bar Chart)
- Lead Source Distribution (Pie Chart)
- Real-time data from backend API

### 3. Reports (`/reports`)
**Business reports with filtering and export**
- Reports table with all details
- Filter by date range (start/end date)
- Filter by lead source
- CSV export functionality
- Pagination support

### 4. Calendar (`/calendar`)
**Event management and scheduling**
- Interactive calendar grid
- Month navigation (previous/next)
- Add new events with form
- Delete events
- Upcoming events list
- Event type color coding

### 5. Contacts (`/contacts`)
**Lead and contact management**
- Contacts table with all information
- Search by name, email, or company
- Filter by lead source
- Add new contacts
- Delete contacts
- Contact count display

## 🔌 API Integration

All sections connect to the backend API at:
```
https://backend-q4s5npax9-gem-devs-projects.vercel.app/api/v1
```

### Available Endpoints

**Analytics**
- `GET /analytics/summary` - Summary metrics
- `GET /analytics/conversion-trend` - Conversion trends
- `GET /analytics/revenue-trend` - Revenue trends
- `GET /analytics/lead-sources` - Lead source distribution

**Reports**
- `GET /reports` - List reports (with filtering)
- `POST /reports` - Create report
- `DELETE /reports/:id` - Delete report

**Calendar**
- `GET /calendar/events` - List events
- `POST /calendar/events` - Create event
- `DELETE /calendar/events/:id` - Delete event

**Contacts (Leads)**
- `GET /leads` - List contacts
- `POST /leads` - Create contact
- `DELETE /leads/:id` - Delete contact

## 🎨 Styling

The application uses Tailwind CSS with custom Nova color scheme:
- `nova-primary` - Primary brand color
- `nova-secondary` - Secondary brand color
- `nova-card` - Card background
- `nova-bg-light` - Light background
- `nova-bg-dark` - Dark background
- `nova-text-primary` - Primary text color
- `nova-text-secondary` - Secondary text color

Dark mode is fully supported throughout the application.

## 📊 Features

✅ **Responsive Design** - Works on mobile, tablet, and desktop
✅ **Dark Mode** - Full dark mode support
✅ **Real-time Data** - Fetches data from backend API
✅ **Error Handling** - Graceful error messages
✅ **Loading States** - Visual feedback during data loading
✅ **CRUD Operations** - Create, read, update, delete for contacts and events
✅ **Data Filtering** - Advanced filtering options
✅ **Data Export** - CSV export for reports
✅ **Navigation** - Smooth routing between sections

## 🧪 Testing

### Manual Testing Checklist
- [ ] Click each navigation link and verify correct view loads
- [ ] Verify active state highlighting in sidebar
- [ ] Test responsive design on mobile/tablet/desktop
- [ ] Test dark mode toggle
- [ ] Add/delete contacts and events
- [ ] Test filtering and search functionality
- [ ] Export reports to CSV
- [ ] Check browser console for errors

### Build Verification
```bash
# Build the project
npm run build

# Check for errors
npm run build 2>&1 | grep -i error
```

## 🚢 Deployment

### Frontend Deployment (Vercel)
```bash
# Build the project
npm run build

# Deploy dist/ folder to Vercel
# Or use Vercel CLI: vercel
```

### Backend Deployment (Vercel)
```bash
cd backend

# Backend is already configured for Vercel
# Deploy using: vercel
```

## 📝 File Structure

```
NovaCore/
├── src/
│   ├── App.tsx                 # Main app with routing
│   ├── main.tsx               # Entry point
│   ├── components/
│   │   ├── Sidebar.tsx        # Navigation sidebar
│   │   ├── Header.tsx         # Page header
│   │   └── icons.tsx          # Icon components
│   ├── views/
│   │   ├── Dashboard.tsx      # Dashboard section
│   │   ├── Analytics.tsx      # Analytics section
│   │   ├── Reports.tsx        # Reports section
│   │   ├── Calendar.tsx       # Calendar section
│   │   └── Contacts.tsx       # Contacts section
│   └── index.css              # Global styles
├── backend/
│   ├── src/
│   │   ├── index.js           # Express app
│   │   └── routes/
│   │       ├── analytics.js   # Analytics endpoints
│   │       ├── reports.js     # Reports endpoints
│   │       ├── calendar.js    # Calendar endpoints
│   │       ├── leads.js       # Leads endpoints
│   │       ├── ai.js          # AI endpoints
│   │       └── health.js      # Health check
│   └── vercel.json            # Vercel config
└── package.json               # Dependencies
```

## 🐛 Troubleshooting

### API Connection Issues
- Verify backend is running at the correct URL
- Check CORS configuration in backend
- Check browser console for error messages

### Build Errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf dist && npm run build`

### Navigation Not Working
- Verify react-router-dom is installed: `npm list react-router-dom`
- Check that all routes are defined in App.tsx

### Styling Issues
- Verify Tailwind CSS is properly configured
- Check that custom colors are defined in tailwind.config.js
- Clear browser cache and rebuild

## 📚 Documentation

- `COMPLETION_SUMMARY.md` - Project completion summary
- `IMPLEMENTATION_COMPLETE.md` - Detailed implementation guide
- `FRONTEND_IMPLEMENTATION_TEST.md` - Testing checklist

## 💡 Tips

1. **Development**: Use `npm run dev` for hot reload during development
2. **Production**: Use `npm run build` to create optimized production build
3. **Debugging**: Check browser DevTools console for errors
4. **Performance**: Monitor API response times and optimize as needed
5. **Maintenance**: Keep dependencies updated regularly

## 📞 Support

For issues or questions, refer to the documentation files or check the browser console for error messages.

---

**Last Updated**: October 29, 2025
**Status**: ✅ Ready for Production

