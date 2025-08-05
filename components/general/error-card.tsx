'use client';

import { Card, CardContent } from "../ui/card";

interface Props {
    error: string
}

const ErrorCard = ({ error }: Props) => {
    return (
        <Card className="border-dashed bg-background border-destructive">
            <CardContent>
                <p className="font-mono text-sm select-text">{error}</p>
            </CardContent>
        </Card>
    );
};

export default ErrorCard;