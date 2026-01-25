import api from './api';
import type {
  LoginRequest,
  SignupRequest,
  VerifyRequest,
  ResendOtpRequest,
  GoogleLoginRequest,
  GithubLoginRequest,
  AuthResponse,
  RefreshTokenResponse,
  User,
} from '../types/auth.types';

const AUTH_BASE = '/api/perspectia/auth';

export const authApi = {
  // Login with email and password
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(`${AUTH_BASE}/login`, credentials);
    return response.data;
  },

  // Signup new user
  signup: async (userData: SignupRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(`${AUTH_BASE}/signup`, userData);
    return response.data;
  },

  // Verify email with OTP
  verifyOtp: async (verifyData: VerifyRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(`${AUTH_BASE}/verify/email`, verifyData);
    return response.data;
  },

  // Resend OTP
  resendOtp: async (resendData: ResendOtpRequest): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(`${AUTH_BASE}/resend/otp`, resendData);
    return response.data;
  },

  // Google OAuth login
  googleLogin: async (googleData: GoogleLoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(`${AUTH_BASE}/google-login`, googleData);
    return response.data;
  },

  // GitHub OAuth login
  githubLogin: async (githubData: GithubLoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(`${AUTH_BASE}/github-login`, githubData);
    return response.data;
  },

  // Refresh access token
  refreshToken: async (): Promise<RefreshTokenResponse> => {
    const response = await api.post<RefreshTokenResponse>(`${AUTH_BASE}/token/refresh`);
    return response.data;
  },

  // Logout
  logout: async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(`${AUTH_BASE}/logout`);
    return response.data;
  },

  // Validate current session and get user data
  validate: async (): Promise<AuthResponse | null> => {
    try {
      const response = await api.get<any>(`${AUTH_BASE}/validate`);
      // If backend returns boolean true, try to get user data separately
      if (response.data === true) {
        return await authApi.getCurrentUser().then(user => 
          user ? { user } : null
        );
      }
      // If backend returns AuthResponse with user
      if (response.data && typeof response.data === 'object' && response.data.user) {
        return response.data as AuthResponse;
      }
      return null;
    } catch (error) {
      return null;
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await api.get<User>(`${AUTH_BASE}/me`);
      return response.data;
    } catch (error) {
      return null;
    }
  },
};

export default authApi;
