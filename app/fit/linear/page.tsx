'use client';

import { useState, useEffect } from 'react';
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
import { Download, X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Chart from '@/components/general/chart';
import { GetCode } from '@/components/general/get-code';

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend);

function linearFit(points: [number, number][]) {
  const n = points.length;
  if (n < 2) {
    return { slope: NaN, intercept: NaN, rmse: NaN, r2: NaN, error: 'At least two points are required for linear fit.' };
  }

  const sumX = points.reduce((acc, [x]) => acc + x, 0);
  const sumY = points.reduce((acc, [, y]) => acc + y, 0);
  const sumXY = points.reduce((acc, [x, y]) => acc + x * y, 0);
  const sumX2 = points.reduce((acc, [x]) => acc + x * x, 0);

  const denominator = n * sumX2 - sumX ** 2;
  if (denominator === 0) {
    return { slope: NaN, intercept: NaN, rmse: NaN, r2: NaN, error: 'Denominator zero, cannot compute fit (check points).' };
  }

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  const residuals = points.map(([x, y]) => y - (slope * x + intercept));
  const mse = residuals.reduce((acc, r) => acc + r * r, 0) / n;
  const rmse = Math.sqrt(mse);
  const yMean = sumY / n;
  const ssTot = points.reduce((acc, [, y]) => acc + (y - yMean) ** 2, 0);
  const ssRes = residuals.reduce((acc, r) => acc + r ** 2, 0);
  const r2 = 1 - ssRes / ssTot;

  return { slope, intercept, rmse, r2, error: null };
}

export default function LinearFitPage() {
  const [points, setPoints] = useState<[number, number][]>([
    [1, 2],
    [2, 3],
    [3, 5],
  ]);
  const [xVal, setXVal] = useState<string>('');
  const [yVal, setYVal] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const removePoint = (i: number) => setPoints(points.filter((_, idx) => idx !== i));

  const { slope, intercept, rmse, r2, error: fitError } = linearFit(points);

  useEffect(() => {
    setError(fitError);
  }, [fitError]);

  const xVals = points.map(p => p[0]);
  const minX = Math.min(...xVals);
  const maxX = Math.max(...xVals);
  const fitX = [minX, maxX];
  const fitY = (!isNaN(slope) && !isNaN(intercept)) ? fitX.map(x => slope * x + intercept) : [];

  const downloadPlot = async () => {
    const chartCanvas = document.querySelector('canvas');
    if (!chartCanvas) return;
    try {
      const dataUrl = await domtoimage.toPng(chartCanvas as HTMLElement);
      const link = document.createElement('a');
      link.download = 'linear-fit-plot.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleAddPoint = () => {
    const x = parseFloat(xVal);
    const y = parseFloat(yVal);
    if (!isNaN(x) && !isNaN(y)) {
      setPoints([...points, [x, y]]);
      setXVal('');
      setYVal('');
    }
  };

  return (
    <main className="p-8 max-w-5xl mx-auto space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
          Linear Curve Fit
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Enter your data points below to visualize and evaluate a linear regression fit.
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
              y = {isNaN(slope) ? 'NaN' : slope.toFixed(3)}x + {isNaN(intercept) ? 'NaN' : intercept.toFixed(3)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Error Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li><b>RMSE:</b> {isNaN(rmse) ? 'NaN' : rmse.toFixed(4)}</li>
              <li><b>R²:</b> {isNaN(r2) ? 'NaN' : r2.toFixed(4)}</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className='flex items-center justify-between'>
              <div>Visualization</div>
              <div className='flex items-center gap-2'>
                <Button onClick={downloadPlot} variant={'outline'}>
                  <Download /> Download Plot
                </Button>
                <GetCode points={points} name='linear' />
              </div>
            </div>
          </CardTitle>

        </CardHeader>
        <CardContent className="relative">
          <Chart
            fitX={fitX}
            fitY={fitY}
            points={points}
          />
        </CardContent>
      </Card>
    </main>
  );
}
