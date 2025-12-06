import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../ui/Card';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
import { AssessmentSection } from '../../types';
import { cn } from '../../utils/cn';

interface AssessmentNavigationProps {
  sections: AssessmentSection[];
  currentSection: number;
  onSectionChange: (index: number) => void;
  sectionProgress: Record<string, number>;
}

const AssessmentNavigation: React.FC<AssessmentNavigationProps> = ({
  sections,
  currentSection,
  onSectionChange,
  sectionProgress,
}) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {sections.map((section, index) => {
        const progress = sectionProgress[section.id] || 0;
        const isComplete = progress === 100;
        const isCurrent = currentSection === index;

        return (
          <Card
            key={section.id}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-md border-2",
              isCurrent ? "border-primary bg-primary/5" : "border-transparent",
              isComplete && "bg-green-50 dark:bg-green-900/10"
            )}
            onClick={() => onSectionChange(index)}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className={cn(
                  "font-medium",
                  isCurrent ? "text-primary" : "text-gray-900 dark:text-white"
                )}>
                  {t(section.title)}
                </h3>
                {isComplete ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <ChevronRight
                    className={cn(
                      "h-5 w-5 transition-transform",
                      isCurrent ? "rotate-90 text-primary" : "text-gray-400"
                    )}
                  />
                )}
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full dark:bg-gray-700">
                <div
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    isComplete ? "bg-green-500" : "bg-primary"
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {progress}% {t('Complete')}
              </p>
            </div>
          </Card>
        )}
      )}
    </div>
  );
};

export default AssessmentNavigation;