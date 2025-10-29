import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      // In production, use Google OAuth SDK
      // For demo, simulate Google login
      const mockGoogleToken = 'mock_google_token_' + Date.now();
      const mockEmail = 'user@gmail.com';
      const mockName = 'Google User';

      await loginWithGoogle(mockGoogleToken, mockEmail, mockName);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-nova-bg-light dark:bg-nova-bg-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-nova-card dark:bg-nova-card-dark rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-nova-text-primary dark:text-nova-text-primary-dark mb-2">
            Welcome Back
          </h1>
          <p className="text-nova-text-secondary dark:text-nova-text-secondary-dark mb-8">
            Sign in to your NovaCore account
          </p>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Email Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-nova-text-primary dark:text-nova-text-primary-dark mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-nova-border dark:border-nova-border-dark rounded-lg bg-nova-bg-light dark:bg-nova-bg-dark text-nova-text-primary dark:text-nova-text-primary-dark placeholder-nova-text-secondary"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-nova-text-primary dark:text-nova-text-primary-dark mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-nova-border dark:border-nova-border-dark rounded-lg bg-nova-bg-light dark:bg-nova-bg-dark text-nova-text-primary dark:text-nova-text-primary-dark placeholder-nova-text-secondary"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-nova-primary text-white rounded-lg font-medium hover:bg-nova-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-nova-border dark:border-nova-border-dark"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-nova-card dark:bg-nova-card-dark text-nova-text-secondary dark:text-nova-text-secondary-dark">
                Or continue with
              </span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-2 border border-nova-border dark:border-nova-border-dark rounded-lg font-medium text-nova-text-primary dark:text-nova-text-primary-dark hover:bg-nova-bg-light dark:hover:bg-nova-bg-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-3"
          >
            🔵 Sign in with Google
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-nova-text-secondary dark:text-nova-text-secondary-dark">
            Don't have an account?{' '}
            <Link to="/signup" className="text-nova-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-nova-bg-light dark:bg-nova-bg-dark rounded-lg">
            <p className="text-xs font-medium text-nova-text-secondary dark:text-nova-text-secondary-dark mb-2">
              Demo Credentials:
            </p>
            <p className="text-xs text-nova-text-secondary dark:text-nova-text-secondary-dark">
              Email: demo@example.com<br />
              Password: demo123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

