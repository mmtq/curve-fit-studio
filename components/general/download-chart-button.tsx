'use client';

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import domtoimage from "dom-to-image";
import { useTransition } from "react";
import { FaSpinner } from "react-icons/fa";

interface DownloadChartButtonProps {
  selector: string;           // CSS selector for the chart container or canvas
  filename?: string;          // File name for download
  variant?: "default" | "outline" | "secondary"; // Extend as needed
}

export const DownloadChartButton = ({
  selector,
  filename = "chart.png",
  variant = "outline",
}: DownloadChartButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const handleDownload = () => {
    startTransition(async () => {
      const target = document.querySelector(selector);
      if (!target) return console.error("Chart element not found!");

      try {
        const dataUrl = await domtoimage.toPng(target as HTMLElement);
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = filename;
        link.click();
      } catch (err) {
        console.error("Download failed:", err);
      }
    });
  };

  return (
    <Button onClick={handleDownload} variant={variant}>
      <Download className="mr-2 h-4 w-4" />
      {isPending ? <FaSpinner className="animate-spin" /> : "Download Plot"}
    </Button>
  );
};
