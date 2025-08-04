import { FittingTheoryTabs } from "@/components/general/theory";
import { Metadata } from "next";

const metadata: Metadata = {
  title: "Theory",
  description: "Learn about the theory behind curve fitting algorithms.",
}

export default function Page() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <FittingTheoryTabs />
    </div>
  );
}