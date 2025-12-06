/**
 * Advanced error recovery mechanisms
 */

import { supabase } from '../lib/supabase';
import { logError } from './errorHandler';

// Auto-recovery strategies
export enum RecoveryStrategy {
  RETRY = 'retry',
  FALLBACK = 'fallback',
  CACHE = 'cache',
  OFFLINE = 'offline',
  REFRESH = 'refresh'
}

export interface RecoveryAction {
  strategy: RecoveryStrategy;
  action: () => Promise<any>;
  description: string;
  priority: number;
}

// Error classification for recovery decisions
export const classifyError = (error: unknown): {
  type: 'network' | 'auth' | 'data' | 'unknown';
  recoverable: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
} => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    // Network errors
    if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
      return { type: 'network', recoverable: true, severity: 'medium' };
    }
    
    // Authentication errors
    if (message.includes('auth') || message.includes('unauthorized') || message.includes('token')) {
      return { type: 'auth', recoverable: true, severity: 'high' };
    }
    
    // Data/validation errors
    if (message.includes('validation') || message.includes('required') || message.includes('invalid')) {
      return { type: 'data', recoverable: false, severity: 'low' };
    }
  }
  
  return { type: 'unknown', recoverable: false, severity: 'critical' };
};

// Generate recovery actions based on error type
export const generateRecoveryActions = (
  error: unknown,
  context?: Record<string, any>
): RecoveryAction[] => {
  const classification = classifyError(error);
  const actions: RecoveryAction[] = [];

  switch (classification.type) {
    case 'network':
      actions.push({
        strategy: RecoveryStrategy.RETRY,
        action: async () => {
          // Retry the original operation after a delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          return context?.retryFunction?.();
        },
        description: 'Retry the operation',
        priority: 1
      });
      
      actions.push({
        strategy: RecoveryStrategy.CACHE,
        action: async () => {
          // Try to load from cache
          return context?.cacheFunction?.();
        },
        description: 'Load from cache',
        priority: 2
      });
      
      actions.push({
        strategy: RecoveryStrategy.OFFLINE,
        action: async () => {
          // Switch to offline mode
          return { offline: true };
        },
        description: 'Continue in offline mode',
        priority: 3
      });
      break;

    case 'auth':
      actions.push({
        strategy: RecoveryStrategy.REFRESH,
        action: async () => {
          // Try to refresh the session
          const { error } = await supabase.auth.refreshSession();
          if (error) throw error;
          return context?.retryFunction?.();
        },
        description: 'Refresh authentication',
        priority: 1
      });
      
      actions.push({
        strategy: RecoveryStrategy.FALLBACK,
        action: async () => {
          // Redirect to login
          window.location.href = '/login';
        },
        description: 'Redirect to login',
        priority: 2
      });
      break;

    case 'data':
      actions.push({
        strategy: RecoveryStrategy.FALLBACK,
        action: async () => {
          // Use default/fallback data
          return context?.fallbackData || {};
        },
        description: 'Use fallback data',
        priority: 1
      });
      break;

    default:
      actions.push({
        strategy: RecoveryStrategy.REFRESH,
        action: async () => {
          // Full page refresh as last resort
          window.location.reload();
        },
        description: 'Refresh the page',
        priority: 1
      });
  }

  return actions.sort((a, b) => a.priority - b.priority);
};

// Execute recovery actions
export const executeRecovery = async (
  error: unknown,
  context?: Record<string, any>
): Promise<{
  recovered: boolean;
  strategy?: RecoveryStrategy;
  result?: any;
}> => {
  const actions = generateRecoveryActions(error, context);
  
  for (const action of actions) {
    try {
      console.log(`Attempting recovery: ${action.description}`);
      const result = await action.action();
      
      return {
        recovered: true,
        strategy: action.strategy,
        result
      };
    } catch (recoveryError) {
      logError(recoveryError, {
        context: 'error_recovery',
        originalError: error instanceof Error ? error.message : String(error),
        recoveryStrategy: action.strategy
      });
    }
  }
  
  return { recovered: false };
};

// Smart error boundary with recovery
export class SmartErrorRecovery {
  private errorCount = 0;
  private lastError: string | null = null;
  private recoveryAttempts = 0;
  private maxRecoveryAttempts = 3;

  shouldAttemptRecovery(error: unknown): boolean {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Don't attempt recovery if we've tried too many times
    if (this.recoveryAttempts >= this.maxRecoveryAttempts) {
      return false;
    }
    
    // Don't attempt recovery for the same error repeatedly
    if (this.lastError === errorMessage) {
      this.errorCount++;
      if (this.errorCount > 2) {
        return false;
      }
    } else {
      this.errorCount = 1;
      this.lastError = errorMessage;
    }
    
    const classification = classifyError(error);
    return classification.recoverable && classification.severity !== 'critical';
  }

  async attemptRecovery(error: unknown, context?: Record<string, any>): Promise<boolean> {
    if (!this.shouldAttemptRecovery(error)) {
      return false;
    }

    this.recoveryAttempts++;
    
    const { recovered } = await executeRecovery(error, context);
    
    if (recovered) {
      // Reset counters on successful recovery
      this.errorCount = 0;
      this.recoveryAttempts = 0;
      this.lastError = null;
    }
    
    return recovered;
  }

  reset(): void {
    this.errorCount = 0;
    this.recoveryAttempts = 0;
    this.lastError = null;
  }
}

export const smartErrorRecovery = new SmartErrorRecovery();