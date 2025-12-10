import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { APP_NAME } from '../../lib/config';

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  twitterHandle?: string;
}

const MetaTags: React.FC<MetaTagsProps> = ({
  title,
  description,
  keywords = [],
  image = '/images/og-image.jpg',
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  twitterHandle = '@impactsoluce',
}) => {
  const { t, i18n } = useTranslation();
  
  // Default meta values
  const defaultTitle = APP_NAME;
  const defaultDescription = t('ESG Risk Intelligence by ERMITS. Know where your impact exposure is — before regulators, buyers, or financiers ask.');
  const defaultKeywords = ['ESG', 'sustainability', 'reporting', 'compliance', 'carbon management'];
  
  // Combine with provided values
  const metaTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  const metaDescription = description || defaultDescription;
  const metaKeywords = [...defaultKeywords, ...keywords].join(', ');
  
  // Get current URL if not provided
  const metaUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  
  // Get absolute image URL
  const absoluteImageUrl = image.startsWith('http')
    ? image
    : `${typeof window !== 'undefined' ? window.location.origin : ''}${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={i18n.language} />
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={metaUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:locale" content={i18n.language} />
      <meta property="og:site_name" content={APP_NAME} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={absoluteImageUrl} />
      
      {/* Article specific meta tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      
      {/* Alternate language versions */}
      {i18n.languages.map(lang => (
        <link
          key={lang}
          rel="alternate"
          hrefLang={lang}
          href={metaUrl.replace(`/${i18n.language}/`, `/${lang}/`)}
        />
      ))}
    </Helmet>
  );
};

export default MetaTags;