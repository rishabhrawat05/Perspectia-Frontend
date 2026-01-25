import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '../services/auth.api';
import type {
  User,
  LoginRequest,
  SignupRequest,
  VerifyRequest,
  AuthResponse,
} from '../types/auth.types';
import { AxiosError } from 'axios';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (userData: SignupRequest) => Promise<void>;
  verifyOtp: (verifyData: VerifyRequest) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with true to check auth on mount
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const isAuthenticated = !!user;

  // Check authentication status on mount (only once)
  useEffect(() => {
    // Skip auth check if we're on public pages
    const publicPaths = ['/login', '/signup', '/verify-otp'];
    if (publicPaths.some(path => window.location.pathname.includes(path))) {
      setIsLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const response = await authApi.validate();
        if (response && response.user) {
          setUser(response.user);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.error('Validate failed:', err);
      }

      try {
        const currentUser = await authApi.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Get current user failed:', err);
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []); // Empty dependency array - run only once on mount

  const handleAuthResponse = (response: AuthResponse) => {
    setUser(response.user);
    setError(null);
    setIsLoading(false); // Ensure loading is false after setting user
  };

  const handleError = (err: unknown) => {
    if (err instanceof AxiosError) {
      const message = err.response?.data?.message || err.message || 'An error occurred';
      setError(message);
    } else if (err instanceof Error) {
      setError(err.message);
    } else {
      setError('An unexpected error occurred');
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authApi.login(credentials);
      console.log('Login response:', response);
      
      // If login doesn't return user, fetch it from /me endpoint
      if (!response.user) {
        console.log('No user in response, fetching from /me');
        try {
          const currentUser = await authApi.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            setIsLoading(false);
            console.log('Got user from /me:', currentUser);
            navigate('/dashboard');
            return;
          }
        } catch (meErr) {
          console.error('Failed to get user from /me:', meErr);
        }
      } else {
        setUser(response.user);
        setIsLoading(false);
        console.log('Navigating to dashboard, user:', response.user);
        navigate('/dashboard');
        return;
      }
      
      // If we get here, something went wrong
      setError('Failed to get user information');
      setIsLoading(false);
    } catch (err) {
      console.error('Login error:', err);
      handleError(err);
      setIsLoading(false);
      throw err;
    }
  };

  const signup = async (userData: SignupRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      await authApi.signup(userData);
      // After signup, redirect to OTP verification
      navigate('/verify-otp', { state: { email: userData.email } });
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (verifyData: VerifyRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authApi.verifyOtp(verifyData);
      handleAuthResponse(response);
      navigate('/login');
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authApi.logout();
      setUser(null);
      navigate('/login');
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    verifyOtp,
    logout,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
