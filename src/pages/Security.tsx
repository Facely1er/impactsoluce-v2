import React from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { 
  Shield, 
  Lock, 
  Eye, 
  Server, 
  Users, 
  AlertTriangle,
  CheckCircle2,
  FileCheck,
  Globe,
  Zap,
  Database,
  Key
} from 'lucide-react';
import Button from '../components/ui/Button';

export default function Security() {
  const { t } = useTranslation();

  const securityFeatures = [
    {
      id: 'encryption',
      title: t('Data Encryption'),
      icon: Lock,
      description: t('All data is encrypted in transit and at rest using industry-standard AES-256 encryption.'),
      details: [
        t('TLS 1.3 for data in transit'),
        t('AES-256 encryption for data at rest'),
        t('End-to-end encryption for sensitive data'),
        t('Regular encryption key rotation'),
      ],
    },
    {
      id: 'access-control',
      title: t('Access Control'),
      icon: Key,
      description: t('Multi-layered access controls ensure only authorized users can access your data.'),
      details: [
        t('Multi-factor authentication (MFA)'),
        t('Role-based access control (RBAC)'),
        t('Single sign-on (SSO) integration'),
        t('Regular access reviews and audits'),
      ],
    },
    {
      id: 'infrastructure',
      title: t('Secure Infrastructure'),
      icon: Server,
      description: t('Our infrastructure is built on secure, enterprise-grade cloud platforms.'),
      details: [
        t('SOC 2 Type II compliant data centers'),
        t('24/7 security monitoring'),
        t('Automated threat detection'),
        t('Regular security assessments'),
      ],
    },
    {
      id: 'compliance',
      title: t('Compliance & Certifications'),
      icon: FileCheck,
      description: t('We maintain compliance with international security standards and regulations.'),
      details: [
        t('SOC 2 Type II certification'),
        t('GDPR compliance'),
        t('ISO 27001 aligned practices'),
        t('Regular third-party audits'),
      ],
    },
    {
      id: 'monitoring',
      title: t('Security Monitoring'),
      icon: Eye,
      description: t('Continuous monitoring and threat detection to protect your data.'),
      details: [
        t('Real-time security monitoring'),
        t('Automated threat detection'),
        t('Incident response procedures'),
        t('Security event logging'),
      ],
    },
    {
      id: 'backup',
      title: t('Data Backup & Recovery'),
      icon: Database,
      description: t('Comprehensive backup and disaster recovery procedures ensure data availability.'),
      details: [
        t('Automated daily backups'),
        t('Geographic backup distribution'),
        t('Point-in-time recovery'),
        t('Disaster recovery testing'),
      ],
    },
  ];

  const complianceStandards = [
    {
      name: 'SOC 2 Type II',
      description: t('System and Organization Controls for security, availability, and confidentiality'),
      status: 'certified',
      icon: Shield,
    },
    {
      name: 'GDPR',
      description: t('General Data Protection Regulation compliance for EU data protection'),
      status: 'compliant',
      icon: Globe,
    },
    {
      name: 'ISO 27001',
      description: t('Information security management system best practices'),
      status: 'aligned',
      icon: FileCheck,
    },
    {
      name: 'CCPA',
      description: t('California Consumer Privacy Act compliance'),
      status: 'compliant',
      icon: Users,
    },
  ];

  const securityPractices = [
    {
      category: t('Development Security'),
      practices: [
        t('Secure coding practices and code reviews'),
        t('Automated security testing in CI/CD pipeline'),
        t('Dependency vulnerability scanning'),
        t('Regular security training for developers'),
      ],
    },
    {
      category: t('Operational Security'),
      practices: [
        t('Principle of least privilege access'),
        t('Regular security assessments and penetration testing'),
        t('Incident response and business continuity planning'),
        t('Employee security awareness training'),
      ],
    },
    {
      category: t('Data Protection'),
      practices: [
        t('Data classification and handling procedures'),
        t('Privacy by design principles'),
        t('Data retention and deletion policies'),
        t('Regular privacy impact assessments'),
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'certified':
        return 'text-green-600 dark:text-green-400';
      case 'compliant':
        return 'text-blue-600 dark:text-blue-400';
      case 'aligned':
        return 'text-purple-600 dark:text-purple-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'certified':
      case 'compliant':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'aligned':
        return <CheckCircle2 className="h-5 w-5 text-purple-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

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
              {t('Security & Trust')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {t('Your data security and privacy are our top priorities. Learn about our comprehensive security measures and compliance standards.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-primary">
                {t('View Security Documentation')}
              </Button>
              <Button variant="outline">
                {t('Contact Security Team')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('Enterprise-Grade Security')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('We implement multiple layers of security controls to protect your sensitive ESG data and ensure platform reliability.')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityFeatures.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <Card key={feature.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {feature.description}
                    </p>
                    <ul className="space-y-2">
                      {feature.details.map((detail, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Compliance Standards */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('Compliance & Certifications')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t('We maintain compliance with international security and privacy standards.')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {complianceStandards.map((standard, index) => {
              const IconComponent = standard.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {standard.name}
                          </h3>
                          {getStatusIcon(standard.status)}
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">
                          {standard.description}
                        </p>
                        <span className={`text-sm font-medium ${getStatusColor(standard.status)}`}>
                          {t(standard.status.charAt(0).toUpperCase() + standard.status.slice(1))}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Practices */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('Security Best Practices')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t('Our comprehensive security program covers all aspects of data protection and system security.')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {securityPractices.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.practices.map((practice, practiceIndex) => (
                      <li key={practiceIndex} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{practice}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Incident Response */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  {t('Incident Response & Business Continuity')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      {t('Incident Response')}
                    </h4>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li>• {t('24/7 security monitoring and alerting')}</li>
                      <li>• {t('Dedicated incident response team')}</li>
                      <li>• {t('Defined escalation procedures')}</li>
                      <li>• {t('Regular incident response drills')}</li>
                      <li>• {t('Post-incident analysis and improvements')}</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      {t('Business Continuity')}
                    </h4>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li>• {t('99.9% uptime SLA')}</li>
                      <li>• {t('Redundant infrastructure across multiple regions')}</li>
                      <li>• {t('Automated failover capabilities')}</li>
                      <li>• {t('Regular disaster recovery testing')}</li>
                      <li>• {t('Comprehensive backup and recovery procedures')}</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>{t('Security Incident Reporting')}:</strong> {t('If you discover a security vulnerability or incident, please report it immediately to security@esgsoluce.com. We take all security reports seriously and will respond within 24 hours.')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Transparency */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {t('Transparency & Trust')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t('We believe in transparency about our security practices and are committed to earning and maintaining your trust.')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {t('Security Documentation')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {t('Access detailed security documentation, compliance reports, and audit results.')}
                  </p>
                  <Button variant="outline" className="w-full">
                    {t('Request Security Documentation')}
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {t('Security Questionnaires')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {t('We\'re happy to complete security questionnaires and provide additional security information.')}
                  </p>
                  <Button variant="outline" className="w-full">
                    {t('Submit Security Questionnaire')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Security Team */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {t('Questions About Security?')}
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              {t('Our security team is here to address any questions or concerns about data protection and platform security.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-primary hover:bg-gray-100">
                {t('Contact Security Team')}
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-primary-800">
                {t('Report Security Issue')}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}