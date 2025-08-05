'use client';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import Chart from './chart';
import { DownloadChartButton } from './download-chart-button';
import { GetCode } from './get-code';

interface Props {
    fitX: number[];
    fitY: number[];
    points: number[][];
    filename: string;
    algoname: string
}

const VisualizationCard = ({ fitX, fitY, points, filename, algoname }: Props) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <div className='flex items-center justify-between'>
                        <div>Visualization</div>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Chart
                    fitX={fitX}
                    fitY={fitY}
                    points={points}
                />
                <div className='flex items-center gap-2 mt-2 justify-center'>
                    <DownloadChartButton selector="canvas" filename={`${filename}.png`} />
                    <GetCode points={points} name={algoname} />
                </div>
            </CardContent>
        </Card>
    );
};

export default VisualizationCard;