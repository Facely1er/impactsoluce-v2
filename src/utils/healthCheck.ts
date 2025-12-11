/**
 * Health check and status monitoring utilities
 */

import { HAS_DATABASE, SUPABASE_URL } from '../lib/config';

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  checks: {
    database?: {
      status: 'ok' | 'error';
      responseTime?: number;
      error?: string;
    };
    storage?: {
      status: 'ok' | 'error';
      available: boolean;
      quota?: number;
      usage?: number;
    };
    api?: {
      status: 'ok' | 'error';
      responseTime?: number;
      error?: string;
    };
  };
  version: string;
  environment: string;
}

// Check localStorage availability and quota
const checkStorage = (): HealthStatus['checks']['storage'] => {
  try {
    const testKey = '__health_check__';
    const testValue = 'test';
    
    localStorage.setItem(testKey, testValue);
    const retrieved = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    
    if (retrieved !== testValue) {
      return {
        status: 'error',
        available: false
      };
    }

    // Estimate storage usage
    let usage = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          usage += key.length + value.length;
        }
      }
    }

    // Estimate quota (typically 5-10MB)
    const quota = 5 * 1024 * 1024; // 5MB estimate

    return {
      status: 'ok',
      available: true,
      quota,
      usage
    };
  } catch (error) {
    return {
      status: 'error',
      available: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Check database connectivity
const checkDatabase = async (): Promise<HealthStatus['checks']['database']> => {
  if (!HAS_DATABASE) {
    return {
      status: 'ok',
      error: 'Database not configured (running in standalone mode)'
    };
  }

  try {
    const startTime = performance.now();
    
    // Try to import supabase client dynamically
    const { getSupabaseClient } = await import('../lib/supabase');
    const supabase = getSupabaseClient();
    
    // Simple query to check connectivity
    const { error } = await supabase.from('_health_check').select('count').limit(1);
    const responseTime = Math.round(performance.now() - startTime);

    if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist (which is ok for health check)
      return {
        status: 'error',
        responseTime,
        error: error.message
      };
    }

    return {
      status: 'ok',
      responseTime
    };
  } catch (error) {
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Check API connectivity
const checkAPI = async (): Promise<HealthStatus['checks']['api']> => {
  try {
    const startTime = performance.now();
    
    // Check if we can reach the Supabase URL (if configured)
    if (SUPABASE_URL) {
      const response = await fetch(SUPABASE_URL, {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      
      const responseTime = Math.round(performance.now() - startTime);
      
      if (!response.ok) {
        return {
          status: 'error',
          responseTime,
          error: `HTTP ${response.status}`
        };
      }

      return {
        status: 'ok',
        responseTime
      };
    }

    // No API configured (standalone mode)
    return {
      status: 'ok',
      error: 'API not configured (running in standalone mode)'
    };
  } catch (error) {
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Perform comprehensive health check
export const performHealthCheck = async (): Promise<HealthStatus> => {
  const checks: HealthStatus['checks'] = {
    storage: checkStorage(),
    database: await checkDatabase(),
    api: await checkAPI()
  };

  // Determine overall status
  let status: HealthStatus['status'] = 'healthy';
  
  const hasErrors = Object.values(checks).some(
    check => check && check.status === 'error'
  );
  
  const hasWarnings = Object.values(checks).some(
    check => check && check.status === 'ok' && check.error
  );

  if (hasErrors) {
    status = 'unhealthy';
  } else if (hasWarnings) {
    status = 'degraded';
  }

  return {
    status,
    timestamp: new Date().toISOString(),
    checks,
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.VITE_APP_ENV || 'development'
  };
};

// Get health status summary
export const getHealthStatus = async (): Promise<{
  healthy: boolean;
  message: string;
  details: HealthStatus;
}> => {
  const health = await performHealthCheck();
  
  return {
    healthy: health.status === 'healthy',
    message: health.status === 'healthy' 
      ? 'All systems operational'
      : health.status === 'degraded'
      ? 'Some systems degraded but functional'
      : 'Some systems are experiencing issues',
    details: health
  };
};

