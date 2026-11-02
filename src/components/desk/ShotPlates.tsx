import { motion, useReducedMotion, type Variants } from "motion/react";
import { Maximize2 } from "lucide-react";
import { EASE_OUT, reveal, revealAt } from "@/lib/desk";
import { WORKS, type Work } from "./Workshop.data";
import { openWork } from "./Workshop";
import { buildElementId } from "./ledgerStore";

/**
 * Builds shown by their real screenshot, in full color: the picture wipes
 * open sideways once (a change of state, not a fade), then its label. The
 * picture and the button under it both open the full-size original in the
 * page's dialog.
 * "feature": the picture takes most of the row and the label sits beside it.
 * "plate": picture above, label under; two plates share a row, offset.
 */

const WIPE: Variants = {
  hidden: { clipPath: "inset(-4% 104% -4% -4%)" },
  shown: { clipPath: "inset(-4% -4% -4% -4%)", transition: { duration: 1.05, ease: EASE_OUT } },
};

const work = (id: string) => WORKS.find((w) => w.id === id)!;

function Picture({ work: w }: { work: Work }) {
  const reduce = useReducedMotion();
  const panel = reduce
    ? reveal
    : { initial: "hidden", whileInView: "shown", viewport: { once: true, margin: "0px 0px -14% 0px" }, variants: WIPE };
  const img = w.color ?? w.preview;
  return (
    <figure className="m-0">
      <motion.div {...panel}>
        {/* A mouse shortcut to what the button under it does (the button is the accessible path). */}
        <div
          onClick={(e) => openWork(w.id, e.currentTarget.closest("article")?.querySelector<HTMLElement>("[data-open]") ?? null)}
          className="block w-full cursor-zoom-in overflow-hidden rounded-lg border border-border/70 bg-background shadow-[var(--edge),var(--e2)] transition-[transform,border-color] duration-150 ease-out-strong active:scale-[0.99] [@media(hover:hover)_and_(pointer:fine)]:hover:border-foreground/25"
        >
          <img
            src={img.src}
            width={img.w}
            height={img.h}
            alt={w.previewAlt ?? w.alt}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="block aspect-[11/5] h-auto w-full object-cover"
          />
        </div>
      </motion.div>
      <figcaption className="mt-3 font-mono text-[11px] tracking-wide text-muted-foreground">{w.kind}</figcaption>
    </figure>
  );
}

function Label({ work: w, big = false }: { work: Work; big?: boolean }) {
  const full = w.kind === "web app" ? "See the full screen" : "See the full canvas";
  return (
    <>
      <motion.h4
        {...revealAt(1)}
        id={`${w.id}-title`}
        className={`font-semibold tracking-tight text-foreground ${big ? "text-2xl md:text-[1.75rem]" : "mt-5 text-xl md:text-2xl"}`}
      >
        {w.title}
      </motion.h4>
      <motion.p {...revealAt(2)} className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-muted-foreground md:text-base">
        {w.detail}
      </motion.p>
      <motion.p {...revealAt(3)} className="mt-3 font-mono text-[11px] tracking-wide text-muted-foreground/85">
        {w.tools.join(" · ")}
      </motion.p>
      <motion.div {...revealAt(4)} className="mt-2">
        <button
          type="button"
          data-open
          aria-haspopup="dialog"
          onClick={(e) => openWork(w.id, e.currentTarget)}
          className="group -ml-1 inline-flex h-11 items-center gap-2 rounded-md px-1 text-[15px] font-medium text-foreground underline decoration-border underline-offset-4 transition-[transform,text-decoration-color] duration-150 ease-out-strong active:scale-[0.97] [@media(hover:hover)_and_(pointer:fine)]:hover:decoration-foreground"
        >
          {full}
          <Maximize2
            aria-hidden
            className="h-3.5 w-3.5 text-muted-foreground transition-colors duration-150 ease-out-strong [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-foreground"
          />
        </button>
      </motion.div>
    </>
  );
}

export function ShotPlate({ id, variant = "plate", className = "" }: { id: string; variant?: "feature" | "plate"; className?: string }) {
  const w = work(id);
  return (
    <article
      id={buildElementId(w.id)}
      data-build={w.id}
      aria-labelledby={`${w.id}-title`}
      className={`scroll-mt-10 ${variant === "feature" ? "grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-12 lg:items-end lg:gap-x-8" : ""} ${className}`}
    >
      {variant === "feature" ? (
        <>
          <div className="lg:col-span-8">
            <Picture work={w} />
          </div>
          <div className="lg:col-span-4 lg:pb-8">
            <Label work={w} big />
          </div>
        </>
      ) : (
        <>
          <Picture work={w} />
          <Label work={w} />
        </>
      )}
    </article>
  );
}

/** Two plates side by side on wide screens, offset (7 and 5 columns), never equal. */
export const PlatePair = ({ ids }: { ids: [string, string] }) => (
  <div className="grid grid-cols-[minmax(0,1fr)] gap-16 lg:grid-cols-12 lg:gap-x-8">
    <ShotPlate id={ids[0]} className="lg:col-span-7" />
    <ShotPlate id={ids[1]} className="lg:col-span-5 lg:mt-24" />
  </div>
);
