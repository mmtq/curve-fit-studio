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
      <h1 className="text-5xl font-extrabold mb-6 text-center">CurveFit Visualizer</h1>
      <p className="text-gray-700 mb-12 text-center max-w-3xl mx-auto text-lg">
        Input your data points and explore how different curve fitting algorithms model your data.
        Choose between Linear, Polynomial, Exponential, and Power fits to best match your needs.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {algoCards.map(({ title, href, description, icon }) => (
          <Link
            key={href}
            href={href}
            className="group block border border-gray-300 rounded-xl p-6 hover:shadow-lg hover:border-blue-500 transition-shadow transition-colors duration-300 bg-white dark:bg-gray-800 dark:border-gray-700"
          >
            <div className="flex items-center space-x-4 mb-3">
              <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-2 group-hover:bg-blue-100 group-hover:dark:bg-blue-900 transition-colors duration-300">
                {icon}
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors duration-300">
                {title}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">{description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
