'use client';
import { useEffect, useRef } from "react";
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


export default function AnimatedCurveGraph() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const data = {
    labels: Array.from({ length: 50 }, (_, i) => i),
    datasets: [
      {
        label: "Fitted Curve",
        data: Array.from({ length: 50 }, (_, i) => 0.01 * i * i + 2),
        borderColor: "rgba(234, 88, 12, 1)",
        backgroundColor: "rgba(234, 88, 12, 0.2)",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: { display: false },
      y: { display: false },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  return (
    <div
    >
        <img src="https://cdn.comsol.com/wordpress/sites/1/2021/07/raw-data-curve-fitting.png" alt="" />
    </div>
  );
}
