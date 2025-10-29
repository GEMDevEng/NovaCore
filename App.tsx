import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { AuthProvider, useAuth } from './context/AuthContext';

// Lazy load route components for code splitting
const Dashboard = React.lazy(() => import('./views/Dashboard'));
const Analytics = React.lazy(() => import('./views/Analytics'));
const Reports = React.lazy(() => import('./views/Reports'));
const Calendar = React.lazy(() => import('./views/Calendar'));
const Contacts = React.lazy(() => import('./views/Contacts'));
const Login = React.lazy(() => import('./views/Login'));
const Signup = React.lazy(() => import('./views/Signup'));
const Pricing = React.lazy(() => import('./views/Pricing'));

// Loading fallback component
const LoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nova-primary"></div>
  </div>
);

// Protected Route Component
const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingFallback />;
  }

  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      {isAuthenticated ? (
        <div className="flex min-h-screen bg-nova-bg-light dark:bg-nova-bg-dark">
          <Sidebar />
          <main className="flex-1">
            <Header />
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      ) : (
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      )}
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;