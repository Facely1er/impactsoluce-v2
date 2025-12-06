/**
 * Application monitoring and error tracking
 * 
 * This module provides utilities for monitoring application health,
 * tracking errors, and logging important events.
 */

import { APP_ENV } from './config';

// Types of events we can log
export enum EventType {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  DEBUG = 'debug'
}

// Severity levels for errors
export enum ErrorSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

// Structure for error events
interface ErrorEvent {
  message: string;
  stack?: string;
  context?: Record<string, any>;
  severity: ErrorSeverity;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  url?: string;
  component?: string;
}

// Structure for general events
interface AppEvent {
  type: EventType;
  message: string;
  data?: Record<string, any>;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

// In-memory storage for events (in production, these would be sent to a service)
const events: AppEvent[] = [];
const errors: ErrorEvent[] = [];
const MAX_STORED_EVENTS = 100;

// Generate a unique session ID
const generateSessionId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Get or create a session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('app_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('app_session_id', sessionId);
  }
  return sessionId;
};

// Current session ID
const SESSION_ID = getSessionId();

// Log an error
export const logError = (
  error: unknown,
  context?: Record<string, any>,
  severity: ErrorSeverity = ErrorSeverity.MEDIUM,
  component?: string
): void => {
  const errorObj = error instanceof Error ? error : new Error(String(error));
  
  const errorEvent: ErrorEvent = {
    message: errorObj.message,
    stack: errorObj.stack,
    context,
    severity,
    timestamp: new Date().toISOString(),
    userId: localStorage.getItem('userId') || undefined,
    sessionId: SESSION_ID,
    url: window.location.href,
    component
  };
  
  // Add to in-memory storage
  errors.push(errorEvent);
  if (errors.length > MAX_STORED_EVENTS) {
    errors.shift();
  }
  
  // Log to console in development
  if (APP_ENV === 'development') {
    console.error(
      `[${severity.toUpperCase()}] ${errorEvent.message}`,
      context,
      errorObj.stack
    );
  }
  
  // In production, this would send to a service like Sentry
  // if (APP_ENV === 'production') {
  //   sendToErrorService(errorEvent);
  // }
};

// Log a general event
export const logEvent = (
  type: EventType,
  message: string,
  data?: Record<string, any>
): void => {
  const event: AppEvent = {
    type,
    message,
    data,
    timestamp: new Date().toISOString(),
    userId: localStorage.getItem('userId') || undefined,
    sessionId: SESSION_ID
  };
  
  // Add to in-memory storage
  events.push(event);
  if (events.length > MAX_STORED_EVENTS) {
    events.shift();
  }
  
  // Log to console in development
  if (APP_ENV === 'development') {
    const logMethod = type === EventType.ERROR ? console.error :
                      type === EventType.WARNING ? console.warn :
                      type === EventType.DEBUG ? console.debug :
                      console.info;
    
    logMethod(`[${type.toUpperCase()}] ${message}`, data);
  }
  
  // In production, this would send to an analytics service
  // if (APP_ENV === 'production' && type !== EventType.DEBUG) {
  //   sendToAnalyticsService(event);
  // }
};

// Track a user action
export const trackUserAction = (
  action: string,
  properties?: Record<string, any>
): void => {
  logEvent(EventType.INFO, `User Action: ${action}`, properties);
};

// Track a page view
export const trackPageView = (
  page: string,
  properties?: Record<string, any>
): void => {
  logEvent(EventType.INFO, `Page View: ${page}`, {
    url: window.location.href,
    referrer: document.referrer,
    ...properties
  });
};

// Get all logged errors
export const getLoggedErrors = (): ErrorEvent[] => {
  return [...errors];
};

// Get all logged events
export const getLoggedEvents = (): AppEvent[] => {
  return [...events];
};

// Clear all logs
export const clearLogs = (): void => {
  errors.length = 0;
  events.length = 0;
};

// Initialize monitoring
export const initMonitoring = (): void => {
  // Set up global error handler
  window.addEventListener('error', (event) => {
    logError(event.error || new Error(event.message), {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    }, ErrorSeverity.HIGH);
    
    // Don't prevent default - let the browser handle it too
    return false;
  });
  
  // Set up unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    logError(event.reason || new Error('Unhandled Promise Rejection'), {
      promise: event.promise
    }, ErrorSeverity.HIGH);
    
    // Don't prevent default
    return false;
  });
  
  // Track initial page load
  trackPageView('Initial Load');
  
  // Log successful initialization
  logEvent(EventType.INFO, 'Monitoring initialized', {
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString()
  });
};