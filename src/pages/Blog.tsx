import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Card, CardContent } from '../components/ui/Card';
import { 
  Calendar, 
  User, 
  ArrowRight, 
  Search,
  Clock,
  Tag
} from 'lucide-react';
import Button from '../components/ui/Button';

export default function Blog() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: t('All Posts') },
    { id: 'esg-trends', name: t('ESG Trends') },
    { id: 'technology', name: t('Technology') },
    { id: 'sustainability', name: t('Sustainability') },
    { id: 'compliance', name: t('Compliance') },
    { id: 'case-studies', name: t('Case Studies') },
  ];

  const blogPosts = [
    {
      id: 1,
      title: t('The Future of ESG Reporting: Trends to Watch in 2024'),
      excerpt: t('Explore the emerging trends in ESG reporting and how organizations can prepare for new regulatory requirements and stakeholder expectations.'),
      author: 'Sarah Chen',
      date: '2024-03-15',
      readTime: '8 min read',
      category: 'esg-trends',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: true,
    },
    {
      id: 2,
      title: t('How AI is Transforming Carbon Footprint Tracking'),
      excerpt: t('Discover how artificial intelligence and machine learning are revolutionizing the way organizations measure and reduce their carbon emissions.'),
      author: 'Marcus Rodriguez',
      date: '2024-03-12',
      readTime: '6 min read',
      category: 'technology',
      image: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: false,
    },
    {
      id: 3,
      title: t('CSRD Compliance: A Complete Guide for Organizations'),
      excerpt: t('Everything you need to know about the Corporate Sustainability Reporting Directive and how to ensure your organization is compliant.'),
      author: 'Dr. Elena Kowalski',
      date: '2024-03-10',
      readTime: '12 min read',
      category: 'compliance',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: false,
    },
    {
      id: 4,
      title: t('Building Sustainable Technology Infrastructure'),
      excerpt: t('Learn how to design and implement technology infrastructure that supports your organization\'s sustainability goals and reduces environmental impact.'),
      author: 'Alex Thompson',
      date: '2024-03-08',
      readTime: '10 min read',
      category: 'sustainability',
      image: 'https://images.pexels.com/photos/2990647/pexels-photo-2990647.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: false,
    },
    {
      id: 5,
      title: t('Case Study: How TechCorp Reduced Carbon Emissions by 40%'),
      excerpt: t('A detailed look at how a Fortune 500 technology company used ImpactSoluce to identify their ESG exposure and improve evidence readiness for regulatory compliance.'),
      author: 'Jennifer Liu',
      date: '2024-03-05',
      readTime: '15 min read',
      category: 'case-studies',
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: false,
    },
    {
      id: 6,
      title: t('The Role of Technology in Achieving Net Zero Goals'),
      excerpt: t('Explore how technology can be both a challenge and a solution in the journey toward net zero emissions and sustainable business practices.'),
      author: 'David Park',
      date: '2024-03-01',
      readTime: '9 min read',
      category: 'sustainability',
      image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: false,
    },
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t('ESG Insights & Resources')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {t('Stay informed with the latest trends, best practices, and insights in ESG and sustainable technology.')}
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('Search articles...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && selectedCategory === 'all' && !searchQuery && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              {t('Featured Article')}
            </h2>
            <Card className="overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="aspect-video lg:aspect-auto">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {featuredPost.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(featuredPost.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {featuredPost.readTime}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {featuredPost.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <Link to={`/blog/article/${featuredPost.id}`}>
                    <Button className="bg-primary" icon={<ArrowRight className="h-4 w-4" />}>
                      {t('Read Full Article')}
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {searchQuery || selectedCategory !== 'all' ? t('Search Results') : t('Latest Articles')}
            </h2>
            <span className="text-gray-600 dark:text-gray-400">
              {filteredPosts.length} {t('articles found')}
            </span>
          </div>
          
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="h-4 w-4 text-primary" />
                      <span className="text-sm text-primary font-medium">
                        {categories.find(cat => cat.id === post.category)?.name}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readTime}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(post.date).toLocaleDateString()}
                      </span>
                      <Link to={`/blog/article/${post.id}`}>
                        <Button variant="ghost" size="sm" icon={<ArrowRight className="h-4 w-4" />}>
                          {t('Read More')}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {t('No articles found matching your criteria.')}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                {t('Clear Filters')}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {t('Stay Updated with ESG Insights')}
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              {t('Subscribe to our newsletter for the latest ESG trends, best practices, and platform updates.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder={t('Enter your email')}
                className="flex-1 px-4 py-3 rounded-md border-0 focus:ring-2 focus:ring-white"
              />
              <Button className="bg-white text-primary hover:bg-gray-100">
                {t('Subscribe')}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}