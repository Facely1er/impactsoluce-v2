import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  icon,
  loading = false,
  disabled,
  ...props
}) => {
  const variantClasses = {
    primary: [
      'bg-primary text-white shadow-sm',
      'hover:bg-primary-600 hover:scale-[1.02] hover:shadow-md',
      'active:bg-primary-700 active:scale-[0.98] active:shadow-sm',
      'disabled:bg-primary-200 disabled:scale-100 disabled:shadow-none',
      'transform-gpu'
    ].join(' '),
    secondary: [
      'bg-secondary text-white shadow-sm',
      'hover:bg-secondary-600 hover:scale-[1.02] hover:shadow-md',
      'active:bg-secondary-700 active:scale-[0.98] active:shadow-sm',
      'disabled:bg-secondary-200 disabled:scale-100 disabled:shadow-none',
      'transform-gpu'
    ].join(' '),
    outline: [
      'border-2 border-primary text-primary bg-transparent',
      'hover:bg-primary/5 hover:scale-[1.02] hover:shadow-md',
      'active:bg-primary/10 active:scale-[0.98] active:shadow-sm',
      'disabled:border-primary-200 disabled:text-primary-200 disabled:scale-100 disabled:shadow-none',
      'transform-gpu'
    ].join(' '),
    ghost: [
      'text-gray-700 dark:text-gray-300 bg-transparent',
      'hover:bg-gray-100 hover:scale-[1.02] dark:hover:bg-gray-800',
      'active:bg-gray-200 active:scale-[0.98] dark:active:bg-gray-700',
      'disabled:text-gray-300 disabled:scale-100',
      'transform-gpu'
    ].join(' '),
  };

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 rounded',
    md: 'text-sm px-4 py-2 rounded-md',
    lg: 'text-base px-6 py-3 rounded-lg',
  };

  return (
    <button
      className={cn(
        'font-medium transition-all duration-300 ease-out',
        'inline-flex items-center justify-center gap-2',
        'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2',
        'dark:focus:ring-offset-gray-900',
        'disabled:cursor-not-allowed disabled:opacity-60',
        'motion-safe:transition-transform',
        'select-none touch-manipulation',
        'relative overflow-hidden',
        variantClasses[variant],
        sizeClasses[size],
        loading && 'cursor-wait',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>{children}</span>
        </>
      ) : (
        <>
          {icon && <span className="flex-shrink-0" aria-hidden="true">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;