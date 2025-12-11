import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { validateConfig } from './lib/config';
import { initMonitoring } from './lib/monitoring';
import { initPerformanceMonitoring } from './utils/performance';
import { setupGlobalErrorReporting } from './utils/errorReporting';
import { trackPageView } from './utils/analytics';
import { logger } from './utils/logger';
import { performHealthCheck } from './utils/healthCheck';

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
const { valid, errors } = validateConfig();

// Initialize monitoring and analytics
initMonitoring();
initPerformanceMonitoring();
setupGlobalErrorReporting();

// Track initial page load
trackPageView(window.location.pathname);

// Perform health check (async, don't block)
performHealthCheck().then(health => {
  if (health.status !== 'healthy') {
    logger.warn('Health check indicates degraded status', { health });
  } else {
    logger.info('Application health check passed', { health });
  }
}).catch(error => {
  logger.error('Health check failed', {}, error);
});

// Log application startup
logger.info('Application starting', {
  environment: import.meta.env.MODE,
  version: import.meta.env.VITE_APP_VERSION || '1.0.0'
});

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