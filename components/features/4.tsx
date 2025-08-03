'use client';
import { useState } from "react";
import { Download } from "lucide-react";

export function AnimatedDownloadIcon() {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 1000);
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Download plot"
      className="flex flex-col items-center justify-center w-full h-48 rounded-xl border border-border bg-muted hover:bg-green-600 hover:text-white transition-colors duration-300"
    >
      <Download
        size={48}
        className={`transition-transform duration-500 ${
          clicked ? "animate-bounce" : ""
        }`}
      />
      <span className="mt-4 text-lg font-semibold">Download Plot</span>
    </button>
  );
}
