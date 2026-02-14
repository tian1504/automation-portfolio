'use client';

import React, { useEffect, useRef, useCallback } from 'react';

export function TubesCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<any>(null);

  const randomColors = (count: number): string[] => {
    return new Array(count)
      .fill(0)
      .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
  };

  useEffect(() => {
    const initTimer = setTimeout(() => {
      import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js' as any)
        .then((module: any) => {
          const TubesCursorLib = module.default;
          if (canvasRef.current) {
            const app = TubesCursorLib(canvasRef.current, {
              tubes: {
                colors: ["#5e72e4", "#8965e0", "#f5365c"],
                lights: {
                  intensity: 200,
                  colors: ["#21d4fd", "#b721ff", "#f4d03f", "#11cdef"]
                }
              }
            });
            appRef.current = app;
          }
        })
        .catch((err: Error) => console.error("Failed to load TubesCursor module:", err));
    }, 100);

    return () => {
      clearTimeout(initTimer);
      if (appRef.current && typeof appRef.current.dispose === 'function') {
        appRef.current.dispose();
      }
    };
  }, []);

  // Forward pointer/mouse events from document.body to the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const forward = (e: MouseEvent | PointerEvent) => {
      const cloned = new (e.constructor as typeof MouseEvent)(e.type, e);
      canvas.dispatchEvent(cloned);
    };

    const events = ['pointermove', 'pointerdown', 'pointerup', 'mousemove', 'mousedown', 'mouseup'] as const;
    events.forEach((evt) => document.body.addEventListener(evt, forward as EventListener));

    return () => {
      events.forEach((evt) => document.body.removeEventListener(evt, forward as EventListener));
    };
  }, []);

  // Color change on background click
  useEffect(() => {
    const handleClick = () => {
      if (appRef.current) {
        const newTubeColors = randomColors(3);
        const newLightColors = randomColors(4);
        appRef.current.tubes.setColors(newTubeColors);
        appRef.current.tubes.setLightsColors(newLightColors);
      }
    };

    document.body.addEventListener('click', handleClick);
    return () => document.body.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
