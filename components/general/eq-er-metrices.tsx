'use client';

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface Props {
    equation: string;
    rmse: number;
    r2: number;
}

const EquationErrorMetricesCard = ({ equation, rmse, r2 }: Props) => {
    return (
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

    );
};

export default EquationErrorMetricesCard;