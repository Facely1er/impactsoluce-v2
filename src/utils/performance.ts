/**
 * Performance monitoring utilities
 * Tracks Core Web Vitals and custom performance metrics
 */

import { APP_ENV } from '../lib/config';
import { trackEvent } from './analytics';

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: string;
}

interface WebVitals {
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  FCP?: number; // First Contentful Paint
  TTFB?: number; // Time to First Byte
}

const metrics: PerformanceMetric[] = [];
const MAX_METRICS = 50;

// Rating thresholds based on Web Vitals
const getRating = (name: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
  const thresholds: Record<string, { good: number; poor: number }> = {
    LCP: { good: 2500, poor: 4000 },
    FID: { good: 100, poor: 300 },
    CLS: { good: 0.1, poor: 0.25 },
    FCP: { good: 1800, poor: 3000 },
    TTFB: { good: 800, poor: 1800 }
  };

  const threshold = thresholds[name];
  if (!threshold) return 'good';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
};

// Measure Core Web Vitals
export const measureWebVitals = (): void => {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

  try {
    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;
      const lcp = lastEntry.renderTime || lastEntry.loadTime;
      
      if (lcp) {
        recordMetric('LCP', lcp);
      }
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        const fid = entry.processingStart - entry.startTime;
        if (fid) {
          recordMetric('FID', fid);
        }
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      recordMetric('CLS', clsValue);
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });

    // First Contentful Paint (FCP)
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (entry.name === 'first-contentful-paint') {
          recordMetric('FCP', entry.startTime);
        }
      });
    });
    fcpObserver.observe({ entryTypes: ['paint'] });

    // Time to First Byte (TTFB)
    if (performance.timing) {
      const ttfb = performance.timing.responseStart - performance.timing.requestStart;
      if (ttfb > 0) {
        recordMetric('TTFB', ttfb);
      }
    }
  } catch (error) {
    console.error('Performance monitoring error:', error);
  }
};

// Record a performance metric
export const recordMetric = (name: string, value: number): void => {
  const rating = getRating(name, value);
  const metric: PerformanceMetric = {
    name,
    value: Math.round(value),
    rating,
    timestamp: new Date().toISOString()
  };

  metrics.push(metric);
  if (metrics.length > MAX_METRICS) {
    metrics.shift();
  }

  // Track in analytics
  trackEvent('performance_metric', {
    metric_name: name,
    metric_value: value,
    rating
  });

  // Log in development
  if (APP_ENV === 'development') {
    console.log(`[Performance] ${name}: ${value}ms (${rating})`);
  }

  // Alert if poor performance
  if (rating === 'poor') {
    console.warn(`[Performance Warning] ${name} is ${rating}: ${value}ms`);
  }
};

// Measure custom performance
export const measurePerformance = (name: string, fn: () => void): void => {
  const start = performance.now();
  fn();
  const end = performance.now();
  const duration = end - start;
  
  recordMetric(name, duration);
};

// Measure async performance
export const measureAsyncPerformance = async <T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> => {
  const start = performance.now();
  try {
    const result = await fn();
    const end = performance.now();
    recordMetric(name, end - start);
    return result;
  } catch (error) {
    const end = performance.now();
    recordMetric(`${name}_error`, end - start);
    throw error;
  }
};

// Get all metrics
export const getMetrics = (): PerformanceMetric[] => {
  return [...metrics];
};

// Get metrics by name
export const getMetricsByName = (name: string): PerformanceMetric[] => {
  return metrics.filter(m => m.name === name);
};

// Get latest metric by name
export const getLatestMetric = (name: string): PerformanceMetric | null => {
  const metric = metrics.filter(m => m.name === name).pop();
  return metric || null;
};

// Get Web Vitals summary
export const getWebVitals = (): WebVitals => {
  const lcp = getLatestMetric('LCP');
  const fid = getLatestMetric('FID');
  const cls = getLatestMetric('CLS');
  const fcp = getLatestMetric('FCP');
  const ttfb = getLatestMetric('TTFB');

  return {
    LCP: lcp?.value,
    FID: fid?.value,
    CLS: cls?.value,
    FCP: fcp?.value,
    TTFB: ttfb?.value
  };
};

// Clear all metrics
export const clearMetrics = (): void => {
  metrics.length = 0;
};

// Initialize performance monitoring
export const initPerformanceMonitoring = (): void => {
  if (typeof window === 'undefined') return;

  // Measure Web Vitals
  measureWebVitals();

  // Measure page load time
  window.addEventListener('load', () => {
    if (performance.timing) {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      recordMetric('PageLoad', loadTime);
    }
  });

  // Measure route changes (for SPA)
  let routeStartTime = performance.now();
  window.addEventListener('popstate', () => {
    const routeTime = performance.now() - routeStartTime;
    recordMetric('RouteChange', routeTime);
    routeStartTime = performance.now();
  });
};
