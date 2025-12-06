import React from 'react';
import { Leaf } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center mb-6">
        <Leaf className="h-10 w-10 text-primary mr-2" />
        <span className="text-2xl font-bold text-gray-900 dark:text-white">ImpactSoluce™</span>
      </div>
      
      <div className="w-16 h-16 relative">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-primary/20 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
      </div>
      
      <p className="mt-4 text-gray-600 dark:text-gray-400">Loading application...</p>
    </div>
  );
};

export default LoadingScreen;