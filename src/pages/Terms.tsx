import React from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { FileCheck, Scale, Shield, AlertTriangle, Users, Gavel } from 'lucide-react';

export default function Terms() {
  const { t } = useTranslation();

  const sections = [
    {
      id: 'acceptance',
      title: t('Acceptance of Terms'),
      icon: FileCheck,
      content: t('By accessing and using ESGSoluce services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.')
    },
    {
      id: 'service-description',
      title: t('Service Description'),
      icon: Shield,
      content: t('ESGSoluce provides a comprehensive ESG (Environmental, Social, and Governance) platform that helps organizations measure, manage, and improve their sustainability performance. Our services include assessments, reporting tools, analytics, and compliance management features.')
    },
    {
      id: 'user-responsibilities',
      title: t('User Responsibilities'),
      icon: Users,
      content: t('Users are responsible for maintaining the confidentiality of their account information, providing accurate data, complying with applicable laws and regulations, and using the service in accordance with these terms and our acceptable use policy.')
    },
    {
      id: 'data-accuracy',
      title: t('Data Accuracy and Compliance'),
      icon: Scale,
      content: t('While we provide tools and frameworks to support ESG reporting, users are responsible for the accuracy of their data and compliance with applicable regulations. ESGSoluce does not guarantee compliance with specific regulatory requirements.')
    },
    {
      id: 'limitations',
      title: t('Limitations of Liability'),
      icon: AlertTriangle,
      content: t('ESGSoluce shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses resulting from your use of the service.')
    },
    {
      id: 'termination',
      title: t('Termination'),
      icon: Gavel,
      content: t('We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.')
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
                <FileCheck className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t('Terms of Service')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
              {t('Please read these terms carefully before using our ESG platform and services.')}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {t('Last updated: March 15, 2024')}
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
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
                  {t('These Terms of Service ("Terms") govern your use of ImpactSoluce™ by ERMITS platform and services. These Terms apply to all visitors, users, and others who access or use our service.')}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the service.')}
                </p>
              </CardContent>
            </Card>

            {/* Terms Sections */}
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
                      <p className="text-gray-600 dark:text-gray-300">
                        {section.content}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Detailed Terms */}
            <div className="space-y-8 mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>{t('Intellectual Property Rights')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-gray-600 dark:text-gray-300">
                    <p>
                      {t('The service and its original content, features, and functionality are and will remain the exclusive property of ERMITS (ImpactSoluce™) and its licensors. The service is protected by copyright, trademark, and other laws.')}
                    </p>
                    <p>
                      {t('Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.')}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('User Content and Data')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-gray-600 dark:text-gray-300">
                    <p>
                      {t('You retain ownership of any intellectual property rights that you hold in content that you submit to our service. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and distribute your content solely for the purpose of providing our services.')}
                    </p>
                    <p>
                      {t('You are responsible for the content you submit and warrant that you have the right to submit such content and that it does not violate any third-party rights or applicable laws.')}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('Privacy and Data Protection')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-gray-600 dark:text-gray-300">
                    <p>
                      {t('Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices.')}
                    </p>
                    <p>
                      {t('We implement appropriate security measures to protect your personal information and ESG data in accordance with industry standards and applicable regulations.')}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('Service Availability and Modifications')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-gray-600 dark:text-gray-300">
                    <p>
                      {t('We strive to maintain high service availability but cannot guarantee uninterrupted access. We may modify, suspend, or discontinue any part of our service at any time with reasonable notice.')}
                    </p>
                    <p>
                      {t('We reserve the right to modify these Terms at any time. We will notify users of any material changes via email or through our platform.')}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('Governing Law and Dispute Resolution')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-gray-600 dark:text-gray-300">
                    <p>
                      {t('These Terms shall be interpreted and governed by the laws of the jurisdiction in which ERMITS (ImpactSoluce™) is incorporated, without regard to its conflict of law provisions.')}
                    </p>
                    <p>
                      {t('Any disputes arising from these Terms or your use of our service will be resolved through binding arbitration in accordance with the rules of the applicable arbitration association.')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>{t('Contact Information')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {t('If you have any questions about these Terms of Service, please contact us:')}
                </p>
                <div className="space-y-2 text-gray-600 dark:text-gray-300">
                  <p><strong>{t('Email')}:</strong> legal@impactsoluce.com</p>
                  <p><strong>{t('Address')}:</strong> {t('123 Sustainability Street, Green City, GC 12345')}</p>
                  <p><strong>{t('Phone')}:</strong> +1 (555) 123-4567</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}