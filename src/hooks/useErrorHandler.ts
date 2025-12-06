import { useState } from 'react';

interface ErrorState {
  message: string;
  details?: string;
}

export function useErrorHandler() {
  const [error, setError] = useState<ErrorState | null>(null);

  const handleError = (error: unknown) => {
    if (error instanceof Error) {
      setError({
        message: error.message,
        details: error.stack
      });
    } else if (typeof error === 'string') {
      setError({
        message: error
      });
    } else {
      setError({
        message: 'An unexpected error occurred',
        details: JSON.stringify(error)
      });
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    error,
    handleError,
    clearError
  };
}