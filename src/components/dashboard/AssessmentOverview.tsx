import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import Button from '../ui/Button';

interface AssessmentCategory {
  name: string;
  score: number;
  items: Array<{
    id: string;
    name: string;
    score: number;
    maxScore: number;
  }>;
}

interface AssessmentOverviewProps {
  categories: AssessmentCategory[];
}

const AssessmentOverview: React.FC<AssessmentOverviewProps> = ({ categories }) => {
  const { t } = useTranslation();

  const getStatusIcon = (score: number) => {
    if (score >= 80) return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    if (score >= 60) return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {t('Assessment Overview')}
        </h2>
        <Link to="/impact-scan">
          <Button variant="outline" size="sm">
            {t('View Details')}
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((category, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {t(category.name)}
                </h3>
                {getStatusIcon(category.score)}
              </div>
              <div className="space-y-3">
                {category.items.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">{t(item.name)}</span>
                      <span className="font-medium">{item.score}/{item.maxScore}</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full dark:bg-gray-700">
                      <div
                        className={`h-1.5 rounded-full ${
                          (item.score / item.maxScore) * 100 >= 80
                            ? 'bg-green-500'
                            : (item.score / item.maxScore) * 100 >= 60
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${(item.score / item.maxScore) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AssessmentOverview;