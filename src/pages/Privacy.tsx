import React from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Shield, Eye, Lock, Users, FileText, Mail } from 'lucide-react';

export default function Privacy() {
  const { t } = useTranslation();

  const sections = [
    {
      id: 'information-collection',
      title: t('Information We Collect'),
      icon: FileText,
      content: [
        {
          subtitle: t('Personal Information'),
          text: t('We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support. This may include your name, email address, company information, and other contact details.')
        },
        {
          subtitle: t('Usage Information'),
          text: t('We automatically collect information about how you use our platform, including your interactions with features, pages visited, and time spent on our service.')
        },
        {
          subtitle: t('ESG Data'),
          text: t('We collect and process ESG-related data that you input into our platform for assessment and reporting purposes. This data is essential for providing our services.')
        }
      ]
    },
    {
      id: 'information-use',
      title: t('How We Use Your Information'),
      icon: Users,
      content: [
        {
          subtitle: t('Service Provision'),
          text: t('We use your information to provide, maintain, and improve our ESG platform services, including assessments, reporting, and analytics.')
        },
        {
          subtitle: t('Communication'),
          text: t('We may use your contact information to send you service-related communications, updates, and support responses.')
        },
        {
          subtitle: t('Analytics and Improvement'),
          text: t('We analyze usage patterns to improve our platform functionality and user experience while maintaining data privacy.')
        }
      ]
    },
    {
      id: 'data-protection',
      title: t('Data Protection and Security'),
      icon: Shield,
      content: [
        {
          subtitle: t('Encryption'),
          text: t('All data is encrypted in transit and at rest using industry-standard encryption protocols to protect your information.')
        },
        {
          subtitle: t('Access Controls'),
          text: t('We implement strict access controls and authentication measures to ensure only authorized personnel can access your data.')
        },
        {
          subtitle: t('Regular Audits'),
          text: t('Our security practices are regularly audited and updated to maintain the highest standards of data protection.')
        }
      ]
    },
    {
      id: 'data-sharing',
      title: t('Information Sharing'),
      icon: Eye,
      content: [
        {
          subtitle: t('No Sale of Data'),
          text: t('We do not sell, rent, or trade your personal information to third parties for marketing purposes.')
        },
        {
          subtitle: t('Service Providers'),
          text: t('We may share information with trusted service providers who assist us in operating our platform, subject to strict confidentiality agreements.')
        },
        {
          subtitle: t('Legal Requirements'),
          text: t('We may disclose information when required by law or to protect our rights, safety, or the rights and safety of others.')
        }
      ]
    },
    {
      id: 'your-rights',
      title: t('Your Rights and Choices'),
      icon: Lock,
      content: [
        {
          subtitle: t('Access and Correction'),
          text: t('You have the right to access, update, or correct your personal information at any time through your account settings.')
        },
        {
          subtitle: t('Data Portability'),
          text: t('You can request a copy of your data in a portable format or request that we transfer your data to another service.')
        },
        {
          subtitle: t('Deletion'),
          text: t('You may request deletion of your personal information, subject to certain legal and operational requirements.')
        }
      ]
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-primary/10 rounded-full">
                <Shield className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t('Privacy Policy')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
              {t('Your privacy is important to us. This policy explains how we collect, use, and protect your information.')}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {t('Last updated: March 15, 2024')}
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <Card className="mb-8">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('Introduction')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {t('ESGSoluce ("we," "our," or "us") is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our ESG platform and services.')}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('By using our services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.')}
                </p>
              </CardContent>
            </Card>

            {/* Privacy Sections */}
            <div className="space-y-8">
              {sections.map((section) => {
                const IconComponent = section.icon;
                return (
                  <Card key={section.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {section.content.map((item, index) => (
                          <div key={index}>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              {item.subtitle}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-300">
                              {item.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Contact Information */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  {t('Contact Us About Privacy')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {t('If you have any questions about this Privacy Policy or our data practices, please contact us:')}
                </p>
                <div className="space-y-2 text-gray-600 dark:text-gray-300">
                  <p><strong>{t('Email')}:</strong> privacy@esgsoluce.com</p>
                  <p><strong>{t('Address')}:</strong> {t('123 Sustainability Street, Green City, GC 12345')}</p>
                  <p><strong>{t('Phone')}:</strong> +1 (555) 123-4567</p>
                </div>
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>{t('Data Protection Officer')}:</strong> {t('For EU residents, you can contact our Data Protection Officer at dpo@esgsoluce.com for any privacy-related inquiries or to exercise your rights under GDPR.')}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Updates Notice */}
            <Card className="mt-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {t('Policy Updates')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}