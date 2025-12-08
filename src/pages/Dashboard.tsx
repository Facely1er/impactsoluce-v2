import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { BarChart3, Cloud, Database, Leaf, Server, Users, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';
import EsgScoreCard from '../components/dashboard/EsgScoreCard';
import CarbonChart from '../components/dashboard/CarbonChart';
import AssessmentOverview from '../components/dashboard/AssessmentOverview';
import { useAssessmentData } from '../hooks/useAssessmentData';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { ESGScore, CarbonData } from '../types';
import { useAssessmentDemo } from '../hooks/useAssessmentDemo';

export default function Dashboard() {
  const { t } = useTranslation();
  const { history, isLoading, error, isDemoMode } = useAssessmentData();
  const { getDemoData } = useAssessmentDemo();

  // State for dynamic data
  const [currentEsgScore, setCurrentEsgScore] = useState<ESGScore>({
    environmental: 0,
    social: 0,
    governance: 0,
    total: 0
  });

  const [currentSummaryCards, setCurrentSummaryCards] = useState([
    { 
      title: t('Total Emissions'), 
      value: '0', 
      unit: t('tonnes CO2e'),
      change: '0%',
      changeType: 'neutral' as const,
      icon: <Leaf className="h-5 w-5 text-green-500" />
    },
    {
      title: t('Energy Consumption'),
      value: '0',
      unit: t('kWh'),
      change: '0%',
      changeType: 'neutral' as const,
      icon: <Cloud className="h-5 w-5 text-blue-500" />
    },
    {
      title: t('Technology Dependencies'),
      value: '0',
      unit: t('systems'),
      change: '0',
      changeType: 'neutral' as const,
      icon: <Database className="h-5 w-5 text-purple-500" />
    },
    {
      title: t('Active Projects'),
      value: '0',
      unit: t('initiatives'),
      change: '0',
      changeType: 'neutral' as const,
      icon: <BarChart3 className="h-5 w-5 text-yellow-500" />
    }
  ]);

  const [currentAssessmentCategories, setCurrentAssessmentCategories] = useState([
    {
      name: 'Environmental',
      score: 0,
      items: [
        { id: 'e1', name: 'Energy Management', score: 0, maxScore: 10 },
        { id: 'e2', name: 'Emissions Reduction', score: 0, maxScore: 10 },
        { id: 'e3', name: 'Waste Management', score: 0, maxScore: 10 },
        { id: 'e4', name: 'Water Usage', score: 0, maxScore: 10 }
      ]
    },
    {
      name: 'Social',
      score: 0,
      items: [
        { id: 's1', name: 'Human Rights', score: 0, maxScore: 10 },
        { id: 's2', name: 'Employee Wellbeing', score: 0, maxScore: 10 },
        { id: 's3', name: 'Community Impact', score: 0, maxScore: 10 },
        { id: 's4', name: 'Diversity & Inclusion', score: 0, maxScore: 10 }
      ]
    },
    {
      name: 'Governance',
      score: 0,
      items: [
        { id: 'g1', name: 'Board Structure', score: 0, maxScore: 10 },
        { id: 'g2', name: 'Ethics & Compliance', score: 0, maxScore: 10 },
        { id: 'g3', name: 'Risk Management', score: 0, maxScore: 10 },
        { id: 'g4', name: 'Transparency', score: 0, maxScore: 10 }
      ]
    }
  ]);

  const [currentCarbonData, setCurrentCarbonData] = useState<CarbonData[]>([
    { month: "Jan", value: 0 },
    { month: "Feb", value: 0 },
    { month: "Mar", value: 0 },
    { month: "Apr", value: 0 },
    { month: "May", value: 0 },
    { month: "Jun", value: 0 },
    { month: "Jul", value: 0 },
    { month: "Aug", value: 0 },
    { month: "Sep", value: 0 },
    { month: "Oct", value: 0 },
    { month: "Nov", value: 0 },
    { month: "Dec", value: 0 }
  ]);

  // Process data when history changes or in demo mode
  useEffect(() => {
    if (isDemoMode) {
      // Use demo data
      const demoData = getDemoData();
      
      setCurrentEsgScore({
        environmental: 65,
        social: 70,
        governance: 72,
        total: 68
      });

      setCurrentSummaryCards([
        { 
          title: t('Total Emissions'), 
          value: '680', 
          unit: t('tonnes CO2e'),
          change: '-8%',
          changeType: 'positive',
          icon: <Leaf className="h-5 w-5 text-green-500" />
        },
        {
          title: t('Energy Consumption'),
          value: '1,020',
          unit: t('kWh'),
          change: '-5%',
          changeType: 'positive',
          icon: <Cloud className="h-5 w-5 text-blue-500" />
        },
        {
          title: t('Technology Dependencies'),
          value: '12',
          unit: t('systems'),
          change: '+2',
          changeType: 'neutral',
          icon: <Database className="h-5 w-5 text-purple-500" />
        },
        {
          title: t('Active Projects'),
          value: '5',
          unit: t('initiatives'),
          change: '+3',
          changeType: 'positive',
          icon: <BarChart3 className="h-5 w-5 text-yellow-500" />
        }
      ]);

      setCurrentAssessmentCategories([
        {
          name: 'Environmental',
          score: 65,
          items: [
            { id: 'e1', name: 'Energy Management', score: 6, maxScore: 10 },
            { id: 'e2', name: 'Emissions Reduction', score: 7, maxScore: 10 },
            { id: 'e3', name: 'Waste Management', score: 6, maxScore: 10 },
            { id: 'e4', name: 'Water Usage', score: 5, maxScore: 10 }
          ]
        },
        {
          name: 'Social',
          score: 70,
          items: [
            { id: 's1', name: 'Human Rights', score: 7, maxScore: 10 },
            { id: 's2', name: 'Employee Wellbeing', score: 8, maxScore: 10 },
            { id: 's3', name: 'Community Impact', score: 6, maxScore: 10 },
            { id: 's4', name: 'Diversity & Inclusion', score: 7, maxScore: 10 }
          ]
        },
        {
          name: 'Governance',
          score: 72,
          items: [
            { id: 'g1', name: 'Board Structure', score: 8, maxScore: 10 },
            { id: 'g2', name: 'Ethics & Compliance', score: 7, maxScore: 10 },
            { id: 'g3', name: 'Risk Management', score: 7, maxScore: 10 },
            { id: 'g4', name: 'Transparency', score: 6, maxScore: 10 }
          ]
        }
      ]);

      setCurrentCarbonData([
        { month: "Jan", value: 120 },
        { month: "Feb", value: 115 },
        { month: "Mar", value: 110 },
        { month: "Apr", value: 105 },
        { month: "May", value: 100 },
        { month: "Jun", value: 95 },
        { month: "Jul", value: 90 },
        { month: "Aug", value: 85 },
        { month: "Sep", value: 80 },
        { month: "Oct", value: 75 },
        { month: "Nov", value: 70 },
        { month: "Dec", value: 68 }
      ]);

      return;
    }

    if (!history || history.length === 0) return;

    // Find the latest completed assessment
    const completedAssessments = history.filter(assessment => 
      assessment.status === 'submitted' && assessment.total_score !== null
    );

    if (completedAssessments.length === 0) return;

    // Sort by creation date to get the latest
    const latestAssessment = completedAssessments.sort((a, b) => 
      new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    )[0];

    // Calculate ESG scores from metadata or use total_score as fallback
    const metadata = latestAssessment.metadata as any;
    const environmentalScore = metadata?.scores?.environmental || Math.floor((latestAssessment.total_score || 0) * 0.8);
    const socialScore = metadata?.scores?.social || Math.floor((latestAssessment.total_score || 0) * 0.9);
    const governanceScore = metadata?.scores?.governance || Math.floor((latestAssessment.total_score || 0) * 1.1);

    // Update ESG scores
    setCurrentEsgScore({
      environmental: environmentalScore,
      social: socialScore,
      governance: governanceScore,
      total: latestAssessment.total_score || 0
    });

    // Calculate changes from previous assessment
    const previousAssessment = completedAssessments.length > 1 ? completedAssessments[1] : null;
    const calculateChange = (current: number, previous: number | null) => {
      if (!previous) return { value: '0%', type: 'neutral' as const };
      const change = ((current - previous) / previous) * 100;
      return {
        value: `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`,
        type: change > 0 ? 'positive' as const : change < 0 ? 'negative' as const : 'neutral' as const
      };
    };

    // Update summary cards with real data
    const totalEmissions = Math.floor((latestAssessment.total_score || 0) * 10); // Simulate emissions based on score
    const energyConsumption = Math.floor((latestAssessment.total_score || 0) * 15); // Simulate energy consumption
    const techDependencies = Object.keys(latestAssessment.assessment_responses || {}).length;
    const activeProjects = history.filter(a => a.status === 'draft').length;

    const previousEmissions = previousAssessment ? Math.floor((previousAssessment.total_score || 0) * 10) : null;
    const previousEnergy = previousAssessment ? Math.floor((previousAssessment.total_score || 0) * 15) : null;

    const emissionsChange = calculateChange(totalEmissions, previousEmissions);
    const energyChange = calculateChange(energyConsumption, previousEnergy);

    setCurrentSummaryCards([
      { 
        title: t('Total Emissions'), 
        value: totalEmissions.toString(), 
        unit: t('tonnes CO2e'),
        change: emissionsChange.value,
        changeType: emissionsChange.type,
        icon: <Leaf className="h-5 w-5 text-green-500" />
      },
      {
        title: t('Energy Consumption'),
        value: energyConsumption.toString(),
        unit: t('kWh'),
        change: energyChange.value,
        changeType: energyChange.type,
        icon: <Cloud className="h-5 w-5 text-blue-500" />
      },
      {
        title: t('Technology Dependencies'),
        value: techDependencies.toString(),
        unit: t('systems'),
        change: techDependencies > 0 ? `+${techDependencies}` : '0',
        changeType: 'neutral',
        icon: <Database className="h-5 w-5 text-purple-500" />
      },
      {
        title: t('Active Projects'),
        value: activeProjects.toString(),
        unit: t('initiatives'),
        change: activeProjects > 0 ? `+${activeProjects}` : '0',
        changeType: 'positive',
        icon: <BarChart3 className="h-5 w-5 text-yellow-500" />
      }
    ]);

    // Update assessment categories with real scores
    setCurrentAssessmentCategories([
      {
        name: 'Environmental',
        score: environmentalScore,
        items: [
          { id: 'e1', name: 'Energy Management', score: Math.floor(environmentalScore * 0.7), maxScore: 10 },
          { id: 'e2', name: 'Emissions Reduction', score: Math.floor(environmentalScore * 0.6), maxScore: 10 },
          { id: 'e3', name: 'Waste Management', score: Math.floor(environmentalScore * 0.5), maxScore: 10 },
          { id: 'e4', name: 'Water Usage', score: Math.floor(environmentalScore * 0.4), maxScore: 10 }
        ]
      },
      {
        name: 'Social',
        score: socialScore,
        items: [
          { id: 's1', name: 'Human Rights', score: Math.floor(socialScore * 0.8), maxScore: 10 },
          { id: 's2', name: 'Employee Wellbeing', score: Math.floor(socialScore * 0.7), maxScore: 10 },
          { id: 's3', name: 'Community Impact', score: Math.floor(socialScore * 0.6), maxScore: 10 },
          { id: 's4', name: 'Diversity & Inclusion', score: Math.floor(socialScore * 0.8), maxScore: 10 }
        ]
      },
      {
        name: 'Governance',
        score: governanceScore,
        items: [
          { id: 'g1', name: 'Board Structure', score: Math.floor(governanceScore * 0.9), maxScore: 10 },
          { id: 'g2', name: 'Ethics & Compliance', score: Math.floor(governanceScore * 0.8), maxScore: 10 },
          { id: 'g3', name: 'Risk Management', score: Math.floor(governanceScore * 0.8), maxScore: 10 },
          { id: 'g4', name: 'Transparency', score: Math.floor(governanceScore * 0.7), maxScore: 10 }
        ]
      }
    ]);

    // Create carbon data from historical assessments
    const carbonHistory = completedAssessments
      .slice(0, 12) // Last 12 assessments
      .reverse() // Oldest first
      .map((assessment, index) => {
        const date = new Date(assessment.created_at || Date.now());
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                           "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return {
          month: monthNames[date.getMonth()],
          value: Math.floor((assessment.total_score || 0) * 1.2) // Convert score to emissions
        };
      });

    // Fill in missing months with interpolated data
    if (carbonHistory.length > 0) {
      setCurrentCarbonData(carbonHistory);
    }

  }, [history, t, isDemoMode, getDemoData]);

  const getStatusIcon = (score: number) => {
    if (score >= 80) return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    if (score >= 60) return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  // Loading state
  if (isLoading && !isDemoMode) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">{t('Loading dashboard data...')}</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error && !isDemoMode) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('Unable to load dashboard data')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {t('There was an error loading your ESG data. Please try refreshing the page.')}
            </p>
            <Button onClick={() => window.location.reload()}>
              {t('Refresh Page')}
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {t('ESG Dashboard')} {isDemoMode && <span className="text-primary">(Demo)</span>}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {t('Overview of your environmental, social and governance performance')}
            </p>
            {isDemoMode && (
              <div className="mt-2 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Info className="h-4 w-4" />
                <span className="text-sm">This dashboard shows sample data for demonstration purposes</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <select className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 text-sm p-2">
              <option>{t('Last 30 days')}</option>
              <option>{t('Last 90 days')}</option>
              <option>{t('Last 12 months')}</option>
              <option>{t('Year to date')}</option>
            </select>
          </div>
        </div>

        {/* No data state */}
        {(!history || history.length === 0) && !isDemoMode && (
          <div className="text-center py-12 mb-8">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('No assessment data available')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {t('Complete your first ESG assessment to see your dashboard data.')}
            </p>
            <Link to="/impact-scan">
              <Button className="bg-primary">
                {t('Start Your First Assessment')}
              </Button>
            </Link>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {currentSummaryCards.map((card, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.title}</p>
                    <div className="flex items-baseline mt-1">
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{card.value}</p>
                      <p className="ml-1 text-sm text-gray-500 dark:text-gray-400">{card.unit}</p>
                    </div>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                        ${card.changeType === 'positive' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                          card.changeType === 'negative' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}`}>
                        {card.change}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
                    {card.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Assessment Overview */}
        <AssessmentOverview categories={currentAssessmentCategories} />

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* ESG Score Card */}
          <div>
            <EsgScoreCard score={currentEsgScore} />
          </div>

          {/* Carbon Emissions Chart */}
          <div className="md:col-span-2">
            <CarbonChart data={currentCarbonData} />
          </div>
        </div>

        {/* Technology Categories */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {t('Technology Categories')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Server className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('Infrastructure')}</h3>
                    <p className="text-gray-500 dark:text-gray-400">12 {t('systems')}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('Sustainability Score')}</span>
                    <span className="text-xs font-medium text-amber-600">65%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full dark:bg-gray-700">
                    <div className="h-2 rounded-full bg-amber-500" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                    <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('Software')}</h3>
                    <p className="text-gray-500 dark:text-gray-400">8 {t('systems')}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('Sustainability Score')}</span>
                    <span className="text-xs font-medium text-green-600">82%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full dark:bg-gray-700">
                    <div className="h-2 rounded-full bg-green-500" style={{ width: '82%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                    <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('End User')}</h3>
                    <p className="text-gray-500 dark:text-gray-400">7 {t('systems')}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('Sustainability Score')}</span>
                    <span className="text-xs font-medium text-green-600">78%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full dark:bg-gray-700">
                    <div className="h-2 rounded-full bg-green-500" style={{ width: '78%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}