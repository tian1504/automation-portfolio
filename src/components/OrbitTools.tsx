import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";

type OrbitItem = {
  name: string;
  logo?: string;
  icon?: LucideIcon;
};

interface OrbitToolsProps {
  items: OrbitItem[];
  /** Outer container size in px (square). */
  size?: number;
  /** Tilt of the orbital plane in degrees. */
  tiltDeg?: number;
  /** Orbit duration in seconds. Lower = faster spin. */
  duration?: number;
  /** Item tile size in px. */
  itemSize?: number;
  className?: string;
}

/**
 * Orbital animation — items rotate around a tilted elliptical path,
 * inspired by React Bits' "Orbit Images". Built natively with Framer Motion
 * + CSS 3D transforms so we keep our editorial styling.
 */
export const OrbitTools = ({
  items,
  size = 360,
  tiltDeg = 62,
  duration = 28,
  itemSize = 56,
  className = "",
}: OrbitToolsProps) => {
  const radius = size / 2 - itemSize / 2 - 8;

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size, perspective: "1400px" }}
    >
      {/* Soft yellow glow at the center */}
      <div
        aria-hidden
        className="absolute w-1/2 h-1/2 rounded-full pointer-events-none blur-3xl opacity-60"
        style={{
          background:
            "radial-gradient(circle, hsl(45 93% 54% / 0.18), transparent 70%)",
        }}
      />

      {/* Center label */}
      <div className="relative z-10 text-center pointer-events-none">
        <div className="font-mono text-[10px] text-primary tracking-[0.3em] uppercase mb-1">
          Stack
        </div>
        <div className="font-display text-2xl font-bold text-foreground/90 tracking-tight leading-none">
          {items.length}
        </div>
        <div className="font-mono text-[9px] text-muted-foreground tracking-widest uppercase mt-1">
          Tools
        </div>
      </div>

      {/* Tilted orbital plane */}
      <motion.div
        className="absolute inset-0"
        style={{
          transformStyle: "preserve-3d",
          rotateX: tiltDeg,
        }}
        animate={{ rotateZ: 360 }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        {items.map((item, i) => {
          const angle = (i / items.length) * 360;
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className="absolute top-1/2 left-1/2"
              style={{
                width: itemSize,
                height: itemSize,
                marginTop: -itemSize / 2,
                marginLeft: -itemSize / 2,
                transformStyle: "preserve-3d",
                transform: `rotateZ(${angle}deg) translateX(${radius}px) rotateZ(${-angle}deg)`,
              }}
            >
              {/* Counter-tilt the inner card so faces stay toward the camera */}
              <div
                className="w-full h-full flex items-center justify-center rounded-md bg-card/80 border border-border backdrop-blur-sm shadow-lg shadow-black/40"
                style={{ transform: `rotateX(${-tiltDeg}deg)` }}
                title={item.name}
                aria-label={item.name}
              >
                {item.logo ? (
                  <img
                    src={item.logo}
                    alt=""
                    aria-hidden
                    className="w-7 h-7 object-contain"
                  />
                ) : Icon ? (
                  <Icon className="w-6 h-6 text-foreground/85" aria-hidden />
                ) : null}
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Faint orbital ring guide */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          transform: `rotateX(${tiltDeg}deg)`,
          border: "1px dashed hsl(45 93% 54% / 0.18)",
          borderRadius: "50%",
        }}
      />
    </div>
  );
};
