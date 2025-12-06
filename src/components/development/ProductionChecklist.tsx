import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  Database,
  Shield,
  Zap,
  Globe,
  Eye,
  Settings
} from 'lucide-react';
import Button from '../ui/Button';
import { runProductionChecks, ProductionCheck } from '../../utils/productionChecks';
import { checkDatabaseConnection } from '../../utils/databaseOptimization';
import * as databaseOptimization from '../../utils/databaseOptimization';
import { validateConfig } from '../../lib/config';

const ProductionChecklist: React.FC = () => {
  const { t } = useTranslation();
  const [checks, setChecks] = useState<ProductionCheck[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);

  const runAllChecks = async () => {
    setIsRunning(true);
    
    try {
      // Basic production checks
      const basicChecks = runProductionChecks();
      
      // Database schema validation
      const schemaValidation = await databaseOptimization.validateDatabaseSchema();
      basicChecks.push({
        name: 'Database Schema',
        status: schemaValidation.valid ? 'pass' : 'fail',
        message: schemaValidation.valid 
          ? 'Database schema is valid'
          : `Schema issues: ${schemaValidation.issues.join(', ')}`,
        fix: schemaValidation.valid ? undefined : 'Run database migrations to fix schema issues'
      });

      // Database connection check
      const connectionCheck = await checkDatabaseConnection();
      basicChecks.push({
        name: 'Database Connection',
        status: connectionCheck.connected ? 'pass' : 'fail',
        message: connectionCheck.connected 
          ? `Connected (${connectionCheck.responseTime.toFixed(0)}ms)`
          : `Connection failed: ${connectionCheck.error}`,
        fix: connectionCheck.connected ? undefined : 'Check database connection and credentials'
      });

      // Environment configuration
      const configValidation = validateConfig();
      if (!configValidation.valid) {
        basicChecks.push({
          name: 'Environment Variables',
          status: 'fail',
          message: `Missing variables: ${configValidation.errors.join(', ')}`,
          fix: 'Configure all required environment variables'
        });
      }

      setChecks(basicChecks);
      setLastRun(new Date());
    } catch (error) {
      console.error('Error running production checks:', error);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    runAllChecks();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <RefreshCw className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'text-green-600 dark:text-green-400';
      case 'fail':
        return 'text-red-600 dark:text-red-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getCategoryIcon = (checkName: string) => {
    if (checkName.toLowerCase().includes('database') || checkName.toLowerCase().includes('schema')) {
      return <Database className="h-5 w-5 text-blue-500" />;
    }
    if (checkName.toLowerCase().includes('security') || checkName.toLowerCase().includes('https')) {
      return <Shield className="h-5 w-5 text-green-500" />;
    }
    if (checkName.toLowerCase().includes('performance') || checkName.toLowerCase().includes('service worker')) {
      return <Zap className="h-5 w-5 text-yellow-500" />;
    }
    if (checkName.toLowerCase().includes('environment') || checkName.toLowerCase().includes('config')) {
      return <Settings className="h-5 w-5 text-purple-500" />;
    }
    return <Globe className="h-5 w-5 text-gray-500" />;
  };

  const passedChecks = checks.filter(c => c.status === 'pass').length;
  const totalChecks = checks.length;
  const overallScore = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-6 w-6 text-primary" />
            {t('Production Readiness Checklist')}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={runAllChecks}
            loading={isRunning}
            disabled={isRunning}
            icon={<RefreshCw className="h-4 w-4" />}
          >
            {t('Run Checks')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Overall Score */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('Overall Readiness Score')}
            </span>
            <span className={`text-2xl font-bold ${
              overallScore >= 90 ? 'text-green-600' :
              overallScore >= 70 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {overallScore}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                overallScore >= 90 ? 'bg-green-500' :
                overallScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${overallScore}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {passedChecks} of {totalChecks} checks passed
          </p>
        </div>

        {/* Checks List */}
        <div className="space-y-4">
          {checks.map((check, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                check.status === 'pass' ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' :
                check.status === 'warning' ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800' :
                'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(check.name)}
                  {getStatusIcon(check.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {check.name}
                  </h4>
                  <p className={`text-sm mt-1 ${getStatusColor(check.status)}`}>
                    {check.message}
                  </p>
                  {check.fix && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      <strong>{t('Fix')}:</strong> {check.fix}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {lastRun && (
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('Last checked')}: {lastRun.toLocaleTimeString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductionChecklist;