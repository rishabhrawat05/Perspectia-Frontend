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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5EFFF] via-[#E5D9F2] to-[#CDC1FF] px-4">
        <Card className="w-full max-w-md shadow-2xl border-[#CDC1FF] bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-center text-[#7371FC]">Invalid Access</CardTitle>
            <CardDescription className="text-center text-[#A594F9]">
              Please sign up first to verify your email.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5EFFF] via-[#E5D9F2] to-[#CDC1FF] px-4">
      <Card className="w-full max-w-md shadow-2xl border-[#CDC1FF] bg-white/90 backdrop-blur">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-[#7371FC]">
            Verify your email
          </CardTitle>
          <CardDescription className="text-center text-[#A594F9]">
            We've sent a 6-digit code to <strong className="text-[#7371FC]">{email}</strong>
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
              <div className="bg-[#E5D9F2] border border-[#CDC1FF] text-[#7371FC] px-4 py-3 rounded-md text-sm">
                {resendMessage}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                maxLength={6}
                {...register('otp')}
                disabled={isLoading}
                className="text-center text-2xl tracking-widest"
              />
              {errors.otp && (
                <p className="text-sm text-red-600">{errors.otp.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full bg-[#7371FC] hover:bg-[#A594F9] transition-colors" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendLoading}
                className="text-sm text-[#7371FC] hover:text-[#A594F9] hover:underline disabled:opacity-50 font-medium"
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
