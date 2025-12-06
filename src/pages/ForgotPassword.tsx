import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Mail, Leaf, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const { resetPassword, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      // Error is handled by useAuth hook
      console.error('Password reset error:', error);
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
              {t('Enter your email address and we\'ll send you a link to reset your password')}
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              {isSubmitted ? (
                <div className="text-center py-4">
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-4 rounded-lg mb-6">
                    <h3 className="font-medium mb-2">{t('Check your email')}</h3>
                    <p>{t('We\'ve sent a password reset link to')} <strong>{email}</strong></p>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {t('If you don\'t see the email, check your spam folder or try again.')}
                  </p>
                  <Link to="/login">
                    <Button variant="outline" className="w-full" icon={<ArrowLeft className="h-4 w-4" />}>
                      {t('Back to Login')}
                    </Button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('Email Address')}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
                        placeholder={t('Enter your email')}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary"
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    {t('Send Reset Link')}
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