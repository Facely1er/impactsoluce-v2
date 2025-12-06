import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { ESGScore } from '../../types';

interface EsgScoreCardProps {
  score: ESGScore;
}

const EsgScoreCard: React.FC<EsgScoreCardProps> = ({ score }) => {
  const { t } = useTranslation();

  // Color mapping for different score levels
  const getScoreColor = (value: number) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Progress bar width based on score
  const getProgressWidth = (value: number) => {
    return `${value}%`;
  };

  // Background color for progress bars
  const getProgressBgColor = (value: number) => {
    if (value >= 80) return 'bg-green-600';
    if (value >= 60) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('Overall ESG Score')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('Environmental')}</span>
              <span className={`text-sm font-medium ${getScoreColor(score.environmental)}`}>
                {score.environmental}%
              </span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full dark:bg-gray-700">
              <div 
                className={`h-2 rounded-full ${getProgressBgColor(score.environmental)}`}
                style={{ width: getProgressWidth(score.environmental) }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('Social')}</span>
              <span className={`text-sm font-medium ${getScoreColor(score.social)}`}>
                {score.social}%
              </span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full dark:bg-gray-700">
              <div 
                className={`h-2 rounded-full ${getProgressBgColor(score.social)}`}
                style={{ width: getProgressWidth(score.social) }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('Governance')}</span>
              <span className={`text-sm font-medium ${getScoreColor(score.governance)}`}>
                {score.governance}%
              </span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full dark:bg-gray-700">
              <div 
                className={`h-2 rounded-full ${getProgressBgColor(score.governance)}`}
                style={{ width: getProgressWidth(score.governance) }}
              ></div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-1">
              <span className="text-base font-medium text-gray-900 dark:text-white">{t('Overall ESG Score')}</span>
              <span className={`text-base font-bold ${getScoreColor(score.total)}`}>
                {score.total}%
              </span>
            </div>
            <div className="h-3 w-full bg-gray-200 rounded-full dark:bg-gray-700">
              <div 
                className={`h-3 rounded-full ${getProgressBgColor(score.total)}`}
                style={{ width: getProgressWidth(score.total) }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EsgScoreCard;