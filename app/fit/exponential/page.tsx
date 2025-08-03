/* --- File: app/fit/exponential/page.tsx --- */
'use client';

import { useState } from 'react';
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
import domtoimage from 'dom-to-image';

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend);

function exponentialFit(points: [number, number][]): [number, number] {
  const filtered = points.filter(([x, y]) => x > 0 && y > 0);
  const n = filtered.length;
  const sumX = filtered.reduce((acc, [x]) => acc + x, 0);
  const sumLnY = filtered.reduce((acc, [, y]) => acc + Math.log(y), 0);
  const sumX2 = filtered.reduce((acc, [x]) => acc + x * x, 0);
  const sumXLnY = filtered.reduce((acc, [x, y]) => acc + x * Math.log(y), 0);

  const denominator = n * sumX2 - sumX ** 2;
  const a = (sumLnY * sumX2 - sumX * sumXLnY) / denominator;
  const b = (n * sumXLnY - sumX * sumLnY) / denominator;

  const A = Math.exp(a);
  return [A, b];
}

function evaluateExp([A, b]: [number, number], x: number): number {
  return A * Math.exp(b * x);
}

function getErrorMetrics(points: [number, number][], params: [number, number]) {
  const residuals = points.map(([x, y]) => y - evaluateExp(params, x));
  const n = points.length;
  const mse = residuals.reduce((acc, r) => acc + r ** 2, 0) / n;
  const rmse = Math.sqrt(mse);
  const yMean = points.reduce((acc, [, y]) => acc + y, 0) / n;
  const ssTot = points.reduce((acc, [, y]) => acc + (y - yMean) ** 2, 0);
  const ssRes = residuals.reduce((acc, r) => acc + r ** 2, 0);
  const r2 = 1 - ssRes / ssTot;
  return { rmse, r2 };
}

export default function ExponentialFitPage() {
  const [points, setPoints] = useState<[number, number][]>([
    [1, 2],
    [2, 4.1],
    [3, 9.2],
  ]);

  const handlePointChange = (i: number, x: number, y: number) => {
    const updated = [...points];
    updated[i] = [x, y];
    setPoints(updated);
  };

  const addPoint = () => setPoints([...points, [0, 0]]);
  const removePoint = (i: number) => setPoints(points.filter((_, idx) => idx !== i));

  const params = exponentialFit(points);
  const { rmse, r2 } = getErrorMetrics(points, params);
  const xVals = points.map(p => p[0]);
  const minX = Math.min(...xVals);
  const maxX = Math.max(...xVals);
  const fitX = Array.from({ length: 100 }, (_, i) => minX + (i * (maxX - minX)) / 99);
  const fitY = fitX.map(x => evaluateExp(params, x));

    const downloadPlot = async () => {
        const chartCanvas = document.querySelector('canvas');
        if (!chartCanvas) return;

        try {
            const dataUrl = await domtoimage.toPng(chartCanvas as HTMLElement);
            const link = document.createElement('a');
            link.download = 'exponential-fit-plot.png';
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Exponential Curve Fit</h1>

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
      <p className="font-mono whitespace-pre-wrap">
        y = {params[0].toFixed(3)} * exp({params[1].toFixed(3)} * x)
      </p>

      <h3 className="mt-4">Error Metrics</h3>
      <ul className="list-disc pl-6">
        <li>RMSE: {rmse.toFixed(4)}</li>
        <li>R²: {r2.toFixed(4)}</li>
      </ul>

      <div className="mt-6">
        <Line
          data={{
            labels: fitX,
            datasets: [
              {
                label: 'Data Points',
                data: points.map(([x, y]) => ({ x, y })),
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.4)',
                showLine: false,
              },
              {
                label: 'Fitted Curve',
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
