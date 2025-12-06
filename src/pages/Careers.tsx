import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { 
  MapPin, 
  Clock, 
  Users, 
  Heart,
  Zap,
  Globe,
  Send,
  Search,
  Filter,
  ArrowRight,
  Building,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import Button from '../components/ui/Button';

export default function Careers() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const departments = [
    { id: 'all', name: t('All Departments') },
    { id: 'engineering', name: t('Engineering') },
    { id: 'product', name: t('Product') },
    { id: 'sales', name: t('Sales & Marketing') },
    { id: 'customer-success', name: t('Customer Success') },
    { id: 'operations', name: t('Operations') },
  ];

  const locations = [
    { id: 'all', name: t('All Locations') },
    { id: 'remote', name: t('Remote') },
    { id: 'new-york', name: t('New York, NY') },
    { id: 'san-francisco', name: t('San Francisco, CA') },
    { id: 'london', name: t('London, UK') },
    { id: 'toronto', name: t('Toronto, CA') },
  ];

  const jobOpenings = [
    {
      id: 1,
      title: t('Senior ESG Data Scientist'),
      department: 'engineering',
      location: 'remote',
      type: 'Full-time',
      experience: 'Senior',
      description: t('Lead the development of AI-powered ESG analytics and reporting tools to help organizations improve their sustainability performance.'),
      requirements: [
        t('5+ years experience in data science'),
        t('Strong background in ESG/sustainability metrics'),
        t('Proficiency in Python, R, and SQL'),
        t('Experience with machine learning frameworks'),
      ],
    },
    {
      id: 2,
      title: t('Product Manager - ESG Platform'),
      department: 'product',
      location: 'new-york',
      type: 'Full-time',
      experience: 'Mid-level',
      description: t('Drive product strategy and roadmap for our ESG assessment and reporting platform, working closely with customers and stakeholders.'),
      requirements: [
        t('3+ years product management experience'),
        t('Understanding of ESG frameworks (GRI, SASB, TCFD)'),
        t('Experience with B2B SaaS products'),
        t('Strong analytical and communication skills'),
      ],
    },
    {
      id: 3,
      title: t('Customer Success Manager'),
      department: 'customer-success',
      location: 'remote',
      type: 'Full-time',
      experience: 'Mid-level',
      description: t('Help our customers achieve their ESG goals by providing strategic guidance and ensuring successful platform adoption.'),
      requirements: [
        t('2+ years customer success experience'),
        t('Knowledge of sustainability and ESG practices'),
        t('Excellent communication and relationship building skills'),
        t('Experience with enterprise software'),
      ],
    },
    {
      id: 4,
      title: t('Frontend Engineer - React/TypeScript'),
      department: 'engineering',
      location: 'san-francisco',
      type: 'Full-time',
      experience: 'Mid-level',
      description: t('Build beautiful, responsive user interfaces for our ESG platform using modern web technologies.'),
      requirements: [
        t('3+ years React/TypeScript experience'),
        t('Strong CSS and design system knowledge'),
        t('Experience with data visualization'),
        t('Passion for sustainability and ESG'),
      ],
    },
    {
      id: 5,
      title: t('ESG Consultant'),
      department: 'customer-success',
      location: 'london',
      type: 'Full-time',
      experience: 'Senior',
      description: t('Provide expert ESG consulting services to help enterprise clients develop and implement comprehensive sustainability strategies.'),
      requirements: [
        t('7+ years ESG/sustainability consulting experience'),
        t('Deep knowledge of global ESG frameworks'),
        t('Experience with CSRD, SFDR, and EU regulations'),
        t('Strong presentation and workshop facilitation skills'),
      ],
    },
  ];

  const benefits = [
    {
      title: t('Competitive Compensation'),
      description: t('Competitive salary, equity, and performance bonuses'),
      icon: Briefcase,
    },
    {
      title: t('Health & Wellness'),
      description: t('Comprehensive health, dental, and vision insurance'),
      icon: Heart,
    },
    {
      title: t('Flexible Work'),
      description: t('Remote-first culture with flexible working hours'),
      icon: Clock,
    },
    {
      title: t('Learning & Development'),
      description: t('Professional development budget and learning opportunities'),
      icon: GraduationCap,
    },
    {
      title: t('Sustainability Focus'),
      description: t('Work on meaningful projects that drive positive environmental impact'),
      icon: Globe,
    },
    {
      title: t('Team Culture'),
      description: t('Collaborative, inclusive, and mission-driven team environment'),
      icon: Users,
    },
  ];

  const filteredJobs = jobOpenings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment;
    const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation;
    return matchesSearch && matchesDepartment && matchesLocation;
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t('Join Our Mission')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {t('Help organizations worldwide build a more sustainable future through technology and data-driven ESG solutions.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-primary">
                {t('View Open Positions')}
              </Button>
              <Button variant="outline">
                {t('Learn About Our Culture')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('Why Work at ESGSoluce?')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('We\'re building the future of ESG technology while creating an environment where talented people can do their best work.')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <IconComponent className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Job Search and Filters */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('Open Positions')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t('Find your next opportunity to make a meaningful impact')}
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('Search positions...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
                >
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
                
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
                >
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>{location.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {job.title}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {job.type}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                          {job.experience}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          {departments.find(d => d.id === job.department)?.name}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {locations.find(l => l.id === job.location)?.name}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {job.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {job.requirements.slice(0, 3).map((req, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded dark:bg-gray-800 dark:text-gray-300"
                          >
                            {req}
                          </span>
                        ))}
                        {job.requirements.length > 3 && (
                          <span className="px-2 py-1 text-xs text-gray-500">
                            +{job.requirements.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 lg:mt-0 lg:ml-6">
                      <Button className="bg-primary" icon={<ArrowRight className="h-4 w-4" />}>
                        {t('Apply Now')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {t('No positions found matching your criteria.')}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDepartment('all');
                  setSelectedLocation('all');
                }}
              >
                {t('Clear Filters')}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {t('Our Hiring Process')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t('We believe in a transparent and efficient hiring process that respects your time.')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: '1',
                  title: t('Application'),
                  description: t('Submit your application and we\'ll review it within 2 business days.')
                },
                {
                  step: '2',
                  title: t('Phone Screen'),
                  description: t('Brief conversation with our talent team to discuss your background and interests.')
                },
                {
                  step: '3',
                  title: t('Technical Interview'),
                  description: t('Role-specific interview to assess your skills and experience.')
                },
                {
                  step: '4',
                  title: t('Final Interview'),
                  description: t('Meet with team members and leadership to ensure mutual fit.')
                }
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {t('Ready to Make an Impact?')}
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              {t('Join us in building technology that drives positive environmental and social change.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-primary hover:bg-gray-100">
                {t('View All Positions')}
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-primary-800">
                {t('Contact Our Team')}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}