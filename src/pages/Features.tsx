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
  Lock,
  Radar,
  FolderOpen,
  X
} from 'lucide-react';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

export default function Features() {
  const { t } = useTranslation();

  const mainFeatures = [
    {
      title: t('Impact Risk Radar™'),
      description: t('Instantly convert your sector, geography, and supply-chain footprint into a clear ESG exposure view. See environmental pressure signals (climate, deforestation, traceability), social risk alerts (labor, sourcing practices), governance credibility gaps, and regulatory pressure intensity by region.'),
      icon: Radar,
      benefits: [
        t('Sector and geography-based exposure analysis'),
        t('Regulatory pressure mapping by region'),
        t('Supply chain risk visualization'),
        t('Real-time exposure signals')
      ],
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      title: t('Evidence Readiness Workspace'),
      description: t('Centralized space to organize, assess, and evidence your sustainability posture. Get coverage indicators by ESG pillar, readiness snapshots with timestamps, and exportable views for regulators, buyers, and auditors.'),
      icon: FolderOpen,
      benefits: [
        t('Centralized evidence inventory'),
        t('Coverage indicators by ESG pillar'),
        t('Readiness snapshots with timestamps'),
        t('Exportable views for stakeholders')
      ],
      image: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      title: t('Impact Scan'),
      description: t('Understand your current ESG posture through comprehensive assessment. Foundation for exposure analysis and evidence requirements.'),
      icon: Shield,
      benefits: [
        t('Multi-framework alignment (GRI, SASB, TCFD, CSRD, ISSB)'),
        t('Baseline understanding of current posture'),
        t('Foundation for risk analysis'),
        t('Progress tracking and save/resume')
      ],
      image: 'https://images.pexels.com/photos/2990647/pexels-photo-2990647.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      title: t('Regulatory Intelligence Modules'),
      description: t('Modular intelligence for EU Deforestation Regulation (EUDR), Child Labor & Social Compliance, Supply-Chain Transparency, and Climate & Environmental Disclosure Pressure. Activate only what you need.'),
      icon: Network,
      benefits: [
        t('EUDR compliance tracking'),
        t('Child Labor & Social Compliance'),
        t('Supply Chain Transparency'),
        t('Climate Disclosure Pressure')
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
              {t('ESG Risk Intelligence & Evidence Readiness')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {t('ImpactSoluce transforms ESG obligations into decision-grade intelligence. Know where your impact exposure is — before regulators, buyers, or financiers ask. Not reports. Not promises. Evidence-based exposure signals.')}
            </p>
            <Link to="/assessment">
              <Button className="bg-primary">
                {t('Get Started')}
              </Button>
            </Link>
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
                    <Link to={index === 0 ? "/assessment" : index === 1 ? "/dashboard" : index === 2 ? "/standards-mapping" : "/reports"}>
                      <Button variant="outline" icon={<ArrowRight className="h-4 w-4" />}>
                        {t('Learn More')}
                      </Button>
                    </Link>
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
              {t('What ImpactSoluce Is NOT')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
              {t('Let\'s be clear. ImpactSoluce is an intelligence layer, not an opinion engine.')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-8">
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <X className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{t('Does not generate ESG stories')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <X className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{t('Does not replace consultants')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <X className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{t('Does not certify or score moral performance')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <X className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{t('Does not recommend remediation actions')}</p>
                </div>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 mt-12">
              {t('Additional Capabilities')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('Supporting features for comprehensive risk intelligence and evidence management.')}
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
              {t('Ready to Know Your Exposure?')}
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              {t('Join organizations using ImpactSoluce™ to identify where regulatory pressure will hit and prove evidence readiness — before regulators, buyers, or financiers ask.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/assessment">
                <Button className="bg-white text-primary hover:bg-gray-100">
                  {t('Get Started')}
                </Button>
              </Link>
              <Link to="/assessment?demo=true">
                <Button variant="outline" className="border-white text-white hover:bg-primary-800">
                  {t('Try Demo')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}