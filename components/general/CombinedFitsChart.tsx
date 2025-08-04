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
  CategoryScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Props {
  points: [number, number][];
  fits: {
    name: string;
    fitX: number[];
    fitY: number[];
    color: string;
    visible: boolean;
  }[];
}

export default function CombinedFitsChart({ points, fits }: Props) {
  const datasets = [
    {
      label: 'Data Points',
      data: points.map(([x, y]) => ({ x, y })),
      backgroundColor: '#000',
      borderColor: '#000',
      showLine: false,
      pointRadius: 5,
      pointHoverRadius: 6,
    },
    ...fits
      .filter(f => f.visible && f.fitX.length === f.fitY.length)
      .map(fit => ({
        label: `${fit.name} Fit`,
        data: fit.fitX.map((x, i) => ({ x, y: fit.fitY[i] })),
        borderColor: fit.color,
        borderWidth: 2,
        tension: 0.25,
        fill: false,
        pointRadius: 0,
      })),
  ];

  const data = { datasets };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: {
        display: false,
        text: 'Comparison of Curve Fits',
      },
    },
    scales: {
      x: {
        type: 'linear' as const,
        position: 'bottom' as const,
        title: {
          display: true,
          text: 'X',
        },
      },
      y: {
        type: 'linear' as const,
        title: {
          display: true,
          text: 'Y',
        },
      },
    },
  };

  return <Line data={data} options={options} />;
}
