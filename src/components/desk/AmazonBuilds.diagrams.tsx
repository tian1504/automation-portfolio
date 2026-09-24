import type { ReactNode } from "react";
import { motion, type Variants } from "motion/react";
import { EASE_OUT } from "@/lib/desk";

/**
 * Honest line drawings of the two engines, named from the case studies
 * (CaseStudySpApi.tsx, CaseStudyBookSourcing.tsx). Engineering-drawing rules:
 * 1px strokes in warm bone, outlined nodes, mono labels, no colour, no pulses.
 *
 * Every element carries an `i` (its place in the data's order). When the
 * parent panel switches to the "shown" variant, strokes draw in that order
 * (SVG pathLength) and labels fade in behind them. With no variant label from
 * the parent (reduced motion) nothing is animated and the drawing is complete.
 */

const START = 0.22;
const STEP = 0.075;

const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  shown: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay: START + i * STEP, duration: 0.8, ease: EASE_OUT },
      opacity: { delay: START + i * STEP, duration: 0.01 },
    },
  }),
};

const ink: Variants = {
  hidden: { opacity: 0 },
  shown: (i: number) => ({
    opacity: 1,
    transition: { delay: START + 0.18 + i * STEP, duration: 0.5, ease: EASE_OUT },
  }),
};

const C = {
  node: "hsl(var(--bone) / 0.56)",
  line: "hsl(var(--bone) / 0.48)",
  soft: "hsl(var(--bone) / 0.38)",
  title: "hsl(var(--bone) / 0.94)",
  sub: "hsl(var(--bone) / 0.64)",
} as const;

type Tone = "node" | "line" | "soft";

const Box = ({
  x,
  y,
  w,
  h,
  i,
  tone = "node",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  i: number;
  tone?: Tone;
}) => (
  <motion.rect
    x={x + 0.5}
    y={y + 0.5}
    width={w - 1}
    height={h - 1}
    rx={5}
    fill="none"
    strokeWidth={1}
    style={{ stroke: C[tone] }}
    variants={draw}
    custom={i}
  />
);

/** A solid stroke draws; a dashed one cannot (pathLength owns the dash), so it fades. */
const Stroke = ({ d, i, tone = "line", dashed = false }: { d: string; i: number; tone?: Tone; dashed?: boolean }) =>
  dashed ? (
    <motion.path
      d={d}
      fill="none"
      strokeWidth={1}
      strokeDasharray="3 3"
      style={{ stroke: C.soft }}
      variants={ink}
      custom={i}
    />
  ) : (
    <motion.path d={d} fill="none" strokeWidth={1} style={{ stroke: C[tone] }} variants={draw} custom={i} />
  );

type Dir = "r" | "l" | "d" | "u";
const HEAD: Record<Dir, (x: number, y: number) => string> = {
  r: (x, y) => `M${x - 4.5} ${y - 3.5}L${x} ${y}L${x - 4.5} ${y + 3.5}`,
  l: (x, y) => `M${x + 4.5} ${y - 3.5}L${x} ${y}L${x + 4.5} ${y + 3.5}`,
  d: (x, y) => `M${x - 3.5} ${y - 4.5}L${x} ${y}L${x + 3.5} ${y - 4.5}`,
  u: (x, y) => `M${x - 3.5} ${y + 4.5}L${x} ${y}L${x + 3.5} ${y + 4.5}`,
};

const Head = ({ x, y, dir, i, soft = false }: { x: number; y: number; dir: Dir; i: number; soft?: boolean }) => (
  <motion.path
    d={HEAD[dir](x, y)}
    fill="none"
    strokeWidth={1}
    style={{ stroke: soft ? C.soft : C.node }}
    variants={ink}
    custom={i}
  />
);

/** A straight run with an open chevron at its tip. `d` must end at the tip. */
const Arrow = ({
  d,
  tip,
  dir,
  i,
  dashed = false,
}: {
  d: string;
  tip: [number, number];
  dir: Dir;
  i: number;
  dashed?: boolean;
}) => (
  <>
    <Stroke d={d} i={i} dashed={dashed} />
    <Head x={tip[0]} y={tip[1]} dir={dir} i={i + 0.6} soft={dashed} />
  </>
);

const Label = ({
  x,
  y,
  i,
  children,
  strong = false,
  size = 12,
  anchor,
}: {
  x: number;
  y: number;
  i: number;
  children: ReactNode;
  strong?: boolean;
  size?: number;
  anchor?: "start" | "middle" | "end";
}) => (
  <motion.text
    x={x}
    y={y}
    fontSize={size}
    fontWeight={strong ? 500 : 400}
    textAnchor={anchor}
    className="font-mono"
    style={{ fill: strong ? C.title : C.sub }}
    variants={ink}
    custom={i}
  >
    {children}
  </motion.text>
);

/* ------------------------------------------------------------------ */
/* A. Amazon SP-API Sync Engine: a left-to-right route                 */
/* ------------------------------------------------------------------ */

export const SYNC_DESCRIPTION =
  "Line diagram of the sync engine: Amazon SP-API data (orders, returns, financial events, settlements, inventory, FBA shipments and fees) flows into one n8n workspace of about 45 workflows that sync daily and hourly, with gap-fill runs that catch up on anything missed; the report-based syncs share one Reports API loop (request, poll until ready, download, parse); the data lands in the client’s inventory system for the US and Canada, and any failure sends an email alert.";

const FEEDS = ["orders", "returns", "financial events", "settlements", "inventory", "FBA shipments", "fees"];
const LOOP = ["request", "poll", "download", "parse"];

/** Desktop and tablet: the route runs left to right. viewBox 563 x 258. */
export const SyncDiagramWide = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 563 258"
    role="img"
    aria-label={SYNC_DESCRIPTION}
    className={`block h-auto w-full overflow-visible ${className}`}
  >
    {/* Amazon SP-API and the feeds drawn here, each on its own port */}
    <Box x={0} y={20} w={136} h={186} i={0} />
    <Label x={12} y={42} i={0} strong size={12.5}>
      Amazon SP-API
    </Label>
    <Stroke d="M0.5 54.5H135.5" i={0.4} tone="soft" />
    {FEEDS.map((f, k) => (
      <g key={f}>
        <Label x={12} y={76 + 19 * k} i={0.6 + k * 0.12}>
          {f}
        </Label>
        <Stroke d={`M136 ${72.5 + 19 * k}H152.5`} i={1.3 + k * 0.06} />
      </g>
    ))}
    <Stroke d="M152.5 72V187" i={1.8} />
    <Arrow d="M152.5 129.5H170" tip={[170, 129.5]} dir="r" i={2.1} />

    {/* The n8n workspace */}
    <Box x={170} y={4} w={218} h={250} i={2.5} />
    <Label x={182} y={26} i={2.7} strong size={12.5}>
      n8n, one workspace
    </Label>
    <Label x={182} y={44} i={2.8}>
      about 45 workflows
    </Label>
    <Label x={182} y={62} i={2.9}>
      daily · hourly · gap-fill
    </Label>

    {/* The shared Reports API loop inside it */}
    <Box x={182} y={76} w={194} h={166} i={3.1} tone="soft" />
    <Label x={194} y={96} i={3.2} strong>
      shared Reports API loop
    </Label>
    {LOOP.map((s, k) => {
      const y = 108 + 33 * k;
      const at = 3.5 + k * 0.45;
      return (
        <g key={s}>
          <Box x={194} y={y} w={72} h={22} i={at} />
          <Label x={230} y={y + 15} anchor="middle" i={at + 0.1}>
            {s}
          </Label>
          {k < LOOP.length - 1 && <Arrow d={`M230.5 ${y + 22}V${y + 33}`} tip={[230.5, y + 33]} dir="d" i={at + 0.25} />}
        </g>
      );
    })}
    {/* poll repeats until Amazon has the report ready */}
    <Stroke d="M266 147.5H276A5 5 0 0 1 276 157.5H266" i={4.3} />
    <Head x={266} y={157.5} dir="l" i={4.8} />
    <Label x={287} y={156.5} i={4.8}>
      until ready
    </Label>

    {/* Into the client's inventory system */}
    <Arrow d="M388 129.5H416" tip={[416, 129.5]} dir="r" i={5.4} />
    <Box x={416} y={92} w={146} h={76} i={5.8} />
    <Label x={428} y={114} i={6} strong size={12.5}>
      Client inventory
    </Label>
    <Label x={428} y={131} i={6} strong size={12.5}>
      system
    </Label>
    <Label x={428} y={154} i={6.1}>
      US · Canada
    </Label>

    {/* The thin side path: any failure emails */}
    <Arrow d="M388 221.5H416" tip={[416, 221.5]} dir="r" i={6.4} dashed />
    <Box x={416} y={196} w={146} h={50} i={6.6} tone="soft" />
    <Label x={428} y={217} i={6.8} strong size={12.5}>
      email alert
    </Label>
    <Label x={428} y={235} i={6.9}>
      on any failure
    </Label>
  </svg>
);

/** Phone: the same route re-flowed top to bottom. viewBox 320 x 325. */
export const SyncDiagramTall = () => {
  const steps = [
    { s: "request", x: 22, w: 64 },
    { s: "poll", x: 98, w: 44 },
    { s: "download", x: 154, w: 72 },
    { s: "parse", x: 238, w: 56 },
  ];
  return (
    <svg viewBox="0 0 320 325" role="img" aria-label={SYNC_DESCRIPTION} className="block h-auto w-full overflow-visible">
      <Box x={0} y={0} w={320} h={92} i={0} />
      <Label x={12} y={19} i={0} strong size={12.5}>
        Amazon SP-API
      </Label>
      <Stroke d="M0.5 28.5H319.5" i={0.4} tone="soft" />
      <Label x={12} y={46} i={0.6}>
        orders · returns · financial events
      </Label>
      <Label x={12} y={62} i={0.8}>
        settlements · inventory
      </Label>
      <Label x={12} y={78} i={1}>
        FBA shipments · fees
      </Label>

      <Arrow d="M60.5 92V108" tip={[60.5, 108]} dir="d" i={1.4} />

      <Box x={0} y={108} w={320} h={148} i={1.9} />
      <Label x={12} y={127} i={2.1} strong size={12.5}>
        n8n, one workspace
      </Label>
      <Label x={12} y={144} i={2.2}>
        about 45 workflows
      </Label>
      <Label x={12} y={161} i={2.3}>
        daily · hourly · gap-fill
      </Label>

      <Box x={10} y={172} w={300} h={72} i={2.5} tone="soft" />
      <Label x={22} y={190} i={2.6} strong>
        shared Reports API loop
      </Label>
      {steps.map(({ s, x, w }, k) => {
        const at = 2.9 + k * 0.45;
        const next = steps[k + 1];
        return (
          <g key={s}>
            <Box x={x} y={198} w={w} h={22} i={at} />
            <Label x={x + w / 2} y={213} anchor="middle" i={at + 0.1}>
              {s}
            </Label>
            {next && <Arrow d={`M${x + w} 209.5H${next.x}`} tip={[next.x, 209.5]} dir="r" i={at + 0.25} />}
          </g>
        );
      })}
      {/* poll repeats until the report is ready */}
      <Stroke d="M114.5 220V224A4 4 0 0 0 118.5 228H121.5A4 4 0 0 0 125.5 224V220" i={3.6} />
      <Head x={125.5} y={220.5} dir="u" i={4.1} />
      <Label x={134} y={234} i={4.1}>
        until ready
      </Label>

      <Arrow d="M60.5 256V272" tip={[60.5, 272]} dir="d" i={4.7} />
      <Box x={0} y={272} w={200} h={52} i={5.1} />
      <Label x={12} y={293} i={5.3} strong size={12.5}>
        Client inventory system
      </Label>
      <Label x={12} y={311} i={5.4}>
        US · Canada
      </Label>

      <Arrow d="M264.5 256V272" tip={[264.5, 272]} dir="d" i={5.5} dashed />
      <Box x={212} y={272} w={108} h={52} i={5.8} tone="soft" />
      <Label x={224} y={293} i={6} strong size={12.5}>
        email alert
      </Label>
      <Label x={224} y={311} i={6.1}>
        on failure
      </Label>
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* B. Used-Book FBA Sourcing Engine: a top-to-bottom funnel            */
/* ------------------------------------------------------------------ */

export const SOURCING_DESCRIPTION =
  "Line diagram of the sourcing engine as a narrowing funnel: about 2,000 listings from AbeBooks, Biblio and Alibris each morning; about 700 pass the buying rules, which need a price below the book’s own six-month average; each survivor is checked live for price, condition and seller location, in a real browser for shops with bot protection; the margin per book is worked out after postage and Amazon fees; the run ends in a daily buy list of 6 to 8 books inside the budget.";

const SHOPS = ["AbeBooks", "Biblio", "Alibris"];

type Stage = { y: number; h: number; w: number; title: string; count?: string; lines: string[] };

/**
 * Each stage is 18 units narrower than the one above, centred, so the run
 * visibly narrows. Counts are the case study's own ("about" kept), set
 * right-aligned so they read as one column: about 2,000, about 700, 6 to 8.
 */
const STAGES: Stage[] = [
  { y: 56, h: 44, w: 320, title: "listings scanned", count: "about 2,000", lines: ["each morning"] },
  { y: 110, h: 44, w: 302, title: "buying rules", count: "about 700 pass", lines: ["priced under its six-month average"] },
  {
    y: 164,
    h: 62,
    w: 284,
    title: "live check, each survivor",
    lines: ["price · condition · seller location", "real browser for bot-protected shops"],
  },
  { y: 236, h: 44, w: 266, title: "margin per book", lines: ["after postage and Amazon fees"] },
  { y: 290, h: 44, w: 248, title: "daily buy list", count: "6 to 8 books", lines: ["inside the budget"] },
];

/** One drawing for every width. viewBox 320 x 335. */
export const SourcingDiagram = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 320 335"
    role="img"
    aria-label={SOURCING_DESCRIPTION}
    className={`block h-auto w-full overflow-visible ${className}`}
  >
    {/* Three shops merge into one morning's listings */}
    {SHOPS.map((s, k) => (
      <g key={s}>
        <Box x={112 * k} y={0} w={96} h={32} i={k * 0.2} />
        <Label x={112 * k + 48} y={20.5} anchor="middle" i={0.1 + k * 0.2} strong size={12.5}>
          {s}
        </Label>
      </g>
    ))}
    <Stroke d="M48.5 32V42.5H160.5" i={0.7} />
    <Stroke d="M272.5 32V42.5H160.5" i={0.7} />
    <Arrow d="M160.5 32V56" tip={[160.5, 56]} dir="d" i={0.85} />

    {STAGES.map((st, k) => {
      const x = (320 - st.w) / 2;
      const at = 1.2 + k * 0.9;
      const next = STAGES[k + 1];
      return (
        <g key={st.title}>
          <Box x={x} y={st.y} w={st.w} h={st.h} i={at} />
          <Label x={x + 12} y={st.y + 18} i={at + 0.2} strong size={12.5}>
            {st.title}
          </Label>
          {st.count && (
            <Label x={x + st.w - 12} y={st.y + 18} anchor="end" i={at + 0.3} strong>
              {st.count}
            </Label>
          )}
          {st.lines.map((t, j) => (
            <Label key={t} x={x + 12} y={st.y + 35 + 17 * j} i={at + 0.3 + j * 0.1}>
              {t}
            </Label>
          ))}
          {next && (
            <Arrow d={`M160.5 ${st.y + st.h}V${next.y}`} tip={[160.5, next.y]} dir="d" i={at + 0.6} />
          )}
        </g>
      );
    })}
  </svg>
);
