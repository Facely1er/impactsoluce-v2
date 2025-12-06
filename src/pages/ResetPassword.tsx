import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Leaf, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { supabase } from '../lib/supabase';
import { useToast } from '../hooks/useToast';

export default function ResetPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if we have a hash fragment in the URL (from email link)
  useEffect(() => {
    const handleHashParams = async () => {
      // The hash fragment contains the access token and type after the #
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      
      // Check if we have the necessary parameters
      if (!params.has('access_token') || !params.has('type') || params.get('type') !== 'recovery') {
        setError('Invalid or missing reset parameters. Please request a new password reset link.');
        return;
      }
      
      // Store the hash in session storage for later use
      sessionStorage.setItem('passwordResetHash', hash);
    };
    
    handleHashParams();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Get the hash from session storage
      const hash = sessionStorage.getItem('passwordResetHash');
      if (!hash) {
        throw new Error('Reset session expired. Please request a new password reset link.');
      }
      
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');
      
      if (!accessToken) {
        throw new Error('Invalid reset token. Please request a new password reset link.');
      }
      
      // Update the user's password
      const { error } = await supabase.auth.updateUser({ 
        password 
      });
      
      if (error) throw error;
      
      // Clear the hash from session storage
      sessionStorage.removeItem('passwordResetHash');
      
      setIsSuccess(true);
      addToast('success', 'Password reset successful', 'You can now log in with your new password');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error: any) {
      console.error('Password reset error:', error);
      setError(error.message || 'Failed to reset password. Please try again.');
      addToast('error', 'Password reset failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center">
              <Leaf className="h-12 w-12 text-primary" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
              {t('Reset Your Password')}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {t('Create a new password for your account')}
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              {isSuccess ? (
                <div className="text-center py-4">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                      <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {t('Password Reset Successful')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {t('Your password has been reset successfully. You will be redirected to the login page.')}
                  </p>
                  <Link to="/login">
                    <Button className="w-full bg-primary">
                      {t('Go to Login')}
                    </Button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-4 rounded-lg">
                      {error}
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('New Password')}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
                        placeholder={t('Enter your new password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('Confirm New Password')}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
                        placeholder={t('Confirm your new password')}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary"
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    {t('Reset Password')}
                  </Button>

                  <div className="text-center">
                    <Link to="/login" className="text-sm text-primary hover:text-primary-600">
                      {t('Back to Login')}
                    </Link>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}