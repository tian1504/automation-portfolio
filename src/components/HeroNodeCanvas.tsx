import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { GitBranch } from "lucide-react";
import flowImg from "@/assets/workflows/deductive-rag-flow.webp";

/**
 * HeroNodeCanvas — the REAL n8n "deductive-lab RAG system" workflow (an actual
 * screenshot), brought to life with a live-execution animation: a glow travels
 * through the nodes in flow order and each node pulses as it "fires", mimicking
 * an n8n run. The agent nodes carry n8n's robot glyphs, so the execution
 * literally lights up the agents. Honest (it's the real flow), not a recreation.
 */

// Node centres as % of the flow image (1538×634), in execution order.
const STEPS = [
  { x: 23.2, y: 18.9, big: false }, // When chat message received
  { x: 36.6, y: 10.7, big: false }, // Normalize Input
  { x: 51.4, y: 10.7, big: true },  // Product Manager Agent
  { x: 68.7, y: 11.5, big: true },  // Incident Summary Agent
  { x: 84.2, y: 11.5, big: false }, // router + summary {}
  { x: 83.7, y: 30.3, big: false }, // Switch
  { x: 15.9, y: 64.4, big: true },  // Deductive Agent
  { x: 35.3, y: 64.4, big: true },  // Product Profile Agent
  { x: 50.7, y: 64.4, big: true },  // Quick Isolation Agent
  { x: 67.5, y: 65.9, big: true },  // Isolation Agent
];

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

export const HeroNodeCanvas = () => {
  const reduce = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const [step, setStep] = useState(2);
  const [running, setRunning] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Pause when offscreen or in a background tab.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let onscreen = true;
    const io = new IntersectionObserver(([e]) => { onscreen = e.isIntersecting; setRunning(onscreen && !document.hidden); }, { threshold: 0.15 });
    io.observe(el);
    const onVis = () => setRunning(onscreen && !document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", onVis); };
  }, []);

  useEffect(() => {
    if (reduce || !running) return;
    const id = window.setInterval(() => setStep((s) => (s + 1) % STEPS.length), 1150);
    return () => window.clearInterval(id);
  }, [running, reduce]);

  const animate = !reduce && running;
  const active = STEPS[step];
  const ringW = active.big ? 12 : 9; // % of image width

  return (
    <div ref={ref} className="relative">
      {/* Single soft depth glow behind the panel */}
      <div aria-hidden className="absolute -inset-5 -z-10 rounded-3xl opacity-60 blur-3xl" style={{ background: "radial-gradient(circle at 55% 40%, hsl(45 93% 54% / 0.10), transparent 65%)" }} />

      <div className="rounded-xl border border-border bg-[#1a1a1a] shadow-xl shadow-black/40 overflow-hidden">
        {/* Chrome — real workflow name + highlighted RAG · multi-agent tag */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-secondary/40">
          <GitBranch className="h-3 w-3 text-primary/80" aria-hidden />
          <span className="font-mono text-[11px] text-muted-foreground tracking-wide">deductive-lab</span>
          <span className="font-mono text-[10px] text-muted-foreground/55">· n8n</span>
          <span className="ml-auto flex items-center gap-2">
            <span className="rounded-sm border border-primary/40 bg-primary/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-primary">RAG · multi-agent</span>
            <span className="hidden sm:flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
              <span className={`h-1.5 w-1.5 rounded-full bg-primary/70 ${animate ? "animate-pulse" : ""}`} aria-hidden />
              {animate ? "running" : "live"}
            </span>
          </span>
        </div>

        {/* The real flow + the execution overlay */}
        <div className="relative">
          <img
            src={flowImg}
            alt="The deductive-lab RAG multi-agent workflow in n8n — webhook and chat triggers feed a Product Manager agent and an Incident Summary agent, a router, and a Switch that routes to four specialist agents, each with its own model."
            className="block w-full select-none"
            draggable={false}
          />

          {/* Traveling execution glow */}
          {animate && isDesktop && (
            <motion.div
              aria-hidden
              className="absolute rounded-full pointer-events-none mix-blend-screen"
              style={{ width: "16%", aspectRatio: "1", x: "-50%", y: "-50%", background: "radial-gradient(circle, hsl(45 93% 54% / 0.55), hsl(45 93% 54% / 0.12) 45%, transparent 70%)", filter: "blur(6px)" }}
              animate={{ left: `${active.x}%`, top: `${active.y}%` }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
            />
          )}

          {/* Node "fired" ring pulse */}
          {animate && (
            <motion.div
              key={step}
              aria-hidden
              className="absolute rounded-[10px] border-2 border-primary pointer-events-none"
              style={{ left: `${active.x}%`, top: `${active.y}%`, width: `${ringW}%`, aspectRatio: "2 / 1", x: "-50%", y: "-50%" }}
              initial={{ opacity: 0.85, scale: 0.7 }}
              animate={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
            />
          )}
        </div>

        {/* Caption */}
        <div className="px-3 py-2 border-t border-border bg-secondary/30">
          <span className="font-mono text-[10px] tracking-wide text-muted-foreground/70">
            deductive-lab RAG system — a real, running multi-agent flow
          </span>
        </div>
      </div>
    </div>
  );
};
