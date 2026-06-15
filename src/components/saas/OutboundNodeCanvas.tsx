import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Filter,
  Search,
  Sparkles,
  Bot,
  Send,
  Users,
  GitBranch,
  UserCheck,
  Clock,
  Repeat,
  type LucideIcon,
} from "lucide-react";

/**
 * OutboundNodeCanvas — architecture diagram for the AI Outbound Engine case
 * study, drawn in the same node-graph idiom as HeroNodeCanvas (self-contained
 * copy of the primitives with its own dataset, so the two never drift).
 * Pipeline: ICP Filter → Apollo Scrape → Enrich → AI Icebreaker → Send → CRM,
 * then a Reply Triage router fanning to Rep / Nurture / Auto-nurture.
 */

interface Stage { w: number; h: number }
type NodeType = "trigger" | "agent" | "edit" | "router";
interface NodeDef { id: string; x: number; y: number; w: number; h: number; label: string; tag?: string; icon: LucideIcon; type: NodeType; hero?: boolean }
type Side = "in" | "out" | "top" | "bottom";
interface EdgeDef { from: string; to: string; fromSide: Side; toSide: Side; pulse?: boolean }

const STAGE: Stage = { w: 640, h: 400 };
const NODES: NodeDef[] = [
  { id: "icp", x: 4, y: 36, w: 100, h: 48, label: "ICP Filter", tag: "Filter", icon: Filter, type: "trigger" },
  { id: "scrape", x: 120, y: 36, w: 110, h: 48, label: "Apollo Scrape", tag: "Source", icon: Search, type: "agent" },
  { id: "enrich", x: 246, y: 36, w: 86, h: 48, label: "Enrich", tag: "Enrich", icon: Sparkles, type: "edit" },
  { id: "icebreaker", x: 348, y: 34, w: 114, h: 52, label: "AI Icebreaker", tag: "AI", icon: Bot, type: "agent", hero: true },
  { id: "send", x: 478, y: 36, w: 72, h: 48, label: "Send", tag: "Send", icon: Send, type: "edit" },
  { id: "crm", x: 566, y: 36, w: 70, h: 48, label: "CRM", tag: "Sync", icon: Users, type: "agent" },
  { id: "triage", x: 516, y: 150, w: 120, h: 48, label: "Reply Triage", tag: "Router", icon: GitBranch, type: "router" },
  { id: "rep", x: 30, y: 290, w: 156, h: 48, label: "Interested → Rep", tag: "Route", icon: UserCheck, type: "agent" },
  { id: "nurture", x: 240, y: 290, w: 168, h: 48, label: "Not now → Nurture", tag: "Route", icon: Clock, type: "agent" },
  { id: "auto", x: 470, y: 290, w: 150, h: 48, label: "Auto-nurture", tag: "Route", icon: Repeat, type: "agent" },
];
const EDGES: EdgeDef[] = [
  { from: "icp", to: "scrape", fromSide: "out", toSide: "in", pulse: true },
  { from: "scrape", to: "enrich", fromSide: "out", toSide: "in", pulse: true },
  { from: "enrich", to: "icebreaker", fromSide: "out", toSide: "in", pulse: true },
  { from: "icebreaker", to: "send", fromSide: "out", toSide: "in", pulse: true },
  { from: "send", to: "crm", fromSide: "out", toSide: "in", pulse: true },
  { from: "crm", to: "triage", fromSide: "bottom", toSide: "top", pulse: true },
  { from: "triage", to: "rep", fromSide: "bottom", toSide: "top", pulse: true },
  { from: "triage", to: "nurture", fromSide: "bottom", toSide: "top", pulse: true },
  { from: "triage", to: "auto", fromSide: "bottom", toSide: "top", pulse: true },
];

const MOBILE_STAGE: Stage = { w: 380, h: 300 };
const MOBILE_NODES: NodeDef[] = [
  { id: "icp", x: 10, y: 22, w: 150, h: 50, label: "ICP Filter", tag: "Filter", icon: Filter, type: "trigger" },
  { id: "icebreaker", x: 206, y: 18, w: 164, h: 54, label: "AI Icebreaker", tag: "AI", icon: Bot, type: "agent", hero: true },
  { id: "triage", x: 150, y: 150, w: 130, h: 48, label: "Reply Triage", tag: "Router", icon: GitBranch, type: "router" },
  { id: "rep", x: 24, y: 230, w: 172, h: 50, label: "Interested → Rep", tag: "Route", icon: UserCheck, type: "agent" },
];
const MOBILE_EDGES: EdgeDef[] = [
  { from: "icp", to: "icebreaker", fromSide: "out", toSide: "in" },
  { from: "icebreaker", to: "triage", fromSide: "bottom", toSide: "top" },
  { from: "triage", to: "rep", fromSide: "bottom", toSide: "top" },
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
    const dy = Math.max(34, 0.45 * (b.y - a.y));
    return `M ${a.x} ${a.y} C ${a.x} ${a.y + dy}, ${b.x} ${b.y - dy}, ${b.x} ${b.y}`;
  }
  const dx = Math.max(36, 0.5 * (b.x - a.x));
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
  return (
    <div
      className="absolute"
      style={{ left: `${(node.x / stage.w) * 100}%`, top: `${(node.y / stage.h) * 100}%`, width: `${(node.w / stage.w) * 100}%`, height: `${(node.h / stage.h) * 100}%` }}
    >
      <div
        className={[
          "h-full w-full rounded-[7px] border bg-card/85 backdrop-blur-sm px-2 flex flex-col justify-center overflow-hidden transition-colors duration-300 border-border",
          node.type === "trigger" ? "border-l-2 border-l-primary/45" : "",
          lit ? "!border-primary/60" : "",
        ].join(" ")}
      >
        <div className="flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
          {node.tag && <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/80 truncate">{node.tag}</span>}
        </div>
        <div className="font-sans text-[11px] text-foreground/90 line-clamp-2 leading-[1.15] mt-0.5">{node.label}</div>
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
            <path d={edgePath(e, find)} fill="none" stroke="hsl(30 6% 22%)" strokeWidth={1.5} strokeLinecap="round" opacity={0.7} />
            <circle cx={a.x} cy={a.y} r={2.4} fill="hsl(30 6% 28%)" />
            <circle cx={b.x} cy={b.y} r={2.4} fill="hsl(30 6% 28%)" />
          </g>
        );
      })}
    </>
  );
}

const ARIA =
  "Architecture diagram of the AI Outbound Engine pipeline: ICP filter, Apollo scrape, enrich, AI icebreaker, send, and CRM sync, then a reply-triage router routing replies to a rep, a nurture sequence, or auto-nurture.";

function CanvasFrame({ stage, children, nodeCount }: { stage: Stage; children: React.ReactNode; nodeCount: number }) {
  return (
    <div className="relative">
      <div aria-hidden className="absolute -inset-5 -z-10 rounded-3xl opacity-60 blur-3xl" style={{ background: "radial-gradient(circle at 55% 35%, hsl(45 93% 54% / 0.08), transparent 65%)" }} />
      <div role="img" aria-label={ARIA} className="rounded-xl border border-border bg-card/60 backdrop-blur-sm shadow-xl shadow-black/30 overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-secondary/40">
          <GitBranch className="h-3 w-3 text-primary/80" aria-hidden />
          <span className="font-mono text-[11px] text-muted-foreground tracking-wide">outbound-engine</span>
          <span className="font-mono text-[10px] text-muted-foreground/55">· n8n</span>
          <span className="ml-auto font-mono text-[10px] text-muted-foreground">{nodeCount} nodes</span>
        </div>
        <div className="relative w-full" style={{ aspectRatio: `${stage.w} / ${stage.h}` }}>
          <div aria-hidden className="absolute inset-0" style={{ backgroundImage: "radial-gradient(hsl(40 25% 96% / 0.045) 1px, transparent 1px)", backgroundSize: "22px 22px", WebkitMaskImage: "radial-gradient(ellipse at center, black 55%, transparent 100%)", maskImage: "radial-gradient(ellipse at center, black 55%, transparent 100%)" }} />
          {children}
        </div>
        <div className="px-3 py-2 border-t border-border bg-secondary/30">
          <span className="font-mono text-[10px] tracking-wide text-muted-foreground/70">a modeled pipeline — concept build</span>
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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
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
    const id = window.setInterval(() => setActive((i) => (i + 1) % pulseEdges.length), 1600);
    return () => window.clearInterval(id);
  }, [running, pulseEdges.length]);

  const activeEdge = pulseEdges[active];
  const litNodeId = running ? activeEdge?.to : null;

  return (
    <div ref={ref}>
      <CanvasFrame stage={STAGE} nodeCount={NODES.length}>
        <motion.div className="absolute inset-0" animate={{ y: [0, -2.5, 0] }} transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}>
          <svg aria-hidden className="absolute inset-0 h-full w-full" viewBox={`0 0 ${STAGE.w} ${STAGE.h}`} preserveAspectRatio="none" fill="none">
            <EdgeLayer edges={EDGES} find={find} />
            {running && activeEdge && (
              <motion.path key={active} d={edgePath(activeEdge, find)} fill="none" stroke="hsl(45 93% 54%)" strokeWidth={1.8} strokeLinecap="round" strokeDasharray="16 700" initial={{ strokeDashoffset: 16, opacity: 0 }} animate={{ strokeDashoffset: -700, opacity: [0, 1, 1, 0] }} transition={{ duration: 1.4, ease: "easeInOut", times: [0, 0.1, 0.85, 1] }} />
            )}
          </svg>
          {NODES.map((n, i) => (
            <motion.div key={n.id} className="absolute inset-0" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.15 + i * 0.05, ease: "easeOut" }}>
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
  return (
    <CanvasFrame stage={stage} nodeCount={nodes.length}>
      <svg aria-hidden className="absolute inset-0 h-full w-full" viewBox={`0 0 ${stage.w} ${stage.h}`} preserveAspectRatio="none" fill="none">
        <EdgeLayer edges={edges} find={find} />
        {!mobile && <path d={edgePath(edges[0], find)} fill="none" stroke="hsl(45 93% 54%)" strokeWidth={1.8} strokeLinecap="round" opacity={0.85} />}
      </svg>
      {nodes.map((n) => (
        <NodeCard key={n.id} node={n} stage={stage} lit={!mobile && n.id === "scrape"} />
      ))}
    </CanvasFrame>
  );
}

export function OutboundNodeCanvas() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const reduce = useReducedMotion();
  if (!isDesktop) return <StaticCanvas mobile />;
  if (reduce) return <StaticCanvas />;
  return <LiveCanvas />;
}
