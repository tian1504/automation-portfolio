import { forwardRef, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from "motion/react";
import { BOOKING_URL, FINE_POINTER_QUERY, PHONE_QUERY, UPWORK_URL, jumpTo, reveal, useMediaQuery } from "@/lib/desk";
import farSharp from "@/assets/desk/far-canvas.webp";
import farSoft from "@/assets/desk/far-canvas-soft.webp";
import cutout from "@/assets/desk/eleazar.webp";
import cutoutSm from "@/assets/desk/eleazar-sm.webp";
// Ground-coloured silhouettes with the cutout's own alpha: fading one in dims
// him without a live CSS mask (masks on moving layers are costly to redraw).
import shade from "@/assets/desk/eleazar-shade.webp";
import shadeSm from "@/assets/desk/eleazar-sm-shade.webp";
import { Maximize2 } from "lucide-react";
import { BEATS, SAMPLE, TALL_VIEWBOX, VIEWBOX } from "./RunCanvas.data";
import { RunCanvas, RunChat } from "./RunCanvas";
import { OPEN_WORK_EVENT } from "./Workshop.data";

/**
 * DeskStage: the page's only pinned stage.
 *   Hello : he sits facing you, his real n8n canvas soft behind him.
 *   Hush  : the copy leaves, he steps back into the dark, and the canvas behind
 *           him comes into focus: it is the AI support system he built.
 *   Run   : that canvas plays one SAMPLE issue through, step by step, as the
 *           visitor scrolls: a manager agent reads it, a summary agent sums it
 *           up, a switch picks one of four specialists, and the answer goes
 *           back to the chat. Plain captions name each step.
 * Everything is driven by one scroll progress value through MotionValues, so
 * React never re-renders on scroll. The run moves only while the visitor
 * scrolls; it never loops, and it ends and holds.
 *
 * The seller dashboard is a different client's build: it opens the next
 * section on its own, so nothing here flows into it.
 *
 * The run's words must be readable in the pinned frame. A hidden copy of the
 * caption column is measured against the frame (per viewport size, never per
 * scroll): when everything fits, the source line and its link sit in the
 * frame; when only the heading and steps fit, those two follow the stage in
 * normal flow; when even that does not fit (phones held sideways, heavy zoom)
 * the page uses the static composition, as it does for reduced motion.
 */

// ---------------------------------------------------------------------------
// Copy

const H1 = "AI automation engineer.";
const SUBLINE =
  "I’m Eleazar. I build AI agents, n8n workflows and Amazon SP-API tools that take the daily checks off your team.";
const HUSH = ["Behind me is a team of AI agents I built in n8n.", "Let me give them a sample support issue."];
const RUN_EYEBROW = "Sample run";
const RUN_H2 = "Each issue, read by AI and handed to a specialist agent.";
/** Four steps; their bold leads tell the story on their own. Each spans the beats it names. */
const STEPS = [
  {
    from: "in",
    to: "normalize",
    title: "A support issue comes in.",
    body: "Someone types it into the chat, and it is put into a standard format.",
    phone: `“${SAMPLE.input}”`,
  },
  {
    from: "pm",
    to: "summary",
    title: "Two AI agents read it.",
    body: "A manager agent thinks it over, then a summary agent sums it up.",
  },
  {
    from: "route",
    to: "route",
    title: "A switch picks one of four.",
    body: "In this sample, the rules send it to the Quick Isolation Agent.",
  },
  {
    from: "specialist",
    to: "reply",
    title: "The specialist answers.",
    body: "It runs on its own OpenAI model and replies in the chat.",
    phone: `“${SAMPLE.output}”`,
  },
] as const;
const RUN_FOOTER =
  "The Multi-Agent Orchestration System, part of an IT troubleshooting engine I built for a client. n8n and OpenAI. The issue and the reply are samples, not client data.";
const RUN_ALT =
  "A sample run through the Multi-Agent Orchestration System in n8n: a support issue arrives in the chat, a manager agent and a summary agent read it, a switch sends it to the Quick Isolation Agent (one of four specialist agents), and that agent replies in the chat.";

// ---------------------------------------------------------------------------
// Progress windows (0..1 across the pinned travel)

type Windows = {
  copyOut: [number, number];
  shade: [number, number];
  subjectOut: [number, number];
  hushIn: [number, number];
  hushOut: [number, number];
  swap: [number, number];
  h2In: [number, number];
  run: [number, number];
  footerIn: [number, number];
};
const T_DESK: Windows = {
  copyOut: [0.04, 0.11],
  shade: [0.05, 0.12],
  subjectOut: [0.1, 0.18],
  hushIn: [0.08, 0.13],
  hushOut: [0.19, 0.23],
  swap: [0.11, 0.21],
  h2In: [0.21, 0.26],
  run: [0.25, 0.88],
  footerIn: [0.89, 0.93],
};
const T_PHONE: Windows = {
  copyOut: [0.03, 0.09],
  shade: [0.02, 0.07],
  subjectOut: [0.05, 0.11],
  hushIn: [0.1, 0.14],
  hushOut: [0.18, 0.21],
  swap: [0.09, 0.19],
  h2In: [0.19, 0.23],
  run: [0.22, 0.86],
  footerIn: [0.87, 0.91],
};
// The settled end state: the answer back, every step named, source line in.
// The #agents anchor lands here, and so does keyboard focus on the footer link.
const SETTLED = { desk: 0.94, phone: 0.93 };

// Stage heights in svh (desktop / phone). Travel = height - 100.
const SPAN = { desk: 300, phone: 240 };

/** A beat's window in page progress. */
const beatAt = (T: Windows, id: string): [number, number] => {
  const b = BEATS.find((x) => x.id === id)!;
  const [r0, r1] = T.run;
  return [r0 + b.at[0] * (r1 - r0), r0 + b.at[1] * (r1 - r0)];
};

// ---------------------------------------------------------------------------
// The view onto the canvas
//
// Desktop shows the real canvas at its reading size (node names about 11px)
// and pans along the run; it never scales while the run plays. At the swap it
// starts exactly where the far canvas image sits, so his own background turns
// into the crisp drawing without a jump (below about 1360px wide the reading
// size is larger than the image, so the point under the image's light holds
// still and the rest grows around it). Phones use the tall layout and pan down.

/** px per canvas unit at the reading size. */
const U_READ = 1.5;

/** Where the view looks during the run: canvas x (wide) at run progress, eased between stops. */
const PAN_WIDE: [number, number][] = [
  [0, 360],
  [0.16, 440],
  [0.3, 560],
  [0.44, 690],
  [0.6, 790],
  [0.7, 790],
  [0.84, 650],
  [1, 650],
];
const WIDE_Y = 236;
/**
 * Tall: the canvas y at the top of the view. The last stop is set per screen
 * (phoneView): low enough that the Switch and all four specialists, with their
 * labels, sit above the caption slot, whatever the phone's height.
 */
const panTall = (end: number): [number, number][] => [
  [0, 0],
  [0.18, 8],
  [0.3, 70],
  [0.44, Math.min(196, end)],
  [0.58, end],
  [1, end],
];
/** The lowest point of the tall canvas that must stay in view (the last specialist's model label). */
const TALL_BOTTOM = 862;

const smoothstep = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
function along(stops: [number, number][], v: number) {
  if (v <= stops[0][0]) return stops[0][1];
  for (let i = 1; i < stops.length; i++) {
    const [t1, x1] = stops[i];
    const [t0, x0] = stops[i - 1];
    if (v <= t1) return x0 + (x1 - x0) * smoothstep((v - t0) / (t1 - t0 || 1));
  }
  return stops[stops.length - 1][1];
}

type View = {
  /** px per canvas unit. */
  u: number;
  /** Tall only: the canvas y at the top of the view when the run settles. */
  endY: number;
  /** Canvas translate at the swap (lined up with the far canvas image). */
  alignX: number;
  alignY: number;
  /** Canvas translate that puts canvas point (cx, cy) at the reading spot. */
  readX: (cx: number) => number;
  readY: (cy: number) => number;
};

function deskView(w: number, h: number): View {
  const imgW = 1.12 * w;
  const imgH = imgW * (VIEWBOX.h / VIEWBOX.w);
  const uImg = imgW / VIEWBOX.w;
  const u = Math.max(U_READ, uImg);
  // The far image's box (left-1/2 top-[44%] w-[112%] -translate-x-[40%] -translate-y-1/2).
  const left = 0.5 * w - 0.4 * imgW;
  const top = 0.44 * h - 0.5 * imgH;
  // The canvas point under the image's light (its mask centre) holds still through the swap.
  const sx = 0.75 * w;
  const sy = 0.46 * h;
  const cx = VIEWBOX.x + (sx - left) / uImg;
  const cy = VIEWBOX.y + (sy - top) / uImg;
  // Reading spot: the middle of the room right of the caption column.
  const colLeft = Math.max(0.08 * w, (w - 1200) / 2 + 32);
  const colW = Math.min(440, Math.max(358, 0.28 * w));
  const rx = (colLeft + colW + w) / 2 + 12;
  const ry = 0.45 * h;
  return {
    u,
    endY: 0,
    alignX: sx - (cx - VIEWBOX.x) * u,
    alignY: sy - (cy - VIEWBOX.y) * u,
    readX: (c) => rx - (c - VIEWBOX.x) * u,
    readY: (c) => ry - (c - VIEWBOX.y) * u,
  };
}

/**
 * Tall layout: as wide as the phone, but never zoomed past 1.25 (tablets keep
 * phone-sized names, centred). `colTop` is where the caption slot starts.
 */
function phoneView(w: number, h: number, colTop: number): View {
  const u = Math.min((w - 28) / TALL_VIEWBOX.w, 1.25);
  const left = (w - TALL_VIEWBOX.w * u) / 2;
  const top = 0.035 * h;
  const room = (colTop > 0 ? colTop - 14 : 0.55 * h) - top;
  return {
    u,
    endY: Math.max(300, TALL_BOTTOM - room / u),
    alignX: left,
    alignY: top,
    readX: () => left,
    readY: (c) => top - (c - TALL_VIEWBOX.y) * u,
  };
}

/** The frame's own size: the sticky frame is the page width (no scrollbar) by one viewport height. */
function useFrame() {
  // The build-time pre-render has no window: assume a common laptop until the browser takes over.
  const read = () =>
    typeof window === "undefined"
      ? { w: 1440, h: 900 }
      : { w: document.documentElement.clientWidth || window.innerWidth, h: window.innerHeight };
  const [vp, setVp] = useState(read);
  useEffect(() => {
    const on = () => setVp(read());
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return vp;
}

// ---------------------------------------------------------------------------

/** Phone: the far canvas fades out before any of its own edges. */
const FAR_MASK_PHONE = {
  WebkitMaskImage:
    "linear-gradient(to bottom, #000 55%, transparent 95%), linear-gradient(to right, transparent 0%, #000 15%, #000 85%, transparent 100%)",
  maskImage:
    "linear-gradient(to bottom, #000 55%, transparent 95%), linear-gradient(to right, transparent 0%, #000 15%, #000 85%, transparent 100%)",
  WebkitMaskComposite: "source-in",
  maskComposite: "intersect",
} as const;

/** Desktop: the caption column's left edge and width (the scrim under it follows them). */
const COL_SCRIM_W = "calc(max(8vw, (100vw - 1200px) / 2 + 2rem) + clamp(22.375rem, 28vw, 27.5rem) + 12rem)";

// Shared classes for the run column (the real one and the measured copy).
const CLS = {
  h1: "font-display text-[clamp(1.95rem,8.6vw,2.6rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-foreground lg:text-[clamp(3rem,4.6vw,4.25rem)]",
  subline: "mt-4 max-w-[40ch] text-[15px] leading-relaxed text-muted-foreground sm:text-base lg:mt-6 lg:text-lg",
  hush:
    "font-display text-[clamp(1.45rem,6vw,2rem)] font-medium leading-[1.14] tracking-[-0.025em] text-foreground lg:text-[clamp(1.9rem,2.7vw,2.5rem)]",
  /** Desktop column: under the nav, left of the canvas. */
  col: "absolute z-10 left-[max(8vw,calc((100vw-1200px)/2+2rem))] top-[17svh] w-[clamp(22.375rem,28vw,27.5rem)] [@media(max-height:760px)]:top-[12svh]",
  /** Phone column: under the canvas, clear of the dock. */
  colPhone: "absolute inset-x-5 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-10 sm:inset-x-8",
  eyebrow: "label-mono text-muted-foreground",
  h2: "mt-3 font-display text-[clamp(1.35rem,5.4vw,1.6rem)] font-semibold leading-[1.12] tracking-[-0.025em] text-foreground lg:text-[clamp(1.6rem,2.25vw,2.15rem)]",
  ol: "mt-6 space-y-3.5 [@media(max-height:760px)]:mt-4 [@media(max-height:760px)]:space-y-2.5",
  caption: "text-[17px] leading-snug",
  footer: "mt-6 [@media(max-height:760px)]:mt-4",
  footerP: "max-w-[46ch] text-[14px] leading-relaxed text-muted-foreground lg:text-[15px]",
  linkWrap: "mt-1.5",
  /** The source line and link in normal flow, aligned with the run column. */
  flow: "px-5 pt-3 sm:px-8 lg:pl-[max(8vw,calc((100vw-1200px)/2+2rem))] lg:pr-8 lg:pt-8",
};

/** Invisible, but still prepared by the browser (see the HIDDEN note in DeskPinned). */
const HIDDEN = 0.001;

const ease = (a: number, b: number) => (v: number) => {
  const t = clamp01((v - a) / (b - a));
  return 1 - Math.pow(1 - t, 3); // ease-out cubic
};
const easeInOut = (a: number, b: number) => (v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

function useDecoded(srcs: string[]) {
  // Already in the browser's cache (e.g. painted by the pre-rendered page a
  // moment ago): ready at once, so the planes never blink out and fade back.
  const [ready, setReady] = useState(
    () =>
      typeof window !== "undefined" &&
      srcs.every((s) => {
        const i = new Image();
        i.src = s;
        return i.complete && i.naturalWidth > 0;
      }),
  );
  useEffect(() => {
    let alive = true;
    Promise.all(
      srcs.map((s) => {
        const i = new Image();
        i.src = s;
        return i.decode().catch(() => undefined);
      }),
    ).then(() => alive && setReady(true));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return ready;
}

/**
 * Pointer lean (fine pointers only, opening frame only): he and the canvas
 * shift a few pixels at different rates, the way a real space does when you
 * lean. Fades out as soon as the visitor starts scrolling.
 */
function useLean(p: MotionValue<number>, enabled: boolean) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.7 });
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.7 });
  useEffect(() => {
    if (!enabled) return;
    const on = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", on, { passive: true });
    return () => window.removeEventListener("pointermove", on);
  }, [enabled, mx, my]);
  const k = useTransform(p, (v) => 1 - ease(0, 0.08)(v));
  const both = [sx, sy, k] as MotionValue<number>[];
  return {
    x: useTransform(both, ([x, , f]: number[]) => 6 * x * f),
    y: useTransform(both, ([, y, f]: number[]) => 3 * y * f),
  };
}

// ---------------------------------------------------------------------------
// How much of the run column fits in the pinned frame at this viewport size.

type Fit = "all" | "core" | "none";

function useRunFit(enabled: boolean, phone: boolean) {
  const probe = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<Fit | null>(null);
  useLayoutEffect(() => {
    const box = probe.current;
    if (!enabled || !box) return;
    const q = (s: string) => box.querySelector<HTMLElement>(s);
    // The probe is 100svh tall, so this only changes when the viewport really
    // does (resize, rotation, zoom), not when a phone's toolbar collapses.
    const measure = () => {
      if (phone) {
        // Bottom-anchored over the dock; its top must stay under the canvas.
        const all = q("[data-probe-phone-all]");
        const core = q("[data-probe-phone-core]");
        const floor = q("[data-probe-phone-floor]");
        if (!all || !core || !floor) return;
        const room = floor.offsetTop;
        setFit(all.offsetTop >= room ? "all" : core.offsetTop >= room ? "core" : "none");
      } else {
        const col = q("[data-probe-col]");
        const core = q("[data-probe-core]");
        const limit = q("[data-probe-limit]");
        if (!col || !core || !limit) return;
        const room = limit.offsetTop;
        const allEnd = col.offsetTop + col.offsetHeight;
        const coreEnd = col.offsetTop + core.offsetTop + core.offsetHeight;
        setFit(allEnd <= room ? "all" : coreEnd <= room ? "core" : "none");
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    box.querySelectorAll<HTMLElement>("[data-probe-observe]").forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [enabled, phone]);
  return { probe, fit };
}

/** The phone's one caption slot: every state stacked in one grid cell, so its height is the tallest. */
const PhoneSlot = ({ withFooter }: { withFooter: boolean }) => (
  <div className="mt-3 grid">
    {PHONE_STATES.map((s, i) => (
      <p key={i} className={`${CLS.caption} [grid-area:1/1]`}>
        <span className="font-semibold">{s.title}</span> <span>{s.body}</span>
      </p>
    ))}
    {withFooter && (
      <div className="[grid-area:1/1]">
        <p className={CLS.footerP}>{RUN_FOOTER}</p>
        <span className="mt-1.5 inline-flex min-h-11 items-center text-[15px] font-medium">See the original n8n canvas</span>
      </div>
    )}
  </div>
);

/** An invisible copy of the run column in a 100svh box, measured, never shown. */
const RunProbe = forwardRef<HTMLDivElement, { phone: boolean }>(({ phone }, ref) => (
  <div
    ref={ref}
    aria-hidden
    className="pointer-events-none invisible fixed inset-x-0 top-0 -z-10 h-svh"
    style={{ contain: "strict" }}
  >
    {phone ? (
      <>
        {[true, false].map((withFooter) => (
          <div
            key={String(withFooter)}
            data-probe-observe
            {...(withFooter ? { "data-probe-phone-all": "" } : { "data-probe-phone-core": "" })}
            className={CLS.colPhone}
          >
            <p className={CLS.eyebrow}>{RUN_EYEBROW}</p>
            <h2 className={CLS.h2}>{RUN_H2}</h2>
            <PhoneSlot withFooter={withFooter} />
          </div>
        ))}
        {/* Top of the caption room: the canvas keeps the frame above it. */}
        <div data-probe-phone-floor className="absolute inset-x-0 top-[55svh] h-0" />
      </>
    ) : (
      <>
        <div data-probe-col data-probe-observe className={CLS.col}>
          <div data-probe-core>
            <p className={CLS.eyebrow}>{RUN_EYEBROW}</p>
            <h2 className={CLS.h2}>{RUN_H2}</h2>
            <ol className={CLS.ol}>
              {STEPS.map((s) => (
                <li key={s.title}>
                  <p className={CLS.caption}>
                    <span className="font-semibold">{s.title}</span> <span>{s.body}</span>
                  </p>
                </li>
              ))}
            </ol>
          </div>
          <div className={CLS.footer}>
            <p className={CLS.footerP}>{RUN_FOOTER}</p>
            <div className={CLS.linkWrap}>
              <span className="inline-flex min-h-11 items-center text-[15px] font-medium">See the original n8n canvas</span>
            </div>
          </div>
        </div>
        {/* Bottom of the usable frame: 16px clear of the edge. */}
        <div data-probe-limit className="absolute inset-x-0 bottom-4 h-0" />
      </>
    )}
  </div>
));
RunProbe.displayName = "RunProbe";

/** The phone's caption states: the four steps, with the sample issue and the reply quoted in place of a chat panel. */
const PHONE_STATES = STEPS.map((s) => ({ title: s.title, body: "phone" in s ? s.phone : s.body }));

// ---------------------------------------------------------------------------

/** True only during the build-time pre-render (scripts/prerender.mjs). */
const IS_SERVER = typeof window === "undefined";

export const DeskStage = () => {
  const reduce = useReducedMotion();
  const phone = useMediaQuery(PHONE_QUERY);
  const sideways = useMediaQuery("(orientation: landscape)") && phone;
  const { probe, fit } = useRunFit(!reduce, phone);
  // One section element whatever the mode, so anything holding #home keeps it.
  // The pre-render writes the complete static layout (every word of the hero
  // and the run, in reading order) for crawlers that do not run JavaScript;
  // the browser replaces it with the measured, animated stage on start.
  return (
    <>
      <section id="home" aria-label="Introduction" className="relative">
        {IS_SERVER || reduce || sideways || fit === "none" ? (
          <DeskStatic phone={phone} />
        ) : fit === null ? (
          // First pass only: replaced before the first paint, once measured.
          <div className="h-svh" />
        ) : (
          <DeskPinned phone={phone} footerInFrame={fit === "all"} />
        )}
      </section>
      {!reduce && !IS_SERVER && <RunProbe ref={probe} phone={phone} />}
    </>
  );
};

// ---------------------------------------------------------------------------
// Shared pieces

const NEW_TAB = <span className="sr-only"> (opens in a new tab)</span>;

const Sep = ({ className = "" }: { className?: string }) => (
  <span aria-hidden className={`mr-2.5 text-muted-foreground/60 ${className}`}>
    ·
  </span>
);

/** Desktop: one line. Phone: the first two share a line, the price stands alone. */
const TrustLine = ({ className = "" }: { className?: string }) => (
  <ul
    className={`flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] leading-relaxed text-muted-foreground lg:flex-nowrap ${className}`}
  >
    <li>
      <a
        href={UPWORK_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="-my-3 inline-flex min-h-11 items-center whitespace-nowrap text-foreground/85 underline decoration-border underline-offset-4 transition-[text-decoration-color,opacity] duration-150 ease-out-strong active:opacity-70 [@media(hover:hover)_and_(pointer:fine)]:hover:decoration-foreground"
      >
        Upwork Top Rated
        {NEW_TAB}
      </a>
    </li>
    <li className="whitespace-nowrap">
      <Sep />
      14 years in enterprise IT
    </li>
    <li className="whitespace-nowrap max-lg:basis-full">
      <Sep className="max-lg:hidden" />
      Fixed price per milestone
    </li>
  </ul>
);

const BookButton = ({ className = "" }: { className?: string }) => (
  <a
    href={BOOKING_URL}
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-flex h-11 items-center rounded-md bg-primary px-5 font-medium text-primary-foreground transition-[transform,background-color] duration-150 ease-out-strong active:scale-[0.97] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-primary/90 ${className}`}
  >
    Book a call
    {NEW_TAB}
  </a>
);

/**
 * The run's proof: the real n8n screenshot of this canvas, in the workshop's
 * own dialog (further down the page). Without the workshop mounted, the link
 * still goes to it.
 */
const CanvasLink = ({ onFocus }: { onFocus?: () => void }) => (
  <a
    href="#portfolio"
    aria-haspopup="dialog"
    onFocus={onFocus}
    onClick={(e) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      const opened = !window.dispatchEvent(new CustomEvent(OPEN_WORK_EVENT, { detail: "multi-agent", cancelable: true }));
      if (!opened) jumpTo("portfolio");
    }}
    className="group inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-foreground underline decoration-border underline-offset-4 transition-[text-decoration-color,opacity] duration-150 ease-out-strong active:opacity-70 [@media(hover:hover)_and_(pointer:fine)]:hover:decoration-foreground"
  >
    See the original n8n canvas
    <Maximize2
      aria-hidden
      className="h-3.5 w-3.5 text-muted-foreground transition-colors duration-150 ease-out-strong [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-foreground"
    />
  </a>
);

/** The run's source line and its link. */
const RunFooter = ({ onFocus }: { onFocus?: () => void }) => (
  <>
    <p className={CLS.footerP}>{RUN_FOOTER}</p>
    <div className={CLS.linkWrap}>
      <CanvasLink onFocus={onFocus} />
    </div>
  </>
);

/** Phone wordmark (desktop has the chip). */
const Wordmark = ({ style }: { style?: MotionStyle }) => (
  <motion.a
    href="#home"
    style={style}
    className="absolute left-5 top-2.5 z-10 inline-flex min-h-11 items-center font-display text-base font-semibold tracking-tight text-foreground transition-opacity duration-150 ease-out-strong active:opacity-70 lg:hidden"
  >
    {/* one inline run, so the name reads "Eleazar." with no stray space */}
    <span>
      Eleazar<span className="text-primary">.</span>
    </span>
  </motion.a>
);

// ---------------------------------------------------------------------------
// The pinned version

function DeskPinned({ phone, footerInFrame }: { phone: boolean; footerInFrame: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: track, offset: ["start start", "end end"] });
  // Gate the planes on the images seen first.
  const ready = useDecoded([farSharp, farSoft, phone ? cutoutSm : cutout, phone ? shadeSm : shade]);
  const fine = useMediaQuery(FINE_POINTER_QUERY);
  const frame = useFrame();
  const lean = useLean(p, fine && !phone);
  const T = phone ? T_PHONE : T_DESK;
  const span = phone ? SPAN.phone : SPAN.desk;
  const travel = span - 100;
  const settled = phone ? SETTLED.phone : SETTLED.desk;
  const [colTop, setColTop] = useState(0);
  const colRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = colRef.current;
    if (!phone || !el) return;
    const measure = () => setColTop(el.offsetTop);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [phone, frame.h]);
  const view = useMemo(
    () => (phone ? phoneView(frame.w, frame.h, colTop) : deskView(frame.w, frame.h)),
    [phone, frame.w, frame.h, colTop],
  );

  // "Hidden" layers rest at an invisible 0.001, never 0: the browser skips
  // preparing fully transparent layers, then prepares them all on the first
  // scroll notch (a visible hitch). At 0.001 they are ready before any scroll.

  // -- The run's own progress
  const run = useTransform(p, (v) => clamp01((v - T.run[0]) / (T.run[1] - T.run[0])));

  // -- Hello copy leaves (and stops catching the pointer once it has); the phone wordmark goes with it
  const copyOpacity = useTransform(p, (v) => Math.max(HIDDEN, 1 - ease(T.copyOut[0], T.copyOut[1])(v)));
  const copyY = useTransform(p, (v) => -24 * ease(T.copyOut[0], T.copyOut[1])(v));
  const copyEvents = useTransform(copyOpacity, (o) => (o > 0.5 ? "auto" : "none"));

  // -- He steps back into the dark: the ground-coloured silhouette first, then
  //    the whole figure and the light pool, before the canvas is bright.
  const shadeOpacity = useTransform(p, (v) => Math.max(HIDDEN, ease(T.shade[0], T.shade[1])(v)));
  const subjectOpacity = useTransform(p, (v) => Math.max(HIDDEN, 1 - easeInOut(T.subjectOut[0], T.subjectOut[1])(v)));
  const subjScale = useTransform(p, (v) => 1 - 0.035 * ease(T.shade[0], T.subjectOut[1])(v));
  const subjYsvh = useTransform(p, (v) => 3 * ease(T.shade[0], T.subjectOut[1])(v));
  const subjY = useMotionTemplate`${subjYsvh}svh`;
  const lightOpacity = useTransform(p, (v) => Math.max(HIDDEN, 1 - ease(T.shade[0], T.subjectOut[1])(v)));

  // -- The swap: his background (a still, masked image) gives way to the crisp drawing
  const farOpacity = useTransform(p, (v) => Math.max(HIDDEN, 1 - easeInOut(T.swap[0], T.swap[1])(v)));
  const canvasOpacity = useTransform(p, (v) => Math.max(HIDDEN, easeInOut(T.swap[0], T.swap[1])(v)));
  const floorOpacity = useTransform(p, (v) => Math.max(HIDDEN, 1 - ease(T.swap[0], T.swap[1])(v)));
  const scrimOpacity = useTransform(p, (v) => Math.max(HIDDEN, ease(T.swap[0], T.swap[1])(v)));

  // -- The view: lined up with the image at the swap, then onto the reading spot, then along the run
  const moveIn = (v: number) => easeInOut(T.swap[0], T.h2In[1])(v);
  const camX = useTransform(p, (v) => {
    const r = clamp01((v - T.run[0]) / (T.run[1] - T.run[0]));
    const read = phone ? view.readX(0) : view.readX(along(PAN_WIDE, r));
    return view.alignX + (read - view.alignX) * moveIn(v);
  });
  const camY = useTransform(p, (v) => {
    const r = clamp01((v - T.run[0]) / (T.run[1] - T.run[0]));
    const read = phone ? view.readY(along(panTall(view.endY), r)) : view.readY(WIDE_Y);
    return view.alignY + (read - view.alignY) * moveIn(v);
  });

  // -- Hush line
  const hushOpacity = useTransform(
    p,
    (v) => Math.max(HIDDEN, ease(T.hushIn[0], T.hushIn[1])(v) * (1 - ease(T.hushOut[0], T.hushOut[1])(v))),
  );
  const hushY = useTransform(p, (v) => 14 * (1 - ease(T.hushIn[0], T.hushIn[1])(v)));

  // -- The run column
  const h2Opacity = useTransform(p, (v) => Math.max(HIDDEN, ease(T.h2In[0], T.h2In[1])(v)));
  const h2Y = useTransform(p, (v) => 14 * (1 - ease(T.h2In[0], T.h2In[1])(v)));
  const runEvents = useTransform(h2Opacity, (o) => (o > 0.5 ? "auto" : "none"));
  const footerOpacity = useTransform(p, (v) => Math.max(HIDDEN, ease(T.footerIn[0], T.footerIn[1])(v)));
  const footerY = useTransform(p, (v) => 12 * (1 - ease(T.footerIn[0], T.footerIn[1])(v)));
  const footerEvents = useTransform(footerOpacity, (o) => (o > 0.5 ? "auto" : "none"));
  const chatOpacity = useTransform(p, (v) => Math.max(HIDDEN, ease(T.run[0] - 0.03, T.run[0] + 0.005)(v)));

  const stageTop = () => {
    const el = track.current;
    return el ? el.getBoundingClientRect().top + window.scrollY : 0;
  };
  // Keyboard: focus on the footer link while it is still hidden jumps (at
  // once, so it is never focused and invisible) to where it shows.
  const revealFooter = () => {
    const el = track.current;
    if (!el || p.get() >= settled - 0.02) return;
    const range = el.offsetHeight - document.documentElement.clientHeight;
    window.scrollTo({ top: stageTop() + range * settled, behavior: "instant" });
  };
  // Keyboard: tabbing back into the hero copy after it has left brings the
  // hero back, so focus never lands on a link nobody can see.
  const onHelloFocus = () => {
    if (p.get() <= T.copyOut[0]) return;
    window.scrollTo({ top: stageTop(), behavior: "instant" });
  };

  return (
    <>
      <div ref={track} className="relative" style={{ height: `${span}svh` }}>
        {/* Anchor for "AI agents": lands on the settled end state. */}
        <span
          id="agents"
          aria-hidden
          className="pointer-events-none absolute left-0 h-px w-px"
          style={{ top: `${travel * settled}svh` }}
        />

        <div className="sticky top-0 h-svh overflow-hidden overflow-clip">
          {/* ---------------- planes (fade in together once decoded) ---------------- */}
          <div
            aria-hidden
            className="absolute inset-0 transition-opacity duration-500 ease-out-strong"
            style={{ opacity: ready ? 1 : 0 }}
          >
            {/* Far: his real n8n canvas as a still, masked image. It never moves,
                so its mask is drawn once; it only fades as the drawing takes over. */}
            <motion.div
              className="absolute inset-0"
              style={{
                opacity: farOpacity,
                WebkitMaskImage: phone
                  ? "radial-gradient(ellipse 90% 55% at 50% 70%, #000 30%, transparent 75%)"
                  : "radial-gradient(ellipse 38% 64% at 75% 46%, #000 30%, transparent 80%)",
                maskImage: phone
                  ? "radial-gradient(ellipse 90% 55% at 50% 70%, #000 30%, transparent 75%)"
                  : "radial-gradient(ellipse 38% 64% at 75% 46%, #000 30%, transparent 80%)",
              }}
            >
              <img
                src={farSoft}
                alt=""
                width={1538}
                height={634}
                decoding="async"
                style={phone ? FAR_MASK_PHONE : undefined}
                className="absolute left-1/2 top-[44%] w-[150%] max-w-none -translate-x-[30%] -translate-y-1/2 opacity-70 lg:w-[112%] lg:-translate-x-[40%]"
              />
              <img
                src={farSharp}
                alt=""
                width={1538}
                height={634}
                decoding="async"
                style={phone ? FAR_MASK_PHONE : undefined}
                className="absolute left-1/2 top-[44%] w-[150%] max-w-none -translate-x-[30%] -translate-y-1/2 opacity-70 lg:w-[112%] lg:-translate-x-[40%]"
              />
            </motion.div>

            {/* The same canvas as a crisp drawing: unmasked, moved only by transform. */}
            <motion.div
              className="absolute left-0 top-0"
              style={{ x: camX, y: camY, opacity: canvasOpacity, willChange: "transform" }}
            >
              <RunCanvas layout={phone ? "tall" : "wide"} run={run} unit={`${view.u}px`} />
            </motion.div>

            {/* Desktop: a still ground-coloured scrim under the caption column, so the
                canvas can pass beneath the words. Phone: the same under the caption slot. */}
            {phone && (
              <motion.div
                className="absolute inset-x-0 top-0 h-[5svh]"
                style={{
                  opacity: scrimOpacity,
                  background: "linear-gradient(to bottom, hsl(var(--background)), hsl(var(--background) / 0))",
                }}
              />
            )}
            {phone ? (
              <motion.div
                className="absolute inset-x-0 bottom-0"
                style={{
                  opacity: scrimOpacity,
                  top: colTop > 0 ? colTop - 48 : "50svh",
                  background:
                    "linear-gradient(to bottom, hsl(var(--background) / 0) 0, hsl(var(--background)) 40px, hsl(var(--background)) 100%)",
                }}
              />
            ) : (
              <motion.div
                className="absolute inset-y-0 left-0"
                style={{
                  opacity: scrimOpacity,
                  width: COL_SCRIM_W,
                  background:
                    "linear-gradient(to right, hsl(var(--background)) 0%, hsl(var(--background)) calc(100% - 13rem), hsl(var(--background) / 0) 100%)",
                }}
              />
            )}

            {/* Atmosphere: a warm-neutral light pool behind his head */}
            <motion.div
              className="absolute left-1/2 top-[34%] h-[70svh] w-[70svh] -translate-x-1/2 -translate-y-1/2 rounded-full lg:left-[71vw] lg:top-[40%] lg:h-[90svh] lg:w-[90svh]"
              style={{
                opacity: lightOpacity,
                background: "radial-gradient(closest-side, hsl(32 18% 26% / 0.55), hsl(32 18% 20% / 0.18) 55%, transparent)",
              }}
            />

            {/* Subject */}
            <motion.div
              className="absolute bottom-[-24px] left-1/2 h-[50svh] -translate-x-1/2 lg:bottom-0 lg:left-[71vw] lg:h-[86svh]"
              style={{ aspectRatio: "1165 / 1080", opacity: subjectOpacity }}
            >
              <motion.div className="h-full w-full" style={lean}>
                <motion.div className="relative h-full w-full origin-bottom" style={{ y: subjY, scale: subjScale }}>
                  <img
                    src={phone ? cutoutSm : cutout}
                    alt=""
                    width={1165}
                    height={1080}
                    className="absolute inset-0 h-full w-full max-w-none"
                    draggable={false}
                  />
                  <motion.img
                    src={phone ? shadeSm : shade}
                    alt=""
                    width={1165}
                    height={1080}
                    className="absolute inset-0 h-full w-full max-w-none"
                    style={{ opacity: shadeOpacity }}
                    draggable={false}
                  />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Floor: hides the cutout's crop line while he is there */}
            <motion.div
              className="absolute inset-x-0 bottom-0 h-[22svh] bg-gradient-to-b from-transparent to-background lg:h-[30svh]"
              style={{ opacity: floorOpacity }}
            />
          </div>

          {/* ---------------- copy (always above the planes) ---------------- */}
          <Wordmark style={{ opacity: copyOpacity, pointerEvents: copyEvents }} />

          {/* Hello */}
          <motion.div
            data-sc-copy
            onFocusCapture={onHelloFocus}
            className="absolute inset-x-5 top-[12svh] z-10 sm:inset-x-8 lg:left-[max(8vw,calc((100vw-1200px)/2+2rem))] lg:right-auto lg:top-[29svh] lg:w-[min(44vw,620px)]"
            style={{ opacity: copyOpacity, y: copyY, pointerEvents: copyEvents }}
          >
            <h1 className={CLS.h1}>{H1}</h1>
            <p className={CLS.subline}>{SUBLINE}</p>
            <div className="mt-7 hidden lg:block">
              <BookButton />
            </div>
            <TrustLine className="mt-4 lg:mt-7" />
          </motion.div>

          {/* Hush: one line as the canvas comes into focus (each sentence on its own line) */}
          <motion.p
            data-sc-copy
            className={`pointer-events-none absolute z-10 ${CLS.hush} ${
              phone ? "inset-x-5 bottom-[calc(5rem+env(safe-area-inset-bottom)+4svh)] sm:inset-x-8" : "left-[max(8vw,calc((100vw-1200px)/2+2rem))] top-[30svh] w-[min(34vw,500px)]"
            }`}
            style={{ opacity: hushOpacity, y: hushY }}
          >
            <span className="block">{HUSH[0]}</span> <span className="block text-muted-foreground">{HUSH[1]}</span>
          </motion.p>

          {/* The run: what it is, then one step per beat */}
          {phone ? (
            <PhoneColumn
              colRef={colRef}
              p={p}
              T={T}
              h2Opacity={h2Opacity}
              h2Y={h2Y}
              runEvents={runEvents}
              footerInFrame={footerInFrame}
              revealFooter={revealFooter}
            />
          ) : (
            <motion.div className={CLS.col} style={{ pointerEvents: runEvents }}>
              <motion.div style={{ opacity: h2Opacity, y: h2Y }}>
                <p data-sc-copy className={CLS.eyebrow}>
                  {RUN_EYEBROW}
                </p>
                <h2 id="agents-title" tabIndex={-1} data-sc-copy className={`${CLS.h2} focus-visible:outline-none`}>
                  {RUN_H2}
                </h2>
              </motion.div>
              <p className="sr-only">{RUN_ALT}</p>
              <ol className={CLS.ol}>
                {STEPS.map((s, i) => (
                  <Step key={s.title} p={p} T={T} i={i} title={s.title} body={s.body} />
                ))}
              </ol>
              {footerInFrame && (
                <motion.div
                  data-sc-copy
                  className={CLS.footer}
                  style={{ opacity: footerOpacity, y: footerY, pointerEvents: footerEvents }}
                >
                  <RunFooter onFocus={revealFooter} />
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Desktop: n8n's chat panel, holding the sample issue and, at the end, the answer */}
          {!phone && (
            <motion.div
              className="absolute bottom-[5svh] right-[max(2rem,calc((100vw-1200px)/2))] z-10 w-[clamp(19rem,25vw,24rem)]"
              style={{ opacity: chatOpacity }}
            >
              <RunChat run={run} />
            </motion.div>
          )}
        </div>
      </div>

      {/* Short viewports: the source line and link follow the stage in flow. */}
      {!footerInFrame && (
        <div className={CLS.flow}>
          <motion.div data-sc-copy {...reveal}>
            <RunFooter />
          </motion.div>
        </div>
      )}
    </>
  );
}

/** A step arrives with its first beat and stays; earlier ones step back a little. */
function Step({ p, T, i, title, body }: { p: MotionValue<number>; T: Windows; i: number; title: string; body: string }) {
  const a = beatAt(T, STEPS[i].from)[0];
  const b = beatAt(T, STEPS[i].to)[1];
  const opacity = useTransform(p, (v) => {
    const inT = ease(a, a + 0.03)(v);
    // 0.3 keeps the muted body text above 4.5:1 while stepped back.
    const stepBack = i < STEPS.length - 1 ? 0.3 * ease(b, b + 0.03)(v) : 0;
    const allBack = ease(T.footerIn[0], T.footerIn[1])(v);
    return Math.max(HIDDEN, inT * (1 - stepBack * (1 - allBack)));
  });
  const y = useTransform(p, (v) => 10 * (1 - ease(a, a + 0.04)(v)));
  return (
    <motion.li data-sc-copy style={{ opacity, y }}>
      <p className={CLS.caption}>
        <span className="font-semibold text-foreground">{title}</span>{" "}
        <span className="text-muted-foreground">{body}</span>
      </p>
    </motion.li>
  );
}

/**
 * Phone: the heading, then one caption slot that crossfades through the issue,
 * the four steps and the answer (and, when it fits, the source line last).
 */
function PhoneColumn({
  colRef,
  p,
  T,
  h2Opacity,
  h2Y,
  runEvents,
  footerInFrame,
  revealFooter,
}: {
  colRef: React.RefObject<HTMLDivElement>;
  p: MotionValue<number>;
  T: Windows;
  h2Opacity: MotionValue<number>;
  h2Y: MotionValue<number>;
  runEvents: MotionValue<string>;
  footerInFrame: boolean;
  revealFooter: () => void;
}) {
  // Slot windows: the first step arrives with the heading, then each step at its first beat; the last holds to the footer.
  const starts = STEPS.map((s, i) => (i === 0 ? T.h2In[0] : beatAt(T, s.from)[0]));
  const ends = [...starts.slice(1), footerInFrame ? T.footerIn[0] : 2];
  return (
    <motion.div ref={colRef} className={CLS.colPhone} style={{ pointerEvents: runEvents }}>
      <motion.div style={{ opacity: h2Opacity, y: h2Y }}>
        <p data-sc-copy className={CLS.eyebrow}>
          {RUN_EYEBROW}
        </p>
        <h2 id="agents-title" tabIndex={-1} data-sc-copy className={`${CLS.h2} focus-visible:outline-none`}>
          {RUN_H2}
        </h2>
      </motion.div>
      <p className="sr-only">{RUN_ALT}</p>
      <div className="mt-3 grid">
        {PHONE_STATES.map((s, i) => (
          <PhoneState key={i} p={p} a={starts[i]} b={ends[i]} title={s.title} body={s.body} />
        ))}
        {footerInFrame && <PhoneFooter p={p} T={T} revealFooter={revealFooter} />}
      </div>
    </motion.div>
  );
}

function PhoneState({ p, a, b, title, body }: { p: MotionValue<number>; a: number; b: number; title: string; body: string }) {
  const opacity = useTransform(p, (v) => Math.max(HIDDEN, ease(a, a + 0.025)(v) * (1 - ease(b - 0.018, b)(v))));
  const y = useTransform(p, (v) => 8 * (1 - ease(a, a + 0.03)(v)));
  return (
    <motion.p data-sc-copy aria-hidden className={`${CLS.caption} [grid-area:1/1]`} style={{ opacity, y }}>
      <span className="font-semibold text-foreground">{title}</span> <span className="text-muted-foreground">{body}</span>
    </motion.p>
  );
}

function PhoneFooter({ p, T, revealFooter }: { p: MotionValue<number>; T: Windows; revealFooter: () => void }) {
  const opacity = useTransform(p, (v) => Math.max(HIDDEN, ease(T.footerIn[0], T.footerIn[1])(v)));
  const y = useTransform(p, (v) => 12 * (1 - ease(T.footerIn[0], T.footerIn[1])(v)));
  const events = useTransform(opacity, (o) => (o > 0.5 ? "auto" : "none"));
  return (
    <motion.div data-sc-copy className="[grid-area:1/1]" style={{ opacity, y, pointerEvents: events }}>
      <RunFooter onFocus={revealFooter} />
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Reduced motion (and viewports too short for the pin): the same story,
// static. No sticky, no extra height. The hero keeps his canvas soft behind
// him; the finished run appears once, below, with its steps as a list. Both
// canvas layouts are written out and switched by CSS (the pre-render cannot
// know the screen size).

function DeskStatic({ phone }: { phone: boolean }) {
  return (
    <>
      {/* Hello */}
      <div className="relative overflow-hidden overflow-clip">
        <div aria-hidden className="absolute inset-0">
          <img
            src={farSoft}
            alt=""
            width={1538}
            height={634}
            decoding="async"
            className="absolute left-1/2 top-[44%] w-[150%] max-w-none -translate-x-[30%] -translate-y-1/2 opacity-60 max-lg:landscape:w-[112%] max-lg:landscape:-translate-x-[40%] lg:w-[112%] lg:-translate-x-[40%]"
            style={{
              WebkitMaskImage: "radial-gradient(ellipse 60% 70% at 60% 50%, #000 25%, transparent 72%)",
              maskImage: "radial-gradient(ellipse 60% 70% at 60% 50%, #000 25%, transparent 72%)",
            }}
          />
          <div
            className="absolute left-1/2 top-[34%] h-[70svh] w-[70svh] -translate-x-1/2 -translate-y-1/2 rounded-full max-lg:landscape:left-[74vw] max-lg:landscape:top-[45%] max-lg:landscape:h-[100svh] max-lg:landscape:w-[100svh] lg:left-[71vw] lg:top-[40%] lg:h-[90svh] lg:w-[90svh]"
            style={{ background: "radial-gradient(closest-side, hsl(32 18% 26% / 0.55), hsl(32 18% 20% / 0.18) 55%, transparent)" }}
          />
          <img
            src={phone ? cutoutSm : cutout}
            alt=""
            width={1165}
            height={1080}
            decoding="async"
            className="absolute bottom-[-24px] left-1/2 h-[50svh] w-auto max-w-none -translate-x-1/2 max-lg:landscape:bottom-0 max-lg:landscape:left-[74vw] max-lg:landscape:h-[88%] lg:bottom-0 lg:left-[71vw] lg:h-[86svh]"
          />
          <div className="absolute inset-x-0 bottom-0 h-[22svh] bg-gradient-to-b from-transparent to-background lg:h-[30svh]" />
        </div>
        <Wordmark />
        {/* Copy in flow, so a short or zoomed viewport grows the hero instead of clipping it */}
        {/* Full height on phones too, so his photo sits exactly where the pinned
            stage puts it (the pre-rendered page swaps to the stage without a jump). */}
        <div className="relative z-10 flex min-h-svh flex-col px-5 pb-[calc(50svh-0.5rem)] pt-[12svh] sm:px-8 max-lg:landscape:pb-6 max-lg:landscape:pt-[4.5rem] lg:min-h-svh lg:pb-16 lg:pl-[max(8vw,calc((100vw-1200px)/2+2rem))] lg:pr-0 lg:pt-[29svh]">
          <div className="max-lg:landscape:w-[52vw] lg:w-[min(44vw,620px)]">
            <h1 className={CLS.h1}>{H1}</h1>
            <p className={CLS.subline}>{SUBLINE}</p>
            <div className="mt-7 hidden lg:block">
              <BookButton />
            </div>
            <TrustLine className="mt-4 lg:mt-7" />
          </div>
        </div>
      </div>

      {/* Hush + the finished run, as a normal block */}
      <div id="agents" className="mx-auto w-full max-w-[1200px] px-5 pb-12 pt-16 sm:px-8 lg:pb-16 lg:pt-24">
        <p className={`max-w-[26ch] ${CLS.hush}`}>
          <span className="block">{HUSH[0]}</span> <span className="block text-muted-foreground">{HUSH[1]}</span>
        </p>
        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5 xl:col-span-4">
            <p className={CLS.eyebrow}>{RUN_EYEBROW}</p>
            <h2 id="agents-title" tabIndex={-1} className={`${CLS.h2} focus-visible:outline-none`}>
              {RUN_H2}
            </h2>
            <ol className="mt-6 space-y-4">
              {STEPS.map((s) => (
                <li key={s.title} className={CLS.caption}>
                  <span className="font-semibold text-foreground">{s.title}</span>{" "}
                  <span className="text-muted-foreground">{s.body}</span>
                </li>
              ))}
            </ol>
          </div>
          <figure className="m-0 lg:col-span-7 xl:col-span-8">
            <div className="relative overflow-hidden rounded-lg border border-border bg-[hsl(var(--surface))] p-3 sm:p-5">
              {/* Wide drawing from lg up; the phone layout below it. Both scale to the box. */}
              <div className="hidden [container-type:inline-size] lg:block">
                <RunCanvas layout="wide" unit="calc(100cqw / 1015.1)" />
              </div>
              <div className="mx-auto max-w-[360px] [container-type:inline-size] lg:hidden">
                <RunCanvas layout="tall" unit="calc(100cqw / 340)" />
              </div>
            </div>
            <figcaption className="sr-only">{RUN_ALT}</figcaption>
            <RunChat className="mt-4 lg:ml-auto lg:max-w-[24rem]" />
          </figure>
        </div>
        <div className="mt-10 max-w-[60ch]">
          <RunFooter />
        </div>
      </div>
    </>
  );
}
