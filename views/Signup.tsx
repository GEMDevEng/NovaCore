import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { register, loginWithGoogle } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register(email, password, name);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError(null);
    setLoading(true);

    try {
      // In production, use Google OAuth SDK
      // For demo, simulate Google signup
      const mockGoogleToken = 'mock_google_token_' + Date.now();
      const mockEmail = 'newuser@gmail.com';
      const mockName = 'New Google User';

      await loginWithGoogle(mockGoogleToken, mockEmail, mockName);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-nova-bg-light dark:bg-nova-bg-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-nova-card dark:bg-nova-card-dark rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-nova-text-primary dark:text-nova-text-primary-dark mb-2">
            Create Account
          </h1>
          <p className="text-nova-text-secondary dark:text-nova-text-secondary-dark mb-8">
            Join NovaCore and start optimizing your business
          </p>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-nova-text-primary dark:text-nova-text-primary-dark mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-nova-border dark:border-nova-border-dark rounded-lg bg-nova-bg-light dark:bg-nova-bg-dark text-nova-text-primary dark:text-nova-text-primary-dark placeholder-nova-text-secondary"
                placeholder="John Doe"
                required
              />
            </div>

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

            <div>
              <label className="block text-sm font-medium text-nova-text-primary dark:text-nova-text-primary-dark mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-nova-border dark:border-nova-border-dark"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-nova-card dark:bg-nova-card-dark text-nova-text-secondary dark:text-nova-text-secondary-dark">
                Or sign up with
              </span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full py-2 border border-nova-border dark:border-nova-border-dark rounded-lg font-medium text-nova-text-primary dark:text-nova-text-primary-dark hover:bg-nova-bg-light dark:hover:bg-nova-bg-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-3"
          >
            🔵 Sign up with Google
          </button>

          {/* Login Link */}
          <p className="text-center text-nova-text-secondary dark:text-nova-text-secondary-dark">
            Already have an account?{' '}
            <Link to="/login" className="text-nova-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

