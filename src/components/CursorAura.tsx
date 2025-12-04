"use client";

import { useEffect, useRef } from "react";

/**
 * CursorAura
 * Canvas-based smokey cursor trail using blue → green → yellow colors.
 * Draws multiple overlapping gradients along the recent mouse path
 * so it looks like smoke instead of a single circle.
 */
export function CursorAura() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Check if device has a mouse (not touch-only)
    const hasMouse = window.matchMedia('(pointer: fine)').matches;
    if (!hasMouse) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", handleResize);

    // Keep the last N positions to draw a trailing "smoke" path
    const trail: { x: number; y: number }[] = [];
    const maxTrail = 16;

    const handleMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      trail.push({ x: clientX, y: clientY });
      if (trail.length > maxTrail) {
        trail.shift();
      }
    };

    window.addEventListener("mousemove", handleMove);

    let animationFrameId: number;

    const render = () => {
      // Slightly darken previous frame instead of fully clearing → smoky fade
      ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
      ctx.fillRect(0, 0, width, height);

      if (trail.length > 0) {
        ctx.globalCompositeOperation = "lighter"; // add glows together

        trail.forEach((p, index) => {
          const t =
            trail.length <= 1 ? 0 : index / (trail.length - 1); // 0 (head) → 1 (tail)
          const radius = 220 - t * 160; // head bigger, tail smaller
          const alpha = 0.85 - t * 0.7; // fade along the trail

          const gradient = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            radius
          );

          // blue → green → yellow, same vibe as the AI Automation pill
          gradient.addColorStop(0, `rgba(56, 189, 248, ${alpha})`); // sky blue
          gradient.addColorStop(0.4, `rgba(52, 211, 153, ${alpha * 0.9})`); // teal/green
          gradient.addColorStop(1, `rgba(250, 204, 21, ${alpha * 0.7})`); // soft yellow

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.globalCompositeOperation = "source-over";
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // Start with a blank dark frame
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.fillRect(0, 0, width, height);

    render();

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-40"
      style={{
        // Keep it subtle and blended into the dark background
        mixBlendMode: "screen",
      }}
    />
  );
}

export default CursorAura;
