import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { useHealthCheck } from '../../hooks/useHealthCheck';
import { cn } from '../../utils/cn';

interface HealthIndicatorProps {
  className?: string;
  showDetails?: boolean;
}

const HealthIndicator: React.FC<HealthIndicatorProps> = ({ 
  className,
  showDetails = false 
}) => {
  const { t } = useTranslation();
  const { health, checkHealth } = useHealthCheck();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'unhealthy':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500 animate-spin" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600';
      case 'unhealthy':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (!showDetails) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {getStatusIcon(health.overall)}
        <span className={cn('text-sm font-medium', getStatusColor(health.overall))}>
          {t(health.overall === 'healthy' ? 'System Healthy' : 'System Issues')}
        </span>
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
          {t('System Health')}
        </h4>
        <button
          onClick={checkHealth}
          className="text-xs text-primary hover:text-primary-600"
        >
          {t('Refresh')}
        </button>
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600 dark:text-gray-400">{t('Database')}</span>
          {getStatusIcon(health.database)}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600 dark:text-gray-400">{t('Authentication')}</span>
          {getStatusIcon(health.auth)}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600 dark:text-gray-400">{t('Storage')}</span>
          {getStatusIcon(health.storage)}
        </div>
      </div>
      
      {health.lastChecked && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {t('Last checked')}: {health.lastChecked.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
};

export default HealthIndicator;