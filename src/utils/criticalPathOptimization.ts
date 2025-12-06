/**
 * Critical path optimization for faster loading
 */

// Inline critical CSS for above-the-fold content
export const inlineCriticalCSS = (): void => {
  const criticalCSS = `
    /* Critical CSS for above-the-fold content */
    body { margin: 0; font-family: Inter, system-ui, sans-serif; }
    .loading-screen { 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      min-height: 100vh; 
      background: #f9fafb; 
    }
    .dark .loading-screen { background: #111827; }
    .animate-spin { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  `;

  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = criticalCSS;
  document.head.appendChild(style);
};

// Preconnect to external domains
export const preconnectToDomains = (): void => {
  const domains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://images.pexels.com'
  ];

  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Resource hints for better loading
export const addResourceHints = (): void => {
  // DNS prefetch for external domains
  const dnsPrefetchDomains = [
    '//images.pexels.com',
    '//fonts.googleapis.com',
    '//fonts.gstatic.com'
  ];

  dnsPrefetchDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });
};

// Initialize critical path optimizations
export const initCriticalPathOptimizations = (): void => {
  if (import.meta.env.PROD) {
    inlineCriticalCSS();
    preconnectToDomains();
    addResourceHints();
  }
};