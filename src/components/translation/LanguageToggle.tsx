import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';

const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = async () => {
    const currentLang = i18n.language;
    const newLang = currentLang.startsWith('fr') ? 'en' : 'fr';
    await i18n.changeLanguage(newLang);
    localStorage.setItem('i18nextLng', newLang);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-2"
      onClick={toggleLanguage}
    >
      <span className="uppercase">{i18n.language.substring(0, 2)}</span>
    </Button>
  );
};

export default LanguageToggle;