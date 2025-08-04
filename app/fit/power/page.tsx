import PowerFitCard from "@/components/algorithms/power";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Power Fit",
    description: "Capture growth or decay trends with power functions.",
}

export default function PowerPage() {
  return (
    <PowerFitCard />
  );
}