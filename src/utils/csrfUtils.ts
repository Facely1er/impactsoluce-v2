/**
 * CSRF protection utilities
 */

// Generate a CSRF token
export const generateCsrfToken = (): string => {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Store CSRF token in localStorage
export const storeCsrfToken = (token: string): void => {
  localStorage.setItem('csrf_token', token);
};

// Get stored CSRF token
export const getCsrfToken = (): string | null => {
  return localStorage.getItem('csrf_token');
};

// Validate CSRF token
export const validateCsrfToken = (token: string): boolean => {
  const storedToken = getCsrfToken();
  return storedToken === token;
};

// Add CSRF token to request headers
export const addCsrfHeader = (headers: Record<string, string>): Record<string, string> => {
  const token = getCsrfToken();
  if (token) {
    return {
      ...headers,
      'X-CSRF-Token': token,
    };
  }
  return headers;
};

// Initialize CSRF protection
export const initCsrfProtection = (): void => {
  // Generate and store a new token if one doesn't exist
  if (!getCsrfToken()) {
    const token = generateCsrfToken();
    storeCsrfToken(token);
  }
};

// Refresh CSRF token
export const refreshCsrfToken = (): string => {
  const token = generateCsrfToken();
  storeCsrfToken(token);
  return token;
};

// Create a fetch wrapper with CSRF protection
export const fetchWithCsrf = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  // Initialize CSRF protection if not already done
  initCsrfProtection();
  
  // Add CSRF token to headers
  const headers = addCsrfHeader({
    ...(options.headers as Record<string, string> || {}),
  });
  
  // Make the request
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  // Check if we need to refresh the token
  const newToken = response.headers.get('X-CSRF-Token');
  if (newToken) {
    storeCsrfToken(newToken);
  }
  
  return response;
};