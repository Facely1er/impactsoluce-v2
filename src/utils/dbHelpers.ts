import { supabase } from '../lib/supabase';
import { logError } from './errorHandler';

/**
 * Database utility functions for common operations
 */

// Check if a table exists
export const tableExists = async (tableName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', tableName)
      .single();
    
    if (error) throw error;
    return !!data;
  } catch (error) {
    logError(error, 'tableExists');
    return false;
  }
};

// Check if a column exists in a table
export const columnExists = async (tableName: string, columnName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_schema', 'public')
      .eq('table_name', tableName)
      .eq('column_name', columnName)
      .single();
    
    if (error) throw error;
    return !!data;
  } catch (error) {
    logError(error, 'columnExists');
    return false;
  }
};

// Get the count of rows in a table
export const getTableCount = async (tableName: string, condition?: Record<string, any>): Promise<number> => {
  try {
    let query = supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    
    if (condition) {
      Object.entries(condition).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }
    
    const { count, error } = await query;
    
    if (error) throw error;
    return count || 0;
  } catch (error) {
    logError(error, 'getTableCount');
    return 0;
  }
};

// Check database health
export const checkDatabaseHealth = async (): Promise<{
  healthy: boolean;
  tables: Record<string, number>;
  message?: string;
}> => {
  try {
    // Check if we can connect to the database
    const { error: connectionError } = await supabase
      .from('assessments')
      .select('id', { count: 'exact', head: true });
    
    if (connectionError) {
      return {
        healthy: false,
        tables: {},
        message: `Database connection error: ${connectionError.message}`
      };
    }
    
    // Get counts for main tables
    const [assessmentsCount, responsesCount] = await Promise.all([
      getTableCount('assessments'),
      getTableCount('assessment_responses')
    ]);
    
    return {
      healthy: true,
      tables: {
        assessments: assessmentsCount,
        assessment_responses: responsesCount
      }
    };
  } catch (error) {
    logError(error, 'checkDatabaseHealth');
    return {
      healthy: false,
      tables: {},
      message: error instanceof Error ? error.message : 'Unknown database error'
    };
  }
};

// Clean up orphaned responses (responses without a valid assessment)
export const cleanupOrphanedResponses = async (): Promise<{
  success: boolean;
  deleted: number;
  message?: string;
}> => {
  try {
    // Find responses without a valid assessment
    const { data: orphanedResponses, error: findError } = await supabase
      .from('assessment_responses')
      .select('id, assessment_id')
      .is('assessment_id', null);
    
    if (findError) throw findError;
    
    if (!orphanedResponses?.length) {
      return {
        success: true,
        deleted: 0,
        message: 'No orphaned responses found'
      };
    }
    
    // Delete orphaned responses
    const orphanedIds = orphanedResponses.map(r => r.id);
    const { error: deleteError } = await supabase
      .from('assessment_responses')
      .delete()
      .in('id', orphanedIds);
    
    if (deleteError) throw deleteError;
    
    return {
      success: true,
      deleted: orphanedIds.length,
      message: `Deleted ${orphanedIds.length} orphaned responses`
    };
  } catch (error) {
    logError(error, 'cleanupOrphanedResponses');
    return {
      success: false,
      deleted: 0,
      message: error instanceof Error ? error.message : 'Unknown error during cleanup'
    };
  }
};