import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, AlertTriangle, Clock, Shield, FileAlert, TrendingUp } from 'lucide-react';
import { Alert, getUnacknowledgedAlerts, acknowledgeAlert, runAlertChecks } from '../../utils/alertSystem';
import { Link } from 'react-router-dom';

export default function AlertBanner() {
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Run alert checks on mount
    runAlertChecks();
    updateAlerts();

    // Check for alerts every 5 minutes
    const interval = setInterval(() => {
      runAlertChecks();
      updateAlerts();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const updateAlerts = () => {
    const unacknowledged = getUnacknowledgedAlerts();
    setAlerts(unacknowledged);
  };

  const handleAcknowledge = (alertId: string) => {
    acknowledgeAlert(alertId);
    updateAlerts();
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'deadline':
        return <Clock className="h-5 w-5" />;
      case 'compliance':
        return <Shield className="h-5 w-5" />;
      case 'risk':
        return <TrendingUp className="h-5 w-5" />;
      case 'evidence':
        return <FileAlert className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900/50 text-red-800 dark:text-red-200';
      case 'high':
        return 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-900/50 text-orange-800 dark:text-orange-200';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-900/50 text-yellow-800 dark:text-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900/50 text-blue-800 dark:text-blue-200';
    }
  };

  if (alerts.length === 0) {
    return null;
  }

  const criticalAlerts = alerts.filter(a => a.severity === 'critical');
  const displayAlerts = isExpanded ? alerts : alerts.slice(0, 3);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <div className={`container mx-auto px-4 py-3 ${getSeverityColor(criticalAlerts.length > 0 ? 'critical' : alerts[0]?.severity || 'low')}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getAlertIcon(alerts[0]?.type || 'compliance')}
              <h3 className="font-semibold">
                {alerts.length === 1 
                  ? t('{{count}} Alert', { count: alerts.length })
                  : t('{{count}} Alerts', { count: alerts.length })
                }
              </h3>
            </div>
            <div className="space-y-2">
              {displayAlerts.map(alert => (
                <div key={alert.id} className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-medium">{alert.title}</p>
                    <p className="text-sm opacity-90">{alert.message}</p>
                    {alert.deadline && (
                      <p className="text-xs mt-1 opacity-75">
                        {t('Deadline')}: {new Date(alert.deadline).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    className="text-current opacity-70 hover:opacity-100 transition-opacity"
                    aria-label={t('Dismiss alert')}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            {alerts.length > 3 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sm font-medium mt-2 underline"
              >
                {isExpanded 
                  ? t('Show less')
                  : t('Show {{count}} more', { count: alerts.length - 3 })
                }
              </button>
            )}
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <Link to="/alerts" className="text-sm font-medium underline">
            {t('View All Alerts')}
          </Link>
        </div>
      </div>
    </div>
  );
}

