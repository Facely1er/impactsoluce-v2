import React from 'react';
import { useTranslation } from 'react-i18next';
import { TechDependency } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';

interface TechDependencyCardProps {
  dependency: TechDependency;
}

const TechDependencyCard: React.FC<TechDependencyCardProps> = ({ dependency }) => {
  const { t } = useTranslation();

  const getImpactIndicator = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high':
        return {
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          color: 'text-red-500',
          bg: 'bg-red-50',
          border: 'border-red-200',
          label: t('High Impact')
        };
      case 'medium':
        return {
          icon: <HelpCircle className="h-5 w-5 text-yellow-500" />,
          color: 'text-yellow-500',
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          label: t('Medium Impact')
        };
      case 'low':
        return {
          icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
          color: 'text-green-500',
          bg: 'bg-green-50',
          border: 'border-green-200',
          label: t('Low Impact')
        };
    }
  };

  const impact = getImpactIndicator(dependency.impact);

  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{t(dependency.name)}</CardTitle>
          <div 
            className={`${impact.bg} ${impact.border} ${impact.color} text-xs font-medium px-2.5 py-0.5 rounded-full border flex items-center`}
          >
            {impact.icon}
            <span className="ml-1">{impact.label}</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-1">{t(dependency.category)}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-500">{t('Emissions')}</p>
            <p className="text-xl font-medium">{dependency.emissions}</p>
            <p className="text-xs text-gray-500">{t('tons CO2e')}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">{t('Energy')}</p>
            <p className="text-xl font-medium">{dependency.energy}</p>
            <p className="text-xs text-gray-500">{t('kWh')}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">{t('Risk Score')}</p>
            <p className="text-xl font-medium">{dependency.risk}</p>
            <p className="text-xs text-gray-500">/ 100</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechDependencyCard;