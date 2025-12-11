import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { 
  Users, 
  MapPin, 
  FileCheck, 
  AlertTriangle, 
  CheckCircle2,
  Clock,
  Download,
  Settings,
  Shield
} from 'lucide-react';
import { LaborRiskAssessment, SupplierAudit } from '../../types';
import LoadingScreen from '../../components/ui/LoadingScreen';
import ErrorAlert from '../../components/ui/ErrorAlert';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import styles from './EUDRModule.module.css';

interface ChildLaborCompliance {
  organizationId: string;
  complianceScore: number;
  riskAssessments: LaborRiskAssessment[];
  supplierAudits: SupplierAudit[];
  remediationActions: {
    id: string;
    auditId: string;
    action: string;
    status: 'pending' | 'in_progress' | 'completed';
    deadline?: string;
  }[];
}

export default function ChildLaborModule() {
  const { t } = useTranslation();
  const { error, handleError, clearError } = useErrorHandler();
  const [isLoading, setIsLoading] = useState(true);
  const [compliance, setCompliance] = useState<ChildLaborCompliance | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const loadChildLaborData = useCallback(async () => {
    try {
      setIsLoading(true);
      clearError();
      
      const stored = localStorage.getItem('childLaborCompliance');
      let data: ChildLaborCompliance;
      
      if (stored) {
        data = JSON.parse(stored);
      } else {
        data = generateMockChildLaborData();
        localStorage.setItem('childLaborCompliance', JSON.stringify(data));
      }
      
      setCompliance(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load Child Labor compliance data';
      handleError(new Error(`Failed to load Child Labor compliance data: ${errorMessage}`));
    } finally {
      setIsLoading(false);
    }
  }, [clearError, handleError]);

  useEffect(() => {
    loadChildLaborData();
  }, [loadChildLaborData]);

  useEffect(() => {
    if (progressBarRef.current && compliance) {
      progressBarRef.current.style.setProperty('--compliance-score-width', `${compliance.complianceScore}%`);
    }
  }, [compliance]);

  const generateMockChildLaborData = (): ChildLaborCompliance => {
    const riskAssessments: LaborRiskAssessment[] = [
      {
        id: '1',
        geography: 'Bangladesh',
        sector: 'Textiles',
        riskLevel: 'high',
        factors: ['High child labor prevalence', 'Weak labor law enforcement', 'Poverty indicators'],
        lastAssessed: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        geography: 'Vietnam',
        sector: 'Manufacturing',
        riskLevel: 'medium',
        factors: ['Moderate enforcement', 'Growing economy'],
        lastAssessed: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        geography: 'India',
        sector: 'Agriculture',
        riskLevel: 'high',
        factors: ['Seasonal labor patterns', 'Informal sector', 'Limited oversight'],
        lastAssessed: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const supplierAudits: SupplierAudit[] = [
      {
        id: '1',
        supplierId: 'supp-001',
        supplierName: 'Textile Manufacturing Co.',
        auditType: 'SMETA',
        status: 'completed',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        findings: ['Age verification process needs improvement', 'Working hours documentation incomplete'],
        remediationRequired: true
      },
      {
        id: '2',
        supplierId: 'supp-002',
        supplierName: 'Agricultural Cooperative Ltd.',
        auditType: 'SA8000',
        status: 'in_progress',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        findings: [],
        remediationRequired: false
      },
      {
        id: '3',
        supplierId: 'supp-003',
        supplierName: 'Electronics Assembly Inc.',
        auditType: 'custom',
        status: 'scheduled',
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        findings: [],
        remediationRequired: false
      }
    ];

    return {
      organizationId: 'org-1',
      complianceScore: 72,
      riskAssessments,
      supplierAudits,
      remediationActions: [
        {
          id: 'rem-1',
          auditId: '1',
          action: 'Implement age verification system',
          status: 'in_progress',
          deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'rem-2',
          auditId: '1',
          action: 'Update working hours documentation',
          status: 'pending',
          deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    };
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
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
                <Users className="h-8 w-8 text-blue-600" />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {t('Child Labor & Social Compliance')}
                </h1>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t('Track labor risk assessments, supplier audits, remediation actions, and certifications (SMETA, SA8000) for social compliance requirements.')}
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
                <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('Social Compliance')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Labor Risk Assessments */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {t('Labor Risk Assessments')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {compliance.riskAssessments.map(assessment => (
              <Card key={assessment.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{assessment.geography}</CardTitle>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(assessment.riskLevel)}`}>
                      {t(assessment.riskLevel)}
                    </span>
                  </div>
                  <CardDescription>
                    {assessment.sector}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {t('Risk Factors')}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {assessment.factors.map((factor, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs"
                          >
                            {factor}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      {t('Last assessed')}: {new Date(assessment.lastAssessed).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Supplier Audits */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('Supplier Audits')}</CardTitle>
            <CardDescription>
              {t('Track audit status, findings, and remediation requirements')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {compliance.supplierAudits.map(audit => (
                <div 
                  key={audit.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {audit.supplierName}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(audit.status)}`}>
                          {t(audit.status.replace('_', ' '))}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                          {audit.auditType}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {t('Supplier ID')}: {audit.supplierId}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t('Audit Date')}: {new Date(audit.date).toLocaleDateString()}
                      </p>
                    </div>
                    {audit.remediationRequired && (
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                    )}
                  </div>
                  {audit.findings.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        {t('Findings')}:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        {audit.findings.map((finding, idx) => (
                          <li key={idx}>{finding}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Remediation Actions */}
        {compliance.remediationActions.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t('Remediation Actions')}</CardTitle>
              <CardDescription>
                {t('Track required remediation actions from audit findings')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {compliance.remediationActions.map(action => (
                  <div 
                    key={action.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {action.action}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {t('Related to Audit')}: {compliance.supplierAudits.find(a => a.id === action.auditId)?.supplierName}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(action.status)}`}>
                        {t(action.status.replace('_', ' '))}
                      </span>
                    </div>
                    {action.deadline && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4" />
                        {t('Deadline')}: {new Date(action.deadline).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

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

