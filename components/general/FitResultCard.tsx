'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    CategoryScale,
    ChartOptions
} from 'chart.js';
import { ExpandIcon } from 'lucide-react';
import Link from 'next/link';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

interface FitResultCardProps {
    name: string;
    points: [number, number][];
    fit: {
        fitX: number[];
        fitY: number[];
        rmse: number;
        r2: number;
        equation: string;
        error: string | null;
    };
    highlight?: boolean;
}

export default function FitResultCard({ name, points, fit, highlight }: FitResultCardProps) {
    const slug = name.toLowerCase().replace(' ', '-');

    const dataset = fit.error
        ? []
        : [
            {
                label: `${name} Fit`,
                data: fit.fitX.map((x, idx) => ({ x, y: fit.fitY[idx] })),
                borderColor: '#3b82f6',
                borderWidth: 2,
                pointRadius: 0,
            },
        ];

    const chartData = {
        datasets: [
            {
                label: 'Data Points',
                data: points.map(([x, y]) => ({ x, y })),
                backgroundColor: '#000',
                borderColor: '#000',
                pointRadius: 4,
                showLine: false,
            },
            ...dataset,
        ],
    };

const options: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'nearest',
    intersect: false,
  },
  scales: {
    x: {
      type: 'linear',
      position: 'bottom',
      grid: {
        color: '#e5e7eb',
      },
      ticks: {
        color: '#6b7280',
      },
      title: {
        display: true,
        text: 'X',
        color: '#374151',
      },
    },
    y: {
      grid: {
        color: '#e5e7eb',
      },
      ticks: {
        color: '#6b7280',
      },
      title: {
        display: true,
        text: 'Y',
        color: '#374151',
      },
    },
  },
  plugins: {
    legend: {
      display: true,
      position: 'bottom', // Now valid because the object is typed
      labels: {
        color: '#374151',
      },
    },
    tooltip: {
      mode: 'nearest',
      intersect: false,
    },
  },
};

    return (
        <Card className={highlight ? 'ring-2 ring-primary shadow-md' : ''}>
            <CardHeader>
                <CardTitle className="text-lg flex justify-between items-center">
                    {name} Fit
                    {highlight && <span className="text-xs text-primary">Best Fit</span>}
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
                {fit.error ? (
                    <p className="text-sm text-red-500 font-mono">{fit.error}</p>
                ) : (
                    <>
                        <div className="text-sm font-mono">{fit.equation}</div>
                        <ul className="text-sm space-y-1">
                            <li><b>RMSE:</b> {isNaN(fit.rmse) ? 'NaN' : fit.rmse.toFixed(4)}</li>
                            <li><b>R²:</b> {isNaN(fit.r2) ? 'NaN' : fit.r2.toFixed(4)}</li>
                        </ul>
                        <div className="h-[250px]">
                            <Line data={chartData} options={options} />
                        </div>
                        <Link href={`/fit/${slug}`} className='flex justify-end'>
                          <ExpandIcon className="w-4 h-4 " />
                        </Link>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
