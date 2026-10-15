import type { CSSProperties, ReactNode } from "react";
import { motion, useMotionValue, useTransform, type MotionValue } from "motion/react";
import { Aperture, Bot, Braces, Brain, Database, MessagesSquare, Pencil, Signpost, Webhook, Zap, type LucideIcon } from "lucide-react";
import {
  AGENT_PORTS,
  BEATS,
  EDGES,
  FILLED_PORTS,
  NODES,
  ROUTE_OUTPUT,
  SAMPLE,
  SIZE,
  SWITCH_OUTPUTS,
  TALL_EDGES,
  TALL_NODES,
  TALL_OUTPUT_LABELS,
  TALL_VIEWBOX,
  VIEWBOX,
  type Beat,
  type RunEdge,
  type RunNode,
  type TallNode,
} from "./RunCanvas.data";

/**
 * RunCanvas: his real Multi-Agent Orchestration System canvas, redrawn as
 * vectors, playing one SAMPLE run off a progress value (0..1). It moves only
 * when the visitor scrolls, one step at a time, and ends and holds: no loops,
 * no particles, no glow. Nothing re-renders on scroll; every moving part reads
 * a MotionValue.
 *
 * Two layouts of the same 19 nodes and wiring:
 *   wide  the real canvas, node for node (it lines up with the hero's far
 *         canvas image when drawn in that image's box)
 *   tall  the phone layout, top to bottom, names inside the boxes
 *
 * State language (one accent, no second hue):
 *   idle    the canvas as it sits: dim warm lines
 *   done    brighter outline, name and icon, a small tick; its wire turns solid
 *   active  the one yellow 2px outline, on the node working right now
 *
 * Layers, for a smooth scroll on integrated graphics: the idle drawing is
 * painted once; wires draw on their own path-only layer; finished nodes and
 * the outline change by opacity steps on a third. Hidden layers rest at
 * 0.001 so the browser prepares them before the first scroll.
 */

export type Layout = "wide" | "tall";

const HIDDEN = 0.001;

// ---------------------------------------------------------------------------
// Colours: the page's own tokens (no n8n brand colours).

const C = {
  fill: "hsl(30 6% 9.5%)",
  fillDone: "hsl(30 6% 12.5%)",
  line: "hsl(40 25% 96% / 0.17)",
  lineDone: "hsl(40 25% 96% / 0.66)",
  ink: "hsl(40 25% 96% / 0.56)",
  inkDone: "hsl(40 25% 96% / 0.96)",
  faint: "hsl(40 25% 96% / 0.34)",
  accent: "hsl(var(--primary))",
} as const;

const ICON_OF: Record<string, LucideIcon> = {
  webhook: Webhook,
  chat: MessagesSquare,
  normalize: Pencil,
  router: Braces,
  switch: Signpost,
  pmMemory: Database,
  pmThink: Brain,
};
/** Agents get the robot, model sub-nodes a neutral aperture glyph (never the OpenAI mark). */
const iconFor = (id: string): LucideIcon => ICON_OF[id] ?? (id.endsWith("Model") ? Aperture : Bot);

// ---------------------------------------------------------------------------
// Geometry and timing, built once per layout at module scope.

type Pt = [number, number];
type Box = { x: number; y: number; w: number; h: number };

const segLen = (a: Pt, b: Pt) => Math.hypot(b[0] - a[0], b[1] - a[1]);

/** n8n draws wires as S curves; sub-node (AI) wires rise from the circle into the agent's port. */
function curvePts(e: RunEdge): [Pt, Pt, Pt, Pt] {
  const [[x1, y1], [x2, y2]] = e.pts;
  if (e.kind === "ai") {
    const dy = Math.abs(y2 - y1) / 2;
    return [[x1, y1], [x1, y1 - dy], [x2, y2 + dy], [x2, y2]];
  }
  const dx = Math.max(24, Math.abs(x2 - x1) / 2);
  return [[x1, y1], [x1 + dx, y1], [x2 - dx, y2], [x2, y2]];
}

function edgeD(e: RunEdge) {
  if (e.shape === "curve") {
    const [a, b, c, d] = curvePts(e);
    return `M${a[0]},${a[1]} C${b[0]},${b[1]} ${c[0]},${c[1]} ${d[0]},${d[1]}`;
  }
  return e.pts.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ");
}

function polyline(e: RunEdge): Pt[] {
  if (e.shape === "line") return e.pts;
  const [a, b, c, d] = curvePts(e);
  const out: Pt[] = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    const k = 1 - t;
    out.push([
      k * k * k * a[0] + 3 * k * k * t * b[0] + 3 * k * t * t * c[0] + t * t * t * d[0],
      k * k * k * a[1] + 3 * k * k * t * b[1] + 3 * k * t * t * c[1] + t * t * t * d[1],
    ]);
  }
  return out;
}

const lengthOf = (e: RunEdge) => {
  const p = polyline(e);
  let l = 0;
  for (let i = 1; i < p.length; i++) l += segLen(p[i - 1], p[i]);
  return l;
};

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const smooth = (t: number) => t * t * (3 - 2 * t);

/** Inside a beat [a, b]: its wires draw first, then its nodes finish. */
const phase = (beat: Beat) => {
  const [a, b] = beat.at;
  const span = b - a;
  return { travel: [a, a + span * 0.5] as const, lit: [a + span * 0.42, a + span * 0.6] as const };
};

type Plan = {
  vb: { x: number; y: number; w: number; h: number };
  edges: RunEdge[];
  edgeById: Record<string, RunEdge>;
  /** Where each wire's draw starts and ends, in run progress. */
  draw: Record<string, [number, number]>;
  /** When each node finishes. */
  lit: Record<string, [number, number]>;
  /** The window each node holds the accent. */
  accent: Record<string, [number, number]>;
  boxOf: (id: string) => Box;
  focus: (v: number) => Pt;
};

/** The reply comes back over this window; its bubble takes the accent at the end of it. */
const REPLY_BEAT = BEATS.find((b) => b.id === "reply")!;
export const REPLY_IN = [REPLY_BEAT.at[0], REPLY_BEAT.at[0] + (REPLY_BEAT.at[1] - REPLY_BEAT.at[0]) * 0.42] as const;

function makePlan(layout: Layout): Plan {
  const edges = layout === "wide" ? EDGES : TALL_EDGES;
  const edgeById = Object.fromEntries(edges.map((e) => [e.id, e]));
  const boxOf = (id: string): Box => {
    if (layout === "tall") {
      const n = TALL_NODES.find((t) => t.id === id)!;
      return { x: n.x - n.w / 2, y: n.y - n.h / 2, w: n.w, h: n.h };
    }
    const n = NODES.find((t) => t.id === id)!;
    const s = SIZE[n.kind];
    return { x: n.x - s.w / 2, y: n.y - s.h / 2, w: s.w, h: s.h };
  };
  const centre = (id: string): Pt => {
    const b = boxOf(id);
    return [b.x + b.w / 2, b.y + b.h / 2];
  };

  const draw: Plan["draw"] = {};
  for (const beat of BEATS) {
    const [t0, t1] = phase(beat).travel;
    const total = beat.travel.reduce((s, id) => s + lengthOf(edgeById[id]), 0);
    let acc = t0;
    for (const id of beat.travel) {
      const share = ((t1 - t0) * lengthOf(edgeById[id])) / (total || 1);
      draw[id] = [acc, acc + share];
      acc += share;
    }
  }

  const lit: Plan["lit"] = {};
  const accent: Plan["accent"] = {};
  BEATS.forEach((beat, i) => {
    const l = phase(beat).lit;
    beat.nodes.forEach((id) => (lit[id] = [l[0], l[1]]));
    if (beat.nodes.length) {
      const next = BEATS.slice(i + 1).find((b) => b.nodes.length);
      accent[beat.nodes[0]] = [l[0], next ? phase(next).lit[0] : layout === "tall" ? 1.01 : REPLY_IN[1]];
    }
  });
  // The issue has already arrived when the run starts: the chat trigger is lit and holds the accent.
  lit.chat = [0, 0.04];
  accent.chat = [0, accent.chat[1]];

  /** The point the view should watch: the node at work, or the head of the wire being drawn. */
  const focus = (v: number): Pt => {
    for (const id of Object.keys(draw)) {
      const [a, b] = draw[id];
      if (v >= a && v <= b) {
        const e = edgeById[id];
        return e.pts[e.pts.length - 1];
      }
    }
    let last = centre("chat");
    for (const beat of BEATS) {
      if (v < beat.at[0]) break;
      if (beat.nodes.length) last = centre(beat.nodes[0]);
    }
    return last;
  };

  return { vb: layout === "wide" ? VIEWBOX : TALL_VIEWBOX, edges, edgeById, draw, lit, accent, boxOf, focus };
}

export const PLANS: Record<Layout, Plan> = { wide: makePlan("wide"), tall: makePlan("tall") };

// ---------------------------------------------------------------------------

type Props = {
  layout: Layout;
  /** Run progress, 0..1. Leave out for the finished run (static pages). */
  run?: MotionValue<number>;
  /** One canvas unit as a CSS length, e.g. "calc(100cqw / 1015.1)". */
  unit: string;
  className?: string;
  style?: CSSProperties;
};

export function RunCanvas({ layout, run, unit, className = "", style }: Props) {
  const finished = useMotionValue(1);
  const v = run ?? finished;
  const plan = PLANS[layout];
  const { vb } = plan;
  const viewBox = `${vb.x} ${vb.y} ${vb.w} ${vb.h}`;
  const box: CSSProperties = {
    ["--u" as string]: unit,
    width: `calc(${unit} * ${vb.w})`,
    height: `calc(${unit} * ${vb.h})`,
    ...style,
  };
  const svg = "absolute inset-0 h-full w-full overflow-visible";

  return (
    <div aria-hidden className={`relative select-none font-sans ${className}`} style={box}>
      {/* 1. The idle drawing: painted once. */}
      <svg viewBox={viewBox} className={svg}>
        {layout === "wide" ? <WideIdle /> : <TallIdle />}
      </svg>

      {/* 2. Wires that turn solid as the issue passes: paths only, on their own layer. */}
      <svg viewBox={viewBox} className={svg} style={{ willChange: "transform" }}>
        {plan.edges
          .filter((e) => plan.draw[e.id])
          .map((e) => (
            <LitWire key={e.id} edge={e} plan={plan} v={v} />
          ))}
        {BEATS.flatMap((b) => b.wires ?? []).map((id) => (
          <LitAiWire key={id} edge={plan.edgeById[id]} plan={plan} v={v} />
        ))}
      </svg>

      {/* 3. Finished nodes and the accent: opacity steps. */}
      <svg viewBox={viewBox} className={svg}>
        <SwitchPick layout={layout} plan={plan} v={v} />
        {Object.keys(plan.lit).map((id) => (
          <Done key={id} id={id} layout={layout} plan={plan} v={v} />
        ))}
        {Object.keys(plan.accent).map((id) => (
          <Accent key={id} id={id} layout={layout} plan={plan} v={v} />
        ))}
      </svg>

    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared marks

const diamond = (x: number, y: number, r: number) => `M${x},${y - r} L${x + r},${y} L${x},${y + r} L${x - r},${y} Z`;

const Arrow = ({ at, dir, color }: { at: Pt; dir: "r" | "d"; color: string }) => {
  const [x, y] = at;
  const d =
    dir === "r"
      ? `M${x - 5},${y - 3} L${x - 0.6},${y} L${x - 5},${y + 3} Z`
      : `M${x - 3},${y - 5} L${x},${y - 0.6} L${x + 3},${y - 5} Z`;
  return <path d={d} fill={color} />;
};

/** Which way a wire's last run points, for its arrowhead. */
const endDir = (e: RunEdge): "r" | "d" => {
  const p = polyline(e);
  const [a, b] = [p[p.length - 2], p[p.length - 1]];
  return Math.abs(b[0] - a[0]) >= Math.abs(b[1] - a[1]) ? "r" : "d";
};

/** n8n's success tick, in the page's ink. */
const Tick = ({ x, y }: { x: number; y: number }) => (
  <g>
    <circle cx={x} cy={y} r={4.4} fill={C.fillDone} stroke={C.lineDone} strokeWidth={0.8} />
    <path
      d={`M${x - 2},${y} L${x - 0.5},${y + 1.6} L${x + 2.2},${y - 1.6}`}
      fill="none"
      stroke={C.inkDone}
      strokeWidth={1.15}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </g>
);

const Glyph = ({ id, x, y, size, color }: { id: string; x: number; y: number; size: number; color: string }) => {
  const Icon = iconFor(id);
  return <Icon x={x - size / 2} y={y - size / 2} width={size} height={size} strokeWidth={1.6} style={{ color }} />;
};

// ---------------------------------------------------------------------------
// Wide layout: the real canvas

const WIDE_FONT = 7.6;
const byId = Object.fromEntries(NODES.map((n) => [n.id, n])) as Record<string, RunNode>;

function WideIdle() {
  const plan = PLANS.wide;
  return (
    <g>
      {plan.edges.map((e) => (
        <path
          key={e.id}
          d={edgeD(e)}
          fill="none"
          stroke={C.line}
          strokeWidth={1.1}
          strokeDasharray={e.kind === "ai" ? "3 3" : undefined}
          strokeLinejoin="round"
        />
      ))}
      {plan.edges
        .filter((e) => e.kind === "main")
        .map((e) => (
          <Arrow key={e.id} at={e.pts[e.pts.length - 1]} dir={endDir(e)} color={C.line} />
        ))}
      {NODES.map((n) => (
        <WideNode key={n.id} node={n} lit={false} />
      ))}
      {SWITCH_OUTPUTS.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={2.4} fill={C.fill} stroke={C.line} strokeWidth={0.9} />
          <text x={x + 5} y={y - 2.5} fontSize={4.4} style={{ fill: C.faint }}>
            {i}
          </text>
        </g>
      ))}
      {OUTPUT_STUBS.map(([x, y], i) => (
        <PlusStub key={i} x={x} y={y} lead={[x - 24, y]} />
      ))}
    </g>
  );
}

/** The "+" after each specialist's output: nothing is wired after them. */
const OUTPUT_STUBS: Pt[] = [
  [281, 300],
  [478, 300],
  [635, 300],
  [806, 307],
];

const PlusStub = ({ x, y, lead }: { x: number; y: number; lead: Pt }) => (
  <g>
    <line x1={lead[0]} y1={lead[1]} x2={lead[0] === x ? x : x - 4} y2={lead[0] === x ? y - 4 : y} stroke={C.line} strokeWidth={0.9} />
    <rect x={x - 3.6} y={y - 3.6} width={7.2} height={7.2} rx={1.4} fill={C.fill} stroke={C.line} strokeWidth={0.8} />
    <path d={`M${x - 1.8},${y} H${x + 1.8} M${x},${y - 1.8} V${y + 1.8}`} stroke={C.faint} strokeWidth={0.7} />
  </g>
);

function WideNode({ node: n, lit }: { node: RunNode; lit: boolean }) {
  const b = PLANS.wide.boxOf(n.id);
  const stroke = lit ? C.lineDone : C.line;
  const ink = lit ? C.inkDone : C.ink;
  const fill = lit ? C.fillDone : C.fill;
  const icon = n.kind === "agent" || n.kind === "circle" ? 13 : 16;

  let shape: ReactNode;
  if (n.kind === "circle") {
    shape = <circle cx={n.x} cy={n.y} r={b.w / 2} fill={fill} stroke={stroke} strokeWidth={1} />;
  } else if (n.kind === "trigger") {
    // n8n triggers are rounded on the left.
    const r = b.h / 2;
    shape = (
      <path
        d={`M${b.x + r},${b.y} H${b.x + b.w - 5} Q${b.x + b.w},${b.y} ${b.x + b.w},${b.y + 5} V${b.y + b.h - 5} Q${b.x + b.w},${b.y + b.h} ${b.x + b.w - 5},${b.y + b.h} H${b.x + r} A${r},${r} 0 0 1 ${b.x + r},${b.y} Z`}
        fill={fill}
        stroke={stroke}
        strokeWidth={1}
      />
    );
  } else {
    shape = <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={5} fill={fill} stroke={stroke} strokeWidth={1} />;
  }

  const handles: Pt[] = [];
  if (n.kind === "square" || n.kind === "agent" || n.kind === "switch") handles.push([b.x, n.y]);
  if (n.kind !== "circle" && n.kind !== "switch") handles.push([b.x + b.w, n.y]);
  const filled = FILLED_PORTS[n.id] ?? [];

  return (
    <g>
      {shape}
      {handles.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.6} fill={C.fill} stroke={stroke} strokeWidth={0.9} />
      ))}
      <Glyph id={n.id} x={n.kind === "agent" ? b.x + 14.5 : n.x} y={n.y} size={icon} color={ink} />
      {n.kind === "trigger" && (
        <Zap x={b.x - 15} y={n.y - 5} width={8} height={10} strokeWidth={1.6} style={{ color: lit ? C.inkDone : C.faint }} />
      )}
      <WideLabel node={n} ink={ink} />
      {n.kind === "agent" &&
        AGENT_PORTS.map((port) => {
          const x = n.x + port.dx;
          const y = b.y + b.h;
          return (
            <g key={port.label}>
              <path d={diamond(x, y, 2.6)} fill={C.fill} stroke={stroke} strokeWidth={0.9} />
              <text x={x} y={y + 8.5} textAnchor="middle" fontSize={4.6} style={{ fill: port.required ? ink : C.faint }}>
                {port.label}
                {port.required ? "*" : ""}
              </text>
              {!filled.includes(port.label) && !lit && <PlusStub x={x} y={y + 27.6} lead={[x, y + 11]} />}
            </g>
          );
        })}
      {n.kind === "circle" && n.handle && (
        <>
          <path d={diamond(n.x, b.y, 2.6)} fill={C.fill} stroke={stroke} strokeWidth={0.9} />
          <text x={n.x} y={b.y - 5} textAnchor="middle" fontSize={4.8} style={{ fill: lit ? C.ink : C.faint }}>
            {n.handle}
          </text>
        </>
      )}
      {lit &&
        (n.kind === "circle" ? (
          <Tick x={n.x + (b.w / 2) * 0.7071} y={n.y - (b.w / 2) * 0.7071} />
        ) : (
          <Tick x={b.x + b.w - 1} y={b.y + 1} />
        ))}
    </g>
  );
}

function WideLabel({ node: n, ink }: { node: RunNode; ink: string }) {
  const b = PLANS.wide.boxOf(n.id);
  const lh = WIDE_FONT * 1.18;
  if (n.kind === "agent") {
    const x = b.x + 26;
    const first = n.y - ((n.label.length - 1) * lh) / 2 + WIDE_FONT * 0.36;
    return (
      <text fontSize={WIDE_FONT} fontWeight={600} style={{ fill: ink }}>
        {n.label.map((line, i) => (
          <tspan key={i} x={x} y={first + i * lh}>
            {line}
          </tspan>
        ))}
      </text>
    );
  }
  const top = b.y + b.h + (n.kind === "circle" ? 10 : 11);
  return (
    <text textAnchor="middle" fontSize={WIDE_FONT} fontWeight={600} style={{ fill: ink }}>
      {n.label.map((line, i) => (
        <tspan key={i} x={n.x} y={top + i * lh}>
          {line}
        </tspan>
      ))}
      {n.sub && (
        <tspan x={n.x} y={top + n.label.length * lh - 0.5} fontSize={5.2} fontWeight={400} style={{ fill: C.faint }}>
          {n.sub}
        </tspan>
      )}
    </text>
  );
}

// ---------------------------------------------------------------------------
// Tall layout: the phone

const TALL_FONT = 11;
const tallById = Object.fromEntries(TALL_NODES.map((n) => [n.id, n])) as Record<string, TallNode>;

function TallIdle() {
  const plan = PLANS.tall;
  return (
    <g>
      {plan.edges.map((e) => (
        <path
          key={e.id}
          d={edgeD(e)}
          fill="none"
          stroke={C.line}
          strokeWidth={1.2}
          strokeDasharray={e.kind === "ai" ? "3 3" : undefined}
          strokeLinejoin="round"
        />
      ))}
      {plan.edges
        .filter((e) => e.kind === "main")
        .map((e) => (
          <Arrow key={e.id} at={e.pts[e.pts.length - 1]} dir={endDir(e)} color={C.line} />
        ))}
      {TALL_NODES.map((n) => (
        <TallNodeView key={n.id} node={n} lit={false} />
      ))}
      {TALL_OUTPUT_LABELS.map(([x, y], i) => (
        <text key={i} x={x} y={y} fontSize={8.5} style={{ fill: C.faint }}>
          {i}
        </text>
      ))}
    </g>
  );
}

function TallNodeView({ node: n, lit }: { node: TallNode; lit: boolean }) {
  const b = PLANS.tall.boxOf(n.id);
  const stroke = lit ? C.lineDone : C.line;
  const ink = lit ? C.inkDone : C.ink;
  const fill = lit ? C.fillDone : C.fill;

  if (n.shape === "circle") {
    const r = n.w / 2;
    return (
      <g>
        <circle cx={n.x} cy={n.y} r={r} fill={fill} stroke={stroke} strokeWidth={1} />
        <Glyph id={n.id} x={n.x} y={n.y} size={r * 1.05} color={ink} />
        <text textAnchor="middle" fontSize={8.5} fontWeight={600} style={{ fill: ink }}>
          {n.label.map((line, i) => (
            <tspan key={i} x={n.x} y={n.y + r + 10.5 + i * 10}>
              {line}
            </tspan>
          ))}
        </text>
        {lit && <Tick x={n.x + r * 0.7071} y={n.y - r * 0.7071} />}
      </g>
    );
  }

  const r = n.shape === "trigger" ? b.h / 2 : 6;
  const d =
    n.shape === "trigger"
      ? `M${b.x + r},${b.y} H${b.x + b.w - 6} Q${b.x + b.w},${b.y} ${b.x + b.w},${b.y + 6} V${b.y + b.h - 6} Q${b.x + b.w},${b.y + b.h} ${b.x + b.w - 6},${b.y + b.h} H${b.x + r} A${r},${r} 0 0 1 ${b.x + r},${b.y} Z`
      : undefined;
  const iconX = b.x + (n.shape === "trigger" ? 18 : 15);
  const textX = iconX + 12;
  const lh = TALL_FONT * 1.12;
  const first = n.y - ((n.label.length - 1) * lh) / 2 + TALL_FONT * 0.36;
  return (
    <g>
      {d ? (
        <path d={d} fill={fill} stroke={stroke} strokeWidth={1} />
      ) : (
        <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={r} fill={fill} stroke={stroke} strokeWidth={1} />
      )}
      <Glyph id={n.id} x={iconX} y={n.y} size={13} color={ink} />
      <text fontSize={TALL_FONT} fontWeight={600} style={{ fill: ink }}>
        {n.label.map((line, i) => (
          <tspan key={i} x={textX} y={first + i * lh}>
            {line}
          </tspan>
        ))}
      </text>
      {n.sub && (
        <text x={b.x + b.w - 8} y={n.y + 3.5} textAnchor="end" fontSize={8.5} style={{ fill: C.faint }}>
          {n.sub}
        </text>
      )}
      {lit && <Tick x={b.x + b.w - 1} y={b.y + 1} />}
    </g>
  );
}

// ---------------------------------------------------------------------------
// The run

type Part = { plan: Plan; v: MotionValue<number> };

function LitWire({ edge, plan, v }: Part & { edge: RunEdge }) {
  const [a, b] = plan.draw[edge.id];
  const pathLength = useTransform(v, (x) => smooth(clamp01((x - a) / (b - a))));
  const opacity = useTransform(v, (x) => (x > a ? 1 : HIDDEN));
  const head = useTransform(v, (x) => (x >= b ? 1 : HIDDEN));
  return (
    <g>
      <motion.path
        d={edgeD(edge)}
        fill="none"
        stroke={C.lineDone}
        strokeWidth={1.35}
        strokeLinejoin="round"
        style={{ pathLength, opacity }}
      />
      <motion.g style={{ opacity: head }}>
        <Arrow at={edge.pts[edge.pts.length - 1]} dir={endDir(edge)} color={C.lineDone} />
      </motion.g>
    </g>
  );
}

/** Sub-node wires are dashed, so they light by fading rather than drawing. */
function LitAiWire({ edge, plan, v }: Part & { edge: RunEdge }) {
  const [a, b] = plan.lit[edge.from];
  const opacity = useTransform(v, (x) => Math.max(HIDDEN, clamp01((x - a) / (b - a))));
  return (
    <motion.path d={edgeD(edge)} fill="none" stroke={C.lineDone} strokeWidth={1.25} strokeDasharray="3 3" style={{ opacity }} />
  );
}

/** The Switch shows which of its four outputs the issue took. */
function SwitchPick({ layout, plan, v }: Part & { layout: Layout }) {
  const [a, b] = plan.lit.switch;
  const opacity = useTransform(v, (x) => Math.max(HIDDEN, clamp01((x - a) / (b - a))));
  if (layout === "tall") {
    const [x, y] = TALL_OUTPUT_LABELS[ROUTE_OUTPUT];
    return (
      <motion.text x={x} y={y} fontSize={8.5} fontWeight={700} style={{ fill: C.inkDone, opacity }}>
        {ROUTE_OUTPUT}
      </motion.text>
    );
  }
  const [x, y] = SWITCH_OUTPUTS[ROUTE_OUTPUT];
  return (
    <motion.g style={{ opacity }}>
      <circle cx={x} cy={y} r={2.6} fill={C.inkDone} />
      <text x={x + 5} y={y - 2.5} fontSize={4.4} fontWeight={700} style={{ fill: C.inkDone }}>
        {ROUTE_OUTPUT}
      </text>
    </motion.g>
  );
}

function Done({ id, layout, plan, v }: Part & { id: string; layout: Layout }) {
  const [a, b] = plan.lit[id];
  const opacity = useTransform(v, (x) => Math.max(HIDDEN, smooth(clamp01((x - a) / (b - a)))));
  return (
    <motion.g style={{ opacity }}>
      {layout === "wide" ? <WideNode node={byId[id]} lit /> : <TallNodeView node={tallById[id]} lit />}
    </motion.g>
  );
}

/** The one moving accent: a 2px yellow outline, one per stop, never resized. */
function Accent({ id, layout, plan, v }: Part & { id: string; layout: Layout }) {
  const [a, b] = plan.accent[id];
  const opacity = useTransform(v, (x) => (x >= a && x < b ? 1 : HIDDEN));
  const box = plan.boxOf(id);
  const pad = layout === "wide" ? 3.5 : 4;
  const round = layout === "wide" ? byId[id].kind === "circle" : tallById[id].shape === "circle";
  return (
    <motion.g style={{ opacity }}>
      {round ? (
        <circle
          cx={box.x + box.w / 2}
          cy={box.y + box.h / 2}
          r={box.w / 2 + pad}
          fill="none"
          stroke={C.accent}
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        />
      ) : (
        <rect
          x={box.x - pad}
          y={box.y - pad}
          width={box.w + pad * 2}
          height={box.h + pad * 2}
          rx={layout === "wide" ? 7 : 9}
          fill="none"
          stroke={C.accent}
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        />
      )}
    </motion.g>
  );
}

// ---------------------------------------------------------------------------

/**
 * n8n's chat panel, as it opens beside the canvas when you test a chat
 * trigger: the sample issue goes in at the start, and the specialist's first
 * step comes back at the end, taking the accent. It sits outside the moving
 * canvas, so the conversation stays readable while the view follows the run.
 */
export function RunChat({ run, className = "" }: { run?: MotionValue<number>; className?: string }) {
  const finished = useMotionValue(1);
  const v = run ?? finished;
  const ramp = (a: number, b: number) => (x: number) => smooth(clamp01((x - a) / (b - a)));
  const inT = ramp(0, 0.05);
  const outT = ramp(REPLY_IN[0], REPLY_IN[1]);
  const inOpacity = useTransform(v, (x) => Math.max(HIDDEN, inT(x)));
  const inY = useTransform(v, (x) => 8 * (1 - inT(x)));
  const outOpacity = useTransform(v, (x) => Math.max(HIDDEN, outT(x)));
  const outY = useTransform(v, (x) => 8 * (1 - outT(x)));
  const outline = useTransform(v, (x) => (x >= REPLY_IN[1] ? 1 : HIDDEN));
  return (
    <div aria-hidden className={`rounded-[10px] border border-border bg-[hsl(var(--surface))] p-3 shadow-[var(--e2)] ${className}`}>
      <p className="label-mono text-muted-foreground">Chat · sample run</p>
      <motion.p
        className="ml-auto mt-3 w-fit max-w-[88%] rounded-lg rounded-br-sm bg-[hsl(var(--surface-2))] px-3 py-2 text-[13px] leading-snug text-foreground"
        style={{ opacity: inOpacity, y: inY }}
      >
        {SAMPLE.input}
      </motion.p>
      <motion.div className="relative mt-2.5 w-fit max-w-[88%]" style={{ opacity: outOpacity, y: outY }}>
        <p className="rounded-lg rounded-bl-sm border border-border bg-background px-3 py-2 text-[13px] leading-snug text-foreground">
          {SAMPLE.output}
        </p>
        <motion.span className="absolute -inset-[3px] rounded-[10px] border-2 border-primary" style={{ opacity: outline }} />
      </motion.div>
    </div>
  );
}
