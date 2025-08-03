/* --- File: app/fit/linear/page.tsx --- */
'use client';

import { useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import html2canvas from 'html2canvas';

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend);

function linearFit(points: [number, number][]) {
  const n = points.length;
  const sumX = points.reduce((acc, [x]) => acc + x, 0);
  const sumY = points.reduce((acc, [, y]) => acc + y, 0);
  const sumXY = points.reduce((acc, [x, y]) => acc + x * y, 0);
  const sumX2 = points.reduce((acc, [x]) => acc + x * x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);
  const intercept = (sumY - slope * sumX) / n;

  const residuals = points.map(([x, y]) => y - (slope * x + intercept));
  const mse = residuals.reduce((acc, r) => acc + r * r, 0) / n;
  const rmse = Math.sqrt(mse);
  const yMean = sumY / n;
  const ssTot = points.reduce((acc, [, y]) => acc + (y - yMean) ** 2, 0);
  const ssRes = residuals.reduce((acc, r) => acc + r ** 2, 0);
  const r2 = 1 - ssRes / ssTot;

  return { slope, intercept, rmse, r2 };
}

export default function LinearFitPage() {
  const [points, setPoints] = useState<[number, number][]>([
    [1, 2],
    [2, 3],
    [3, 5],
  ]);

  const chartRef = useRef(null);

  const handlePointChange = (i: number, x: number, y: number) => {
    const updated = [...points];
    updated[i] = [x, y];
    setPoints(updated);
  };

  const addPoint = () => setPoints([...points, [0, 0]]);
  const removePoint = (i: number) => setPoints(points.filter((_, idx) => idx !== i));

  const { slope, intercept, rmse, r2 } = linearFit(points);
  const xVals = points.map(p => p[0]);
  const minX = Math.min(...xVals);
  const maxX = Math.max(...xVals);
  const fitX = [minX, maxX];
  const fitY = fitX.map(x => slope * x + intercept);

  const downloadPlot = async () => {
    const chartCanvas = document.querySelector('canvas');
    if (!chartCanvas) return;
    const canvas = await html2canvas(chartCanvas);
    const link = document.createElement('a');
    link.download = 'linear-fit-plot.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Linear Curve Fit</h1>

      <table className="w-full mb-4">
        <thead>
          <tr><th>X</th><th>Y</th><th></th></tr>
        </thead>
        <tbody>
          {points.map(([x, y], i) => (
            <tr key={i}>
              <td><input type="number" value={x} onChange={e => handlePointChange(i, +e.target.value, y)} /></td>
              <td><input type="number" value={y} onChange={e => handlePointChange(i, x, +e.target.value)} /></td>
              <td><button onClick={() => removePoint(i)} className="text-red-500">Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addPoint} className="bg-blue-500 text-white px-4 py-2 rounded">Add Point</button>

      <h2 className="mt-6 mb-2 text-lg">Fitted Equation</h2>
      <p className="font-mono">y = {slope.toFixed(2)}x + {intercept.toFixed(2)}</p>

      <h3 className="mt-4">Error Metrics</h3>
      <ul className="list-disc pl-6">
        <li>RMSE: {rmse.toFixed(4)}</li>
        <li>R²: {r2.toFixed(4)}</li>
      </ul>

      <div className="mt-6">
        <Line
          ref={chartRef}
          data={{
            labels: xVals,
            datasets: [
              {
                label: 'Data Points',
                data: points.map(([x, y]) => ({ x, y })),
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.4)',
                showLine: false,
              },
              {
                label: 'Fitted Line',
                data: fitX.map((x, i) => ({ x, y: fitY[i] })),
                borderColor: 'rgba(255,99,132,1)',
                backgroundColor: 'rgba(255,99,132,0.4)',
                fill: false,
              },
            ],
          }}
          options={{
            responsive: true,
            scales: {
              x: { type: 'linear', position: 'bottom' },
              y: { beginAtZero: true },
            },
          }}
        />
      </div>

      <button
        onClick={downloadPlot}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        Download Plot
      </button>
    </main>
  );
}
