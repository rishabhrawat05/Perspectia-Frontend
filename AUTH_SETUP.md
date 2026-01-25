# Authentication System Documentation

This is a complete authentication system for the Perspectia frontend, integrating with the Spring Boot backend.

## Features

- ✅ User Login with email and password
- ✅ User Signup with email verification
- ✅ OTP Email Verification
- ✅ Automatic Token Refresh with httpOnly cookies
- ✅ Protected Routes
- ✅ Form Validation with Zod
- ✅ OAuth ready (Google & GitHub endpoints configured)
- ✅ Styled with shadcn/ui components

## Project Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── label.tsx
│   └── ProtectedRoute.tsx     # Route protection wrapper
├── contexts/
│   └── AuthContext.tsx        # Auth state management
├── pages/
│   ├── LoginPage.tsx          # Login form
│   ├── SignupPage.tsx         # Signup form
│   ├── OtpVerificationPage.tsx # OTP verification
│   └── DashboardPage.tsx      # Protected dashboard
├── services/
│   ├── api.ts                 # Axios instance with interceptors
│   └── auth.api.ts            # Auth API endpoints
└── types/
    └── auth.types.ts          # TypeScript interfaces
```

## Setup Instructions

### 1. Environment Configuration

Update the `.env` file with your backend API URL:

```env
VITE_API_BASE_URL=http://localhost:8080
```

### 2. Install Dependencies (Already Done)

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

## Authentication Flow

### Signup Flow
1. User fills signup form with name, email, and password
2. Form validates input using Zod schema
3. POST request to `/api/perspectia/auth/signup`
4. User redirected to OTP verification page
5. User enters 6-digit OTP received via email
6. POST request to `/api/perspectia/auth/verify/email`
7. User redirected to login page after successful verification

### Login Flow
1. User fills login form with email and password
2. Form validates input using Zod schema
3. POST request to `/api/perspectia/auth/login`
4. Backend sets httpOnly refresh token cookie
5. User object stored in AuthContext state
6. User redirected to dashboard (protected route)

### Token Refresh Flow
1. Access token expires (401 response)
2. Axios interceptor detects 401 error
3. Automatic POST to `/api/perspectia/auth/token/refresh`
4. New access token received
5. Original request retried with new token
6. If refresh fails, user redirected to login

### Logout Flow
1. User clicks logout button
2. POST request to `/api/perspectia/auth/logout`
3. Backend clears httpOnly cookies
4. User state cleared from AuthContext
5. User redirected to login page

## API Endpoints Used

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/perspectia/auth/login` | POST | Login with email/password |
| `/api/perspectia/auth/signup` | POST | Register new user |
| `/api/perspectia/auth/verify/email` | POST | Verify email with OTP |
| `/api/perspectia/auth/resend/otp` | POST | Resend OTP code |
| `/api/perspectia/auth/token/refresh` | POST | Refresh access token |
| `/api/perspectia/auth/logout` | POST | Logout user |
| `/api/perspectia/auth/validate` | GET | Validate current session |
| `/api/perspectia/auth/google-login` | POST | OAuth Google login |
| `/api/perspectia/auth/github-login` | POST | OAuth GitHub login |

## Routes

| Route | Protection | Description |
|-------|-----------|-------------|
| `/login` | Public | Login page |
| `/signup` | Public | Signup page |
| `/verify-otp` | Public | OTP verification page |
| `/dashboard` | Protected | User dashboard |
| `/` | Redirect | Redirects to dashboard |

## Key Components

### AuthContext (`src/contexts/AuthContext.tsx`)
Provides authentication state and methods throughout the app:
- `user` - Current user object or null
- `isAuthenticated` - Boolean authentication status
- `isLoading` - Loading state for async operations
- `login()` - Login user
- `signup()` - Register new user
- `verifyOtp()` - Verify email with OTP
- `logout()` - Logout user
- `error` - Error message from last operation
- `clearError()` - Clear error message

### API Service (`src/services/api.ts`)
Axios instance with automatic token refresh:
- Configures base URL and credentials
- Request interceptor for adding tokens
- Response interceptor for handling 401 errors
- Automatic token refresh on expiration
- Request queuing during refresh

### ProtectedRoute Component
Wrapper for protected routes:
- Checks authentication status
- Shows loading spinner during validation
- Redirects to login if not authenticated
- Renders children if authenticated

## Form Validation

All forms use **react-hook-form** with **Zod** schemas:

**Login Schema:**
- Email: Valid email format
- Password: Minimum 6 characters

**Signup Schema:**
- Name: Minimum 2 characters
- Email: Valid email format
- Password: Minimum 6 characters
- Confirm Password: Must match password

**OTP Schema:**
- OTP: Exactly 6 digits

## Styling

- **Tailwind CSS 4** for utility classes
- **shadcn/ui** for pre-built components
- Responsive design with mobile-first approach
- Clean, modern UI with proper spacing and typography

## Next Steps (Optional Enhancements)

1. **OAuth Integration**
   - Implement Google OAuth flow with `@react-oauth/google`
   - Implement GitHub OAuth flow
   - Add OAuth buttons to login/signup pages

2. **Password Reset**
   - Add "Forgot Password" link
   - Create password reset flow

3. **Remember Me**
   - Add "Remember Me" checkbox on login
   - Extend session duration

4. **Profile Management**
   - Add profile edit page
   - Allow users to update name, email, password
   - Profile picture upload

5. **Enhanced Security**
   - Add CAPTCHA to signup/login
   - Rate limiting on frontend
   - Password strength indicator
   - Two-factor authentication (2FA)

6. **Better Error Handling**
   - Add toast notifications for success/error
   - Network error handling
   - Retry logic for failed requests

7. **Loading States**
   - Skeleton loaders for better UX
   - Progress indicators
   - Optimistic updates

## Troubleshooting

### CORS Issues
Make sure your backend allows credentials and includes the frontend origin:
```java
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
```

### Token Not Refreshing
- Check that `withCredentials: true` is set in axios config
- Verify httpOnly cookies are being set by backend
- Check browser dev tools > Application > Cookies

### Routes Not Working
- Ensure BrowserRouter is wrapping App in main.tsx
- Check that all route paths match exactly
- Verify ProtectedRoute is wrapping protected pages

## Technologies Used

- **React 19.2** - UI framework
- **TypeScript 5.9** - Type safety
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - Component library
- **Vite 7** - Build tool

## Backend Requirements

Your backend must:
1. Set httpOnly cookies for refresh tokens
2. Return user object in authentication responses
3. Support all listed API endpoints
4. Handle CORS with credentials enabled
5. Return 401 status for expired/invalid tokens
