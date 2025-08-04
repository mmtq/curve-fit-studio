// app/fit/[algorithm]/page.tsx
"use client";

import { useState } from "react";
import * as math from "mathjs";

import { DataChart, Point } from "@/components/data-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Toaster, toast } from "sonner";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const algorithmConfig = {
  linear: {
    title: "Linear Fit",
    description: "Input your data to perform a linear fit analysis.",
    defaultData: "1, 2\n2, 4.1\n3, 5.9\n4, 8.2\n5, 10.1",
    defaultFunction: "2 * x",
  },
  polynomial: {
    title: "Polynomial Fit",
    description: "Input your data to perform a polynomial fit analysis.",
    defaultData: "1, 2\n2, 5\n3, 10\n4, 17\n5, 26",
    defaultFunction: "x^2 + 1",
  },
  exponential: {
    title: "Exponential Fit",
    description: "Input your data to perform an exponential fit analysis.",
    defaultData: "0, 1\n1, 2.7\n2, 7.4\n3, 20.1\n4, 54.6",
    defaultFunction: "exp(x)",
  },
  power: {
    title: "Power Fit",
    description: "Input your data to perform a power fit analysis.",
    defaultData: "1, 3\n2, 12\n3, 27\n4, 48\n5, 75",
    defaultFunction: "3 * x^2",
  },
  default: {
    title: "Unknown Algorithm",
    description: "Please select a valid fitting algorithm.",
    defaultData: "1,1\n2,2",
    defaultFunction: "x",
  },
};

export default function FitPage({ params }: { params: { algorithm: string } }) {
  const config = algorithmConfig[params.algorithm as keyof typeof algorithmConfig] || algorithmConfig.default;

  const [dataInput, setDataInput] = useState<string>(config.defaultData);
  const [funcInput, setFuncInput] = useState<string>(config.defaultFunction);
  
  // Helper function to avoid repetition.
  function parseData(input: string): Point[] {
    const points: Point[] = [];
    const lines = input.trim().split("\n");
    for (const line of lines) {
      const parts = line.split(/[\s,]+/);
      if (parts.length === 2) {
        const x = parseFloat(parts[0]);
        const y = parseFloat(parts[1]);
        if (!isNaN(x) && !isNaN(y)) {
          points.push({ x, y });
        }
      }
    }
    return points;
  };
  
  const [scatterData, setScatterData] = useState<Point[]>(() => parseData(config.defaultData));
  const [lineData, setLineData] = useState<Point[]>([]);

  const generateLineData = (func: string, dataPoints: Point[]): Point[] => {
    if (dataPoints.length < 2) return [];
    const node = math.parse(func);
    const code = node.compile();
    const xValues = dataPoints.map(p => p.x).sort((a, b) => a - b);
    const minX = xValues[0];
    const maxX = xValues[xValues.length - 1];
    const linePoints: Point[] = [];
    for (let i = 0; i <= 100; i++) {
      const x = minX + (i / 100) * (maxX - minX);
      const y = code.evaluate({ x: x });
      linePoints.push({ x, y });
    }
    return linePoints;
  };

  const handlePlotData = () => {
    try {
      const parsedScatterData = parseData(dataInput);
      if (parsedScatterData.length === 0) {
        toast.error("Invalid Data Format", { description: "Please enter data as 'x, y' on each line." });
        return;
      }
      setScatterData(parsedScatterData);
      const generatedLineData = generateLineData(funcInput, parsedScatterData);
      setLineData(generatedLineData);
      toast.success("Chart updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Plotting Error", { description: error instanceof Error ? error.message : "Could not evaluate the function." });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setDataInput(text);
      toast.success(`${file.name} loaded successfully!`, { description: "Click 'Plot Data' to visualize." });
    };
    reader.onerror = () => { toast.error("Failed to read the file."); }
    reader.readAsText(file);
  };

  return (
    <main className="container mx-auto p-4 md:p-8">
      <Toaster richColors />
      <div className="relative text-center mb-8">
        <Link href="/" className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft size={16} />
            Back
        </Link>
        <h1 className="text-4xl font-bold">{config.title}</h1>
        <p className="text-muted-foreground">{config.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Controls</CardTitle>
              <CardDescription>Enter your data and function to plot.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="data-points">Data Points</Label>
                {/* FIX: Corrected typo from e.targe to e.target */}
                <Textarea id="data-points" placeholder="Paste your data here..." rows={8} value={dataInput} onChange={(e) => setDataInput(e.target.value)} />
              </div>
              <div className="text-center text-sm text-muted-foreground">OR</div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="file-upload">Upload a File (.csv or .txt)</Label>
                <Input id="file-upload" type="file" accept=".csv,.txt" onChange={handleFileChange} className="cursor-pointer file:text-sm file:font-medium file:text-primary-foreground file:bg-primary hover:file:bg-primary/90 file:h-10 file:px-4" />
              </div>
              <div className="grid w-full items-center gap-2 pt-4">
                <Label htmlFor="function">Function f(x)</Label>
                {/* FIX: Corrected typo from e.targe to e.target */}
                <Input id="function" type="text" placeholder="e.g. 2 * x + 1" value={funcInput} onChange={(e) => setFuncInput(e.target.value)} />
              </div>
              <Button onClick={handlePlotData} className="w-full !mt-6">Plot Data</Button>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardContent className="pt-6">
              <DataChart scatterData={scatterData} lineData={lineData} lineLabel={funcInput} />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}