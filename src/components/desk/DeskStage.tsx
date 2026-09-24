import { Fragment, forwardRef, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowRight } from "lucide-react";
import { BOOKING_URL, FINE_POINTER_QUERY, PHONE_QUERY, UPWORK_URL, reveal, useMediaQuery } from "@/lib/desk";
import { SCREEN_BEZEL } from "./ScreenShell";
import farSharp from "@/assets/desk/far-canvas.webp";
import farSoft from "@/assets/desk/far-canvas-soft.webp";
import cutout from "@/assets/desk/eleazar.webp";
import cutoutSm from "@/assets/desk/eleazar-sm.webp";
import dashFull from "@/assets/desk/dash-full.webp";
import dashOos from "@/assets/desk/dash-oos.webp";
import dashShip from "@/assets/desk/dash-ship.webp";
import dashStranded from "@/assets/desk/dash-stranded.webp";

/**
 * DeskStage: acts 1 to 3 in one pinned stage (the only pin on the page).
 *   Hello  : he sits facing you, the back of his screen in front of his chest,
 *            his real n8n canvas soft behind him.
 *   Hush   : the copy leaves, he steps back, one line alone (authored silence).
 *   Turn   : the screen swings round to face you. It is the real seller
 *            dashboard he built. It tips back and the three problem panels lift
 *            off it, worst first, while plain captions name each one.
 * Everything is driven by one scroll progress value through MotionValues, so
 * React never re-renders on scroll.
 *
 * The turn's words must be readable in the pinned frame. A hidden copy of the
 * turn column is measured against the frame (per viewport size, never per
 * scroll): when everything fits, the source line and the case-study link sit
 * in the frame; when only the heading and captions fit, those two follow the
 * stage in normal flow; when even that does not fit (phones held sideways,
 * heavy zoom) the page uses the static composition, as it does for reduced
 * motion.
 */

// ---------------------------------------------------------------------------
// Copy (BRIEF.md, with typographic apostrophes; the Hush line drops "just",
// which is on the owner's list of words to avoid)
const H1 = "AI automation engineer.";
const SUBLINE =
  "I’m Eleazar. I build AI agents, n8n workflows and Amazon SP-API tools that take the daily checks off your team.";
const HUSH = ["Seller Central knows everything.", "It doesn’t tell you what to fix first."];
const TURN_H2 = "What needs doing today, worst first.";
const CAPTIONS = [
  {
    title: "Out of stock, still selling.",
    body: "Products with orders and no stock. Always at the top, because they lose sales every day.",
  },
  {
    title: "Needs shipping to Amazon.",
    body: "What to send and how many days are left to cover the season ahead.",
  },
  {
    title: "Stock Amazon is not selling.",
    body: "Units Amazon holds but won’t sell, flagged so someone checks Seller Central.",
  },
];
const TURN_FOOTER =
  "A seller dashboard I built for a US outdoor brand on Amazon. SP-API, n8n, Supabase and React. Client build, in delivery. The first pre-season purchase order has already gone out through it.";
const DASH_ALT =
  "The seller dashboard I built. It opens on today’s problems, worst first: out of stock and still selling, needs shipping to Amazon, stock Amazon is not selling. Brand, products and money figures are blurred for the client.";

// Crop rectangles, measured on the 1440x900 source (percent of the image).
// The stranded list runs off the bottom of the screenshot, so its lifted copy
// stops on the divider under its second row (object-top keeps it pixel-aligned).
const PANELS = [
  { src: dashOos, w: 830, h: 196, left: 28.958, top: 37.889, width: 57.639, height: 21.778, lift: 72, fade: false },
  { src: dashShip, w: 830, h: 196, left: 28.958, top: 60.444, width: 57.639, height: 21.778, lift: 50, fade: false },
  { src: dashStranded, w: 830, h: 152, left: 28.958, top: 83.111, width: 57.639, height: 13.667, lift: 34, fade: true },
];
const FADE_BOTTOM: CSSProperties = {
  WebkitMaskImage: "linear-gradient(to bottom, #000 calc(100% - 3px), transparent)",
  maskImage: "linear-gradient(to bottom, #000 calc(100% - 3px), transparent)",
};

// Progress windows (0..1 across the pinned travel).
const T = {
  copyOut: [0.07, 0.15],
  lidIn: [0.03, 0.16],
  dim: [0.1, 0.3],
  fade: [0.3, 0.4], // his second dim step, finished before the screen crosses his face
  focus: [0.1, 0.26],
  hushIn: [0.15, 0.21],
  hushOut: [0.3, 0.36],
  rotate: [0.3, 0.5],
  travel: [0.3, 0.54],
  tip: [0.52, 0.6],
  h2In: [0.52, 0.58],
  lifts: [
    [0.58, 0.68],
    [0.68, 0.78],
    [0.78, 0.88],
  ],
  footerIn: [0.88, 0.93],
};
// Phone: the screen turns in place first, then rises to the top.
const PHONE_TURN = { rotate: [0.3, 0.42], travel: [0.4, 0.54] };
// The settled end state: all three problems named, source line and link in.
// The #work anchor lands here, and so does keyboard focus on the link.
const SETTLED_AT = 0.94;

// Stage heights in svh (desktop / phone). Travel = height - 100.
const SPAN = { desk: 320, phone: 250 };

const XL_QUERY = "(min-width: 1280px)";

/**
 * Where the screen sits. The wrapper is the reading position (end state). On
 * phones the rest pose (the back of the screen in front of his chest) is set
 * in svh/vw. On desktop it is derived from the viewport, because he is sized
 * by height and the screen by width: the lid is sized and placed against him
 * (its lowest corner just above the fold, its top edge clear of his chin), so
 * it reads as a whole device at every aspect ratio. Between lg and xl the
 * caption column needs more room, so the screen is a little narrower there.
 */
type Geo = {
  left: number; // vw
  width: number; // vw
  top: string;
  restX: number; // vw
  restScale: number;
  restYsvh: number;
  restYvw: number;
  restRot: number; // deg; 180 = the back square on
  tipY: number;
  tipX: number;
};
const PHONE_GEO: Geo = {
  left: 4, width: 92, top: "6svh", restX: 0, restScale: 0.58, restYsvh: 82, restYvw: -28.75, restRot: 155, tipY: 0, tipX: 9,
};
const DESK_FRAME = {
  lg: { left: 46, width: 47 },
  xl: { left: 40, width: 52 },
};
const DESK_REST = {
  rot: 148, // 32 degrees off square, so the edge thickness reads
  lidW: 0.46, // flat lid width, as a share of the viewport height
  centerX: [0.71, 0.055], // 71vw (his centre line) + 5.5svh
  lowest: 0.965, // lowest corner, as a share of the viewport height
  reach: 1.05, // lowest corner below the lid's centre, in flat half heights
  // Perspective in step with the screen's width (1400px at 1440 wide), so the
  // turn and the rest pose keep the same depth at every desktop width.
  depth: 1.87,
};
function deskGeo(xl: boolean, w: number, h: number): Geo {
  const { left, width } = xl ? DESK_FRAME.xl : DESK_FRAME.lg;
  const wrapW = (width / 100) * w;
  const lidW = DESK_REST.lidW * h;
  const centerX = DESK_REST.centerX[0] * w + DESK_REST.centerX[1] * h;
  const centerY = DESK_REST.lowest * h - DESK_REST.reach * ((lidW * 10) / 16 / 2);
  return {
    left,
    width,
    top: `calc(54svh - ${(width * 10) / 32}vw)`,
    restX: ((centerX - (left / 100) * w - wrapW / 2) / w) * 100,
    restScale: lidW / wrapW,
    restYsvh: ((centerY - 0.54 * h) / h) * 100,
    restYvw: 0,
    restRot: DESK_REST.rot,
    tipY: -9,
    tipX: 11,
  };
}

function useViewport() {
  const [vp, setVp] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  useEffect(() => {
    const on = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return vp;
}

/** Fades the shirt out below the chest, so its red logo never shows in any state. */
const SUBJECT_MASK: CSSProperties = {
  WebkitMaskImage: "linear-gradient(to bottom, #000 70%, transparent 84%)",
  maskImage: "linear-gradient(to bottom, #000 70%, transparent 84%)",
};
/** Phone: the far canvas fades out before any of its own edges. */
const FAR_MASK_PHONE: CSSProperties = {
  WebkitMaskImage:
    "linear-gradient(to bottom, #000 55%, transparent 95%), linear-gradient(to right, transparent 0%, #000 15%, #000 85%, transparent 100%)",
  maskImage:
    "linear-gradient(to bottom, #000 55%, transparent 95%), linear-gradient(to right, transparent 0%, #000 15%, #000 85%, transparent 100%)",
  WebkitMaskComposite: "source-in",
  maskComposite: "intersect",
};

// Shared classes for the turn column (the real one and the measured copy).
const CLS = {
  h1: "font-display text-[clamp(1.95rem,8.6vw,2.6rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-foreground lg:text-[clamp(3rem,4.6vw,4.25rem)]",
  subline: "mt-4 max-w-[40ch] text-[15px] leading-relaxed text-muted-foreground sm:text-base lg:mt-6 lg:text-lg",
  col:
    "absolute inset-x-5 top-[calc(6svh+57.5vw+0.875rem)] z-10 sm:inset-x-8 " +
    "lg:inset-x-auto lg:left-[max(8vw,calc((100vw-1200px)/2+2rem))] lg:top-[22svh] lg:w-[clamp(22.375rem,28vw,27.5rem)] " +
    "lg:[@media(max-height:760px)]:top-[12svh]",
  h2: "h-section font-display font-semibold text-foreground",
  ol: "mt-2.5 space-y-2.5 lg:mt-7 lg:space-y-5 lg:[@media(max-height:760px)]:mt-5 lg:[@media(max-height:760px)]:space-y-3",
  caption: "text-[17px] leading-snug",
  footer: "mt-4 lg:mt-8 lg:[@media(max-height:760px)]:mt-5",
  footerP: "max-w-[46ch] text-[14px] leading-relaxed text-muted-foreground lg:text-[15px]",
  linkWrap: "mt-1.5",
  /** The source line and link in normal flow, aligned with the turn column. */
  flow: "px-5 pt-3 sm:px-8 lg:pl-[max(8vw,calc((100vw-1200px)/2+2rem))] lg:pr-8 lg:pt-8",
};

const ease = (a: number, b: number) => (v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return 1 - Math.pow(1 - t, 3); // ease-out cubic
};
const easeInOut = (a: number, b: number) => (v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

function useDecoded(srcs: string[]) {
  const [ready, setReady] = useState(false);
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
 * Pointer lean (fine pointers only, opening frame only): the planes shift a few
 * pixels at different rates, the way a real space does when you lean. Fades out
 * as soon as the visitor starts scrolling. Never required to read the page.
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
  const farX = useTransform(both, ([x, , f]: number[]) => -12 * x * f);
  const farY = useTransform(both, ([, y, f]: number[]) => -6 * y * f);
  const subjX = useTransform(both, ([x, , f]: number[]) => 6 * x * f);
  const subjY = useTransform(both, ([, y, f]: number[]) => 3 * y * f);
  const scrX = useTransform(both, ([x, , f]: number[]) => 16 * x * f);
  const scrY = useTransform(both, ([, y, f]: number[]) => 5 * y * f);
  return {
    far: { x: farX, y: farY },
    subject: { x: subjX, y: subjY },
    screen: { x: scrX, y: scrY },
  };
}

// ---------------------------------------------------------------------------
// How much of the turn column fits in the pinned frame at this viewport size.

type Fit = "all" | "core" | "none";

function useTurnFit(enabled: boolean) {
  const probe = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<Fit | null>(null);
  useLayoutEffect(() => {
    const box = probe.current;
    if (!enabled || !box) return;
    const col = box.querySelector<HTMLElement>("[data-probe-col]");
    const core = box.querySelector<HTMLElement>("[data-probe-core]");
    const limit = box.querySelector<HTMLElement>("[data-probe-limit]");
    if (!col || !core || !limit) return;
    // The probe is 100svh tall, so this only changes when the viewport really
    // does (resize, rotation, zoom), not when a phone's toolbar collapses.
    const measure = () => {
      const room = limit.offsetTop;
      const allEnd = col.offsetTop + col.offsetHeight;
      const coreEnd = col.offsetTop + core.offsetTop + core.offsetHeight;
      setFit(allEnd <= room ? "all" : coreEnd <= room ? "core" : "none");
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    ro.observe(col);
    return () => ro.disconnect();
  }, [enabled]);
  return { probe, fit };
}

/** An invisible copy of the turn column in a 100svh box, measured, never shown. */
const TurnProbe = forwardRef<HTMLDivElement>((_, ref) => (
  <div
    ref={ref}
    aria-hidden
    className="pointer-events-none invisible fixed inset-x-0 top-0 -z-10 h-svh"
    style={{ contain: "strict" }}
  >
    <div data-probe-col className={CLS.col}>
      <div data-probe-core>
        <h2 className={CLS.h2}>{TURN_H2}</h2>
        <ol className={CLS.ol}>
          {CAPTIONS.map((c) => (
            <li key={c.title}>
              <p className={CLS.caption}>
                <span className="font-semibold">{c.title}</span> <span>{c.body}</span>
              </p>
            </li>
          ))}
        </ol>
      </div>
      <div className={CLS.footer}>
        <p className={CLS.footerP}>{TURN_FOOTER}</p>
        <div className={CLS.linkWrap}>
          <span className="inline-flex min-h-11 items-center text-[15px] font-medium">Read the case study</span>
        </div>
      </div>
    </div>
    {/* Bottom of the usable frame: 16px clear of the edge, and of the dock on phones. */}
    <div data-probe-limit className="absolute inset-x-0 bottom-[calc(5rem+env(safe-area-inset-bottom))] h-0 lg:bottom-4" />
  </div>
));
TurnProbe.displayName = "TurnProbe";

// ---------------------------------------------------------------------------

export const DeskStage = () => {
  const reduce = useReducedMotion();
  const phone = useMediaQuery(PHONE_QUERY);
  const { probe, fit } = useTurnFit(!reduce);
  // One section element whatever the mode, so anything holding #home keeps it.
  return (
    <>
      <section id="home" aria-label="Introduction" className="relative">
        {reduce || fit === "none" ? (
          <DeskStatic phone={phone} />
        ) : fit === null ? (
          // First pass only: replaced before the first paint, once measured.
          <div className="h-svh" />
        ) : (
          <DeskPinned phone={phone} footerInFrame={fit === "all"} />
        )}
      </section>
      {!reduce && <TurnProbe ref={probe} />}
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

const CaseStudyLink = ({ onFocus }: { onFocus?: () => void }) => (
  <Link
    to="/case-study/seller-dashboard"
    onFocus={onFocus}
    // The visible text plus which case study (the page has three such links).
    aria-label="Read the case study: Seller dashboard"
    className="group inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-foreground underline decoration-border underline-offset-4 transition-[text-decoration-color,opacity] duration-150 ease-out-strong active:opacity-70 [@media(hover:hover)_and_(pointer:fine)]:hover:decoration-foreground"
  >
    Read the case study
    <ArrowRight
      className="h-4 w-4 transition-transform duration-150 ease-out-strong [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-0.5"
      aria-hidden
    />
  </Link>
);

/** The turn's source line and the case-study link. */
const TurnFooter = ({ onFocus }: { onFocus?: () => void }) => (
  <>
    <p className={CLS.footerP}>{TURN_FOOTER}</p>
    <div className={CLS.linkWrap}>
      <CaseStudyLink onFocus={onFocus} />
    </div>
  </>
);

/** Phone wordmark (desktop has the chip). */
const Wordmark = () => (
  <a
    href="#home"
    className="absolute left-5 top-2.5 z-10 inline-flex min-h-11 items-center font-display text-base font-semibold tracking-tight text-foreground transition-opacity duration-150 ease-out-strong active:opacity-70 lg:hidden"
  >
    {/* one inline run, so the name reads "Eleazar." with no stray space */}
    <span>
      Eleazar<span className="text-primary">.</span>
    </span>
  </a>
);

/** The back of the screen: matte, lit along the top lip, with a sheen. */
const ScreenBack = ({ sheen }: { sheen?: MotionValue<number> | number }) => (
  <div
    aria-hidden
    className="absolute inset-0 rounded-[10px]"
    style={{
      transform: "rotateY(180deg) translateZ(8px)",
      background: "linear-gradient(180deg, hsl(30 6% 15%), hsl(30 6% 10%) 38%, hsl(30 6% 8%))",
      boxShadow: "inset 0 1px 0 hsl(40 25% 96% / 0.12), inset 0 0 0 1px hsl(40 25% 96% / 0.07), var(--e3)",
    }}
  >
    {/* an embossed mark and a hinge line, so it reads as a lid */}
    <span
      className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 select-none font-display text-[clamp(1.5rem,3.4vw,3rem)] font-semibold tracking-tight"
      style={{ color: "hsl(30 6% 13%)", textShadow: "0 1px 0 hsl(40 25% 96% / 0.07), 0 -1px 0 hsl(30 30% 2% / 0.6)" }}
    >
      E.
    </span>
    <div className="absolute inset-x-[6%] bottom-[7%] h-px bg-[hsl(40_25%_96%/0.1)]" />
    {sheen !== undefined && (
      <motion.div
        className="absolute inset-0 rounded-[10px]"
        style={{
          opacity: sheen,
          background: "linear-gradient(105deg, transparent 28%, hsl(40 25% 96% / 0.08) 46%, transparent 62%)",
        }}
      />
    )}
  </div>
);

/** Device thickness: thin strips on the edges, behind the front face. */
const Edges = () => (
  <>
    <div
      aria-hidden
      className="absolute left-full top-0 h-full w-2 origin-left"
      style={{ transform: "rotateY(90deg)", background: "hsl(30 5% 17%)" }}
    />
    <div
      aria-hidden
      className="absolute right-full top-0 h-full w-2 origin-right"
      style={{ transform: "rotateY(-90deg)", background: "hsl(30 5% 13%)" }}
    />
    <div
      aria-hidden
      className="absolute bottom-full left-0 h-2 w-full origin-bottom"
      style={{ transform: "rotateX(-90deg)", background: "hsl(30 5% 22%)" }}
    />
  </>
);

// ---------------------------------------------------------------------------
// The pinned version

function DeskPinned({ phone, footerInFrame }: { phone: boolean; footerInFrame: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: track, offset: ["start start", "end end"] });
  // Gate the planes on the images seen first; the dashboard is not seen until
  // the turn, so it loads on its own.
  const ready = useDecoded([farSharp, farSoft, phone ? cutoutSm : cutout]);
  const fine = useMediaQuery(FINE_POINTER_QUERY);
  const xl = useMediaQuery(XL_QUERY);
  const vp = useViewport();
  const lean = useLean(p, fine && !phone);
  const geo = phone ? PHONE_GEO : deskGeo(xl, vp.w, vp.h);
  const turn = phone ? PHONE_TURN : T;
  const span = phone ? SPAN.phone : SPAN.desk;
  const travel = span - 100;

  // -- Hello copy leaves (and stops catching the pointer once it has)
  const copyOpacity = useTransform(p, (v) => 1 - ease(T.copyOut[0], T.copyOut[1])(v));
  const copyY = useTransform(p, (v) => -24 * ease(T.copyOut[0], T.copyOut[1])(v));
  const copyEvents = useTransform(copyOpacity, (o) => (o > 0.5 ? "auto" : "none"));

  // -- Far plane: slow drift + rack focus by crossfading two pre-blurred files
  const farY = useTransform(p, (v) => -40 * ease(0, 0.6)(v));
  const farScale = useTransform(p, (v) => 1.04 - 0.04 * ease(0, 0.6)(v));
  const farSharpOpacity = useTransform(p, (v) => 1 - ease(T.focus[0], T.focus[1])(v));
  const lightOpacity = useTransform(p, (v) => 1 - 0.6 * ease(T.dim[0], T.travel[1])(v));

  // -- The screen: turn, travel, tip back
  const rotT = useTransform(p, easeInOut(turn.rotate[0], turn.rotate[1]));
  const travelT = useTransform(p, easeInOut(turn.travel[0], turn.travel[1]));
  const tipT = useTransform(p, ease(T.tip[0], T.tip[1]));
  const rotY = useTransform([rotT, tipT] as MotionValue<number>[], ([r, t]: number[]) =>
    geo.restRot * (1 - r) + geo.tipY * t,
  );
  const rotX = useTransform([rotT, tipT] as MotionValue<number>[], ([r, t]: number[]) => 7 * (1 - r) + geo.tipX * t);
  const scrScale = useTransform(travelT, (t) => geo.restScale + (1 - geo.restScale) * t);
  // Each translation interpolates in a single unit (svh or vw), on its own wrapper or axis.
  const scrYsvh = useTransform(travelT, (t) => geo.restYsvh * (1 - t));
  const scrYvw = useTransform(travelT, (t) => geo.restYvw * (1 - t));
  const scrXvw = useTransform(travelT, (t) => geo.restX * (1 - t));
  const outerY = useMotionTemplate`${scrYsvh}svh`;
  const innerY = useMotionTemplate`${scrYvw}vw`;
  const innerX = useMotionTemplate`${scrXvw}vw`;
  const frontOpacity = useTransform(rotY, (v) => (Math.abs(v) < 90 ? 1 : 0));
  const backOpacity = useTransform(rotY, (v) => (Math.abs(v) < 90 ? 0 : 1));
  const sheen = useTransform(rotY, (v) => Math.max(0, 1 - Math.abs(v - geo.restRot) / 30));
  // The first screen is just him and the headline. As the headline leaves, he
  // lifts the screen into view (done before the Hush line, so the silence stays still).
  const lidIn = useTransform(p, (v) => ease(T.lidIn[0], T.lidIn[0] + 0.07)(v));
  const lidRise = useTransform(p, (v) => 22 * (1 - ease(T.lidIn[0], T.lidIn[1])(v)));
  const lidRiseY = useMotionTemplate`${lidRise}svh`;

  // -- Subject: steps back and dims (a ground-coloured overlay masked by his own
  //    alpha). The second dim step is done before the rising screen reaches his
  //    face; on phone he also sinks on the screen's own curve, not ahead of it.
  const subjYsvh = useTransform([p, travelT] as MotionValue<number>[], ([v, t]: number[]) =>
    2.5 * ease(T.dim[0], T.dim[1])(v) + (phone ? 16 * t : 12 * ease(T.travel[0], T.travel[1])(v)),
  );
  const subjY = useMotionTemplate`${subjYsvh}svh`;
  const subjScale = useTransform(p, (v) => 1 - 0.04 * ease(T.dim[0], T.dim[1])(v));
  const subjX = useTransform(p, (v) => (phone ? 0 : 3 * ease(T.travel[0], T.travel[1])(v)));
  const subjXvw = useMotionTemplate`${subjX}vw`;
  const subjDim = useTransform(
    p,
    (v) => 0.42 * ease(T.dim[0], T.dim[1])(v) + (phone ? 0.52 : 0.43) * ease(T.fade[0], T.fade[1])(v),
  );

  // -- Hush line
  const hushOpacity = useTransform(
    p,
    (v) => ease(T.hushIn[0], T.hushIn[1])(v) * (1 - ease(T.hushOut[0], T.hushOut[1])(v)),
  );
  const hushY = useTransform(p, (v) => 14 * (1 - ease(T.hushIn[0], T.hushIn[1])(v)));

  // -- Lifts, worst first
  const baseDim = useTransform(p, (v) => 0.5 * ease(T.lifts[0][0], T.lifts[0][0] + 0.06)(v));
  const h2Opacity = useTransform(p, ease(T.h2In[0], T.h2In[1]));
  const h2Y = useTransform(p, (v) => 14 * (1 - ease(T.h2In[0], T.h2In[1])(v)));
  const turnEvents = useTransform(h2Opacity, (o) => (o > 0.5 ? "auto" : "none"));
  const footerOpacity = useTransform(p, ease(T.footerIn[0], T.footerIn[1]));
  const footerY = useTransform(p, (v) => 12 * (1 - ease(T.footerIn[0], T.footerIn[1])(v)));
  const footerEvents = useTransform(footerOpacity, (o) => (o > 0.5 ? "auto" : "none"));

  const stageTop = () => {
    const el = track.current;
    return el ? el.getBoundingClientRect().top + window.scrollY : 0;
  };
  // Keyboard: focus on the footer link while it is still hidden jumps (at
  // once, so it is never focused and invisible) to where it shows.
  const revealFooter = () => {
    const el = track.current;
    if (!el || p.get() >= SETTLED_AT - 0.02) return;
    const range = el.offsetHeight - document.documentElement.clientHeight;
    window.scrollTo({ top: stageTop() + range * SETTLED_AT, behavior: "instant" });
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
        {/* Anchor for "Work": lands on the settled end state. */}
        <span
          id="work"
          aria-hidden
          className="pointer-events-none absolute left-0 h-px w-px"
          style={{ top: `${travel * SETTLED_AT}svh` }}
        />

        <div className="sticky top-0 h-svh overflow-hidden overflow-clip">
          {/* ---------------- planes (fade in together once decoded) ---------------- */}
          <div
            aria-hidden
            className="absolute inset-0 transition-opacity duration-500 ease-out-strong"
            style={{ opacity: ready ? 1 : 0 }}
          >
            {/* Far: his real n8n canvas, masked away from the copy column */}
            <motion.div
              className="absolute inset-0"
              style={{
                y: farY,
                scale: farScale,
                WebkitMaskImage: phone
                  ? "radial-gradient(ellipse 90% 55% at 50% 70%, #000 30%, transparent 75%)"
                  : "radial-gradient(ellipse 38% 64% at 75% 46%, #000 30%, transparent 80%)",
                maskImage: phone
                  ? "radial-gradient(ellipse 90% 55% at 50% 70%, #000 30%, transparent 75%)"
                  : "radial-gradient(ellipse 38% 64% at 75% 46%, #000 30%, transparent 80%)",
              }}
            >
              <motion.div className="absolute inset-0" style={lean.far}>
                <img
                  src={farSoft}
                  alt=""
                  width={1538}
                  height={634}
                  decoding="async"
                  style={phone ? FAR_MASK_PHONE : undefined}
                  className="absolute left-1/2 top-[44%] w-[150%] max-w-none -translate-x-[30%] -translate-y-1/2 opacity-70 lg:w-[112%] lg:-translate-x-[40%]"
                />
                <motion.img
                  src={farSharp}
                  alt=""
                  width={1538}
                  height={634}
                  decoding="async"
                  style={{ opacity: farSharpOpacity, ...(phone ? FAR_MASK_PHONE : null) }}
                  className="absolute left-1/2 top-[44%] w-[150%] max-w-none -translate-x-[30%] -translate-y-1/2 opacity-70 lg:w-[112%] lg:-translate-x-[40%]"
                />
              </motion.div>
            </motion.div>

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
              style={{ aspectRatio: "1165 / 1080" }}
            >
              <motion.div className="h-full w-full" style={lean.subject}>
                <motion.div
                  className="relative h-full w-full origin-bottom"
                  style={{ x: subjXvw, y: subjY, scale: subjScale, ...SUBJECT_MASK }}
                >
                  <img
                    src={phone ? cutoutSm : cutout}
                    alt=""
                    width={1165}
                    height={1080}
                    className="absolute inset-0 h-full w-full max-w-none"
                    draggable={false}
                  />
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      opacity: subjDim,
                      background: "hsl(var(--background))",
                      WebkitMaskImage: `url(${phone ? cutoutSm : cutout})`,
                      maskImage: `url(${phone ? cutoutSm : cutout})`,
                      WebkitMaskSize: "100% 100%",
                      maskSize: "100% 100%",
                    }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Floor: hides the cutout's crop line at every scroll position */}
            <div className="absolute inset-x-0 bottom-0 h-[22svh] bg-gradient-to-b from-transparent to-background lg:h-[30svh]" />
          </div>

          {/* ---------------- the screen (near plane) ---------------- */}
          {/* Hidden from assistive tech: the dashboard is described right after the turn heading. */}
          <div
            aria-hidden
            className="absolute"
            style={{
              left: `${geo.left}vw`,
              top: geo.top,
              width: `${geo.width}vw`,
              aspectRatio: "16 / 10",
            }}
          >
            <motion.div className="h-full w-full" style={{ opacity: ready ? lidIn : 0, y: lidRiseY }}>
            <motion.div className="h-full w-full" style={lean.screen}>
              {/* Desktop moves and sizes the whole projected screen (so its depth reads
                  the same at rest at every size); phone moves the figure itself. */}
              <motion.div
                className="h-full w-full"
                style={{
                  y: outerY,
                  x: phone ? 0 : innerX,
                  scale: phone ? 1 : scrScale,
                  perspective: phone ? 1400 : `${geo.width * DESK_REST.depth}vw`,
                }}
              >
                <motion.figure
                  className="relative m-0 h-full w-full"
                  style={{
                    x: phone ? innerX : 0,
                    y: innerY,
                    scale: phone ? scrScale : 1,
                    rotateY: rotY,
                    rotateX: rotX,
                    transformStyle: "preserve-3d",
                    willChange: "transform",
                  }}
                >
                  <Edges />
                  <motion.div className="absolute inset-0" style={{ opacity: backOpacity, transformStyle: "preserve-3d" }}>
                    <ScreenBack sheen={sheen} />
                  </motion.div>

                  {/* Front face: the real dashboard */}
                  <motion.div
                    className="absolute inset-0 rounded-[10px]"
                    style={{
                      opacity: frontOpacity,
                      transformStyle: "preserve-3d",
                      background: SCREEN_BEZEL,
                      padding: "0.6%",
                      boxShadow: "inset 0 1px 0 hsl(40 25% 96% / 0.10), inset 0 0 0 1px hsl(40 25% 96% / 0.05), var(--e3)",
                    }}
                  >
                    <div className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
                      <img
                        src={dashFull}
                        alt=""
                        width={1440}
                        height={900}
                        decoding="async"
                        className="absolute inset-0 h-full w-full max-w-none rounded-[5px]"
                        draggable={false}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-[5px] bg-background"
                        style={{ opacity: baseDim, transform: "translateZ(0.5px)" }}
                      />
                      {PANELS.map((panel, i) => (
                        <LiftPanel key={i} p={p} i={i} panel={panel} />
                      ))}
                    </div>
                  </motion.div>
                </motion.figure>
              </motion.div>
            </motion.div>
            </motion.div>
          </div>

          {/* ---------------- copy (always above the planes) ---------------- */}
          <Wordmark />

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

          {/* Hush: the authored silence (each sentence on its own line) */}
          <motion.p
            data-sc-copy
            className="pointer-events-none absolute inset-x-5 top-[14svh] z-10 font-display text-[clamp(1.6rem,6.4vw,2.2rem)] font-medium leading-[1.12] tracking-[-0.025em] text-foreground sm:inset-x-8 lg:left-[max(8vw,calc((100vw-1200px)/2+2rem))] lg:right-auto lg:top-[36svh] lg:w-[min(36vw,520px)] lg:text-[clamp(2rem,3vw,2.75rem)]"
            style={{ opacity: hushOpacity, y: hushY }}
          >
            <span className="block">{HUSH[0]}</span> <span className="block text-muted-foreground">{HUSH[1]}</span>
          </motion.p>

          {/* Turn: heading, captions, and (when it fits) the footer */}
          <motion.div className={CLS.col} style={{ pointerEvents: turnEvents }}>
            <motion.h2
              id="work-title"
              tabIndex={-1}
              data-sc-copy
              className={`${CLS.h2} focus-visible:outline-none`}
              style={{ opacity: h2Opacity, y: h2Y }}
            >
              {TURN_H2}
            </motion.h2>
            <p className="sr-only">{DASH_ALT}</p>
            <ol className={CLS.ol}>
              {CAPTIONS.map((c, i) => (
                <Caption key={c.title} p={p} i={i} title={c.title} body={c.body} />
              ))}
            </ol>
            {footerInFrame && (
              <motion.div
                data-sc-copy
                className={CLS.footer}
                style={{ opacity: footerOpacity, y: footerY, pointerEvents: footerEvents }}
              >
                <TurnFooter onFocus={revealFooter} />
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Short viewports: the source line and link follow the stage in flow. */}
      {!footerInFrame && (
        <div className={CLS.flow}>
          <motion.div data-sc-copy {...reveal}>
            <TurnFooter />
          </motion.div>
        </div>
      )}
    </>
  );
}

/** One problem panel: lifts off the sheet to a height set by its urgency. */
function LiftPanel({
  p,
  i,
  panel,
}: {
  p: MotionValue<number>;
  i: number;
  panel: (typeof PANELS)[number];
}) {
  const [a, b] = T.lifts[i];
  const liftT = useTransform(p, ease(a, a + (b - a) * 0.6));
  const z = useTransform(liftT, (t) => 1 + panel.lift * t);
  const shadow = useTransform(liftT, (t) => 0.65 * t);
  // A dark plate over the panel's own footprint, so the dimmed base copy never
  // shows through beside the lifted one.
  const plate = useTransform(liftT, (t) => 0.8 * Math.min(1, t * 4));
  // One accent: the active panel carries the outline. At the end it returns to the worst one.
  const outline = useTransform(p, (v) => {
    const end = T.footerIn[0];
    if (v >= end) return i === 0 ? 1 : 0;
    return v >= a && v < b ? 1 : 0;
  });
  const rect: CSSProperties = {
    left: `${panel.left}%`,
    top: `${panel.top}%`,
    width: `${panel.width}%`,
    height: `${panel.height}%`,
  };
  return (
    <>
      <motion.div
        className="absolute rounded-[6px] bg-background"
        style={{ ...rect, opacity: plate, transform: "translateZ(0.6px)" }}
      />
      <motion.div
        className="absolute rounded-[6px]"
        style={{
          ...rect,
          opacity: shadow,
          background: "hsl(var(--shadow-tint) / 0.95)",
          filter: "blur(10px)",
          transform: "translateZ(0.8px) translateY(6px)",
        }}
      />
      <motion.div className="absolute" style={{ ...rect, z, transformStyle: "preserve-3d" }}>
        <PanelImg panel={panel} />
        <motion.div
          className="absolute -inset-[3px] rounded-[8px] border-2 border-primary"
          style={{ opacity: outline }}
        />
      </motion.div>
    </>
  );
}

const PanelImg = ({ panel }: { panel: (typeof PANELS)[number] }) => (
  <img
    src={panel.src}
    alt=""
    width={panel.w}
    height={panel.h}
    decoding="async"
    className="block h-full w-full max-w-none rounded-[6px] object-cover object-top"
    style={panel.fade ? FADE_BOTTOM : undefined}
    draggable={false}
  />
);

/** A caption arrives with its lift and stays; earlier ones step back a little. */
function Caption({ p, i, title, body }: { p: MotionValue<number>; i: number; title: string; body: string }) {
  const [a, b] = T.lifts[i];
  const opacity = useTransform(p, (v) => {
    const inT = ease(a, a + 0.03)(v);
    // 0.3 keeps the muted body text above 4.5:1 while stepped back.
    const stepBack = i < T.lifts.length - 1 ? 0.3 * ease(b, b + 0.03)(v) : 0;
    const allBack = ease(T.footerIn[0], T.footerIn[1])(v);
    return inT * (1 - stepBack * (1 - allBack));
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

// ---------------------------------------------------------------------------
// Reduced motion (and viewports too short for the pin): the same story,
// static. No sticky, no extra height. The hero keeps the back of the screen in
// front of him; the dashboard itself appears once, below, with its captions.

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
            style={SUBJECT_MASK}
          />
          <div className="absolute inset-x-0 bottom-0 h-[22svh] bg-gradient-to-b from-transparent to-background lg:h-[30svh]" />
        </div>
        <Wordmark />
        {/* Copy in flow, so a short or zoomed viewport grows the hero instead of clipping it */}
        <div className="relative z-10 flex min-h-[calc(100svh-4rem)] flex-col px-5 pb-[calc(50svh-0.5rem)] pt-[12svh] sm:px-8 max-lg:landscape:pb-6 max-lg:landscape:pt-[4.5rem] lg:min-h-svh lg:pb-16 lg:pl-[max(8vw,calc((100vw-1200px)/2+2rem))] lg:pr-0 lg:pt-[29svh]">
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

      {/* Hush + Turn, as a normal block */}
      <div id="work" className="mx-auto w-full max-w-[1200px] px-5 pb-16 pt-20 sm:px-8 lg:pb-24 lg:pt-28">
        <p className="max-w-[26ch] font-display text-[clamp(1.6rem,3vw,2.6rem)] font-medium leading-[1.12] tracking-[-0.025em] text-foreground">
          <span className="block">{HUSH[0]}</span> <span className="block text-muted-foreground">{HUSH[1]}</span>
        </p>
        <div className="mt-14 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5 xl:col-span-4">
            <h2 id="work-title" tabIndex={-1} className={`${CLS.h2} focus-visible:outline-none`}>
              {TURN_H2}
            </h2>
            <ol className="mt-6 space-y-4">
              {CAPTIONS.map((c) => (
                <li key={c.title} className={CLS.caption}>
                  <span className="font-semibold text-foreground">{c.title}</span>{" "}
                  <span className="text-muted-foreground">{c.body}</span>
                </li>
              ))}
            </ol>
          </div>
          <figure
            className="m-0 max-lg:landscape:max-w-[150svh] lg:col-span-7 xl:col-span-8"
            style={{ perspective: 1400 }}
          >
            <div
              className="relative rounded-[10px]"
              style={{
                transform: phone ? "rotateX(6deg)" : "rotateY(-9deg) rotateX(9deg)",
                transformStyle: "preserve-3d",
                background: SCREEN_BEZEL,
                padding: "0.6%",
                boxShadow: "inset 0 1px 0 hsl(40 25% 96% / 0.10), var(--e3)",
              }}
            >
              <div className="relative" style={{ transformStyle: "preserve-3d" }}>
                <img
                  src={dashFull}
                  alt={DASH_ALT}
                  width={1440}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full rounded-[5px]"
                />
                <div aria-hidden className="absolute inset-0 rounded-[5px] bg-background/50" style={{ transform: "translateZ(0.5px)" }} />
                {PANELS.map((panel, i) => {
                  const rect: CSSProperties = {
                    left: `${panel.left}%`,
                    top: `${panel.top}%`,
                    width: `${panel.width}%`,
                    height: `${panel.height}%`,
                  };
                  // Direct children of the preserve-3d layer, so the lift keeps its depth.
                  return (
                    <Fragment key={i}>
                      <div
                        aria-hidden
                        className="absolute rounded-[6px] bg-background/80"
                        style={{ ...rect, transform: "translateZ(0.6px)" }}
                      />
                      <div aria-hidden className="absolute" style={{ ...rect, transform: `translateZ(${1 + panel.lift}px)` }}>
                        <PanelImg panel={panel} />
                        {i === 0 && <div className="absolute -inset-[3px] rounded-[8px] border-2 border-primary" />}
                      </div>
                    </Fragment>
                  );
                })}
              </div>
            </div>
          </figure>
        </div>
        <div className="mt-10 max-w-[60ch]">
          <TurnFooter />
        </div>
      </div>
    </>
  );
}
