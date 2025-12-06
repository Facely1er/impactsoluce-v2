import React from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { ArrowRight, BarChart3, CheckCircle2, LineChart, Shield, Sparkles, FileText } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Link } from 'react-router-dom';

export default function Home() {
  const { t } = useTranslation();

  const features = [
    {
      title: t('Impact Scan'),
      description: t('Comprehensive ESG assessment engine that evaluates your organization against global standards. Get detailed scorecards and actionable roadmaps.'),
      icon: <Shield className="h-8 w-8 text-primary" />,
    },
    {
      title: t('ESG & Carbon Dashboard'),
      description: t('Real-time dashboards tracking your ESG performance, carbon footprint, and sustainability metrics with interactive analytics and visualization.'),
      icon: <BarChart3 className="h-8 w-8 text-secondary" />,
    },
    {
      title: t('Standards Mapping & Gap View'),
      description: t('Map your activities to GRI, SASB, TCFD, ISSB, CSRD, ISO 14001/26000/50001 requirements. Identify gaps and track compliance progress.'),
      icon: <Sparkles className="h-8 w-8 text-success" />,
    },
    {
      title: t('Impact Reports & Export'),
      description: t('Generate comprehensive ESG reports and export in multiple formats (JSON, Markdown, PDF). Integration-ready for Supabase and APIs.'),
      icon: <FileText className="h-8 w-8 text-accent" />,
    },
  ];

  const benefits = [
    t('Improve ESG performance and ratings'),
    t('Ensure compliance with emerging regulations'),
    t('Reduce environmental impact of technology operations'),
    t('Identify sustainability risks in technology dependencies'),
    t('Build stakeholder trust through transparent reporting'),
    t('Develop actionable sustainability strategies'),
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-12 md:py-20 lg:py-24">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col justify-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
                  <span className="block">{t('Transform your')}</span>
                  <span className="block text-primary">{t('ESG & Impact performance')}</span>
                  <span className="block">{t('through ImpactSoluce™')}</span>
                </h1>
                <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
                  {t('ImpactSoluce™ by ERMITS: The comprehensive ESG + Impact platform mapping to GRI, SASB, TCFD, CSRD, ISSB, and more. Measure, manage, and report your sustainability performance with confidence.')}
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link to="/dashboard">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-primary hover:bg-primary-600"
                      aria-label={t('Get Started with ESG Platform')}
                    >
                      {t('Get Started')}
                    </Button>
                  </Link>
                  <Link to="/assessment?demo=true">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto border-primary text-primary"
                      aria-label={t('Try Demo Assessment')}
                    >
                      {t('Try Demo')}
                    </Button>
                  </Link>
                </div>
                <div className="mt-8 flex items-center">
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="inline-block h-8 w-8 rounded-full bg-gray-200 ring-2 ring-white dark:bg-gray-700 dark:ring-gray-900"
                      />
                    ))}
                  </div>
                  <p className="ml-4 text-xs text-gray-600 dark:text-gray-400">
                    {t('Trusted by 500+ organizations worldwide')}
                  </p>
                </div>
              </div>
              <div className="relative mx-auto max-w-[75%] lg:max-w-none">
                <div className="relative rounded-2xl bg-gray-50 p-4 shadow-xl dark:bg-gray-800 lg:p-6">
                  <div className="aspect-[3/2] overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
                    <img
                      src="https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg?auto=compress&cs=tinysrgb&w=1600"
                      alt={t('ESG Dashboard preview')}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-6 rounded-2xl bg-secondary/10 p-4 shadow-lg dark:bg-secondary/20 lg:-bottom-10 lg:-left-10 lg:p-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <LineChart className="h-5 w-5 text-secondary" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {t('Carbon reduction: 27% YoY')}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                      <div className="h-2 rounded-full bg-secondary" style={{ width: '73%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              {t('ImpactSoluce™: Your Complete ESG & Impact Platform')}
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('Five core pillars: Impact Scan (assessment), ESG & Carbon Dashboard, Standards Mapping & Gap View, Impact Reports & Export, and Integration-ready architecture.')}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, idx) => (
              <Card key={idx} className="overflow-hidden border-0">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 text-xl font-medium text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                {t('Transform Your Organization\'s ESG Performance')}
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                {t('ImpactSoluce™ by ERMITS helps you meet stakeholder demands for sustainability while building resilient technology systems. Our platform is designed to drive measurable improvements in your environmental, social, and governance performance, with comprehensive mapping to global ESG frameworks.')}
              </p>
              <ul className="mt-8 space-y-4">
                {benefits.map((benefit, idx) => (
                  <li key={idx} className="flex">
                    <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-primary" />
                    <span className="ml-3 text-gray-600 dark:text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link to="/assessment">
                  <Button className="bg-primary hover:bg-primary-600 inline-flex items-center">
                    {t('Start Your ESG Assessment')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/2990647/pexels-photo-2990647.jpeg?auto=compress&cs=tinysrgb&w=1600"
                  alt={t('Sustainable business')}
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8">
                  <div className="max-w-md">
                    <p className="text-2xl font-medium text-white mb-2">
                      {t('ImpactSoluce™ helped us improve our ESG rating by 30% in just 6 months.')}
                    </p>
                    <p className="text-white/80">
                      {t('— Sarah Johnson, Sustainability Director')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-900 dark:bg-gray-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-primary px-6 py-16 sm:p-16">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {t('Ready to transform your ESG strategy?')}
              </h2>
              <p className="mt-4 text-lg text-primary-100">
                {t('Join hundreds of organizations already using ImpactSoluce™ by ERMITS to improve their ESG performance and build a more sustainable future.')}
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Link to="/assessment">
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-gray-100"
                  >
                    {t('Get Started')}
                  </Button>
                </Link>
                <Link to="/assessment?demo=true">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-primary-800"
                  >
                    {t('Try Demo')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}