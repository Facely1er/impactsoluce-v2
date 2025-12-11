import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from '../../components/layout/Layout';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { ArrowLeft, FileText, Code, Download } from 'lucide-react';

export default function DocumentationArticle() {
  const { sectionId, articleId } = useParams<{ sectionId: string; articleId: string }>();
  const { t } = useTranslation();

  // Documentation content - in a real app, this would come from an API or CMS
  const documentationContent: Record<string, Record<string, any>> = {
    'quick-start': {
      '0': {
        title: t('Creating Your Account'),
        content: [
          t('To get started with ImpactSoluce, you need to create an account. Follow these steps:'),
          t('1. Navigate to the Sign Up page'),
          t('2. Enter your email address and create a secure password'),
          t('3. Verify your email address by clicking the link sent to your inbox'),
          t('4. Complete your organization profile with basic information'),
          t('5. Choose your subscription plan based on your needs'),
          t('Once your account is created, you can start configuring your Risk Radar and conducting ESG assessments.')
        ]
      },
      '1': {
        title: t('First ESG Assessment'),
        content: [
          t('Your first ESG assessment is the foundation for understanding your organization\'s sustainability posture.'),
          t('To start an assessment:'),
          t('1. Navigate to the Impact Scan page from the main menu'),
          t('2. Click "Start New Assessment"'),
          t('3. Select the assessment scope (organization-wide, specific division, or project)'),
          t('4. Choose the frameworks you want to align with (GRI, SASB, TCFD, CSRD, etc.)'),
          t('5. Begin answering questions about your ESG practices'),
          t('You can save your progress at any time and resume later. The assessment will guide you through each section with clear instructions and examples.')
        ]
      },
      '2': {
        title: t('Understanding Your Dashboard'),
        content: [
          t('The ImpactSoluce dashboard provides a comprehensive overview of your ESG performance and exposure.'),
          t('Key sections include:'),
          t('• Risk Radar: Visual representation of your ESG exposure signals'),
          t('• Evidence Readiness: Overview of your compliance documentation status'),
          t('• Assessment Results: Latest assessment scores and trends'),
          t('• Alerts & Notifications: Important deadlines and compliance requirements'),
          t('• Quick Actions: Shortcuts to common tasks'),
          t('Customize your dashboard by selecting which widgets to display and arranging them according to your preferences.')
        ]
      },
      '3': {
        title: t('Inviting Team Members'),
        content: [
          t('Collaboration is essential for effective ESG management. You can invite team members to your ImpactSoluce workspace.'),
          t('To invite team members:'),
          t('1. Go to Settings > Team Management'),
          t('2. Click "Invite Member"'),
          t('3. Enter the email address of the person you want to invite'),
          t('4. Select their role and permissions'),
          t('5. Send the invitation'),
          t('Team members will receive an email with instructions to join. You can manage their access levels and permissions at any time.')
        ]
      }
    },
    'assessments': {
      '0': {
        title: t('Assessment Framework Overview'),
        content: [
          t('ImpactSoluce supports multiple ESG frameworks to help you align with various reporting requirements.'),
          t('Supported frameworks include:'),
          t('• GRI Standards: Global Reporting Initiative standards for sustainability reporting'),
          t('• SASB: Sustainability Accounting Standards Board industry-specific standards'),
          t('• TCFD: Task Force on Climate-related Financial Disclosures'),
          t('• CSRD: Corporate Sustainability Reporting Directive (EU)'),
          t('• ISSB: International Sustainability Standards Board'),
          t('The platform automatically maps your assessment responses across these frameworks, helping you understand your compliance posture for each standard.')
        ]
      },
      '1': {
        title: t('Data Collection Best Practices'),
        content: [
          t('Effective data collection is crucial for accurate ESG assessments. Follow these best practices:'),
          t('• Start with available data: Begin with data you already have rather than waiting for perfect information'),
          t('• Establish data governance: Define clear ownership and processes for data collection'),
          t('• Use multiple sources: Combine internal data with external sources for comprehensive coverage'),
          t('• Document assumptions: Clearly document any assumptions or estimates used'),
          t('• Regular updates: Establish a schedule for regular data updates and reviews'),
          t('• Quality checks: Implement validation processes to ensure data accuracy')
        ]
      }
    }
  };

  const section = documentationContent[sectionId || ''];
  const article = section?.[articleId || ''];

  if (!article) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Link to="/documentation">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('Back to Documentation')}
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('Article Not Found')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('The documentation article you\'re looking for doesn\'t exist or has been moved.')}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Link to="/documentation">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('Back to Documentation')}
          </Button>
        </Link>

        {/* Article Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {article.title}
          </h1>
        </div>

        {/* Article Content */}
        <Card>
          <CardContent className="p-8 prose prose-lg dark:prose-invert max-w-none">
            {article.content.map((paragraph: string, index: number) => (
              <p key={index} className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="mt-8 flex items-center justify-between">
          <Link to="/documentation">
            <Button variant="outline">
              {t('View All Documentation')}
            </Button>
          </Link>
          <Button variant="outline" icon={<Download className="h-4 w-4" />}>
            {t('Download PDF')}
          </Button>
        </div>
      </div>
    </Layout>
  );
}

