'use client';

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineController,
  CategoryScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useEffect, useMemo, useState } from 'react';
import type { ChartOptions } from 'chart.js';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineController,
  CategoryScale
);

interface Props {
  fitX: number[];
  fitY: number[];
  points: number[][];
}

const Chart = ({ fitX, fitY, points }: Props) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const data = useMemo(() => ({
    labels: fitX,
    datasets: [
      {
        label: 'Data Points',
        data: points.map(([x, y]) => ({ x, y })),
        borderColor: 'rgba(14, 165, 233, 1)',
        backgroundColor: 'rgba(14, 165, 233, 0.4)',
        pointRadius: 6,
        showLine: false,
      },
      {
        label: 'Fitted Curve',
        data: fitX.map((x, i) => ({ x, y: fitY[i] })),
        borderColor: 'rgba(234, 88, 12, 1)',
        borderWidth: 3,
        fill: false,
        tension: 0.2,
      },
    ],
  }), [fitX, fitY, points]);

  const options: ChartOptions<'line'> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#374151',
          font: {
            weight: 'bold' as const, // 👈 Cast to acceptable literal
          },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: '#fff',
        bodyColor: '#ddd',
        cornerRadius: 4,
        padding: 8,
      },
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        grid: { color: '#e5e7eb' },
        ticks: { color: '#6b7280' },
      },
      y: {
        beginAtZero: true,
        grid: { color: '#e5e7eb' },
        ticks: { color: '#6b7280' },
      },
    },
  }), []);

  if (!mounted) return null;

  return (
    <div className="w-full h-[400px]">
      <Line data={data} options={options} />
    </div>
  );
};

export default Chart;
