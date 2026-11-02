import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

/**
 * A real figure that ticks up once, when half of it is on screen: a hard
 * ease-out over 1.4s. The page and the pre-render carry the final value; it
 * only drops to zero on the client, just before it can be seen.
 */
export function Count({ to, decimals = 0 }: { to: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const fmt = (v: number) => v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  useEffect(() => {
    const el = ref.current;
    if (!el || reduce || inView) return;
    el.textContent = fmt(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduce || !inView) return;
    const run = animate(0, to, { duration: 1.4, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => (el.textContent = fmt(v)) });
    return () => run.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, to]);
  return (
    <span ref={ref} className="tabular">
      {fmt(to)}
    </span>
  );
}
