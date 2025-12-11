import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { 
  Bell, 
  Clock, 
  Shield, 
  FileAlert, 
  TrendingUp,
  AlertTriangle,
  X,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { Alert, getAlerts, acknowledgeAlert, deleteAlert, getAlertPreferences, saveAlertPreferences, runAlertChecks } from '../utils/alertSystem';
import LoadingScreen from '../components/ui/LoadingScreen';
import ErrorAlert from '../components/ui/ErrorAlert';
import { useErrorHandler } from '../hooks/useErrorHandler';

export default function Alerts() {
  const { t } = useTranslation();
  const { error, handleError, clearError } = useErrorHandler();
  const [isLoading, setIsLoading] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [showAcknowledged, setShowAcknowledged] = useState(false);
  const [preferences, setPreferences] = useState(getAlertPreferences());

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = () => {
    try {
      setIsLoading(true);
      clearError();
      runAlertChecks(); // Run checks to generate new alerts
      const allAlerts = getAlerts();
      setAlerts(allAlerts);
    } catch (err) {
      handleError(err as Error, 'Failed to load alerts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcknowledge = (alertId: string) => {
    acknowledgeAlert(alertId);
    loadAlerts();
  };

  const handleDelete = (alertId: string) => {
    deleteAlert(alertId);
    loadAlerts();
  };

  const handlePreferenceChange = (key: keyof typeof preferences, value: boolean | number) => {
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
    saveAlertPreferences(updated);
  };

  const filteredAlerts = alerts.filter(alert => {
    if (!showAcknowledged && alert.acknowledged) return false;
    if (filterType !== 'all' && alert.type !== filterType) return false;
    if (filterSeverity !== 'all' && alert.severity !== filterSeverity) return false;
    return true;
  });

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
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-900/50';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-900/50';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900/50';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-900/50';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <LoadingScreen />
      </Layout>
    );
  }

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Bell className="h-8 w-8 text-primary" />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {t('Alerts & Notifications')}
                </h1>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t('Monitor deadlines, compliance requirements, and risk alerts')}
              </p>
            </div>
            <Button onClick={loadAlerts} variant="outline">
              {t('Refresh')}
            </Button>
          </div>
        </div>

        {error && (
          <ErrorAlert message={error.message} details={error.details} onClose={clearError} className="mb-6" />
        )}

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {unacknowledgedCount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t('Unacknowledged')}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
                {alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t('Critical')}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                {alerts.filter(a => a.severity === 'high' && !a.acknowledged).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t('High Priority')}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {alerts.filter(a => a.type === 'deadline' && !a.acknowledged).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t('Deadlines')}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="all">{t('All Types')}</option>
                  <option value="deadline">{t('Deadlines')}</option>
                  <option value="compliance">{t('Compliance')}</option>
                  <option value="risk">{t('Risk')}</option>
                  <option value="evidence">{t('Evidence')}</option>
                </select>
              </div>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">{t('All Severities')}</option>
                <option value="critical">{t('Critical')}</option>
                <option value="high">{t('High')}</option>
                <option value="medium">{t('Medium')}</option>
                <option value="low">{t('Low')}</option>
              </select>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAcknowledged}
                  onChange={(e) => setShowAcknowledged(e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-700"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {t('Show acknowledged')}
                </span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Alert Preferences */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('Alert Preferences')}</CardTitle>
            <CardDescription>
              {t('Configure how and when you receive alerts')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {t('Enable deadline alerts')}
                </span>
                <input
                  type="checkbox"
                  checked={preferences.deadlineAlerts}
                  onChange={(e) => handlePreferenceChange('deadlineAlerts', e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-700"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {t('Alert days before deadline')}
                </span>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={preferences.daysBeforeDeadline}
                  onChange={(e) => handlePreferenceChange('daysBeforeDeadline', parseInt(e.target.value))}
                  className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {t('No alerts found')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('You\'re all caught up!')}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredAlerts.map(alert => (
              <Card key={alert.id} className={alert.acknowledged ? 'opacity-60' : ''}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {alert.title}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                            {t(alert.severity)}
                          </span>
                          {alert.acknowledged && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs">
                              {t('Acknowledged')}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                          {alert.message}
                        </p>
                        {alert.deadline && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {t('Deadline')}: {new Date(alert.deadline).toLocaleDateString()}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          {t('Created')}: {new Date(alert.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!alert.acknowledged && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAcknowledge(alert.id)}
                          icon={<CheckCircle2 className="h-4 w-4" />}
                        >
                          {t('Acknowledge')}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(alert.id)}
                        icon={<X className="h-4 w-4" />}
                      >
                        {t('Delete')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}

