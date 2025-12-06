/**
 * Analytics and tracking utilities for production
 */

import { APP_ENV } from '../lib/config';

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  userId?: string;
  sessionId?: string;
}

// Track events (placeholder for production analytics)
export const trackEvent = (event: AnalyticsEvent): void => {
  if (APP_ENV !== 'production') return;
  
  try {
    // Example: Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        user_id: event.userId,
        session_id: event.sessionId
      });
    }
    
    // Example: Custom analytics endpoint
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(event)
    // });
    
  } catch (error) {
    console.error('Analytics tracking failed:', error);
  }
};

// Track page views
export const trackPageView = (page: string, title?: string): void => {
  trackEvent({
    category: 'navigation',
    action: 'page_view',
    label: page
  });
};

// Track user actions
export const trackUserAction = (action: string, category: string, label?: string): void => {
  trackEvent({
    category,
    action,
    label
  });
};

// Track ESG assessment completion
export const trackAssessmentCompletion = (score: number, completionTime: number): void => {
  trackEvent({
    category: 'assessment',
    action: 'completed',
    value: score
  });
  
  trackEvent({
    category: 'assessment',
    action: 'completion_time',
    value: completionTime
  });
};

// Track file uploads
export const trackFileUpload = (fileType: string, fileSize: number): void => {
  trackEvent({
    category: 'file_upload',
    action: 'upload_completed',
    label: fileType,
    value: fileSize
  });
};