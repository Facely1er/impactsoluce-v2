/**
 * Production readiness checks
 */

import { validateConfig } from '../lib/config';

export interface ProductionCheck {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  fix?: string;
}

// Run comprehensive production readiness checks
export const runProductionChecks = (): ProductionCheck[] => {
  const checks: ProductionCheck[] = [];

  // Environment configuration check
  const configValidation = validateConfig();
  checks.push({
    name: 'Environment Configuration',
    status: configValidation.valid ? 'pass' : 'fail',
    message: configValidation.valid 
      ? 'All required environment variables are configured'
      : `Missing: ${configValidation.errors.join(', ')}`,
    fix: configValidation.valid ? undefined : 'Configure missing environment variables in .env file'
  });

  // HTTPS check
  const isHttps = window.location.protocol === 'https:';
  checks.push({
    name: 'HTTPS Security',
    status: isHttps ? 'pass' : 'warning',
    message: isHttps ? 'Site is served over HTTPS' : 'Site is not served over HTTPS',
    fix: isHttps ? undefined : 'Configure HTTPS for production deployment'
  });

  // Service Worker check
  const hasServiceWorker = 'serviceWorker' in navigator;
  checks.push({
    name: 'Service Worker Support',
    status: hasServiceWorker ? 'pass' : 'warning',
    message: hasServiceWorker ? 'Service Worker is supported' : 'Service Worker not supported',
    fix: hasServiceWorker ? undefined : 'Service Worker provides offline functionality'
  });

  // Local Storage check
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    checks.push({
      name: 'Local Storage',
      status: 'pass',
      message: 'Local Storage is available'
    });
  } catch (error) {
    checks.push({
      name: 'Local Storage',
      status: 'fail',
      message: 'Local Storage is not available',
      fix: 'Ensure Local Storage is enabled in browser settings'
    });
  }

  // WebCrypto API check
  const hasWebCrypto = 'crypto' in window && 'subtle' in window.crypto;
  checks.push({
    name: 'Web Crypto API',
    status: hasWebCrypto ? 'pass' : 'warning',
    message: hasWebCrypto ? 'Web Crypto API is available' : 'Web Crypto API not available',
    fix: hasWebCrypto ? undefined : 'Some security features may be limited'
  });

  // Performance API check
  const hasPerformanceAPI = 'performance' in window;
  checks.push({
    name: 'Performance API',
    status: hasPerformanceAPI ? 'pass' : 'warning',
    message: hasPerformanceAPI ? 'Performance API is available' : 'Performance API not available',
    fix: hasPerformanceAPI ? undefined : 'Performance monitoring may be limited'
  });

  // Accessibility audit
  try {
    const accessibilityAudit = auditAccessibility();
    checks.push({
      name: 'Accessibility Compliance',
      status: accessibilityAudit.score >= 90 ? 'pass' : accessibilityAudit.score >= 70 ? 'warning' : 'fail',
      message: `Accessibility score: ${accessibilityAudit.score}% (${accessibilityAudit.issues.length} issues, ${accessibilityAudit.warnings.length} warnings)`,
      fix: accessibilityAudit.issues.length > 0 ? 'Fix accessibility issues for WCAG compliance' : undefined
    });
  } catch (error) {
    checks.push({
      name: 'Accessibility Compliance',
      status: 'fail',
      message: 'Could not run accessibility audit',
      fix: 'Ensure accessibility audit tools are properly configured'
    });
  }

  return checks;
};

// Display production check results (for admin/debug purposes)
export const displayProductionChecks = (): void => {
  if (import.meta.env.DEV) {
    const checks = runProductionChecks();
    
    console.group('🔍 Production Readiness Checks');
    checks.forEach(check => {
      const icon = check.status === 'pass' ? '✅' : check.status === 'warning' ? '⚠️' : '❌';
      console.log(`${icon} ${check.name}: ${check.message}`);
      if (check.fix) {
        console.log(`   Fix: ${check.fix}`);
      }
    });
    console.groupEnd();
  }
};