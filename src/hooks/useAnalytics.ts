/**
 * Analytics tracking hook
 * Provides page view and event tracking capabilities
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, trackUserAction, logEvent, EventType } from '../lib/monitoring';

/**
 * Hook to automatically track page views on route changes
 */
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view when route changes
    trackPageView(location.pathname, {
      search: location.search,
      hash: location.hash,
    });
  }, [location]);
};

/**
 * Hook for tracking user actions and events
 */
export const useAnalytics = () => {
  const trackAction = (action: string, properties?: Record<string, unknown>) => {
    trackUserAction(action, properties);
  };

  const trackEvent = (eventName: string, data?: Record<string, unknown>) => {
    logEvent(EventType.INFO, `Event: ${eventName}`, data);
  };

  const trackError = (error: string, context?: Record<string, unknown>) => {
    logEvent(EventType.ERROR, `Error: ${error}`, context);
  };

  const trackFeatureUsage = (feature: string, properties?: Record<string, unknown>) => {
    trackUserAction(`Feature Used: ${feature}`, {
      feature,
      timestamp: new Date().toISOString(),
      ...properties,
    });
  };

  return {
    trackAction,
    trackEvent,
    trackError,
    trackFeatureUsage,
  };
};

