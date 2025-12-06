import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { checkAuthStatus } from '../../lib/supabase';
import { useToast } from '../../hooks/useToast';
import { useAssessmentDemo } from '../../hooks/useAssessmentDemo';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

/**
 * AuthGuard component to protect routes that require authentication
 * 
 * @param children - The components to render if authentication check passes
 * @param requireAuth - Whether authentication is required (default: true)
 * @param redirectTo - Where to redirect if auth check fails (default: /login)
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = true,
  redirectTo = '/login'
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { addToast } = useToast();
  const location = useLocation();
  const { isDemoMode } = useAssessmentDemo();
  const { t } = useTranslation();
  
  // Check if we're in development or test mode
  const isDevMode = process.env.NODE_ENV === 'development';
  const isTestMode = process.env.NODE_ENV === 'test';
  
  // Check if demo mode is enabled via URL parameter or environment variable
  const isDemoEnabled = isDemoMode || 
                       new URLSearchParams(location.search).get('demo') === 'true' ||
                       import.meta.env.VITE_ENABLE_DEMO_MODE === 'true';

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Skip auth check in demo mode, dev mode, or test mode
        if (isDemoEnabled || isDevMode || isTestMode) {
          setIsAuthenticated(true);
          return;
        }

        const { isAuthenticated: authStatus } = await checkAuthStatus();
        setIsAuthenticated(authStatus);
        
        if (requireAuth && !authStatus) {
          addToast('warning', 'Authentication required', 'Please sign in to access this page');
        }
      } catch (error) {
        console.error('Auth verification error:', error);
        setIsAuthenticated(false);
        addToast('error', 'Authentication error', 'Please try signing in again');
      }
    };

    verifyAuth();
  }, [requireAuth, addToast, location.pathname, isDemoEnabled, isDevMode, isTestMode]);

  // Still checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {isDemoEnabled ? t('Loading demo...') : t('Checking authentication...')}
          </p>
        </div>
      </div>
    );
  }

  // Demo mode, dev mode, test mode, or authentication requirement met
  if (isDemoEnabled || isDevMode || isTestMode || (requireAuth && isAuthenticated) || (!requireAuth && !isAuthenticated)) {
    return <>{children}</>;
  }

  // Redirect with the current location for post-login redirect
  return (
    <Navigate 
      to={redirectTo} 
      state={{ from: location.pathname }} 
      replace 
    />
  );
};

export default AuthGuard;