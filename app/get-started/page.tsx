import Steps from "@/components/general/steps"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'How to Use CurveFit Studio',
  description: 'Learn how to use CurveFit Studio to fit data with different curve fitting algorithms.',
}



export default function HowToUse() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
        How to Use CurveFit Studio
      </h2>
      <Steps />
    </section>
  )
}
