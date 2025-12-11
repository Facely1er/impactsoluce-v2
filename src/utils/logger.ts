/**
 * Comprehensive logging system
 * Supports different log levels and can integrate with external logging services
 */

import { APP_ENV } from '../lib/config';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: Error;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
}

// Log storage (in production, these would be sent to a logging service)
const logs: LogEntry[] = [];
const MAX_LOGS = 200;

// Current log level (can be configured)
let currentLogLevel = APP_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG;

// Get session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('app_session_id');
  if (!sessionId) {
    sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    sessionStorage.setItem('app_session_id', sessionId);
  }
  return sessionId;
};

// Format log entry
const formatLogEntry = (
  level: LogLevel,
  message: string,
  context?: Record<string, any>,
  error?: Error
): LogEntry => {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
    error: error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } as any : undefined,
    userId: localStorage.getItem('userId') || undefined,
    sessionId: getSessionId(),
    url: typeof window !== 'undefined' ? window.location.href : undefined,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined
  };
};

// Store log entry
const storeLog = (entry: LogEntry): void => {
  logs.push(entry);
  if (logs.length > MAX_LOGS) {
    logs.shift();
  }

  // In production, send to logging service
  if (APP_ENV === 'production' && entry.level >= LogLevel.ERROR) {
    // sendToLoggingService(entry);
  }
};

// Console logging
const logToConsole = (entry: LogEntry): void => {
  if (entry.level < currentLogLevel) return;

  const prefix = `[${LogLevel[entry.level]}] [${new Date(entry.timestamp).toLocaleTimeString()}]`;
  const message = `${prefix} ${entry.message}`;

  switch (entry.level) {
    case LogLevel.DEBUG:
      console.debug(message, entry.context, entry.error);
      break;
    case LogLevel.INFO:
      console.info(message, entry.context);
      break;
    case LogLevel.WARN:
      console.warn(message, entry.context, entry.error);
      break;
    case LogLevel.ERROR:
    case LogLevel.FATAL:
      console.error(message, entry.context, entry.error);
      break;
  }
};

// Main logging function
const log = (
  level: LogLevel,
  message: string,
  context?: Record<string, any>,
  error?: Error
): void => {
  const entry = formatLogEntry(level, message, context, error);
  storeLog(entry);
  logToConsole(entry);
};

// Public API
export const logger = {
  debug: (message: string, context?: Record<string, any>): void => {
    log(LogLevel.DEBUG, message, context);
  },

  info: (message: string, context?: Record<string, any>): void => {
    log(LogLevel.INFO, message, context);
  },

  warn: (message: string, context?: Record<string, any>, error?: Error): void => {
    log(LogLevel.WARN, message, context, error);
  },

  error: (message: string, context?: Record<string, any>, error?: Error): void => {
    log(LogLevel.ERROR, message, context, error);
  },

  fatal: (message: string, context?: Record<string, any>, error?: Error): void => {
    log(LogLevel.FATAL, message, context, error);
  },

  setLevel: (level: LogLevel): void => {
    currentLogLevel = level;
  },

  getLevel: (): LogLevel => {
    return currentLogLevel;
  },

  getLogs: (level?: LogLevel): LogEntry[] => {
    if (level !== undefined) {
      return logs.filter(log => log.level === level);
    }
    return [...logs];
  },

  clearLogs: (): void => {
    logs.length = 0;
  },

  exportLogs: (): string => {
    return JSON.stringify(logs, null, 2);
  }
};

// Performance logging helper
export const logPerformance = (name: string, duration: number, context?: Record<string, any>): void => {
  const level = duration > 3000 ? LogLevel.WARN : LogLevel.INFO;
  logger[level === LogLevel.WARN ? 'warn' : 'info'](
    `Performance: ${name} took ${duration}ms`,
    { ...context, duration }
  );
};

// API call logging helper
export const logApiCall = (
  method: string,
  url: string,
  status: number,
  duration: number,
  error?: Error
): void => {
  const level = status >= 400 ? LogLevel.ERROR : duration > 2000 ? LogLevel.WARN : LogLevel.INFO;
  const message = `API ${method} ${url} - ${status} (${duration}ms)`;
  
  if (error) {
    logger.error(message, { method, url, status, duration }, error);
  } else {
    logger[level === LogLevel.ERROR ? 'error' : level === LogLevel.WARN ? 'warn' : 'info'](
      message,
      { method, url, status, duration }
    );
  }
};

