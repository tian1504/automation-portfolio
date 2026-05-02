import { useRef } from "react";
import { motion } from "motion/react";
import { SectionHeading } from "@/components/SectionHeading";
import { AnimatedBeam } from "@/components/ui/animated-beam";

const steps = [
  {
    number: "01",
    title: "Audit",
    duration: "Day 1",
    description:
      "Discovery call. I review your current setup, ask where you're losing time, and identify the highest-leverage automation opportunities.",
  },
  {
    number: "02",
    title: "Scope",
    duration: "Days 2–3",
    description:
      "Written scope: deliverables, timeline, price, what's included and what isn't. You sign off before any building starts. No surprise invoices.",
  },
  {
    number: "03",
    title: "Build",
    duration: "1–3 weeks",
    description:
      "Async progress with weekly syncs. I work in your tools so handoff is clean. You see working pieces ship every few days, not a giant reveal at the end.",
  },
  {
    number: "04",
    title: "Handoff",
    duration: "Final week",
    description:
      "Working system, full documentation, and a handoff session. Optional monthly retainer keeps it monitored, maintained, and growing.",
  },
];

export const Process = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);
  const dotRefs = [step1Ref, step2Ref, step3Ref, step4Ref];

  return (
    <section id="process" className="section-padding relative">
      <div className="container-custom">
        <SectionHeading
          number="06"
          label="Process"
          title="How we'd work together."
          description="A predictable four-step engagement. Most builds ship in three weeks; audits in a few days."
        />

        <div ref={containerRef} className="relative max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border relative">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
                className="bg-background p-7 lg:p-8 relative"
              >
                {/* Step header with dot anchor (used by AnimatedBeam) */}
                <div className="flex items-center gap-3 mb-5">
                  <span
                    ref={dotRefs[index]}
                    className="relative flex h-2 w-2"
                  >
                    <span className="absolute inline-flex h-full w-full rounded-full bg-primary/40 animate-ping opacity-50" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                  </span>
                  <span className="font-mono text-[11px] text-primary tracking-[0.25em] uppercase">
                    {step.number}
                  </span>
                  <span className="text-border" aria-hidden>·</span>
                  <span className="font-mono text-[10px] text-muted-foreground/70 tracking-[0.2em] uppercase">
                    {step.duration}
                  </span>
                </div>

                <h3 className="text-xl lg:text-2xl font-bold tracking-tight text-foreground mb-3 leading-tight">
                  {step.title}
                </h3>

                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Magic UI AnimatedBeam — three beams chaining 01 → 02 → 03 → 04 (desktop only) */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none">
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={step1Ref}
              toRef={step2Ref}
              pathColor="hsl(30 6% 18%)"
              pathWidth={1}
              pathOpacity={0.5}
              gradientStartColor="#facc15"
              gradientStopColor="#fef3c7"
              duration={3.5}
              delay={0.3}
              curvature={0}
            />
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={step2Ref}
              toRef={step3Ref}
              pathColor="hsl(30 6% 18%)"
              pathWidth={1}
              pathOpacity={0.5}
              gradientStartColor="#facc15"
              gradientStopColor="#fef3c7"
              duration={3.5}
              delay={0.9}
              curvature={0}
            />
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={step3Ref}
              toRef={step4Ref}
              pathColor="hsl(30 6% 18%)"
              pathWidth={1}
              pathOpacity={0.5}
              gradientStartColor="#facc15"
              gradientStopColor="#fef3c7"
              duration={3.5}
              delay={1.5}
              curvature={0}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
