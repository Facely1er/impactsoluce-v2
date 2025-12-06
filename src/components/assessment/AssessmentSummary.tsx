import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { BarChart3, Download, Share2, Calendar, User } from 'lucide-react';
import Button from '../ui/Button';
import { AssessmentScoreResult } from '../../utils/scoring';
import ScoreDisplay from './ScoreDisplay';

interface AssessmentSummaryProps {
  scoreResult: AssessmentScoreResult;
  assessmentDate: string;
  submittedBy?: string;
  onDownloadReport?: () => void;
  onShareResults?: () => void;
  onViewDetails?: () => void;
}

export const AssessmentSummary: React.FC<AssessmentSummaryProps> = ({
  scoreResult,
  assessmentDate,
  submittedBy,
  onDownloadReport,
  onShareResults,
  onViewDetails
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {t('ESG Assessment Results')}
          </h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(assessmentDate).toLocaleDateString()}
            </div>
            {submittedBy && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {submittedBy}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          {onShareResults && (
            <Button
              variant="outline"
              icon={<Share2 className="h-4 w-4" />}
              onClick={onShareResults}
            >
              {t('Share Results')}
            </Button>
          )}
          {onDownloadReport && (
            <Button
              variant="outline"
              icon={<Download className="h-4 w-4" />}
              onClick={onDownloadReport}
            >
              {t('Download Report')}
            </Button>
          )}
          {onViewDetails && (
            <Button
              className="bg-primary"
              icon={<BarChart3 className="h-4 w-4" />}
              onClick={onViewDetails}
            >
              {t('View Details')}
            </Button>
          )}
        </div>
      </div>

      {/* Score Display */}
      <ScoreDisplay scoreResult={scoreResult} showDetails={true} />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('Next Steps')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <div className="font-medium mb-1">{t('Create Action Plan')}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t('Develop targeted improvement strategies')}
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <div className="font-medium mb-1">{t('Schedule Review')}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t('Set up regular assessment reviews')}
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <div className="font-medium mb-1">{t('Stakeholder Report')}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t('Share results with stakeholders')}
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssessmentSummary;