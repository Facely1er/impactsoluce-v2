/**
 * Production error reporting utilities
 */

import { APP_ENV } from '../lib/config';

interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  buildVersion?: string;
}

// Report error to external service (placeholder for production service)
const reportToService = async (errorReport: ErrorReport): Promise<void> => {
  if (APP_ENV !== 'production') return;
  
  try {
    // In production, replace this with your actual error reporting service
    // Examples: Sentry, LogRocket, Rollbar, Bugsnag
    console.log('Error report:', errorReport);
    
    // Example integration with a monitoring service:
    // await fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorReport)
    // });
  } catch (reportingError) {
    console.error('Failed to report error:', reportingError);
  }
};

// Enhanced error reporting
export const reportError = async (
  error: Error,
  context?: Record<string, any>
): Promise<void> => {
  const errorReport: ErrorReport = {
    message: error.message,
    stack: error.stack,
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    userId: localStorage.getItem('userId') || undefined,
    sessionId: sessionStorage.getItem('sessionId') || undefined,
    buildVersion: import.meta.env.VITE_APP_VERSION || 'unknown',
    ...context
  };
  
  await reportToService(errorReport);
};

// Global error handler for unhandled errors
export const setupGlobalErrorReporting = (): void => {
  // Handle unhandled JavaScript errors
  window.addEventListener('error', (event) => {
    reportError(new Error(event.message), {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      type: 'javascript'
    });
  });
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason instanceof Error 
      ? event.reason 
      : new Error(String(event.reason));
    
    reportError(error, {
      type: 'promise-rejection'
    });
  });
  
  // Handle network errors
  window.addEventListener('offline', () => {
    reportError(new Error('User went offline'), {
      type: 'network',
      connectionType: (navigator as any).connection?.effectiveType
    });
  });
};