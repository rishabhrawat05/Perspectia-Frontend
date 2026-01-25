import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login, isLoading, error, clearError } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    try {
      await login(data);
    } catch (err) {
      // Error is handled in context
    }
  };

  return (
    <div className=" min-h-screen  flex items-center justify-center  px-4">
      <Card className="w-full max-w-md shadow-2xl bg-[#faf3dd] border-2 border-r-8 border-b-8 border-black backdrop-blur">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-[#4f772d]">
            Welcome back
          </CardTitle>
          <CardDescription className="text-center text-[#4f772d] text-xs p-2">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className='text-xs'>Email</Label>
              <Input
                id="email"
                type="email"
                className='text-xs  border-2 border-b-4 border-r-4 border-black  focus-visible:outline-none
    focus-visible:ring-0
    focus-visible:ring-offset-0
    focus:shadow-none'
                placeholder="you@example.com"
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className='text-xs'>Password</Label>
              <Input
                id="password"
                type="password"
                className='border-2 border-b-4 border-r-4 border-black  focus-visible:outline-none
    focus-visible:ring-0
    focus-visible:ring-offset-0
    focus:shadow-none'
                placeholder="••••••••"
                {...register('password')}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full bg-[#4f772d] hover:bg-[#50772dc8] transition-colors" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-xs text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#4f772d] hover:text-[#50772dc8] hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
