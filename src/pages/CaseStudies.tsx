import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { 
  TrendingUp, 
  Building, 
  Globe,
  ArrowRight,
  Download,
  Target,
  Award,
  Leaf
} from 'lucide-react';
import Button from '../components/ui/Button';

export default function CaseStudies() {
  const { t } = useTranslation();
  const [selectedIndustry, setSelectedIndustry] = useState('all');

  const industries = [
    { id: 'all', name: t('All Industries') },
    { id: 'technology', name: t('Technology') },
    { id: 'manufacturing', name: t('Manufacturing') },
    { id: 'financial', name: t('Financial Services') },
    { id: 'healthcare', name: t('Healthcare') },
  ];

  const caseStudies = [
    {
      id: 1,
      title: t('TechCorp Achieves 40% Carbon Reduction'),
      company: 'TechCorp Global',
      industry: 'technology',
      size: t('5,000+ employees'),
      challenge: t('High energy consumption from data centers and lack of comprehensive ESG reporting framework.'),
      solution: t('Implemented ImpactSoluce platform for ESG exposure analysis, risk radar configuration, and evidence readiness tracking.'),
      results: [
        { metric: t('Carbon Reduction'), value: '40%', icon: Leaf },
        { metric: t('ESG Score Improvement'), value: '+35 points', icon: TrendingUp },
        { metric: t('Reporting Efficiency'), value: '75%', icon: Target },
        { metric: t('Cost Savings'), value: '$2.3M', icon: Award }
      ],
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
      testimonial: {
        quote: t('ImpactSoluce showed us exactly where regulatory pressure would hit. The Risk Radar identified our exposure signals before our buyers asked, giving us time to prepare evidence.'),
        author: 'Sarah Johnson',
        role: t('Chief Sustainability Officer')
      },
      featured: true
    },
    {
      id: 2,
      title: t('Manufacturing Giant Streamlines ESG Reporting'),
      company: 'Industrial Solutions Inc.',
      industry: 'manufacturing',
      size: t('10,000+ employees'),
      challenge: t('Complex supply chain ESG tracking and compliance with multiple international standards.'),
      solution: t('Deployed comprehensive ESG management system with supplier integration and multi-framework reporting.'),
      results: [
        { metric: t('Reporting Time Reduction'), value: '60%', icon: Target },
        { metric: t('Supplier ESG Compliance'), value: '95%', icon: Award },
        { metric: t('Framework Alignment'), value: '8 standards', icon: TrendingUp },
        { metric: t('Audit Efficiency'), value: '50%', icon: Leaf }
      ],
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
      testimonial: {
        quote: t('The platform\'s multi-framework approach saved us countless hours and ensured we met all regulatory requirements across different markets.'),
        author: 'Michael Chen',
        role: t('VP of Operations')
      },
      featured: false
    },
    {
      id: 3,
      title: t('Financial Services Leader Enhances ESG Transparency'),
      company: 'Global Finance Partners',
      industry: 'financial',
      size: t('2,500+ employees'),
      challenge: t('Investor demands for detailed ESG disclosure and risk assessment integration.'),
      solution: t('Integrated ESG risk assessment with investment decision-making and stakeholder reporting.'),
      results: [
        { metric: t('ESG Rating Improvement'), value: 'AA+', icon: Award },
        { metric: t('Investor Satisfaction'), value: '92%', icon: TrendingUp },
        { metric: t('Risk Assessment Coverage'), value: '100%', icon: Target },
        { metric: t('Disclosure Quality'), value: '+45%', icon: Leaf }
      ],
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
      testimonial: {
        quote: t('ImpactSoluce helped us understand our ESG exposure and evidence readiness. We could prove our compliance posture to investors and regulators with confidence.'),
        author: 'Emma Rodriguez',
        role: t('Head of ESG Strategy')
      },
      featured: false
    }
  ];

  const filteredCaseStudies = caseStudies.filter(study => 
    selectedIndustry === 'all' || study.industry === selectedIndustry
  );

  const featuredStudy = caseStudies.find(study => study.featured);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t('Success Stories')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {t('See how organizations across industries are identifying their ESG exposure and proving evidence readiness with ImpactSoluce.')}
            </p>
          </div>
        </div>
      </section>

      {/* Industry Filter */}
      <section className="py-8 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {industries.map((industry) => (
              <button
                key={industry.id}
                onClick={() => setSelectedIndustry(industry.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedIndustry === industry.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {industry.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Case Study */}
      {featuredStudy && selectedIndustry === 'all' && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {t('Featured Success Story')}
              </h2>
            </div>
            
            <Card className="overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="aspect-video lg:aspect-auto">
                  <img
                    src={featuredStudy.image}
                    alt={featuredStudy.company}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Building className="h-5 w-5 text-primary" />
                    <span className="text-primary font-medium">{featuredStudy.company}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-600 dark:text-gray-400">{featuredStudy.size}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {featuredStudy.title}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {featuredStudy.results.map((result, index) => {
                      const IconComponent = result.icon;
                      return (
                        <div key={index} className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <IconComponent className="h-6 w-6 text-primary mx-auto mb-2" />
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {result.value}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {result.metric}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <blockquote className="border-l-4 border-primary pl-4 mb-6">
                    <p className="text-gray-600 dark:text-gray-300 italic mb-2">
                      "{featuredStudy.testimonial.quote}"
                    </p>
                    <footer className="text-sm">
                      <strong className="text-gray-900 dark:text-white">{featuredStudy.testimonial.author}</strong>
                      <span className="text-gray-500">, {featuredStudy.testimonial.role}</span>
                    </footer>
                  </blockquote>
                  
                  <Button className="bg-primary" icon={<Download className="h-4 w-4" />}>
                    {t('Download Full Case Study')}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Case Studies Grid */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('More Success Stories')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t('Discover how organizations are achieving their ESG goals with our platform.')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCaseStudies.filter(study => !study.featured).map((study) => (
              <Card key={study.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-video">
                  <img
                    src={study.image}
                    alt={study.company}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="h-4 w-4 text-primary" />
                    <span className="text-sm text-primary font-medium">{study.company}</span>
                  </div>
                  <CardTitle className="text-xl">{study.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                    {study.challenge}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {study.results.slice(0, 2).map((result, index) => {
                      const IconComponent = result.icon;
                      return (
                        <div key={index} className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <IconComponent className="h-4 w-4 text-primary mx-auto mb-1" />
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {result.value}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {result.metric}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Button variant="ghost" size="sm" icon={<ArrowRight className="h-4 w-4" />}>
                      {t('Read More')}
                    </Button>
                    <Button variant="outline" size="sm" icon={<Download className="h-4 w-4" />}>
                      {t('Download')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('Impact Across Industries')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { value: '500+', label: t('Organizations Served'), icon: Building },
              { value: '2.5M', label: t('Tonnes CO2e Reduced'), icon: Leaf },
              { value: '95%', label: t('Client Satisfaction'), icon: Award },
              { value: '25+', label: t('Countries'), icon: Globe }
            ].map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-primary/10 rounded-full">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.value}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {t('Ready to Write Your Success Story?')}
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              {t('Join these industry leaders and start your ESG transformation journey today.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-primary hover:bg-gray-100">
                {t('Start Your Assessment')}
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-primary-800">
                {t('Schedule Consultation')}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}