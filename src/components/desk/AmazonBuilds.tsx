import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
  type Variants,
} from "motion/react";
import { ArrowRight } from "lucide-react";
import { EASE_OUT, reveal, revealAt, useMediaQuery } from "@/lib/desk";
import { SourcingDiagram, SyncDiagramTall, SyncDiagramWide } from "./AmazonBuilds.diagrams";
import { REVEAL, SellerDashboard } from "./SellerDashboard";

/**
 * The Amazon work, right after the pinned stage (a different client's build
 * from the AI run above it, so it opens on its own heading and source line).
 *
 * First the seller dashboard, as a flat, readable replica of the real app on
 * SAMPLE data: once it is well into view, its three problem cards lift worst
 * first and the captions under it name each one. It runs once and holds.
 *
 * Then two more Amazon systems, each shown as a plate: an honest line drawing
 * of the engine on a raised panel, then a museum-style label (For / What it
 * does / Runs on / Status). The panel wipes open in the direction its data
 * flows, and the drawing's strokes draw once, in data order. Nothing pinned,
 * nothing scrubbed.
 * Reduced motion: the dashboard is shown settled, no wipe, the drawings are
 * complete, text only fades.
 */

const LEAD = ["Seller Central knows everything.", "It doesn’t tell you what to fix first."];
const DASH_H3 = "What needs doing today, worst first.";
const DASH_CAPTIONS = [
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
const DASH_SOURCE =
  "A seller dashboard I built for a US outdoor brand on Amazon. Amazon SP-API, GitHub Actions, Supabase and React. Client build, in delivery. The first pre-season purchase order has already gone out through it. Shown here with sample data.";
const DASH_ALT =
  "A copy of the seller dashboard I built, shown with sample data. It opens on today’s problems, worst first: out of stock and still selling, needs shipping to Amazon, and stock Amazon is not selling.";

/** Each caption steps up with its card's lift (the replica's own reveal timing, 0..1). */
const CAPTION_AT = REVEAL.lifts.map(([start]) => start);

type Flow = "right" | "down";

/** Negative insets at rest keep the panel's shadow from being clipped. */
const WIPES: Record<Flow, Variants> = {
  right: {
    hidden: { clipPath: "inset(-6% 106% -6% -6%)" },
    shown: { clipPath: "inset(-6% -6% -6% -6%)", transition: { duration: 1, ease: EASE_OUT } },
  },
  down: {
    hidden: { clipPath: "inset(-6% -6% 106% -6%)" },
    shown: { clipPath: "inset(-6% -6% -6% -6%)", transition: { duration: 1.1, ease: EASE_OUT } },
  },
};

type Plate = {
  id: string;
  title: string;
  caption: string;
  rows: { label: string; value: ReactNode }[];
  line?: string;
  to: string;
};

const SYNC: Plate = {
  id: "build-sync",
  title: "Amazon SP-API Sync Engine",
  caption: "How the sync engine runs, simplified.",
  rows: [
    { label: "For", value: "An Amazon FBA business selling in the US and Canada." },
    {
      label: "What it does",
      value:
        "Brings orders, returns, financial events, settlements, inventory, FBA shipments and fees into their inventory system, daily and hourly. If a run is missed, it catches up.",
    },
    { label: "Runs on", value: "About 45 n8n workflows in one workspace." },
    {
      label: "Status",
      value: (
        <>
          <span className="text-foreground">Client build, live.</span> Walmart built and staged on the same pattern.
        </>
      ),
    },
  ],
  line: "Every sync emails the moment it fails, so a quiet morning means it ran.",
  to: "/case-study/amazon-sp-api",
};

const SOURCING: Plate = {
  id: "build-sourcing",
  title: "Used-Book FBA Sourcing Engine",
  caption: "How one morning’s run narrows, simplified.",
  rows: [
    { label: "For", value: "A used-book Amazon FBA seller." },
    {
      label: "What it does",
      value:
        "Scans about 2,000 listings on AbeBooks, Biblio and Alibris each morning, opens every survivor live for price, condition and seller location, counts postage and Amazon fees, and writes a buy list inside the daily budget.",
    },
    { label: "Runs on", value: "Node.js, and a real browser for the shops behind bot protection." },
    {
      label: "Status",
      value: (
        <>
          <span className="text-foreground">Client build, in delivery.</span> 600 automated checks guard every
          change, and a second check re-reads Amazon and the shops before a list goes out.
        </>
      ),
    },
  ],
  to: "/case-study/book-sourcing-engine",
};

/**
 * One label layout for both plates, so the two read as one system wherever
 * they share a screen. Phone: the label runs in at the start of its line.
 * sm to md (each plate full width): a label column. lg (side by side, 7 and 5
 * columns): the label sits above its value, because the narrow plate cannot
 * spare a label column and keep a readable measure (it would drop to about
 * 33 characters a line at 1024).
 */
const ROW =
  "border-b border-border py-2.5 sm:grid sm:grid-cols-[7.25rem_1fr] sm:gap-5 sm:py-3 lg:grid-cols-1 lg:gap-1";

const PlateView = ({
  plate,
  flow,
  diagram,
  className = "",
}: {
  plate: Plate;
  flow: Flow;
  diagram: ReactNode;
  className?: string;
}) => {
  const reduce = useReducedMotion();
  // The wipe travels the way the data does. Reduced motion: a plain fade.
  const panel = reduce
    ? reveal
    : {
        initial: "hidden",
        whileInView: "shown",
        viewport: { once: true, margin: "0px 0px -14% 0px" },
        variants: WIPES[flow],
      };
  // Caption and title share the panel's trigger and land once the wipe is mostly open.
  const after = reduce
    ? revealAt(1)
    : {
        ...reveal,
        viewport: { once: true, margin: "0px 0px -14% 0px" },
        transition: { ...reveal.transition, delay: 0.35 },
      };
  return (
    <article aria-labelledby={`${plate.id}-title`} className={className}>
      <figure>
        <motion.div
          {...panel}
          className="rounded-lg bg-[hsl(var(--surface))] px-3 py-3.5 sm:p-5 lg:px-2 lg:py-4 xl:p-5"
          style={{ boxShadow: "var(--edge), var(--e1)" }}
        >
          {diagram}
        </motion.div>
        <motion.figcaption {...after} className="mt-3 text-sm text-muted-foreground">
          {plate.caption}
        </motion.figcaption>
      </figure>

      <motion.h3
        {...after}
        id={`${plate.id}-title`}
        className="mt-5 text-xl font-semibold tracking-tight text-foreground md:mt-8 md:text-2xl"
      >
        {plate.title}
      </motion.h3>

      <dl className="mt-4 border-t border-border md:mt-5">
        {plate.rows.map((r, i) => (
          <motion.div key={r.label} {...revealAt(i + 2, 0.05)} className={ROW}>
            {/* The {" "} is a real space, so copied text, snippets and screen readers never join label and value. */}
            <dt className="label-mono mr-1.5 inline text-muted-foreground sm:mr-0 sm:block sm:pt-[5px] lg:pt-0">
              {r.label}
            </dt>{" "}
            <dd className="inline text-[15px] leading-normal text-foreground/80 sm:block sm:max-w-[36em] sm:leading-relaxed md:text-base">
              {r.value}
            </dd>
          </motion.div>
        ))}
      </dl>

      {plate.line && (
        <motion.p
          {...revealAt(6, 0.05)}
          className="mt-5 max-w-[44ch] text-[17px] leading-snug text-foreground md:text-lg"
        >
          {plate.line}
        </motion.p>
      )}

      <motion.div {...revealAt(7, 0.05)} className={plate.line ? "mt-3" : "mt-4"}>
        <Link
          to={plate.to}
          aria-label={`Read the case study: ${plate.title}`}
          className="group inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-foreground underline decoration-border underline-offset-4 transition-[text-decoration-color,opacity] duration-150 ease-out-strong active:opacity-70 [@media(hover:hover)_and_(pointer:fine)]:hover:decoration-foreground"
        >
          Read the case study
          <ArrowRight
            aria-hidden
            className="h-4 w-4 transition-transform duration-150 ease-out-strong [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-0.5"
          />
        </Link>
      </motion.div>
    </article>
  );
};

/**
 * The dashboard plate. The replica plays its triage once, when it is well
 * into view (so the AI run's outline above has left the screen first).
 * About a screen before that, the reveal is nudged off zero: the replica then
 * prepares its moving layers while nothing moves, instead of all at once on
 * the frame the triage starts (which dropped frames mid-scroll).
 */
const ARMED = 0.0001;
const DashboardPlate = () => {
  const reduce = useReducedMotion();
  const figure = useRef<HTMLDivElement>(null);
  const near = useInView(figure, { once: true, margin: "0px 0px 90% 0px" });
  const inView = useInView(figure, { once: true, margin: "0px 0px -42% 0px" });
  const progress = useMotionValue(reduce ? 1 : 0);
  useEffect(() => {
    if (near && !reduce && progress.get() === 0) progress.set(ARMED);
  }, [near, reduce, progress]);
  useEffect(() => {
    if (!inView || reduce) return;
    const run = animate(progress, 1, { duration: 2.4, ease: "linear" });
    return () => run.stop();
  }, [inView, reduce, progress]);

  return (
    <article aria-labelledby="work-title">
      <motion.p {...reveal} className="label-mono text-muted-foreground">
        For Amazon sellers
      </motion.p>
      {/* The lead-in: the problem, in the seller's words, before the screen that answers it. */}
      <motion.p
        {...revealAt(1)}
        id="work-lead"
        tabIndex={-1}
        className="mt-3 max-w-[24ch] focus-visible:outline-none font-display text-[clamp(1.6rem,3vw,2.6rem)] font-medium leading-[1.12] tracking-[-0.025em] text-foreground"
      >
        <span className="block">{LEAD[0]}</span> <span className="block text-muted-foreground">{LEAD[1]}</span>
      </motion.p>

      {/* The replica is a picture of the app: hidden from assistive tech and from
          search snippets (its numbers are samples), described in words instead.
          No entrance fade: fading a block this large would draw all of it in one
          frame mid-scroll. Its own triage is the motion. */}
      <div ref={figure} className="mt-8 md:mt-12" data-nosnippet>
        <SellerDashboard
          reveal={reduce ? undefined : progress}
          className="lg:overflow-hidden lg:rounded-xl lg:border lg:border-border lg:shadow-[var(--edge),var(--e2)]"
        />
        <p className="sr-only">{DASH_ALT}</p>
      </div>

      <div className="mt-8 grid gap-8 md:mt-10 lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-7">
          <motion.h2
            {...reveal}
            id="work-title"
            tabIndex={-1}
            className="text-xl font-semibold tracking-tight text-foreground focus-visible:outline-none md:text-2xl"
          >
            {DASH_H3}
          </motion.h2>
          {/* Below lg the replica shows the app's narrow layout, whose own card titles carry these,
              so the list is for screen readers there. */}
          <motion.ol {...revealAt(1)} className="max-lg:sr-only lg:mt-4 lg:space-y-3">
            {DASH_CAPTIONS.map((c, i) => (
              <DashCaption key={c.title} progress={progress} at={CAPTION_AT[i]} title={c.title} body={c.body} />
            ))}
          </motion.ol>
        </div>
        <motion.div {...revealAt(2)} className="lg:col-span-5 lg:self-end">
          <p className="max-w-[46ch] text-[15px] leading-relaxed text-muted-foreground">{DASH_SOURCE}</p>
          <div className="mt-1.5">
            <Link
              to="/case-study/seller-dashboard"
              aria-label="Read the case study: Seller dashboard"
              className="group inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-foreground underline decoration-border underline-offset-4 transition-[text-decoration-color,opacity] duration-150 ease-out-strong active:opacity-70 [@media(hover:hover)_and_(pointer:fine)]:hover:decoration-foreground"
            >
              Read the case study
              <ArrowRight
                aria-hidden
                className="h-4 w-4 transition-transform duration-150 ease-out-strong [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </motion.div>
      </div>
    </article>
  );
};

/** A caption steps up as its card lifts; the others wait a little back. */
function DashCaption({ progress, at, title, body }: { progress: MotionValue<number>; at: number; title: string; body: string }) {
  const opacity = useTransform(progress, (v) => (v >= at ? 1 : 0.45));
  return (
    <motion.li style={{ opacity }} className="text-[17px] leading-snug">
      <span className="font-semibold text-foreground">{title}</span> <span className="text-muted-foreground">{body}</span>
    </motion.li>
  );
}

export const AmazonBuilds = () => {
  // The sync route reads left to right from md up, top to bottom on phones; its panel wipes the same way.
  const wide = useMediaQuery("(min-width: 768px)");

  return (
    // #work keeps its old address: links already sent in proposals land on the dashboard.
    <section id="builds" aria-label="Amazon builds" className="pb-12 pt-6 md:pb-20 lg:pt-4">
      <div id="work" className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <DashboardPlate />

        <motion.h2
          {...reveal}
          id="builds-title"
          className="mt-16 max-w-[22ch] font-display text-[clamp(1.5rem,2.6vw,2.1rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-foreground md:mt-20"
        >
          Two more Amazon systems I’ve built.
        </motion.h2>

        <div className="mt-8 grid gap-10 md:mt-12 md:gap-16 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0">
          <PlateView
            plate={SYNC}
            flow={wide ? "right" : "down"}
            diagram={
              <>
                {/* Both mount, so both receive the panel's "shown" state whatever the width becomes. */}
                <div className="hidden md:block">
                  <SyncDiagramWide className="mx-auto max-w-[580px]" />
                </div>
                <div className="md:hidden">
                  <SyncDiagramTall />
                </div>
              </>
            }
            className="lg:col-span-7 lg:row-start-1"
          />
          <PlateView
            plate={SOURCING}
            flow="down"
            diagram={<SourcingDiagram className="mx-auto max-w-[330px]" />}
            className="lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:mt-20"
          />
        </div>
      </div>
    </section>
  );
};
