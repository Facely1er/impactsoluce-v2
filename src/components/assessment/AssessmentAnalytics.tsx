import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { TrendingUp, AlertTriangle, CheckCircle2, Target, BarChart3 } from 'lucide-react';
import { AssessmentResponse, AssessmentQuestion } from '../../types';
import { getAssessmentInsights, calculateImprovementPotential } from '../../utils/assessmentHelpers';
import { cn } from '../../utils/cn';

interface AssessmentAnalyticsProps {
  responses: Record<string, AssessmentResponse>;
  questions: AssessmentQuestion[];
  className?: string;
}

export const AssessmentAnalytics: React.FC<AssessmentAnalyticsProps> = ({
  responses,
  questions,
  className
}) => {
  const { t } = useTranslation();
  const insights = getAssessmentInsights(responses, questions);
  const improvementPotential = calculateImprovementPotential(responses, questions);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {insights.strengths.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t('Strengths Identified')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {insights.weaknesses.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t('Improvement Areas')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {insights.riskAreas.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t('Risk Areas')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {insights.complianceGaps.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t('Compliance Gaps')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Improvement Potential */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-primary" />
            {t('Improvement Potential')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {improvementPotential.map((category, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    {t(category.category)}
                  </h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {category.currentScore}% → {category.potentialScore}%
                  </div>
                </div>
                
                <div className="relative mb-4">
                  <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700">
                    <div
                      className="h-3 bg-gray-400 rounded-full"
                      style={{ width: `${category.currentScore}%` }}
                    />
                    <div
                      className="absolute top-0 h-3 bg-primary rounded-full opacity-50"
                      style={{ 
                        left: `${category.currentScore}%`,
                        width: `${category.potentialScore - category.currentScore}%`
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('Key Actions')}:
                  </h5>
                  <ul className="space-y-1">
                    {category.improvementActions.map((action, actionIndex) => (
                      <li key={actionIndex} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="text-primary">•</span>
                        <span>{t(action)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        {insights.strengths.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                {t('Key Strengths')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {insights.strengths.slice(0, 5).map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{t(strength)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Risk Areas */}
        {insights.riskAreas.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                {t('Risk Areas')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {insights.riskAreas.slice(0, 5).map((risk, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{t(risk)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AssessmentAnalytics;