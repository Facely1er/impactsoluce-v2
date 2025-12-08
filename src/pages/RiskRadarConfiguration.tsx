import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';
import ErrorAlert from '../components/ui/ErrorAlert';
import { ArrowRight, CheckCircle2, MapPin, Building, Network } from 'lucide-react';
import { RiskRadarConfig } from '../types';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { validateRiskRadarConfig, sanitizeRiskRadarConfig, parseRiskRadarConfig } from '../utils/riskRadarValidation';

export default function RiskRadarConfiguration() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { error, handleError, clearError } = useErrorHandler();
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<RiskRadarConfig>({
    geographies: [],
    supplyChainTiers: 1
  });
  const [isSaving, setIsSaving] = useState(false);

  // Load existing configuration if available
  useEffect(() => {
    const configStr = localStorage.getItem('riskRadarConfig');
    const { config, error } = parseRiskRadarConfig(configStr);
    
    if (error) {
      // Invalid config, start fresh - only show error if it's a parsing error
      handleError(new Error(t('Failed to load saved configuration: {{error}}', { error })));
      return;
    }
    
    if (config) {
      setConfig(config);
      // Determine which step to show based on what's configured
      if (config.sectorCode && config.geographies && config.geographies.length > 0) {
        setStep(3);
      } else if (config.sectorCode) {
        setStep(2);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sectors = [
    { code: 'A', name: 'Agriculture, Forestry and Fishing' },
    { code: 'B', name: 'Mining and Quarrying' },
    { code: 'C', name: 'Manufacturing' },
    { code: 'D', name: 'Electricity, Gas, Steam and Air Conditioning Supply' },
    { code: 'E', name: 'Water Supply; Sewerage, Waste Management' },
    { code: 'F', name: 'Construction' },
    { code: 'G', name: 'Wholesale and Retail Trade' },
    { code: 'H', name: 'Transportation and Storage' },
    { code: 'I', name: 'Accommodation and Food Service Activities' },
    { code: 'J', name: 'Information and Communication' },
    { code: 'K', name: 'Financial and Insurance Activities' },
    { code: 'L', name: 'Real Estate Activities' },
    { code: 'M', name: 'Professional, Scientific and Technical Activities' },
    { code: 'N', name: 'Administrative and Support Service Activities' },
    { code: 'O', name: 'Public Administration and Defence' },
    { code: 'P', name: 'Education' },
    { code: 'Q', name: 'Human Health and Social Work Activities' },
    { code: 'R', name: 'Arts, Entertainment and Recreation' },
    { code: 'S', name: 'Other Service Activities' },
  ];

  const regions = [
    { code: 'EU', name: 'European Union', countries: ['Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Poland'] },
    { code: 'US', name: 'United States', countries: ['United States'] },
    { code: 'UK', name: 'United Kingdom', countries: ['United Kingdom'] },
    { code: 'APAC', name: 'Asia Pacific', countries: ['China', 'Japan', 'India', 'Australia', 'South Korea', 'Singapore'] },
    { code: 'LATAM', name: 'Latin America', countries: ['Brazil', 'Mexico', 'Argentina', 'Chile', 'Colombia'] },
    { code: 'MEA', name: 'Middle East & Africa', countries: ['UAE', 'Saudi Arabia', 'South Africa', 'Egypt'] },
  ];

  const handleSectorSelect = (sectorCode: string) => {
    setConfig({ ...config, sectorCode });
    setStep(2);
  };

  const handleGeographyToggle = (regionCode: string) => {
    const geographies = config.geographies || [];
    if (geographies.includes(regionCode)) {
      setConfig({ ...config, geographies: geographies.filter(g => g !== regionCode) });
    } else {
      setConfig({ ...config, geographies: [...geographies, regionCode] });
    }
  };

  const handleSupplyChainTiers = (tiers: number) => {
    setConfig({ ...config, supplyChainTiers: tiers });
  };

  const handleSave = async () => {
    setIsSaving(true);
    clearError();

    try {
      // Sanitize and validate configuration
      const sanitized = sanitizeRiskRadarConfig(config);
      const validation = validateRiskRadarConfig(sanitized);

      if (!validation.valid) {
        // Navigate to appropriate step based on first error
        if (!sanitized.sectorCode) {
          setStep(1);
        } else if (!sanitized.geographies || sanitized.geographies.length === 0) {
          setStep(2);
        } else {
          setStep(3);
        }
        
        handleError(new Error(validation.errors.join(', ')));
        setIsSaving(false);
        return;
      }

      const configToSave: RiskRadarConfig = {
        ...sanitized,
        updatedAt: new Date().toISOString(),
        createdAt: sanitized.createdAt || new Date().toISOString()
      };
      
      localStorage.setItem('riskRadarConfig', JSON.stringify(configToSave));
      
      // Small delay to show success state
      await new Promise(resolve => setTimeout(resolve, 300));
      
      navigate('/risk-radar');
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : t('Failed to save configuration');
      handleError(new Error(errorMessage));
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('Configure Impact Risk Radar™')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t('Tell us about your organization to generate accurate exposure analysis.')}
            </p>
          </div>

          {error && (
            <ErrorAlert
              message={error.message || t('An error occurred')}
              onClose={clearError}
              className="mb-6"
            />
          )}

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((s) => (
                <React.Fragment key={s}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step >= s
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                      }`}
                    >
                      {step > s ? <CheckCircle2 className="h-6 w-6" /> : s}
                    </div>
                    <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">
                      {s === 1 ? t('Sector') : s === 2 ? t('Geography') : t('Supply Chain')}
                    </p>
                  </div>
                  {s < 3 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        step > s ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Step 1: Sector Selection */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  {t('Select Your Primary Sector')}
                </CardTitle>
                <CardDescription>
                  {t('Choose the sector that best describes your organization\'s primary business activity.')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {sectors.map((sector) => (
                    <button
                      key={sector.code}
                      onClick={() => handleSectorSelect(sector.code)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                        config.sectorCode === sector.code
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {sector.code} - {sector.name}
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Geography Selection */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {t('Select Operating Geographies')}
                </CardTitle>
                <CardDescription>
                  {t('Select all regions where your organization operates or has suppliers.')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regions.map((region) => (
                    <div
                      key={region.code}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        config.geographies?.includes(region.code)
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                      }`}
                      onClick={() => handleGeographyToggle(region.code)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {region.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {region.countries.join(', ')}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={config.geographies?.includes(region.code) || false}
                          onChange={() => handleGeographyToggle(region.code)}
                          className="h-5 w-5 text-primary rounded"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex gap-4">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    {t('Back')}
                  </Button>
                  <Button
                    className="bg-primary"
                    onClick={() => setStep(3)}
                    disabled={!config.geographies || config.geographies.length === 0}
                  >
                    {t('Continue')}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Supply Chain Tiers */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  {t('Supply Chain Analysis Depth')}
                </CardTitle>
                <CardDescription>
                  {t('How many tiers of suppliers should we analyze? Tier 1 = direct suppliers, Tier 2 = suppliers\' suppliers, etc.')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((tier) => (
                    <button
                      key={tier}
                      onClick={() => handleSupplyChainTiers(tier)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                        config.supplyChainTiers === tier
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {t('Tier {{tier}}', { tier })}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {tier === 1
                              ? t('Direct suppliers only')
                              : tier === 2
                              ? t('Direct suppliers + Tier 2')
                              : tier === 3
                              ? t('Up to Tier 3 suppliers')
                              : t('Full supply chain analysis')}
                          </p>
                        </div>
                        {config.supplyChainTiers === tier && (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex gap-4">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    {t('Back')}
                  </Button>
                  <Button 
                    className="bg-primary" 
                    onClick={handleSave}
                    disabled={isSaving}
                    loading={isSaving}
                  >
                    {t('Save & Generate Analysis')}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}

