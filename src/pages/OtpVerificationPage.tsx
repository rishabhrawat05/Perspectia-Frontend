import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import authApi from '../services/auth.api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';

const otpSchema = z.object({
  otp: z.string().length(4, 'OTP must be 4 digits'),
});

type OtpFormData = z.infer<typeof otpSchema>;

export const OtpVerificationPage: React.FC = () => {
  const location = useLocation();
  const email = location.state?.email || '';
  const { verifyOtp, isLoading, error, clearError } = useAuth();
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  const onSubmit = async (data: OtpFormData) => {
    clearError();
    if (!email) {
      return;
    }
    try {
      await verifyOtp({
        email,
        otp: data.otp,
      });
    } catch (err) {
      // Error is handled in context
    }
  };

  const handleResendOtp = async () => {
    if (!email) return;

    try {
      setResendLoading(true);
      setResendMessage('');
      const response = await authApi.resendOtp({ email });
      setResendMessage(response.message || 'OTP sent successfully!');
    } catch (err) {
      setResendMessage('Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-2xl bg-[#faf3dd] border-2 border-r-8 border-b-8 border-black backdrop-blur">
          <CardHeader>
            <CardTitle className="text-center text-[#4f772d]">Invalid Access</CardTitle>
            <CardDescription className="text-center text-[#4f772d] text-xs p-2">
              Please sign up first to verify your email.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-2xl bg-[#faf3dd] border-2 border-r-8 border-b-8 border-black backdrop-blur">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-[#4f772d]">
            Verify your email
          </CardTitle>
          <CardDescription className="text-center text-[#4f772d] text-xs p-2">
            We've sent a 4-digit code to <strong className="text-[#4f772d]">{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {resendMessage && (
              <div className="bg-green-50 border border-green-200 text-[#4f772d] px-4 py-3 rounded-md text-sm">
                {resendMessage}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="otp" className="text-xs">Enter OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="1234"
                maxLength={4}
                {...register('otp')}
                disabled={isLoading}
                className="text-center text-2xl tracking-widest border-2 border-b-4 border-r-4 border-black focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:shadow-none"
              />
              {errors.otp && (
                <p className="text-sm text-red-600">{errors.otp.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full bg-[#4f772d] hover:bg-[#50772dc8] transition-colors" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendLoading}
                className="text-sm text-[#4f772d] hover:text-[#50772dc8] hover:underline disabled:opacity-50 font-medium"
              >
                {resendLoading ? 'Sending...' : "Didn't receive the code? Resend"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OtpVerificationPage;
