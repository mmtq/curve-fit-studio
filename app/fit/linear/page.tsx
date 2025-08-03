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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

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
    <main className="p-6 max-w-3xl mx-auto space-y-6 text-foreground">
      <h1 className="text-2xl font-semibold">Linear Curve Fit</h1>

      <Card>
        <CardContent className="p-4">
          <table className="w-full border-separate border-spacing-y-2 text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="text-left">X</th>
                <th className="text-left">Y</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {points.map(([x, y], i) => (
                <tr key={i}>
                  <td>
                    <Input
                      type="number"
                      value={x}
                      onChange={e => handlePointChange(i, +e.target.value, y)}
                      className="w-full"
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      value={y}
                      onChange={e => handlePointChange(i, x, +e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td>
                    <Button
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => removePoint(i)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4">
            <Button onClick={addPoint} variant="default">
              Add Point
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-medium mb-1">Fitted Equation</h2>
        <p className="font-mono text-muted-foreground">
          y = {slope.toFixed(2)}x + {intercept.toFixed(2)}
        </p>
      </div>

      <div>
        <h3 className="font-semibold mb-1">Error Metrics</h3>
        <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
          <li>RMSE: {rmse.toFixed(4)}</li>
          <li>R²: {r2.toFixed(4)}</li>
        </ul>
      </div>

      <Card>
        <CardContent className="p-4">
          <Line
            ref={chartRef}
            data={{
              labels: xVals,
              datasets: [
                {
                  label: 'Data Points',
                  data: points.map(([x, y]) => ({ x, y })),
                  borderColor: 'hsl(180, 70%, 50%)',
                  backgroundColor: 'hsl(180, 70%, 80%)',
                  showLine: false,
                },
                {
                  label: 'Fitted Line',
                  data: fitX.map((x, i) => ({ x, y: fitY[i] })),
                  borderColor: 'hsl(340, 70%, 50%)',
                  backgroundColor: 'hsl(340, 70%, 80%)',
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
        </CardContent>
      </Card>

      <div>
        <Button onClick={downloadPlot} variant="default" className="bg-green-600 hover:bg-green-700">
          Download Plot
        </Button>
      </div>
    </main>
  );
}
