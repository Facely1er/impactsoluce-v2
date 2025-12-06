import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import { initMonitoring, logEvent, EventType, trackPageView } from '../../lib/monitoring';

/**
 * GlobalErrorHandler component
 * 
 * This component initializes global error monitoring and tracking.
 * It should be placed high in the component tree.
 */
const GlobalErrorHandler: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addToast } = useToast();
  const location = useLocation();
  
  // Initialize monitoring on mount
  useEffect(() => {
    initMonitoring();
    
    // Set up a periodic health check
    const healthCheckInterval = setInterval(() => {
      try {
        // Simple health check - verify localStorage is working
        localStorage.setItem('health_check', Date.now().toString());
        localStorage.removeItem('health_check');
        
        // Log successful health check
        logEvent(EventType.DEBUG, 'Health check passed');
      } catch (error) {
        console.error('Health check failed:', error);
        addToast('error', 'Application error', 'Please refresh the page');
      }
    }, 5 * 60 * 1000); // Every 5 minutes
    
    return () => {
      clearInterval(healthCheckInterval);
    };
  }, [addToast]);
  
  // Track page views
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);
  
  return <>{children}</>;
};

export default GlobalErrorHandler;