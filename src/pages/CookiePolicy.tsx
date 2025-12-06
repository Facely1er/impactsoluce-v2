import React from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Cookie, Settings, Eye, Shield, BarChart3, Users } from 'lucide-react';
import Button from '../components/ui/Button';

export default function CookiePolicy() {
  const { t } = useTranslation();

  const cookieTypes = [
    {
      id: 'essential',
      title: t('Essential Cookies'),
      icon: Shield,
      description: t('These cookies are necessary for the website to function and cannot be switched off in our systems.'),
      examples: [
        t('Authentication cookies'),
        t('Security cookies'),
        t('Session management'),
        t('Load balancing'),
      ],
      retention: t('Session or up to 1 year'),
      canDisable: false,
    },
    {
      id: 'functional',
      title: t('Functional Cookies'),
      icon: Settings,
      description: t('These cookies enable the website to provide enhanced functionality and personalization.'),
      examples: [
        t('Language preferences'),
        t('Theme settings'),
        t('User interface preferences'),
        t('Accessibility settings'),
      ],
      retention: t('Up to 2 years'),
      canDisable: true,
    },
    {
      id: 'analytics',
      title: t('Analytics Cookies'),
      icon: BarChart3,
      description: t('These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.'),
      examples: [
        t('Google Analytics'),
        t('Page view tracking'),
        t('User behavior analysis'),
        t('Performance monitoring'),
      ],
      retention: t('Up to 2 years'),
      canDisable: true,
    },
    {
      id: 'marketing',
      title: t('Marketing Cookies'),
      icon: Users,
      description: t('These cookies may be set through our site by our advertising partners to build a profile of your interests.'),
      examples: [
        t('Advertising targeting'),
        t('Social media integration'),
        t('Cross-site tracking'),
        t('Conversion tracking'),
      ],
      retention: t('Up to 2 years'),
      canDisable: true,
    },
  ];

  const thirdPartyServices = [
    {
      name: 'Google Analytics',
      purpose: t('Website analytics and performance monitoring'),
      dataCollected: t('Page views, user interactions, device information'),
      retention: t('26 months'),
      privacyPolicy: 'https://policies.google.com/privacy',
    },
    {
      name: 'Supabase',
      purpose: t('Database and authentication services'),
      dataCollected: t('User account information, application data'),
      retention: t('As long as account is active'),
      privacyPolicy: 'https://supabase.com/privacy',
    },
    {
      name: 'Vercel',
      purpose: t('Website hosting and performance optimization'),
      dataCollected: t('Request logs, performance metrics'),
      retention: t('30 days'),
      privacyPolicy: 'https://vercel.com/legal/privacy-policy',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-primary/10 rounded-full">
                <Cookie className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t('Cookie Policy')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
              {t('Learn about how we use cookies and similar technologies to improve your experience on our website.')}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {t('Last updated: March 15, 2024')}
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="mb-8">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('What Are Cookies?')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {t('Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners.')}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {t('ESGSoluce uses cookies to enhance your browsing experience, analyze site traffic, and personalize content. This policy explains what cookies we use, why we use them, and how you can manage your cookie preferences.')}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('By continuing to use our website, you consent to our use of cookies as described in this policy.')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Cookie Types */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {t('Types of Cookies We Use')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t('We use different types of cookies for various purposes to enhance your experience.')}
              </p>
            </div>
            
            <div className="space-y-6">
              {cookieTypes.map((cookieType) => {
                const IconComponent = cookieType.icon;
                return (
                  <Card key={cookieType.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        {cookieType.title}
                        {!cookieType.canDisable && (
                          <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full dark:bg-red-900/30 dark:text-red-300">
                            {t('Required')}
                          </span>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {cookieType.description}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            {t('Examples')}:
                          </h4>
                          <ul className="space-y-1">
                            {cookieType.examples.map((example, index) => (
                              <li key={index} className="text-sm text-gray-600 dark:text-gray-300">
                                • {example}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <div className="mb-3">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                              {t('Retention Period')}:
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {cookieType.retention}
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                              {t('Can be disabled')}:
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {cookieType.canDisable ? t('Yes') : t('No')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Third Party Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {t('Third-Party Services')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t('We use third-party services that may also set cookies on your device.')}
              </p>
            </div>
            
            <div className="space-y-6">
              {thirdPartyServices.map((service, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {service.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                          <strong>{t('Purpose')}:</strong> {service.purpose}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                          <strong>{t('Data Collected')}:</strong> {service.dataCollected}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          <strong>{t('Retention')}:</strong> {service.retention}
                        </p>
                      </div>
                      <div className="mt-4 md:mt-0 md:ml-6">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(service.privacyPolicy, '_blank')}
                          icon={<Eye className="h-4 w-4" />}
                        >
                          {t('Privacy Policy')}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cookie Management */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Settings className="h-6 w-6 text-primary" />
                  </div>
                  {t('Managing Your Cookie Preferences')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      {t('Browser Settings')}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {t('You can control and manage cookies in your browser settings. Most browsers allow you to:')}
                    </p>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li>• {t('View what cookies are stored on your device')}</li>
                      <li>• {t('Delete cookies individually or all at once')}</li>
                      <li>• {t('Block cookies from specific websites')}</li>
                      <li>• {t('Block all cookies from being set')}</li>
                      <li>• {t('Delete all cookies when you close your browser')}</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      {t('Cookie Consent Management')}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {t('When you first visit our website, you\'ll see a cookie consent banner where you can:')}
                    </p>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300 mb-4">
                      <li>• {t('Accept all cookies')}</li>
                      <li>• {t('Reject non-essential cookies')}</li>
                      <li>• {t('Customize your preferences by cookie type')}</li>
                    </ul>
                    <Button className="bg-primary">
                      {t('Manage Cookie Preferences')}
                    </Button>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      {t('Impact of Disabling Cookies')}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {t('Please note that disabling certain cookies may impact your experience on our website. Essential cookies cannot be disabled as they are necessary for the website to function properly.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>{t('Questions About Our Cookie Policy?')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {t('If you have any questions about our use of cookies or this Cookie Policy, please contact us:')}
                </p>
                <div className="space-y-2 text-gray-600 dark:text-gray-300 mb-6">
                  <p><strong>{t('Email')}:</strong> privacy@esgsoluce.com</p>
                  <p><strong>{t('Address')}:</strong> {t('123 Sustainability Street, Green City, GC 12345')}</p>
                  <p><strong>{t('Phone')}:</strong> +1 (555) 123-4567</p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>{t('Policy Updates')}:</strong> {t('We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}