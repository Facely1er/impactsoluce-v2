import { useState, useCallback } from 'react';
import { apiClient, ApiResponse, ApiRequestOptions } from '../utils/apiClient';
import { useToast } from './useToast';

interface UseApiWithRetryOptions extends ApiRequestOptions {
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  successMessage?: string;
  maxRetries?: number;
  retryDelay?: number; // in milliseconds
  retryableStatusCodes?: number[]; // HTTP status codes that should trigger retry
  onRetry?: (attempt: number, error: string) => void;
}

const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_RETRY_DELAY = 1000; // 1 second
const DEFAULT_RETRYABLE_STATUS_CODES = [408, 429, 500, 502, 503, 504]; // Timeout, Rate limit, Server errors

/**
 * Calculate exponential backoff delay
 */
const calculateRetryDelay = (attempt: number, baseDelay: number): number => {
  return baseDelay * Math.pow(2, attempt - 1);
};

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const useApiWithRetry = <T = unknown>() => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);
  const { addToast } = useToast();

  const execute = useCallback(async (
    endpoint: string,
    options: RequestInit & UseApiWithRetryOptions = {}
  ): Promise<ApiResponse<T>> => {
    const {
      showErrorToast = true,
      showSuccessToast = false,
      successMessage,
      maxRetries = DEFAULT_MAX_RETRIES,
      retryDelay = DEFAULT_RETRY_DELAY,
      retryableStatusCodes = DEFAULT_RETRYABLE_STATUS_CODES,
      onRetry,
      ...apiOptions
    } = options;

    setIsLoading(true);
    setError(null);

    let lastError: string | null = null;
    let lastResponse: ApiResponse<T> | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await apiClient.request<T>(endpoint, apiOptions);

        if (response.success) {
          setData(response.data || null);
          
          if (showSuccessToast && successMessage) {
            addToast('success', successMessage);
          }

          return response;
        } else {
          // Check if error is retryable
          // Note: ApiResponse doesn't include statusCode, so we check error message patterns
          const errorMessage = response.error || 'Request failed';
          const isRetryable = retryableStatusCodes.some(code => 
            errorMessage.includes(`Status ${code}`) || errorMessage.includes(`${code}`)
          );
          
          lastError = errorMessage;
          lastResponse = response;

          // If not retryable or last attempt, return error
          if (!isRetryable || attempt === maxRetries) {
            setError(lastError);
            
            if (showErrorToast) {
              addToast('error', 'Request failed', lastError);
            }

            return response;
          }

          // Retry with exponential backoff
          const delay = calculateRetryDelay(attempt, retryDelay);
          
          if (onRetry) {
            onRetry(attempt, lastError);
          }

          await sleep(delay);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        lastError = errorMessage;

        // Check if error is network-related (retryable)
        const isNetworkError = errorMessage.includes('network') || 
                              errorMessage.includes('fetch') ||
                              errorMessage.includes('timeout');

        // If not retryable or last attempt, return error
        if (!isNetworkError || attempt === maxRetries) {
          setError(errorMessage);
          
          if (showErrorToast) {
            addToast('error', 'Request failed', errorMessage);
          }

          return {
            success: false,
            error: errorMessage,
            metadata: {
              timestamp: new Date().toISOString(),
              duration: 0
            }
          };
        }

        // Retry with exponential backoff
        const delay = calculateRetryDelay(attempt, retryDelay);
        
        if (onRetry) {
          onRetry(attempt, errorMessage);
        }

        await sleep(delay);
      }
    }

    // If we get here, all retries failed
    setError(lastError || 'Request failed after retries');
    setIsLoading(false);
    
    return lastResponse || {
      success: false,
      error: lastError || 'Request failed after retries',
      metadata: {
        timestamp: new Date().toISOString(),
        duration: 0
      }
    };
  }, [addToast]);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    execute,
    isLoading,
    error,
    data,
    reset
  };
};