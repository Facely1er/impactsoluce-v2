/**
 * Build information and version management
 */

export const BUILD_INFO = {
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  buildDate: import.meta.env.VITE_BUILD_DATE || new Date().toISOString(),
  gitCommit: import.meta.env.VITE_GIT_COMMIT || 'unknown',
  environment: import.meta.env.VITE_APP_ENV || 'development'
};

// Log build information in development
export const logBuildInfo = (): void => {
  if (import.meta.env.DEV) {
    console.log('🚀 ImpactSoluce™ Build Info:', BUILD_INFO);
  }
};

// Check if app version has been updated
export const checkAppVersion = (): boolean => {
  const storedVersion = localStorage.getItem('app_version');
  const currentVersion = BUILD_INFO.version;
  
  if (storedVersion && storedVersion !== currentVersion) {
    localStorage.setItem('app_version', currentVersion);
    return true; // Version updated
  }
  
  if (!storedVersion) {
    localStorage.setItem('app_version', currentVersion);
  }
  
  return false;
};

// Display version info in footer or admin panel
export const getVersionInfo = (): string => {
  return `v${BUILD_INFO.version} (${BUILD_INFO.environment})`;
};