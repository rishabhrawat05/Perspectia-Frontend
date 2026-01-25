// Request types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface VerifyRequest {
  email: string;
  otp: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface GoogleLoginRequest {
  accessToken: string;
}

export interface GithubLoginRequest {
  code: string;
}

// Response types
export interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  provider?: string;
}

export interface AuthResponse {
  accessToken?: string;
  user: User;
  message?: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface ApiError {
  message: string;
  status: number;
}
