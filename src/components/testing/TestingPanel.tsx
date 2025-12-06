import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { 
  Play, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Eye,
  Zap,
  Database,
  RefreshCw
} from 'lucide-react';
import Button from '../ui/Button';
import { auditAccessibility } from '../../utils/accessibility';
import { checkDatabaseConnection, analyzeQueryPerformance } from '../../utils/databaseOptimization';
import { simulateUserInteraction } from '../../utils/testingHelpers';

const TestingPanel: React.FC = () => {
  const { t } = useTranslation();
  const [testResults, setTestResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runAccessibilityTest = async () => {
    setIsRunning(true);
    
    try {
      const audit = auditAccessibility();
      
      setTestResults({
        type: 'accessibility',
        ...audit,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Accessibility test failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const runPerformanceTest = async () => {
    setIsRunning(true);
    
    try {
      // Simulate user interactions
      const userActions = [
        async () => {
          // Simulate navigation
          await new Promise(resolve => setTimeout(resolve, 100));
        },
        async () => {
          // Simulate form interaction
          await new Promise(resolve => setTimeout(resolve, 200));
        },
        async () => {
          // Simulate data loading
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      ];

      const { duration, errors } = await simulateUserInteraction(userActions);
      
      setTestResults({
        type: 'performance',
        duration,
        errors,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Performance test failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const runDatabaseTest = async () => {
    setIsRunning(true);
    
    try {
      const connection = await checkDatabaseConnection();
      
      setTestResults({
        type: 'database',
        ...connection,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Database test failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getResultIcon = (type: string, result: any) => {
    switch (type) {
      case 'accessibility':
        return result.score >= 90 ? 
          <CheckCircle2 className="h-5 w-5 text-green-500" /> :
          result.score >= 70 ?
          <AlertTriangle className="h-5 w-5 text-yellow-500" /> :
          <XCircle className="h-5 w-5 text-red-500" />;
      
      case 'performance':
        return result.duration < 1000 ?
          <CheckCircle2 className="h-5 w-5 text-green-500" /> :
          result.duration < 3000 ?
          <AlertTriangle className="h-5 w-5 text-yellow-500" /> :
          <XCircle className="h-5 w-5 text-red-500" />;
      
      case 'database':
        return result.connected ?
          <CheckCircle2 className="h-5 w-5 text-green-500" /> :
          <XCircle className="h-5 w-5 text-red-500" />;
      
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  if (import.meta.env.PROD) {
    return null; // Don't show in production
  }

  return (
    <Card className="border-dashed border-2 border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
          <Zap className="h-5 w-5" />
          {t('Development Testing Panel')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Button
            variant="outline"
            className="flex flex-col items-center p-4 h-auto"
            onClick={runAccessibilityTest}
            disabled={isRunning}
            icon={<Eye className="h-6 w-6 mb-2" />}
          >
            <span className="font-medium">{t('Accessibility Test')}</span>
            <span className="text-xs text-gray-500 mt-1">{t('WCAG Compliance')}</span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col items-center p-4 h-auto"
            onClick={runPerformanceTest}
            disabled={isRunning}
            icon={<Zap className="h-6 w-6 mb-2" />}
          >
            <span className="font-medium">{t('Performance Test')}</span>
            <span className="text-xs text-gray-500 mt-1">{t('User Interactions')}</span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col items-center p-4 h-auto"
            onClick={runDatabaseTest}
            disabled={isRunning}
            icon={<Database className="h-6 w-6 mb-2" />}
          >
            <span className="font-medium">{t('Database Test')}</span>
            <span className="text-xs text-gray-500 mt-1">{t('Connection & Query')}</span>
          </Button>
        </div>

        {/* Test Results */}
        {testResults && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900 dark:text-white">
                {t('Last Test Results')} ({testResults.type})
              </h4>
              {getResultIcon(testResults.type, testResults)}
            </div>
            
            {testResults.type === 'accessibility' && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('Score')}: {testResults.score}%
                </p>
                {testResults.issues?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">
                      {t('Issues')} ({testResults.issues.length}):
                    </p>
                    <ul className="text-xs text-red-600 dark:text-red-400 ml-4">
                      {testResults.issues.slice(0, 3).map((issue: string, index: number) => (
                        <li key={index}>• {issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {testResults.type === 'performance' && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('Duration')}: {testResults.duration.toFixed(0)}ms
                </p>
                {testResults.errors?.length > 0 && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {t('Errors')}: {testResults.errors.length}
                  </p>
                )}
              </div>
            )}
            
            {testResults.type === 'database' && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('Connection')}: {testResults.connected ? t('Success') : t('Failed')}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('Response Time')}: {testResults.responseTime.toFixed(0)}ms
                </p>
              </div>
            )}
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {t('Tested at')}: {new Date(testResults.timestamp).toLocaleTimeString()}
            </p>
          </div>
        )}

        {isRunning && (
          <div className="flex items-center justify-center p-4">
            <RefreshCw className="h-5 w-5 animate-spin text-primary mr-2" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {t('Running tests...')}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestingPanel;