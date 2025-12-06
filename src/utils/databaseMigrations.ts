/**
 * Database migration utilities for production
 */

import { supabase } from '../lib/supabase';
import { logError } from './errorHandler';

export interface Migration {
  id: string;
  name: string;
  version: string;
  sql: string;
  rollback?: string;
  dependencies?: string[];
}

export interface MigrationResult {
  success: boolean;
  migrationsRun: string[];
  errors: string[];
  duration: number;
}

// Check if migrations table exists
const ensureMigrationsTable = async (): Promise<void> => {
  const { error } = await supabase.rpc('create_migrations_table_if_not_exists');
  if (error) {
    console.warn('Could not create migrations table:', error);
  }
};

// Get applied migrations
export const getAppliedMigrations = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('schema_migrations')
      .select('version')
      .order('version');
    
    if (error) {
      console.warn('Could not fetch migrations:', error);
      return [];
    }
    
    return data?.map(m => m.version) || [];
  } catch (error) {
    logError(error, 'getAppliedMigrations');
    return [];
  }
};

// Run pending migrations
export const runMigrations = async (migrations: Migration[]): Promise<MigrationResult> => {
  const startTime = performance.now();
  const result: MigrationResult = {
    success: true,
    migrationsRun: [],
    errors: [],
    duration: 0
  };

  try {
    await ensureMigrationsTable();
    const appliedMigrations = await getAppliedMigrations();
    
    // Filter pending migrations
    const pendingMigrations = migrations.filter(
      migration => !appliedMigrations.includes(migration.version)
    );

    if (pendingMigrations.length === 0) {
      result.duration = performance.now() - startTime;
      return result;
    }

    // Sort by dependencies and version
    const sortedMigrations = sortMigrationsByDependencies(pendingMigrations);

    for (const migration of sortedMigrations) {
      try {
        // Execute migration SQL
        const { error: sqlError } = await supabase.rpc('execute_migration', {
          migration_sql: migration.sql
        });

        if (sqlError) throw sqlError;

        // Record migration as applied
        const { error: recordError } = await supabase
          .from('schema_migrations')
          .insert({
            version: migration.version,
            name: migration.name,
            applied_at: new Date().toISOString()
          });

        if (recordError) throw recordError;

        result.migrationsRun.push(migration.version);
        console.log(`✅ Migration ${migration.version} applied successfully`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        result.errors.push(`Migration ${migration.version}: ${errorMessage}`);
        result.success = false;
        
        logError(error, {
          context: 'migration',
          migrationId: migration.id,
          migrationVersion: migration.version
        });
        
        // Stop on first error to prevent cascade failures
        break;
      }
    }
  } catch (error) {
    result.success = false;
    result.errors.push(error instanceof Error ? error.message : 'Migration system error');
    logError(error, 'runMigrations');
  }

  result.duration = performance.now() - startTime;
  return result;
};

// Sort migrations by dependencies
const sortMigrationsByDependencies = (migrations: Migration[]): Migration[] => {
  const sorted: Migration[] = [];
  const remaining = [...migrations];
  
  while (remaining.length > 0) {
    const readyMigrations = remaining.filter(migration => {
      if (!migration.dependencies?.length) return true;
      
      return migration.dependencies.every(dep => 
        sorted.some(s => s.version === dep) ||
        migrations.some(m => m.version === dep && sorted.includes(m))
      );
    });

    if (readyMigrations.length === 0) {
      // Circular dependency or missing dependency
      console.error('Circular dependency or missing dependency in migrations');
      break;
    }

    // Add ready migrations to sorted list
    readyMigrations.forEach(migration => {
      sorted.push(migration);
      const index = remaining.indexOf(migration);
      remaining.splice(index, 1);
    });
  }

  // Sort by version as secondary sort
  return sorted.sort((a, b) => a.version.localeCompare(b.version));
};

// Validate database schema
export const validateDatabaseSchema = async (): Promise<{
  valid: boolean;
  issues: string[];
}> => {
  const issues: string[] = [];

  try {
    // Check required tables exist
    const requiredTables = ['profiles', 'assessments', 'assessment_responses'];
    
    for (const table of requiredTables) {
      const { error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        issues.push(`Table ${table} is missing or inaccessible: ${error.message}`);
      }
    }

    // Check RLS is enabled
    for (const table of requiredTables) {
      const { data, error } = await supabase.rpc('check_rls_enabled', { table_name: table });
      
      if (error) {
        console.warn(`Could not check RLS for ${table}:`, error);
      } else if (!data) {
        issues.push(`Row Level Security is not enabled for table: ${table}`);
      }
    }

  } catch (error) {
    issues.push(`Database validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return {
    valid: issues.length === 0,
    issues
  };
};