/**
 * Application configuration
 * 
 * This file centralizes all configuration variables and provides
 * fallbacks for missing environment variables.
 */

// Supabase configuration
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Application configuration
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'ImpactSoluce™ by ERMITS';
export const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:5173';
export const APP_ENV = import.meta.env.VITE_APP_ENV || 'development';

// Feature flags
export const ENABLE_DEMO_MODE = import.meta.env.VITE_ENABLE_DEMO_MODE === 'true';
export const ENABLE_ANALYTICS = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';

// Validate required environment variables
export const validateConfig = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!SUPABASE_URL) {
    errors.push('VITE_SUPABASE_URL is not defined');
  }

  if (!SUPABASE_ANON_KEY) {
    errors.push('VITE_SUPABASE_ANON_KEY is not defined');
  }

  // Additional production validations
  if (APP_ENV === 'production') {
    if (SUPABASE_URL && SUPABASE_URL.includes('localhost')) {
      errors.push('Production environment cannot use localhost Supabase URL');
    }
    
    if (!SUPABASE_URL.startsWith('https://')) {
      errors.push('Production Supabase URL must use HTTPS');
    }
  }

  return {
    valid: errors.length === 0,
    errors
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