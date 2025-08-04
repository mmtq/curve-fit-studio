'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
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
import CSVUploader from '../general/uploadcsvbutton';
import { DownloadChartButton } from '../general/download-chart-button';
import { useInputPoints } from '@/providers/InputPointsContext';
import { polyFit } from '@/actions/algorithm-action';

export default function PolynomialFitCard() {
    const { points, setPoints } = useInputPoints();
    const [xVal, setXVal] = useState('');
    const [yVal, setYVal] = useState('');
    const [error, setError] = useState<string | null>(null);

    const [degree, setDegree] = useState(2);

    const { fitX, fitY, rmse, r2, error: fitError, equation } = polyFit(points, degree);


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
                            <div className='flex flex-col space-y-2'>
                                <div className='space-y-2'>
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
                                <CSVUploader onPoints={(newPoints) => setPoints(newPoints)} />
                            </div>
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
            {error && (
                <Card className="border-dashed bg-background border-destructive">
                    <CardContent>
                        <p className="font-mono text-sm select-text">{error}</p>
                    </CardContent>
                </Card>
            )}


            <div className="grid sm:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Fitted Equation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="font-mono text-lg select-text">{equation || 'No valid fit'}</p>
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
                                <DownloadChartButton selector="canvas" filename="polynomial-fit-plot.png" />
                                <GetCode points={points} name='polynomial' degree={degree} />
                            </div>
                        </div>
                    </CardTitle>

                </CardHeader>
                <CardContent>
                    <Chart fitX={fitX} fitY={fitY} points={points} />
                </CardContent>
            </Card>
        </main>
    );
}