import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  MessageSquare,
  SlidersHorizontal,
  Bot,
  GitBranch,
  Cpu,
  Database,
  type LucideIcon,
} from "lucide-react";

/**
 * HeroNodeCanvas — a bespoke, honest recreation of Eleazar's real multi-agent
 * n8n flow, drawn as a live node graph. NOT a stock asset, NOT a screenshot:
 * every card + connector is derived from ONE shared coordinate config (per
 * breakpoint) so the HTML cards and the SVG beziers can never drift apart.
 *
 * Direction A (lead with the real workflow canvas) + B (editorial restraint):
 * structure is all hairline borders + muted tone; yellow is rationed to the
 * trigger's left-accent, the chrome glyph, and a single data-pulse that
 * traverses one edge at a time.
 */

interface Stage {
  w: number;
  h: number;
}

type NodeType = "trigger" | "agent" | "edit" | "router" | "sub";

interface NodeDef {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  tag?: string;
  icon: LucideIcon;
  type: NodeType;
  hero?: boolean;
}

type Side = "in" | "out" | "top" | "bottom";

interface EdgeDef {
  from: string;
  to: string;
  fromSide: Side;
  toSide: Side;
  dotted?: boolean;
  pulse?: boolean; // part of the ambient data-pulse sequence
}

// ── Desktop stage. Cards position as % of this box; the SVG uses it as its
//    viewBox with preserveAspectRatio="none", so the two lock together.
const STAGE: Stage = { w: 560, h: 440 };

// Verbatim node names from the real flow — curated for legibility (the caption
// keeps that honest). Spine flows left→right; the Switch fans down to specialists.
const NODES: NodeDef[] = [
  { id: "trigger", x: 4, y: 30, w: 140, h: 50, label: "When chat message received", tag: "Trigger", icon: MessageSquare, type: "trigger" },
  { id: "edit", x: 160, y: 46, w: 104, h: 44, label: "Normalize Input", tag: "Edit", icon: SlidersHorizontal, type: "edit" },
  { id: "pm", x: 282, y: 28, w: 146, h: 52, label: "Product Manager Agent", tag: "AI Agent", icon: Bot, type: "agent", hero: true },
  { id: "incident", x: 442, y: 44, w: 116, h: 50, label: "Incident Summary Agent", tag: "AI Agent", icon: Bot, type: "agent" },
  { id: "pmModel", x: 248, y: 122, w: 110, h: 30, label: "OpenAI Chat Model", icon: Cpu, type: "sub" },
  { id: "pmMemory", x: 366, y: 122, w: 100, h: 30, label: "Simple Memory", icon: Database, type: "sub" },
  { id: "switch", x: 470, y: 160, w: 86, h: 44, label: "Switch", tag: "Router", icon: GitBranch, type: "router" },
  { id: "a", x: 22, y: 300, w: 140, h: 46, label: "Deductive Agent", tag: "AI Agent", icon: Bot, type: "agent" },
  { id: "b", x: 206, y: 300, w: 150, h: 46, label: "Product Profile Agent", tag: "AI Agent", icon: Bot, type: "agent" },
  { id: "c", x: 400, y: 300, w: 150, h: 46, label: "Quick Isolation Agent", tag: "AI Agent", icon: Bot, type: "agent" },
  { id: "aModel", x: 42, y: 362, w: 100, h: 28, label: "Chat Model", icon: Cpu, type: "sub" },
  { id: "bModel", x: 228, y: 362, w: 104, h: 28, label: "Chat Model", icon: Cpu, type: "sub" },
  { id: "cModel", x: 422, y: 362, w: 104, h: 28, label: "Chat Model", icon: Cpu, type: "sub" },
];

const EDGES: EdgeDef[] = [
  { from: "trigger", to: "edit", fromSide: "out", toSide: "in", pulse: true },
  { from: "edit", to: "pm", fromSide: "out", toSide: "in", pulse: true },
  { from: "pm", to: "incident", fromSide: "out", toSide: "in", pulse: true },
  { from: "incident", to: "switch", fromSide: "bottom", toSide: "top", pulse: true },
  { from: "switch", to: "a", fromSide: "bottom", toSide: "top", pulse: true },
  { from: "switch", to: "b", fromSide: "bottom", toSide: "top", pulse: true },
  { from: "switch", to: "c", fromSide: "bottom", toSide: "top", pulse: true },
  { from: "pm", to: "pmModel", fromSide: "bottom", toSide: "top", dotted: true },
  { from: "pm", to: "pmMemory", fromSide: "bottom", toSide: "top", dotted: true },
  { from: "a", to: "aModel", fromSide: "bottom", toSide: "top", dotted: true },
  { from: "b", to: "bModel", fromSide: "bottom", toSide: "top", dotted: true },
  { from: "c", to: "cModel", fromSide: "bottom", toSide: "top", dotted: true },
];

// ── Mobile stage — a compact, purpose-built layout (NOT a crop of desktop), so
//    the trimmed graph stays dense and legible on a narrow screen.
const MOBILE_STAGE: Stage = { w: 380, h: 300 };
const MOBILE_NODES: NodeDef[] = [
  { id: "trigger", x: 10, y: 22, w: 166, h: 50, label: "When chat message received", tag: "Trigger", icon: MessageSquare, type: "trigger" },
  { id: "pm", x: 206, y: 18, w: 164, h: 54, label: "Product Manager Agent", tag: "AI Agent", icon: Bot, type: "agent", hero: true },
  { id: "pmModel", x: 222, y: 98, w: 132, h: 32, label: "OpenAI Chat Model", icon: Cpu, type: "sub" },
  { id: "switch", x: 150, y: 150, w: 96, h: 46, label: "Switch", tag: "Router", icon: GitBranch, type: "router" },
  { id: "a", x: 24, y: 230, w: 166, h: 50, label: "Deductive Agent", tag: "AI Agent", icon: Bot, type: "agent" },
];
const MOBILE_EDGES: EdgeDef[] = [
  { from: "trigger", to: "pm", fromSide: "out", toSide: "in" },
  { from: "pm", to: "switch", fromSide: "bottom", toSide: "top" },
  { from: "switch", to: "a", fromSide: "bottom", toSide: "top" },
  { from: "pm", to: "pmModel", fromSide: "bottom", toSide: "top", dotted: true },
];

// Build an id→node lookup for a given node set.
const lookupFor = (nodes: NodeDef[]) => (id: string) => nodes.find((n) => n.id === id)!;

function portOf(n: NodeDef, side: Side) {
  switch (side) {
    case "in":
      return { x: n.x, y: n.y + n.h / 2 };
    case "out":
      return { x: n.x + n.w, y: n.y + n.h / 2 };
    case "top":
      return { x: n.x + n.w / 2, y: n.y };
    case "bottom":
      return { x: n.x + n.w / 2, y: n.y + n.h };
  }
}

// Bezier whose control handles point along the connection's dominant axis, so
// horizontal hops bow sideways and vertical fan-outs sweep downward.
function edgePath(e: EdgeDef, find: (id: string) => NodeDef) {
  const a = portOf(find(e.from), e.fromSide);
  const b = portOf(find(e.to), e.toSide);
  const vertical = (e.fromSide === "bottom" || e.fromSide === "top") && (e.toSide === "top" || e.toSide === "bottom");
  if (vertical) {
    const dy = Math.max(34, 0.45 * (b.y - a.y));
    return `M ${a.x} ${a.y} C ${a.x} ${a.y + dy}, ${b.x} ${b.y - dy}, ${b.x} ${b.y}`;
  }
  const dx = Math.max(38, 0.5 * (b.x - a.x));
  return `M ${a.x} ${a.y} C ${a.x + dx} ${a.y}, ${b.x - dx} ${b.y}, ${b.x} ${b.y}`;
}

// ── Small media-query hook (matchMedia, SSR-safe). Drives a conditional MOUNT
//    so the animation loop never instantiates on phones.
function useMediaQuery(query: string) {
  // Lazily initialise from matchMedia so the FIRST paint already matches the
  // real viewport (prevents a flash of the mobile canvas on desktop load).
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

// ── A single node card. Shared across every variant so styling can't diverge.
function NodeCard({ node, stage, lit }: { node: NodeDef; stage: Stage; lit?: boolean }) {
  const Icon = node.icon;
  const isSub = node.type === "sub";
  return (
    <div
      className="absolute"
      style={{
        left: `${(node.x / stage.w) * 100}%`,
        top: `${(node.y / stage.h) * 100}%`,
        width: `${(node.w / stage.w) * 100}%`,
        height: `${(node.h / stage.h) * 100}%`,
      }}
    >
      <div
        className={[
          "h-full w-full rounded-[7px] border bg-card/85 backdrop-blur-sm px-2 flex flex-col justify-center overflow-hidden transition-colors duration-300",
          isSub ? "border-border/70 bg-card/65" : "border-border",
          node.type === "trigger" ? "border-l-2 border-l-primary/45" : "",
          lit ? "!border-primary/60" : "",
        ].join(" ")}
      >
        <div className="flex items-center gap-1.5">
          <Icon
            className={isSub ? "h-3 w-3 shrink-0 text-muted-foreground/70" : "h-3.5 w-3.5 shrink-0 text-muted-foreground"}
            aria-hidden
          />
          {node.tag && (
            <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/80 truncate">
              {node.tag}
            </span>
          )}
        </div>
        <div
          className={[
            "leading-[1.15] mt-0.5",
            isSub
              ? "font-mono text-[10px] text-muted-foreground/80 truncate"
              : "font-sans text-[11px] text-foreground/90 line-clamp-2",
          ].join(" ")}
        >
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
              strokeWidth={e.dotted ? 1 : 1.5}
              strokeLinecap="round"
              strokeDasharray={e.dotted ? "1 5" : undefined}
              opacity={e.dotted ? 0.5 : 0.7}
            />
            {!e.dotted && (
              <>
                <circle cx={a.x} cy={a.y} r={2.4} fill="hsl(30 6% 28%)" />
                <circle cx={b.x} cy={b.y} r={2.4} fill="hsl(30 6% 28%)" />
              </>
            )}
          </g>
        );
      })}
    </>
  );
}

// One readable description so assistive tech gets the meaning of the graph
// without parsing a pile of absolutely-positioned cards.
const CANVAS_ARIA =
  "Diagram of a real n8n multi-agent workflow: a chat-message trigger flows into input normalization, a Product Manager AI agent with chat-model and memory sub-nodes, and an Incident Summary agent, then a router that fans out to specialist agents — Deductive, Product Profile, and Quick Isolation — each with its own chat model.";

// Panel chrome + background layers shared by every variant.
function CanvasFrame({ stage, children, nodeCount }: { stage: Stage; children: React.ReactNode; nodeCount: number }) {
  return (
    <div className="relative">
      {/* Single soft depth glow behind the panel — the one light source */}
      <div
        aria-hidden
        className="absolute -inset-5 -z-10 rounded-3xl opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle at 60% 35%, hsl(45 93% 54% / 0.10), transparent 65%)" }}
      />
      <div
        role="img"
        aria-label={CANVAS_ARIA}
        className="rounded-xl border border-border bg-card/60 backdrop-blur-sm shadow-xl shadow-black/30 overflow-hidden"
      >
        {/* Chrome strip — honest workflow label, quiet status (no traffic-lights, no ping) */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-secondary/40">
          <GitBranch className="h-3 w-3 text-primary/80" aria-hidden />
          <span className="font-mono text-[11px] text-muted-foreground tracking-wide">
            multi-agent-orchestration
          </span>
          <span className="font-mono text-[10px] text-muted-foreground/55">· n8n</span>
          <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-primary/50" aria-hidden />
            {nodeCount} nodes
          </span>
        </div>

        {/* Stage — fixed aspect so %-positioned cards lock to the SVG viewBox */}
        <div className="relative w-full" style={{ aspectRatio: `${stage.w} / ${stage.h}` }}>
          {/* Faint local dot-grid, radial-masked so it melts at the edges */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(hsl(40 25% 96% / 0.045) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
              WebkitMaskImage: "radial-gradient(ellipse at center, black 55%, transparent 100%)",
              maskImage: "radial-gradient(ellipse at center, black 55%, transparent 100%)",
            }}
          />
          {children}
        </div>

        <div className="px-3 py-2 border-t border-border bg-secondary/30">
          <span className="font-mono text-[10px] tracking-wide text-muted-foreground/70">
            a real flow — curated for legibility
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Live desktop canvas: draw-in, group float, single traveling data-pulse.
function LiveCanvas() {
  const find = lookupFor(NODES);
  const pulseEdges = EDGES.filter((e) => e.pulse);
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Pause when offscreen or in a background tab — no wasted timers.
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    let onscreen = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        onscreen = entry.isIntersecting;
        setRunning(onscreen && !document.hidden);
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    const onVis = () => setRunning(onscreen && !document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % pulseEdges.length);
    }, 1700);
    return () => window.clearInterval(id);
  }, [running, pulseEdges.length]);

  const activeEdge = pulseEdges[active];
  const litNodeId = running ? activeEdge?.to : null;

  return (
    <div ref={panelRef}>
      <CanvasFrame stage={STAGE} nodeCount={NODES.length}>
        <motion.div
          className="absolute inset-0"
          animate={{ y: [0, -2.5, 0] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Connectors + ports */}
          <svg
            aria-hidden
            className="absolute inset-0 h-full w-full"
            viewBox={`0 0 ${STAGE.w} ${STAGE.h}`}
            preserveAspectRatio="none"
            fill="none"
          >
            <EdgeLayer edges={EDGES} find={find} />
            {/* The one sign of life: a single bright dash crossing the active edge */}
            {running && activeEdge && (
              <motion.path
                key={active}
                d={edgePath(activeEdge, find)}
                fill="none"
                stroke="hsl(45 93% 54%)"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeDasharray="16 600"
                initial={{ strokeDashoffset: 16, opacity: 0 }}
                animate={{ strokeDashoffset: -600, opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.5, ease: "easeInOut", times: [0, 0.1, 0.85, 1] }}
              />
            )}
          </svg>

          {/* Node cards, drawn in flow order */}
          {NODES.map((n, i) => (
            <motion.div
              key={n.id}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.05, ease: "easeOut" }}
            >
              <NodeCard node={n} stage={STAGE} lit={litNodeId === n.id} />
            </motion.div>
          ))}
        </motion.div>
      </CanvasFrame>
    </div>
  );
}

// ── Static canvas: reduced-motion (full graph, one edge pre-lit) or mobile
//    (compact trimmed graph). No timers, no draw-in.
function StaticCanvas({ mobile = false }: { mobile?: boolean }) {
  const nodes = mobile ? MOBILE_NODES : NODES;
  const edges = mobile ? MOBILE_EDGES : EDGES;
  const stage = mobile ? MOBILE_STAGE : STAGE;
  const find = lookupFor(nodes);
  const litTarget = mobile ? null : "edit"; // desktop reduced-motion: pre-light first hop's destination
  return (
    <CanvasFrame stage={stage} nodeCount={nodes.length}>
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${stage.w} ${stage.h}`}
        preserveAspectRatio="none"
        fill="none"
      >
        <EdgeLayer edges={edges} find={find} />
        {/* One edge frozen in the "live" style so the graph still reads as flowing */}
        {!mobile && (
          <path d={edgePath(edges[0], find)} fill="none" stroke="hsl(45 93% 54%)" strokeWidth={1.8} strokeLinecap="round" opacity={0.85} />
        )}
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
