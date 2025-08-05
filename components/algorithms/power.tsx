'use client';

import { useState, useEffect } from 'react';
import { useInputPoints } from '@/providers/InputPointsContext';
import { powerFit } from '@/actions/algorithm-action';
import DataPointsInput from '../general/datapoints-input';
import VisualizationCard from '../general/visualization-card';
import ErrorCard from '../general/error-card';
import EquationErrorMetricesCard from '../general/eq-er-metrices';

export default function PowerFitCard() {
    const { points, setPoints } = useInputPoints();
    const [error, setError] = useState<string | null>(null);

    const { fitX, fitY, rmse, r2, error: fitError, equation } = powerFit(points);

    useEffect(() => {
        setError(fitError);
    }, [fitError]);

    return (
        <main className="p-8 max-w-5xl mx-auto space-y-10">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
                    Power Curve Fit
                </h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Enter your data points below to visualize and evaluate a power regression fit.
                </p>
            </div>
            <DataPointsInput />
            {error && (
                <ErrorCard error={error} />
            )}
            <EquationErrorMetricesCard equation={equation} rmse={rmse} r2={r2} />
            <VisualizationCard fitX={fitX} fitY={fitY} points={points} filename="power-fit" algoname="Power Curve Fit" />
        </main>
    );
}
