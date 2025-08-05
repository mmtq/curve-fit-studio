'use client';

import { useEffect, useState } from 'react';
import { useInputPoints } from '@/providers/InputPointsContext';
import { polyFit } from '@/actions/algorithm-action';
import DataPointsInput from '../general/datapoints-input';
import VisualizationCard from '../general/visualization-card';
import ErrorCard from '../general/error-card';
import EquationErrorMetricesCard from '../general/eq-er-metrices';

export default function PolynomialFitCard() {
    const { points, setPoints } = useInputPoints();
    const [error, setError] = useState<string | null>(null);
    const [degree, setDegree] = useState(2);
    const { fitX, fitY, rmse, r2, error: fitError, equation } = polyFit(points, degree);

    useEffect(() => {
        setError(fitError || '');
        console.log('fitError', fitError);
    }, [fitError]);

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

            <DataPointsInput degree={degree} setDegree={setDegree} />

            {error && (
                <ErrorCard error={error} />
            )}
            <EquationErrorMetricesCard equation={equation} rmse={rmse} r2={r2} />

            <VisualizationCard fitX={fitX} fitY={fitY} points={points} filename={`polynomial-${degree}`} algoname="polynomial" />
        </main>
    );
}