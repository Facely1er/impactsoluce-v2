/**
 * XSS protection utilities
 */

// Sanitize HTML string
export const sanitizeHtml = (html: string): string => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

// Sanitize object properties recursively
export const sanitizeObject = <T extends Record<string, any>>(obj: T): T => {
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = sanitizeHtml(value);
    } else if (typeof value === 'object' && value !== null) {
      result[key] = sanitizeObject(value);
    } else {
      result[key] = value;
    }
  }
  
  return result as T;
};

// Create a safe HTML element
export const createSafeHtml = (
  tag: string,
  attributes: Record<string, string> = {},
  content: string = ''
): HTMLElement => {
  // Whitelist of allowed tags
  const allowedTags = [
    'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'a', 'strong', 'em', 'code', 'pre',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
  ];
  
  // Whitelist of allowed attributes
  const allowedAttributes = [
    'id', 'class', 'style', 'href', 'target', 'rel',
    'title', 'alt', 'width', 'height', 'src',
  ];
  
  // Check if tag is allowed
  if (!allowedTags.includes(tag)) {
    throw new Error(`Tag not allowed: ${tag}`);
  }
  
  // Create element
  const element = document.createElement(tag);
  
  // Add sanitized attributes
  for (const [key, value] of Object.entries(attributes)) {
    if (allowedAttributes.includes(key)) {
      element.setAttribute(key, sanitizeHtml(value));
    }
  }
  
  // Add sanitized content
  if (content) {
    element.textContent = content;
  }
  
  return element;
};

// Safely render HTML string
export const renderSafeHtml = (html: string): DocumentFragment => {
  // Create a template element
  const template = document.createElement('template');
  
  // Set sanitized HTML
  template.innerHTML = sanitizeHtml(html);
  
  // Return document fragment
  return template.content;
};

// Validate and sanitize URL
export const sanitizeUrl = (url: string): string => {
  // Check if URL is valid
  try {
    const parsedUrl = new URL(url);
    
    // Only allow http and https protocols
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return '';
    }
    
    return url;
  } catch (error) {
    // Invalid URL
    return '';
  }
};