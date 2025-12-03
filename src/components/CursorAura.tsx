import { useEffect, useRef } from "react";

/**
 * CursorAura
 * A soft smoky glow that follows the mouse cursor.
 * Uses the same color palette as my AI Automation pill (blue → green → yellow).
 */
export function CursorAura() {
  const auraRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = auraRef.current;
    if (!el) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Check if device has a mouse (not touch-only)
    const hasMouse = window.matchMedia('(pointer: fine)').matches;
    if (!hasMouse) return;

    const size = 220;
    const half = size / 2;

    const handleMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      el.style.opacity = "1";
      el.style.transform = `translate3d(${clientX - half}px, ${clientY - half}px, 0)`;
    };

    const handleLeave = () => {
      el.style.opacity = "0";
    };

    // Start hidden & offscreen
    el.style.opacity = "0";
    el.style.transform = "translate3d(-9999px, -9999px, 0)";

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div
      ref={auraRef}
      className="pointer-events-none fixed top-0 left-0 z-50 rounded-full mix-blend-screen transition-opacity duration-200"
      style={{
        width: "220px",
        height: "220px",
        background:
          "radial-gradient(circle at 30% 30%, rgba(56,189,248,0.9), rgba(52,211,153,0.7), rgba(250,204,21,0.5), transparent 70%)",
        filter: "blur(22px)",
        opacity: 0,
      }}
    />
  );
}

export default CursorAura;
