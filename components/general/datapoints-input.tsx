'use client';
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
import { useInputPoints } from '@/providers/InputPointsContext';
import { useState } from 'react';
import CSVUploader from './uploadcsvbutton';

interface Props {
    degree?: number
    setDegree?: (degree: number) => void
}

const DataPointsInput = ({ degree, setDegree }: Props) => {
    const { points, setPoints } = useInputPoints();
    const [xVal, setXVal] = useState('');
    const [yVal, setYVal] = useState('');

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

        <Card className="border-dashed border-2 border-border bg-background">
            <CardHeader>
                <CardTitle className="text-xl text-center">Add Data Points</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* Input & Upload Section */}
                <div className="flex flex-col items-center justify-center gap-6">
                    {/* Add Point Form */}
                    <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                        <div className='flex flex-row gap-4'>
                            <div className="space-y-2">
                                <Label htmlFor="x">X Value</Label>
                                <Input
                                    id="x"
                                    type="text"
                                    value={xVal}
                                    onChange={(e) => setXVal(e.target.value)}
                                    placeholder="X"
                                    className="sm:w-32"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="y">Y Value</Label>
                                <Input
                                    id="y"
                                    type="text"
                                    value={yVal}
                                    onChange={(e) => setYVal(e.target.value)}
                                    placeholder="Y"
                                    className="sm:w-32"
                                />
                            </div>
                        </div>
                        <Button onClick={handleAddPoint} className="mt-1 sm:mt-0 sm:self-end px-6">
                            Add Point
                        </Button>
                    </div>

                    {/* Degree and CSV Upload */}
                    <div className="flex justify-center sm:flex-row items-end gap-4">
                        {
                            degree && (
                                <div className="space-y-2">
                                    <Label htmlFor="degree">Degree</Label>
                                    <Input
                                        id="degree"
                                        type="number"
                                        value={degree}
                                        onChange={(e) => setDegree?.(parseInt(e.target.value))}
                                        placeholder="Degree"
                                        className="sm:w-32"
                                    />
                                </div>
                            )
                        }
                        <CSVUploader onPoints={(newPoints) => setPoints(newPoints)} />
                    </div>
                </div>

                {/* Data Points Display */}
                {points.length > 0 && (
                    <div className="flex flex-wrap gap-3 justify-center">
                        {points.map(([x, y], idx) => (
                            <div
                                key={idx}
                                className="relative bg-accent text-accent-foreground rounded-xl px-4 py-2 shadow text-sm font-mono border border-border"
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

    );
};

export default DataPointsInput;