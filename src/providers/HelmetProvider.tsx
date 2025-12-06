import React from 'react';
import { HelmetProvider as ReactHelmetProvider } from 'react-helmet-async';

/**
 * HelmetProvider component
 * 
 * This component provides the Helmet context for managing document head tags.
 */
export const HelmetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ReactHelmetProvider>
      {children}
    </ReactHelmetProvider>
  );
};