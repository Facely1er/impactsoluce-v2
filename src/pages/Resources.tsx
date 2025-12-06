import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardTitle } from '../components/ui/Card';
import { Download, FileText, Search } from 'lucide-react';
import { resources } from '../utils/data';

export default function Resources() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Get unique categories
  const categories = [...new Set(resources.map(resource => resource.category))];

  // Filter resources based on search query and active category
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory ? resource.category === activeCategory : true;
    return matchesSearch && matchesCategory;
  });

  // Function to get icon based on file type
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500" />;
      case 'docx':
        return <FileText className="h-6 w-6 text-blue-500" />;
      case 'xlsx':
        return <FileText className="h-6 w-6 text-green-500" />;
      default:
        return <FileText className="h-6 w-6 text-gray-500" />;
    }
  };

  // Function to get category display name
  const getCategoryName = (category: string) => {
    return t(category.charAt(0).toUpperCase() + category.slice(1) + 's');
  };
  
  // Function to get category color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'policy': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
      'guide': 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
      'template': 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
      'checklist': 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800'
    };
    return colors[category] || 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800';
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {t('ESG Resource Center')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {t('Access templates, guides, and frameworks to support your ESG initiatives')}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t('Search resources...')}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center mt-6">
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                activeCategory === null
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveCategory(null)}
            >
              {t('All Resources')}
            </button>
            
            {categories.map(category => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  activeCategory === category
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {getCategoryName(category)}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map(resource => (
            <Card key={resource.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start mb-4">
                  <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-800">
                    {getFileIcon(resource.type)}
                  </div>
                  <div className="ml-3">
                    <CardTitle className="text-lg">{t(resource.title)}</CardTitle>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border inline-block mt-2 ${getCategoryColor(resource.category)}`}>
                      {getCategoryName(resource.category)}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{t(resource.description)}</p>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">
                    {resource.type.toUpperCase()}
                  </span>
                  <a 
                    href={resource.url} 
                    className="inline-flex items-center text-primary hover:text-primary-700 font-medium text-sm"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    {t('Download')}
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {t('No resources found matching your search criteria.')}
            </p>
          </div>
        )}

        {/* Request Resources Section */}
        <div className="mt-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {t('Can\'t find what you\'re looking for?')}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            {t('Our team can help you develop custom ESG resources tailored to your industry and specific needs.')}
          </p>
          <button className="inline-flex items-center bg-primary hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-md">
            {t('Request Custom Resources')}
          </button>
        </div>
      </div>
    </Layout>
  );
}