/**
 * Enhanced error logging for error boundaries
 */

import { reportError } from './errorReporting';

export interface ErrorBoundaryInfo {
  componentStack: string;
  errorBoundary?: string;
  errorInfo?: any;
}

// Log error boundary errors with enhanced context
export const logErrorBoundaryError = (
  error: Error,
  errorInfo: ErrorBoundaryInfo,
  componentName?: string
): void => {
  const context = {
    componentStack: errorInfo.componentStack,
    errorBoundary: errorInfo.errorBoundary || componentName,
    userAgent: navigator.userAgent,
    url: window.location.href,
    timestamp: new Date().toISOString(),
    userId: localStorage.getItem('userId') || undefined,
    sessionId: sessionStorage.getItem('sessionId') || undefined
  };

  // Log to console in development
  if (import.meta.env.DEV) {
    console.group('🚨 Error Boundary Caught Error');
    console.error('Error:', error);
    console.error('Component Stack:', errorInfo.componentStack);
    console.error('Context:', context);
    console.groupEnd();
  }

  // Report to external service in production
  if (import.meta.env.PROD) {
    reportError(error, context);
  }
};

// Enhanced error boundary with better error reporting
export const createErrorBoundaryLogger = (boundaryName: string) => {
  return (error: Error, errorInfo: any) => {
    logErrorBoundaryError(error, errorInfo, boundaryName);
  };
};