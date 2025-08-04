'use client';

import { useInputPoints } from '@/providers/InputPointsContext';
import { useMemo } from 'react';
import FitResultCard from '@/components/general/FitResultCard';
import CombinedFitsChart from '@/components/general/CombinedFitsChart';
import CSVUploader from '@/components/general/uploadcsvbutton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { linearFit, polyFit, powerFit, exponentialFit } from '@/actions/algorithm-action';

export default function CompareFitsPage() {
  const { points, setPoints } = useInputPoints();

  type FitKey = 'Linear' | 'Polynomial' | 'Exponential' | 'Power';

  const fits = useMemo(() => ({
    Linear: linearFit(points),
    Polynomial: polyFit(points, 2),
    Exponential: exponentialFit(points),
    Power: powerFit(points),
  }), [points]);

  const bestKey = useMemo(() => {
    return (Object.entries(fits) as [FitKey, typeof fits[FitKey]][]).reduce((best, [key, fit]) => {
      if (fit.error) return best;
      const current = fits[best as FitKey];
      return current.error || fit.r2 > current.r2 ? key : best;
    }, 'Linear' as FitKey);
  }, [fits]);

  const colorMap: Record<string, string> = {
    Linear: '#1d4ed8',
    Polynomial: '#10b981',
    Exponential: '#f97316',
    Power: '#8b5cf6',
  };

  const chartFits = Object.entries(fits).map(([name, fit]) => ({
    name,
    fitX: fit.fitX,
    fitY: fit.fitY,
    color: colorMap[name],
    visible: !fit.error,
  }));

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Compare Curve Fits</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Upload or enter data points and compare multiple curve fitting methods.
        </p>
      </div>

      <div className="flex justify-center">
        <CSVUploader onPoints={(pts) => setPoints(pts)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-center">All Fits Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <CombinedFitsChart points={points} fits={chartFits} />
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {Object.entries(fits).map(([name, fit]) => (
          <FitResultCard
            key={name}
            name={name}
            fit={fit}
            points={points}
            highlight={name === bestKey}
          />
        ))}
      </div>
    </main>
  );
}
