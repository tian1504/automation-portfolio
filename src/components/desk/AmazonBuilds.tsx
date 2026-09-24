import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowRight } from "lucide-react";
import { EASE_OUT, jumpTo, reveal, revealAt, useMediaQuery } from "@/lib/desk";
import { SourcingDiagram, SyncDiagramTall, SyncDiagramWide } from "./AmazonBuilds.diagrams";

/**
 * ACT 4, "More receipts". Two more Amazon systems, each shown as a plate: an
 * honest line drawing of the engine on a raised panel, then a museum-style
 * label (For / What it does / Runs on / Status). Device: reveal. The panel
 * wipes open in the direction its data flows, and the drawing's strokes draw
 * once, in data order. Nothing pinned, nothing scrubbed.
 * Reduced motion: no wipe, the drawings are complete, text only fades.
 */

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
          <span className="text-foreground">Client build, in delivery.</span> 230 automated checks guard every
          change.
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

export const AmazonBuilds = () => {
  // The sync route reads left to right from md up, top to bottom on phones; its panel wipes the same way.
  const wide = useMediaQuery("(min-width: 768px)");

  return (
    <section id="builds" aria-labelledby="builds-title" className="pb-10 pt-12 md:pb-24 md:pt-16">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <motion.h2
          {...reveal}
          id="builds-title"
          className="h-section max-w-[22ch] font-display font-semibold text-foreground"
        >
          More Amazon systems I’ve built.
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
          <motion.p
            {...reveal}
            className="max-w-[34ch] text-lg leading-snug text-muted-foreground md:text-xl lg:col-span-7 lg:row-start-2 lg:max-w-none lg:self-end lg:pb-2.5 lg:pt-16"
          >
            I also build{" "}
            <a
              href="#portfolio"
              onClick={(e) => {
                e.preventDefault();
                jumpTo("portfolio");
              }}
              className="py-3 text-foreground underline decoration-border underline-offset-4 transition-[text-decoration-color,opacity] duration-150 ease-out-strong active:opacity-70 [@media(hover:hover)_and_(pointer:fine)]:hover:decoration-foreground"
            >
              AI agents and n8n workflows
            </a>{" "}
            for lean teams.
          </motion.p>
        </div>
      </div>
    </section>
  );
};
