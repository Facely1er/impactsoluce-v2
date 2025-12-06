import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface HealthStatus {
  database: 'healthy' | 'unhealthy' | 'checking';
  auth: 'healthy' | 'unhealthy' | 'checking';
  storage: 'healthy' | 'unhealthy' | 'checking';
  overall: 'healthy' | 'unhealthy' | 'checking';
  lastChecked: Date | null;
}

export const useHealthCheck = () => {
  const [health, setHealth] = useState<HealthStatus>({
    database: 'checking',
    auth: 'checking',
    storage: 'checking',
    overall: 'checking',
    lastChecked: null
  });

  const checkHealth = async () => {
    const results = {
      database: 'healthy' as const,
      auth: 'healthy' as const,
      storage: 'healthy' as const
    };

    try {
      // Check database connectivity
      const { error: dbError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });
      
      if (dbError) {
        results.database = 'unhealthy';
        console.error('Database health check failed:', dbError);
      }
    } catch (error) {
      results.database = 'unhealthy';
      console.error('Database health check error:', error);
    }

    try {
      // Check auth service
      await supabase.auth.getSession();
    } catch (error) {
      results.auth = 'unhealthy';
      console.error('Auth health check failed:', error);
    }

    try {
      // Check storage (list buckets)
      const { error: storageError } = await supabase.storage.listBuckets();
      if (storageError) {
        results.storage = 'unhealthy';
        console.error('Storage health check failed:', storageError);
      }
    } catch (error) {
      results.storage = 'unhealthy';
      console.error('Storage health check error:', error);
    }

    const overall = Object.values(results).every(status => status === 'healthy') 
      ? 'healthy' as const 
      : 'unhealthy' as const;

    setHealth({
      ...results,
      overall,
      lastChecked: new Date()
    });
  };

  useEffect(() => {
    // Initial health check
    checkHealth();

    // Periodic health checks every 5 minutes
    const interval = setInterval(checkHealth, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    health,
    checkHealth
  };
};