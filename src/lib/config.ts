/**
 * Application configuration
 *
 * This file centralizes all configuration variables and provides
 * fallbacks for missing environment variables.
 *
 * The application works in standalone mode by default with no database required.
 * Supabase configuration is optional and only needed for backend persistence.
 */

// Supabase configuration (optional - app works without it)
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Application configuration
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'ImpactSoluce™ - ESG Risk Intelligence by ERMITS';
export const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:5173';
export const APP_ENV = import.meta.env.VITE_APP_ENV || 'development';

// Feature flags
export const ENABLE_DEMO_MODE = import.meta.env.VITE_ENABLE_DEMO_MODE !== 'false'; // Default to true
export const ENABLE_ANALYTICS = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';

// Check if database is configured
export const HAS_DATABASE = !!(SUPABASE_URL && SUPABASE_ANON_KEY);

// Validate configuration (no longer requires database)
export const validateConfig = (): { valid: boolean; errors: string[]; warnings: string[] } => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Database is optional
  if (!HAS_DATABASE) {
    warnings.push('Running in standalone mode without database. Data will be stored locally.');
  }

  // Additional validations only if database is configured
  if (HAS_DATABASE) {
    if (APP_ENV === 'production' && SUPABASE_URL.includes('localhost')) {
      errors.push('Production environment cannot use localhost Supabase URL');
    }

    if (SUPABASE_URL && !SUPABASE_URL.startsWith('https://')) {
      warnings.push('Supabase URL should use HTTPS for security');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

// Constants
export const FILE_UPLOAD = {
  MAX_SIZE_MB: 50,
  ALLOWED_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'text/plain',
    'text/csv'
  ],
  ALLOWED_EXTENSIONS: [
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', 
    '.jpg', '.jpeg', '.png', '.gif', '.webp', 
    '.txt', '.csv'
  ]
};