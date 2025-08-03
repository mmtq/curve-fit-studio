import Algos from "@/components/general/algos";
import FeaturesSection from "@/components/general/features";
import { motion } from 'framer-motion';

import Link from "next/link";
import { FaChartLine, FaProjectDiagram, FaChartArea, FaBolt } from "react-icons/fa";

const algoCards = [
  {
    title: "Linear Fit",
    href: "/fit/linear",
    description: "Fit your data with a straight line using Least Squares Method.",
    icon: <FaChartLine className="text-blue-500 w-8 h-8" />,
  },
  {
    title: "Polynomial Fit",
    href: "/fit/polynomial",
    description: "Model complex curves by fitting polynomials of variable degree.",
    icon: <FaProjectDiagram className="text-purple-500 w-8 h-8" />,
  },
  {
    title: "Exponential Fit",
    href: "/fit/exponential",
    description: "Capture growth or decay trends with exponential functions.",
    icon: <FaChartArea className="text-green-500 w-8 h-8" />,
  },
  {
    title: "Power Fit",
    href: "/fit/power",
    description: "Model relationships with power functions to fit nonlinear data.",
    icon: <FaBolt className="text-yellow-500 w-8 h-8" />,
  },
];

export default function HomePage() {
  return (
    <main className="p-8 max-w-4xl mx-auto">
      <Algos algoCards={algoCards} />
      <FeaturesSection />
    </main>
  );
}
