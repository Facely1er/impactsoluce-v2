import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Card, CardContent } from '../components/ui/Card';
import { Mail, Lock, Eye, EyeOff, Leaf, Info, AlertCircle, UserPlus } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, isLoading, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isDemoCredentialsUsed, setIsDemoCredentialsUsed] = useState(false);

  // Get demo credentials from environment variables
  const demoEmail = import.meta.env.VITE_DEMO_EMAIL || 'demo@esgsoluce.com';
  const demoPassword = import.meta.env.VITE_DEMO_PASSWORD || 'Demo123!';

  // Get the redirect path from location state or default to dashboard
  const from = (location.state as any)?.from || '/dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    
    try {
      await signIn(formData.email, formData.password);
      
      // If remember me is checked, store email in localStorage
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      // Navigate will happen automatically due to the useEffect above
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle specific error cases
      if (error.message?.includes('Invalid login credentials')) {
        if (formData.email === demoEmail && isDemoCredentialsUsed) {
          setLoginError(
            'The demo account is not currently available. Please try the demo mode instead or create your own account.'
          );
        } else {
          setLoginError(
            'Invalid email or password. Please check your credentials and try again.'
          );
        }
      } else {
        setLoginError(error.message || 'An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (loginError) {
      setLoginError(null);
    }
    // Reset demo credentials flag if user changes email
    if (e.target.name === 'email' && e.target.value !== demoEmail) {
      setIsDemoCredentialsUsed(false);
    }
  };

  // Load remembered email on mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  // Fill in demo credentials
  const fillDemoCredentials = () => {
    setFormData({
      email: demoEmail,
      password: demoPassword
    });
    setIsDemoCredentialsUsed(true);
    setLoginError(null);
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
              {t('Sign in to ImpactSoluce™')}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {t('Access your ESG dashboard and continue your sustainability journey')}
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              {loginError && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-red-800 dark:text-red-300">{loginError}</p>
                      {isDemoCredentialsUsed && (
                        <div className="mt-2 space-y-2">
                          <Link to="/assessment?demo=true">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-blue-600 border-blue-300 hover:bg-blue-50"
                            >
                              {t('Try Demo Mode Instead')}
                            </Button>
                          </Link>
                          <Link to="/signup">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-green-600 border-green-300 hover:bg-green-50"
                            >
                              <UserPlus className="h-4 w-4 mr-2" />
                              {t('Create Free Account')}
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

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
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
                      placeholder={t('Enter your email')}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('Password')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 pr-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
                      placeholder={t('Enter your password')}
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      {t('Remember me')}
                    </label>
                  </div>

                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:text-primary-600"
                  >
                    {t('Forgot password?')}
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  {t('Sign In')}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('Don\'t have an account?')}{' '}
                  <Link to="/signup" className="text-primary hover:text-primary-600 font-medium">
                    {t('Sign up for free')}
                  </Link>
                </p>
              </div>

              {/* Demo Access Section */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="h-5 w-5 text-blue-500" />
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('Try Without Account')}
                  </h3>
                </div>
                
                {/* Primary Demo Mode Option */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mb-4">
                  <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
                    {t('Recommended: Demo Mode')}
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">
                    {t('Experience the full platform without any login required:')}
                  </p>
                  <div className="space-y-1 mb-3">
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      • {t('Complete ESG assessment')}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      • {t('View sample reports and analytics')}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      • {t('Explore all features instantly')}
                    </p>
                  </div>
                  <Link to="/assessment?demo=true">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-blue-600 border-blue-500 hover:bg-blue-600 hover:text-white font-medium"
                    >
                      {t('Start Demo Mode')}
                    </Button>
                  </Link>
                </div>

                {/* Alternative Demo Credentials */}
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {t('Alternative: Demo account credentials')}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mb-2"
                    onClick={fillDemoCredentials}
                  >
                    {t('Fill Demo Credentials')}
                  </Button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    {demoEmail}
                  </p>
                  <p className="text-xs text-orange-600 dark:text-orange-400 text-center mt-1">
                    {t('Note: Demo account may not always be available')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}