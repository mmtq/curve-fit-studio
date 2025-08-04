'use client';

import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Chart from '@/components/general/chart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { evaluatePoly, getPolyErrorMetrics, polyFit } from '@/actions/fit-action';

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend);

export default function InterpolationPage() {
  const [points, setPoints] = useState<[number, number][]>([
    [1, 2],
    [2, 5],
    [3, 10],
  ]);
  const [xVal, setXVal] = useState('');
  const [yVal, setYVal] = useState('');
  const [error, setError] = useState('');

  const degree = points.length - 1;

  const coeffsResult = polyFit(points, degree);
  const { coeffs, error: fitError } = coeffsResult;
  const { rmse, r2 } = coeffs ? getPolyErrorMetrics(points, coeffs) : { rmse: 0, r2: 0 };

  const xVals = points.map(([x]) => x);
  const minX = Math.min(...xVals);
  const maxX = Math.max(...xVals);
  const fitX = Array.from({ length: 100 }, (_, i) => minX + ((maxX - minX) * i) / 99);
  const fitY = coeffs ? fitX.map((x) => evaluatePoly(coeffs, x)) : [];

  useEffect(() => {
    setError(fitError || '');
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

  const removePoint = (index: number) => {
    setPoints(points.filter((_, i) => i !== index));
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Polynomial Interpolation</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Enter or upload data points and visualize the interpolated curve using a polynomial of degree n−1.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Data Points</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Input
              type="number"
              value={xVal}
              onChange={(e) => setXVal(e.target.value)}
              placeholder="X"
              className="w-24"
            />
            <Input
              type="number"
              value={yVal}
              onChange={(e) => setYVal(e.target.value)}
              placeholder="Y"
              className="w-24"
            />
            <Button onClick={handleAddPoint}>Add Point</Button>
            {/* <Input
              type="file"
              accept=".csv"
            //   onChange={handleFile}
              className="w-fit text-sm"
            /> */}
          </div>

          {points.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {points.map(([x, y], i) => (
                <div
                  key={i}
                  className="bg-muted border border-border text-muted-foreground px-3 py-1 rounded-md relative font-mono text-sm"
                >
                  ({x}, {y})
                  <button
                    onClick={() => removePoint(i)}
                    className="absolute top-0 right-1 text-xs text-destructive hover:underline"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {error && (
        <Card className="bg-destructive/10 border border-destructive">
          <CardContent>
            <p className="text-sm font-mono text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {coeffs && (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Interpolation Equation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-mono text-sm">
                  y = {coeffs.map((c, i) => `${c.toFixed(2)}x^${i}`).join(' + ')}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Error Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm list-disc pl-5 space-y-1">
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
              <Chart points={points} fitX={fitX} fitY={fitY} />
            </CardContent>
          </Card>
        </>
      )}
    </main>
  );
}
