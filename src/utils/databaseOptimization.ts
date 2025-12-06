/**
 * Database optimization utilities
 */

import { supabase } from '../lib/supabase';
import { logError } from './errorHandler';

export interface QueryPerformance {
  query: string;
  duration: number;
  rowsAffected?: number;
  cached?: boolean;
}

// Enhanced query builder with performance monitoring
export class OptimizedQueryBuilder {
  private table: string;
  private query: any;
  private startTime: number = 0;

  constructor(table: string) {
    this.table = table;
    this.query = supabase.from(table);
  }

  select(columns?: string) {
    this.query = this.query.select(columns);
    return this;
  }

  eq(column: string, value: any) {
    this.query = this.query.eq(column, value);
    return this;
  }

  filter(column: string, operator: string, value: any) {
    this.query = this.query.filter(column, operator, value);
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.query = this.query.order(column, options);
    return this;
  }

  limit(count: number) {
    this.query = this.query.limit(count);
    return this;
  }

  range(from: number, to: number) {
    this.query = this.query.range(from, to);
    return this;
  }

  // Execute query with performance monitoring
  async execute<T>(): Promise<{
    data: T[] | null;
    error: any;
    performance: QueryPerformance;
  }> {
    this.startTime = performance.now();
    
    try {
      const result = await this.query;
      const duration = performance.now() - this.startTime;
      
      const performance: QueryPerformance = {
        query: this.table,
        duration,
        rowsAffected: result.data?.length,
        cached: false
      };

      // Log slow queries
      if (duration > 1000) {
        console.warn(`Slow query detected: ${this.table} took ${duration.toFixed(2)}ms`);
        logError(new Error('Slow query'), {
          table: this.table,
          duration,
          rowsAffected: result.data?.length
        });
      }

      return {
        data: result.data,
        error: result.error,
        performance
      };
    } catch (error) {
      const duration = performance.now() - this.startTime;
      
      logError(error, {
        table: this.table,
        duration,
        context: 'query_execution'
      });

      return {
        data: null,
        error,
        performance: {
          query: this.table,
          duration,
          cached: false
        }
      };
    }
  }

  // Execute single record query
  async single<T>(): Promise<{
    data: T | null;
    error: any;
    performance: QueryPerformance;
  }> {
    this.query = this.query.single();
    const result = await this.execute<T>();
    
    return {
      data: result.data?.[0] || null,
      error: result.error,
      performance: result.performance
    };
  }
}

// Create optimized query builder
export const createOptimizedQuery = (table: string) => {
  return new OptimizedQueryBuilder(table);
};

// Database connection pooling helper
export const checkDatabaseConnection = async (): Promise<{
  connected: boolean;
  responseTime: number;
  error?: string;
}> => {
  const startTime = performance.now();
  
  try {
    const { error } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .limit(1);
    
    const responseTime = performance.now() - startTime;
    
    if (error) {
      return {
        connected: false,
        responseTime,
        error: error.message
      };
    }
    
    return {
      connected: true,
      responseTime
    };
  } catch (error) {
    const responseTime = performance.now() - startTime;
    
    return {
      connected: false,
      responseTime,
      error: error instanceof Error ? error.message : 'Unknown connection error'
    };
  }
};

// Batch operations for better performance
export const batchInsert = async <T>(
  table: string,
  records: T[],
  batchSize = 100
): Promise<{
  success: boolean;
  inserted: number;
  errors: string[];
}> => {
  const result = {
    success: true,
    inserted: 0,
    errors: [] as string[]
  };

  // Split records into batches
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    
    try {
      const { data, error } = await supabase
        .from(table)
        .insert(batch)
        .select();
      
      if (error) {
        result.success = false;
        result.errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error.message}`);
      } else {
        result.inserted += data?.length || 0;
      }
    } catch (error) {
      result.success = false;
      result.errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return result;
};

// Query optimization recommendations
export const analyzeQueryPerformance = (performances: QueryPerformance[]): {
  recommendations: string[];
  slowQueries: QueryPerformance[];
  averageDuration: number;
} => {
  const recommendations: string[] = [];
  const slowQueries = performances.filter(p => p.duration > 1000);
  const averageDuration = performances.reduce((sum, p) => sum + p.duration, 0) / performances.length;

  if (slowQueries.length > 0) {
    recommendations.push('Consider adding database indexes for slow queries');
    recommendations.push('Review query complexity and optimize WHERE clauses');
  }

  if (averageDuration > 500) {
    recommendations.push('Overall query performance is below optimal');
    recommendations.push('Consider implementing query caching');
  }

  const largeResultSets = performances.filter(p => p.rowsAffected && p.rowsAffected > 1000);
  if (largeResultSets.length > 0) {
    recommendations.push('Implement pagination for large result sets');
    recommendations.push('Consider using server-side filtering');
  }

  return {
    recommendations,
    slowQueries,
    averageDuration
  };
};