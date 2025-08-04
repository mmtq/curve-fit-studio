import LinearFitCard from "@/components/algorithms/linear";
import { Metadata } from "next";

export const metadata : Metadata = {
  title: "Linear Fit",
  description: "Fit your data with a straight line using Least Squares Method.",
}

export default function LinearPage() {
  return (
    <LinearFitCard />
  );
}