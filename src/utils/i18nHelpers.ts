import i18n, { hasTranslation } from '../i18n';

/**
 * Utility functions for internationalization
 */

// Format a date according to the current locale
export const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Default options
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  try {
    return new Intl.DateTimeFormat(i18n.language, mergedOptions).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateObj.toLocaleDateString();
  }
};

// Format a number according to the current locale
export const formatNumber = (
  number: number,
  options?: Intl.NumberFormatOptions
): string => {
  try {
    return new Intl.NumberFormat(i18n.language, options).format(number);
  } catch (error) {
    console.error('Error formatting number:', error);
    return number.toString();
  }
};

// Format a currency value according to the current locale
export const formatCurrency = (
  amount: number,
  currency = 'USD',
  options?: Intl.NumberFormatOptions
): string => {
  const defaultOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  return formatNumber(amount, mergedOptions);
};

// Format a percentage according to the current locale
export const formatPercent = (
  value: number,
  options?: Intl.NumberFormatOptions
): string => {
  const defaultOptions: Intl.NumberFormatOptions = {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  return formatNumber(value / 100, mergedOptions);
};

// Get a translated string with fallback
export const getTranslation = (key: string, fallback?: string): string => {
  if (hasTranslation(key)) {
    return i18n.t(key);
  }
  
  return fallback || key;
};

// Get the current language direction (ltr or rtl)
export const getLanguageDirection = (): 'ltr' | 'rtl' => {
  return i18n.dir() as 'ltr' | 'rtl';
};

// Check if the current language is RTL
export const isRTL = (): boolean => {
  return getLanguageDirection() === 'rtl';
};

// Get the current language name
export const getCurrentLanguageName = (): string => {
  const languageNames: Record<string, string> = {
    en: 'English',
    fr: 'Français',
  };
  
  const langCode = i18n.language.split('-')[0];
  return languageNames[langCode] || langCode;
};