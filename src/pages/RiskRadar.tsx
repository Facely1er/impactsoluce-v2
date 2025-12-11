import { useState, useEffect, CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import ErrorAlert from '../components/ui/ErrorAlert';
import { 
  Radar, 
  AlertTriangle, 
  MapPin, 
  TrendingUp, 
  Settings,
  Download,
  RefreshCw,
  Info
} from 'lucide-react';
import { RiskRadarOutput } from '../types';
import { Link } from 'react-router-dom';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { parseRiskRadarConfig } from '../utils/riskRadarValidation';

export default function RiskRadar() {
  const { t } = useTranslation();
  const { error, handleError, clearError } = useErrorHandler();
  const [isConfigured, setIsConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [riskRadarData, setRiskRadarData] = useState<RiskRadarOutput | null>(null);

  // Check configuration and load data
  useEffect(() => {
    const configStr = localStorage.getItem('riskRadarConfig');
    const { config, error } = parseRiskRadarConfig(configStr);
    
    if (error) {
      handleError(new Error(t('Invalid configuration: {{error}}', { error })));
      setIsConfigured(false);
      return;
    }
    
    if (config) {
      setIsConfigured(true);
      loadMockData();
    } else {
      setIsConfigured(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMockData = async () => {
    setIsLoading(true);
    clearError();
    
    try {
      // Simulate API call with proper error handling
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const configStr = localStorage.getItem('riskRadarConfig');
      if (!configStr) {
        throw new Error('Configuration not found');
      }
      
      const { config, error } = parseRiskRadarConfig(configStr);
      
      if (error || !config) {
        throw new Error(error || t('Invalid configuration'));
      }
      const mockData: RiskRadarOutput = {
        organizationId: 'demo-org',
        generatedAt: new Date().toISOString(),
        overallExposure: {
          environmental: {
            level: 'high',
            score: 72,
            signals: [
              {
                id: '1',
                type: 'environmental',
                category: 'climate',
                severity: 'high',
                description: 'High carbon footprint in supply chain',
                source: 'Sector Analysis',
                timestamp: new Date().toISOString(),
                relatedRegulation: 'CSRD',
                evidenceRequired: true
              }
            ]
          },
          social: {
            level: 'medium',
            score: 58,
            signals: []
          },
          governance: {
            level: 'low',
            score: 42,
            signals: []
          },
          regulatory: {
            level: 'high',
            score: 75,
            signals: []
          }
        },
        exposureSignals: [
          {
            id: '1',
            type: 'environmental',
            category: 'climate',
            severity: 'high',
            description: 'High carbon footprint in supply chain',
            source: 'Sector Analysis',
            timestamp: new Date().toISOString(),
            relatedRegulation: 'CSRD',
            evidenceRequired: true
          },
          {
            id: '2',
            type: 'regulatory',
            category: 'EUDR',
            severity: 'critical',
            description: 'EU Deforestation Regulation applies to your commodities',
            source: 'Regulatory Intelligence',
            timestamp: new Date().toISOString(),
            relatedRegulation: 'EUDR',
            evidenceRequired: true
          }
        ],
        regulatoryPressure: [
          {
            region: 'EU',
            intensity: 85,
            regulations: []
          },
          {
            region: 'US',
            intensity: 65,
            regulations: []
          }
        ],
        riskHotspots: [
          {
            geography: 'Brazil',
            sector: 'Agriculture',
            riskLevel: 'high',
            factors: ['Deforestation risk', 'Labor compliance']
          }
        ]
      };
      setRiskRadarData(mockData);
      setIsLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : t('Failed to load Risk Radar data');
      handleError(new Error(errorMessage));
      setIsLoading(false);
      setIsConfigured(false);
    }
  };

  const handleRefresh = () => {
    loadMockData();
  };

  const handleExport = () => {
    try {
      if (!riskRadarData) {
        throw new Error(t('No data to export'));
      }
      
      const dataStr = JSON.stringify(riskRadarData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `risk-radar-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : t('Failed to export data');
      handleError(new Error(errorMessage));
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
      case 'high':
        return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getExposureColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (!isConfigured) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-8">
              <Radar className="h-16 w-16 text-primary mx-auto mb-4" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t('Impact Risk Radar™')}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                {t('Instantly convert your sector, geography, and supply-chain footprint into a clear ESG exposure view. See environmental pressure signals, social risk alerts, governance credibility gaps, and regulatory pressure intensity by region.')}
              </p>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{t('Get Started')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {t('To begin, we need to understand your organization\'s profile:')}
                </p>
                <ul className="text-left space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{t('Sector & Industry')}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{t('Your primary business sector')}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{t('Operating Geographies')}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{t('Countries and regions where you operate')}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{t('Supply Chain Tiers')}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{t('How many tiers of suppliers to analyze')}</p>
                    </div>
                  </li>
                </ul>
                <Link to="/risk-radar/configure">
                  <Button className="w-full bg-primary">
                    <Settings className="h-4 w-4 mr-2" />
                    {t('Configure Risk Radar')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">
              {t('Analyzing exposure...')}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!riskRadarData) {
    return null;
  }

  const criticalSignals = riskRadarData.exposureSignals.filter(s => s.severity === 'critical');
  const highSignals = riskRadarData.exposureSignals.filter(s => s.severity === 'high');
  const mediumSignals = riskRadarData.exposureSignals.filter(s => s.severity === 'medium');

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Radar className="h-8 w-8 text-primary" />
              {t('Impact Risk Radar™')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {t('Last updated: {{date}}', { date: new Date(riskRadarData.generatedAt).toLocaleDateString() })}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            <Button variant="outline" onClick={handleRefresh} disabled={isLoading} size="sm">
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {t('Refresh')}
            </Button>
            <Button variant="outline" onClick={handleExport} disabled={!riskRadarData} size="sm">
              <Download className="h-4 w-4 mr-2" />
              {t('Export')}
            </Button>
            <Link to="/risk-radar/configure">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                {t('Configure')}
              </Button>
            </Link>
          </div>
        </div>

        {error && (
          <ErrorAlert
            message={error.message || t('An error occurred')}
            onClose={clearError}
            className="mb-6"
          />
        )}

        {/* Overall Exposure */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Object.entries(riskRadarData.overallExposure).map(([key, exposure]) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                  {key}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {exposure.score}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(exposure.level)}`}>
                    {exposure.level}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  {/* Dynamic width requires inline style - acceptable for progress bars */}
                  <div
                    className={`h-2 rounded-full progress-bar ${getExposureColor(exposure.level)}`}
                    style={{ '--progress-width': `${exposure.score}%` } as CSSProperties & { '--progress-width': string }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {exposure.signals.length} {t('signals')}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Exposure Signals */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('Exposure Signals')}</CardTitle>
              <div className="flex gap-2 text-sm">
                <span className="text-red-600 dark:text-red-400 font-medium">
                  {t('Critical: {{count}}', { count: criticalSignals.length })}
                </span>
                <span className="text-gray-400">|</span>
                <span className="text-orange-600 dark:text-orange-400 font-medium">
                  {t('High: {{count}}', { count: highSignals.length })}
                </span>
                <span className="text-gray-400">|</span>
                <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                  {t('Medium: {{count}}', { count: mediumSignals.length })}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskRadarData.exposureSignals.map((signal) => (
                <div
                  key={signal.id}
                  className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${getSeverityColor(signal.severity)}`}>
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {signal.description}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {signal.category} • {signal.source}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(signal.severity)}`}>
                        {signal.severity}
                      </span>
                    </div>
                    {signal.relatedRegulation && (
                      <div className="mt-2 flex items-center gap-2">
                        <Info className="h-4 w-4 text-gray-400" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {t('Related regulation: {{regulation}}', { regulation: signal.relatedRegulation })}
                        </span>
                        {signal.evidenceRequired && (
                          <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                            • {t('Evidence required')}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Regulatory Pressure */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>{t('Regulatory Pressure by Region')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskRadarData.regulatoryPressure.map((pressure, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {pressure.region}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {pressure.intensity}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      {/* Dynamic width requires inline style - acceptable for progress bars */}
                      <div
                        className={`h-2 rounded-full progress-bar ${
                          pressure.intensity >= 75 ? 'bg-red-500' :
                          pressure.intensity >= 50 ? 'bg-orange-500' :
                          pressure.intensity >= 25 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ '--progress-width': `${pressure.intensity}%` } as CSSProperties & { '--progress-width': string }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Risk Hotspots */}
          <Card>
            <CardHeader>
              <CardTitle>{t('Risk Hotspots')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskRadarData.riskHotspots.map((hotspot, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {hotspot.geography}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {hotspot.sector}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(hotspot.riskLevel)}`}>
                        {hotspot.riskLevel}
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        {t('Risk factors:')}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {hotspot.factors.map((factor, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 rounded"
                          >
                            {factor}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>{t('Next Steps')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t('Based on your exposure analysis, review your evidence readiness and identify gaps.')}
            </p>
            <Link to="/evidence-workspace">
              <Button className="bg-primary">
                {t('Go to Evidence Workspace')}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

