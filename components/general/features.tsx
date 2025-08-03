'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { FunctionSquare, LineChart, Code2 } from 'lucide-react';

const features = [
  {
    title: 'Precise Fitting',
    description:
      'Fit your data using linear, polynomial, exponential, and power models with real-time error evaluation.',
    icon: FunctionSquare,
  },
  {
    title: 'Live Visualization',
    description:
      'Visualize your data and curve in real time. Adjust parameters and immediately see the results.',
    icon: LineChart,
  },
  {
    title: 'Export Python Code',
    description:
      'Instantly generate and copy the Python code for your fitted model—ready to use in your projects.',
    icon: Code2,
  },
];

export default function FeaturesSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-24">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-4xl font-bold text-center mb-16"
      >
        Powerful Features Built for Curve Fitting
      </motion.h2>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.03, rotate: -0.2 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <Card className="rounded-2xl border bg-background shadow-lg hover:shadow-2xl transition-all">
                  <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                    <div className="bg-primary/10 text-primary p-4 rounded-full shadow-inner">
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
