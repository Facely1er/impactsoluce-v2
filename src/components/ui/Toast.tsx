import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface ToastProps {
  id: string;
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  onClose: (id: string) => void;
}

export function Toast({ id, title, message, type = 'info', onClose }: ToastProps) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-200',
    error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-200',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-200',
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-200',
  };

  const IconComponent = icons[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <div
      className={cn(
        'flex items-start w-full max-w-sm p-4 rounded-lg border shadow-lg transition-all duration-300 ease-in-out transform',
        styles[type]
      )}
      role="alert"
    >
      <div className="flex-shrink-0">
        <IconComponent className="h-5 w-5" />
      </div>
      <div className="ml-3 flex-1">
        {title && (
          <div className="font-semibold mb-1">{title}</div>
        )}
        <div className="text-sm">{message}</div>
      </div>
      <button
        type="button"
        className="ml-4 flex-shrink-0 rounded-lg p-1.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        onClick={() => onClose(id)}
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}