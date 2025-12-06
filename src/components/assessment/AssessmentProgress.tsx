import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '../ui/Card';
import { History, LineChart } from 'lucide-react';
import Button from '../ui/Button';

interface AssessmentProgressProps {
  currentSection: number;
  totalSections: number;
  completionRate: number;
  onViewHistory: () => void;
  onExportReport: () => void;
}

const AssessmentProgress: React.FC<AssessmentProgressProps> = ({
  currentSection,
  totalSections,
  completionRate,
  onViewHistory,
  onExportReport,
}) => {
  const { t } = useTranslation();

  return (
    <Card className="mb-8 bg-white dark:bg-gray-800 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('Assessment Progress')}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('Section')} {currentSection + 1} {t('of')} {totalSections}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              className="text-gray-700 dark:text-gray-300"
              icon={<History className="h-4 w-4" />}
              onClick={onViewHistory}
            >
              {t('View History')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-700 dark:text-gray-300"
              icon={<LineChart className="h-4 w-4" />}
              onClick={onExportReport}
            >
              {t('Export Report')}
            </Button>
          </div>
        </div>
        <div className="relative mt-2">
          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700">
            <div
              className="h-2.5 bg-primary rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {completionRate}% {t('Complete')}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round((currentSection + 1) / totalSections * 100)}% {t('of sections covered')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssessmentProgress;