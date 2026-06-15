import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  MessageSquare,
  SlidersHorizontal,
  Bot,
  GitBranch,
  Cpu,
  Database,
  Brain,
  Braces,
  Webhook,
  type LucideIcon,
} from "lucide-react";

/**
 * HeroNodeCanvas — a faithful, animated recreation of Eleazar's real n8n
 * "deductive-lab RAG system" multi-agent flow. NOT a stock asset, NOT a
 * screenshot: every card + connector is derived from ONE shared coordinate
 * config so the HTML cards and the SVG beziers can never drift apart.
 *
 * Two triggers → Normalize → Product Manager Agent → Incident Summary Agent →
 * Router/Summary → Switch → fan-out to four specialist agents, each with a model.
 */

interface Stage { w: number; h: number }
type NodeType = "trigger" | "agent" | "edit" | "router" | "sub";
interface NodeDef { id: string; x: number; y: number; w: number; h: number; label: string; tag?: string; icon: LucideIcon; type: NodeType; hero?: boolean }
type Side = "in" | "out" | "top" | "bottom";
interface EdgeDef { from: string; to: string; fromSide: Side; toSide: Side; dotted?: boolean; pulse?: boolean }

// ── Desktop stage. Cards position as % of this box; the SVG uses it as its
//    viewBox with preserveAspectRatio="none", so the two lock together.
const STAGE: Stage = { w: 640, h: 462 };

const NODES: NodeDef[] = [
  // Triggers (left, stacked)
  { id: "webhook", x: 2, y: 16, w: 92, h: 40, label: "Webhook", tag: "POST", icon: Webhook, type: "trigger" },
  { id: "chat", x: 2, y: 66, w: 112, h: 46, label: "When chat message received", tag: "Trigger", icon: MessageSquare, type: "trigger" },
  // Spine
  { id: "normalize", x: 130, y: 40, w: 100, h: 44, label: "Normalize Input", tag: "Edit", icon: SlidersHorizontal, type: "edit" },
  { id: "pm", x: 252, y: 34, w: 124, h: 50, label: "Product Manager Agent", tag: "AI Agent", icon: Bot, type: "agent", hero: true },
  { id: "incident", x: 400, y: 36, w: 118, h: 48, label: "Incident Summary Agent", tag: "AI Agent", icon: Bot, type: "agent" },
  { id: "router", x: 544, y: 28, w: 92, h: 44, label: "Router + Summary", tag: "Code", icon: Braces, type: "edit" },
  { id: "switch", x: 550, y: 138, w: 86, h: 44, label: "Switch", tag: "Router", icon: GitBranch, type: "router" },
  // Product Manager Agent sub-nodes
  { id: "pmModel", x: 206, y: 106, w: 96, h: 28, label: "OpenAI Chat Model", icon: Cpu, type: "sub" },
  { id: "pmMemory", x: 308, y: 106, w: 84, h: 28, label: "Simple Memory", icon: Database, type: "sub" },
  { id: "pmThink", x: 398, y: 106, w: 56, h: 28, label: "Think", icon: Brain, type: "sub" },
  // Specialist fan-out
  { id: "deductive", x: 12, y: 326, w: 120, h: 46, label: "Deductive Agent", tag: "AI Agent", icon: Bot, type: "agent" },
  { id: "profile", x: 166, y: 326, w: 130, h: 46, label: "Product Profile Agent", tag: "AI Agent", icon: Bot, type: "agent" },
  { id: "quick", x: 330, y: 326, w: 128, h: 46, label: "Quick Isolation Agent", tag: "AI Agent", icon: Bot, type: "agent" },
  { id: "isolation", x: 492, y: 326, w: 116, h: 46, label: "Isolation Agent", tag: "AI Agent", icon: Bot, type: "agent" },
  // Specialist models
  { id: "deductiveModel", x: 28, y: 408, w: 104, h: 28, label: "Deductive Model", icon: Cpu, type: "sub" },
  { id: "profileModel", x: 186, y: 408, w: 96, h: 28, label: "Profiler Model", icon: Cpu, type: "sub" },
  { id: "quickModel", x: 344, y: 408, w: 112, h: 28, label: "Quick Isolation Model", icon: Cpu, type: "sub" },
  { id: "isolationModel", x: 504, y: 408, w: 100, h: 28, label: "Isolation Model", icon: Cpu, type: "sub" },
];

const EDGES: EdgeDef[] = [
  { from: "webhook", to: "normalize", fromSide: "out", toSide: "in" },
  { from: "chat", to: "normalize", fromSide: "out", toSide: "in", pulse: true },
  { from: "normalize", to: "pm", fromSide: "out", toSide: "in", pulse: true },
  { from: "pm", to: "incident", fromSide: "out", toSide: "in", pulse: true },
  { from: "incident", to: "router", fromSide: "out", toSide: "in", pulse: true },
  { from: "router", to: "switch", fromSide: "bottom", toSide: "top", pulse: true },
  { from: "switch", to: "deductive", fromSide: "bottom", toSide: "top", pulse: true },
  { from: "switch", to: "profile", fromSide: "bottom", toSide: "top", pulse: true },
  { from: "switch", to: "quick", fromSide: "bottom", toSide: "top", pulse: true },
  { from: "switch", to: "isolation", fromSide: "bottom", toSide: "top", pulse: true },
  // Sub-node attachments (dotted)
  { from: "pm", to: "pmModel", fromSide: "bottom", toSide: "top", dotted: true },
  { from: "pm", to: "pmMemory", fromSide: "bottom", toSide: "top", dotted: true },
  { from: "pm", to: "pmThink", fromSide: "bottom", toSide: "top", dotted: true },
  { from: "deductive", to: "deductiveModel", fromSide: "bottom", toSide: "top", dotted: true },
  { from: "profile", to: "profileModel", fromSide: "bottom", toSide: "top", dotted: true },
  { from: "quick", to: "quickModel", fromSide: "bottom", toSide: "top", dotted: true },
  { from: "isolation", to: "isolationModel", fromSide: "bottom", toSide: "top", dotted: true },
];

// A trimmed graph for small screens — one legible path, no loops.
const MOBILE_STAGE: Stage = { w: 380, h: 300 };
const MOBILE_NODES: NodeDef[] = [
  { id: "chat", x: 10, y: 22, w: 166, h: 50, label: "When chat message received", tag: "Trigger", icon: MessageSquare, type: "trigger" },
  { id: "pm", x: 206, y: 18, w: 164, h: 54, label: "Product Manager Agent", tag: "AI Agent", icon: Bot, type: "agent", hero: true },
  { id: "pmModel", x: 222, y: 98, w: 132, h: 32, label: "OpenAI Chat Model", icon: Cpu, type: "sub" },
  { id: "switch", x: 150, y: 150, w: 130, h: 48, label: "Switch", tag: "Router", icon: GitBranch, type: "router" },
  { id: "deductive", x: 24, y: 230, w: 172, h: 50, label: "Deductive Agent", tag: "AI Agent", icon: Bot, type: "agent" },
];
const MOBILE_EDGES: EdgeDef[] = [
  { from: "chat", to: "pm", fromSide: "out", toSide: "in" },
  { from: "pm", to: "switch", fromSide: "bottom", toSide: "top" },
  { from: "switch", to: "deductive", fromSide: "bottom", toSide: "top" },
  { from: "pm", to: "pmModel", fromSide: "bottom", toSide: "top", dotted: true },
];

const lookupFor = (nodes: NodeDef[]) => (id: string) => nodes.find((n) => n.id === id)!;

function portOf(n: NodeDef, side: Side) {
  switch (side) {
    case "in": return { x: n.x, y: n.y + n.h / 2 };
    case "out": return { x: n.x + n.w, y: n.y + n.h / 2 };
    case "top": return { x: n.x + n.w / 2, y: n.y };
    case "bottom": return { x: n.x + n.w / 2, y: n.y + n.h };
  }
}

function edgePath(e: EdgeDef, find: (id: string) => NodeDef) {
  const a = portOf(find(e.from), e.fromSide);
  const b = portOf(find(e.to), e.toSide);
  const vertical = (e.fromSide === "bottom" || e.fromSide === "top") && (e.toSide === "top" || e.toSide === "bottom");
  if (vertical) {
    const dy = Math.max(30, 0.42 * (b.y - a.y));
    return `M ${a.x} ${a.y} C ${a.x} ${a.y + dy}, ${b.x} ${b.y - dy}, ${b.x} ${b.y}`;
  }
  const dx = Math.max(32, 0.5 * (b.x - a.x));
  return `M ${a.x} ${a.y} C ${a.x + dx} ${a.y}, ${b.x - dx} ${b.y}, ${b.x} ${b.y}`;
}

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

function NodeCard({ node, stage, lit }: { node: NodeDef; stage: Stage; lit?: boolean }) {
  const Icon = node.icon;
  const isSub = node.type === "sub";
  return (
    <div
      className="absolute"
      style={{ left: `${(node.x / stage.w) * 100}%`, top: `${(node.y / stage.h) * 100}%`, width: `${(node.w / stage.w) * 100}%`, height: `${(node.h / stage.h) * 100}%` }}
    >
      <div
        className={[
          "h-full w-full rounded-[6px] border bg-card/85 backdrop-blur-sm px-1.5 flex flex-col justify-center overflow-hidden transition-colors duration-300",
          isSub ? "border-border/70 bg-card/65" : "border-border",
          node.type === "trigger" ? "border-l-2 border-l-primary/45" : "",
          lit ? "!border-primary/60" : "",
        ].join(" ")}
      >
        <div className="flex items-center gap-1">
          <Icon className={isSub ? "h-2.5 w-2.5 shrink-0 text-muted-foreground/70" : "h-3 w-3 shrink-0 text-muted-foreground"} aria-hidden />
          {node.tag && (
            <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground/80 truncate">{node.tag}</span>
          )}
        </div>
        <div className={["leading-[1.1] mt-0.5", isSub ? "font-mono text-[8.5px] text-muted-foreground/80 truncate" : "font-sans text-[10px] text-foreground/90 line-clamp-2"].join(" ")}>
          {node.label}
        </div>
      </div>
    </div>
  );
}

function EdgeLayer({ edges, find }: { edges: EdgeDef[]; find: (id: string) => NodeDef }) {
  return (
    <>
      {edges.map((e, i) => {
        const a = portOf(find(e.from), e.fromSide);
        const b = portOf(find(e.to), e.toSide);
        return (
          <g key={`${e.from}-${e.to}-${i}`}>
            <path
              d={edgePath(e, find)}
              fill="none"
              stroke={e.dotted ? "hsl(35 8% 50%)" : "hsl(30 6% 22%)"}
              strokeWidth={e.dotted ? 1 : 1.4}
              strokeLinecap="round"
              strokeDasharray={e.dotted ? "1 5" : undefined}
              opacity={e.dotted ? 0.5 : 0.7}
            />
            {!e.dotted && (
              <>
                <circle cx={a.x} cy={a.y} r={2.2} fill="hsl(30 6% 28%)" />
                <circle cx={b.x} cy={b.y} r={2.2} fill="hsl(30 6% 28%)" />
              </>
            )}
          </g>
        );
      })}
    </>
  );
}

const CANVAS_ARIA =
  "Diagram of a real n8n RAG multi-agent workflow (deductive-lab): two triggers feed a normalize step, a Product Manager agent and an Incident Summary agent with model, memory and tool sub-nodes, a router/summary node, and a Switch that routes to four specialist agents — Deductive, Product Profile, Quick Isolation, and Isolation — each with its own model.";

function CanvasFrame({ stage, children, nodeCount }: { stage: Stage; children: React.ReactNode; nodeCount: number }) {
  return (
    <div className="relative">
      <div aria-hidden className="absolute -inset-5 -z-10 rounded-3xl opacity-60 blur-3xl" style={{ background: "radial-gradient(circle at 55% 35%, hsl(45 93% 54% / 0.10), transparent 65%)" }} />
      <div role="img" aria-label={CANVAS_ARIA} className="rounded-xl border border-border bg-card/60 backdrop-blur-sm shadow-xl shadow-black/30 overflow-hidden">
        {/* Chrome — real workflow name + a highlighted RAG · multi-agent tag */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-secondary/40">
          <GitBranch className="h-3 w-3 text-primary/80" aria-hidden />
          <span className="font-mono text-[11px] text-muted-foreground tracking-wide">deductive-lab</span>
          <span className="font-mono text-[10px] text-muted-foreground/55">· n8n</span>
          <span className="ml-auto flex items-center gap-2">
            <span className="rounded-sm border border-primary/40 bg-primary/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-primary">
              RAG · multi-agent
            </span>
            <span className="font-mono text-[10px] text-muted-foreground hidden sm:inline">{nodeCount} nodes</span>
          </span>
        </div>

        {/* Stage — fixed aspect so %-positioned cards lock to the SVG viewBox */}
        <div className="relative w-full" style={{ aspectRatio: `${stage.w} / ${stage.h}` }}>
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(hsl(40 25% 96% / 0.045) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
              WebkitMaskImage: "radial-gradient(ellipse at center, black 60%, transparent 100%)",
              maskImage: "radial-gradient(ellipse at center, black 60%, transparent 100%)",
            }}
          />
          {children}
        </div>

        <div className="px-3 py-2 border-t border-border bg-secondary/30">
          <span className="font-mono text-[10px] tracking-wide text-muted-foreground/70">
            deductive-lab RAG system — a real flow, curated for legibility
          </span>
        </div>
      </div>
    </div>
  );
}

function LiveCanvas() {
  const find = lookupFor(NODES);
  const pulseEdges = EDGES.filter((e) => e.pulse);
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    let onscreen = true;
    const io = new IntersectionObserver(([entry]) => { onscreen = entry.isIntersecting; setRunning(onscreen && !document.hidden); }, { threshold: 0.15 });
    io.observe(el);
    const onVis = () => setRunning(onscreen && !document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", onVis); };
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % pulseEdges.length), 1500);
    return () => window.clearInterval(id);
  }, [running, pulseEdges.length]);

  const activeEdge = pulseEdges[active];
  const litNodeId = running ? activeEdge?.to : null;

  return (
    <div ref={panelRef}>
      <CanvasFrame stage={STAGE} nodeCount={NODES.length}>
        <motion.div className="absolute inset-0" animate={{ y: [0, -2.5, 0] }} transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}>
          <svg aria-hidden className="absolute inset-0 h-full w-full" viewBox={`0 0 ${STAGE.w} ${STAGE.h}`} preserveAspectRatio="none" fill="none">
            <EdgeLayer edges={EDGES} find={find} />
            {running && activeEdge && (
              <motion.path key={active} d={edgePath(activeEdge, find)} fill="none" stroke="hsl(45 93% 54%)" strokeWidth={1.8} strokeLinecap="round" strokeDasharray="16 700" initial={{ strokeDashoffset: 16, opacity: 0 }} animate={{ strokeDashoffset: -700, opacity: [0, 1, 1, 0] }} transition={{ duration: 1.3, ease: "easeInOut", times: [0, 0.1, 0.85, 1] }} />
            )}
          </svg>
          {NODES.map((n, i) => (
            <motion.div key={n.id} className="absolute inset-0" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.12 + i * 0.04, ease: "easeOut" }}>
              <NodeCard node={n} stage={STAGE} lit={litNodeId === n.id} />
            </motion.div>
          ))}
        </motion.div>
      </CanvasFrame>
    </div>
  );
}

function StaticCanvas({ mobile = false }: { mobile?: boolean }) {
  const nodes = mobile ? MOBILE_NODES : NODES;
  const edges = mobile ? MOBILE_EDGES : EDGES;
  const stage = mobile ? MOBILE_STAGE : STAGE;
  const find = lookupFor(nodes);
  const litTarget = mobile ? null : "pm";
  return (
    <CanvasFrame stage={stage} nodeCount={nodes.length}>
      <svg aria-hidden className="absolute inset-0 h-full w-full" viewBox={`0 0 ${stage.w} ${stage.h}`} preserveAspectRatio="none" fill="none">
        <EdgeLayer edges={edges} find={find} />
        {!mobile && <path d={edgePath(edges[1], find)} fill="none" stroke="hsl(45 93% 54%)" strokeWidth={1.8} strokeLinecap="round" opacity={0.85} />}
      </svg>
      {nodes.map((n) => (
        <NodeCard key={n.id} node={n} stage={stage} lit={n.id === litTarget} />
      ))}
    </CanvasFrame>
  );
}

export const HeroNodeCanvas = () => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const reduce = useReducedMotion();
  if (!isDesktop) return <StaticCanvas mobile />;
  if (reduce) return <StaticCanvas />;
  return <LiveCanvas />;
};
