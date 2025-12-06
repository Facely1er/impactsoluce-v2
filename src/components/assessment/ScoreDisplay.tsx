import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { TrendingUp, TrendingDown, Award, Target, AlertTriangle } from 'lucide-react';
import { AssessmentScoreResult, getScoreInterpretation } from '../../utils/scoring';
import { cn } from '../../utils/cn';

interface ScoreDisplayProps {
  scoreResult: AssessmentScoreResult;
  showDetails?: boolean;
  className?: string;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  scoreResult,
  showDetails = true,
  className
}) => {
  const { t } = useTranslation();
  const interpretation = getScoreInterpretation(scoreResult.overallScore);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 65) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 65) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <Target className="h-4 w-4 text-yellow-500" />;
      default:
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Award className="h-6 w-6 text-primary" />
            {t('Overall ESG Score')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className={cn('text-6xl font-bold mb-2', getScoreColor(scoreResult.overallScore))}>
              {scoreResult.overallScore}
            </div>
            <div className="text-lg text-gray-600 dark:text-gray-400 mb-2">
              {t('out of 100')}
            </div>
            <div className={cn('text-lg font-medium', interpretation.color)}>
              {interpretation.level}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {interpretation.description}
            </p>
          </div>

          {/* Category Breakdown */}
          <div className="space-y-4">
            {[
              { key: 'environmental', label: t('Environmental'), score: scoreResult.categoryScores.environmental },
              { key: 'social', label: t('Social'), score: scoreResult.categoryScores.social },
              { key: 'governance', label: t('Governance'), score: scoreResult.categoryScores.governance }
            ].map(category => (
              <div key={category.key}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {category.label}
                  </span>
                  <span className={cn('text-sm font-bold', getScoreColor(category.score))}>
                    {category.score}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                  <div
                    className={cn('h-2 rounded-full transition-all duration-500', getProgressColor(category.score))}
                    style={{ width: `${category.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Industry Benchmark */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-primary" />
            {t('Industry Comparison')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {scoreResult.benchmarks.percentile}th {t('percentile')}
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {t('in the')} {scoreResult.benchmarks.industry} {t('industry')}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              {scoreResult.benchmarks.comparison === 'above' ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : scoreResult.benchmarks.comparison === 'below' ? (
                <TrendingDown className="h-5 w-5 text-red-500" />
              ) : (
                <Target className="h-5 w-5 text-gray-500" />
              )}
              <span className="text-sm font-medium">
                {scoreResult.benchmarks.comparison === 'above' && t('Above industry average')}
                {scoreResult.benchmarks.comparison === 'below' && t('Below industry average')}
                {scoreResult.benchmarks.comparison === 'at' && t('At industry average')}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {showDetails && scoreResult.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('Key Recommendations')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scoreResult.recommendations.slice(0, 5).map((recommendation, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start gap-3">
                    {getPriorityIcon(recommendation.priority)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {recommendation.title}
                        </h4>
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-xs font-medium',
                          recommendation.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                          recommendation.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        )}>
                          {t(recommendation.priority)} {t('priority')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {recommendation.description}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                        {recommendation.impact}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('Assessment Completion')}
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {scoreResult.completionRate}%
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {scoreResult.questionScores.length} {t('questions answered')}
              </div>
            </div>
          </div>
          <div className="mt-3 h-2 bg-gray-200 rounded-full dark:bg-gray-700">
            <div
              className="h-2 bg-primary rounded-full transition-all duration-500"
              style={{ width: `${scoreResult.completionRate}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScoreDisplay;