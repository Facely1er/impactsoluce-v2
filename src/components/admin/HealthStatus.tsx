import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { CheckCircle2, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';
import { getHealthStatus, HealthStatus } from '../../utils/healthCheck';
import Button from '../ui/Button';
import LoadingScreen from '../ui/LoadingScreen';

export default function HealthStatusPanel() {
  const { t } = useTranslation();
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadHealth = async () => {
    setIsLoading(true);
    try {
      const status = await getHealthStatus();
      setHealth(status.details);
    } catch (error) {
      console.error('Failed to load health status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHealth();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!health) {
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900/50';
      case 'degraded':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-900/50';
      case 'unhealthy':
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900/50';
      default:
        return 'bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-900/50';
    }
  };

  return (
    <Card className={`border-2 ${getStatusColor(health.status)}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t('System Health Status')}</CardTitle>
          <Button variant="outline" size="sm" onClick={loadHealth} icon={<RefreshCw className="h-4 w-4" />}>
            {t('Refresh')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon(health.status === 'healthy' ? 'ok' : 'error')}
              <span className="font-semibold capitalize">{t(health.status)}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('Last checked')}: {new Date(health.timestamp).toLocaleString()}
            </p>
          </div>

          <div className="space-y-3">
            {health.checks.storage && (
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(health.checks.storage.status)}
                  <span>{t('Storage')}</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {health.checks.storage.available ? t('Available') : t('Unavailable')}
                </div>
              </div>
            )}

            {health.checks.database && (
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(health.checks.database.status)}
                  <span>{t('Database')}</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {health.checks.database.responseTime 
                    ? `${health.checks.database.responseTime}ms`
                    : health.checks.database.error || t('Not configured')
                  }
                </div>
              </div>
            )}

            {health.checks.api && (
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(health.checks.api.status)}
                  <span>{t('API')}</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {health.checks.api.responseTime 
                    ? `${health.checks.api.responseTime}ms`
                    : health.checks.api.error || t('Not configured')
                  }
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('Version')}: {health.version} | {t('Environment')}: {health.environment}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

