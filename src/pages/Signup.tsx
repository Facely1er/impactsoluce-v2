import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Card, CardContent } from '../components/ui/Card';
import { Mail, Lock, User, Building, Eye, EyeOff, Leaf, Info } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

export default function Signup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signUp, isLoading, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = t('Passwords do not match');
    }
    
    if (formData.password.length < 8) {
      errors.password = t('Password must be at least 8 characters long');
    }
    
    if (!termsAccepted) {
      errors.terms = t('You must accept the Terms of Service and Privacy Policy');
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await signUp(formData.email, formData.password, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        company: formData.company,
      });
      
      // Navigate to login page after successful signup
      navigate('/login');
    } catch (error) {
      // Error is handled by useAuth hook
      console.error('Signup error:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear error for this field if it exists
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: ''
      });
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
              {t('Create your ImpactSoluce™ account')}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {t('Start your ESG journey with a free 14-day trial')}
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('First Name')}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('Last Name')}
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>

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
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('Company Name')}
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="company"
                      name="company"
                      type="text"
                      required
                      value={formData.company}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
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
                      className={`pl-10 pr-10 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white ${
                        formErrors.password ? 'border-red-500 dark:border-red-700' : 'border-gray-300 dark:border-gray-700'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.password}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('Confirm Password')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`pl-10 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white ${
                        formErrors.confirmPassword ? 'border-red-500 dark:border-red-700' : 'border-gray-300 dark:border-gray-700'
                      }`}
                    />
                  </div>
                  {formErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.confirmPassword}</p>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className={`h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded ${
                      formErrors.terms ? 'border-red-500' : ''
                    }`}
                  />
                  <label htmlFor="terms" className={`ml-2 block text-sm ${
                    formErrors.terms ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {t('I agree to the')}{' '}
                    <Link to="/terms" className="text-primary hover:text-primary-600">
                      {t('Terms of Service')}
                    </Link>{' '}
                    {t('and')}{' '}
                    <Link to="/privacy" className="text-primary hover:text-primary-600">
                      {t('Privacy Policy')}
                    </Link>
                  </label>
                </div>
                {formErrors.terms && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.terms}</p>
                )}

                <Button
                  type="submit"
                  className="w-full bg-primary"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  {t('Create Account')}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('Already have an account?')}{' '}
                  <Link to="/login" className="text-primary hover:text-primary-600 font-medium">
                    {t('Sign in')}
                  </Link>
                </p>
              </div>

              {/* Demo Option */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="h-5 w-5 text-blue-500" />
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('Try the demo without signing up')}
                  </h3>
                </div>
                <Link to="/assessment?demo=true">
                  <Button 
                    variant="outline" 
                    className="w-full text-primary border-primary"
                  >
                    {t('Try Demo')}
                  </Button>
                </Link>
                <p className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
                  {t('No account required. Experience the platform instantly.')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}