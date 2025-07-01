'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

function ResetPasswordForm() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState('');
  const [isValidToken, setIsValidToken] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const resetToken = searchParams.get('token');
    if (!resetToken) {
      setIsValidToken(false);
      toast.error('Invalid reset link');
    } else {
      setToken(resetToken);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password/${token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: formData.password }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        toast.success('Password reset successful!');
        
        // Store the token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        toast.error(data.message || 'Failed to reset password');
        if (data.message?.includes('Invalid') || data.message?.includes('expired')) {
          setIsValidToken(false);
        }
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-black flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>

            {/* Error Message */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Invalid Reset Link
              </h2>
              <p className="text-gray-600 mb-6">
                This password reset link is invalid or has expired.
              </p>
              <p className="text-sm text-gray-500 mb-8">
                Password reset links expire after 10 minutes for security purposes.
              </p>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Link
                  href="/forgot-password"
                  className="block w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors text-center"
                >
                  Request New Reset Link
                </Link>
                
                <Link
                  href="/login"
                  className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-black flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Password Reset Successful!
              </h2>
              <p className="text-gray-600 mb-6">
                Your password has been successfully updated. You&apos;re now logged in and will be redirected to your dashboard.
              </p>

              {/* Loading indicator */}
              <div className="flex justify-center items-center space-x-2 text-indigo-600 mb-6">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm">Redirecting to dashboard...</span>
              </div>

              {/* Manual redirect link */}
              <Link
                href="/dashboard"
                className="inline-block text-indigo-600 hover:text-indigo-500 font-medium text-sm"
              >
                Click here if not redirected automatically
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-black flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
              <FaLock className="text-indigo-900 text-2xl" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Reset Your Password
          </h2>
          <p className="text-indigo-300">
            Enter your new password below
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-indigo-300/30">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white mb-2 font-medium">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-indigo-300" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-indigo-300/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-indigo-300"
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-indigo-300 hover:text-white" />
                  ) : (
                    <FaEye className="text-indigo-300 hover:text-white" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">Confirm New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-indigo-300" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-indigo-300/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-indigo-300"
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="text-indigo-300 hover:text-white" />
                  ) : (
                    <FaEye className="text-indigo-300 hover:text-white" />
                  )}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-indigo-800/30 rounded-lg p-3 border border-indigo-600/30">
              <p className="text-xs text-indigo-200 mb-2 font-medium">Password requirements:</p>
              <ul className="text-xs text-indigo-300 space-y-1">
                <li className={`flex items-center ${formData.password.length >= 6 ? 'text-green-400' : ''}`}>
                  <span className="mr-2">{formData.password.length >= 6 ? '✓' : '•'}</span>
                  At least 6 characters long
                </li>
                <li className={`flex items-center ${formData.password && formData.confirmPassword && formData.password === formData.confirmPassword ? 'text-green-400' : ''}`}>
                  <span className="mr-2">{formData.password && formData.confirmPassword && formData.password === formData.confirmPassword ? '✓' : '•'}</span>
                  Passwords match
                </li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-indigo-900 bg-yellow-400 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-indigo-300/30" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/10 text-indigo-300">or</span>
            </div>
          </div>

          {/* Back to Login */}
          <div className="mt-6">
            <Link
              href="/login"
              className="w-full flex justify-center items-center py-3 px-4 border border-indigo-300/30 rounded-lg shadow-sm text-sm font-medium text-indigo-300 bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Login
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-indigo-300">
            Need help?{' '}
            <Link href="/contact" className="text-yellow-400 hover:text-yellow-300 font-medium">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}