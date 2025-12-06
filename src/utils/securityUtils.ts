/**
 * Security utility functions
 */

// Sanitize user input to prevent XSS
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// Validate password strength
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} => {
  const minLength = 8;
  const feedback: string[] = [];
  let score = 0;
  
  // Check minimum length
  if (password.length < minLength) {
    feedback.push(`Password must be at least ${minLength} characters long`);
  } else {
    score += 1;
  }
  
  // Check for uppercase letters
  if (!/[A-Z]/.test(password)) {
    feedback.push('Password should include at least one uppercase letter');
  } else {
    score += 1;
  }
  
  // Check for lowercase letters
  if (!/[a-z]/.test(password)) {
    feedback.push('Password should include at least one lowercase letter');
  } else {
    score += 1;
  }
  
  // Check for numbers
  if (!/\d/.test(password)) {
    feedback.push('Password should include at least one number');
  } else {
    score += 1;
  }
  
  // Check for special characters
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    feedback.push('Password should include at least one special character');
  } else {
    score += 1;
  }
  
  return {
    isValid: feedback.length === 0,
    score,
    feedback,
  };
};

// Generate a secure random string
export const generateRandomString = (length = 16): string => {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Create a secure nonce for CSP
export const createNonce = (): string => {
  return generateRandomString(16);
};

// Validate URL
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

// Encode state for OAuth to prevent CSRF
export const encodeOAuthState = (redirectUrl: string): string => {
  const state = {
    redirectUrl,
    nonce: generateRandomString(16),
    timestamp: Date.now(),
  };
  
  return btoa(JSON.stringify(state));
};

// Decode and validate OAuth state
export const decodeOAuthState = (encodedState: string): { redirectUrl: string; isValid: boolean } => {
  try {
    const state = JSON.parse(atob(encodedState));
    
    // Check if state has expired (10 minutes)
    const isExpired = Date.now() - state.timestamp > 10 * 60 * 1000;
    
    return {
      redirectUrl: state.redirectUrl || '/',
      isValid: !isExpired,
    };
  } catch (error) {
    return {
      redirectUrl: '/',
      isValid: false,
    };
  }
};

// Safely parse JSON
export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    return fallback;
  }
};

// Validate file extension against MIME type
export const validateFileExtensionMimeType = (fileName: string, mimeType: string): boolean => {
  const extensionMimeMap: Record<string, string[]> = {
    '.pdf': ['application/pdf'],
    '.doc': ['application/msword'],
    '.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    '.xls': ['application/vnd.ms-excel'],
    '.xlsx': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    '.jpg': ['image/jpeg'],
    '.jpeg': ['image/jpeg'],
    '.png': ['image/png'],
    '.gif': ['image/gif'],
    '.webp': ['image/webp'],
    '.txt': ['text/plain'],
    '.csv': ['text/csv', 'application/csv']
  };

  const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
  const allowedMimeTypes = extensionMimeMap[extension];
  
  return allowedMimeTypes ? allowedMimeTypes.includes(mimeType) : false;
};