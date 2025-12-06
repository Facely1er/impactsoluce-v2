import React from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { 
  BarChart3, 
  Shield, 
  Users, 
  FileText,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Network,
  Settings,
  Lock
} from 'lucide-react';
import Button from '../components/ui/Button';

export default function Features() {
  const { t } = useTranslation();

  const mainFeatures = [
    {
      title: t('Impact Scan (Assessment)'),
      description: t('Comprehensive ESG assessment engine that evaluates your organization against global standards. Get detailed scorecards with E, S, G breakdowns and actionable roadmaps.'),
      icon: BarChart3,
      benefits: [
        t('Multi-framework alignment (GRI, SASB, TCFD, CSRD, ISSB)'),
        t('Automated scoring algorithms'),
        t('Evidence-based questions'),
        t('Progress tracking and save/resume')
      ],
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      title: t('ESG & Carbon Dashboard'),
      description: t('Real-time dashboards tracking your ESG performance, carbon footprint, and sustainability metrics with interactive analytics and visualization.'),
      icon: TrendingUp,
      benefits: [
        t('Real-time ESG metrics'),
        t('Carbon footprint tracking'),
        t('Interactive charts and graphs'),
        t('Performance trends')
      ],
      image: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      title: t('Standards Mapping & Gap View'),
      description: t('Map your activities to GRI, SASB, TCFD, ISSB, CSRD, ISO 14001/26000/50001 requirements. Identify gaps, track compliance progress, and link evidence.'),
      icon: Network,
      benefits: [
        t('Multi-framework mapping'),
        t('Gap analysis'),
        t('Requirement tracking'),
        t('Evidence linking')
      ],
      image: 'https://images.pexels.com/photos/2990647/pexels-photo-2990647.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      title: t('Impact Reports & Export'),
      description: t('Generate comprehensive ESG reports and export in multiple formats (JSON, Markdown, PDF). Integration-ready for Supabase and APIs.'),
      icon: FileText,
      benefits: [
        t('Multiple export formats'),
        t('Customizable templates'),
        t('API integration ready'),
        t('Automated report generation')
      ],
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  const additionalFeatures = [
    {
      title: t('Real-time Dashboards'),
      description: t('Monitor your ESG performance with interactive dashboards and real-time analytics.'),
      icon: TrendingUp,
    },
    {
      title: t('Compliance Management'),
      description: t('Stay compliant with evolving ESG regulations and reporting requirements.'),
      icon: Shield,
    },
    {
      title: t('Stakeholder Collaboration'),
      description: t('Engage stakeholders with transparent reporting and collaborative tools.'),
      icon: Users,
    },
    {
      title: t('Automated Reporting'),
      description: t('Generate comprehensive ESG reports automatically with customizable templates.'),
      icon: FileText,
    },
    {
      title: t('Data Security'),
      description: t('Enterprise-grade security with encryption and access controls.'),
      icon: Lock,
    },
    {
      title: t('API Integration'),
      description: t('Seamlessly integrate with existing systems through our robust API.'),
      icon: Settings,
    }
  ];

  const integrations = [
    { name: 'Microsoft Excel', logo: '📊' },
    { name: 'Salesforce', logo: '☁️' },
    { name: 'SAP', logo: '🔧' },
    { name: 'Oracle', logo: '🗄️' },
    { name: 'Power BI', logo: '📈' },
    { name: 'Tableau', logo: '📊' }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t('Powerful Features for ESG Excellence')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {t('ImpactSoluce™ by ERMITS: Everything you need to measure, manage, and improve your organization\'s ESG performance. Five core pillars: Impact Scan, ESG & Carbon Dashboard, Standards Mapping, Impact Reports, and Integration-ready architecture.')}
            </p>
            <Button className="bg-primary">
              {t('Start Free Trial')}
            </Button>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="space-y-20">
            {mainFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              const isReverse = index % 2 === 1;
              
              return (
                <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isReverse ? 'lg:grid-flow-col-dense' : ''}`}>
                  <div className={isReverse ? 'lg:col-start-2' : ''}>
                    <div className="flex items-center mb-4">
                      <div className="p-3 bg-primary/10 rounded-lg mr-4">
                        <IconComponent className="h-8 w-8 text-primary" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {feature.title}
                      </h2>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                      {feature.description}
                    </p>
                    <div className="space-y-3 mb-6">
                      {feature.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                          <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" icon={<ArrowRight className="h-4 w-4" />}>
                      {t('Learn More')}
                    </Button>
                  </div>
                  <div className={isReverse ? 'lg:col-start-1' : ''}>
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-80 object-cover rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('Complete ESG Solution')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('Our platform includes everything you need for comprehensive ESG management and reporting.')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center mb-2">
                      <div className="p-2 bg-primary/10 rounded-lg mr-3">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('Seamless Integrations')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t('Connect with your existing tools and systems for a unified workflow.')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {integrations.map((integration, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-2xl">
                  {integration.logo}
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {integration.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {t('Ready to Transform Your ESG Performance?')}
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              {t('Join organizations using ImpactSoluce™ by ERMITS to drive meaningful sustainability improvements.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-primary hover:bg-gray-100">
                {t('Start Free Trial')}
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-primary-800">
                {t('Schedule Demo')}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}