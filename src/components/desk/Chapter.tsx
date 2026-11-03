import { useRef, type ReactNode } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { EASE_OUT, useStill } from "@/lib/desk";
import { CHAPTERS, type Chapter as ChapterData } from "./chapters";
import { BrandIcon, brandTitle } from "./BrandIcon";

/**
 * One chapter of the page. It opens on a title card, a full screen of its
 * own ground with the chapter's name set large, which holds still while the
 * chapter's content is laid over it like a page (a hard cut: no crossfade,
 * no colour drift). As the page covers it the card steps back, a little
 * smaller and dimmer. The title's words rise into place once, when the card
 * arrives.
 * Reduced motion: the card is a plain block, nothing moves.
 */

const NUMBER = ["One", "Two", "Three", "Four", "Five"];

/** Written out in full so the stylesheet keeps every ground. */
const GROUND: Record<ChapterData["ground"], string> = {
  clay: "ground-clay",
  canvas: "ground-canvas",
  ink: "ground-ink",
  amber: "ground-amber",
  paper: "ground-bone ground-paper",
};

export function Chapter({ id, children }: { id: string; children: ReactNode }) {
  const chapter = CHAPTERS.find((c) => c.id === id)!;
  const index = CHAPTERS.indexOf(chapter);
  const reduce = useStill();
  const body = useRef<HTMLDivElement>(null);

  return (
    <section
      id={chapter.id}
      data-chapter
      data-ledger-section={chapter.id}
      aria-labelledby={`${chapter.id}-title`}
      className={`${GROUND[chapter.ground]} relative`}
    >
      <TitleCard chapter={chapter} index={index} body={body} still={!!reduce} />
      {/* The page laid over the card: its own ground, a lit top edge, a shadow cast up onto the card. */}
      <div
        ref={body}
        className="ch-body relative z-10"
      >
        {children}
      </div>
    </section>
  );
}

function TitleCard({
  chapter,
  index,
  body,
  still,
}: {
  chapter: ChapterData;
  index: number;
  body: React.RefObject<HTMLDivElement>;
  still: boolean;
}) {
  const card = useRef<HTMLDivElement>(null);
  const arrived = useInView(card, { once: true, margin: "0px 0px -30% 0px" });
  // 0 while the page's top edge is below the screen, 1 once it reaches the top.
  const { scrollYProgress: cover } = useScroll({ target: body, offset: ["start end", "start start"] });
  const scale = useTransform(cover, [0, 1], [1, 0.94]);
  const opacity = useTransform(cover, [0, 0.85], [1, 0.18]);
  const y = useTransform(cover, [0, 1], ["0svh", "-6svh"]);
  const words = chapter.title.split(" ");
  const count = chapter.builds.length;

  return (
    <div
      ref={card}
      className={`ch-card ${still ? "relative" : "sticky top-0 h-svh overflow-hidden"}`}
    >
      <motion.div
        className={
          still
            ? "relative flex min-h-[70svh] flex-col justify-center py-16"
            : "absolute inset-x-0 top-0 flex h-svh flex-col justify-center pb-[14svh]"
        }
        style={still ? undefined : { scale, opacity, y, willChange: "transform, opacity" }}
      >
        <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
          {/* The running head: where you are in the page. */}
          <p className="flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--ch-ink-soft))]">
            <span>Chapter {NUMBER[index]}</span>
            <span className="tabular">{count} builds</span>
          </p>
          {/* The tools this kind of work is built on. */}
          <motion.div
            className="mt-8 flex items-center gap-3 md:mt-10"
            initial={still ? false : { opacity: 0, scale: 0.92 }}
            animate={arrived || still ? { opacity: 1, scale: 1 } : undefined}
            transition={{ duration: 0.6, delay: 0.02, ease: EASE_OUT }}
            style={{ transformOrigin: "left center" }}
          >
            {chapter.icons.map((ic) => (
              <span
                key={ic}
                className="grid h-14 w-14 place-items-center rounded-2xl border border-[hsl(var(--ch-rule))] bg-[hsl(var(--ch-ink)/0.05)] text-[hsl(var(--ch-ink))] md:h-16 md:w-16"
              >
                <BrandIcon icon={ic} tone="brand" title={brandTitle(ic)} className="h-7 w-7 md:h-8 md:w-8" />
              </span>
            ))}
            {chapter.iconNote && (
              <span className="ml-1 text-[17px] font-semibold tracking-tight text-[hsl(var(--ch-ink))]">{chapter.iconNote}</span>
            )}
          </motion.div>
          <h2
            id={`${chapter.id}-title`}
            tabIndex={-1}
            className="mt-5 font-display text-[clamp(2.75rem,min(10.5vw,14svh),9.5rem)] font-semibold leading-[0.94] tracking-[-0.045em] text-[hsl(var(--ch-ink))] focus-visible:outline-none md:mt-6"
          >
            {words.map((w, i) => (
              // Each word rises from behind its own edge. The padding keeps descenders inside the mask.
              <span key={i} className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
                <motion.span
                  className="inline-block"
                  initial={still ? false : { y: "108%" }}
                  animate={arrived || still ? { y: "0%" } : undefined}
                  transition={{ duration: 0.95, delay: 0.06 + i * 0.08, ease: EASE_OUT }}
                >
                  {w}
                  {i < words.length - 1 ? " " : ""}
                </motion.span>
              </span>
            ))}
          </h2>
          <motion.p
            className="mt-6 max-w-[34ch] text-[clamp(1.15rem,1.9vw,1.5rem)] leading-snug text-[hsl(var(--ch-ink-soft))] md:mt-8"
            initial={still ? false : { opacity: 0, y: 12 }}
            animate={arrived || still ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, delay: 0.42, ease: EASE_OUT }}
          >
            {chapter.line}
          </motion.p>
          {/* What this chapter holds, in order. */}
          <motion.ul
            className="mt-10 flex max-w-[60rem] flex-wrap gap-x-6 gap-y-2 border-t border-[hsl(var(--ch-rule))] pt-4 text-[14px] text-[hsl(var(--ch-ink-soft))] md:mt-14"
            initial={still ? false : { opacity: 0 }}
            animate={arrived || still ? { opacity: 1 } : undefined}
            transition={{ duration: 0.8, delay: 0.62, ease: EASE_OUT }}
          >
            {chapter.builds.map((b) => (
              <li key={b.id}>{b.name}</li>
            ))}
          </motion.ul>
        </div>
      </motion.div>
    </div>
  );
}
