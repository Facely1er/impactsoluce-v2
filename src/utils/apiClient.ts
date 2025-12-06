/**
 * Enhanced API client with retry logic, error handling, and monitoring
 */

import { supabase } from '../lib/supabase';
import { retryWithBackoff, logError, isNetworkError, isAuthError } from './errorHandler';
import { API_RATE_LIMITER, enforceRateLimit } from './rateLimiter';
import { trackEvent } from './analytics';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  success: boolean;
  metadata?: {
    requestId?: string;
    timestamp: string;
    duration: number;
    cached?: boolean;
  };
}

export interface ApiRequestOptions {
  retries?: number;
  timeout?: number;
  cache?: boolean;
  skipRateLimit?: boolean;
}

class ApiClient {
  private baseURL: string;
  private defaultTimeout = 30000; // 30 seconds

  constructor() {
    this.baseURL = import.meta.env.VITE_SUPABASE_URL || '';
  }

  // Enhanced fetch with retry logic and monitoring
  async request<T>(
    endpoint: string,
    options: RequestInit & ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const startTime = performance.now();
    const requestId = this.generateRequestId();
    
    const {
      retries = 3,
      timeout = this.defaultTimeout,
      cache = false,
      skipRateLimit = false,
      ...fetchOptions
    } = options;

    try {
      // Check rate limit
      if (!skipRateLimit) {
        const rateLimit = enforceRateLimit(API_RATE_LIMITER);
        if (!rateLimit.allowed) {
          throw new Error(`Rate limit exceeded. Try again in ${Math.ceil(rateLimit.timeUntilReset / 1000)} seconds.`);
        }
      }

      // Check cache first
      if (cache && fetchOptions.method === 'GET') {
        const cachedResponse = this.getFromCache<T>(endpoint);
        if (cachedResponse) {
          return {
            ...cachedResponse,
            metadata: {
              ...cachedResponse.metadata,
              cached: true
            }
          };
        }
      }

      // Make request with retry logic
      const response = await retryWithBackoff(async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
          const response = await fetch(`${this.baseURL}${endpoint}`, {
            ...fetchOptions,
            signal: controller.signal,
            headers: {
              'Content-Type': 'application/json',
              'X-Request-ID': requestId,
              ...fetchOptions.headers,
            }
          });

          clearTimeout(timeoutId);
          return response;
        } catch (error) {
          clearTimeout(timeoutId);
          throw error;
        }
      }, retries);

      const duration = performance.now() - startTime;
      const result: ApiResponse<T> = {
        success: response.ok,
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          duration
        }
      };

      if (response.ok) {
        const data = await response.json();
        result.data = data;

        // Cache successful GET requests
        if (cache && fetchOptions.method === 'GET') {
          this.setCache(endpoint, result);
        }

        // Track successful API calls
        trackEvent({
          category: 'api',
          action: 'request_success',
          label: endpoint,
          value: Math.round(duration)
        });
      } else {
        result.error = await response.text();
        
        // Track API errors
        trackEvent({
          category: 'api',
          action: 'request_error',
          label: `${response.status}: ${endpoint}`,
          value: response.status
        });
      }

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      logError(error, {
        endpoint,
        requestId,
        duration,
        options: fetchOptions
      });

      // Track API errors
      trackEvent({
        category: 'api',
        action: 'request_failure',
        label: endpoint,
        value: Math.round(duration)
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Request failed',
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          duration
        }
      };
    }
  }

  // Generate unique request ID
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  // Simple memory cache for GET requests
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  private getFromCache<T>(key: string): ApiResponse<T> | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() > cached.timestamp + cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCache<T>(key: string, data: ApiResponse<T>, ttl = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }
}

export const apiClient = new ApiClient();

// Supabase client with enhanced error handling
export const createSupabaseRequest = async <T>(
  operation: () => Promise<{ data: T | null; error: any }>
): Promise<ApiResponse<T>> => {
  const startTime = performance.now();
  
  try {
    const result = await operation();
    const duration = performance.now() - startTime;

    if (result.error) {
      logError(result.error, { context: 'supabase_operation', duration });
      
      return {
        success: false,
        error: result.error.message || 'Database operation failed',
        metadata: {
          timestamp: new Date().toISOString(),
          duration
        }
      };
    }

    return {
      success: true,
      data: result.data,
      metadata: {
        timestamp: new Date().toISOString(),
        duration
      }
    };
  } catch (error) {
    const duration = performance.now() - startTime;
    
    logError(error, { context: 'supabase_operation', duration });
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown database error',
      metadata: {
        timestamp: new Date().toISOString(),
        duration
      }
    };
  }
};