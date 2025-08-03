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
import { inv, multiply, transpose } from 'mathjs';
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
import { Label } from '@/components/ui/label';
import Chart from '@/components/general/chart';
import { GetCode } from '@/components/general/get-code';

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend);

function polyFit(points: [number, number][], degree: number): { coeffs: number[] | null; error: string | null } {
  if (points.length === 0) {
    return { coeffs: null, error: "No data points provided." };
  }
  if (degree < 1) {
    return { coeffs: null, error: "Degree must be at least 1." };
  }
  if (degree >= points.length) {
    return { coeffs: null, error: "Degree must be less than number of points." };
  }

  try {
    const X = points.map(([x]) => Array.from({ length: degree + 1 }, (_, i) => x ** i));
    const Y = points.map(([, y]) => [y]);
    const Xt = transpose(X);
    const XtX = multiply(Xt, X);

    // Check if XtX is invertible by determinant (optional, but mathjs doesn't have det for matrices, so catch error instead)
    // Alternatively, try-catch covers inversion failure.

    const XtY = multiply(Xt, Y);
    const coeffsMatrix = multiply(inv(XtX), XtY);
    const coeffs = coeffsMatrix.map(c => c[0]);
    return { coeffs, error: null };
  } catch (e: any) {
    return { coeffs: null, error: e?.message || "An unknown error occurred in polynomial fitting." };
  }
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
  const [xVal, setXVal] = useState('');
  const [yVal, setYVal] = useState('');
  const [error, setError] = useState('');

  const coeffsResult = polyFit(points, degree);
  const { coeffs, error: fitError } = coeffsResult;
  const { rmse, r2 } = coeffs ? getErrorMetrics(points, coeffs) : { rmse: 0, r2: 0 };
  const xVals = points.map(p => p[0]);
  const minX = Math.min(...xVals);
  const maxX = Math.max(...xVals);
  const fitX = Array.from({ length: 100 }, (_, i) => minX + (i * (maxX - minX)) / 99);
  const fitY = coeffs ? fitX.map(x => evaluatePoly(coeffs, x)) : [];

  useEffect(() => {
    setError(fitError || '');
    console.log('fitError', fitError);
  }, [fitError]);



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
      link.download = 'polynomial-fit-plot.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <main className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
          Polynomial Curve Fit
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Enter your data points and select the polynomial degree to fit and visualize the curve.
        </p>
      </div>

      <Card className="border-dashed border-2 border-border bg-background">
        <CardHeader>
          <CardTitle className="text-xl text-center">Add Data Points</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-center gap-4 mb-4'>
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
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
            <div className='flex items-center gap-2'>
              <Label>Degree</Label>
              <Input
                type="number"
                min={1}
                max={10}
                placeholder='Degree'
                value={degree}
                onChange={e => setDegree(Number(e.target.value))}
                className="w-32"
              />
            </div>
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
            <p className="font-mono text-sm select-text">
              y = {coeffs ? coeffs.map((c, i) => `${c.toFixed(2)}x^${i}`).join(' + ') : 'N/A'}
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
          <CardTitle>
            <div className='flex items-center justify-between'>
              <div>Visualization</div>
              <div className='flex items-center gap-2'>
                <Button onClick={downloadPlot} variant={'outline'}>
                  <Download /> Download Plot
                </Button>
                <GetCode points={points} name='polynomial' degree={degree} />
              </div>
            </div>
          </CardTitle>

        </CardHeader>
        <CardContent>
          <Chart fitX={fitX} fitY={fitY} points={points} />
        </CardContent>
      </Card>

      <div className="text-center">
        <Button onClick={downloadPlot} className="mt-4">
          Download Plot
        </Button>
      </div>
    </main>
  );
}