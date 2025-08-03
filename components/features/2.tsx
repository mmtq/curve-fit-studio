'use client';
import { useEffect, useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import { motion, useInView } from "framer-motion";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Tooltip,
  CategoryScale, // ✅ ADD THIS
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Tooltip,
  CategoryScale // ✅ REGISTER THIS
);

export default function AnimatedLiveChart() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [points, setPoints] = useState<number[]>([]);

  useEffect(() => {
    if (!isInView) return;
    let i = 0;
    const interval = setInterval(() => {
      setPoints(prev => [...prev, 10 * Math.log(i + 1)]);
      i++;
      if (i > 49) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <div>
        <img src="../../public/live.gif" alt="" />
    </div>
  );
}
