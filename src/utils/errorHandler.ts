/**
 * Global error handling utilities
 */

// Log error to console with additional context
export const logError = (error: unknown, context?: string): void => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;
  
  console.error(
    `[ESGSoluce Error]${context ? ` [${context}]` : ''}:`,
    errorMessage,
    errorStack ? { stack: errorStack } : ''
  );
};

// Format error for display to users
export const formatErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    // Clean up common error messages for user display
    const message = error.message
      .replace(/^Error: /, '')
      .replace(/\. \[.*\]$/, '');
    
    // Handle specific error types
    if (error.name === 'AuthError' || error.message.includes('auth')) {
      return message.includes('credentials') 
        ? 'Invalid email or password. Please try again.'
        : message;
    }
    
    if (error.name === 'NetworkError' || error.message.includes('network')) {
      return 'Network error. Please check your connection and try again.';
    }
    
    if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
      return 'Request timed out. Please try again later.';
    }
    
    return message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

// Check if error is a network error
export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return (
      error.name === 'NetworkError' ||
      error.message.includes('network') ||
      error.message.includes('fetch') ||
      error.message.includes('connection') ||
      error.message.includes('offline')
    );
  }
  return false;
};

// Check if error is an authentication error
export const isAuthError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return (
      error.name === 'AuthError' ||
      error.message.includes('auth') ||
      error.message.includes('authentication') ||
      error.message.includes('login') ||
      error.message.includes('password') ||
      error.message.includes('token') ||
      error.message.includes('session')
    );
  }
  return false;
};

// Retry a function with exponential backoff
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000,
  maxDelay = 10000
): Promise<T> => {
  let retries = 0;
  let delay = initialDelay;
  
  while (true) {
    try {
      return await fn();
    } catch (error) {
      retries++;
      
      if (retries > maxRetries) {
        throw error;
      }
      
      // Don't retry for certain errors
      if (error instanceof Error) {
        if (
          error.message.includes('not found') ||
          error.message.includes('permission denied') ||
          error.message.includes('invalid credentials')
        ) {
          throw error;
        }
      }
      
      // Calculate delay with exponential backoff and jitter
      delay = Math.min(delay * 2, maxDelay);
      const jitter = delay * 0.1 * Math.random();
      const backoffDelay = delay + jitter;
      
      console.warn(`Retry ${retries}/${maxRetries} after ${Math.round(backoffDelay)}ms`);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }
};