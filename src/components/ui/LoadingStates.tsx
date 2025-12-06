import React from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';
import { cn } from '../../utils/cn';

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
  animate?: boolean;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className,
  lines = 3,
  animate = true
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-4 bg-gray-200 rounded dark:bg-gray-700',
            animate && 'animate-pulse',
            i === lines - 1 && 'w-3/4' // Last line shorter
          )}
        />
      ))}
    </div>
  );
};

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  label
}) => {
  const { t } = useTranslation();
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      {label && (
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          {label}
        </span>
      )}
    </div>
  );
};

interface LoadingCardProps {
  title?: string;
  description?: string;
  className?: string;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({
  title,
  description,
  className
}) => {
  const { t } = useTranslation();

  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm', className)}>
      <div className="flex items-center justify-center mb-4">
        <LoadingSpinner size="lg" />
      </div>
      {title && (
        <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center mb-2">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-gray-600 dark:text-gray-400 text-center">
          {description}
        </p>
      )}
    </div>
  );
};

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  message,
  onRetry,
  className
}) => {
  const { t } = useTranslation();

  return (
    <div className={cn('text-center py-8', className)}>
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
          <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
      </div>
      {title && (
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
      )}
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {message}
      </p>
      {onRetry && (
        <Button
          onClick={onRetry}
          className="bg-primary"
          icon={<RefreshCw className="h-4 w-4" />}
        >
          {t('Try Again')}
        </Button>
      )}
    </div>
  );
};

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  icon,
  className
}) => {
  return (
    <div className={cn('text-center py-12', className)}>
      {icon && (
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
            {icon}
          </div>
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {description}
      </p>
      {action && (
        <Button
          onClick={action.onClick}
          className="bg-primary"
          icon={action.icon}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};