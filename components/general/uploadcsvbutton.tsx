'use client';

import { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud } from 'lucide-react';

interface CSVUploaderProps {
  onPoints: (points: [number, number][]) => void;
}

export default function CSVUploader({ onPoints }: CSVUploaderProps) {
  const formRef = useRef<HTMLFormElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        const lines = text.split('\n').filter(Boolean);
        const result: [number, number][] = [];

        let startIndex = 0;

        // Check if first line is a header (non-numeric x or y)
        const [firstX, firstY] = lines[0].trim().split(',');
        if (isNaN(parseFloat(firstX)) || isNaN(parseFloat(firstY))) {
          startIndex = 1;
        }

        for (let i = startIndex; i < lines.length; i++) {
          const [xStr, yStr] = lines[i].trim().split(',');
          const x = parseFloat(xStr);
          const y = parseFloat(yStr);
          if (!isNaN(x) && !isNaN(y)) {
            result.push([x, y]);
          }
        }

        onPoints(result);
      };

      reader.readAsText(file);
    } catch (error) {
      console.error('Error reading CSV file:', error);
    }
  }

  return (
    <form ref={formRef} className="border border-dotted border-muted-foreground/10 p-2 rounded min-w-[150px]">
      <Label htmlFor="csv-upload" className="flex items-center gap-2 cursor-pointer">
        <UploadCloud className="w-5 h-5" />
        Upload CSV File
      </Label>
      <Input
        type="file"
        name="file"
        id="csv-upload"
        accept=".csv"
        className="cursor-pointer hidden"
        onChange={handleFileChange}
      />
    </form>
  );
}
