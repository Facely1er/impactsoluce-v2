import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { CheckCircle2, X, Star, Users, Building, Globe } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Pricing() {
  const { t } = useTranslation();
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: t('Free / Trial'),
      description: t('Perfect for organizations beginning their exposure analysis journey'),
      icon: Users,
      price: 0,
      period: t('Limited assessments'),
      features: [
        t('Basic Impact Scan (1 assessment)'),
        t('Up to 50 employees'),
        t('Standard reporting templates'),
        t('Email support'),
        t('Basic carbon tracking'),
        t('GRI framework alignment'),
        t('JSON export'),
      ],
      limitations: [
        t('Advanced analytics'),
        t('Custom frameworks'),
        t('API access'),
        t('Multiple assessments'),
      ],
      popular: false,
    },
    {
      name: t('Pro'),
      description: t('Comprehensive risk intelligence and evidence readiness for SMBs'),
      icon: Building,
      price: isAnnual ? 799 : 899,
      period: isAnnual ? t('per month, billed annually') : t('per month'),
      features: [
        t('Impact Risk Radar™'),
        t('Evidence Readiness Workspace'),
        t('Impact Scan (unlimited)'),
        t('Basic regulatory intelligence'),
        t('Up to 500 employees'),
        t('Multiple users included'),
        t('Export for regulators/auditors'),
        t('Priority support'),
        t('Multiple framework support (GRI, SASB, TCFD, CSRD, ISSB)'),
        t('API access'),
      ],
      limitations: [
        t('White-label solutions'),
        t('Custom integrations'),
      ],
      popular: true,
    },
    {
      name: t('Enterprise'),
      description: t('Complete risk intelligence platform for large organizations'),
      icon: Globe,
      price: null,
      period: t('Custom pricing'),
      features: [
        t('All Pro features'),
        t('All Regulatory Intelligence Modules (EUDR, Child Labor, Supply Chain, Climate)'),
        t('Advanced supply chain analysis'),
        t('Unlimited Impact Scans'),
        t('Unlimited employees and users'),
        t('White-label solutions'),
        t('Dedicated account manager'),
        t('Custom integrations'),
        t('On-premise deployment option'),
        t('24/7 premium support'),
        t('Training & consulting'),
        t('ERMITS ecosystem integration'),
      ],
      limitations: [],
      popular: false,
    },
  ];

  const addOns = [
    {
      name: t('ESG Consulting'),
      description: t('Expert guidance for ESG strategy development'),
      price: t('Starting at $5,000'),
    },
    {
      name: t('Custom Framework Development'),
      description: t('Tailored ESG frameworks for your industry'),
      price: t('Starting at $10,000'),
    },
    {
      name: t('Training & Certification'),
      description: t('Comprehensive ESG training for your team'),
      price: t('Starting at $2,500'),
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t('Simple, Transparent Pricing')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {t('Choose the plan that fits your organization\'s risk intelligence needs. All plans include core ImpactSoluce™ features: Impact Risk Radar™, Evidence Readiness Workspace, Impact Scan, and Regulatory Intelligence Modules.')}
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center mb-8">
              <span className={`mr-3 ${!isAnnual ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500'}`}>
                {t('Monthly')}
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                aria-label={isAnnual ? t('Switch to monthly billing') : t('Switch to annual billing')}
                title={isAnnual ? t('Switch to monthly billing') : t('Switch to annual billing')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isAnnual ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAnnual ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`ml-3 ${isAnnual ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500'}`}>
                {t('Annual')}
              </span>
              {isAnnual && (
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  {t('Save 15%')}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => {
              const IconComponent = plan.icon;
              return (
                <Card 
                  key={index} 
                  className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        {t('Most Popular')}
                      </div>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <IconComponent className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      {plan.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="text-center mb-6">
                      {plan.price ? (
                        <>
                          <div className="text-4xl font-bold text-gray-900 dark:text-white">
                            ${plan.price}
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {plan.period}
                          </p>
                        </>
                      ) : (
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {plan.period}
                        </div>
                      )}
                    </div>
                    
                    <Link to={plan.price ? "/impact-scan" : "/contact"}>
                      <Button 
                        className={`w-full mb-6 ${plan.popular ? 'bg-primary' : ''}`}
                        variant={plan.popular ? 'primary' : 'outline'}
                      >
                        {plan.price ? t('Get Started') : t('Contact Sales')}
                      </Button>
                    </Link>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {t('Included features:')}
                      </h4>
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                      
                      {plan.limitations.length > 0 && (
                        <>
                          <h4 className="font-medium text-gray-900 dark:text-white mt-6">
                            {t('Not included:')}
                          </h4>
                          {plan.limitations.map((limitation, idx) => (
                            <div key={idx} className="flex items-center">
                              <X className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                              <span className="text-gray-500">{limitation}</span>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {t('Professional Services')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t('Accelerate your ESG journey with our expert consulting and custom solutions.')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {addOns.map((addon, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {addon.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {addon.description}
                    </p>
                    <div className="text-lg font-medium text-primary mb-4">
                      {addon.price}
                    </div>
                    <Button variant="outline" className="w-full">
                      {t('Learn More')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {t('Frequently Asked Questions')}
              </h2>
            </div>
            
            <div className="space-y-6">
              {[
                {
                  question: t('What\'s included in the free trial?'),
                  answer: t('All paid plans include a 14-day free trial with full access to features. No credit card required to start.')
                },
                {
                  question: t('Can I change plans anytime?'),
                  answer: t('Yes, you can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle.')
                },
                {
                  question: t('Do you offer custom pricing for large organizations?'),
                  answer: t('Yes, we offer custom pricing and features for organizations with 1000+ employees. Contact our sales team for details.')
                },
                {
                  question: t('What support is included?'),
                  answer: t('All plans include email support. Professional and Enterprise plans include priority support and dedicated account management.')
                }
              ].map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {faq.answer}
                    </p>
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
              {t('Ready to Get Started?')}
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              {t('Start your free trial today and see how ImpactSoluce™ by ERMITS can transform your sustainability reporting and ESG compliance.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/impact-scan">
                <Button className="bg-white text-primary hover:bg-gray-100">
                  {t('Get Started')}
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="border-white text-white hover:bg-primary-800">
                  {t('Contact Sales')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}