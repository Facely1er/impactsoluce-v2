import React from 'react';
import Header from './Header';
import Footer from './Footer';
import AlertBanner from './AlertBanner';
import { cn } from '../../utils/cn';
import SkipLink from '../ui/SkipLink';
import MetaTags from '../seo/MetaTags';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
}

export default function Layout({ 
  children, 
  className,
  title,
  description,
  keywords,
  image
}: LayoutProps) {
  
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
        <AlertBanner />
        <main id="main-content" className={cn("flex-1", className)} tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}