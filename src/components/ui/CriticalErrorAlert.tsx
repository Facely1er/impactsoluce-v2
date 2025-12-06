import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Button from './Button';
import { Link } from 'react-router-dom';

interface CriticalErrorAlertProps {
  error: Error;
  resetError?: () => void;
}

/**
 * Critical error alert for production environments
 * Shows when the app encounters a fatal error
 */
const CriticalErrorAlert: React.FC<CriticalErrorAlertProps> = ({ 
  error, 
  resetError 
}) => {
  const isProduction = import.meta.env.PROD;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-4">
          Application Error
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
          {isProduction 
            ? 'We encountered an unexpected error. Our team has been notified and is working on a fix.'
            : 'An error occurred while loading the application. Please try refreshing the page.'
          }
        </p>
        
        {!isProduction && (
          <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-900 rounded-md overflow-auto max-h-40">
            <p className="text-sm font-mono text-red-600 dark:text-red-400 break-all">
              {error.message}
            </p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => window.location.reload()}
            className="bg-primary flex-1"
            icon={<RefreshCw className="h-4 w-4" />}
          >
            Refresh Page
          </Button>
          
          {resetError && (
            <Button
              variant="outline"
              onClick={resetError}
              className="flex-1"
            >
              Try Again
            </Button>
          )}
          
          <Link to="/" className="flex-1">
            <Button
              variant="outline"
              className="w-full"
              icon={<Home className="h-4 w-4" />}
            >
              Go Home
            </Button>
          </Link>
        </div>
        
        {isProduction && (
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Error ID: {error.name}-{Date.now().toString(36)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CriticalErrorAlert;