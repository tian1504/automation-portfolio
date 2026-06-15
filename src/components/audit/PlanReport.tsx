import { motion, useReducedMotion } from "motion/react";
import { NumberTicker } from "@/components/ui/number-ticker";
import { CaptureCard } from "@/components/audit/CaptureCard";
import type { Answers, AuditPlan } from "@/lib/auditPlan";

function Kicker({ n, label }: { n: string; label: string }) {
  return (
    <div className="font-mono text-[11px] text-primary tracking-[0.2em] uppercase mb-4 flex items-center gap-3">
      <span>{n}</span>
      <span className="h-px w-6 bg-primary/40" aria-hidden />
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

export function PlanReport({ plan, answers, onReset }: { plan: AuditPlan; answers: Answers; onReset: () => void }) {
  const reduce = useReducedMotion();
  const block = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.08 }}
      className="space-y-12"
    >
      {/* Headline */}
      <motion.div variants={block} transition={{ duration: 0.5 }}>
        <div className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-primary mb-4">
          {plan.segment}
        </div>
        <h1 className="font-display font-bold tracking-tighter-2 leading-[1.05] text-3xl md:text-4xl text-foreground">
          Your automation plan.
        </h1>
        <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
          {plan.segmentBlurb}
        </p>
      </motion.div>

      {/* 01 Situation */}
      <motion.div variants={block} transition={{ duration: 0.5 }}>
        <Kicker n="01" label="Your situation" />
        <p className="text-base md:text-lg text-foreground/90 leading-relaxed max-w-xl">{plan.situation}</p>
      </motion.div>

      {/* 02 On the table */}
      <motion.div variants={block} transition={{ duration: 0.5 }}>
        <Kicker n="02" label="On the table" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg border border-border/60 bg-card/30 p-6">
            <div className="font-display font-bold tracking-tighter-2 text-4xl md:text-5xl text-primary">
              <NumberTicker value={plan.hoursReclaimed} delay={0.3} className="text-primary !text-[inherit] tracking-normal" />
              <span className="text-2xl md:text-3xl text-muted-foreground ml-1">hrs/wk</span>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">reclaimed, conservatively</div>
          </div>
          <div className="rounded-lg border border-border/60 bg-card/30 p-6">
            <div className="font-display font-bold tracking-tighter-2 text-4xl md:text-5xl text-primary">
              <span>$</span>
              <NumberTicker value={plan.dollarsPerMonth} delay={0.3} className="text-primary !text-[inherit] tracking-normal" />
              <span className="text-2xl md:text-3xl text-muted-foreground ml-1">/mo</span>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">in recovered team cost</div>
          </div>
        </div>
        <p className="mt-3 font-mono text-xs text-muted-foreground/80">
          Estimated — {plan.hoursReclaimed} hrs reclaimed × ~${plan.loadedRate}/hr blended cost. Your numbers, kept conservative.
        </p>
      </motion.div>

      {/* 03 The plan */}
      <motion.div variants={block} transition={{ duration: 0.5 }}>
        <Kicker n="03" label="Your 3-step plan" />
        <p className="text-base text-muted-foreground mb-6 max-w-xl">
          Built around {indefinite(plan.archetype)} <span className="text-foreground">{plan.archetype}</span> — the same pattern I ship for clients.
        </p>
        <div className="space-y-5">
          {plan.steps.map((step, i) => (
            <div
              key={step.n}
              className={`border-l-2 pl-5 ${i === 0 ? "border-primary/60" : "border-border"}`}
            >
              <div className="font-mono text-xs text-muted-foreground mb-1">{step.n}</div>
              <div className="font-bold text-foreground">{step.title}</div>
              <div className="text-sm text-muted-foreground leading-relaxed mt-1 max-w-xl">{step.detail}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 04 Where to start */}
      <motion.div variants={block} transition={{ duration: 0.5 }}>
        <Kicker n="04" label="Where to start" />
        <div className="rounded-lg border border-primary/30 bg-card/40 p-6">
          <div className="text-foreground">
            <span className="text-muted-foreground">Recommended starting point: </span>
            <span className="font-bold">{plan.engagement.name}</span>
            <span className="text-muted-foreground"> — {plan.engagement.price}.</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Fixed scope, fixed price. You sign off before I build anything — no surprise invoices.
          </p>
        </div>
      </motion.div>

      {/* Capture */}
      <motion.div variants={block} transition={{ duration: 0.5 }}>
        <CaptureCard plan={plan} answers={answers} />
        <button
          onClick={onReset}
          className="mt-6 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors rounded-sm px-1 py-1 -mx-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          ← Start over
        </button>
      </motion.div>
    </motion.div>
  );
}

function indefinite(word: string) {
  return /^[aeiou]/i.test(word) ? "an" : "a";
}
