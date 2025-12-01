import React, { useEffect, useState } from "react";

const CursorAura: React.FC = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Check if device has a mouse (not touch-only)
    const hasMouse = window.matchMedia('(pointer: fine)').matches;
    if (!hasMouse) return;

    let rafId: number;
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;

    const handleMove = (e: MouseEvent) => {
      const targetX = e.clientX;
      const targetY = e.clientY;

      const animate = () => {
        currentX += (targetX - currentX) * 0.2;
        currentY += (targetY - currentY) * 0.2;
        setPos({ x: currentX, y: currentY });
        rafId = requestAnimationFrame(animate);
      };

      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMove);

    const handleLeave = () => {
      cancelAnimationFrame(rafId);
    };
    window.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      className="cursor-aura"
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`
      }}
    />
  );
};

export default CursorAura;
