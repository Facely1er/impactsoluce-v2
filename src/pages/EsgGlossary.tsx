import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Search, BookOpen, ExternalLink, Filter } from 'lucide-react';
import Button from '../components/ui/Button';

export default function EsgGlossary() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: t('All Terms') },
    { id: 'environmental', name: t('Environmental') },
    { id: 'social', name: t('Social') },
    { id: 'governance', name: t('Governance') },
    { id: 'frameworks', name: t('Frameworks') },
    { id: 'regulations', name: t('Regulations') },
    { id: 'metrics', name: t('Metrics') },
  ];

  const glossaryTerms = [
    {
      id: 1,
      term: 'Carbon Footprint',
      category: 'environmental',
      definition: 'The total amount of greenhouse gases produced directly and indirectly by human activities, usually expressed in equivalent tons of carbon dioxide (CO2e).',
      relatedTerms: ['Scope 1 Emissions', 'Scope 2 Emissions', 'Scope 3 Emissions', 'GHG Protocol'],
      frameworks: ['GRI 305', 'TCFD'],
    },
    {
      id: 2,
      term: 'ESG',
      category: 'frameworks',
      definition: 'Environmental, Social, and Governance - a framework used to evaluate a company\'s sustainability and ethical impact. Environmental factors include climate change and resource usage; Social factors include employee relations and community impact; Governance factors include board diversity and executive compensation.',
      relatedTerms: ['Sustainability', 'CSR', 'Impact Investing'],
      frameworks: ['Multiple'],
    },
    {
      id: 3,
      term: 'GRI Standards',
      category: 'frameworks',
      definition: 'Global Reporting Initiative Standards - the most widely used standards for sustainability reporting worldwide. They provide a framework for organizations to report on their economic, environmental, and social impacts.',
      relatedTerms: ['Sustainability Reporting', 'Materiality Assessment', 'Stakeholder Engagement'],
      frameworks: ['GRI'],
    },
    {
      id: 4,
      term: 'SASB',
      category: 'frameworks',
      definition: 'Sustainability Accounting Standards Board - provides industry-specific standards for disclosure of financially material sustainability information by publicly listed corporations to their investors.',
      relatedTerms: ['Materiality', 'Industry Standards', 'Financial Materiality'],
      frameworks: ['SASB'],
    },
    {
      id: 5,
      term: 'TCFD',
      category: 'frameworks',
      definition: 'Task Force on Climate-related Financial Disclosures - provides recommendations for more effective climate-related disclosures that promote more informed investment, credit, and insurance underwriting decisions.',
      relatedTerms: ['Climate Risk', 'Scenario Analysis', 'Financial Disclosure'],
      frameworks: ['TCFD'],
    },
    {
      id: 6,
      term: 'Scope 1 Emissions',
      category: 'environmental',
      definition: 'Direct greenhouse gas emissions from sources that are owned or controlled by the organization, such as fuel combustion in boilers, furnaces, vehicles, and emissions from chemical production.',
      relatedTerms: ['Scope 2 Emissions', 'Scope 3 Emissions', 'GHG Protocol'],
      frameworks: ['GRI 305', 'GHG Protocol'],
    },
    {
      id: 7,
      term: 'Scope 2 Emissions',
      category: 'environmental',
      definition: 'Indirect greenhouse gas emissions from the generation of purchased electricity, steam, heating, and cooling consumed by the organization.',
      relatedTerms: ['Scope 1 Emissions', 'Scope 3 Emissions', 'Renewable Energy'],
      frameworks: ['GRI 305', 'GHG Protocol'],
    },
    {
      id: 8,
      term: 'Scope 3 Emissions',
      category: 'environmental',
      definition: 'All other indirect greenhouse gas emissions that occur in a company\'s value chain, including both upstream and downstream emissions.',
      relatedTerms: ['Value Chain', 'Supply Chain', 'Product Lifecycle'],
      frameworks: ['GRI 305', 'GHG Protocol'],
    },
    {
      id: 9,
      term: 'Materiality Assessment',
      category: 'frameworks',
      definition: 'The process of identifying and prioritizing the ESG topics that are most important to an organization and its stakeholders.',
      relatedTerms: ['Stakeholder Engagement', 'Double Materiality', 'Impact Assessment'],
      frameworks: ['GRI', 'SASB', 'CSRD'],
    },
    {
      id: 10,
      term: 'CSRD',
      category: 'regulations',
      definition: 'Corporate Sustainability Reporting Directive - EU legislation that requires companies to report on sustainability matters such as environmental rights, social rights, and human rights.',
      relatedTerms: ['ESRS', 'Double Materiality', 'EU Taxonomy'],
      frameworks: ['ESRS'],
    },
    {
      id: 11,
      term: 'Net Zero',
      category: 'environmental',
      definition: 'Achieving a balance between the amount of greenhouse gas emissions produced and the amount removed from the atmosphere.',
      relatedTerms: ['Carbon Neutral', 'Science-Based Targets', 'Carbon Offsetting'],
      frameworks: ['SBTi', 'TCFD'],
    },
    {
      id: 12,
      term: 'Diversity & Inclusion',
      category: 'social',
      definition: 'Diversity refers to the presence of differences within a given setting, while inclusion refers to the practice of ensuring that people feel a sense of belonging and support.',
      relatedTerms: ['Board Diversity', 'Pay Equity', 'Employee Engagement'],
      frameworks: ['GRI 405', 'SASB'],
    },
    {
      id: 13,
      term: 'Board Independence',
      category: 'governance',
      definition: 'The degree to which board members are free from relationships that could interfere with their ability to make independent judgments.',
      relatedTerms: ['Board Diversity', 'Corporate Governance', 'Executive Compensation'],
      frameworks: ['Various Governance Codes'],
    },
    {
      id: 14,
      term: 'Science-Based Targets',
      category: 'environmental',
      definition: 'Greenhouse gas emission reduction targets that are in line with what the latest climate science says is necessary to meet the goals of the Paris Agreement.',
      relatedTerms: ['SBTi', 'Paris Agreement', 'Net Zero'],
      frameworks: ['SBTi'],
    },
    {
      id: 15,
      term: 'Circular Economy',
      category: 'environmental',
      definition: 'An economic model designed to eliminate waste and the continual use of resources through reuse, sharing, repair, refurbishment, remanufacturing, and recycling.',
      relatedTerms: ['Waste Management', 'Resource Efficiency', 'Sustainable Design'],
      frameworks: ['GRI 306'],
    },
  ];

  const filteredTerms = glossaryTerms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      environmental: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      social: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      governance: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      frameworks: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
      regulations: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      metrics: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-primary/10 rounded-full">
                <BookOpen className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t('ESG Glossary')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {t('Comprehensive definitions of key ESG terms, frameworks, and concepts to help you navigate the world of sustainable business.')}
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between max-w-4xl mx-auto">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('Search terms...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Glossary Terms */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {searchQuery || selectedCategory !== 'all' ? t('Search Results') : t('All Terms')}
              </h2>
              <span className="text-gray-600 dark:text-gray-400">
                {filteredTerms.length} {t('terms found')}
              </span>
            </div>
            
            <div className="space-y-6">
              {filteredTerms.map((term) => (
                <Card key={term.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-2">{term.term}</CardTitle>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(term.category)}`}>
                          {categories.find(c => c.id === term.category)?.name}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {term.definition}
                    </p>
                    
                    {term.relatedTerms.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          {t('Related Terms')}:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {term.relatedTerms.map((relatedTerm, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 cursor-pointer dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                              {relatedTerm}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {term.frameworks.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          {t('Relevant Frameworks')}:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {term.frameworks.map((framework, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-primary/10 text-primary rounded font-medium"
                            >
                              {framework}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredTerms.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  {t('No terms found matching your criteria.')}
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                >
                  {t('Clear Filters')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {t('Learn More About ESG')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t('Explore additional resources to deepen your understanding of ESG concepts and frameworks.')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: t('ESG Frameworks Guide'),
                  description: t('Comprehensive overview of major ESG reporting frameworks'),
                  link: '/resources'
                },
                {
                  title: t('Getting Started with ESG'),
                  description: t('Step-by-step guide for organizations beginning their ESG journey'),
                  link: '/documentation'
                },
                {
                  title: t('ESG Best Practices'),
                  description: t('Industry best practices and case studies'),
                  link: '/case-studies'
                }
              ].map((resource, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {resource.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {resource.description}
                    </p>
                    <Button variant="outline" size="sm" icon={<ExternalLink className="h-4 w-4" />}>
                      {t('Learn More')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {t('Ready to Start Your ESG Journey?')}
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              {t('Use our platform to assess, measure, and improve your organization\'s ESG performance.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-primary hover:bg-gray-100">
                {t('Start Assessment')}
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-primary-800">
                {t('Contact Our Experts')}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}