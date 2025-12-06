import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ErrorAlertProps {
  message: string;
  details?: string;
  onClose?: () => void;
  className?: string;
  variant?: 'error' | 'warning' | 'info';
}

export default function ErrorAlert({ 
  message, 
  details, 
  onClose, 
  className,
  variant = 'error'
}: ErrorAlertProps) {
  const variants = {
    error: 'bg-red-50 border-red-400 text-red-800 dark:bg-red-900/20 dark:border-red-500 dark:text-red-200',
    warning: 'bg-yellow-50 border-yellow-400 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-500 dark:text-yellow-200',
    info: 'bg-blue-50 border-blue-400 text-blue-800 dark:bg-blue-900/20 dark:border-blue-500 dark:text-blue-200'
  };

  return (
    <div className={cn(
      "border-l-4 p-4 rounded-md",
      variants[variant],
      className
    )}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className={cn(
            "h-5 w-5",
            variant === 'error' ? "text-red-400 dark:text-red-300" :
            variant === 'warning' ? "text-yellow-400 dark:text-yellow-300" :
            "text-blue-400 dark:text-blue-300"
          )} aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1">
          <p className={cn(
            "text-sm font-medium",
            variant === 'error' ? "text-red-800 dark:text-red-200" :
            variant === 'warning' ? "text-yellow-800 dark:text-yellow-200" :
            "text-blue-800 dark:text-blue-200"
          )}>
            {message}
          </p>
          {details && (
            <p className={cn(
              "mt-1 text-sm",
              variant === 'error' ? "text-red-700 dark:text-red-300" :
              variant === 'warning' ? "text-yellow-700 dark:text-yellow-300" :
              "text-blue-700 dark:text-blue-300"
            )}>
              {details}
            </p>
          )}
        </div>
        {onClose && (
          <div className="ml-4 flex-shrink-0">
            <button
              type="button"
              className={cn(
                "inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors",
                variant === 'error' ? 
                  "bg-red-50 text-red-500 hover:text-red-600 focus:ring-red-500 dark:bg-red-900/20 dark:text-red-300 dark:hover:text-red-200" :
                variant === 'warning' ?
                  "bg-yellow-50 text-yellow-500 hover:text-yellow-600 focus:ring-yellow-500 dark:bg-yellow-900/20 dark:text-yellow-300 dark:hover:text-yellow-200" :
                  "bg-blue-50 text-blue-500 hover:text-blue-600 focus:ring-blue-500 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:text-blue-200"
              )}
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}