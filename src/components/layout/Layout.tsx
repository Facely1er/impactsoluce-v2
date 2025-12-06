import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { cn } from '../../utils/cn';
import SkipLink from '../ui/SkipLink';
import { useTranslation } from 'react-i18next';
import MetaTags from '../seo/MetaTags';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
}

export default function Layout({ 
  children, 
  className,
  title,
  description,
  keywords,
  image,
  noIndex = false
}: LayoutProps) {
  const { t } = useTranslation();
  
  return (
    <>
      <MetaTags
        title={title}
        description={description}
        keywords={keywords}
        image={image}
      />
      
      <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
        <SkipLink />
        <Header />
        <main id="main-content" className={cn("flex-1", className)} tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}