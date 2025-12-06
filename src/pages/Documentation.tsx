import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { 
  Book, 
  Code, 
  Settings, 
  Users,
  Search,
  ChevronRight,
  ExternalLink,
  Download,
  FileText,
  Video,
  Zap
} from 'lucide-react';
import Button from '../components/ui/Button';

export default function Documentation() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: t('All Documentation'), icon: Book },
    { id: 'getting-started', name: t('Getting Started'), icon: Zap },
    { id: 'user-guide', name: t('User Guide'), icon: Users },
    { id: 'api', name: t('API Reference'), icon: Code },
    { id: 'admin', name: t('Administration'), icon: Settings },
  ];

  const documentationSections = [
    {
      id: 'quick-start',
      title: t('Quick Start Guide'),
      description: t('Get up and running with ESGSoluce in minutes'),
      category: 'getting-started',
      type: 'guide',
      readTime: '5 min',
      articles: [
        { title: t('Creating Your Account'), href: '#', type: 'article' },
        { title: t('First ESG Assessment'), href: '#', type: 'article' },
        { title: t('Understanding Your Dashboard'), href: '#', type: 'article' },
        { title: t('Inviting Team Members'), href: '#', type: 'article' }
      ]
    },
    {
      id: 'assessments',
      title: t('ESG Assessments'),
      description: t('Complete guide to conducting ESG assessments'),
      category: 'user-guide',
      type: 'guide',
      readTime: '15 min',
      articles: [
        { title: t('Assessment Framework Overview'), href: '#', type: 'article' },
        { title: t('Data Collection Best Practices'), href: '#', type: 'article' },
        { title: t('Scoring and Benchmarking'), href: '#', type: 'article' },
        { title: t('Generating Reports'), href: '#', type: 'article' }
      ]
    },
    {
      id: 'carbon-tracking',
      title: t('Carbon Management'),
      description: t('Track and reduce your organization\'s carbon footprint'),
      category: 'user-guide',
      type: 'guide',
      readTime: '12 min',
      articles: [
        { title: t('Setting Up Carbon Tracking'), href: '#', type: 'article' },
        { title: t('Scope 1, 2, 3 Emissions'), href: '#', type: 'article' },
        { title: t('Carbon Reduction Planning'), href: '#', type: 'article' },
        { title: t('Offset Management'), href: '#', type: 'article' }
      ]
    },
    {
      id: 'api-docs',
      title: t('API Documentation'),
      description: t('Integrate ESGSoluce with your existing systems'),
      category: 'api',
      type: 'technical',
      readTime: '30 min',
      articles: [
        { title: t('Authentication'), href: '#', type: 'code' },
        { title: t('Assessment Endpoints'), href: '#', type: 'code' },
        { title: t('Data Export API'), href: '#', type: 'code' },
        { title: t('Webhooks'), href: '#', type: 'code' }
      ]
    },
    {
      id: 'admin-guide',
      title: t('Administrator Guide'),
      description: t('Manage users, permissions, and organization settings'),
      category: 'admin',
      type: 'guide',
      readTime: '20 min',
      articles: [
        { title: t('User Management'), href: '#', type: 'article' },
        { title: t('Role-Based Permissions'), href: '#', type: 'article' },
        { title: t('Data Security Settings'), href: '#', type: 'article' },
        { title: t('Integration Management'), href: '#', type: 'article' }
      ]
    },
    {
      id: 'frameworks',
      title: t('ESG Frameworks'),
      description: t('Understanding supported frameworks and standards'),
      category: 'user-guide',
      type: 'reference',
      readTime: '25 min',
      articles: [
        { title: t('GRI Standards Guide'), href: '#', type: 'article' },
        { title: t('SASB Implementation'), href: '#', type: 'article' },
        { title: t('TCFD Reporting'), href: '#', type: 'article' },
        { title: t('CSRD Compliance'), href: '#', type: 'article' }
      ]
    }
  ];

  const filteredSections = documentationSections.filter(section => {
    const matchesSearch = section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         section.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || section.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'code':
        return <Code className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'guide':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'technical':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'reference':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t('Documentation')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {t('Everything you need to know about using ESGSoluce effectively.')}
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('Search documentation...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="py-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Documentation Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredSections.map((section) => (
              <Card key={section.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(section.type)}`}>
                      {t(section.type)}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    {section.description}
                  </p>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {t('Estimated read time')}: {section.readTime}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {section.articles.map((article, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3">
                          {getTypeIcon(article.type)}
                          <span className="text-gray-900 dark:text-white font-medium">
                            {article.title}
                          </span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      {t('View Section')}
                    </Button>
                    <Button variant="ghost" size="sm" icon={<Download className="h-4 w-4" />}>
                      {t('Download PDF')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredSections.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {t('No documentation found matching your search.')}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                {t('Clear Search')}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {t('Popular Resources')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t('Most accessed documentation and guides.')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: t('API Quick Start'),
                  description: t('Get started with our REST API in 5 minutes'),
                  icon: Code,
                  href: '#'
                },
                {
                  title: t('Video Tutorials'),
                  description: t('Watch our comprehensive video guide series'),
                  icon: Video,
                  href: '#'
                },
                {
                  title: t('Best Practices'),
                  description: t('Learn ESG best practices from industry experts'),
                  icon: Book,
                  href: '#'
                }
              ].map((resource, index) => {
                const IconComponent = resource.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {resource.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {resource.description}
                      </p>
                      <Button variant="outline" size="sm" icon={<ExternalLink className="h-4 w-4" />}>
                        {t('View Resource')}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('Need Additional Help?')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              {t('Can\'t find what you\'re looking for? Our support team is here to help.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-primary">
                {t('Contact Support')}
              </Button>
              <Button variant="outline">
                {t('Request Documentation')}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}