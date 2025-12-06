import { useState, useCallback } from 'react';
import { apiClient, ApiResponse, ApiRequestOptions } from '../utils/apiClient';
import { useToast } from './useToast';

interface UseApiWithRetryOptions extends ApiRequestOptions {
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  successMessage?: string;
}

export const useApiWithRetry = <T = any>() => {
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
      ...apiOptions
    } = options;

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.request<T>(endpoint, apiOptions);

      if (response.success) {
        setData(response.data || null);
        
        if (showSuccessToast && successMessage) {
          addToast('success', successMessage);
        }
      } else {
        setError(response.error || 'Request failed');
        
        if (showErrorToast) {
          addToast('error', 'Request failed', response.error);
        }
      }

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
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
    } finally {
      setIsLoading(false);
    }
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