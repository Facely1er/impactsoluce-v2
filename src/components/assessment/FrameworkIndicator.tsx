import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '../ui/Card';
import { Info } from 'lucide-react';
import { frameworkMappings } from '../../utils/data';

interface FrameworkIndicatorProps {
  frameworks: {
    gri?: string[];
    sasb?: string[];
    tcfd?: string[];
    iso?: string[];
  };
}

const FrameworkIndicator: React.FC<FrameworkIndicatorProps> = ({ frameworks }) => {
  const { t } = useTranslation();

  const getFrameworkInfo = (code: string) => {
    return frameworkMappings.find(f => 
      f.code === code || 
      code.startsWith(f.code)
    );
  };

  const renderFrameworkBadges = () => {
    const badges = [];

    // GRI Standards
    if (frameworks.gri?.length) {
      frameworks.gri.forEach(code => {
        const info = getFrameworkInfo(code);
        if (info) {
          badges.push({
            code: `GRI ${code}`,
            name: info.name,
            description: info.description,
            color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800'
          });
        }
      });
    }

    // SASB Standards
    if (frameworks.sasb?.length) {
      frameworks.sasb.forEach(code => {
        const info = getFrameworkInfo(code);
        if (info) {
          badges.push({
            code,
            name: info.name,
            description: info.description,
            color: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800'
          });
        }
      });
    }

    // TCFD Framework
    if (frameworks.tcfd?.length) {
      frameworks.tcfd.forEach(code => {
        const info = getFrameworkInfo(code);
        if (info) {
          badges.push({
            code,
            name: info.name,
            description: info.description,
            color: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
          });
        }
      });
    }

    // ISO Standards
    if (frameworks.iso?.length) {
      frameworks.iso.forEach(code => {
        const info = getFrameworkInfo(code);
        if (info) {
          badges.push({
            code,
            name: info.name,
            description: info.description,
            color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800'
          });
        }
      });
    }

    return badges;
  };

  const badges = renderFrameworkBadges();

  if (!badges.length) return null;

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
        <Info className="h-4 w-4" />
        <span>{t('Framework Alignment')}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {badges.map((badge, index) => (
          <div
            key={index}
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${badge.color}`}
            title={badge.description}
          >
            {badge.code}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FrameworkIndicator;