import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Globe, 
  Lock, 
  Users, 
  Database,
  Save,
  Trash2,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';
import Button from '../components/ui/Button';
import { useToast } from '../hooks/useToast';
import LanguageSwitcher from '../components/translation/LanguageSwitcher';
import AccessibilitySettings from '../components/accessibility/AccessibilitySettings';

export default function Settings() {
  const { t } = useTranslation();
  const { addToast } = useToast();
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    assessmentReminders: true,
    weeklyReports: true,
    productUpdates: false,
    securityAlerts: true
  });
  
  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    shareUsageData: true,
    allowCookies: true,
    showProfileInfo: true
  });
  
  // Data export settings
  const [exportFormat, setExportFormat] = useState('json');
  
  // Theme settings
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'system'
  );
  
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotificationSettings({
      ...notificationSettings,
      [e.target.name]: e.target.checked
    });
  };
  
  const handlePrivacyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrivacySettings({
      ...privacySettings,
      [e.target.name]: e.target.checked
    });
  };
  
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      // System preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', 'system');
    }
  };
  
  const saveSettings = () => {
    // In a real app, this would save to the backend
    addToast('success', t('Settings saved successfully'));
  };
  
  const exportData = () => {
    // In a real app, this would trigger a data export
    addToast('info', t('Data export initiated'), t('Your data will be emailed to you when ready'));
  };
  
  const deleteAccount = () => {
    // In a real app, this would open a confirmation modal
    addToast('warning', t('Account deletion requires confirmation'), t('Please contact support to delete your account'));
  };

  return (
    <Layout title={t('Settings')} description={t('Manage your account settings and preferences')}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {t('Settings')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {t('Manage your account settings and preferences')}
            </p>
          </div>
          <Button
            className="mt-4 md:mt-0 bg-primary"
            icon={<Save className="h-4 w-4" />}
            onClick={saveSettings}
          >
            {t('Save Changes')}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Navigation - Desktop */}
          <div className="hidden lg:block">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-1">
                  <a href="#notifications" className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-primary/5 text-primary">
                    <Bell className="mr-3 h-5 w-5" />
                    {t('Notifications')}
                  </a>
                  <a href="#appearance" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">
                    <Eye className="mr-3 h-5 w-5" />
                    {t('Appearance')}
                  </a>
                  <a href="#language" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">
                    <Globe className="mr-3 h-5 w-5" />
                    {t('Language')}
                  </a>
                  <a href="#privacy" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">
                    <Lock className="mr-3 h-5 w-5" />
                    {t('Privacy')}
                  </a>
                  <a href="#data" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">
                    <Database className="mr-3 h-5 w-5" />
                    {t('Data Management')}
                  </a>
                  <a href="#team" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">
                    <Users className="mr-3 h-5 w-5" />
                    {t('Team Access')}
                  </a>
                </nav>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    icon={<Download className="h-4 w-4" />}
                    onClick={exportData}
                  >
                    {t('Export Your Data')}
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 dark:text-red-400 dark:hover:text-red-300 dark:border-red-900 dark:hover:border-red-800"
                    icon={<Trash2 className="h-4 w-4" />}
                    onClick={deleteAccount}
                  >
                    {t('Delete Account')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Settings Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Notifications */}
            <Card id="notifications">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  {t('Notification Settings')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {t('Email Notifications')}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('Receive notifications via email')}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="emailNotifications"
                        className="sr-only peer"
                        checked={notificationSettings.emailNotifications}
                        onChange={handleNotificationChange}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {t('Assessment Reminders')}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('Receive reminders about incomplete assessments')}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="assessmentReminders"
                        className="sr-only peer"
                        checked={notificationSettings.assessmentReminders}
                        onChange={handleNotificationChange}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {t('Weekly Reports')}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('Receive weekly summary reports')}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="weeklyReports"
                        className="sr-only peer"
                        checked={notificationSettings.weeklyReports}
                        onChange={handleNotificationChange}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {t('Product Updates')}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('Receive updates about new features and improvements')}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="productUpdates"
                        className="sr-only peer"
                        checked={notificationSettings.productUpdates}
                        onChange={handleNotificationChange}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {t('Security Alerts')}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('Receive alerts about security-related events')}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="securityAlerts"
                        className="sr-only peer"
                        checked={notificationSettings.securityAlerts}
                        onChange={handleNotificationChange}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Appearance */}
            <Card id="appearance">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  {t('Appearance')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    {t('Theme')}
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        theme === 'light' 
                          ? 'border-primary bg-primary/5' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      onClick={() => handleThemeChange('light')}
                    >
                      <div className="h-20 bg-white border border-gray-200 rounded-md mb-3 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-primary"></div>
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {t('Light')}
                        </span>
                      </div>
                    </div>
                    
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        theme === 'dark' 
                          ? 'border-primary bg-primary/5' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      onClick={() => handleThemeChange('dark')}
                    >
                      <div className="h-20 bg-gray-900 border border-gray-700 rounded-md mb-3 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-primary"></div>
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {t('Dark')}
                        </span>
                      </div>
                    </div>
                    
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        theme === 'system' 
                          ? 'border-primary bg-primary/5' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      onClick={() => handleThemeChange('system')}
                    >
                      <div className="h-20 bg-gradient-to-r from-white to-gray-900 border border-gray-200 rounded-md mb-3 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-primary"></div>
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {t('System')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Language */}
            <Card id="language">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  {t('Language')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    {t('Select Language')}
                  </h3>
                  
                  <LanguageSwitcher variant="buttons" className="flex gap-2" />
                </div>
              </CardContent>
            </Card>
            
            {/* Accessibility */}
            <AccessibilitySettings />
            
            {/* Privacy */}
            <Card id="privacy">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  {t('Privacy Settings')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {t('Share Usage Data')}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('Share anonymous usage data to help improve the platform')}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="shareUsageData"
                        className="sr-only peer"
                        checked={privacySettings.shareUsageData}
                        onChange={handlePrivacyChange}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {t('Allow Cookies')}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('Allow cookies for improved site functionality')}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="allowCookies"
                        className="sr-only peer"
                        checked={privacySettings.allowCookies}
                        onChange={handlePrivacyChange}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {t('Show Profile Information')}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('Allow other team members to see your profile information')}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="showProfileInfo"
                        className="sr-only peer"
                        checked={privacySettings.showProfileInfo}
                        onChange={handlePrivacyChange}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Data Management */}
            <Card id="data">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  {t('Data Management')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      {t('Export Your Data')}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {t('Download a copy of your data in the selected format')}
                    </p>
                    
                    <div className="flex items-center space-x-4 mb-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="exportFormat"
                          value="json"
                          checked={exportFormat === 'json'}
                          onChange={(e) => setExportFormat(e.target.value)}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">JSON</span>
                      </label>
                      
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="exportFormat"
                          value="csv"
                          checked={exportFormat === 'csv'}
                          onChange={(e) => setExportFormat(e.target.value)}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">CSV</span>
                      </label>
                      
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="exportFormat"
                          value="pdf"
                          checked={exportFormat === 'pdf'}
                          onChange={(e) => setExportFormat(e.target.value)}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">PDF</span>
                      </label>
                    </div>
                    
                    <Button
                      variant="outline"
                      icon={<Download className="h-4 w-4" />}
                      onClick={exportData}
                    >
                      {t('Export Data')}
                    </Button>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      {t('Delete Account')}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {t('Permanently delete your account and all associated data')}
                    </p>
                    
                    <Button
                      variant="outline"
                      className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 dark:text-red-400 dark:hover:text-red-300 dark:border-red-900 dark:hover:border-red-800"
                      icon={<Trash2 className="h-4 w-4" />}
                      onClick={deleteAccount}
                    >
                      {t('Delete Account')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Team Access */}
            <Card id="team">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  {t('Team Access')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {t('Manage team members and their access to your organization\'s ESG data')}
                  </p>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      {t('Team management is available on the Professional and Enterprise plans. Upgrade your plan to invite team members.')}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {t('Current Plan')}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {t('Free Plan - Limited to 1 user')}
                        </p>
                      </div>
                      <Link to="/pricing">
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          {t('Upgrade')}
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {t('Team Members')}
                      </h4>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {t('You are the only team member on the Free plan.')}
                      </div>
                    </div>
                    
                    <Link to="/pricing">
                      <Button
                        variant="outline"
                      >
                        {t('Upgrade to Add Team Members')}
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}