/* --- File: app/fit/polynomial/page.tsx --- */
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
import { inv, multiply, transpose } from 'mathjs';
import html2canvas from 'html2canvas';

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend);

function polyFit(points: [number, number][], degree: number): number[] {
  const X = points.map(([x]) => Array.from({ length: degree + 1 }, (_, i) => x ** i));
  const Y = points.map(([, y]) => [y]);
  const Xt = transpose(X);
  const XtX = multiply(Xt, X);
  const XtY = multiply(Xt, Y);
  const coeffs = multiply(inv(XtX), XtY);
  return coeffs.map(c => c[0]);
}

function evaluatePoly(coeffs: number[], x: number): number {
  return coeffs.reduce((sum, c, i) => sum + c * x ** i, 0);
}

function getErrorMetrics(points: [number, number][], coeffs: number[]) {
  const residuals = points.map(([x, y]) => y - evaluatePoly(coeffs, x));
  const n = points.length;
  const mse = residuals.reduce((acc, r) => acc + r ** 2, 0) / n;
  const rmse = Math.sqrt(mse);
  const yMean = points.reduce((acc, [, y]) => acc + y, 0) / n;
  const ssTot = points.reduce((acc, [, y]) => acc + (y - yMean) ** 2, 0);
  const ssRes = residuals.reduce((acc, r) => acc + r ** 2, 0);
  const r2 = 1 - ssRes / ssTot;
  return { rmse, r2 };
}

export default function PolynomialFitPage() {
  const [points, setPoints] = useState<[number, number][]>([
    [1, 2],
    [2, 5],
    [3, 10],
  ]);
  const [degree, setDegree] = useState(2);

  const handlePointChange = (i: number, x: number, y: number) => {
    const updated = [...points];
    updated[i] = [x, y];
    setPoints(updated);
  };

  const addPoint = () => setPoints([...points, [0, 0]]);
  const removePoint = (i: number) => setPoints(points.filter((_, idx) => idx !== i));

  const coeffs = polyFit(points, degree);
  const { rmse, r2 } = getErrorMetrics(points, coeffs);
  const xVals = points.map(p => p[0]);
  const minX = Math.min(...xVals);
  const maxX = Math.max(...xVals);
  const fitX = Array.from({ length: 100 }, (_, i) => minX + (i * (maxX - minX)) / 99);
  const fitY = fitX.map(x => evaluatePoly(coeffs, x));

  const downloadPlot = async () => {
    const chartCanvas = document.querySelector('canvas');
    if (!chartCanvas) return;
    const canvas = await html2canvas(chartCanvas);
    const link = document.createElement('a');
    link.download = 'polynomial-fit-plot.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Polynomial Curve Fit</h1>

      <div className="mb-4">
        <label className="mr-2">Degree:</label>
        <input
          type="number"
          min={1}
          max={10}
          value={degree}
          onChange={e => setDegree(Number(e.target.value))}
          className="border px-2 py-1 rounded w-20"
        />
      </div>

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
        y = {
          coeffs.map((c, i) => `${c.toFixed(2)}x^${i}`).join(' + ')
        }
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
