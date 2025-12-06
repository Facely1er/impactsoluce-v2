import React from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/layout/Layout';
import { Card, CardContent } from '../components/ui/Card';
import { 
  Users, 
  Target, 
  Award, 
  Globe, 
  Leaf, 
  Shield,
  TrendingUp,
  Heart,
  CheckCircle2
} from 'lucide-react';
import Button from '../components/ui/Button';

export default function About() {
  const { t } = useTranslation();

  const stats = [
    { label: t('Organizations Served'), value: '500+', icon: Users },
    { label: t('Countries'), value: '25+', icon: Globe },
    { label: t('ESG Frameworks Supported'), value: '15+', icon: Shield },
    { label: t('Carbon Reduction Achieved'), value: '2.5M', unit: t('tonnes CO2e'), icon: Leaf },
  ];

  const values = [
    {
      title: t('Sustainability First'),
      description: t('We believe technology should drive positive environmental and social impact'),
      icon: Leaf,
    },
    {
      title: t('Transparency'),
      description: t('Open, honest reporting and clear accountability in all our operations'),
      icon: Shield,
    },
    {
      title: t('Innovation'),
      description: t('Continuously advancing ESG technology to meet evolving global standards'),
      icon: TrendingUp,
    },
    {
      title: t('Collaboration'),
      description: t('Working together with organizations to build a more sustainable future'),
      icon: Heart,
    },
  ];

  const team = [
    {
      name: 'Sarah Chen',
      role: t('CEO & Co-Founder'),
      bio: t('Former sustainability director at Fortune 500 companies with 15+ years in ESG strategy'),
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      name: 'Marcus Rodriguez',
      role: t('CTO & Co-Founder'),
      bio: t('Technology leader with expertise in enterprise software and sustainable infrastructure'),
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      name: 'Dr. Elena Kowalski',
      role: t('Head of ESG Research'),
      bio: t('PhD in Environmental Science, former researcher at leading climate institutes'),
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t('Building a Sustainable Future Through Technology')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {t('ESGSoluce was founded on the belief that technology can be a powerful force for positive environmental and social change. We help organizations measure, manage, and improve their ESG performance while building resilient technology systems.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-primary">
                {t('Join Our Mission')}
              </Button>
              <Button variant="outline">
                {t('View Our Impact')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <IconComponent className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {stat.value}
                      {stat.unit && <span className="text-lg text-gray-600 dark:text-gray-400 ml-1">{stat.unit}</span>}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {t('Our Mission')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t('To accelerate the global transition to sustainable business practices by providing organizations with the technology and insights they need to excel in ESG performance.')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Target className="h-6 w-6 text-primary mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {t('Our Vision')}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('A world where every organization operates sustainably, transparently, and responsibly, creating positive impact for people and planet.')}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Award className="h-6 w-6 text-primary mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {t('Our Commitment')}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('We are committed to continuous innovation, transparency in our own operations, and supporting our clients in achieving meaningful ESG improvements.')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('Our Values')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('These core values guide everything we do and shape how we work with our clients and partners.')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-primary/10 rounded-full">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('Leadership Team')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('Our experienced team combines deep ESG expertise with cutting-edge technology knowledge.')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('Ready to Transform Your ESG Journey?')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              {t('Join hundreds of organizations already using ESGSoluce to drive meaningful sustainability improvements.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-primary">
                {t('Start Your Assessment')}
              </Button>
              <Button variant="outline">
                {t('Schedule a Demo')}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}