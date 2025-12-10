import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { 
  Package, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Shield,
  TrendingUp
} from 'lucide-react';
import { RegulatoryModule } from '../types';
import { 
  getAllModules, 
  getActiveModules, 
  activateModule, 
  deactivateModule, 
  isModuleActive 
} from '../utils/moduleManager';
import LoadingScreen from '../components/ui/LoadingScreen';
import ErrorAlert from '../components/ui/ErrorAlert';
import { useErrorHandler } from '../hooks/useErrorHandler';

export default function Modules() {
  const { t } = useTranslation();
  const { error, handleError, clearError } = useErrorHandler();
  const [isLoading, setIsLoading] = useState(true);
  const [modules, setModules] = useState<RegulatoryModule[]>([]);
  const [activeModules, setActiveModules] = useState<string[]>([]);

  const loadModules = useCallback(() => {
    try {
      setIsLoading(true);
      clearError();
      
      const allModules = getAllModules();
      const active = getActiveModules().map(m => m.id);
      
      setModules(allModules);
      setActiveModules(active);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load modules';
      handleError(new Error(`Failed to load modules: ${errorMessage}`));
    } finally {
      setIsLoading(false);
    }
  }, [clearError, handleError]);

  useEffect(() => {
    loadModules();
  }, [loadModules]);

  const handleToggleModule = (moduleId: string) => {
    try {
      if (isModuleActive(moduleId)) {
        deactivateModule(moduleId);
      } else {
        activateModule(moduleId);
      }
      loadModules(); // Reload to update state
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle module';
      handleError(new Error(`Failed to toggle module: ${errorMessage}`));
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <LoadingScreen />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <ErrorAlert message={error.message} details={error.details} onClose={clearError} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {t('Regulatory Intelligence Modules')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t('Activate only the regulatory modules you need. Each module provides exposure analysis, evidence requirements, compliance tracking, and reporting for specific regulations.')}
          </p>
        </div>

        {/* Info Banner */}
        <Card className="mb-8 border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {t('Modular Intelligence')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('Each module focuses on exposure signals and evidence expectations for specific regulations. Activate modules based on your sector, geography, and regulatory obligations.')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Modules Summary */}
        {activeModules.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('Active Modules')} ({activeModules.length})
              </h2>
              <Link to="/evidence-workspace">
                <Button variant="outline" size="sm">
                  {t('View Evidence')}
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {modules
                .filter(m => activeModules.includes(m.id))
                .map(module => (
                  <Card key={module.id} className="border-green-200 dark:border-green-900/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{module.icon}</span>
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-xs font-medium">
                          {t('Active')}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {module.name}
                      </h3>
                      {module.route && (
                        <Link to={module.route}>
                          <Button variant="outline" size="sm" className="w-full mt-2">
                            {t('Open Module')}
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* All Modules */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {t('Available Modules')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map(module => {
              const isActive = activeModules.includes(module.id);
              
              return (
                <Card 
                  key={module.id} 
                  className={`transition-all ${isActive ? 'border-green-200 dark:border-green-900/50' : ''}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{module.icon}</span>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-1">{module.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {module.description}
                          </CardDescription>
                        </div>
                      </div>
                      {isActive && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Regulations */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('Regulations')}:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {module.regulations.map((regulation, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs"
                          >
                            {regulation}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('Features')}:
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {module.features.exposureAnalysis && (
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <TrendingUp className="h-3 w-3" />
                            {t('Exposure Analysis')}
                          </div>
                        )}
                        {module.features.evidenceRequirements && (
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <Shield className="h-3 w-3" />
                            {t('Evidence Requirements')}
                          </div>
                        )}
                        {module.features.complianceTracking && (
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <CheckCircle2 className="h-3 w-3" />
                            {t('Compliance Tracking')}
                          </div>
                        )}
                        {module.features.reporting && (
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <Package className="h-3 w-3" />
                            {t('Reporting')}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Applicable To */}
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {t('Applicable to')}:
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {t('Sectors')}: {module.configuration.applicableSectors.join(', ')}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {t('Geographies')}: {module.configuration.applicableGeographies.join(', ')}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {isActive ? (
                        <>
                          {module.route && (
                            <Link to={module.route} className="flex-1">
                              <Button className="w-full bg-primary">
                                {t('Open Module')}
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </Button>
                            </Link>
                          )}
                          <Button
                            variant="outline"
                            onClick={() => handleToggleModule(module.id)}
                            icon={<XCircle className="h-4 w-4" />}
                          >
                            {t('Deactivate')}
                          </Button>
                        </>
                      ) : (
                        <Button
                          className="w-full bg-primary"
                          onClick={() => handleToggleModule(module.id)}
                          icon={<CheckCircle2 className="h-4 w-4" />}
                        >
                          {t('Activate Module')}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}

