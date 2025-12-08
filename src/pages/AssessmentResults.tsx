import { useTranslation } from 'react-i18next';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { 
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Download,
  FileText,
  XCircle,
  Info,
  BarChart3
} from 'lucide-react';
import Button from '../components/ui/Button';
import { frameworkMappings } from '../utils/data';
import { useAssessmentDemo } from '../hooks/useAssessmentDemo';
import { downloadJSON, downloadMarkdown, formatAssessmentForExport } from '../utils/export';
import { Link } from 'react-router-dom';
import styles from './AssessmentResults.module.css';

export default function AssessmentResults() {
  const { t } = useTranslation();
  const { isDemoMode } = useAssessmentDemo();

  const handleDownloadReport = (format: 'json' | 'markdown' = 'json') => {
    const exportData = formatAssessmentForExport({
      results: results,
      generatedAt: new Date().toISOString(),
      summary: {
        overallScore: results.overall.score,
        categories: results.categories.map(c => ({
          name: c.name,
          score: c.score,
          status: c.status
        })),
        frameworkAlignment: results.frameworkAlignment,
        recommendations: results.recommendations
      }
    });

    const filename = `impactsoluce-assessment-results-${new Date().toISOString().split('T')[0]}`;
    
    if (format === 'json') {
      downloadJSON(exportData, `${filename}.json`);
    } else {
      downloadMarkdown(exportData, `${filename}.md`);
    }
  };

  // Mock results data - in a real app, this would come from your backend
  const results = {
    overall: {
      score: isDemoMode ? 68 : 72,
      status: 'moderate',
      lastUpdated: '2024-03-15',
      improvement: isDemoMode ? '+8%' : '+12%',
    },
    categories: [
      {
        name: 'Environmental',
        score: isDemoMode ? 65 : 75,
        status: isDemoMode ? 'moderate' : 'good',
        strengths: [
          'Strong carbon reduction initiatives',
          'Effective waste management program',
        ],
        improvements: [
          'Increase renewable energy usage',
          'Enhance water conservation measures',
        ],
      },
      {
        name: 'Social',
        score: isDemoMode ? 70 : 68,
        status: 'moderate',
        strengths: [
          'Comprehensive D&I programs',
          'Strong employee development initiatives',
        ],
        improvements: [
          'Expand community engagement programs',
          'Strengthen supply chain monitoring',
        ],
      },
      {
        name: 'Governance',
        score: isDemoMode ? 72 : 73,
        status: 'good',
        strengths: [
          'Robust risk management framework',
          'Regular board oversight of ESG matters',
        ],
        improvements: [
          'Enhance stakeholder engagement processes',
          'Strengthen data privacy measures',
        ],
      },
    ],
    frameworkAlignment: {
      gri: isDemoMode ? 70 : 78,
      sasb: isDemoMode ? 68 : 72,
      tcfd: isDemoMode ? 62 : 65,
      iso: isDemoMode ? 66 : 70,
    },
    recommendations: [
      {
        category: 'high',
        title: 'Implement Renewable Energy Program',
        description: 'Develop and implement a comprehensive renewable energy transition program.',
        impact: 'High',
        timeframe: '12-18 months',
        frameworks: ['GRI 302', 'TCFD-STRAT'],
      },
      {
        category: 'medium',
        title: 'Enhance Stakeholder Engagement',
        description: 'Establish regular stakeholder feedback mechanisms and reporting channels.',
        impact: 'Medium',
        timeframe: '6-12 months',
        frameworks: ['GRI 102', 'ISO 26000'],
      },
      {
        category: 'high',
        title: 'Strengthen Data Privacy Controls',
        description: 'Implement advanced data protection measures and regular audits.',
        impact: 'High',
        timeframe: '3-6 months',
        frameworks: ['SASB TC-SI-220', 'ISO 27001'],
      },
    ],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600 dark:text-green-400';
      case 'moderate':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-red-600 dark:text-red-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'moderate':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  // Generate dynamic CSS for progress bars
  const progressBarStyles = `
    ${results.categories.map((category, index) => `
      .progress-category-${index} { --progress-width: ${category.score}%; }
    `).join('')}
    ${Object.entries(results.frameworkAlignment).map(([, score], index) => `
      .progress-framework-${index} { --progress-width: ${score}%; }
    `).join('')}
  `;

  return (
    <Layout>
      <style>{progressBarStyles}</style>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {t('Assessment Results')} {isDemoMode && <span className="text-primary">(Demo)</span>}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {t('Baseline understanding of your current ESG posture for exposure analysis')}
            </p>
            {isDemoMode && (
              <div className="mt-2 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Info className="h-4 w-4" />
                <span className="text-sm">These are sample results for demonstration purposes</span>
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <div className="relative group">
              <Button
                className="bg-primary"
                icon={<Download size={18} />}
                onClick={() => handleDownloadReport('json')}
              >
                {t('Download Report')}
              </Button>
              <div className="absolute right-0 mt-1 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out z-50">
                <div className="py-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => handleDownloadReport('json')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    {t('Export as JSON')}
                  </button>
                  <button
                    onClick={() => handleDownloadReport('markdown')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    {t('Export as Markdown')}
                  </button>
                </div>
              </div>
            </div>
            <Link to="/dashboard">
              <Button
                variant="outline"
                icon={<BarChart3 size={18} />}
              >
                {t('View Dashboard')}
              </Button>
            </Link>
            <Link to="/assessment/history">
              <Button
                variant="outline"
                icon={<FileText size={18} />}
              >
                {t('View History')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Overall Score */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center justify-center p-6 bg-primary/5 dark:bg-primary/10 rounded-lg">
                <div className="text-4xl font-bold text-primary mb-2">
                  {results.overall.score}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t('Overall Score')}
                </div>
                <div className="text-sm font-medium text-green-600 dark:text-green-400 mt-2">
                  {results.overall.improvement}
                </div>
              </div>
              {results.categories.map((category, index) => (
                <div key={index} className="flex flex-col p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {t(category.name)}
                    </h3>
                    {getStatusIcon(category.status)}
                  </div>
                  <div className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                    {category.score}%
                  </div>
                  <div 
                    className={`${styles.progressContainer} progress-category-${index}`}
                  >
                    <div
                      className={`${styles.progressBar} ${
                        category.score >= 80
                          ? styles.progressBarGreen
                          : category.score >= 60
                          ? styles.progressBarYellow
                          : styles.progressBarRed
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Framework Alignment */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t('Framework Alignment')}</CardTitle>
            <CardDescription>
              {t('Your alignment with major ESG reporting frameworks')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Object.entries(results.frameworkAlignment).map(([framework, score], index) => (
                <div key={framework} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {framework.toUpperCase()}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {score}%
                    </span>
                  </div>
                  <div 
                    className={`${styles.progressContainer} progress-framework-${index}`}
                  >
                    <div
                      className={`${styles.progressBar} ${styles.progressBarPrimary}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {results.categories.map((category, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{t(category.name)}</span>
                  <span className={getStatusColor(category.status)}>
                    {category.score}%
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      {t('Strengths')}
                    </h4>
                    <ul className="space-y-2">
                      {category.strengths.map((strength, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>{t(strength)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      {t('Areas for Improvement')}
                    </h4>
                    <ul className="space-y-2">
                      {category.improvements.map((improvement, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <ArrowUpRight className="h-4 w-4 text-primary mt-0.5" />
                          <span>{t(improvement)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Observations */}
        <Card>
          <CardHeader>
            <CardTitle>{t('Key Observations')}</CardTitle>
            <CardDescription>
              {t('Notable findings from your baseline assessment. Use this information to understand your exposure profile.')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {results.recommendations.map((recommendation, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className={`p-2 rounded-lg ${
                        recommendation.category === 'high'
                          ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        <FileText className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                        {t(recommendation.title)}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {t(recommendation.description)}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          {t('Impact')}: {recommendation.impact}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          {t('Timeframe')}: {recommendation.timeframe}
                        </span>
                        {recommendation.frameworks.map((framework, idx) => {
                          const info = frameworkMappings.find(f => f.code === framework);
                          return info ? (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary dark:bg-primary/20"
                              title={info.description}
                            >
                              {framework}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps Navigation */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/dashboard">
            <Button variant="outline" className="w-full sm:w-auto">
              {t('View Full Dashboard')}
            </Button>
          </Link>
          <Link to="/standards-mapping">
            <Button variant="outline" className="w-full sm:w-auto">
              {t('View Standards Mapping')}
            </Button>
          </Link>
          <Link to="/impact-scan">
            <Button className="bg-primary w-full sm:w-auto">
              {t('Start New Assessment')}
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}