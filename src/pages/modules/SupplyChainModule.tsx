import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { 
  Link2, 
  MapPin, 
  FileCheck, 
  AlertTriangle, 
  CheckCircle2,
  Clock,
  Download,
  Settings,
  Layers
} from 'lucide-react';
import { TransparencyRequirement } from '../../types';
import LoadingScreen from '../../components/ui/LoadingScreen';
import ErrorAlert from '../../components/ui/ErrorAlert';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import styles from './EUDRModule.module.css';

interface SupplyChainCompliance {
  organizationId: string;
  complianceScore: number;
  transparencyRequirements: TransparencyRequirement[];
  supplyChainTiers: {
    tier: number;
    supplierCount: number;
    complianceRate: number;
    riskLevel: 'high' | 'medium' | 'low';
  }[];
  disclosureStatus: Record<string, 'compliant' | 'partial' | 'non_compliant'>;
}

export default function SupplyChainModule() {
  const { t } = useTranslation();
  const { error, handleError, clearError } = useErrorHandler();
  const [isLoading, setIsLoading] = useState(true);
  const [compliance, setCompliance] = useState<SupplyChainCompliance | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const loadSupplyChainData = useCallback(async () => {
    try {
      setIsLoading(true);
      clearError();
      
      const stored = localStorage.getItem('supplyChainCompliance');
      let data: SupplyChainCompliance;
      
      if (stored) {
        data = JSON.parse(stored);
      } else {
        data = generateMockSupplyChainData();
        localStorage.setItem('supplyChainCompliance', JSON.stringify(data));
      }
      
      setCompliance(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load Supply Chain compliance data';
      handleError(new Error(`Failed to load Supply Chain compliance data: ${errorMessage}`));
    } finally {
      setIsLoading(false);
    }
  }, [clearError, handleError]);

  useEffect(() => {
    loadSupplyChainData();
  }, [loadSupplyChainData]);

  useEffect(() => {
    if (progressBarRef.current && compliance) {
      progressBarRef.current.style.setProperty('--compliance-score-width', `${compliance.complianceScore}%`);
    }
  }, [compliance]);

  const generateMockSupplyChainData = (): SupplyChainCompliance => {
    const transparencyRequirements: TransparencyRequirement[] = [
      {
        id: '1',
        regulation: 'UK Modern Slavery Act',
        requirement: 'Publish annual modern slavery statement',
        disclosureLevel: 'all',
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'partial'
      },
      {
        id: '2',
        regulation: 'German Supply Chain Act',
        requirement: 'Due diligence obligations for Tier 1 and Tier 2 suppliers',
        disclosureLevel: 'tier2',
        deadline: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'partial'
      },
      {
        id: '3',
        regulation: 'French Duty of Vigilance',
        requirement: 'Vigilance plan covering entire supply chain',
        disclosureLevel: 'all',
        status: 'compliant'
      }
    ];

    return {
      organizationId: 'org-1',
      complianceScore: 68,
      transparencyRequirements,
      supplyChainTiers: [
        {
          tier: 1,
          supplierCount: 45,
          complianceRate: 85,
          riskLevel: 'low'
        },
        {
          tier: 2,
          supplierCount: 120,
          complianceRate: 65,
          riskLevel: 'medium'
        },
        {
          tier: 3,
          supplierCount: 280,
          complianceRate: 45,
          riskLevel: 'high'
        }
      ],
      disclosureStatus: {
        tier1: 'compliant',
        tier2: 'partial',
        tier3: 'non_compliant'
      }
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'non_compliant':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low':
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
                <Link2 className="h-8 w-8 text-purple-600" />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {t('Supply Chain Transparency')}
                </h1>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t('Map supply chain tiers, track transparency requirements, manage supplier data collection, and analyze risk propagation through the supply chain.')}
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
                <Layers className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('Supply Chain Transparency')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supply Chain Tiers */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {t('Supply Chain Tiers')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {compliance.supplyChainTiers.map(tier => (
              <Card key={tier.tier}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {t('Tier {{tier}}', { tier: tier.tier })}
                    </CardTitle>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(tier.riskLevel)}`}>
                      {t(tier.riskLevel)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {t('Supplier Count')}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {tier.supplierCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {t('Compliance Rate')}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${tier.complianceRate}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {tier.complianceRate}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(compliance.disclosureStatus[`tier${tier.tier}`] || 'non_compliant')}`}>
                        {t((compliance.disclosureStatus[`tier${tier.tier}`] || 'non_compliant').replace('_', ' '))}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Transparency Requirements */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('Transparency Requirements')}</CardTitle>
            <CardDescription>
              {t('Track compliance with supply chain transparency regulations')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {compliance.transparencyRequirements.map(requirement => (
                <div 
                  key={requirement.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {requirement.regulation}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(requirement.status)}`}>
                          {t(requirement.status.replace('_', ' '))}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                          {t(requirement.disclosureLevel)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {requirement.requirement}
                      </p>
                    </div>
                  </div>
                  {requirement.deadline && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      {t('Deadline')}: {new Date(requirement.deadline).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <Link to="/supply-chain-mapping">
            <Button className="bg-primary">
              {t('View Supply Chain Map')}
            </Button>
          </Link>
          <Link to="/evidence-workspace">
            <Button variant="outline">
              {t('View Evidence Requirements')}
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}

