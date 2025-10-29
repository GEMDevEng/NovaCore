import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  subscription?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: (token: string, email: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  getProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = (process.env.VITE_API_URL || 'https://backend-hlzualdvn-gem-devs-projects.vercel.app') + '/api/v1';

// TEMPORARY: Authentication bypass for testing
const BYPASS_AUTH = true;
const MOCK_USER: User = {
  id: 'mock-user-001',
  email: 'demo@novacore.app',
  name: 'Demo User',
  subscription: 'premium',
};
const MOCK_TOKEN = 'mock-token-bypass-auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(BYPASS_AUTH ? MOCK_USER : null);
  const [token, setToken] = useState<string | null>(BYPASS_AUTH ? MOCK_TOKEN : null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token from localStorage on mount
  useEffect(() => {
    if (BYPASS_AUTH) {
      // Skip authentication checks and use mock user
      setUser(MOCK_USER);
      setToken(MOCK_TOKEN);
      setIsLoading(false);
      return;
    }

    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('authUser');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      if (BYPASS_AUTH) {
        // Bypass authentication - set mock user
        setToken(MOCK_TOKEN);
        setUser(MOCK_USER);
        localStorage.setItem('authToken', MOCK_TOKEN);
        localStorage.setItem('authUser', JSON.stringify(MOCK_USER));
        localStorage.setItem('userId', MOCK_USER.id);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      setToken(data.data.token);
      setUser(data.data.user);
      localStorage.setItem('authToken', data.data.token);
      localStorage.setItem('authUser', JSON.stringify(data.data.user));
      localStorage.setItem('userId', data.data.user.id);
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      if (BYPASS_AUTH) {
        // Bypass authentication - set mock user
        setToken(MOCK_TOKEN);
        setUser(MOCK_USER);
        localStorage.setItem('authToken', MOCK_TOKEN);
        localStorage.setItem('authUser', JSON.stringify(MOCK_USER));
        localStorage.setItem('userId', MOCK_USER.id);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const data = await response.json();
      setToken(data.data.token);
      setUser(data.data.user);
      localStorage.setItem('authToken', data.data.token);
      localStorage.setItem('authUser', JSON.stringify(data.data.user));
      localStorage.setItem('userId', data.data.user.id);
    } catch (error) {
      throw error;
    }
  };

  const loginWithGoogle = async (token: string, email: string, name: string) => {
    try {
      if (BYPASS_AUTH) {
        // Bypass authentication - set mock user
        setToken(MOCK_TOKEN);
        setUser(MOCK_USER);
        localStorage.setItem('authToken', MOCK_TOKEN);
        localStorage.setItem('authUser', JSON.stringify(MOCK_USER));
        localStorage.setItem('userId', MOCK_USER.id);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/oauth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'google', token, email, name }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Google login failed');
      }

      const data = await response.json();
      setToken(data.data.token);
      setUser(data.data.user);
      localStorage.setItem('authToken', data.data.token);
      localStorage.setItem('authUser', JSON.stringify(data.data.user));
      localStorage.setItem('userId', data.data.user.id);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      localStorage.removeItem('userId');
    }
  };

  const getProfile = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.data.user);
        localStorage.setItem('authUser', JSON.stringify(data.data.user));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        loginWithGoogle,
        logout,
        getProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

