"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Settings2, PlusCircle, LineChart, Download } from "lucide-react"

const steps = [
  {
    title: "Go to Home Page",
    description: "Start at the homepage to choose your curve fitting method.",
    icon: Home,
  },
  {
    title: "Select Algorithm",
    description: "Choose between Polynomial, Power, or Exponential models.",
    icon: Settings2,
  },
  {
    title: "Add Data Points",
    description: "Input your (x, y) values manually or with ease.",
    icon: PlusCircle,
  },
  {
    title: "Visualize Output",
    description: "See a live graph, fitted equation, and error metrics instantly.",
    icon: LineChart,
  },
  {
    title: "Download or Export",
    description: "Save the chart or copy Python code for your reports.",
    icon: Download,
  },
]

export default function HowToUse() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
        How to Use CurveFit Studio
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step, idx) => {
          const Icon = step.icon
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              <Card className="h-full border border-border shadow-sm hover:bg-muted/70 transition-colors">
                <CardHeader className="flex items-center gap-4">
                  <div className="bg-primary/10 text-primary p-2 rounded-lg">
                    <Icon className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-base font-semibold">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
