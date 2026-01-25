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

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

export const SignupPage: React.FC = () => {
  const { signup, isLoading, error, clearError } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    clearError();
    try {
      await signup({
        email: data.email,
        password: data.password,
        name: data.name,
      });
    } catch (err) {
      // Error is handled in context
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <Card className="w-full max-w-md shadow-2xl bg-[#faf3dd] backdrop-blur border-black border-2 border-r-8 border-b-8">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl  text-center text-[#4f772d]">
            Create an account
          </CardTitle>
          <CardDescription className="text-center text-xs text-[#4f772d]">
            Enter your information to get started
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
              <Label htmlFor="name" className='text-xs'>Full Name</Label>
              <Input
                id="name"
                type="text"
                className='text-xs  border-2 border-b-4 border-r-4 border-black  focus-visible:outline-none
    focus-visible:ring-0
    focus-visible:ring-offset-0
    focus:shadow-none'
                placeholder="John Doe"
                {...register('name')}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

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
                className='text-xs  border-2 border-b-4 border-r-4 border-black  focus-visible:outline-none
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className='text-xs'>Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                className='text-xs  border-2 border-b-4 border-r-4 border-black  focus-visible:outline-none
    focus-visible:ring-0
    focus-visible:ring-offset-0
    focus:shadow-none'
                placeholder="••••••••"
                {...register('confirmPassword')}
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full bg-[#4f772d] hover:bg-[#50772dc8] transition-colors" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-xs text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-[#4f772d] hover:text-[#50772dc8]  hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignupPage;
