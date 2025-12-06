import React from 'react';
import { useTranslation } from 'react-i18next';

interface SkipLinkProps {
  targetId?: string;
  className?: string;
}

/**
 * SkipLink component for accessibility
 * 
 * This component provides a way for keyboard users to skip navigation
 * and go directly to the main content.
 */
const SkipLink: React.FC<SkipLinkProps> = ({
  targetId = 'main-content',
  className = '',
}) => {
  const { t } = useTranslation();
  
  return (
    <a
      href={`#${targetId}`}
      className={`sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md focus:outline-none focus:shadow-lg ${className}`}
    >
      {t('Skip to main content')}
    </a>
  );
};

export default SkipLink;