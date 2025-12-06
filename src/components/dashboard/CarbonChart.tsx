import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/Card';
import { CarbonData } from '../../types';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  ChartOptions
} from 'chart.js';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend
);

interface CarbonChartProps {
  data: CarbonData[];
}

const CarbonChart: React.FC<CarbonChartProps> = ({ data }) => {
  const { t } = useTranslation();

  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: t('Carbon Emissions (tonnes CO2e)'),
        data: data.map(item => item.value),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10B981',
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          boxWidth: 15,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(75, 85, 99, 0.3)',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        bodyFont: {
          size: 14,
        },
        callbacks: {
          label: function(context) {
            return `${context.parsed.y} ${t('tonnes CO2e')}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
        ticks: {
          callback: function(value) {
            return value + ' t';
          },
        },
        min: 0,
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    animations: {
      tension: {
        duration: 1000,
        easing: 'linear',
      }
    },
  };

  // Calculate percentage change
  const firstValue = data[0].value;
  const lastValue = data[data.length - 1].value;
  const percentChange = ((lastValue - firstValue) / firstValue) * 100;
  const isReduction = percentChange < 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('Carbon Emissions Trend')}</CardTitle>
        <CardDescription>
          {isReduction ? (
            <span className="text-green-600 font-medium">{Math.abs(percentChange).toFixed(1)}% {t('reduction')}</span>
          ) : (
            <span className="text-red-600 font-medium">{percentChange.toFixed(1)}% {t('increase')}</span>
          )} {t('in emissions over the past year')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <Line data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};

export default CarbonChart;