import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Settings, Database, Eye, Zap, Shield, Users } from 'lucide-react';
import ProductionChecklist from '../development/ProductionChecklist';
import TestingPanel from '../testing/TestingPanel';
import HealthIndicator from '../ui/HealthIndicator';
import Button from '../ui/Button';

const AdminPanel: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');

  // Only show in development environment
  if (import.meta.env.PROD) {
    return null;
  }

  const tabs = [
    { id: 'overview', name: t('Overview'), icon: Eye },
    { id: 'health', name: t('System Health'), icon: Shield },
    { id: 'testing', name: t('Testing'), icon: Zap },
    { id: 'checklist', name: t('Production Checklist'), icon: Settings },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-96 max-h-96 overflow-y-auto">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {tabs.map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <IconComponent className="h-3 w-3" />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  {t('Environment')}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {import.meta.env.MODE} mode
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  {t('Performance')}
                </h4>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  <p>Bundle size monitoring: Active</p>
                  <p>Core Web Vitals: Tracking</p>
                </div>
              </div>

              <HealthIndicator showDetails className="text-xs" />
            </div>
          )}

          {activeTab === 'health' && (
            <HealthIndicator showDetails />
          )}

          {activeTab === 'testing' && (
            <div className="scale-90 origin-top-left">
              <TestingPanel />
            </div>
          )}

          {activeTab === 'checklist' && (
            <div className="scale-90 origin-top-left">
              <ProductionChecklist />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;