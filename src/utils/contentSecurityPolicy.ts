/**
 * Content Security Policy utilities
 */

// Define CSP directives
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", 'https://storage.googleapis.com'],
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  'img-src': ["'self'", 'data:', 'https://images.pexels.com', 'https://storage.googleapis.com'],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'connect-src': ["'self'", 'https://*.supabase.co'],
  'frame-src': ["'none'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': [],
};

// Generate CSP header value
export const generateCspHeaderValue = (
  directives = CSP_DIRECTIVES,
  reportOnly = false
): string => {
  return Object.entries(directives)
    .map(([directive, sources]) => {
      if (sources.length === 0) {
        return directive;
      }
      return `${directive} ${sources.join(' ')}`;
    })
    .join('; ');
};

// Add CSP meta tag to document head
export const addCspMetaTag = (
  directives = CSP_DIRECTIVES,
  reportOnly = false
): void => {
  const cspContent = generateCspHeaderValue(directives, reportOnly);
  
  // Remove existing CSP meta tag if it exists
  const existingCspTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (existingCspTag) {
    existingCspTag.remove();
  }
  
  // Create and add new CSP meta tag
  const metaTag = document.createElement('meta');
  metaTag.httpEquiv = reportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy';
  metaTag.content = cspContent;
  document.head.appendChild(metaTag);
};

// Initialize CSP
export const initCsp = (reportOnly = false): void => {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    addCspMetaTag(CSP_DIRECTIVES, reportOnly);
  }
};