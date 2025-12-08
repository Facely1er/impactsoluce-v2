import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { 
  FolderOpen, 
  Upload, 
  Search, 
  Filter, 
  Download, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  FileText,
  Shield,
  TrendingUp,
  BarChart3,
  Eye,
  Plus
} from 'lucide-react';
import { EvidenceInventory, EvidenceItem, ReadinessSnapshot } from '../types';
import { calculateReadiness, identifyGaps, calculateCoverageByPillar, calculateCoverageByRegulation } from '../utils/evidenceEngine';
import { Link } from 'react-router-dom';
import LoadingScreen from '../components/ui/LoadingScreen';
import ErrorAlert from '../components/ui/ErrorAlert';
import { useErrorHandler } from '../hooks/useErrorHandler';

export default function EvidenceWorkspace() {
  const { t } = useTranslation();
  const { error, handleError, clearError } = useErrorHandler();
  const [isLoading, setIsLoading] = useState(true);
  const [inventory, setInventory] = useState<EvidenceInventory | null>(null);
  const [readiness, setReadiness] = useState<ReadinessSnapshot | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'environmental' | 'social' | 'governance'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'complete' | 'partial' | 'missing' | 'expired'>('all');

  useEffect(() => {
    loadEvidenceInventory();
  }, []);

  const loadEvidenceInventory = async () => {
    try {
      setIsLoading(true);
      clearError();
      
      // Load from local storage or generate mock data
      const stored = localStorage.getItem('evidenceInventory');
      let data: EvidenceInventory;
      
      if (stored) {
        data = JSON.parse(stored);
      } else {
        // Generate mock inventory
        data = generateMockInventory();
        localStorage.setItem('evidenceInventory', JSON.stringify(data));
      }
      
      // Calculate readiness
      const readinessSnapshot = calculateReadiness(data);
      setReadiness(readinessSnapshot);
      setInventory(data);
    } catch (err) {
      handleError(err as Error, 'Failed to load evidence inventory');
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockInventory = (): EvidenceInventory => {
    const now = new Date().toISOString();
    const items: EvidenceItem[] = [
      {
        id: '1',
        title: 'Environmental Policy Document',
        description: 'Company environmental policy and commitments',
        type: 'policy',
        category: 'environmental',
        status: 'complete',
        uploadedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString(),
        file: {
          name: 'environmental-policy.pdf',
          type: 'application/pdf',
          size: 245000,
          url: '#'
        },
        metadata: {
          framework: ['GRI', 'TCFD'],
          regulation: ['CSRD'],
          tags: ['policy', 'environmental'],
          version: '2.1',
          author: 'Sustainability Team'
        },
        linkedTo: [],
        readinessScore: 95
      },
      {
        id: '2',
        title: 'Carbon Emissions Report 2024',
        description: 'Annual carbon footprint assessment',
        type: 'report',
        category: 'environmental',
        status: 'complete',
        uploadedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        file: {
          name: 'carbon-report-2024.pdf',
          type: 'application/pdf',
          size: 1250000,
          url: '#'
        },
        metadata: {
          framework: ['GHG Protocol', 'TCFD'],
          regulation: ['CSRD', 'EU Taxonomy'],
          tags: ['carbon', 'emissions', 'climate'],
          version: '1.0'
        },
        linkedTo: [],
        readinessScore: 90
      },
      {
        id: '3',
        title: 'Labor Rights Policy',
        description: 'Human rights and labor standards policy',
        type: 'policy',
        category: 'social',
        status: 'complete',
        uploadedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        file: {
          name: 'labor-rights-policy.pdf',
          type: 'application/pdf',
          size: 180000,
          url: '#'
        },
        metadata: {
          framework: ['UN Guiding Principles'],
          regulation: ['UK Modern Slavery Act'],
          tags: ['labor', 'human-rights'],
          version: '1.2'
        },
        linkedTo: [],
        readinessScore: 88
      },
      {
        id: '4',
        title: 'Supplier Audit Report',
        description: 'Third-party supplier audit results',
        type: 'audit',
        category: 'social',
        status: 'partial',
        uploadedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000).toISOString(),
        file: {
          name: 'supplier-audit-2024.pdf',
          type: 'application/pdf',
          size: 890000,
          url: '#'
        },
        metadata: {
          framework: ['SMETA'],
          regulation: ['EUDR'],
          tags: ['supply-chain', 'audit'],
          version: '1.0'
        },
        linkedTo: [],
        readinessScore: 65
      },
      {
        id: '5',
        title: 'Board Governance Charter',
        description: 'Corporate governance framework',
        type: 'document',
        category: 'governance',
        status: 'complete',
        uploadedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        file: {
          name: 'governance-charter.pdf',
          type: 'application/pdf',
          size: 320000,
          url: '#'
        },
        metadata: {
          framework: ['OECD Principles'],
          tags: ['governance', 'board'],
          version: '3.0'
        },
        linkedTo: [],
        readinessScore: 92
      }
    ];

    const byPillar = calculateCoverageByPillar(items);
    const byRegulation = calculateCoverageByRegulation(items);
    const gaps = identifyGaps(
      {
        organizationId: 'org-1',
        lastUpdated: now,
        items,
        coverage: { byPillar, byRegulation, byFramework: {} },
        gaps: [],
        readiness: {
          timestamp: now,
          overall: 0,
          byPillar: { environmental: 0, social: 0, governance: 0 },
          byRegulation: {},
          trends: [],
          nextReviewDate: now
        }
      },
      []
    );

    return {
      organizationId: 'org-1',
      lastUpdated: now,
      items,
      coverage: {
        byPillar,
        byRegulation,
        byFramework: {}
      },
      gaps,
      readiness: {
        timestamp: now,
        overall: 0,
        byPillar: { environmental: 0, social: 0, governance: 0 },
        byRegulation: {},
        trends: [],
        nextReviewDate: now
      }
    };
  };

  const filteredItems = inventory?.items.filter(item => {
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'missing':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'expired':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'environmental':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'social':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'governance':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
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
          <ErrorAlert message={error} onClose={clearError} />
        </div>
      </Layout>
    );
  }

  if (!inventory || !readiness) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {t('Evidence Readiness Workspace')}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t('Centralized space to organize, assess, and evidence your sustainability posture')}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" icon={<Download className="h-4 w-4" />}>
                {t('Export')}
              </Button>
              <Button className="bg-primary" icon={<Plus className="h-4 w-4" />}>
                {t('Add Evidence')}
              </Button>
            </div>
          </div>
        </div>

        {/* Readiness Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('Overall Readiness')}</span>
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {readiness.overall}%
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${readiness.overall}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('Environmental')}</span>
                <BarChart3 className="h-5 w-5 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {readiness.byPillar.environmental}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {inventory.coverage.byPillar.environmental.complete} / {inventory.coverage.byPillar.environmental.total} {t('complete')}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('Social')}</span>
                <TrendingUp className="h-5 w-5 text-purple-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {readiness.byPillar.social}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {inventory.coverage.byPillar.social.complete} / {inventory.coverage.byPillar.social.total} {t('complete')}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('Governance')}</span>
                <CheckCircle2 className="h-5 w-5 text-indigo-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {readiness.byPillar.governance}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {inventory.coverage.byPillar.governance.complete} / {inventory.coverage.byPillar.governance.total} {t('complete')}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('Search evidence...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="all">{t('All Categories')}</option>
                  <option value="environmental">{t('Environmental')}</option>
                  <option value="social">{t('Social')}</option>
                  <option value="governance">{t('Governance')}</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="all">{t('All Status')}</option>
                  <option value="complete">{t('Complete')}</option>
                  <option value="partial">{t('Partial')}</option>
                  <option value="missing">{t('Missing')}</option>
                  <option value="expired">{t('Expired')}</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Evidence Gaps Alert */}
        {inventory.gaps.length > 0 && (
          <Card className="mb-6 border-orange-200 dark:border-orange-900/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {t('Evidence Gaps Identified')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('{{count}} evidence gaps require attention', { count: inventory.gaps.length })}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  {t('View Gaps')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Evidence List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredItems.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {t('No evidence found')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {t('Try adjusting your search or filters')}
                </p>
                <Button className="bg-primary" icon={<Plus className="h-4 w-4" />}>
                  {t('Add Evidence')}
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {item.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {t(item.status)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                          {t(item.category)}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {item.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                        {item.file && (
                          <span className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {item.file.name}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(item.uploadedAt).toLocaleDateString()}
                        </span>
                        {item.expiresAt && (
                          <span className="flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {t('Expires')}: {new Date(item.expiresAt).toLocaleDateString()}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <BarChart3 className="h-4 w-4" />
                          {t('Readiness')}: {item.readinessScore}%
                        </span>
                      </div>
                      {item.metadata.regulation && item.metadata.regulation.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {item.metadata.regulation.map((reg, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                              {reg}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm" icon={<Eye className="h-4 w-4" />}>
                        {t('View')}
                      </Button>
                      <Button variant="outline" size="sm" icon={<Download className="h-4 w-4" />}>
                        {t('Download')}
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

