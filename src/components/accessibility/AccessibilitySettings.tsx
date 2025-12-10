import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Eye, RefreshCw } from 'lucide-react';
import Button from '../ui/Button';
import { useAccessibility } from './AccessibilityProvider';

const AccessibilitySettings: React.FC = () => {
  const { t } = useTranslation();
  const { settings, updateSetting, resetSettings } = useAccessibility();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          {t('Accessibility Settings')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Reduce Motion */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              {t('Reduce Motion')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('Minimize animations and transitions')}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={settings.reduceMotion}
              onChange={(e) => updateSetting('reduceMotion', e.target.checked)}
              aria-label={t('Reduce Motion')}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
          </label>
        </div>

        {/* High Contrast */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              {t('High Contrast')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('Increase color contrast for better visibility')}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={settings.highContrast}
              onChange={(e) => updateSetting('highContrast', e.target.checked)}
              aria-label={t('High Contrast')}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
          </label>
        </div>

        {/* Font Size */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            {t('Font Size')}
          </h3>
          <div className="space-y-2">
            {[
              { value: 'normal', label: t('Normal') },
              { value: 'large', label: t('Large') },
              { value: 'larger', label: t('Extra Large') }
            ].map(option => (
              <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="fontSize"
                  value={option.value}
                  checked={settings.fontSize === option.value}
                  onChange={(e) => updateSetting('fontSize', e.target.value as 'normal' | 'large' | 'larger')}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Focus Visible */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              {t('Enhanced Focus Indicators')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('Show enhanced focus outlines for keyboard navigation')}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={settings.focusVisible}
              onChange={(e) => updateSetting('focusVisible', e.target.checked)}
              aria-label={t('Enhanced Focus Indicators')}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
          </label>
        </div>

        {/* Reset Button */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            className="w-full"
            icon={<RefreshCw className="h-4 w-4" />}
            onClick={resetSettings}
          >
            {t('Reset to Defaults')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessibilitySettings;