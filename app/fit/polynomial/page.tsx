import PolynomialFitCard from "@/components/algorithms/polynomial";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Polynomial Fit",
  description: "Capture growth or decay trends with polynomial functions.",
}

export default function PolynomialFitPage() {
  return (
    <PolynomialFitCard />
  );
}