'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function Algos({ algoCards }: { algoCards: any[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    canvas.width = window.innerWidth;
    canvas.height = 600;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(100, 149, 237, 0.15)';
      ctx.lineWidth = 2;

      const now = Date.now() / 800;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x++) {
          const y = Math.sin((x + i * 100 + now * 50) * 0.01) * 30 + 100 + i * 100;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <section className="relative overflow-hidden py-16">
      {/* Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-10">
        <h1 className="text-5xl font-extrabold mb-6 text-center text-foreground">CurveFit Visualizer</h1>
        <p className="text-muted-foreground mb-12 text-center max-w-3xl mx-auto text-lg">
          Input your data points and explore how different curve fitting algorithms model your data.
          Choose between Linear, Polynomial, Exponential, and Power fits to best match your needs.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 px-4">
          {algoCards.map(({ title, href, description, icon }, index) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Link
                href={href}
                className="group block border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary transition-shadow transition-colors duration-300 bg-background"
              >
                <div className="flex items-center space-x-4 mb-3">
                  <div className="rounded-full bg-muted p-2 group-hover:bg-primary/20 transition-colors duration-300">
                    {icon}
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                    {title}
                  </h2>
                </div>
                <p className="text-muted-foreground">{description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
