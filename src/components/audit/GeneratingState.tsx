import { useEffect, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";

const LINES = [
  "Reading your answers…",
  "Matching automation patterns…",
  "Estimating hours & dollars saved…",
];

export function GeneratingState() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % LINES.length), 600);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <div className="flex flex-col items-center justify-center text-center py-12">
      {/* One in-brand sign of life: a single yellow pulse tracing a short path */}
      {!reduce && (
        <svg width="160" height="20" viewBox="0 0 160 20" fill="none" aria-hidden className="mb-7">
          <path d="M 4 10 H 156" stroke="hsl(30 6% 22%)" strokeWidth="1.5" strokeLinecap="round" />
          <motion.path
            d="M 4 10 H 156"
            stroke="hsl(45 93% 54%)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeDasharray="18 200"
            initial={{ strokeDashoffset: 18 }}
            animate={{ strokeDashoffset: -200 }}
            transition={{ duration: 1.2, ease: "easeInOut", repeat: Infinity }}
          />
        </svg>
      )}

      <div className="min-h-[1.75rem] px-4 text-center">
        {reduce ? (
          <span className="font-display text-lg text-foreground">Building your plan…</span>
        ) : (
          <AnimatePresence mode="wait">
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="font-display text-lg text-foreground"
            >
              {LINES[i]}
            </motion.span>
          </AnimatePresence>
        )}
      </div>

      <p className="mt-3 font-mono text-xs text-muted-foreground">
        Building your plan from your inputs — no fluff.
      </p>
    </div>
  );
}
