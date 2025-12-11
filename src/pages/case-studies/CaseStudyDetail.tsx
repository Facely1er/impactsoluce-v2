import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from '../../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { 
  ArrowLeft,
  Building,
  Download,
  TrendingUp,
  Target,
  Award,
  Leaf,
  CheckCircle2,
  Quote
} from 'lucide-react';

export default function CaseStudyDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const isDownload = searchParams.get('download') === 'true';

  // Case studies data - in a real app, this would come from an API
  const caseStudies: Record<string, any> = {
    '1': {
      title: t('TechCorp Achieves 40% Carbon Reduction'),
      company: 'TechCorp Global',
      industry: 'Technology',
      size: t('5,000+ employees'),
      location: t('Global'),
      challenge: t('TechCorp faced significant challenges with high energy consumption from their data centers and lacked a comprehensive ESG reporting framework. Regulatory pressure was increasing, and major buyers were requesting detailed sustainability disclosures. The company needed to understand their ESG exposure and prepare evidence for compliance.'),
      solution: t('TechCorp implemented ImpactSoluce to conduct a comprehensive ESG exposure analysis. They configured the Risk Radar to identify environmental pressure signals, social risk alerts, and governance gaps. The Evidence Readiness Workspace helped them organize and assess their sustainability posture, identifying gaps and prioritizing actions.'),
      implementation: [
        t('Configured Risk Radar with sector, geography, and supply chain data'),
        t('Conducted Impact Scan assessment to establish baseline ESG posture'),
        t('Used Evidence Workspace to inventory existing documentation and identify gaps'),
        t('Implemented carbon tracking and reduction initiatives based on exposure analysis'),
        t('Established continuous monitoring and reporting processes')
      ],
      results: [
        { metric: t('Carbon Reduction'), value: '40%', icon: Leaf, description: t('Achieved through data center optimization and renewable energy transition') },
        { metric: t('ESG Score Improvement'), value: '+35 points', icon: TrendingUp, description: t('Comprehensive improvement across all ESG pillars') },
        { metric: t('Reporting Efficiency'), value: '75%', icon: Target, description: t('Reduced time spent on ESG reporting and compliance activities') },
        { metric: t('Cost Savings'), value: '$2.3M', icon: Award, description: t('Annual savings from energy efficiency and streamlined processes') }
      ],
      testimonial: {
        quote: t('ImpactSoluce showed us exactly where regulatory pressure would hit. The Risk Radar identified our exposure signals before our buyers asked, giving us time to prepare evidence. The platform transformed how we approach ESG compliance from reactive to proactive.'),
        author: 'Sarah Johnson',
        role: t('Chief Sustainability Officer'),
        company: 'TechCorp Global'
      },
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1600',
      keyLearnings: [
        t('Early exposure identification enables proactive compliance preparation'),
        t('Evidence readiness is critical for responding to buyer and regulatory requests'),
        t('Technology infrastructure optimization can deliver significant carbon reductions'),
        t('Integrated ESG management platforms streamline reporting and compliance')
      ]
    },
    '2': {
      title: t('Manufacturing Giant Streamlines ESG Reporting'),
      company: 'Industrial Solutions Inc.',
      industry: 'Manufacturing',
      size: t('10,000+ employees'),
      location: t('Global'),
      challenge: t('Industrial Solutions Inc. struggled with complex supply chain ESG tracking and compliance with multiple international standards. Their reporting process was fragmented across different departments, leading to inefficiencies and compliance risks.'),
      solution: t('The company deployed ImpactSoluce\'s comprehensive ESG management system with supplier integration and multi-framework reporting capabilities. They activated relevant Regulatory Intelligence Modules and used Supply Chain Mapping to visualize and manage supplier ESG risks.'),
      implementation: [
        t('Activated EUDR and Supply Chain Transparency modules'),
        t('Mapped entire supply chain across multiple tiers'),
        t('Integrated supplier ESG assessments and monitoring'),
        t('Aligned reporting with GRI, SASB, TCFD, and CSRD frameworks'),
        t('Established automated reporting workflows')
      ],
      results: [
        { metric: t('Reporting Time Reduction'), value: '60%', icon: Target, description: t('Streamlined processes and automation reduced reporting time significantly') },
        { metric: t('Supplier ESG Compliance'), value: '95%', icon: Award, description: t('Achieved high compliance rate across supply chain through systematic monitoring') },
        { metric: t('Framework Alignment'), value: '8 standards', icon: TrendingUp, description: t('Successfully aligned with multiple international ESG frameworks') },
        { metric: t('Audit Efficiency'), value: '50%', icon: Leaf, description: t('Improved audit preparation and execution efficiency') }
      ],
      testimonial: {
        quote: t('The platform\'s multi-framework approach saved us countless hours and ensured we met all regulatory requirements across different markets. The supply chain mapping feature gave us visibility we never had before.'),
        author: 'Michael Chen',
        role: t('VP of Operations'),
        company: 'Industrial Solutions Inc.'
      },
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1600',
      keyLearnings: [
        t('Multi-framework alignment is essential for global operations'),
        t('Supply chain transparency requires systematic mapping and monitoring'),
        t('Automation significantly improves reporting efficiency'),
        t('Integrated platforms reduce compliance risks across jurisdictions')
      ]
    },
    '3': {
      title: t('Financial Services Leader Enhances ESG Transparency'),
      company: 'Global Finance Partners',
      industry: 'Financial Services',
      size: t('2,500+ employees'),
      location: t('Europe & North America'),
      challenge: t('Global Finance Partners faced increasing investor demands for detailed ESG disclosure and needed to integrate ESG risk assessment with investment decision-making. Their existing processes were manual and couldn\'t keep pace with evolving requirements.'),
      solution: t('The organization integrated ImpactSoluce\'s ESG risk assessment capabilities with their investment processes. They used the Risk Radar to identify ESG exposure signals and the Evidence Workspace to prepare comprehensive disclosures for investors and regulators.'),
      implementation: [
        t('Configured Risk Radar for financial services sector exposure'),
        t('Integrated ESG data into investment decision workflows'),
        t('Established evidence readiness for investor reporting'),
        t('Implemented real-time ESG monitoring and alerts'),
        t('Developed comprehensive stakeholder reporting capabilities')
      ],
      results: [
        { metric: t('ESG Rating Improvement'), value: 'AA+', icon: Award, description: t('Achieved top-tier ESG rating from major rating agencies') },
        { metric: t('Investor Satisfaction'), value: '92%', icon: TrendingUp, description: t('High satisfaction with ESG disclosure quality and transparency') },
        { metric: t('Risk Assessment Coverage'), value: '100%', icon: Target, description: t('Complete ESG risk assessment coverage across investment portfolio') },
        { metric: t('Disclosure Quality'), value: '+45%', icon: Leaf, description: t('Significant improvement in ESG disclosure quality scores') }
      ],
      testimonial: {
        quote: t('ImpactSoluce helped us understand our ESG exposure and evidence readiness. We could prove our compliance posture to investors and regulators with confidence. The platform became essential to our investment process.'),
        author: 'Emma Rodriguez',
        role: t('Head of ESG Strategy'),
        company: 'Global Finance Partners'
      },
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1600',
      keyLearnings: [
        t('ESG integration with core business processes drives value'),
        t('Evidence readiness is critical for investor confidence'),
        t('Real-time monitoring enables proactive risk management'),
        t('Comprehensive disclosure improves stakeholder relationships')
      ]
    }
  };

  const caseStudy = caseStudies[id || '1'];

  if (!caseStudy) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('Case Study Not Found')}
          </h1>
          <Link to="/case-studies">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('Back to Case Studies')}
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  if (isDownload) {
    // In a real app, this would trigger a PDF download
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('Downloading Case Study PDF...')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('Your download should start shortly. If it doesn\'t, please contact support.')}
          </p>
          <Link to={`/case-studies/${id}`}>
            <Button variant="outline">
              {t('View Case Study')}
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back Button */}
        <Link to="/case-studies">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('Back to Case Studies')}
          </Button>
        </Link>

        {/* Case Study Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Building className="h-5 w-5 text-primary" />
            <span className="text-primary font-medium">{caseStudy.company}</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-600 dark:text-gray-400">{caseStudy.industry}</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-600 dark:text-gray-400">{caseStudy.size}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {caseStudy.title}
          </h1>
        </div>

        {/* Featured Image */}
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={caseStudy.image}
            alt={caseStudy.company}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Results Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {caseStudy.results.map((result: any, index: number) => {
            const IconComponent = result.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <IconComponent className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {result.value}
                  </div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {result.metric}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {result.description}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Challenge Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t('The Challenge')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {caseStudy.challenge}
            </p>
          </CardContent>
        </Card>

        {/* Solution Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t('The Solution')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {caseStudy.solution}
            </p>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              {t('Implementation Steps')}:
            </h3>
            <ul className="space-y-2">
              {caseStudy.implementation.map((step: string, index: number) => (
                <li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Testimonial */}
        <Card className="mb-8 border-primary/20">
          <CardContent className="p-8">
            <Quote className="h-8 w-8 text-primary mb-4" />
            <blockquote className="text-lg text-gray-700 dark:text-gray-300 italic mb-4">
              "{caseStudy.testimonial.quote}"
            </blockquote>
            <footer className="flex items-center gap-3">
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {caseStudy.testimonial.author}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {caseStudy.testimonial.role}, {caseStudy.testimonial.company}
                </div>
              </div>
            </footer>
          </CardContent>
        </Card>

        {/* Key Learnings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t('Key Learnings')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {caseStudy.keyLearnings.map((learning: string, index: number) => (
                <li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>{learning}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link to={`/case-studies/${id}?download=true`}>
            <Button className="bg-primary" icon={<Download className="h-4 w-4" />}>
              {t('Download PDF')}
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline">
              {t('Schedule a Consultation')}
            </Button>
          </Link>
          <Link to="/impact-scan">
            <Button variant="outline">
              {t('Start Your Assessment')}
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}

