// The Multi-Agent Orchestration System canvas (part of the DeductiveLabs
// engine, Workshop row 1), redrawn as vectors. Every node box, port and wire
// was measured from the real n8n screenshot (src/assets/desk/workshop/
// multi-agent-full.webp, 1592x697): canvas units are x = 0.66*px + 9 and
// y = 0.66*py - 8. The same units line up node for node with the hero's far
// canvas image (far-canvas.webp) when drawn in VIEWBOX over that image's box.
//
// The run is a SAMPLE: one made-up support issue, routed the way the real
// Switch's wiring allows. Labels stay at the level of the node names and the
// public description ("Routes each support issue to one of four specialist
// agents"); the real prompts are not shown.

export type NodeKind = "trigger" | "square" | "agent" | "circle" | "switch";

export type RunNode = {
  id: string;
  kind: NodeKind;
  /** Centre, in canvas units. */
  x: number;
  y: number;
  /** Label lines (agents: inside the box; everything else: under it). */
  label: string[];
  /** Small muted line under the label (n8n's parameter hint). */
  sub?: string;
  icon: "webhook" | "chat" | "pencil" | "robot" | "model" | "memory" | "brain" | "braces" | "signpost";
  /** Circles: the word over their top handle. */
  handle?: string;
};

export const VIEWBOX = { x: 44.6, y: 30.9, w: 1015.1, h: 418.4 };

/** Box sizes in canvas units. */
export const SIZE = {
  square: { w: 41, h: 41 },
  trigger: { w: 41, h: 41 },
  agent: { w: 95, h: 41 },
  switch: { w: 41, h: 68 },
  circle: { w: 34, h: 34 },
} as const;

export const NODES: RunNode[] = [
  { id: "webhook", kind: "trigger", x: 280, y: 35, label: ["Webhook"], icon: "webhook" },
  { id: "chat", kind: "trigger", x: 280, y: 109, label: ["When chat message", "received"], icon: "chat" },
  { id: "normalize", kind: "square", x: 417, y: 75, label: ["Normalize Input"], sub: "manual", icon: "pencil" },
  { id: "pm", kind: "agent", x: 566, y: 75, label: ["Product Manager", "Agent"], icon: "robot" },
  { id: "pmModel", kind: "circle", x: 474, y: 161, label: ["OpenAI Chat Model"], icon: "model", handle: "Model" },
  { id: "pmMemory", kind: "circle", x: 542, y: 161, label: ["Simple Memory"], icon: "memory", handle: "Memory" },
  { id: "pmThink", kind: "circle", x: 597, y: 161, label: ["Think"], icon: "brain", handle: "Tool" },
  { id: "summary", kind: "agent", x: 743, y: 75, label: ["Incident", "Summary Agent"], icon: "robot" },
  { id: "summaryModel", kind: "circle", x: 672, y: 161, label: ["Incident Summary"], icon: "model", handle: "Model" },
  { id: "router", kind: "square", x: 900, y: 75, label: ["router + summary +", "userQuestion"], icon: "braces" },
  { id: "switch", kind: "switch", x: 893, y: 157, label: ["Switch"], sub: "mode: Rules", icon: "signpost" },
  { id: "deductive", kind: "agent", x: 205, y: 300, label: ["Deductive Agent"], icon: "robot" },
  { id: "deductiveModel", kind: "circle", x: 86, y: 392, label: ["Deductive Model"], icon: "model", handle: "Model" },
  { id: "profile", kind: "agent", x: 403, y: 300, label: ["Product Profile", "Agent"], icon: "robot" },
  { id: "profilerModel", kind: "circle", x: 277, y: 392, label: ["Profiler Model"], icon: "model", handle: "Model" },
  { id: "quickIso", kind: "agent", x: 559, y: 300, label: ["Quick Isolation", "Agent"], icon: "robot" },
  { id: "quickIsoModel", kind: "circle", x: 460, y: 399, label: ["Quick Isolation", "Model"], icon: "model", handle: "Model" },
  { id: "isolation", kind: "agent", x: 729, y: 307, label: ["Isolation Agent"], icon: "robot" },
  { id: "isolationModel", kind: "circle", x: 617, y: 406, label: ["Isolation Model"], icon: "model", handle: "Model" },
];

export type RunEdge = {
  id: string;
  from: string;
  to: string;
  kind: "main" | "ai";
  /** "line": straight or right-angled polyline through pts. "curve": an n8n-style S curve from pts[0] to pts[1]. */
  shape: "line" | "curve";
  pts: [number, number][];
};

export const EDGES: RunEdge[] = [
  { id: "webhook-normalize", from: "webhook", to: "normalize", kind: "main", shape: "curve", pts: [[300, 35], [396, 75]] },
  { id: "chat-normalize", from: "chat", to: "normalize", kind: "main", shape: "curve", pts: [[300, 109], [396, 75]] },
  { id: "normalize-pm", from: "normalize", to: "pm", kind: "main", shape: "line", pts: [[437, 75], [519, 75]] },
  { id: "pm-summary", from: "pm", to: "summary", kind: "main", shape: "line", pts: [[614, 75], [696, 75]] },
  { id: "summary-router", from: "summary", to: "router", kind: "main", shape: "line", pts: [[790, 75], [880, 75]] },
  {
    id: "router-switch", from: "router", to: "switch", kind: "main", shape: "line",
    pts: [[920, 75], [940, 75], [940, 131], [852, 131], [852, 157], [873, 157]],
  },
  {
    id: "switch-deductive", from: "switch", to: "deductive", kind: "main", shape: "line",
    pts: [[914, 137], [934, 137], [934, 192], [136, 192], [136, 300], [158, 300]],
  },
  {
    id: "switch-profile", from: "switch", to: "profile", kind: "main", shape: "line",
    pts: [[914, 150], [934, 150], [934, 206], [334, 206], [334, 300], [356, 300]],
  },
  {
    id: "switch-quickIso", from: "switch", to: "quickIso", kind: "main", shape: "line",
    pts: [[914, 164], [934, 164], [934, 219], [492, 219], [492, 300], [512, 300]],
  },
  {
    id: "switch-isolation", from: "switch", to: "isolation", kind: "main", shape: "line",
    pts: [[914, 178], [934, 178], [934, 233], [662, 233], [662, 307], [682, 307]],
  },
  { id: "pmModel-pm", from: "pmModel", to: "pm", kind: "ai", shape: "curve", pts: [[474, 144], [536, 96]] },
  { id: "pmMemory-pm", from: "pmMemory", to: "pm", kind: "ai", shape: "curve", pts: [[542, 144], [577, 96]] },
  { id: "pmThink-pm", from: "pmThink", to: "pm", kind: "ai", shape: "line", pts: [[597, 144], [597, 96]] },
  { id: "summaryModel-summary", from: "summaryModel", to: "summary", kind: "ai", shape: "curve", pts: [[672, 144], [713, 96]] },
  { id: "deductiveModel-deductive", from: "deductiveModel", to: "deductive", kind: "ai", shape: "curve", pts: [[86, 375], [175, 320]] },
  { id: "profilerModel-profile", from: "profilerModel", to: "profile", kind: "ai", shape: "curve", pts: [[277, 375], [373, 320]] },
  { id: "quickIsoModel-quickIso", from: "quickIsoModel", to: "quickIso", kind: "ai", shape: "curve", pts: [[460, 382], [529, 320]] },
  { id: "isolationModel-isolation", from: "isolationModel", to: "isolation", kind: "ai", shape: "curve", pts: [[617, 389], [699, 327]] },
];

/** Agent ports along the bottom edge (x offsets from the agent's centre), as in n8n. */
export const AGENT_PORTS = [
  { label: "Chat Model", required: true, dx: -30 },
  { label: "Memory", required: false, dx: 11 },
  { label: "Tool", required: false, dx: 31 },
] as const;

/** Which agent ports have a sub-node wired in (the rest show n8n's empty "+" stub). */
export const FILLED_PORTS: Record<string, string[]> = {
  pm: ["Chat Model", "Memory", "Tool"],
  summary: ["Chat Model"],
  deductive: ["Chat Model"],
  profile: ["Chat Model"],
  quickIso: ["Chat Model"],
  isolation: ["Chat Model"],
};

/** The four Switch outputs, top to bottom, in the order the wires leave it. */
export const SWITCH_OUTPUTS: [number, number][] = [
  [914, 137],
  [914, 150],
  [914, 164],
  [914, 178],
];

// ---------------------------------------------------------------------------
// The sample run: beats in order. Each beat lights its nodes and wires; the
// item travels the wires listed in `travel`. Shares are of the run's own
// progress (0..1), not of the page.

export type Beat = {
  id: string;
  /** Nodes that finish (brighten) in this beat; the first one carries the accent outline. */
  nodes: string[];
  /** Wires the item travels at the start of this beat, in order. */
  travel: string[];
  /** Wires that light with the nodes (sub-node wires). */
  wires?: string[];
  at: [number, number];
};

export const BEATS: Beat[] = [
  { id: "in", nodes: ["chat"], travel: [], at: [0, 0.1] },
  { id: "normalize", nodes: ["normalize"], travel: ["chat-normalize"], at: [0.1, 0.2] },
  {
    id: "pm",
    nodes: ["pm", "pmModel", "pmMemory", "pmThink"],
    travel: ["normalize-pm"],
    wires: ["pmModel-pm", "pmMemory-pm", "pmThink-pm"],
    at: [0.2, 0.38],
  },
  { id: "summary", nodes: ["summary", "summaryModel"], travel: ["pm-summary"], wires: ["summaryModel-summary"], at: [0.38, 0.52] },
  { id: "route", nodes: ["router", "switch"], travel: ["summary-router", "router-switch"], at: [0.52, 0.68] },
  {
    id: "specialist",
    nodes: ["quickIso", "quickIsoModel"],
    travel: ["switch-quickIso"],
    wires: ["quickIsoModel-quickIso"],
    at: [0.68, 0.86],
  },
  { id: "reply", nodes: [], travel: [], at: [0.86, 1] },
];

/** The lane the sample issue takes out of the Switch (output 2 of 0..3). */
export const ROUTE_OUTPUT = 2;

export const SAMPLE = {
  input: "The shared printer has been offline for everyone since this morning.",
  // In the spirit of the engine's public description ("walks IT support through
  // a diagnosis, one step at a time"); shown only as a labelled sample.
  output: "Let’s narrow it down first. Can any computer reach the printer?",
};

// ---------------------------------------------------------------------------
// Phone: the same 19 nodes and the same wiring, laid out top to bottom so the
// names stay readable on a narrow screen (labels sit inside the boxes). The
// Switch's four outputs share one bus down the left, so all four specialists
// are visible when it picks one. Units: TALL_VIEWBOX.w is the phone's width.

export type TallNode = {
  id: string;
  /** Centre and box size, in tall units. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** "pill": a box with its name inside; "trigger": the same, rounded on the left; "circle": a sub-node with its name under it. */
  shape: "pill" | "trigger" | "circle";
  label: string[];
  sub?: string;
};

export const TALL_VIEWBOX = { x: 0, y: 0, w: 340, h: 842 };

export const TALL_NODES: TallNode[] = [
  { id: "webhook", shape: "trigger", x: 72, y: 24, w: 124, h: 34, label: ["Webhook"] },
  { id: "chat", shape: "trigger", x: 246, y: 24, w: 168, h: 34, label: ["When chat message", "received"] },
  { id: "normalize", shape: "pill", x: 170, y: 100, w: 210, h: 34, label: ["Normalize Input"], sub: "manual" },
  { id: "pm", shape: "pill", x: 170, y: 172, w: 230, h: 38, label: ["Product Manager Agent"] },
  { id: "pmModel", shape: "circle", x: 105, y: 244, w: 28, h: 28, label: ["OpenAI", "Chat Model"] },
  { id: "pmMemory", shape: "circle", x: 170, y: 244, w: 28, h: 28, label: ["Simple", "Memory"] },
  { id: "pmThink", shape: "circle", x: 235, y: 244, w: 28, h: 28, label: ["Think"] },
  { id: "summary", shape: "pill", x: 170, y: 340, w: 230, h: 38, label: ["Incident Summary Agent"] },
  { id: "summaryModel", shape: "circle", x: 105, y: 412, w: 28, h: 28, label: ["Incident", "Summary"] },
  { id: "router", shape: "pill", x: 170, y: 498, w: 260, h: 34, label: ["router + summary + userQuestion"] },
  { id: "switch", shape: "pill", x: 170, y: 566, w: 150, h: 38, label: ["Switch"], sub: "mode: Rules" },
  { id: "deductive", shape: "pill", x: 158, y: 640, w: 170, h: 34, label: ["Deductive Agent"] },
  { id: "deductiveModel", shape: "circle", x: 292, y: 640, w: 26, h: 26, label: ["Deductive", "Model"] },
  { id: "profile", shape: "pill", x: 158, y: 702, w: 170, h: 34, label: ["Product Profile Agent"] },
  { id: "profilerModel", shape: "circle", x: 292, y: 702, w: 26, h: 26, label: ["Profiler", "Model"] },
  { id: "quickIso", shape: "pill", x: 158, y: 764, w: 170, h: 34, label: ["Quick Isolation Agent"] },
  { id: "quickIsoModel", shape: "circle", x: 292, y: 764, w: 26, h: 26, label: ["Quick Isolation", "Model"] },
  { id: "isolation", shape: "pill", x: 158, y: 826, w: 170, h: 34, label: ["Isolation Agent"] },
  { id: "isolationModel", shape: "circle", x: 292, y: 826, w: 26, h: 26, label: ["Isolation", "Model"] },
];

/** The same wire ids as EDGES, re-routed for the tall layout. */
export const TALL_EDGES: RunEdge[] = [
  { id: "webhook-normalize", from: "webhook", to: "normalize", kind: "main", shape: "line", pts: [[72, 41], [72, 64], [150, 64], [150, 83]] },
  { id: "chat-normalize", from: "chat", to: "normalize", kind: "main", shape: "line", pts: [[246, 41], [246, 64], [190, 64], [190, 83]] },
  { id: "normalize-pm", from: "normalize", to: "pm", kind: "main", shape: "line", pts: [[170, 117], [170, 153]] },
  // Main wires leave on the right and wrap past the sub-nodes, as n8n draws a backward hop.
  { id: "pm-summary", from: "pm", to: "summary", kind: "main", shape: "line", pts: [[285, 172], [312, 172], [312, 296], [170, 296], [170, 321]] },
  { id: "summary-router", from: "summary", to: "router", kind: "main", shape: "line", pts: [[285, 340], [312, 340], [312, 456], [170, 456], [170, 481]] },
  { id: "router-switch", from: "router", to: "switch", kind: "main", shape: "line", pts: [[170, 515], [170, 547]] },
  // The four outputs share a bus down the left edge.
  { id: "switch-deductive", from: "switch", to: "deductive", kind: "main", shape: "line", pts: [[95, 557], [40, 557], [40, 640], [73, 640]] },
  { id: "switch-profile", from: "switch", to: "profile", kind: "main", shape: "line", pts: [[95, 562], [40, 562], [40, 702], [73, 702]] },
  { id: "switch-quickIso", from: "switch", to: "quickIso", kind: "main", shape: "line", pts: [[95, 567], [40, 567], [40, 764], [73, 764]] },
  { id: "switch-isolation", from: "switch", to: "isolation", kind: "main", shape: "line", pts: [[95, 572], [40, 572], [40, 826], [73, 826]] },
  { id: "pmModel-pm", from: "pmModel", to: "pm", kind: "ai", shape: "line", pts: [[105, 230], [105, 191]] },
  { id: "pmMemory-pm", from: "pmMemory", to: "pm", kind: "ai", shape: "line", pts: [[170, 230], [170, 191]] },
  { id: "pmThink-pm", from: "pmThink", to: "pm", kind: "ai", shape: "line", pts: [[235, 230], [235, 191]] },
  { id: "summaryModel-summary", from: "summaryModel", to: "summary", kind: "ai", shape: "line", pts: [[105, 398], [105, 359]] },
  { id: "deductiveModel-deductive", from: "deductiveModel", to: "deductive", kind: "ai", shape: "line", pts: [[279, 640], [243, 640]] },
  { id: "profilerModel-profile", from: "profilerModel", to: "profile", kind: "ai", shape: "line", pts: [[279, 702], [243, 702]] },
  { id: "quickIsoModel-quickIso", from: "quickIsoModel", to: "quickIso", kind: "ai", shape: "line", pts: [[279, 764], [243, 764]] },
  { id: "isolationModel-isolation", from: "isolationModel", to: "isolation", kind: "ai", shape: "line", pts: [[279, 826], [243, 826]] },
];

/** Output numbers beside the bus, as n8n numbers the Switch's outputs. */
export const TALL_OUTPUT_LABELS: [number, number][] = [
  [52, 632],
  [52, 694],
  [52, 756],
  [52, 818],
];
