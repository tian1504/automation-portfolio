import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";

/**
 * AuditTeaserAnimated — an auto-looping, in-brand preview of the /audit funnel:
 * question → answer picked → generating → result, then loops. Built in
 * motion/react (no GIF/video file) so it stays crisp, light, and responsive.
 * Decorative (aria-hidden); the surrounding Builds card links to /audit.
 */

const PHASES = ["quiz", "generating", "result"] as const;
type Phase = (typeof PHASES)[number];
const DURATION: Record<Phase, number> = { quiz: 2800, generating: 1200, result: 3400 };
const PROGRESS: Record<Phase, string> = { quiz: "38%", generating: "70%", result: "100%" };

const OPTIONS = ["Lead gen & outreach", "Customer support", "Data & reporting"];

export function AuditTeaserAnimated() {
  const reduce = useReducedMotion();
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [picked, setPicked] = useState(false);
  const [running, setRunning] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Pause when offscreen or in a background tab.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let onscreen = true;
    const io = new IntersectionObserver(([e]) => { onscreen = e.isIntersecting; setRunning(onscreen && !document.hidden); }, { threshold: 0.2 });
    io.observe(el);
    const onVis = () => setRunning(onscreen && !document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", onVis); };
  }, []);

  // Phase driver + the "answer picked" beat inside the quiz phase.
  useEffect(() => {
    if (reduce || !running) return;
    const phase = PHASES[phaseIdx];
    let pickTimer: number | undefined;
    if (phase === "quiz") {
      setPicked(false);
      pickTimer = window.setTimeout(() => setPicked(true), 1100);
    }
    const next = window.setTimeout(() => setPhaseIdx((p) => (p + 1) % PHASES.length), DURATION[phase]);
    return () => { window.clearTimeout(next); if (pickTimer) window.clearTimeout(pickTimer); };
  }, [phaseIdx, running, reduce]);

  const phase: Phase = reduce ? "result" : PHASES[phaseIdx];

  return (
    <div ref={ref} aria-hidden className="absolute inset-0 flex flex-col p-6 md:p-8 overflow-hidden">
      {/* Progress bar + live phase label (category badge sits above this) */}
      <div className="flex items-center gap-3 mb-5">
        <div className="h-0.5 flex-1 bg-border rounded-full overflow-hidden">
          <motion.div className="h-full bg-primary" animate={{ width: reduce ? "100%" : PROGRESS[phase] }} transition={{ duration: 0.5, ease: "easeOut" }} />
        </div>
        <span className="font-mono text-[10px] text-primary shrink-0">{phase === "result" ? "PLAN" : phase === "generating" ? "···" : "01 / 05"}</span>
      </div>

      <div className="relative flex-1">
        <AnimatePresence mode="wait">
          {phase === "quiz" && (
            <motion.div key="quiz" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <div className="text-sm md:text-base font-medium text-foreground mb-3">What's eating your team's time?</div>
              <div className="space-y-2">
                {OPTIONS.map((opt, i) => {
                  const sel = picked && i === 0;
                  return (
                    <div key={opt} className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs md:text-sm transition-colors duration-300 ${sel ? "border-primary/60 bg-card/70 text-foreground" : "border-border bg-card/30 text-muted-foreground"}`}>
                      <span className={`flex h-4 w-4 items-center justify-center rounded-full border ${sel ? "border-primary bg-primary/15" : "border-border"}`}>
                        {sel && <Check className="h-3 w-3 text-primary" />}
                      </span>
                      {opt}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {phase === "generating" && (
            <motion.div key="gen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="h-full flex flex-col items-center justify-center text-center">
              <svg width="140" height="16" viewBox="0 0 140 16" fill="none" className="mb-4">
                <path d="M 4 8 H 136" stroke="hsl(30 6% 22%)" strokeWidth="1.5" strokeLinecap="round" />
                <motion.path d="M 4 8 H 136" stroke="hsl(45 93% 54%)" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="16 180" initial={{ strokeDashoffset: 16 }} animate={{ strokeDashoffset: -180 }} transition={{ duration: 1.1, ease: "easeInOut", repeat: Infinity }} />
              </svg>
              <span className="font-display text-sm md:text-base text-foreground">Building your plan…</span>
            </motion.div>
          )}

          {phase === "result" && (
            <motion.div key="res" initial={{ opacity: 0, y: reduce ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary mb-3">Automation ROI: high</div>
              <div className="flex items-baseline gap-5 mb-1">
                <div><span className="font-display font-bold text-2xl md:text-4xl text-primary tracking-tighter-2">18</span><span className="text-muted-foreground text-xs md:text-sm"> hrs/wk</span></div>
                <div><span className="font-display font-bold text-2xl md:text-4xl text-primary tracking-tighter-2">$3,900</span><span className="text-muted-foreground text-xs md:text-sm"> /mo</span></div>
              </div>
              <div className="font-mono text-[10px] text-muted-foreground/70 mb-4">Sample — estimated from one answer set</div>
              <div className="border-l-2 border-primary/60 pl-3 mb-4">
                <span className="font-mono text-xs text-muted-foreground mr-2">01</span>
                <span className="text-foreground/90 text-xs md:text-sm">Scrape &amp; qualify</span>
              </div>
              <div className="font-mono text-xs text-primary inline-flex items-center gap-1.5">
                Take the 60-second audit
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
