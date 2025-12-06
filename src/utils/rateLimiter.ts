/**
 * Client-side rate limiting utilities
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyGenerator?: (request: any) => string;
}

class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  // Check if request is allowed
  isAllowed(key?: string): boolean {
    const requestKey = key || 'default';
    const now = Date.now();
    const requests = this.requests.get(requestKey) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(
      timestamp => now - timestamp < this.config.windowMs
    );
    
    // Check if we've exceeded the limit
    if (validRequests.length >= this.config.maxRequests) {
      return false;
    }
    
    // Add current request
    validRequests.push(now);
    this.requests.set(requestKey, validRequests);
    
    return true;
  }

  // Get remaining requests
  getRemainingRequests(key?: string): number {
    const requestKey = key || 'default';
    const now = Date.now();
    const requests = this.requests.get(requestKey) || [];
    
    const validRequests = requests.filter(
      timestamp => now - timestamp < this.config.windowMs
    );
    
    return Math.max(0, this.config.maxRequests - validRequests.length);
  }

  // Get time until next request is allowed
  getTimeUntilReset(key?: string): number {
    const requestKey = key || 'default';
    const requests = this.requests.get(requestKey) || [];
    
    if (requests.length === 0) return 0;
    
    const oldestRequest = Math.min(...requests);
    const resetTime = oldestRequest + this.config.windowMs;
    
    return Math.max(0, resetTime - Date.now());
  }
}

// Pre-configured rate limiters
export const API_RATE_LIMITER = new RateLimiter({
  maxRequests: 100,
  windowMs: 60 * 1000 // 100 requests per minute
});

export const UPLOAD_RATE_LIMITER = new RateLimiter({
  maxRequests: 10,
  windowMs: 60 * 1000 // 10 uploads per minute
});

export const AUTH_RATE_LIMITER = new RateLimiter({
  maxRequests: 5,
  windowMs: 60 * 1000 // 5 auth attempts per minute
});

// Utility function to check and enforce rate limits
export const enforceRateLimit = (
  limiter: RateLimiter,
  key?: string
): { allowed: boolean; remainingRequests: number; timeUntilReset: number } => {
  const allowed = limiter.isAllowed(key);
  const remainingRequests = limiter.getRemainingRequests(key);
  const timeUntilReset = limiter.getTimeUntilReset(key);
  
  return {
    allowed,
    remainingRequests,
    timeUntilReset
  };
};