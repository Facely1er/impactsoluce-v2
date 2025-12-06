import { useEffect, useRef } from 'react';
import { trackEvent } from '../utils/analytics';

interface PerformanceMetrics {
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
}

export const usePerformanceMonitoring = (
  pageName: string,
  shouldMonitor = true
) => {
  const metricsRef = useRef<PerformanceMetrics>({});
  const observersRef = useRef<PerformanceObserver[]>([]);

  useEffect(() => {
    if (!shouldMonitor || typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    const cleanup = () => {
      observersRef.current.forEach(observer => observer.disconnect());
      observersRef.current = [];
    };

    // Monitor Largest Contentful Paint (LCP)
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        
        metricsRef.current.lcp = lastEntry.startTime;
        
        // Track LCP if it's above threshold
        if (lastEntry.startTime > 2500) {
          trackEvent({
            category: 'performance',
            action: 'poor_lcp',
            label: pageName,
            value: Math.round(lastEntry.startTime)
          });
        }
      });
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      observersRef.current.push(lcpObserver);
    } catch (error) {
      console.warn('Could not observe LCP:', error);
    }

    // Monitor First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          const fid = entry.processingStart - entry.startTime;
          metricsRef.current.fid = fid;
          
          // Track FID if it's above threshold
          if (fid > 100) {
            trackEvent({
              category: 'performance',
              action: 'poor_fid',
              label: pageName,
              value: Math.round(fid)
            });
          }
        });
      });
      
      fidObserver.observe({ entryTypes: ['first-input'] });
      observersRef.current.push(fidObserver);
    } catch (error) {
      console.warn('Could not observe FID:', error);
    }

    // Monitor Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        
        metricsRef.current.cls = clsValue;
        
        // Track CLS if it's above threshold
        if (clsValue > 0.1) {
          trackEvent({
            category: 'performance',
            action: 'poor_cls',
            label: pageName,
            value: Math.round(clsValue * 1000) / 1000
          });
        }
      });
      
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      observersRef.current.push(clsObserver);
    } catch (error) {
      console.warn('Could not observe CLS:', error);
    }

    // Monitor navigation timing
    try {
      const navigationObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          metricsRef.current.fcp = entry.firstContentfulPaint;
          metricsRef.current.ttfb = entry.responseStart - entry.requestStart;
        });
      });
      
      navigationObserver.observe({ entryTypes: ['navigation'] });
      observersRef.current.push(navigationObserver);
    } catch (error) {
      console.warn('Could not observe navigation:', error);
    }

    // Report metrics after page is loaded
    const reportMetrics = () => {
      const metrics = metricsRef.current;
      
      // Only report if we have meaningful data
      if (Object.keys(metrics).length > 0) {
        trackEvent({
          category: 'performance',
          action: 'page_metrics',
          label: pageName,
          value: Math.round(metrics.lcp || 0)
        });
      }
    };

    // Report metrics after a delay to capture most measurements
    const reportTimer = setTimeout(reportMetrics, 5000);

    return () => {
      cleanup();
      clearTimeout(reportTimer);
    };
  }, [pageName, shouldMonitor]);

  return {
    metrics: metricsRef.current
  };
};

// Hook for component-level performance monitoring
export const useComponentPerformance = (componentName: string) => {
  const renderStartRef = useRef<number>(0);
  const mountTimeRef = useRef<number>(0);

  useEffect(() => {
    // Record mount time
    mountTimeRef.current = performance.now();
    
    return () => {
      // Record unmount and calculate total mount duration
      const mountDuration = performance.now() - mountTimeRef.current;
      
      if (mountDuration > 1000) { // Only track slow components
        trackEvent({
          category: 'component_performance',
          action: 'slow_component',
          label: componentName,
          value: Math.round(mountDuration)
        });
      }
    };
  }, [componentName]);

  const trackRender = () => {
    renderStartRef.current = performance.now();
  };

  const trackRenderComplete = () => {
    if (renderStartRef.current) {
      const renderDuration = performance.now() - renderStartRef.current;
      
      if (renderDuration > 16) { // More than one frame at 60fps
        trackEvent({
          category: 'component_performance',
          action: 'slow_render',
          label: componentName,
          value: Math.round(renderDuration)
        });
      }
    }
  };

  return {
    trackRender,
    trackRenderComplete
  };
};