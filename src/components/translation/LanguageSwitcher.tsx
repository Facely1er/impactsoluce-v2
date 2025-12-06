import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../i18n';
import Button from '../ui/Button';

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'buttons';
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'dropdown',
  className = '',
}) => {
  const { i18n } = useTranslation();
  
  const languageNames: Record<string, string> = {
    en: 'English',
    fr: 'Français',
  };
  
  const handleLanguageChange = async (language: string) => {
    if (SUPPORTED_LANGUAGES.includes(language)) {
      await i18n.changeLanguage(language);
      localStorage.setItem('i18nextLng', language);
    }
  };
  
  if (variant === 'buttons') {
    return (
      <div className={`flex gap-2 ${className}`}>
        {SUPPORTED_LANGUAGES.map(lang => (
          <Button
            key={lang}
            variant={i18n.language.startsWith(lang) ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleLanguageChange(lang)}
            className={i18n.language.startsWith(lang) ? 'bg-primary' : ''}
          >
            {languageNames[lang] || lang.toUpperCase()}
          </Button>
        ))}
      </div>
    );
  }
  
  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <select
          value={i18n.language.substring(0, 2)}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="appearance-none bg-transparent border-none focus:outline-none text-sm text-gray-700 dark:text-gray-300"
        >
          {SUPPORTED_LANGUAGES.map(lang => (
            <option key={lang} value={lang}>
              {languageNames[lang] || lang.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LanguageSwitcher;