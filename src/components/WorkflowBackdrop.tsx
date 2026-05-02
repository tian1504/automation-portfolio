import { motion } from "motion/react";

/**
 * Subtle node-and-edge backdrop — visualizes the section as a workflow.
 * Sits behind content at low opacity. Two of the edges pulse, suggesting
 * data flowing through.
 */
export const WorkflowBackdrop = ({ className = "" }: { className?: string }) => {
  return (
    <svg
      aria-hidden
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <defs>
        {/* Soft fade mask so the graph melts into the page edges */}
        <radialGradient id="wb-fade" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="80%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="wb-mask">
          <rect width="1200" height="800" fill="url(#wb-fade)" />
        </mask>

        {/* Pulse gradient for the active edges */}
        <linearGradient id="wb-pulse" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(45 93% 54%)" stopOpacity="0" />
          <stop offset="50%" stopColor="hsl(45 93% 54%)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="hsl(45 93% 54%)" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g mask="url(#wb-mask)" opacity="0.55">
        {/* Static edges — quiet warm cream lines */}
        <g stroke="hsl(35 8% 50%)" strokeWidth="0.6" opacity="0.35" fill="none">
          <path d="M 120 220 Q 320 120 540 280" />
          <path d="M 540 280 Q 720 380 920 220" />
          <path d="M 200 480 Q 360 540 540 460" />
          <path d="M 540 460 Q 740 380 920 540" />
          <path d="M 120 220 L 200 480" />
          <path d="M 540 280 L 540 460" />
          <path d="M 920 220 L 920 540" />
          <path d="M 320 660 Q 540 700 760 640" />
          <path d="M 760 640 L 920 540" />
          <path d="M 320 660 L 200 480" />
          <path d="M 1060 360 L 920 220" />
          <path d="M 1060 360 L 920 540" />
        </g>

        {/* Two animated "flow" edges — yellow pulse */}
        <motion.path
          d="M 120 220 Q 320 120 540 280"
          stroke="hsl(45 93% 54%)"
          strokeWidth="1.2"
          fill="none"
          strokeDasharray="4 8"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -36 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          opacity="0.45"
        />
        <motion.path
          d="M 540 460 Q 740 380 920 540"
          stroke="hsl(45 93% 54%)"
          strokeWidth="1.2"
          fill="none"
          strokeDasharray="4 8"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -36 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 1.2 }}
          opacity="0.45"
        />

        {/* Nodes — small editorial circles + a few yellow accents */}
        <g>
          {[
            { cx: 120, cy: 220, r: 4, accent: false },
            { cx: 540, cy: 280, r: 5, accent: true },
            { cx: 920, cy: 220, r: 4, accent: false },
            { cx: 200, cy: 480, r: 4, accent: false },
            { cx: 540, cy: 460, r: 5, accent: true },
            { cx: 920, cy: 540, r: 4, accent: false },
            { cx: 320, cy: 660, r: 3.5, accent: false },
            { cx: 760, cy: 640, r: 3.5, accent: false },
            { cx: 1060, cy: 360, r: 4, accent: false },
          ].map((n, i) => (
            <g key={i}>
              <circle
                cx={n.cx}
                cy={n.cy}
                r={n.r + 6}
                fill={n.accent ? "hsl(45 93% 54%)" : "hsl(35 8% 50%)"}
                opacity={n.accent ? 0.08 : 0.05}
              />
              <circle
                cx={n.cx}
                cy={n.cy}
                r={n.r}
                fill={n.accent ? "hsl(45 93% 54%)" : "hsl(35 8% 60%)"}
                opacity={n.accent ? 0.55 : 0.4}
              />
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
};
