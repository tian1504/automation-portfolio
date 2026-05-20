import { motion } from "motion/react";
import { SectionHeadingMin } from "@/components/SectionHeadingMin";

const steps = [
  {
    duration: "Day 1",
    title: "Audit",
    description:
      "Discovery call. I review your current setup, ask where you're losing time, and identify the highest-leverage automation opportunities.",
  },
  {
    duration: "Days 2–3",
    title: "Scope",
    description:
      "Written scope: deliverables, timeline, price, what's included and what isn't. You sign off before any building starts.",
  },
  {
    duration: "1–3 weeks",
    title: "Build",
    description:
      "Async with weekly syncs. I work in your tools so handoff is clean. You see working pieces ship every few days.",
  },
  {
    duration: "Final week",
    title: "Handoff",
    description:
      "Working system, full documentation, and a handoff session. Optional monthly retainer keeps it monitored and growing.",
  },
];

export const Process = () => {
  return (
    <section id="process" className="section-padding relative">
      <div className="container-custom max-w-5xl">
        <SectionHeadingMin
          title="Process"
          description="A predictable four-step engagement. Most builds ship in three weeks."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <div className="font-mono text-[11px] text-primary tracking-[0.2em] uppercase mb-3">
                {step.duration}
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2 tracking-tight">
                {step.title}
              </h3>
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
