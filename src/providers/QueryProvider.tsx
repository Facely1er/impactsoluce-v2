import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';
import { CACHE_DURATIONS } from '../utils/cacheUtils';
import { logError } from '../utils/errorHandler';

export const QueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: CACHE_DURATIONS.SHORT, // 5 minutes
        gcTime: CACHE_DURATIONS.MEDIUM, // 30 minutes
        retry: (failureCount, error) => {
          // Don't retry on 404s or auth errors
          if (error instanceof Error) {
            if (
              error.message.includes('not found') ||
              error.message.includes('unauthorized') ||
              error.message.includes('forbidden') ||
              error.message.includes('not authenticated')
            ) {
              return false;
            }
          }
          return failureCount < 3;
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        onError: (error) => {
          logError(error, { context: 'react-query' });
        },
      },
      mutations: {
        retry: false,
        onError: (error) => {
          logError(error, { context: 'react-query-mutation' });
        },
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};