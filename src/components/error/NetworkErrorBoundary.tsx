import React, { useState, useEffect, ReactNode } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import Button from '../ui/Button';

interface NetworkErrorBoundaryProps {
  children: ReactNode;
}

const NetworkErrorBoundary: React.FC<NetworkErrorBoundaryProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkConnection = async () => {
    setIsCheckingConnection(true);
    
    try {
      // Try to fetch a small resource to check actual connectivity
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('/favicon.ico', { 
        method: 'HEAD',
        signal: controller.signal,
        cache: 'no-store'
      });
      
      clearTimeout(timeoutId);
      setIsOnline(response.ok);
    } catch (error) {
      console.error('Connection check failed:', error);
      setIsOnline(false);
    } finally {
      setIsCheckingConnection(false);
    }
  };

  if (!isOnline) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
              <WifiOff className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            You're offline
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Please check your internet connection and try again.
          </p>
          
          <Button
            onClick={checkConnection}
            className="bg-primary"
            loading={isCheckingConnection}
            disabled={isCheckingConnection}
            icon={<RefreshCw className="h-4 w-4" />}
          >
            {isCheckingConnection ? 'Checking connection...' : 'Try Again'}
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default NetworkErrorBoundary;