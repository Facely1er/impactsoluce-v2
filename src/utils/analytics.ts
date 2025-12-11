/**
 * Analytics and tracking utilities
 * Supports multiple analytics providers (Google Analytics, Mixpanel, etc.)
 */

import { ENABLE_ANALYTICS, APP_ENV } from '../lib/config';

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: string;
}

interface PageViewEvent {
  path: string;
  title?: string;
  referrer?: string;
  properties?: Record<string, any>;
}

// Analytics provider interface
interface AnalyticsProvider {
  track(event: AnalyticsEvent): void;
  pageView(event: PageViewEvent): void;
  identify(userId: string, traits?: Record<string, any>): void;
  setUserProperties(properties: Record<string, any>): void;
}

// Google Analytics 4 implementation
class GoogleAnalyticsProvider implements AnalyticsProvider {
  private measurementId: string;
  private initialized = false;

  constructor(measurementId?: string) {
    this.measurementId = measurementId || import.meta.env.VITE_GA_MEASUREMENT_ID || '';
    this.init();
  }

  private init(): void {
    if (!this.measurementId || !ENABLE_ANALYTICS) return;
    if (typeof window === 'undefined') return;

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    (window as any).gtag = gtag;

    gtag('js', new Date());
    gtag('config', this.measurementId, {
      page_path: window.location.pathname,
      send_page_view: false // We'll send page views manually
    });

    this.initialized = true;
  }

  track(event: AnalyticsEvent): void {
    if (!this.initialized || !ENABLE_ANALYTICS) return;
    
    try {
      (window as any).gtag('event', event.name, {
        ...event.properties,
        user_id: event.userId,
        timestamp: event.timestamp || new Date().toISOString()
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  pageView(event: PageViewEvent): void {
    if (!this.initialized || !ENABLE_ANALYTICS) return;
    
    try {
      (window as any).gtag('config', this.measurementId, {
        page_path: event.path,
        page_title: event.title || document.title,
        page_referrer: event.referrer || document.referrer,
        ...event.properties
      });
    } catch (error) {
      console.error('Analytics pageview error:', error);
    }
  }

  identify(userId: string, traits?: Record<string, any>): void {
    if (!this.initialized || !ENABLE_ANALYTICS) return;
    
    try {
      (window as any).gtag('set', { user_id: userId, ...traits });
    } catch (error) {
      console.error('Analytics identify error:', error);
    }
  }

  setUserProperties(properties: Record<string, any>): void {
    if (!this.initialized || !ENABLE_ANALYTICS) return;
    
    try {
      (window as any).gtag('set', 'user_properties', properties);
    } catch (error) {
      console.error('Analytics setUserProperties error:', error);
    }
  }
}

// Console provider for development
class ConsoleAnalyticsProvider implements AnalyticsProvider {
  track(event: AnalyticsEvent): void {
    if (APP_ENV === 'development') {
      console.log('[Analytics] Event:', event.name, event.properties);
    }
  }

  pageView(event: PageViewEvent): void {
    if (APP_ENV === 'development') {
      console.log('[Analytics] Page View:', event.path, event.properties);
    }
  }

  identify(userId: string, traits?: Record<string, any>): void {
    if (APP_ENV === 'development') {
      console.log('[Analytics] Identify:', userId, traits);
    }
  }

  setUserProperties(properties: Record<string, any>): void {
    if (APP_ENV === 'development') {
      console.log('[Analytics] User Properties:', properties);
    }
  }
}

// Initialize analytics provider
const getAnalyticsProvider = (): AnalyticsProvider => {
  if (!ENABLE_ANALYTICS) {
    return new ConsoleAnalyticsProvider();
  }

  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (gaId) {
    return new GoogleAnalyticsProvider(gaId);
  }

  return new ConsoleAnalyticsProvider();
};

const analytics = getAnalyticsProvider();

// Public API
export const trackEvent = (name: string, properties?: Record<string, any>): void => {
  const userId = localStorage.getItem('userId') || undefined;
  analytics.track({
    name,
    properties,
    userId,
    timestamp: new Date().toISOString()
  });
};

export const trackPageView = (path: string, title?: string, properties?: Record<string, any>): void => {
  analytics.pageView({
    path,
    title: title || document.title,
    referrer: document.referrer,
    properties
  });
};

export const identifyUser = (userId: string, traits?: Record<string, any>): void => {
  analytics.identify(userId, traits);
};

export const setUserProperties = (properties: Record<string, any>): void => {
  analytics.setUserProperties(properties);
};

// Common event tracking functions
export const trackAssessmentStart = (assessmentId: string): void => {
  trackEvent('assessment_started', { assessment_id: assessmentId });
};

export const trackAssessmentComplete = (assessmentId: string, score: number): void => {
  trackEvent('assessment_completed', { 
    assessment_id: assessmentId,
    score 
  });
};

export const trackRiskRadarConfigured = (config: Record<string, any>): void => {
  trackEvent('risk_radar_configured', config);
};

export const trackModuleActivated = (moduleId: string): void => {
  trackEvent('module_activated', { module_id: moduleId });
};

export const trackExport = (format: 'json' | 'pdf' | 'markdown', type: string): void => {
  trackEvent('export_generated', { format, export_type: type });
};

export const trackError = (error: Error, context?: Record<string, any>): void => {
  trackEvent('error_occurred', {
    error_message: error.message,
    error_stack: error.stack,
    ...context
  });
};

// Initialize analytics on load
if (typeof window !== 'undefined') {
  trackPageView(window.location.pathname);
}
