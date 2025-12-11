import { useTranslation } from 'react-i18next';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { ArrowRight, CheckCircle2, LineChart, Shield, Sparkles, Radar, FolderOpen } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Link } from 'react-router-dom';

export default function Home() {
  const { t } = useTranslation();

  const features = [
    {
      title: t('Impact Risk Radar™'),
      description: t('Instantly convert your sector, geography, and supply-chain footprint into a clear ESG exposure view. See environmental pressure signals, social risk alerts, governance credibility gaps, and regulatory pressure intensity by region.'),
      icon: <Radar className="h-8 w-8 text-primary" />,
      available: true,
      link: '/risk-radar',
    },
    {
      title: t('Evidence Readiness Workspace'),
      description: t('Centralized space to organize, assess, and evidence your sustainability posture. Get coverage indicators by ESG pillar, readiness snapshots with timestamps, and exportable views for regulators, buyers, and auditors.'),
      icon: <FolderOpen className="h-8 w-8 text-secondary" />,
      available: true,
      link: '/evidence-workspace',
    },
    {
      title: t('Impact Scan'),
      description: t('Understand your current ESG posture through comprehensive assessment. Foundation for exposure analysis and evidence requirements.'),
      icon: <Shield className="h-8 w-8 text-success" />,
      available: true,
      link: '/impact-scan',
    },
    {
      title: t('Regulatory Intelligence Modules'),
      description: t('Modular intelligence for EUDR, Child Labor & Social Compliance, Supply-Chain Transparency, and Climate & Environmental Disclosure. Activate only what you need.'),
      icon: <Sparkles className="h-8 w-8 text-accent" />,
      available: true,
      link: '/modules',
    },
  ];

  const benefits = [
    t('Know your exposure before regulators, buyers, or financiers ask'),
    t('Identify regulatory pressure intensity by region and sector'),
    t('Track evidence readiness for compliance requirements'),
    t('See what exists, what\'s missing, and where pressure will hit next'),
    t('Export evidence views for regulators, buyers, and auditors'),
    t('Focus on facts and signals, not narratives or promises'),
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-12 md:py-20 lg:py-24">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col justify-center">
                <div className="mb-4">
                  <p className="text-sm font-semibold text-primary uppercase tracking-wide">
                    {t('ESG Risk Intelligence')}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {t('by ERMITS')}
                  </p>
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
                  <span className="block">{t('Know where your impact')}</span>
                  <span className="block text-primary">{t('exposure is')}</span>
                  <span className="block">{t('— before they ask')}</span>
                </h1>
                <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
                  {t('ImpactSoluce transforms environmental, social, and governance obligations into decision-grade intelligence. Not reports. Not promises. Evidence-based exposure signals.')}
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link to="/risk-radar" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto"
                      aria-label={t('See Your Exposure')}
                    >
                      {t('See Your Exposure')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/impact-scan" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto"
                      aria-label={t('Check Your Readiness')}
                    >
                      {t('Check Your Readiness')}
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
                      <div className="h-2 rounded-full bg-secondary w-[73%]"></div>
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
              {t('Sustainability & ESG Risk Intelligence')}
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('ImpactSoluce transforms ESG obligations into decision-grade intelligence. Know where your impact exposure is — before regulators, buyers, or financiers ask.')}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, idx) => (
              <Card key={idx} className={`overflow-hidden border-0 relative ${!feature.available ? 'opacity-90' : ''}`}>
                {!feature.available && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="bg-primary text-white text-xs px-2 py-1 rounded-full font-medium">
                      {t('Coming Soon')}
                    </span>
                  </div>
                )}
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
                  {feature.available && feature.link && (
                    <div className="mt-4">
                      <Link to={feature.link}>
                        <Button variant="outline" size="sm" className="w-full">
                          {t('Learn More')}
                          <ArrowRight className="ml-2 h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-4">
              {t('Built for Real-World Pressure')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('ImpactSoluce is used by organizations that need to prove readiness, not talk about ambition. If your credibility is reviewed externally, ImpactSoluce applies.')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: t('Exporters & Manufacturers'), icon: '🏭', description: t('Prove compliance readiness for international markets and buyer requirements') },
              { title: t('Agricultural Cooperatives'), icon: '🌾', description: t('Demonstrate traceability and sustainability credentials to buyers and regulators') },
              { title: t('Sourcing & Procurement Teams'), icon: '📦', description: t('Assess supplier exposure and evidence readiness across supply chains') },
              { title: t('Financial Institutions'), icon: '🏦', description: t('Evaluate portfolio ESG risk and regulatory exposure for lending decisions') },
              { title: t('Advisory & Assurance Firms'), icon: '📋', description: t('Support clients with evidence-based exposure analysis and readiness assessment') },
              { title: t('Compliance Officers'), icon: '🛡️', description: t('Identify regulatory pressure points and evidence gaps before audits') }
            ].map((audience, idx) => (
              <Card key={idx} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{audience.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {audience.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {audience.description}
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
                {t('Why ImpactSoluce?')}
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                {t('Get decision-grade intelligence on your ESG exposure. Know what exists, what\'s missing, and where pressure will hit next.')}
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
                <Link to="/risk-radar">
                  <Button className="inline-flex items-center">
                    {t('Start Risk Analysis')}
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
                      {t('ImpactSoluce™ showed us exactly where regulatory pressure would hit — before our buyers asked.')}
                    </p>
                    <p className="text-white/80">
                      {t('— Procurement Director, Agricultural Cooperative')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-800 dark:bg-primary-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-primary-700 dark:bg-primary-800 px-6 py-16 sm:p-16">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {t('Ready to know your exposure?')}
              </h2>
              <p className="mt-4 text-lg text-primary-100 dark:text-primary-200">
                {t('Join organizations using ImpactSoluce™ to identify where regulatory pressure will hit and prove evidence readiness — before regulators, buyers, or financiers ask.')}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/risk-radar">
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-gray-100 w-full sm:w-auto"
                  >
                    {t('See Your Exposure')}
                  </Button>
                </Link>
                <Link to="/impact-scan">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-white text-white hover:bg-white/10 w-full sm:w-auto"
                  >
                    {t('Start Impact Scan')}
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