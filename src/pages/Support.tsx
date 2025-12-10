import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/layout/Layout';
import { Card, CardContent } from '../components/ui/Card';
import { 
  MessageCircle, 
  Book, 
  Video,
  Search,
  ChevronDown,
  ChevronRight,
  Download,
  Mail,
  Phone
} from 'lucide-react';
import Button from '../components/ui/Button';

export default function Support() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const supportOptions = [
    {
      title: t('Knowledge Base'),
      description: t('Browse our comprehensive documentation and guides'),
      icon: Book,
      action: t('Browse Articles'),
      href: '#knowledge-base'
    },
    {
      title: t('Video Tutorials'),
      description: t('Watch step-by-step video guides for common tasks'),
      icon: Video,
      action: t('Watch Videos'),
      href: '#tutorials'
    },
    {
      title: t('Live Chat'),
      description: t('Get instant help from our support team'),
      icon: MessageCircle,
      action: t('Start Chat'),
      href: '#chat'
    },
    {
      title: t('Contact Support'),
      description: t('Submit a ticket for personalized assistance'),
      icon: Mail,
      action: t('Contact Us'),
      href: '/contact'
    }
  ];

  const faqs = [
    {
      question: t('How do I get started with ImpactSoluce?'),
      answer: t('Getting started is easy! Configure your Risk Radar to see your exposure, or start an Impact Scan assessment. Our platform guides you through each step with clear instructions and documentation.')
    },
    {
      question: t('Which ESG frameworks does the platform support?'),
      answer: t('ImpactSoluce supports major frameworks including GRI Standards, SASB, TCFD, CSRD, ISSB, and ISO standards. Our Impact Scan assessment aligns with these frameworks to help you understand your current posture.')
    },
    {
      question: t('Can I import data from other systems?'),
      answer: t('Yes, our platform supports data import from Excel, CSV files, and direct API integrations with popular business systems like SAP, Salesforce, and Microsoft 365.')
    },
    {
      question: t('How secure is my ESG data?'),
      answer: t('We use enterprise-grade security including AES-256 encryption, SOC 2 compliance, regular security audits, and strict access controls. Your data is stored in secure, geographically distributed data centers.')
    },
    {
      question: t('What support is included with my subscription?'),
      answer: t('All plans include email support and access to our knowledge base. Professional and Enterprise plans include priority support, phone support, and dedicated account management.')
    },
    {
      question: t('Can I customize reports and dashboards?'),
      answer: t('Absolutely! Our platform offers extensive customization options for reports and dashboards. You can create custom templates, add your branding, and configure metrics to match your specific needs.')
    }
  ];

  const resources = [
    {
      title: t('Getting Started Guide'),
      description: t('Complete guide to setting up your ESG assessment'),
      type: 'PDF',
      size: '2.5 MB'
    },
    {
      title: t('API Documentation'),
      description: t('Technical documentation for developers'),
      type: 'Web',
      size: 'Online'
    },
    {
      title: t('Best Practices Handbook'),
      description: t('ESG best practices and industry insights'),
      type: 'PDF',
      size: '4.1 MB'
    },
    {
      title: t('Video Tutorial Series'),
      description: t('Complete video course on using ImpactSoluce'),
      type: 'Video',
      size: '2.5 hours'
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t('How Can We Help?')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {t('Find answers, get support, and learn how to make the most of ImpactSoluce.')}
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('Search for help...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportOptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <IconComponent className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {option.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {option.description}
                    </p>
                    <Button variant="outline" className="w-full">
                      {option.action}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {t('Frequently Asked Questions')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t('Quick answers to common questions about ImpactSoluce.')}
              </p>
            </div>
            
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-0">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                        {faq.question}
                      </h3>
                      {expandedFaq === index ? (
                        <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      )}
                    </button>
                    {expandedFaq === index && (
                      <div className="px-6 pb-6">
                        <p className="text-gray-600 dark:text-gray-300">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredFaqs.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  {t('No FAQs found matching your search.')}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {t('Helpful Resources')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t('Download guides, watch tutorials, and access documentation.')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.map((resource, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {resource.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                          {resource.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>{resource.type}</span>
                          <span>•</span>
                          <span>{resource.size}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" icon={<Download className="h-4 w-4" />}>
                        {t('Download')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                {t('Still Need Help?')}
              </h2>
              <p className="text-xl text-primary-100">
                {t('Our support team is here to help you succeed with ImpactSoluce.')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-white/10 rounded-full">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {t('Email Support')}
                </h3>
                <p className="text-primary-100 mb-4">
                  support@impactsoluce.com
                </p>
                <p className="text-sm text-primary-200">
                  {t('Response within 24 hours')}
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-white/10 rounded-full">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {t('Phone Support')}
                </h3>
                <p className="text-primary-100 mb-4">
                  +1 (555) IMPACT-1
                </p>
                <p className="text-sm text-primary-200">
                  {t('Mon-Fri, 9 AM - 6 PM EST')}
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-white/10 rounded-full">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {t('Live Chat')}
                </h3>
                <p className="text-primary-100 mb-4">
                  {t('Available in platform')}
                </p>
                <p className="text-sm text-primary-200">
                  {t('Instant responses')}
                </p>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Button className="bg-white text-primary hover:bg-gray-100">
                {t('Contact Support Team')}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}