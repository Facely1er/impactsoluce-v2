import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import './i18n';
import { AssessmentProvider } from './components/assessment/AssessmentState';
import { QueryProvider } from './providers/QueryProvider';
import { ToastProvider } from './providers/ToastProvider';
import { HelmetProvider } from './providers/HelmetProvider';
import { AccessibilityProvider } from './components/accessibility/AccessibilityProvider';
import ErrorBoundary from './components/error/ErrorBoundary';
import NetworkErrorBoundary from './components/error/NetworkErrorBoundary';
import GlobalErrorHandler from './components/error/GlobalErrorHandler';
import LoadingScreen from './components/ui/LoadingScreen';
import OfflineIndicator from './components/ui/OfflineIndicator';
import AdminPanel from './components/admin/AdminPanel';
import { usePageTracking } from './hooks/useAnalytics';
import { initMonitoring } from './lib/monitoring';

// Initialize monitoring on app load
initMonitoring();

// Component to track page views
function PageTracker() {
  usePageTracking();
  return null;
}

function App() {
  return (
    <ErrorBoundary>
      <NetworkErrorBoundary>
        <HelmetProvider>
          <QueryProvider>
            <ToastProvider>
              <AccessibilityProvider>
                <BrowserRouter>
                  <PageTracker />
                  <GlobalErrorHandler>
                    <Suspense fallback={<LoadingScreen />}>
                      <AssessmentProvider>
                        <AppRoutes />
                        <OfflineIndicator />
                        <AdminPanel />
                      </AssessmentProvider>
                    </Suspense>
                  </GlobalErrorHandler>
                </BrowserRouter>
              </AccessibilityProvider>
            </ToastProvider>
          </QueryProvider>
        </HelmetProvider>
      </NetworkErrorBoundary>
    </ErrorBoundary>
  );
}

export default App;