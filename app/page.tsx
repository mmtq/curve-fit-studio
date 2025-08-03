import Link from "next/link";

const algoCards = [
  { title: "Linear Fit", href: "/fit/linear" },
  { title: "Polynomial Fit", href: "/fit/polynomial" },
  { title: "Exponential Fit", href: "/fit/exponential" },
  { title: "Power Fit", href: "/fit/power" },
];

export default function HomePage() {
  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">CurveFit Visualizer</h1>
      <p className="text-gray-600 mb-8">
        Input your data points and see how different models fit your curve: Linear, Polynomial, Exponential, and Power models supported.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {algoCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="block border p-4 rounded-lg hover:bg-gray-50 shadow-sm"
          >
            <h2 className="text-xl font-semibold">{card.title}</h2>
          </Link>
        ))}
      </div>
    </main>
  );
}
