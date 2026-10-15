import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, BadgeCheck, Plus, Star } from "lucide-react";
import { UPWORK_URL, reveal, revealAt } from "@/lib/desk";
import {
  LEAD_REVIEW,
  MORE_REVIEWS,
  ROLES,
  TOOLS,
  type Review,
  type Role,
} from "./ClientWords.data";

/**
 * Act 6, "In clients' words" and the record under it.
 * The reviews are drawn the way clients already read them on Upwork: each in
 * its own panel, with the stars, the rating, the dates, the words, and the
 * qualities the client endorsed. The newest is set large; three more sit under
 * it. A rating note beside the heading says what they all share. Then the work
 * history back to 2012. Device: flow + in.
 * Every block rises once on entry and then stays; nothing is scroll-linked.
 * Under reduced motion the entrances are skipped (content is simply there, see
 * useEnter) and the row disclosure drops its small slide.
 *
 * Hover classes are written out in full (never built from a template string)
 * so Tailwind can see them.
 */

/**
 * The standard once-only entrance, or none under reduced motion. With the rise
 * dropped, Motion 12.23 runs the fade alone on the compositor and, when it ends,
 * paints the element at opacity 0 for one frame before committing 1 (seen on a
 * frame-by-frame screencast). Reduced-motion readers get the content in place.
 */
const useEnter = () => {
  const reduce = useReducedMotion();
  return (i?: number, step?: number) =>
    reduce ? {} : i === undefined ? reveal : revealAt(i, step);
};

/** Typographic quotes, with the opening mark hung into the margin. */
const Quoted = ({ text }: { text: string }) => (
  <>
    <span aria-hidden className="absolute -translate-x-full">
      {"“"}
    </span>
    {text}
    <span aria-hidden>{"”"}</span>
  </>
);

/**
 * A run of short items split by small dots. Each item carries its dot in front
 * and the run is shifted left by one dot and clipped, so when the run wraps no
 * line ever starts (or ends) on a stray separator.
 */
const DotRun = ({
  items,
  className = "",
}: {
  items: string[];
  className?: string;
}) => (
  <span className={`block overflow-hidden ${className}`}>
    <span className="-ml-[19px] flex flex-wrap">
      {items.map((item, i) => (
        <span
          key={item}
          className="whitespace-nowrap before:mx-2 before:inline-block before:h-[3px] before:w-[3px] before:rounded-full before:bg-current before:align-[0.2em] before:opacity-55 before:content-['']"
        >
          {i > 0 && <span className="sr-only">, </span>}
          {item}
        </span>
      ))}
    </span>
  </span>
);

/** Upwork's five stars, in the page's one accent. Read out as the rating. */
const Stars = ({ rating, size = "h-4 w-4" }: { rating: number; size?: string }) => (
  <span role="img" aria-label={`${rating.toFixed(1)} out of 5 stars`} className="inline-flex items-center gap-0.5">
    {[0, 1, 2, 3, 4].map((i) => (
      <Star
        key={i}
        aria-hidden
        strokeWidth={0}
        className={`${size} ${i < Math.round(rating) ? "fill-primary" : "fill-muted-foreground/30"}`}
      />
    ))}
  </span>
);

/** The review's header row: stars, the rating, then the contract's dates. */
const RatingRow = ({ review, large = false }: { review: Review; large?: boolean }) => (
  <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
    <Stars rating={review.rating} size={large ? "h-[18px] w-[18px]" : "h-4 w-4"} />
    <span className={`tabular font-semibold text-foreground ${large ? "text-base" : "text-[15px]"}`}>
      {review.rating.toFixed(1)}
    </span>
    <span aria-hidden className="h-4 w-px bg-border" />
    <span className="tabular text-[15px] text-muted-foreground">{review.period}</span>
  </p>
);

/** "Endorsed by client": the skills and qualities the client ticked, as small chips. */
const Endorsed = ({ tags }: { tags: string[] }) => (
  <div className="mt-5">
    <p className="text-[13px] font-medium text-muted-foreground">Endorsed by client</p>
    <ul className="mt-2 flex flex-wrap gap-1.5">
      {tags.map((t) => (
        <li
          key={t}
          className="rounded-md border border-border bg-[hsl(var(--surface-2))] px-2.5 py-1 text-[13px] leading-snug text-foreground/85"
        >
          {t}
        </li>
      ))}
    </ul>
  </div>
);

/** One review, as its own panel. The lead one is larger. */
const ReviewCard = ({ review, lead = false }: { review: Review; lead?: boolean }) => (
  <figure
    className={`relative flex h-full flex-col rounded-xl border border-border bg-[hsl(var(--surface))] shadow-[var(--edge),var(--e1)] ${
      lead ? "p-6 sm:p-8 md:p-10" : "p-6"
    }`}
  >
    <figcaption className="order-first">
      <p className={`font-semibold tracking-[-0.01em] text-foreground ${lead ? "text-lg md:text-xl" : "text-[17px]"}`}>
        {review.project}
      </p>
      <div className="mt-2">
        <RatingRow review={review} large={lead} />
      </div>
    </figcaption>
    <blockquote className="mt-5">
      <p
        className={
          lead
            ? "relative max-w-[46ch] font-display text-[clamp(1.375rem,2.4vw,2.1rem)] font-[450] leading-[1.26] tracking-[-0.018em] text-foreground"
            : "relative text-[16px] leading-relaxed text-foreground/90"
        }
      >
        <Quoted text={review.quote} />
      </p>
    </blockquote>
    {review.note && <p className="mt-3 text-[14px] leading-snug text-muted-foreground">{review.note}</p>}
    <div className="mt-auto">
      <Endorsed tags={review.tags} />
    </div>
  </figure>
);

/** Beside the heading: what every review on the page shares, and where to check it. */
const RatingNote = () => (
  <div className="flex items-start gap-4 rounded-xl border border-border bg-[hsl(var(--surface))] p-5 shadow-[var(--edge),var(--e1)] md:p-6">
    <p className="font-display text-[2.75rem] font-semibold leading-none tracking-[-0.03em] text-foreground">
      5.0
    </p>
    <div className="min-w-0">
      <Stars rating={5} size="h-[18px] w-[18px]" />
      <p className="mt-1.5 text-[15px] leading-snug text-muted-foreground">
        Every review here is 5 stars,{" "}
        <span className="inline-flex items-center gap-1 whitespace-nowrap text-foreground/90">
          verified on Upwork
          <BadgeCheck aria-hidden strokeWidth={1.75} className="h-4 w-4 text-muted-foreground" />
        </span>
      </p>
      <a
        href={UPWORK_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group/link -mx-1 mt-1 inline-flex min-h-11 items-center gap-1.5 px-1 text-[15px] font-medium text-foreground underline decoration-border underline-offset-4 transition-[color,text-decoration-color,opacity] duration-150 ease-out-strong active:opacity-70 [@media(hover:hover)_and_(pointer:fine)]:hover:decoration-foreground"
      >
        Read every review on Upwork
        <ArrowUpRight
          aria-hidden
          strokeWidth={1.75}
          className="h-4 w-4 text-muted-foreground transition-[transform,color] duration-150 ease-out-strong [@media(hover:hover)_and_(pointer:fine)]:group-hover/link:-translate-y-0.5 [@media(hover:hover)_and_(pointer:fine)]:group-hover/link:translate-x-0.5 [@media(hover:hover)_and_(pointer:fine)]:group-hover/link:text-foreground"
        />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  </div>
);

const RoleRow = ({ role, index }: { role: Role; index: number }) => {
  const enter = useEnter();
  return (
    <motion.li {...enter(index, 0.05)} className="border-b border-border">
      <details className="group/row">
        <summary className="-mx-3 grid cursor-pointer list-none grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1.5 rounded-md px-3 py-3 transition-colors duration-150 ease-out-strong active:bg-[hsl(var(--surface-2))] sm:grid-cols-[9.75rem_1fr_auto] sm:py-3.5 [&::-webkit-details-marker]:hidden [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[hsl(var(--surface))]">
          <span className="tabular font-mono text-[12.5px] leading-snug text-muted-foreground">
            {role.period}
          </span>
          <span className="col-span-2 row-start-2 sm:col-span-1 sm:col-start-2 sm:row-start-1">
            <span className="block text-[17px] font-medium leading-snug tracking-[-0.01em] text-foreground md:text-lg">
              {role.title}
            </span>
            <span className="mt-0.5 block text-[15px] leading-snug text-muted-foreground">
              {role.client}
            </span>
          </span>
          <span className="col-start-2 row-start-1 inline-flex items-center gap-1.5 justify-self-end text-sm text-muted-foreground transition-colors duration-150 ease-out-strong group-open/row:text-foreground sm:col-start-3 [@media(hover:hover)_and_(pointer:fine)]:group-hover/row:text-foreground">
            <span className="group-open/row:hidden">Details</span>
            <span className="hidden group-open/row:inline">Close</span>
            <Plus
              aria-hidden
              strokeWidth={1.75}
              className="h-4 w-4 self-center transition-transform duration-200 ease-out-strong group-open/row:rotate-45 motion-reduce:transition-none"
            />
          </span>
        </summary>

        <div className="pb-7 pt-1 animate-in fade-in-0 slide-in-from-top-1 [animation-duration:200ms] ease-out-strong motion-reduce:animate-none sm:grid sm:grid-cols-[9.75rem_1fr] sm:gap-x-6">
          <div className="sm:col-start-2">
            <ul className="max-w-[62ch] space-y-2.5 text-[15px] leading-relaxed text-muted-foreground md:text-base">
              {role.bullets.map((b) => (
                <li
                  key={b}
                  className="relative pl-5 before:absolute before:left-0.5 before:top-[0.72em] before:h-1 before:w-1 before:rounded-full before:bg-muted-foreground/50"
                >
                  {b}
                </li>
              ))}
            </ul>
            <p className="mt-5 font-mono text-[12.5px] leading-relaxed text-muted-foreground/85">
              <span className="sr-only">Skills: </span>
              <DotRun items={role.skills} />
            </p>
          </div>
        </div>
      </details>
    </motion.li>
  );
};

export const ClientWords = () => {
  const enter = useEnter();
  return (
    <section
      id="testimonials"
      aria-labelledby="clients-title"
      className="relative isolate"
    >
      {/* A warm pool of room light behind the lead review (hsl 30, not the accent). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[900px] bg-[radial-gradient(ellipse_58%_46%_at_30%_36%,hsl(30_22%_14%/0.5),transparent_72%)]"
      />
      {/* The bottom padding matches the bone section's top padding, so the cut
        to bone sits midway between the last row and the next heading. */}
      <div className="mx-auto w-full max-w-[1200px] px-5 pb-24 pt-16 sm:px-8 md:pb-32 md:pt-20">
        {/* The heading, with the rating note beside it on wide screens. */}
        <div className="grid gap-y-6 lg:grid-cols-12 lg:items-end lg:gap-x-8">
          <motion.h2
            {...enter()}
            id="clients-title"
            className="h-section max-w-[18ch] font-display font-semibold text-foreground lg:col-span-7"
          >
            In my clients{"’"} words.
          </motion.h2>
          <motion.div {...enter(1, 0.08)} className="lg:col-span-5">
            <RatingNote />
          </motion.div>
        </div>

        {/* The newest review, set large. */}
        <motion.div {...enter(2, 0.08)} className="mt-8 md:mt-10">
          <ReviewCard review={LEAD_REVIEW} lead />
        </motion.div>

        {/* Three more, each in its own panel. */}
        <ul className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {MORE_REVIEWS.map((r, i) => (
            <motion.li key={r.project} {...enter(i + 3, 0.08)} className={i === 2 ? "md:col-span-2 lg:col-span-1" : undefined}>
              <ReviewCard review={r} />
            </motion.li>
          ))}
        </ul>

        {/* The record: one main column of rows, the kit beside it as a margin note
          (the same 8 + 4 logic as the lead review and its label). */}
        <section
          id="experience"
          aria-labelledby="record-title"
          className="mt-16 grid gap-y-6 md:mt-20 lg:grid-cols-12 lg:gap-x-8"
        >
          <motion.div {...enter()} className="lg:col-span-8">
            <h3
              id="record-title"
              className="font-display text-xl font-semibold tracking-tight text-foreground md:text-2xl"
            >
              Where I{"’"}ve worked.
            </h3>
            {/* One sentence per line (the first may wrap on phones), so the
              line never leaves "full time." alone; the years stay together. */}
            <p className="mt-3 max-w-[62ch] text-base leading-relaxed text-muted-foreground md:text-[17px]">
              <span className="block">
                Windows and Azure systems in enterprise IT from{" "}
                <span className="whitespace-nowrap">2012 to 2026.</span>
              </span>{" "}
              <span className="block">Now building AI automation full time.</span>
            </p>
          </motion.div>

          <ol className="border-t border-border lg:col-span-8 lg:row-start-2">
            {ROLES.map((role, i) => (
              <RoleRow key={role.title} role={role} index={i} />
            ))}
          </ol>

          <motion.div
            {...enter(2, 0.08)}
            className="mt-2 lg:col-span-3 lg:col-start-10 lg:row-start-2 lg:mt-0 lg:self-start"
          >
            {/* Below lg: one quiet paragraph under the rows. */}
            <p className="max-w-[62ch] text-[15px] leading-relaxed text-muted-foreground lg:hidden">
              <span className="font-medium text-foreground">Tools I use.</span>{" "}
              {TOOLS.map((g) => (
                <span key={g.category}>
                  {g.tools.map((t, i) => (
                    <span key={t}>
                      {/* Keep the category with its first tool, and never split "SP-API". */}
                      <span className="whitespace-nowrap">
                        {i === 0 && (
                          <>
                            <span className="text-foreground/85">
                              {g.category}:
                            </span>{" "}
                          </>
                        )}
                        {t}
                      </span>
                      {i < g.tools.length - 1 ? ", " : ". "}
                    </span>
                  ))}
                </span>
              ))}
            </p>

            {/* lg: a margin note, its hairline level with the rows' top rule. */}
            <div className="hidden border-t border-border pt-4 lg:block">
              <p className="text-[15px] font-medium leading-snug text-foreground">
                Tools I use
              </p>
              <dl className="mt-4 space-y-3 text-[15px] leading-snug">
                {TOOLS.map((g) => (
                  <div key={g.category}>
                    <dt className="text-foreground/85">{g.category}</dt>
                    <dd className="mt-0.5 text-muted-foreground">
                      {g.tools.join(", ")}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </motion.div>
        </section>
      </div>
    </section>
  );
};
