import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, type MotionValue } from "motion/react";
import {
  Backpack,
  Coffee,
  Droplets,
  Flame,
  Flashlight,
  Footprints,
  Lamp,
  Milk,
  Shirt,
  Tent,
  type LucideIcon,
} from "lucide-react";
import { BRIEF, GROUPS, HEADING, SHOWN, STORE, type DashGroup, type DashRow, type Thumb } from "./SellerDashboard.data";
import "./SellerDashboard.css";

/**
 * SellerDashboard: a coded replica of the seller dashboard's "Today" view,
 * drawn with SAMPLE data (SellerDashboard.data.ts) and the app's own CSS,
 * colours and type, so it reads as the real app on screen.
 *
 *   mode "screen"  the desktop page on a fixed 1260x1012 CSS canvas (banner,
 *                  heading, rail and the three cards), scaled to the parent's
 *                  width: about 0.9x in the page's 1136px column. The wrapper
 *                  keeps the canvas's shape, so nothing jumps while it measures.
 *   mode "narrow"  the app's own phone layout (its rules at 620px and below)
 *                  at the parent's width: heading, a compact rail, the cards.
 *   mode "auto"    (default) screen from 1024px of viewport width up, narrow
 *                  below (Tailwind's lg), switched in CSS so the pre-render and
 *                  the browser agree. Both are in the DOM; one is display:none.
 *
 * `reveal` (0..1, driven by the parent) plays the triage, worst first: the
 * sheet dims, then the three cards lift in turn (see REVEAL), each taking the
 * one yellow outline, which ends back on the first card. Without it the settled
 * end state is drawn. Only transform and opacity move; nothing here listens to
 * scroll, and React re-renders only when the screen wrapper is resized.
 *
 * Decorative: the whole replica is aria-hidden (the page describes it in text)
 * and has nothing focusable. Safe for the build-time pre-render: no window or
 * document during render, the ResizeObserver lives in an effect.
 */

/** The screen mode's fixed CSS canvas: the app's page at 1260px wide, banner to the last card. */
export const CANVAS = { w: 1260, h: 1012 } as const;

/**
 * The triage timeline, as shares of `reveal`. A card's lift starts at its
 * window's start (the moment its caption should step up), moves over the first
 * 60% of the window, and the card keeps the outline until the next one starts.
 */
export const REVEAL = {
  /** The sheet dims to half (everything but the three cards). */
  dim: [0, 0.12],
  /** Out of stock, needs shipping, not selling. */
  lifts: [
    [0.12, 0.37],
    [0.42, 0.67],
    [0.72, 0.97],
  ],
  /** From here the outline is back on the first card (worst first). */
  back: 0.97,
} as const;

export type SellerDashboardMode = "screen" | "narrow" | "auto";

type Props = {
  /** Default "auto": screen at 1024px of viewport width and up, narrow below. */
  mode?: SellerDashboardMode;
  /** Triage progress, 0..1. Leave out for the settled end state. */
  reveal?: MotionValue<number>;
  className?: string;
};

/** Invisible but still prepared by the browser (a layer at 0 is skipped, then prepared mid-scroll). */
const HIDDEN = 0.001;

const ease = (a: number, b: number) => (v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return 1 - Math.pow(1 - t, 3); // ease-out cubic
};

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * will-change for a moving layer, only while a parent-driven reveal is moving
 * (0 < v < 1). Before it starts and once it ends nothing is promoted, so text
 * paints exactly as in the app (a promoted layer loses Windows' subpixel text
 * and snaps to whole pixels), and the page above it carries no extra layers.
 */
const useLayer = (v: MotionValue<number>, animated: boolean, prop: "transform" | "opacity") =>
  useTransform<number, string>(v, (x) => (animated && x > 0 && x < 1 ? prop : "auto"));

/** Light tiles stand in for the product photos (white backgrounds in the real app). */
const THUMBS: Record<Thumb, LucideIcon> = {
  flashlight: Flashlight,
  bottle: Milk,
  lantern: Lamp,
  jacket: Shirt,
  mug: Coffee,
  flame: Flame,
  droplets: Droplets,
  footprints: Footprints,
  tent: Tent,
  backpack: Backpack,
};

const CARDS = SHOWN.map((k) => GROUPS.find((g) => g.key === k)) as DashGroup[];

/** Which card holds the outline at v: each from its lift until the next one's. */
const RING: [number, number][][] = [
  [
    [REVEAL.lifts[0][0], REVEAL.lifts[1][0]],
    [REVEAL.back, Infinity],
  ],
  [[REVEAL.lifts[1][0], REVEAL.lifts[2][0]]],
  [[REVEAL.lifts[2][0], REVEAL.back]],
];
const ringOn = (i: number, v: number) => RING[i].some(([a, b]) => v >= a && v < b);


// ---------------------------------------------------------------------------

/** The reveal, shared by every moving part. */
type Fx = {
  v: MotionValue<number>;
  /** The sheet's opacity (1 to 0.5). */
  dim: MotionValue<number>;
  dimLayer: MotionValue<string>;
  /** A parent drives `reveal` (otherwise it is the settled picture and nothing moves). */
  animated: boolean;
};

export function SellerDashboard({ mode = "auto", reveal, className = "" }: Props) {
  const settled = useMotionValue(1);
  const v = reveal ?? settled;
  const animated = reveal !== undefined;
  const dim = useTransform(v, (x) => 1 - 0.5 * ease(REVEAL.dim[0], REVEAL.dim[1])(x));
  const dimLayer = useLayer(v, animated, "opacity");
  const fx: Fx = { v, dim, dimLayer, animated };
  if (mode === "screen") return <Screen fx={fx} className={className} top />;
  if (mode === "narrow") {
    return (
      <div aria-hidden data-nosnippet className={`sd sd-narrow ${className}`}>
        <Today fx={fx} px={1} narrow />
      </div>
    );
  }
  return (
    <div aria-hidden data-nosnippet className={`sd-auto ${className}`}>
      <Screen fx={fx} className="sd-auto-screen" />
      <div className="sd sd-narrow sd-auto-narrow">
        <Today fx={fx} px={1} narrow />
      </div>
    </div>
  );
}

/**
 * The 1260x1012 page, scaled to the wrapper's width. The scale comes from the
 * wrapper's layout width (a parent's own transforms never trigger it). Until it
 * is measured the canvas is hidden, or scaled in CSS where the browser can
 * divide lengths, so the pre-rendered page can already show it.
 */
function Screen({
  fx,
  className = "",
  top = false,
}: {
  fx: Fx;
  className?: string;
  /** True when this is the top element (screen mode): it then carries the hiding attributes. */
  top?: boolean;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  useIsoLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const apply = (w: number) => {
      if (w > 0) setScale((s) => (s !== null && Math.abs(s * CANVAS.w - w) < 0.01 ? s : w / CANVAS.w));
    };
    apply(el.offsetWidth);
    const ro = new ResizeObserver((entries) => apply(entries[0].contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrap}
      aria-hidden={top ? true : undefined}
      data-nosnippet={top ? "" : undefined}
      className={`sd-wrap ${className}`}
    >
      <div
        className={`sd sd-screen${scale === null ? " sd-unmeasured" : ""}`}
        style={scale === null ? undefined : { transform: `scale(${scale})` }}
      >
        <div className="sd-app">
          <Hero />
          {/* Outline and lift are sized in screen px, so they read the same at any scale. */}
          <Today fx={fx} px={1 / (scale ?? 1)} />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Banner: the app's geometry and orange gradient, with a neutral original scene.

// Back to front: a hazy far range, a dark mid range, a rolling near ridge, the ground.
const FAR =
  "M0 150 L48 132 L92 140 L150 108 L196 126 L248 98 L300 124 L352 112 L404 136 L470 96 L530 122 L586 106 L640 132 L702 110 L770 84 L830 116 L884 104 L944 130 L1004 100 L1064 120 L1116 92 L1176 124 L1236 108 L1320 128 L1320 300 L0 300 Z";
const MID =
  "M0 186 L70 170 L130 178 L200 152 L262 172 L330 160 L400 182 L470 158 L540 176 L610 150 L690 174 L760 162 L840 184 L910 156 L980 174 L1050 148 L1130 170 L1200 158 L1260 174 L1320 164 L1320 300 L0 300 Z";
const NEAR =
  "M0 222 C110 206 210 208 320 220 S520 236 640 222 S860 202 980 216 S1180 234 1320 214 L1320 300 L0 300 Z";

function Scene() {
  const glow = `sd-glow-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg className="sd-scene" viewBox="0 0 1320 300" preserveAspectRatio="xMidYMax slice">
      <defs>
        <radialGradient id={glow} cx="905" cy="120" r="150" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f0c27a" stopOpacity="0.45" />
          <stop offset="0.4" stopColor="#e3a14f" stopOpacity="0.18" />
          <stop offset="1" stopColor="#e3a14f" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="905" cy="120" r="150" fill={`url(#${glow})`} />
      <circle cx="905" cy="120" r="40" fill="#e6bd74" opacity="0.5" />
      <path d={FAR} fill="#6b4a2b" opacity="0.35" />
      <path d={MID} fill="#3a2410" />
      <path d={NEAR} fill="#140c05" />
      <rect x="0" y="258" width="1320" height="42" fill="#0e0904" />
    </svg>
  );
}

/** The replica's neutral mark (brand tile and rail eyebrow): two peaks. */
const PeakMark = () => (
  <svg viewBox="0 0 100 100">
    <path fill="currentColor" d="M8 76 L39 26 L52 47 L63 33 L92 76 Z" />
  </svg>
);

const SamplePill = () => (
  <span className="sd-pill sd-pill-sample">
    <span className="sd-pill-dot" />
    {STORE.label}
  </span>
);

function Hero() {
  return (
    // The banner stays at full strength, so its "Sample data" label never fades.
    <div className="sd-hero">
      <Scene />
      <div className="sd-scrim" />
      <div className="sd-hero-content">
        <div className="sd-brand">
          <PeakMark />
        </div>
        <div>
          <div className="sd-h1">{STORE.name}</div>
          <div className="sd-hero-sub">{STORE.sub}</div>
          <div className="sd-meta">
            {STORE.updated}
            <SamplePill />
            <span className="sd-info">
              <span className="sd-b sd-info-b">!</span>
            </span>
            <span className="sd-b sd-refresh">
              <span className="sd-refresh-ico">⟳</span>
              {STORE.refresh}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// The Today section: heading, rail, cards.

type TodayProps = {
  fx: Fx;
  /** Canvas px per screen px (1 in narrow mode). */
  px: number;
  narrow?: boolean;
};

function Today({ fx, px, narrow = false }: TodayProps) {
  const sheet = { opacity: fx.dim, willChange: fx.dimLayer };
  return (
    <div className="sd-section">
      <div className="sd-shead">
        <motion.div className="sd-h2" style={sheet}>
          {HEADING.title} <span className="sd-h2-sub">{HEADING.sub}</span>
        </motion.div>
        {/* The honesty label stays at full strength when the sheet dims. */}
        {narrow && <SamplePill />}
      </div>
      <div className="sd-layout">
        <motion.div className="sd-brief" style={sheet}>
          <div className="sd-eyebrow">
            <PeakMark />
            {BRIEF.eyebrow}
          </div>
          <div className="sd-date">
            {BRIEF.weekday}
            <span className="sd-date-sub">{BRIEF.monthDay}</span>
          </div>
          {/* The compact rail (narrow) keeps the date and the three totals. */}
          {!narrow && (
            <div className="sd-b sd-day">
              <span className="sd-day-head">
                {BRIEF.day.label}
                <span className="sd-day-caret">›</span>
              </span>
              <span className="sd-day-rev">{BRIEF.day.revenue}</span>
              <span className="sd-day-sub">
                {BRIEF.day.sub}
                <span className="sd-day-up">{BRIEF.day.up}</span>
              </span>
            </div>
          )}
          <div className="sd-stats">
            {BRIEF.stats.map((st) => (
              <div key={st.label} className="sd-stat">
                <span className={`sd-num${st.tone === "bad" ? " sd-num-bad" : st.tone === "gold" ? " sd-num-gold" : ""}`}>
                  {st.value}
                </span>
                <span className="sd-lbl">{st.label}</span>
                {"pick" in st && <span className="sd-b sd-pick">{st.pick}</span>}
              </div>
            ))}
          </div>
        </motion.div>
        <div className="sd-groups">
          {CARDS.map((g, i) => (
            <Card key={g.key} group={g} i={i} fx={fx} px={px} narrow={narrow} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** One action card. Its slot also holds the outline, above every card. */
function Card({
  group: g,
  i,
  fx,
  px,
  narrow,
}: {
  group: DashGroup;
  i: number;
  fx: Fx;
  px: number;
  narrow: boolean;
}) {
  const { v, animated } = fx;
  const [a, b] = REVEAL.lifts[i];
  const t = useTransform(v, ease(a, a + (b - a) * 0.6));
  const y = useTransform(t, (k) => -(narrow ? 4 : 6) * px * k);
  const scale = useTransform(t, (k) => 1 + (narrow ? 0.01 : 0.012) * k);
  const ring = useTransform(v, (x) => (ringOn(i, x) ? 1 : HIDDEN));
  const moveLayer = useLayer(v, animated, "transform");
  const off = 3 * px;
  return (
    <div className="sd-slot">
      <motion.div className={`sd-group sd-t-${g.tone}`} style={{ y, scale, willChange: moveLayer }}>
        <div className="sd-ghead">
          <span className={`sd-ico sd-ico-${g.tone}`}>{g.icon}</span>
          <span className="sd-title">{g.title}</span>
          <span className={`sd-count sd-count-${g.tone}`}>{g.count}</span>
          <span className="sd-hint">{g.hint}</span>
          {g.cta && <span className="sd-b sd-go">{g.cta}</span>}
        </div>
        <div>
          {g.rows.map((r) => (
            <Row key={r.name} row={r} />
          ))}
        </div>
        {g.more && (
          <div className="sd-gfoot">
            <span className="sd-b sd-more">{g.more}</span>
          </div>
        )}
      </motion.div>
      <motion.div
        className="sd-ring"
        style={{
          y,
          scale,
          opacity: ring,
          willChange: moveLayer,
          inset: -off,
          borderWidth: 2 * px,
          borderRadius: 12 + off,
        }}
      />
    </div>
  );
}

function Row({ row: r }: { row: DashRow }) {
  const Icon = THUMBS[r.thumb];
  return (
    <div className="sd-row">
      <span className="sd-check" />
      <span className="sd-thumb">
        <Icon strokeWidth={1.75} />
      </span>
      <span className="sd-name">{r.name}</span>
      <span className="sd-detail">
        {r.detail}
        {r.sub && <span className="sd-amz">{r.sub}</span>}
      </span>
      <span className={`sd-action${r.calm ? " sd-calm" : ""}`}>{r.action}</span>
    </div>
  );
}
