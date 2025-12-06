import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { 
  Calendar, 
  Download, 
  Eye, 
  Filter,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  FileText,
  BarChart3
} from 'lucide-react';
import Button from '../components/ui/Button';
import { useAssessmentData } from '../hooks/useAssessmentData';

export default function AssessmentHistory() {
  const { t } = useTranslation();
  const { history, isLoading } = useAssessmentData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data for demonstration
  const mockHistory = [
    {
      id: '1',
      date: '2024-03-15',
      status: 'completed',
      totalScore: 78,
      previousScore: 72,
      sections: {
        environmental: 82,
        social: 75,
        governance: 77
      },
      framework: 'GRI Standards',
      submittedBy: 'Sarah Johnson'
    },
    {
      id: '2',
      date: '2024-02-15',
      status: 'completed',
      totalScore: 72,
      previousScore: 68,
      sections: {
        environmental: 75,
        social: 70,
        governance: 71
      },
      framework: 'GRI Standards',
      submittedBy: 'Sarah Johnson'
    },
    {
      id: '3',
      date: '2024-01-15',
      status: 'completed',
      totalScore: 68,
      previousScore: null,
      sections: {
        environmental: 70,
        social: 65,
        governance: 69
      },
      framework: 'GRI Standards',
      submittedBy: 'Sarah Johnson'
    },
    {
      id: '4',
      date: '2024-03-10',
      status: 'draft',
      totalScore: null,
      previousScore: null,
      sections: {
        environmental: null,
        social: null,
        governance: null
      },
      framework: 'SASB',
      submittedBy: 'Michael Chen'
    }
  ];

  const assessmentHistory = history || mockHistory;

  const filteredHistory = assessmentHistory.filter(assessment => {
    const matchesSearch = assessment.framework.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assessment.submittedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || assessment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getScoreChange = (current: number | null, previous: number | null) => {
    if (!current || !previous) return null;
    const change = current - previous;
    return {
      value: Math.abs(change),
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'same',
      percentage: Math.abs((change / previous) * 100).toFixed(1)
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'in_review':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">{t('Loading assessment history...')}</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {t('Assessment History')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {t('Track your ESG performance over time')}
            </p>
          </div>
          <Button
            className="mt-4 md:mt-0 bg-primary"
            icon={<BarChart3 size={18} />}
          >
            {t('Generate Trend Report')}
          </Button>
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
                placeholder={t('Search assessments...')}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="relative">
              <select
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 appearance-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">{t('All Statuses')}</option>
                <option value="completed">{t('Completed')}</option>
                <option value="draft">{t('Draft')}</option>
                <option value="in_review">{t('In Review')}</option>
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Assessment History List */}
        <div className="space-y-6">
          {filteredHistory.map((assessment) => {
            const scoreChange = getScoreChange(assessment.totalScore, assessment.previousScore);
            
            return (
              <Card key={assessment.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-300">
                            {new Date(assessment.date).toLocaleDateString()}
                          </span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(assessment.status)}`}>
                          {t(assessment.status.charAt(0).toUpperCase() + assessment.status.slice(1))}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {assessment.framework}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                            {assessment.totalScore ? (
                              <span className={getScoreColor(assessment.totalScore)}>
                                {assessment.totalScore}%
                              </span>
                            ) : (
                              <span className="text-gray-400">--</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {t('Overall Score')}
                          </div>
                          {scoreChange && (
                            <div className="flex items-center justify-center mt-1">
                              {scoreChange.direction === 'up' && (
                                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                              )}
                              {scoreChange.direction === 'down' && (
                                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                              )}
                              {scoreChange.direction === 'same' && (
                                <Minus className="h-3 w-3 text-gray-500 mr-1" />
                              )}
                              <span className={`text-xs ${
                                scoreChange.direction === 'up' ? 'text-green-500' :
                                scoreChange.direction === 'down' ? 'text-red-500' : 'text-gray-500'
                              }`}>
                                {scoreChange.value} ({scoreChange.percentage}%)
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                            {assessment.sections.environmental ? (
                              <span className={getScoreColor(assessment.sections.environmental)}>
                                {assessment.sections.environmental}%
                              </span>
                            ) : (
                              <span className="text-gray-400">--</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {t('Environmental')}
                          </div>
                        </div>

                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                            {assessment.sections.social ? (
                              <span className={getScoreColor(assessment.sections.social)}>
                                {assessment.sections.social}%
                              </span>
                            ) : (
                              <span className="text-gray-400">--</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {t('Social')}
                          </div>
                        </div>

                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                            {assessment.sections.governance ? (
                              <span className={getScoreColor(assessment.sections.governance)}>
                                {assessment.sections.governance}%
                              </span>
                            ) : (
                              <span className="text-gray-400">--</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {t('Governance')}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        {t('Submitted by')}: {assessment.submittedBy}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 lg:mt-0 lg:ml-6">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Eye className="h-4 w-4" />}
                      >
                        {t('View')}
                      </Button>
                      {assessment.status === 'completed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Download className="h-4 w-4" />}
                        >
                          {t('Download')}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredHistory.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('No assessments found')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {t('Start your first ESG assessment to see your history here.')}
            </p>
            <Button className="bg-primary">
              {t('Start New Assessment')}
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}