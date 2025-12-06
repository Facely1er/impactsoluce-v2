import React from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { BarChart, Cloud, Leaf, LineChart, Settings, Target, Zap } from 'lucide-react';
import Button from '../components/ui/Button';
import { carbonData } from '../utils/data';
import CarbonChart from '../components/dashboard/CarbonChart';

export default function CarbonManagement() {
  const { t } = useTranslation();

  const metrics = [
    {
      title: t('Total Emissions'),
      value: '1,245',
      unit: t('tonnes CO2e'),
      change: '-12%',
      icon: <Leaf className="h-5 w-5 text-green-500" />,
    },
    {
      title: t('Energy Consumption'),
      value: '2,890',
      unit: 'MWh',
      change: '-8%',
      icon: <Zap className="h-5 w-5 text-yellow-500" />,
    },
    {
      title: t('Renewable Energy'),
      value: '45',
      unit: '%',
      change: '+15%',
      icon: <Cloud className="h-5 w-5 text-blue-500" />,
    },
  ];

  const initiatives = [
    {
      title: t('Data Center Optimization'),
      progress: 75,
      status: t('On Track'),
      reduction: '120',
      icon: <Settings className="h-5 w-5" />,
    },
    {
      title: t('Cloud Migration'),
      progress: 60,
      status: t('In Progress'),
      reduction: '85',
      icon: <Cloud className="h-5 w-5" />,
    },
    {
      title: t('Hardware Lifecycle Extension'),
      progress: 40,
      status: t('Behind Schedule'),
      reduction: '45',
      icon: <Target className="h-5 w-5" />,
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {t('Carbon Management')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {t('Monitor and reduce your technology carbon footprint')}
            </p>
            <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>{t('Data Source')}:</strong> {t('Carbon data can be provided by users or imported from energy monitoring systems. Sample data is shown for demonstration. Units: tCO2e (tonnes of CO2 equivalent), MWh (megawatt-hours).')}
              </p>
            </div>
          </div>
          <Button
            className="mt-4 md:mt-0 bg-primary"
            icon={<BarChart size={18} />}
          >
            {t('Generate Report')}
          </Button>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {metric.title}
                    </p>
                    <div className="flex items-baseline mt-1">
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {metric.value}
                      </p>
                      <p className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                        {metric.unit}
                      </p>
                    </div>
                    <div className="mt-2">
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        {metric.change}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
                    {metric.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Emissions Chart */}
        <div className="mb-8">
          <CarbonChart data={carbonData} />
        </div>

        {/* Carbon Reduction Initiatives */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {t('Carbon Reduction Initiatives')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {initiatives.map((initiative, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {initiative.icon}
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {initiative.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {initiative.status}
                      </p>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('Progress')}
                      </span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {initiative.progress}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                      <div
                        className="h-2 bg-primary rounded-full"
                        style={{ width: `${initiative.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      {t('Projected Reduction')}:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {initiative.reduction} {t('tonnes CO2e')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>{t('Recommendations')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <p className="ml-3 text-gray-600 dark:text-gray-300">
                  {t('Implement server virtualization')} {t('to reduce physical hardware requirements')}
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <Cloud className="h-6 w-6 text-primary" />
                </div>
                <p className="ml-3 text-gray-600 dark:text-gray-300">
                  {t('Migrate workloads to renewable cloud')} {t('to renewable-powered cloud regions')}
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <p className="ml-3 text-gray-600 dark:text-gray-300">
                  {t('Optimize cooling systems')} {t('in data centers using AI-driven controls')}
                </p>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}