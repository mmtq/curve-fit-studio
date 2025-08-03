'use client';

import { useEffect, useState } from 'react';
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
import { X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend);

function exponentialFit(points: [number, number][]): { params: [number, number] | null; error: string | null } {
  // Filter points with positive x and y, otherwise log error
  const filtered = points.filter(([x, y]) => x > 0 && y > 0);

  if (filtered.length === 0) {
    return { params: null, error: "No points with positive x and y for exponential fit." };
  }

  if (filtered.length < 2) {
    return { params: null, error: "At least two valid points are required." };
  }

  try {
    const n = filtered.length;
    const sumX = filtered.reduce((acc, [x]) => acc + x, 0);
    const sumLnY = filtered.reduce((acc, [, y]) => acc + Math.log(y), 0);
    const sumX2 = filtered.reduce((acc, [x]) => acc + x * x, 0);
    const sumXLnY = filtered.reduce((acc, [x, y]) => acc + x * Math.log(y), 0);

    const denominator = n * sumX2 - sumX ** 2;
    if (denominator === 0) {
      return { params: null, error: "Denominator is zero, can't compute fit (check data points)." };
    }

    const a = (sumLnY * sumX2 - sumX * sumXLnY) / denominator;
    const b = (n * sumXLnY - sumX * sumLnY) / denominator;
    const A = Math.exp(a);

    if (!isFinite(A) || !isFinite(b)) {
      return { params: null, error: "Computed parameters are not finite numbers." };
    }

    return { params: [A, b], error: null };
  } catch (e: any) {
    return { params: null, error: e?.message || "Unknown error during exponential fitting." };
  }
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
  const [xVal, setXVal] = useState('');
  const [yVal, setYVal] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { params, error: fitError } = exponentialFit(points);

  // Update error state if fitting error changes
  useEffect(() => {
    setError(fitError);
  }, [fitError]);

  const xVals = points.map(p => p[0]);
  const minX = Math.min(...xVals);
  const maxX = Math.max(...xVals);
  const fitX = Array.from({ length: 100 }, (_, i) => minX + (i * (maxX - minX)) / 99);
  const fitY = params ? fitX.map(x => evaluateExp(params, x)) : [];

  const { rmse, r2 } = params ? getErrorMetrics(points, params) : { rmse: NaN, r2: NaN };

  // Add new points handler
  const handleAddPoint = () => {
    const x = parseFloat(xVal);
    const y = parseFloat(yVal);
    if (!isNaN(x) && !isNaN(y)) {
      setPoints([...points, [x, y]]);
      setXVal('');
      setYVal('');
    }
  };

  const removePoint = (i: number) => setPoints(points.filter((_, idx) => idx !== i));

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
    <main className="p-8 max-w-5xl mx-auto space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
          Exponential Curve Fit
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Enter your data points below to visualize and evaluate an exponential regression fit.
        </p>
      </div>

      <Card className="border-dashed border-2 border-border bg-background">
        <CardHeader>
          <CardTitle className="text-xl text-center">Add Data Points</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mb-4">
            <Input
              type="text"
              value={xVal}
              onChange={(e) => setXVal(e.target.value)}
              placeholder="X value"
              className="sm:w-40"
            />
            <Input
              type="text"
              value={yVal}
              onChange={(e) => setYVal(e.target.value)}
              placeholder="Y value"
              className="sm:w-40"
            />
            <Button onClick={handleAddPoint} className="px-6">
              Add
            </Button>
          </div>

          {points.length > 0 && (
            <div className="flex flex-wrap gap-3 justify-center">
              {points.map(([x, y], idx) => (
                <div
                  key={idx}
                  className="relative bg-accent text-accent-foreground rounded-xl px-4 py-2 shadow flex items-center text-sm font-mono border border-border"
                >
                  <button
                    onClick={() => removePoint(idx)}
                    className="absolute -top-2 -left-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center hover:opacity-80"
                  >
                    <X size={12} />
                  </button>
                  ({x}, {y})
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      {
        fitError && (
          <Card className="border-dashed bg-background border-destructive">
            <CardContent>
              <p className="font-mono text-sm select-text">{fitError}</p>
            </CardContent>
          </Card>
        )
      }

      <div className="grid sm:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fitted Equation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-lg select-text">
              y = {params?.[0].toFixed(3)} * exp({params?.[1].toFixed(3)} * x)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Error Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li><b>RMSE:</b> {rmse.toFixed(4)}</li>
              <li><b>R²:</b> {r2.toFixed(4)}</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <Line
            data={{
              labels: xVals,
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
        </CardContent>
      </Card>

      <div className="text-center">
        <Button
          onClick={downloadPlot}
          className="mt-4"
        >
          Download Plot
        </Button>
      </div>
    </main>
  );
}
