/**
 * Security utilities and Content Security Policy helpers
 */

import { APP_ENV } from '../lib/config';

// Content Security Policy configuration
export const CSP_POLICY = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for Vite in dev mode
    "'unsafe-eval'", // Required for some libraries
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com'
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for Tailwind CSS
    'https://fonts.googleapis.com'
  ],
  'font-src': [
    "'self'",
    'https://fonts.gstatic.com',
    'data:'
  ],
  'img-src': [
    "'self'",
    'data:',
    'https:',
    'blob:'
  ],
  'connect-src': [
    "'self'",
    'https://*.supabase.co',
    'https://www.google-analytics.com',
    'https://www.googletagmanager.com'
  ],
  'frame-src': ["'none'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': APP_ENV === 'production' ? [] : undefined
};

// Generate CSP header string
export const generateCSPHeader = (): string => {
  return Object.entries(CSP_POLICY)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key} ${value.join(' ')}`;
      }
      return key;
    })
    .join('; ');
};

// Sanitize user input to prevent XSS
export const sanitizeInput = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate URL format
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Generate secure random token
export const generateSecureToken = (length: number = 32): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Hash string (simple hash, not for passwords)
export const hashString = async (str: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Check if running in secure context (HTTPS)
export const isSecureContext = (): boolean => {
  return typeof window !== 'undefined' && window.isSecureContext;
};

// Validate and sanitize object keys
export const sanitizeObject = <T extends Record<string, any>>(obj: T): T => {
  const sanitized = { ...obj };
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeInput(sanitized[key]);
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeObject(sanitized[key]);
    }
  }
  return sanitized;
};

// Rate limiting helper (client-side, basic)
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  constructor(
    private maxRequests: number = 10,
    private windowMs: number = 60000 // 1 minute
  ) {}

  isAllowed(key: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove old requests outside the window
    const recentRequests = requests.filter(time => now - time < this.windowMs);
    
    if (recentRequests.length >= this.maxRequests) {
      return false;
    }
    
    recentRequests.push(now);
    this.requests.set(key, recentRequests);
    return true;
  }

  reset(key: string): void {
    this.requests.delete(key);
  }
}

// Create rate limiter instance
export const createRateLimiter = (maxRequests: number = 10, windowMs: number = 60000): RateLimiter => {
  return new RateLimiter(maxRequests, windowMs);
};

// Security headers for meta tags (if needed)
export const getSecurityMetaTags = (): Array<{ name: string; content: string }> => {
  return [
    {
      name: 'X-Content-Type-Options',
      content: 'nosniff'
    },
    {
      name: 'X-Frame-Options',
      content: 'DENY'
    },
    {
      name: 'X-XSS-Protection',
      content: '1; mode=block'
    },
    {
      name: 'Referrer-Policy',
      content: 'strict-origin-when-cross-origin'
    },
    {
      name: 'Permissions-Policy',
      content: 'geolocation=(), microphone=(), camera=()'
    }
  ];
};

