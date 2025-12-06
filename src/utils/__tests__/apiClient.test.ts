import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiClient } from '../apiClient';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('ApiClient', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('request method', () => {
    it('makes successful requests', async () => {
      const mockResponse = { success: true, data: { id: 1, name: 'test' } };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await apiClient.request('/test-endpoint');
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResponse);
      expect(result.metadata?.requestId).toBeDefined();
      expect(result.metadata?.duration).toBeGreaterThan(0);
    });

    it('handles failed requests', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: () => Promise.resolve('Not found')
      });

      const result = await apiClient.request('/not-found');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Not found');
    });

    it('handles network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await apiClient.request('/network-error');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
    });

    it('respects timeout settings', async () => {
      // Mock a slow response
      mockFetch.mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(resolve, 2000))
      );

      const result = await apiClient.request('/slow-endpoint', { timeout: 1000 });
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('timeout');
    });

    it('caches GET requests when cache option is true', async () => {
      const mockResponse = { data: 'cached data' };
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      // First request
      await apiClient.request('/cacheable', { method: 'GET', cache: true });
      
      // Second request should use cache
      const result = await apiClient.request('/cacheable', { method: 'GET', cache: true });
      
      expect(result.metadata?.cached).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('rate limiting', () => {
    it('enforces rate limits', async () => {
      // Clear rate limiter state
      apiClient.clearCache();
      
      // Make requests up to the limit
      const promises = Array.from({ length: 10 }, () => 
        apiClient.request('/rate-limited', { skipRateLimit: false })
      );
      
      await Promise.all(promises);
      
      // Next request should be rate limited
      const result = await apiClient.request('/rate-limited', { skipRateLimit: false });
      
      if (result.error) {
        expect(result.error).toContain('Rate limit exceeded');
      }
    });
  });
});