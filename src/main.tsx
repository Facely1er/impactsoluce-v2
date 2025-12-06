import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { validateConfig } from './lib/config';
import { applySecurityHeaders } from './utils/securityHeaders';
import { initCsp } from './utils/contentSecurityPolicy';
import { initPerformanceMonitoring } from './utils/performance';
import { setupGlobalErrorReporting } from './utils/errorReporting';
import { registerServiceWorker } from './utils/serviceWorker';
import { logBuildInfo, checkAppVersion } from './utils/buildInfo';
import { initCriticalPathOptimizations } from './utils/criticalPathOptimization';
import { displayProductionChecks } from './utils/productionChecks';
import { initAccessibility } from './utils/accessibility';

// Register Chart.js components
// This ensures they're available throughout the app
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

// Validate environment configuration
// Initialize critical path optimizations early
initCriticalPathOptimizations();

// Initialize accessibility features
initAccessibility();

const { valid, errors } = validateConfig();

// Apply security headers in production
if (import.meta.env.PROD) {
  applySecurityHeaders();
  initCsp();
  initPerformanceMonitoring();
  setupGlobalErrorReporting();
  registerServiceWorker();
}

// Log build info and check for updates
logBuildInfo();
if (checkAppVersion()) {
  console.log('📦 App version updated. Cache may have been cleared.');
}

// Run production readiness checks in development
if (import.meta.env.DEV) {
  displayProductionChecks();
}

if (!valid) {
  console.error('Application configuration error:', errors);
  
  // Create error element to display in the DOM
  const errorElement = document.createElement('div');
  errorElement.style.padding = '20px';
  errorElement.style.margin = '20px';
  errorElement.style.backgroundColor = '#FEE2E2';
  errorElement.style.border = '1px solid #EF4444';
  errorElement.style.borderRadius = '8px';
  errorElement.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  
  errorElement.innerHTML = `
    <h1 style="color: #B91C1C; font-size: 24px; margin-bottom: 16px;">Configuration Error</h1>
    <p style="margin-bottom: 16px;">The application is missing required environment variables:</p>
    <ul style="margin-bottom: 16px; padding-left: 20px;">
      ${errors.map(error => `<li style="margin-bottom: 8px;">${error}</li>`).join('')}
    </ul>
    <p>Please check your .env file and ensure all required variables are set.</p>
  `;
  
  document.body.appendChild(errorElement);
} else {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}