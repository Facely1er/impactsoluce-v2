import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { 
  TreePine, 
  MapPin, 
  FileCheck, 
  AlertTriangle, 
  CheckCircle2,
  Clock,
  Download,
  Settings
} from 'lucide-react';
import { EUDRCommodity, EUDRCompliance } from '../../types';
import LoadingScreen from '../../components/ui/LoadingScreen';
import ErrorAlert from '../../components/ui/ErrorAlert';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import styles from './EUDRModule.module.css';

export default function EUDRModule() {
  const { t } = useTranslation();
  const { error, handleError, clearError } = useErrorHandler();
  const [isLoading, setIsLoading] = useState(true);
  const [compliance, setCompliance] = useState<EUDRCompliance | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const loadEUDRData = useCallback(async () => {
    try {
      setIsLoading(true);
      clearError();
      
      // Load from local storage or generate mock data
      const stored = localStorage.getItem('eudrCompliance');
      let data: EUDRCompliance;
      
      if (stored) {
        data = JSON.parse(stored);
      } else {
        data = generateMockEUDRData();
        localStorage.setItem('eudrCompliance', JSON.stringify(data));
      }
      
      setCompliance(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load EUDR compliance data';
      handleError(new Error(`Failed to load EUDR compliance data: ${errorMessage}`));
    } finally {
      setIsLoading(false);
    }
  }, [clearError, handleError]);

  useEffect(() => {
    loadEUDRData();
  }, [loadEUDRData]);

  useEffect(() => {
    if (progressBarRef.current && compliance) {
      progressBarRef.current.style.setProperty('--compliance-score-width', `${compliance.complianceScore}%`);
    }
  }, [compliance]);

  const generateMockEUDRData = (): EUDRCompliance => {
    const commodities: EUDRCommodity[] = [
      {
        id: '1',
        name: 'Cocoa',
        code: 'COCOA',
        covered: true,
        supplyChain: {
          origin: [
            { id: 'gh', name: 'Ghana', code: 'GH', region: 'Africa', regulatoryIntensity: { environmental: 75, social: 80, governance: 70 }, activeRegulations: [], upcomingRegulations: [] },
            { id: 'ci', name: 'Côte d\'Ivoire', code: 'CI', region: 'Africa', regulatoryIntensity: { environmental: 70, social: 75, governance: 65 }, activeRegulations: [], upcomingRegulations: [] }
          ],
          volume: 1250,
          riskLevel: 'high'
        }
      },
      {
        id: '2',
        name: 'Coffee',
        code: 'COFFEE',
        covered: true,
        supplyChain: {
          origin: [
            { id: 'br', name: 'Brazil', code: 'BR', region: 'South America', regulatoryIntensity: { environmental: 65, social: 70, governance: 75 }, activeRegulations: [], upcomingRegulations: [] },
            { id: 'co', name: 'Colombia', code: 'CO', region: 'South America', regulatoryIntensity: { environmental: 70, social: 75, governance: 80 }, activeRegulations: [], upcomingRegulations: [] }
          ],
          volume: 850,
          riskLevel: 'medium'
        }
      },
      {
        id: '3',
        name: 'Palm Oil',
        code: 'PALM',
        covered: true,
        supplyChain: {
          origin: [
            { id: 'my', name: 'Malaysia', code: 'MY', region: 'Asia', regulatoryIntensity: { environmental: 80, social: 70, governance: 75 }, activeRegulations: [], upcomingRegulations: [] },
            { id: 'id', name: 'Indonesia', code: 'ID', region: 'Asia', regulatoryIntensity: { environmental: 85, social: 65, governance: 70 }, activeRegulations: [], upcomingRegulations: [] }
          ],
          volume: 2100,
          riskLevel: 'high'
        }
      }
    ];

    return {
      organizationId: 'org-1',
      commodities,
      dueDiligence: {
        status: 'in_progress',
        evidence: [],
        gaps: [
          {
            id: 'gap-1',
            category: 'environmental',
            regulation: 'EUDR',
            requirement: 'Geolocation data for all covered commodities',
            severity: 'high',
            description: 'Missing geolocation coordinates for 40% of supply chain origins',
            evidenceNeeded: ['geolocation_data', 'satellite_imagery'],
            deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      },
      geolocationData: [
        {
          commodity: 'Cocoa',
          coordinates: [
            { lat: 6.5244, lng: -1.2156 },
            { lat: 7.9465, lng: -1.0232 }
          ],
          date: new Date().toISOString()
        }
      ],
      complianceScore: 65
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
                <TreePine className="h-8 w-8 text-green-600" />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {t('EU Deforestation Regulation (EUDR)')}
                </h1>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t('Track compliance for EUDR covering commodities: cattle, cocoa, coffee, palm oil, rubber, soya, and wood. Monitor due diligence, geolocation data, and evidence requirements.')}
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
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(compliance.dueDiligence.status)}`}>
                  {t(compliance.dueDiligence.status.replace('_', ' '))}
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {t('Due Diligence Status')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Covered Commodities */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {t('Covered Commodities')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {compliance.commodities.map(commodity => (
              <Card key={commodity.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{commodity.name}</CardTitle>
                    {commodity.covered && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <CardDescription>
                    {t('Code')}: {commodity.code}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {t('Volume')}
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {commodity.supplyChain.volume.toLocaleString()} {t('tons')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {t('Risk Level')}
                      </p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(commodity.supplyChain.riskLevel)}`}>
                        {t(commodity.supplyChain.riskLevel)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {t('Origins')}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {commodity.supplyChain.origin.map(geo => (
                          <span 
                            key={geo.id}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs"
                          >
                            {geo.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Due Diligence Requirements */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('Due Diligence Requirements')}</CardTitle>
            <CardDescription>
              {t('Track evidence and gaps for EUDR due diligence obligations')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileCheck className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {t('Due Diligence Status')}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('Evidence collection and verification')}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(compliance.dueDiligence.status)}`}>
                  {t(compliance.dueDiligence.status.replace('_', ' '))}
                </span>
              </div>

              {compliance.dueDiligence.gaps.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    {t('Evidence Gaps')}
                  </h3>
                  <div className="space-y-3">
                    {compliance.dueDiligence.gaps.map(gap => (
                      <div 
                        key={gap.id}
                        className="p-4 border border-orange-200 dark:border-orange-900/50 rounded-lg bg-orange-50 dark:bg-orange-900/20"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {gap.requirement}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {gap.description}
                              </p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            gap.severity === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                            gap.severity === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}>
                            {t(gap.severity)}
                          </span>
                        </div>
                        {gap.deadline && (
                          <div className="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="h-4 w-4" />
                            {t('Deadline')}: {new Date(gap.deadline).toLocaleDateString()}
                          </div>
                        )}
                        <div className="mt-2 flex flex-wrap gap-2">
                          {gap.evidenceNeeded.map((evidence, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-1 bg-white dark:bg-gray-800 rounded text-xs"
                            >
                              {evidence}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Geolocation Data */}
        {compliance.geolocationData.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <CardTitle>{t('Geolocation Data')}</CardTitle>
              </div>
              <CardDescription>
                {t('Tracked geolocation coordinates for covered commodities')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {compliance.geolocationData.map((geo, idx) => (
                  <div 
                    key={idx}
                    className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {geo.commodity}
                      </p>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(geo.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {geo.coordinates.map((coord, coordIdx) => (
                        <span 
                          key={coordIdx}
                          className="px-2 py-1 bg-white dark:bg-gray-800 rounded text-xs font-mono"
                        >
                          {coord.lat.toFixed(4)}, {coord.lng.toFixed(4)}
                        </span>
                      ))}
                    </div>
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

