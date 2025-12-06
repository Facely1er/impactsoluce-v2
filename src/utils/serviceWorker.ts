/**
 * Service Worker registration for production caching
 */

// Register service worker for production caching
export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      console.log('ServiceWorker registration successful:', registration);
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available
              console.log('New version available. Please refresh.');
              
              // Optionally show a toast notification
              const event = new CustomEvent('sw-update-available');
              window.dispatchEvent(event);
            }
          });
        }
      });
      
    } catch (error) {
      console.error('ServiceWorker registration failed:', error);
    }
  }
};

// Unregister service worker (for development)
export const unregisterServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.unregister();
        console.log('ServiceWorker unregistered');
      }
    } catch (error) {
      console.error('ServiceWorker unregistration failed:', error);
    }
  }
};