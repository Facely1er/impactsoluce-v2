import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { 
  BarChart3, 
  Download, 
  FileText, 
  Filter,
  Search,
  Calendar,
  Share2,
  ArrowRight,
  CheckCircle2,
  Clock,
  Users
} from 'lucide-react';
import Button from '../components/ui/Button';
import { useAssessmentData } from '../hooks/useAssessmentData';

export default function Reports() {
  const { t } = useTranslation();
  const { history, isLoading } = useAssessmentData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  // Report types
  const reportTypes = [
    { id: 'all', name: t('All Reports') },
    { id: 'assessment', name: t('Assessment Reports') },
    { id: 'carbon', name: t('Carbon Reports') },
    { id: 'compliance', name: t('Compliance Reports') },
    { id: 'custom', name: t('Custom Reports') },
  ];

  // Time periods
  const timePeriods = [
    { id: 'all', name: t('All Time') },
    { id: 'month', name: t('Last Month') },
    { id: 'quarter', name: t('Last Quarter') },
    { id: 'year', name: t('Last Year') },
  ];

  // Mock reports data
  const reports = [
    {
      id: '1',
      title: t('Q1 2024 ESG Assessment Report'),
      type: 'assessment',
      date: '2024-03-31',
      status: 'completed',
      format: 'PDF',
      size: '2.4 MB',
      author: 'Sarah Johnson',
      description: t('Comprehensive ESG assessment results for Q1 2024 with benchmarking against industry standards.'),
    },
    {
      id: '2',
      title: t('Annual Carbon Footprint Report 2023'),
      type: 'carbon',
      date: '2024-02-15',
      status: 'completed',
      format: 'PDF',
      size: '3.8 MB',
      author: 'Michael Chen',
      description: t('Annual analysis of carbon emissions across all operations with reduction recommendations.'),
    },
    {
      id: '3',
      title: t('CSRD Compliance Readiness Report'),
      type: 'compliance',
      date: '2024-01-20',
      status: 'completed',
      format: 'PDF',
      size: '5.2 MB',
      author: 'Emma Rodriguez',
      description: t('Gap analysis and readiness assessment for Corporate Sustainability Reporting Directive compliance.'),
    },
    {
      id: '4',
      title: t('Technology Dependency Sustainability Analysis'),
      type: 'custom',
      date: '2023-12-10',
      status: 'completed',
      format: 'PDF',
      size: '4.1 MB',
      author: 'David Park',
      description: t('Analysis of environmental impact of technology infrastructure with optimization recommendations.'),
    },
    {
      id: '5',
      title: t('Q4 2023 ESG Assessment Report'),
      type: 'assessment',
      date: '2023-12-31',
      status: 'completed',
      format: 'PDF',
      size: '2.3 MB',
      author: 'Sarah Johnson',
      description: t('Comprehensive ESG assessment results for Q4 2023 with year-over-year comparison.'),
    },
  ];

  // Filter reports based on search query and filters
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || report.type === selectedType;
    
    // Filter by time period
    let matchesPeriod = true;
    if (selectedPeriod !== 'all') {
      const reportDate = new Date(report.date);
      const now = new Date();
      
      if (selectedPeriod === 'month') {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);
        matchesPeriod = reportDate >= oneMonthAgo;
      } else if (selectedPeriod === 'quarter') {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(now.getMonth() - 3);
        matchesPeriod = reportDate >= threeMonthsAgo;
      } else if (selectedPeriod === 'year') {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        matchesPeriod = reportDate >= oneYearAgo;
      }
    }
    
    return matchesSearch && matchesType && matchesPeriod;
  });

  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">{t('Loading reports...')}</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={t('Reports')} description={t('Access and manage your ESG reports')}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {t('Reports')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {t('Access and manage your ESG reports and analytics')}
            </p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button
              variant="outline"
              icon={<FileText size={18} />}
            >
              {t('Create Custom Report')}
            </Button>
            <Button
              className="bg-primary"
              icon={<BarChart3 size={18} />}
            >
              {t('Generate Report')}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={t('Search reports...')}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <select
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 appearance-none"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  {reportTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="relative">
                <select
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 appearance-none"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                >
                  {timePeriods.map(period => (
                    <option key={period.id} value={period.id}>{period.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-6">
          {filteredReports.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {report.title}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        {report.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {report.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(report.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {report.format} • {report.size}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {report.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {t('Generated')} {new Date(report.date).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4 lg:mt-0 lg:ml-6">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Share2 className="h-4 w-4" />}
                    >
                      {t('Share')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Download className="h-4 w-4" />}
                    >
                      {t('Download')}
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-primary"
                      icon={<ArrowRight className="h-4 w-4" />}
                    >
                      {t('View')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('No reports found')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {t('No reports match your current search criteria.')}
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
                setSelectedPeriod('all');
              }}
            >
              {t('Clear Filters')}
            </Button>
          </div>
        )}

        {/* Report Generation */}
        <div className="mt-12 bg-primary/5 dark:bg-primary/10 rounded-lg p-6 border border-primary/20">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t('Need a Custom Report?')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t('Generate custom reports tailored to your specific requirements and stakeholder needs.')}
              </p>
            </div>
            <Button
              className="bg-primary"
              icon={<BarChart3 className="h-4 w-4" />}
            >
              {t('Create Custom Report')}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}