import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { 
  Network, 
  MapPin, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  Download,
  Plus,
  Layers
} from 'lucide-react';
import LoadingScreen from '../components/ui/LoadingScreen';
import ErrorAlert from '../components/ui/ErrorAlert';
import GeographicMap from '../components/dashboard/GeographicMap';
import { useErrorHandler } from '../hooks/useErrorHandler';

interface Supplier {
  id: string;
  name: string;
  tier: number;
  country: string;
  sector: string;
  riskScore: number;
  esgScore: number;
  status: 'active' | 'pending' | 'suspended';
  lastAudit?: string;
}

interface SupplyChainMapping {
  organizationId: string;
  suppliers: Supplier[];
  tierStats: {
    tier: number;
    count: number;
    avgRiskScore: number;
    avgEsgScore: number;
  }[];
}

export default function SupplyChainMapping() {
  const { t } = useTranslation();
  const { error, handleError, clearError } = useErrorHandler();
  const [isLoading, setIsLoading] = useState(true);
  const [mapping, setMapping] = useState<SupplyChainMapping | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState<number | 'all'>('all');
  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const loadSupplyChainMapping = useCallback(async () => {
    try {
      setIsLoading(true);
      clearError();
      
      const stored = localStorage.getItem('supplyChainMapping');
      let data: SupplyChainMapping;
      
      if (stored) {
        data = JSON.parse(stored);
      } else {
        data = generateMockMapping();
        localStorage.setItem('supplyChainMapping', JSON.stringify(data));
      }
      
      setMapping(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load supply chain mapping';
      handleError(new Error(`Failed to load supply chain mapping: ${errorMessage}`));
    } finally {
      setIsLoading(false);
    }
  }, [clearError, handleError]);

  useEffect(() => {
    loadSupplyChainMapping();
  }, [loadSupplyChainMapping]);

  const generateMockMapping = (): SupplyChainMapping => {
    const suppliers: Supplier[] = [
      // Tier 1
      { id: 's1', name: 'Textile Manufacturing Co.', tier: 1, country: 'Bangladesh', sector: 'Textiles', riskScore: 65, esgScore: 72, status: 'active', lastAudit: '2024-01-15' },
      { id: 's2', name: 'Electronics Assembly Inc.', tier: 1, country: 'China', sector: 'Electronics', riskScore: 58, esgScore: 68, status: 'active', lastAudit: '2024-02-20' },
      { id: 's3', name: 'Agricultural Cooperative Ltd.', tier: 1, country: 'Brazil', sector: 'Agriculture', riskScore: 72, esgScore: 75, status: 'active', lastAudit: '2024-01-10' },
      // Tier 2
      { id: 's4', name: 'Raw Material Supplier A', tier: 2, country: 'India', sector: 'Mining', riskScore: 78, esgScore: 65, status: 'active' },
      { id: 's5', name: 'Component Manufacturer B', tier: 2, country: 'Vietnam', sector: 'Manufacturing', riskScore: 62, esgScore: 70, status: 'active' },
      { id: 's6', name: 'Logistics Provider C', tier: 2, country: 'Thailand', sector: 'Logistics', riskScore: 55, esgScore: 68, status: 'active' },
      // Tier 3
      { id: 's7', name: 'Sub-supplier X', tier: 3, country: 'Indonesia', sector: 'Textiles', riskScore: 82, esgScore: 58, status: 'active' },
      { id: 's8', name: 'Sub-supplier Y', tier: 3, country: 'Cambodia', sector: 'Manufacturing', riskScore: 75, esgScore: 62, status: 'active' },
    ];

    const tierStats = [1, 2, 3].map(tier => {
      const tierSuppliers = suppliers.filter(s => s.tier === tier);
      return {
        tier,
        count: tierSuppliers.length,
        avgRiskScore: Math.round(tierSuppliers.reduce((sum, s) => sum + s.riskScore, 0) / tierSuppliers.length),
        avgEsgScore: Math.round(tierSuppliers.reduce((sum, s) => sum + s.esgScore, 0) / tierSuppliers.length)
      };
    });

    return {
      organizationId: 'org-1',
      suppliers,
      tierStats
    };
  };

  const filteredSuppliers = mapping?.suppliers.filter(supplier => {
    const matchesSearch = !searchQuery || 
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.sector.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTier = filterTier === 'all' || supplier.tier === filterTier;
    const matchesCountry = filterCountry === 'all' || supplier.country === filterCountry;
    
    return matchesSearch && matchesTier && matchesCountry;
  }) || [];

  const uniqueCountries = Array.from(new Set(mapping?.suppliers.map(s => s.country) || []));

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400';
    return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
  };

  const getEsgColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'suspended':
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

  if (!mapping) {
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
                <Network className="h-8 w-8 text-primary" />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {t('Supply Chain Mapping')}
                </h1>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t('Visualize supply chain tiers, track supplier profiles, monitor risk scores, and analyze ESG performance across your supply chain.')}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" icon={<Download className="h-4 w-4" />}>
                {t('Export')}
              </Button>
              <Button className="bg-primary" icon={<Plus className="h-4 w-4" />}>
                {t('Add Supplier')}
              </Button>
            </div>
          </div>
        </div>

        {/* Tier Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {mapping.tierStats.map(stat => (
            <Card key={stat.tier}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary" />
                    {t('Tier {{tier}}', { tier: stat.tier })}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {t('Supplier Count')}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.count}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        {t('Avg Risk Score')}
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {stat.avgRiskScore}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        {t('Avg ESG Score')}
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {stat.avgEsgScore}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Geographic Map Visualization */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('Geographic Distribution')}</CardTitle>
            <CardDescription>
              {t('Visualize supplier locations and risk distribution across countries')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GeographicMap
              locations={mapping.suppliers.map(s => ({
                id: s.id,
                name: s.name,
                country: s.country,
                riskScore: s.riskScore,
                esgScore: s.esgScore,
                tier: s.tier
              }))}
              onLocationClick={(location) => {
                const supplier = mapping.suppliers.find(s => s.id === location.id);
                if (supplier) {
                  setSelectedSupplier(supplier);
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('Search suppliers...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterTier}
                  onChange={(e) => setFilterTier(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="all">{t('All Tiers')}</option>
                  <option value="1">{t('Tier 1')}</option>
                  <option value="2">{t('Tier 2')}</option>
                  <option value="3">{t('Tier 3')}</option>
                </select>
                <select
                  value={filterCountry}
                  onChange={(e) => setFilterCountry(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="all">{t('All Countries')}</option>
                  {uniqueCountries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supplier List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Supplier Cards */}
          <div className="lg:col-span-2 space-y-4">
            {filteredSuppliers.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Network className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t('No suppliers found')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('Try adjusting your search or filters')}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredSuppliers.map(supplier => (
                <Card 
                  key={supplier.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedSupplier?.id === supplier.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedSupplier(supplier)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {supplier.name}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(supplier.status)}`}>
                            {t(supplier.status)}
                          </span>
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                            {t('Tier {{tier}}', { tier: supplier.tier })}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {supplier.country}
                          </span>
                          <span>{supplier.sector}</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          {t('Risk Score')}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className={`text-lg font-bold ${getRiskColor(supplier.riskScore)}`}>
                            {supplier.riskScore}
                          </span>
                          {supplier.riskScore >= 70 && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          {t('ESG Score')}
                        </p>
                        <span className={`text-lg font-bold ${getEsgColor(supplier.esgScore)}`}>
                          {supplier.esgScore}
                        </span>
                      </div>
                    </div>
                    {supplier.lastAudit && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {t('Last Audit')}: {new Date(supplier.lastAudit).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Supplier Details Panel */}
          <div className="lg:col-span-1">
            {selectedSupplier ? (
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>{t('Supplier Details')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {selectedSupplier.name}
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">{selectedSupplier.country}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">{t('Sector')}: </span>
                          <span className="font-medium">{selectedSupplier.sector}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">{t('Tier')}: </span>
                          <span className="font-medium">{selectedSupplier.tier}</span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {t('Risk Score')}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className={`text-2xl font-bold ${getRiskColor(selectedSupplier.riskScore)}`}>
                              {selectedSupplier.riskScore}
                            </span>
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  selectedSupplier.riskScore >= 70 ? 'bg-red-500' :
                                  selectedSupplier.riskScore >= 50 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${selectedSupplier.riskScore}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {t('ESG Score')}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className={`text-2xl font-bold ${getEsgColor(selectedSupplier.esgScore)}`}>
                              {selectedSupplier.esgScore}
                            </span>
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  selectedSupplier.esgScore >= 80 ? 'bg-green-500' :
                                  selectedSupplier.esgScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${selectedSupplier.esgScore}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Button className="w-full bg-primary">
                        {t('View Full Profile')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Network className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('Select a supplier to view details')}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

