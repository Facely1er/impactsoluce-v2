import React from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/layout/Layout';
import { techDependencies } from '../utils/data';
import TechDependencyCard from '../components/tech/TechDependencyCard';
import { Filter, PlusCircle, Search } from 'lucide-react';
import Button from '../components/ui/Button';

export default function TechDependencies() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedImpact, setSelectedImpact] = React.useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  // Get unique categories
  const categories = [...new Set(techDependencies.map(dep => dep.category))];

  // Filter dependencies based on search query and filters
  const filteredDependencies = techDependencies.filter(dep => {
    const matchesSearch = dep.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesImpact = selectedImpact ? dep.impact === selectedImpact : true;
    const matchesCategory = selectedCategory ? dep.category === selectedCategory : true;
    return matchesSearch && matchesImpact && matchesCategory;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {t('Technology Dependencies')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {t('Manage and analyze the environmental impact of your technology systems')}
            </p>
          </div>
          <Button
            className="mt-4 md:mt-0 bg-primary"
            icon={<PlusCircle size={18} />}
          >
            {t('Add New Technology')}
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={t('Search technologies...')}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <select
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 appearance-none"
                  value={selectedImpact || ''}
                  onChange={(e) => setSelectedImpact(e.target.value || null)}
                >
                  <option value="">{t('All Impact Levels')}</option>
                  <option value="low">{t('Low Impact')}</option>
                  <option value="medium">{t('Medium Impact')}</option>
                  <option value="high">{t('High Impact')}</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="relative">
                <select
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 appearance-none"
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(e.target.value || null)}
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

        {/* Technology Dependencies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDependencies.map(dependency => (
            <TechDependencyCard key={dependency.id} dependency={dependency} />
          ))}
        </div>

        {filteredDependencies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {t('No technology dependencies found matching your criteria.')}
            </p>
          </div>
        )}

        {/* Sustainability Tips */}
        <div className="mt-12 bg-primary/5 dark:bg-primary/10 rounded-lg p-6 border border-primary/20">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('Sustainability Tips')}
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 text-primary">•</div>
              <p className="ml-3 text-gray-600 dark:text-gray-300">
                {t('Consider migrating high-impact services to renewable energy powered cloud providers')}
              </p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 text-primary">•</div>
              <p className="ml-3 text-gray-600 dark:text-gray-300">
                {t('Implement server optimization and consolidation for data center infrastructure')}
              </p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 text-primary">•</div>
              <p className="ml-3 text-gray-600 dark:text-gray-300">
                {t('Extend hardware lifecycle for end-user devices to reduce e-waste')}
              </p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 text-primary">•</div>
              <p className="ml-3 text-gray-600 dark:text-gray-300">
                {t('Prioritize software vendors with established sustainability practices')}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}