import ExponentialFitCard from "@/components/algorithms/exponential";
import { Metadata } from "next";

export const metadata : Metadata = {
    title: "Exponential Fit",
    description: "Capture growth or decay trends with exponential functions.",
}

export default function Page() {
  return (
    <ExponentialFitCard />
  );
}