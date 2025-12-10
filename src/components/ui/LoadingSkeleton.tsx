import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

/**
 * Loading skeleton component for better UX during data loading
 */
export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  lines = 1,
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded';
  
  const variantClasses = {
    text: 'h-4',
    circular: 'rounded-full',
    rectangular: '',
    card: 'rounded-lg',
  };

  // Convert width/height to Tailwind arbitrary value classes
  const getWidthClass = (value: string | number | undefined): string => {
    if (!value) return '';
    const widthStr = typeof value === 'number' ? `${value}px` : value;
    return `w-[${widthStr}]`;
  };

  const getHeightClass = (value: string | number | undefined): string => {
    if (!value) return '';
    const heightStr = typeof value === 'number' ? `${value}px` : value;
    return `h-[${heightStr}]`;
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={className}>
        {Array.from({ length: lines }).map((_, index) => {
          const isLastLine = index === lines - 1;
          const widthClass = width ? getWidthClass(width) : (isLastLine ? 'w-3/4' : 'w-full');
          const heightClass = height ? getHeightClass(height) : 'h-4';
          
          return (
            <div
              key={index}
              className={`${baseClasses} ${variantClasses[variant]} mb-2 ${widthClass} ${heightClass}`}
            />
          );
        })}
      </div>
    );
  }

  const heightClass = height ? getHeightClass(height) : (!height ? (variant === 'text' ? 'h-4' : 'h-[100px]') : '');
  const widthClass = width ? getWidthClass(width) : (!width ? 'w-full' : '');

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${heightClass} ${className}`}
    />
  );
};

/**
 * Card skeleton for loading card components
 */
export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <LoadingSkeleton variant="text" width="60%" height="1.5rem" className="mb-4" />
      <LoadingSkeleton variant="text" lines={3} className="mb-4" />
      <LoadingSkeleton variant="rectangular" height="200px" />
    </div>
  );
};

/**
 * Table skeleton for loading table data
 */
export const TableSkeleton: React.FC<{ rows?: number; columns?: number; className?: string }> = ({
  rows = 5,
  columns = 4,
  className = '',
}) => {
  return (
    <div className={className}>
      {/* Header */}
      <div className="flex gap-4 mb-4">
        {Array.from({ length: columns }).map((_, index) => (
          <LoadingSkeleton key={index} variant="text" width="100%" height="1.25rem" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 mb-3">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <LoadingSkeleton key={colIndex} variant="text" width="100%" height="1rem" />
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * List skeleton for loading list data
 */
export const ListSkeleton: React.FC<{ items?: number; className?: string }> = ({
  items = 5,
  className = '',
}) => {
  return (
    <div className={className}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 mb-4">
          <LoadingSkeleton variant="circular" width={40} height={40} />
          <div className="flex-1">
            <LoadingSkeleton variant="text" width="60%" height="1rem" className="mb-2" />
            <LoadingSkeleton variant="text" width="40%" height="0.875rem" />
          </div>
        </div>
      ))}
    </div>
  );
};

