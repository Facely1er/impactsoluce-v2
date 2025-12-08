import React from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Shield, AlertTriangle, FileCheck, Users, Ban, Gavel } from 'lucide-react';

export default function AcceptableUsePolicy() {
  const { t } = useTranslation();

  const sections = [
    {
      id: 'introduction',
      title: t('Introduction'),
      icon: FileCheck,
      content: t('This Acceptable Use Policy ("Policy") sets forth the terms and conditions for your use of ImpactSoluce™ by ERMITS services. By accessing or using our services, you agree to comply with this Policy. Violation of this Policy may result in suspension or termination of your account.'),
    },
    {
      id: 'prohibited-activities',
      title: t('Prohibited Activities'),
      icon: Ban,
      content: t('You agree not to use our services to: (1) violate any applicable laws or regulations; (2) infringe upon the rights of others; (3) transmit harmful, offensive, or illegal content; (4) attempt to gain unauthorized access to our systems; (5) interfere with or disrupt the services; (6) use automated systems to access the services without permission; (7) impersonate others or provide false information; (8) engage in any activity that could harm our reputation or business.'),
    },
    {
      id: 'data-usage',
      title: t('Data and Content Usage'),
      icon: Shield,
      content: t('You are responsible for all data and content you submit through our services. You must ensure that: (1) you have the right to submit such data; (2) the data is accurate and not misleading; (3) the data does not contain malicious code or viruses; (4) the data complies with all applicable privacy and data protection laws; (5) you do not submit confidential information of third parties without authorization.'),
    },
    {
      id: 'account-security',
      title: t('Account Security'),
      icon: Shield,
      content: t('You are responsible for maintaining the security of your account credentials. You must: (1) use strong, unique passwords; (2) not share your account credentials with others; (3) immediately notify us of any unauthorized access; (4) not use accounts belonging to others; (5) comply with all security requirements we may establish.'),
    },
    {
      id: 'intellectual-property',
      title: t('Intellectual Property'),
      icon: FileCheck,
      content: t('You may not copy, modify, distribute, sell, or lease any part of our services or included software. You may not reverse engineer or attempt to extract the source code of our software. All content, features, and functionality of our services are owned by ERMITS and are protected by international copyright, trademark, and other intellectual property laws.'),
    },
    {
      id: 'monitoring-enforcement',
      title: t('Monitoring and Enforcement'),
      icon: AlertTriangle,
      content: t('We reserve the right to monitor your use of our services to ensure compliance with this Policy. We may investigate violations and take appropriate action, including but not limited to: (1) warning you; (2) suspending your account; (3) terminating your account; (4) reporting violations to law enforcement; (5) pursuing legal remedies. We are not obligated to monitor but may do so at our discretion.'),
    },
    {
      id: 'consequences',
      title: t('Consequences of Violation'),
      icon: Gavel,
      content: t('Violation of this Policy may result in immediate suspension or termination of your account without notice or refund. We may also pursue legal action for damages or other remedies available under law. You may be held liable for any damages caused by your violation, including costs and attorney fees.'),
    },
    {
      id: 'reporting-violations',
      title: t('Reporting Violations'),
      icon: Users,
      content: t('If you become aware of any violation of this Policy, please report it to us immediately at abuse@impactsoluce.com. Include as much detail as possible, including the nature of the violation, the account or content involved, and any supporting evidence. We will investigate all reports promptly and take appropriate action.'),
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
                <Shield className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t('Acceptable Use Policy')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
              {t('Guidelines for the appropriate use of ImpactSoluce™ by ERMITS services.')}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {t('Last updated: March 15, 2024')}
            </p>
          </div>
        </div>
      </section>

      {/* Policy Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
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
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {section.content}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>{t('Questions About This Policy?')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {t('If you have any questions about this Acceptable Use Policy, please contact us:')}
                </p>
                <div className="space-y-2 text-gray-600 dark:text-gray-300 mb-6">
                  <p><strong>{t('Email')}:</strong> abuse@impactsoluce.com</p>
                  <p><strong>{t('Address')}:</strong> {t('123 Sustainability Street, Green City, GC 12345')}</p>
                  <p><strong>{t('Phone')}:</strong> +1 (555) 123-4567</p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>{t('Policy Updates')}:</strong> {t('We may update this Acceptable Use Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. Continued use of our services after changes constitutes acceptance of the updated policy.')}
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

