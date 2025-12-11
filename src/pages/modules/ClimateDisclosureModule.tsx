import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { 
  Globe, 
  FileCheck, 
  AlertTriangle, 
  CheckCircle2,
  Clock,
  Download,
  Settings,
  TrendingUp
} from 'lucide-react';
import { ClimateDisclosure } from '../../types';
import LoadingScreen from '../../components/ui/LoadingScreen';
import ErrorAlert from '../../components/ui/ErrorAlert';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import styles from './EUDRModule.module.css';

interface ClimateCompliance {
  organizationId: string;
  complianceScore: number;
  disclosures: ClimateDisclosure[];
  frameworkScores: {
    CSRD: number;
    TCFD: number;
    SEC: number;
    ISSB: number;
  };
}

export default function ClimateDisclosureModule() {
  const { t } = useTranslation();
  const { error, handleError, clearError } = useErrorHandler();
  const [isLoading, setIsLoading] = useState(true);
  const [compliance, setCompliance] = useState<ClimateCompliance | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const loadClimateData = useCallback(async () => {
    try {
      setIsLoading(true);
      clearError();
      
      const stored = localStorage.getItem('climateCompliance');
      let data: ClimateCompliance;
      
      if (stored) {
        data = JSON.parse(stored);
      } else {
        data = generateMockClimateData();
        localStorage.setItem('climateCompliance', JSON.stringify(data));
      }
      
      setCompliance(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load Climate Disclosure compliance data';
      handleError(new Error(`Failed to load Climate Disclosure compliance data: ${errorMessage}`));
    } finally {
      setIsLoading(false);
    }
  }, [clearError, handleError]);

  useEffect(() => {
    loadClimateData();
  }, [loadClimateData]);

  useEffect(() => {
    if (progressBarRef.current && compliance) {
      progressBarRef.current.style.setProperty('--compliance-score-width', `${compliance.complianceScore}%`);
    }
  }, [compliance]);

  const generateMockClimateData = (): ClimateCompliance => {
    const disclosures: ClimateDisclosure[] = [
      {
        id: '1',
        framework: 'CSRD',
        requirement: 'Climate-related governance disclosures',
        category: 'governance',
        status: 'complete',
        deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        framework: 'TCFD',
        requirement: 'Climate scenario analysis',
        category: 'strategy',
        status: 'in_progress',
        deadline: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        framework: 'SEC',
        requirement: 'GHG emissions disclosure (Scope 1, 2, 3)',
        category: 'metrics',
        status: 'in_progress',
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        framework: 'ISSB',
        requirement: 'Climate-related risks and opportunities',
        category: 'risk',
        status: 'not_started',
        deadline: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        framework: 'TCFD',
        requirement: 'Climate-related targets and transition plans',
        category: 'strategy',
        status: 'partial',
        deadline: new Date(Date.now() + 200 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    return {
      organizationId: 'org-1',
      complianceScore: 65,
      disclosures,
      frameworkScores: {
        CSRD: 75,
        TCFD: 60,
        SEC: 55,
        ISSB: 70
      }
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'not_started':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'governance':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'strategy':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'risk':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'metrics':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
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

  if (!compliance) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Globe className="h-8 w-8 text-green-600" />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {t('Climate & Environmental Disclosure')}
                </h1>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t('Track disclosure requirements for CSRD, TCFD, SEC Climate rules. Manage climate data collection, scenario analysis, and target setting disclosures.')}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" icon={<Settings className="h-4 w-4" />}>
                {t('Configure')}
              </Button>
              <Button variant="outline" icon={<Download className="h-4 w-4" />}>
                {t('Export')}
              </Button>
            </div>
          </div>
        </div>

        {/* Compliance Score */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {t('Overall Compliance Score')}
                </p>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {compliance.complianceScore}%
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 max-w-md">
                  <div 
                    ref={progressBarRef}
                    className={`${styles.complianceProgressBar} ${
                      compliance.complianceScore >= 80 ? styles.complianceProgressBarGreen :
                      compliance.complianceScore >= 60 ? styles.complianceProgressBarYellow : styles.complianceProgressBarRed
                    }`}
                  />
                </div>
              </div>
              <div className="text-right">
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('Climate Disclosure')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Framework Scores */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {t('Framework Compliance Scores')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(compliance.frameworkScores).map(([framework, score]) => (
              <Card key={framework}>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {framework}
                    </p>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {score}%
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          score >= 80 ? 'bg-green-500' :
                          score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Disclosure Requirements */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('Disclosure Requirements')}</CardTitle>
            <CardDescription>
              {t('Track compliance status for climate disclosure requirements by framework')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {compliance.disclosures.map(disclosure => (
                <div 
                  key={disclosure.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {disclosure.requirement}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(disclosure.status)}`}>
                          {t(disclosure.status.replace('_', ' '))}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                          {disclosure.framework}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(disclosure.category)}`}>
                          {t(disclosure.category)}
                        </span>
                      </div>
                    </div>
                  </div>
                  {disclosure.deadline && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      {t('Deadline')}: {new Date(disclosure.deadline).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <Link to="/evidence-workspace">
            <Button className="bg-primary">
              {t('View Evidence Requirements')}
            </Button>
          </Link>
          <Link to="/risk-radar">
            <Button variant="outline">
              {t('View Exposure Signals')}
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}

