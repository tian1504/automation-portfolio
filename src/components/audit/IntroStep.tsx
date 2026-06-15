import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function IntroStep({ onStart }: { onStart: () => void }) {
  return (
    <div className="text-center sm:text-left">
      <div className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground mb-5">
        AI Automation Audit
      </div>
      <h1 className="font-display font-bold tracking-tighter-2 leading-[1.05] text-3xl md:text-4xl lg:text-5xl text-foreground">
        See exactly what your team should automate first.
      </h1>
      <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto sm:mx-0">
        Answer 5 quick questions and I'll generate a personalized automation plan —
        what to automate, the hours and dollars it could reclaim, and where to start.{" "}
        <span className="text-foreground">~60 seconds, no signup to see it.</span>
      </p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8 flex flex-col sm:flex-row items-center gap-4"
      >
        <Button size="lg" onClick={onStart} className="group h-12 px-6 w-full sm:w-auto">
          Start the audit
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </motion.div>

      <p className="mt-7 font-mono text-xs text-muted-foreground">
        Top Rated on Upwork · 50+ workflows shipped · built for real client teams.
      </p>
    </div>
  );
}
