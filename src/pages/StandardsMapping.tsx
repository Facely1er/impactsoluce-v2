import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Filter, Search, Download, ExternalLink, Info } from 'lucide-react';
import Button from '../components/ui/Button';
import { frameworkMappings } from '../utils/data';

interface StandardRequirement {
  id: string;
  framework: string;
  code: string;
  category: string;
  requirement: string;
  activities: {
    id: string;
    name: string;
    description: string;
    status: 'completed' | 'in_progress' | 'not_started';
    dueDate?: string;
    evidence?: string[];
  }[];
}

const standardsRequirements: StandardRequirement[] = [
  {
    id: 'env-1',
    framework: 'GRI',
    code: 'GRI 302',
    category: 'Environmental',
    requirement: 'Energy consumption and management within the organization',
    activities: [
      {
        id: 'act-1',
        name: 'Energy Audit',
        description: 'Conduct comprehensive energy audit of all technology systems',
        status: 'completed',
        dueDate: '2024-04-15',
        evidence: ['Energy Audit Report Q1 2024', 'System Performance Logs']
      },
      {
        id: 'act-2',
        name: 'Renewable Energy Transition',
        description: 'Implement renewable energy sources for data centers',
        status: 'in_progress',
        dueDate: '2024-06-30'
      }
    ]
  },
  {
    id: 'gov-1',
    framework: 'TCFD',
    code: 'TCFD-GOV',
    category: 'Governance',
    requirement: 'Board oversight of climate-related risks and opportunities',
    activities: [
      {
        id: 'act-3',
        name: 'ESG Committee Formation',
        description: 'Establish board-level ESG oversight committee',
        status: 'completed',
        evidence: ['Committee Charter', 'Meeting Minutes Q1 2024']
      },
      {
        id: 'act-4',
        name: 'Risk Assessment Framework',
        description: 'Develop climate risk assessment framework for tech operations',
        status: 'not_started',
        dueDate: '2024-07-15'
      }
    ]
  }
];

export default function StandardsMapping() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFramework, setSelectedFramework] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const frameworks = [...new Set(standardsRequirements.map(req => req.framework))];
  const categories = [...new Set(standardsRequirements.map(req => req.category))];

  const filteredRequirements = standardsRequirements.filter(req => {
    const matchesSearch = 
      t(req.requirement).toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFramework = !selectedFramework || req.framework === selectedFramework;
    const matchesCategory = !selectedCategory || req.category === selectedCategory;
    return matchesSearch && matchesFramework && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {t('Standards Requirements Mapping')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {t('Map your activities to ESG framework requirements')}
            </p>
          </div>
          <Button
            className="mt-4 md:mt-0 bg-primary"
            icon={<Download size={18} />}
          >
            {t('Export Mapping')}
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={t('Search requirements...')}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <select
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 appearance-none"
                  value={selectedFramework}
                  onChange={(e) => setSelectedFramework(e.target.value)}
                >
                  <option value="">{t('All Frameworks')}</option>
                  {frameworks.map(framework => (
                    <option key={framework} value={framework}>{framework}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="relative">
                <select
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 appearance-none"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">{t('All Categories')}</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{t(category)}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Requirements Grid */}
        <div className="space-y-6">
          {filteredRequirements.map(requirement => (
            <Card key={requirement.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {requirement.code}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                        {t(requirement.category)}
                      </span>
                    </div>
                    <CardTitle>{t(requirement.requirement)}</CardTitle>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-gray-600 dark:text-gray-400"
                    icon={<ExternalLink size={16} />}
                  >
                    {t('Framework Reference Details')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {requirement.activities.map(activity => (
                    <div
                      key={activity.id}
                      className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {t(activity.name)}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {t(activity.description)}
                          </p>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                          {t(activity.status.toUpperCase())}
                        </span>
                      </div>
                      
                      {(activity.dueDate || activity.evidence) && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex flex-wrap gap-4">
                            {activity.dueDate && (
                              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                                <Info className="h-4 w-4" />
                                <span>{t('Due')}: {new Date(activity.dueDate).toLocaleDateString()}</span>
                              </div>
                            )}
                            {activity.evidence && (
                              <div className="flex items-center gap-2">
                                {activity.evidence.map((doc, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                                  >
                                    {t(doc)}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRequirements.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {t('No requirements found matching your criteria.')}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}