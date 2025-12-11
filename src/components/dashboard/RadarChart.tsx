import { useMemo } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RadarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor?: string;
      backgroundColor?: string;
      borderWidth?: number;
    }[];
  };
  options?: ChartOptions<'radar'>;
}

export default function RadarChart({ data, options }: RadarChartProps) {
  const defaultOptions: ChartOptions<'radar'> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        min: 0,
        ticks: {
          stepSize: 20,
          color: 'rgba(107, 114, 128, 0.8)',
          font: {
            size: 11
          }
        },
        grid: {
          color: 'rgba(107, 114, 128, 0.2)'
        },
        pointLabels: {
          color: 'rgba(17, 24, 39, 0.9)',
          font: {
            size: 12,
            weight: '500'
          }
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          usePointStyle: true,
          color: 'rgba(17, 24, 39, 0.9)',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.parsed.r}%`;
          }
        }
      }
    },
    ...options
  }), [options]);

  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center">
      <Radar data={data} options={defaultOptions} />
    </div>
  );
}

