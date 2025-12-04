"use client";

import { useEffect, useRef } from "react";

/**
 * CursorSmoke
 * A single soft smoky glow that follows the cursor.
 * Uses the same color palette as the AI Automation pill (blue → teal → yellow).
 */
export function CursorSmoke() {
  const smokeRef = useRef<HTMLDivElement | null>(null);
  const posRef = useRef({ x: -9999, y: -9999 });
  const targetRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const el = smokeRef.current;
    if (!el) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      el.style.display = 'none';
      return;
    }

    // Check if device has a mouse (not touch-only)
    const hasMouse = window.matchMedia('(pointer: fine)').matches;
    if (!hasMouse) {
      el.style.display = 'none';
      return;
    }

    const size = 180;
    const half = size / 2;

    const handlePointerMove = (event: PointerEvent) => {
      targetRef.current = {
        x: event.clientX - half,
        y: event.clientY - half,
      };
    };

    // Smooth animation loop
    const animate = () => {
      const lerp = 0.15; // smoothing factor
      posRef.current.x += (targetRef.current.x - posRef.current.x) * lerp;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * lerp;

      el.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`;

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", handlePointerMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return <div ref={smokeRef} className="cursor-smoke" />;
}

export default CursorSmoke;
