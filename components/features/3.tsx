'use client';
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function AnimatedCodeBlock() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const code = `
import numpy as np
x = np.array([1, 2, 3])
y = np.array([2, 3, 7])
`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="rounded-xl bg-[#0f172a] text-green-100 p-4 font-mono text-sm overflow-x-auto"
    >
      <pre><code>{code.trim()}</code></pre>
    </motion.div>
  );
}
