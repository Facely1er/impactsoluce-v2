import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from '../../components/layout/Layout';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { 
  Calendar, 
  User, 
  ArrowLeft,
  Clock,
  Tag,
  Share2,
  Bookmark
} from 'lucide-react';

export default function BlogArticle() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Blog articles data - in a real app, this would come from an API
  const articles: Record<string, any> = {
    '1': {
      title: t('The Future of ESG Reporting: Trends to Watch in 2024'),
      author: 'Sarah Chen',
      date: '2024-03-15',
      readTime: '8 min read',
      category: 'ESG Trends',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1600',
      content: [
        {
          type: 'paragraph',
          text: t('The landscape of ESG reporting is evolving rapidly, with new regulations, frameworks, and stakeholder expectations reshaping how organizations communicate their sustainability performance. As we move through 2024, several key trends are emerging that will define the future of ESG reporting.')
        },
        {
          type: 'heading',
          text: t('1. Regulatory Convergence and Standardization')
        },
        {
          type: 'paragraph',
          text: t('One of the most significant trends is the convergence of ESG reporting standards. The International Sustainability Standards Board (ISSB) has released its first set of standards, which are expected to become the global baseline for sustainability reporting. Meanwhile, the European Union\'s Corporate Sustainability Reporting Directive (CSRD) is setting new requirements for companies operating in Europe.')
        },
        {
          type: 'paragraph',
          text: t('This convergence means organizations need to prepare for more standardized reporting requirements while maintaining flexibility to address region-specific regulations. ImpactSoluce helps organizations navigate this complexity by providing multi-framework alignment and automated compliance tracking.')
        },
        {
          type: 'heading',
          text: t('2. Technology-Driven Data Collection and Verification')
        },
        {
          type: 'paragraph',
          text: t('Artificial intelligence and machine learning are transforming how organizations collect, analyze, and verify ESG data. Automated data collection from IoT sensors, satellite imagery, and supply chain systems is becoming more prevalent, reducing manual effort and improving data accuracy.')
        },
        {
          type: 'paragraph',
          text: t('Blockchain technology is also emerging as a tool for ensuring data integrity and traceability, particularly in supply chain reporting. This technological evolution requires organizations to invest in robust data infrastructure and analytical capabilities.')
        },
        {
          type: 'heading',
          text: t('3. Scope 3 Emissions and Supply Chain Transparency')
        },
        {
          type: 'paragraph',
          text: t('Scope 3 emissions reporting is becoming mandatory in many jurisdictions, requiring organizations to account for emissions throughout their value chain. This trend is driving increased focus on supply chain transparency and supplier engagement.')
        },
        {
          type: 'paragraph',
          text: t('Organizations are implementing supplier assessment programs, setting science-based targets, and developing collaborative approaches to reduce emissions across the value chain. ImpactSoluce\'s Supply Chain Mapping feature helps organizations visualize and manage their supply chain ESG risks.')
        },
        {
          type: 'heading',
          text: t('4. Real-Time Reporting and Stakeholder Engagement')
        },
        {
          type: 'paragraph',
          text: t('Stakeholders are demanding more frequent and transparent ESG reporting. Annual reports are no longer sufficient; organizations are moving toward quarterly or even real-time ESG dashboards that provide ongoing visibility into sustainability performance.')
        },
        {
          type: 'paragraph',
          text: t('This shift requires organizations to implement continuous monitoring systems and develop capabilities for real-time data aggregation and analysis. ImpactSoluce\'s Risk Radar provides real-time exposure signals, helping organizations stay ahead of regulatory and stakeholder expectations.')
        },
        {
          type: 'heading',
          text: t('5. Integration with Financial Reporting')
        },
        {
          type: 'paragraph',
          text: t('ESG reporting is increasingly being integrated with financial reporting, reflecting the growing recognition that sustainability issues have material financial impacts. This integration requires organizations to develop new accounting and reporting processes that capture both financial and non-financial performance.')
        },
        {
          type: 'heading',
          text: t('Preparing for the Future')
        },
        {
          type: 'paragraph',
          text: t('To prepare for these trends, organizations should:')
        },
        {
          type: 'list',
          items: [
            t('Invest in robust data infrastructure and technology platforms'),
            t('Develop multi-framework reporting capabilities'),
            t('Enhance supply chain transparency and engagement'),
            t('Build internal expertise in ESG reporting and compliance'),
            t('Implement continuous monitoring and real-time reporting systems')
          ]
        },
        {
          type: 'paragraph',
          text: t('ImpactSoluce provides the tools and intelligence organizations need to navigate these trends and build evidence-based ESG reporting capabilities that meet evolving regulatory and stakeholder expectations.')
        }
      ]
    },
    '2': {
      title: t('How AI is Transforming Carbon Footprint Tracking'),
      author: 'Marcus Rodriguez',
      date: '2024-03-12',
      readTime: '6 min read',
      category: 'Technology',
      image: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=1600',
      content: [
        {
          type: 'paragraph',
          text: t('Artificial intelligence is revolutionizing carbon footprint tracking, making it more accurate, efficient, and actionable. From automated data collection to predictive analytics, AI technologies are helping organizations measure and reduce their environmental impact with unprecedented precision.')
        },
        {
          type: 'heading',
          text: t('Automated Data Collection and Processing')
        },
        {
          type: 'paragraph',
          text: t('AI-powered systems can automatically collect carbon emissions data from multiple sources, including IoT sensors, energy meters, transportation systems, and supply chain databases. Machine learning algorithms process this data in real-time, identifying patterns and anomalies that would be impossible to detect manually.')
        },
        {
          type: 'heading',
          text: t('Predictive Analytics for Emissions Reduction')
        },
        {
          type: 'paragraph',
          text: t('Advanced AI models can predict future emissions based on historical data, operational changes, and external factors. This predictive capability enables organizations to model different scenarios and identify the most effective strategies for reducing their carbon footprint.')
        },
        {
          type: 'heading',
          text: t('Supply Chain Carbon Intelligence')
        },
        {
          type: 'paragraph',
          text: t('AI is particularly valuable for tracking Scope 3 emissions across complex supply chains. Machine learning algorithms can analyze supplier data, transportation routes, and production processes to calculate emissions with greater accuracy than traditional methods.')
        }
      ]
    },
    '3': {
      title: t('CSRD Compliance: A Complete Guide for Organizations'),
      author: 'Dr. Elena Kowalski',
      date: '2024-03-10',
      readTime: '12 min read',
      category: 'Compliance',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1600',
      content: [
        {
          type: 'paragraph',
          text: t('The Corporate Sustainability Reporting Directive (CSRD) represents a major shift in European sustainability reporting requirements. This comprehensive guide covers everything organizations need to know about CSRD compliance, from scope and requirements to implementation strategies.')
        },
        {
          type: 'heading',
          text: t('Understanding CSRD Scope and Timeline')
        },
        {
          type: 'paragraph',
          text: t('CSRD applies to large companies and listed SMEs operating in the EU, with phased implementation starting in 2024. Understanding whether your organization falls within the scope is the first critical step toward compliance.')
        },
        {
          type: 'heading',
          text: t('Key Reporting Requirements')
        },
        {
          type: 'paragraph',
          text: t('CSRD requires organizations to report on environmental, social, and governance matters using the European Sustainability Reporting Standards (ESRS). This includes detailed disclosures on climate change, biodiversity, human rights, and supply chain due diligence.')
        }
      ]
    },
    '4': {
      title: t('Building Sustainable Technology Infrastructure'),
      author: 'Alex Thompson',
      date: '2024-03-08',
      readTime: '10 min read',
      category: 'Sustainability',
      image: 'https://images.pexels.com/photos/2990647/pexels-photo-2990647.jpeg?auto=compress&cs=tinysrgb&w=1600',
      content: [
        {
          type: 'paragraph',
          text: t('Technology infrastructure plays a crucial role in an organization\'s sustainability journey. This article explores how to design and implement technology systems that support sustainability goals while reducing environmental impact.')
        }
      ]
    },
    '5': {
      title: t('Case Study: How TechCorp Reduced Carbon Emissions by 40%'),
      author: 'Jennifer Liu',
      date: '2024-03-05',
      readTime: '15 min read',
      category: 'Case Studies',
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1600',
      content: [
        {
          type: 'paragraph',
          text: t('This detailed case study examines how TechCorp, a Fortune 500 technology company, used ImpactSoluce to identify their ESG exposure and achieve a 40% reduction in carbon emissions while improving evidence readiness for regulatory compliance.')
        }
      ]
    },
    '6': {
      title: t('The Role of Technology in Achieving Net Zero Goals'),
      author: 'David Park',
      date: '2024-03-01',
      readTime: '9 min read',
      category: 'Sustainability',
      image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1600',
      content: [
        {
          type: 'paragraph',
          text: t('Technology can be both a challenge and a solution in the journey toward net zero emissions. This article explores how organizations can leverage technology to accelerate their path to carbon neutrality while managing the environmental impact of their technology infrastructure.')
        }
      ]
    }
  };

  const article = articles[id || '1'];

  if (!article) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('Article Not Found')}
          </h1>
          <Link to="/blog">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('Back to Blog')}
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Link to="/blog">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('Back to Blog')}
          </Button>
        </Link>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <div className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              {article.category}
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {article.author}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(article.date).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {article.readTime}
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {article.title}
          </h1>
        </div>

        {/* Featured Image */}
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Article Content */}
        <Card>
          <CardContent className="p-8 prose prose-lg dark:prose-invert max-w-none">
            {article.content.map((section: any, index: number) => {
              if (section.type === 'heading') {
                return (
                  <h2 key={index} className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                    {section.text}
                  </h2>
                );
              } else if (section.type === 'paragraph') {
                return (
                  <p key={index} className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    {section.text}
                  </p>
                );
              } else if (section.type === 'list') {
                return (
                  <ul key={index} className="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                    {section.items.map((item: string, itemIndex: number) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                );
              }
              return null;
            })}
          </CardContent>
        </Card>

        {/* Share and Actions */}
        <div className="mt-8 flex items-center justify-between">
          <div className="flex gap-4">
            <Button variant="outline" icon={<Share2 className="h-4 w-4" />}>
              {t('Share')}
            </Button>
            <Button variant="outline" icon={<Bookmark className="h-4 w-4" />}>
              {t('Save')}
            </Button>
          </div>
          <Link to="/blog">
            <Button variant="outline">
              {t('View All Articles')}
            </Button>
          </Link>
        </div>

        {/* Related Articles */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {t('Related Articles')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(articles)
              .filter(([key]) => key !== id)
              .slice(0, 2)
              .map(([key, relatedArticle]) => (
                <Link key={key} to={`/blog/article/${key}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={relatedArticle.image}
                        alt={relatedArticle.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {relatedArticle.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <span>{relatedArticle.author}</span>
                        <span>•</span>
                        <span>{relatedArticle.readTime}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

