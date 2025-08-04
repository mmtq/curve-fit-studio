'use client';

import { Line } from "react-chartjs-2";

interface Props {
    fitX: number[];
    fitY: number[];
    points: number[][];
}

const Chart = ({ fitX, fitY, points }: Props) => {
    return (
        <Line className="w-full"
            // ref={chartRef}
            data={{
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
            }}
            options={{
                responsive: true,
                interaction: {
                    mode: 'nearest',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#374151',
                            font: { weight: 'bold' },
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
            }}
        />

    );
};

export default Chart;