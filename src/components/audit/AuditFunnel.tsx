import { useEffect, useMemo, useReducer, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { QUESTIONS, generatePlan, type Answers } from "@/lib/auditPlan";
import { IntroStep } from "@/components/audit/IntroStep";
import { QuizStep } from "@/components/audit/QuizStep";
import { GeneratingState } from "@/components/audit/GeneratingState";
import { PlanReport } from "@/components/audit/PlanReport";

type Phase = "intro" | "quiz" | "generating" | "result";
type State = { phase: Phase; stepIndex: number; answers: Answers };

const EMPTY: Answers = { timeSink: "", teamSize: "", tools: [], bottleneck: "", hoursLost: "" };

type Action =
  | { type: "start" }
  | { type: "setAnswer"; id: keyof Answers; value: string }
  | { type: "toggleTool"; value: string }
  | { type: "advance" }
  | { type: "back" }
  | { type: "generating" }
  | { type: "result" }
  | { type: "reset" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "start":
      return { ...state, phase: "quiz", stepIndex: 0 };
    case "setAnswer":
      return { ...state, answers: { ...state.answers, [action.id]: action.value } };
    case "toggleTool": {
      const has = state.answers.tools.includes(action.value);
      const tools = has
        ? state.answers.tools.filter((t) => t !== action.value)
        : [...state.answers.tools, action.value];
      return { ...state, answers: { ...state.answers, tools } };
    }
    case "advance":
      return { ...state, stepIndex: state.stepIndex + 1 };
    case "back":
      return state.stepIndex === 0
        ? { ...state, phase: "intro" }
        : { ...state, stepIndex: state.stepIndex - 1 };
    case "generating":
      return { ...state, phase: "generating" };
    case "result":
      return { ...state, phase: "result" };
    case "reset":
      return { phase: "intro", stepIndex: 0, answers: EMPTY };
    default:
      return state;
  }
}

export function AuditFunnel() {
  const reduce = useReducedMotion();
  const [state, dispatch] = useReducer(reducer, { phase: "intro", stepIndex: 0, answers: EMPTY });
  const timer = useRef<number | null>(null);

  const clearPending = () => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  };
  useEffect(() => () => clearPending(), []);

  const plan = useMemo(() => generatePlan(state.answers), [state.answers]);
  const question = QUESTIONS[state.stepIndex];
  const isLast = state.stepIndex === QUESTIONS.length - 1;

  const doGenerate = () => {
    clearPending();
    dispatch({ type: "generating" });
    timer.current = window.setTimeout(() => dispatch({ type: "result" }), reduce ? 600 : 2000);
  };

  const onSelect = (value: string) => {
    dispatch({ type: "setAnswer", id: question.id, value });
    clearPending();
    timer.current = window.setTimeout(() => {
      if (isLast) doGenerate();
      else dispatch({ type: "advance" });
    }, reduce ? 0 : 240);
  };

  const onToggleTool = (value: string) => dispatch({ type: "toggleTool", value });
  const onContinue = () => {
    clearPending();
    if (isLast) doGenerate();
    else dispatch({ type: "advance" });
  };
  const onBack = () => {
    clearPending();
    dispatch({ type: "back" });
  };
  const onReset = () => {
    clearPending();
    dispatch({ type: "reset" });
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state.phase}
        initial={{ opacity: 0, y: reduce ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reduce ? 0 : -12 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {state.phase === "intro" && <IntroStep onStart={() => dispatch({ type: "start" })} />}
        {state.phase === "quiz" && (
          <QuizStep
            question={question}
            stepIndex={state.stepIndex}
            total={QUESTIONS.length}
            value={state.answers[question.id]}
            onSelect={onSelect}
            onToggleTool={onToggleTool}
            onContinue={onContinue}
            onBack={onBack}
          />
        )}
        {state.phase === "generating" && <GeneratingState />}
        {state.phase === "result" && <PlanReport plan={plan} answers={state.answers} onReset={onReset} />}
      </motion.div>
    </AnimatePresence>
  );
}
