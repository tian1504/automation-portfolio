import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Question } from "@/lib/auditPlan";

type Props = {
  question: Question;
  stepIndex: number;
  total: number;
  value: string | string[];
  onSelect: (value: string) => void;
  onToggleTool: (value: string) => void;
  onContinue: () => void;
  onBack: () => void;
};

export function QuizStep({ question, stepIndex, total, value, onSelect, onToggleTool, onContinue, onBack }: Props) {
  const reduce = useReducedMotion();
  const isSelected = (opt: string) =>
    question.multi ? (value as string[]).includes(opt) : value === opt;
  const multiCount = question.multi ? (value as string[]).length : 0;

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center gap-4 mb-7">
        <div className="h-0.5 flex-1 bg-border rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={false}
            animate={{ width: `${((stepIndex + 1) / total) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
        <span className="font-mono text-[11px] text-primary tracking-[0.18em] uppercase shrink-0">
          {String(stepIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")} · {question.kicker}
        </span>
      </div>

      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors mb-5 rounded-sm px-1 py-1 -mx-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back
      </button>

      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: reduce ? 0 : 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <h2 className="font-display font-bold tracking-tight text-2xl md:text-3xl text-foreground leading-tight mb-6">
          {question.question}
        </h2>

        <motion.div
          className="flex flex-col gap-3"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.04 }}
        >
          {question.options.map((opt) => {
            const selected = isSelected(opt);
            return (
              <motion.button
                key={opt}
                variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                onClick={() => (question.multi ? onToggleTool(opt) : onSelect(opt))}
                className={[
                  "group w-full text-left rounded-lg border px-5 py-4 text-base transition-colors flex items-center gap-3",
                  selected
                    ? "border-primary/60 bg-card/60 text-foreground"
                    : "border-border bg-card/30 text-foreground/90 hover:border-primary/40 hover:bg-card/50",
                ].join(" ")}
              >
                {question.multi && (
                  <span
                    className={[
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
                      selected ? "border-primary bg-primary/15" : "border-border",
                    ].join(" ")}
                    aria-hidden
                  >
                    {selected && <Check className="h-3.5 w-3.5 text-primary" />}
                  </span>
                )}
                <span className="leading-snug">{opt}</span>
              </motion.button>
            );
          })}
        </motion.div>

        {question.multi && (
          <div className="mt-6 flex items-center gap-4">
            <Button onClick={onContinue} disabled={multiCount === 0} className="group h-11">
              Continue
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
            {multiCount === 0 && (
              <span className="font-mono text-xs text-muted-foreground">Pick at least one.</span>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
