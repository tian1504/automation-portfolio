import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { motion, useInView } from "motion/react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronDown, Maximize2, X } from "lucide-react";
import { Dialog, DialogClose, DialogDescription, DialogOverlay, DialogPortal, DialogTitle } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { EASE_OUT, FINE_POINTER_QUERY, reveal, revealAt, useMediaQuery } from "@/lib/desk";
import { WORKS, type Work } from "./Workshop.data";

/**
 * Act 5, the workshop. Breadth for almost no scroll: seven rows, one preview.
 * Desktop with a mouse: point at (or focus) a row and its real canvas crossfades
 * into a sticky preview; click or Enter opens the full-color original. The
 * preview sits in columns 1 to 7 and the list from column 8, on the same
 * 12-column grid as the builds above, so the two line up.
 * Touch and narrow screens: each row is a disclosure with the preview inside.
 */

const toolLine = (w: Work) => w.tools.join(" · ");

type OpenFn = (i: number, trigger: HTMLElement | null) => void;

const Heading = ({ pointer }: { pointer: boolean }) => (
  <div>
    <motion.h2
      {...reveal}
      id="workshop-title"
      className="h-section max-w-[15ch] text-balance font-display font-semibold text-foreground"
    >
      AI agents and n8n workflows.
    </motion.h2>
    <motion.p {...revealAt(1)} className="mt-4 text-base leading-relaxed text-muted-foreground md:text-[17px]">
      {pointer ? "Point at a row to see the real build." : "Tap a row to see the real build."}
    </motion.p>
  </div>
);

/* ------------------------------------------------------------------ desktop */

const DeskView = ({ onOpen }: { onOpen: OpenFn }) => {
  const [active, setActive] = useState(0);
  const rows = useRef<(HTMLButtonElement | null)[]>([]);
  const list = useRef<HTMLUListElement | null>(null);
  const previewId = useId();
  const highlightId = useId();
  const current = WORKS[active];

  // Warm the full-color original for the row being looked at, so the dialog
  // opens on a loaded image. Only once the list is about a screen away (never
  // while the hero is still loading), and only after a short dwell on a row.
  const near = useInView(list, { once: true, margin: "0px 0px 100% 0px" });
  useEffect(() => {
    if (!near) return;
    const t = window.setTimeout(() => {
      const img = new Image();
      img.decoding = "async";
      img.src = current.full.src;
    }, 260);
    return () => window.clearTimeout(t);
  }, [current, near]);

  const onKey = (i: number) => (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = WORKS.length - 1;
    const to =
      e.key === "ArrowDown" ? Math.min(last, i + 1)
      : e.key === "ArrowUp" ? Math.max(0, i - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (to === null) return;
    e.preventDefault();
    rows.current[to]?.focus();
  };

  return (
    <div className="grid grid-cols-12 gap-x-8">
      {/* The left block stretches to the list's height so the preview can stick. */}
      <div className="col-span-7">
        <Heading pointer />
        {/* One frame: the canvas fills it edge to edge (every preview is cut to 11:5),
            with the caption under a hairline. Clicking it is a mouse shortcut to the
            dialog the rows open (keyboard users open it from the row). */}
        <motion.div {...revealAt(2)} className="sticky top-24 mt-10">
          <figure
            id={previewId}
            onClick={() => onOpen(active, rows.current[active])}
            className="cursor-zoom-in overflow-hidden rounded-lg border border-border/70 bg-[hsl(var(--surface))] shadow-[var(--edge),var(--e2)] transition-[transform,border-color] duration-150 ease-out-strong active:scale-[0.99] [@media(hover:hover)_and_(pointer:fine)]:hover:border-foreground/20"
          >
            <div className="relative aspect-[11/5] bg-background">
              {WORKS.map((w, i) => {
                const on = i === active;
                return (
                  <img
                    key={w.id}
                    src={w.preview.src}
                    width={w.preview.w}
                    height={w.preview.h}
                    alt={on ? (w.previewAlt ?? w.alt) : ""}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="absolute inset-0 h-full w-full object-cover transition-opacity duration-150 ease-out-strong"
                    style={{ opacity: on ? 1 : 0 }}
                  />
                );
              })}
            </div>
            <figcaption className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 border-t border-border/70 px-4 py-3">
              <span className="grid min-w-0">
                {WORKS.map((w, i) => (
                  <span
                    key={w.id}
                    aria-hidden={i !== active}
                    className="col-start-1 row-start-1 truncate text-sm text-foreground transition-opacity duration-150 ease-out-strong"
                    style={{ opacity: i === active ? 1 : 0 }}
                  >
                    {w.title}
                  </span>
                ))}
              </span>
              {/* Not the uppercase label style: it would print the brand as N8N. */}
              <span className="font-mono text-[11px] leading-4 tracking-wide text-muted-foreground">{current.kind}</span>
            </figcaption>
          </figure>
        </motion.div>
      </div>

      {/* Rules sit on column 8 like the plates above; each row's highlight hangs
          12px past them so the titles line up with the plate text. */}
      <ul ref={list} className="col-span-5 col-start-8 border-b border-border/70">
        {WORKS.map((w, i) => (
          <motion.li key={w.id} {...revealAt(i + 1, 0.045)} className="border-t border-border/70 py-0.5">
            <button
              ref={(el) => {
                rows.current[i] = el;
              }}
              type="button"
              aria-controls={previewId}
              aria-haspopup="dialog"
              data-active={i === active ? "" : undefined}
              onPointerEnter={(e) => {
                if (e.pointerType === "mouse") setActive(i);
              }}
              onFocus={() => setActive(i)}
              onClick={(e) => onOpen(i, e.currentTarget)}
              onKeyDown={onKey(i)}
              className="group relative isolate -mx-3 grid w-[calc(100%+1.5rem)] grid-cols-[minmax(0,1fr)_auto] gap-x-4 rounded-md px-3 py-2.5 text-left transition-transform duration-150 ease-out-strong active:scale-[0.985]"
            >
              {/* The selection glides from row to row (a transform; instant under reduced motion). */}
              {i === active && (
                <motion.span
                  layoutId={highlightId}
                  aria-hidden
                  className="absolute inset-0 -z-10 rounded-md bg-[hsl(var(--surface))] shadow-[var(--edge)]"
                  transition={{ duration: 0.2, ease: EASE_OUT }}
                />
              )}
              <span className="text-[17px] font-medium leading-6 tracking-[-0.01em] text-foreground">{w.title}</span>
              <Maximize2
                aria-hidden
                className="mt-1 h-4 w-4 text-muted-foreground opacity-0 transition-opacity duration-150 ease-out-strong group-data-[active]:opacity-100"
              />
              <span className="col-span-2 mt-0.5 text-pretty text-[15px] leading-[22px] text-muted-foreground">{w.line}</span>
              <span className="col-span-2 mt-1.5 font-mono text-[11px] leading-4 tracking-wide text-muted-foreground/75">
                {toolLine(w)}
              </span>
            </button>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

/* -------------------------------------------------------------- touch/phone */

const TouchView = ({ onOpen }: { onOpen: OpenFn }) => {
  const [open, setOpen] = useState<boolean[]>(() => WORKS.map((_, i) => i === 0));

  return (
    <div className="mx-auto max-w-[720px]">
      <Heading pointer={false} />
      <ul className="mt-8 border-b border-border/70">
        {WORKS.map((w, i) => (
          <motion.li key={w.id} {...revealAt(i + 1, 0.04)} className="border-t border-border/70">
            <Collapsible
              open={open[i]}
              onOpenChange={(o) => setOpen((prev) => prev.map((v, j) => (j === i ? o : v)))}
            >
              {/* The accordion pattern: a heading wraps each trigger, so screen readers can jump project to project. */}
              <h3 className="m-0 font-sans text-base font-normal tracking-normal [font-feature-settings:normal]">
                <CollapsibleTrigger className="group flex min-h-16 w-full items-center gap-4 py-4 text-left transition-transform duration-150 ease-out-strong active:scale-[0.985]">
                  <span className="min-w-0 flex-1">
                    <span className="block text-[17px] font-medium leading-6 tracking-[-0.01em] text-foreground">
                      {w.title}
                    </span>
                    <span className="mt-1 block text-pretty text-[15px] leading-[22px] text-muted-foreground">{w.line}</span>
                    <span className="mt-1.5 block font-mono text-[11px] leading-4 tracking-wide text-muted-foreground">
                      {toolLine(w)}
                    </span>
                  </span>
                  <ChevronDown
                    aria-hidden
                    className="h-5 w-5 shrink-0 text-muted-foreground transition-[transform,color] duration-200 ease-out-strong group-data-[state=open]:rotate-180 motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-foreground"
                  />
                </CollapsibleTrigger>
              </h3>
              <CollapsibleContent className="duration-200 ease-out-strong data-[state=open]:animate-in data-[state=open]:fade-in-0">
                <div className="pb-6">
                  {/* Tapping the picture does what the link under it does (the link is the accessible path).
                      One frame with the canvas edge to edge, as on the desktop preview. */}
                  <div
                    className="cursor-zoom-in overflow-hidden rounded-lg border border-border/70 bg-background shadow-[var(--edge),var(--e1)] transition-[transform,border-color] duration-150 ease-out-strong active:scale-[0.99] [@media(hover:hover)_and_(pointer:fine)]:hover:border-foreground/20"
                    onClick={(e) => onOpen(i, e.currentTarget.parentElement?.querySelector("button") ?? null)}
                  >
                    <img
                      src={w.preview.src}
                      width={w.preview.w}
                      height={w.preview.h}
                      alt={w.previewAlt ?? w.alt}
                      loading="lazy"
                      decoding="async"
                      className="block aspect-[11/5] h-auto w-full object-cover"
                    />
                  </div>
                  <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">{w.detail}</p>
                  <button
                    type="button"
                    aria-haspopup="dialog"
                    onClick={(e) => onOpen(i, e.currentTarget)}
                    className="group/full -ml-1 mt-1 inline-flex h-11 items-center gap-2 rounded-md px-1 text-[15px] font-medium text-foreground underline decoration-border underline-offset-4 transition-[transform,text-decoration-color] duration-150 ease-out-strong active:scale-[0.97] [@media(hover:hover)_and_(pointer:fine)]:hover:decoration-foreground"
                  >
                    See it full size
                    <Maximize2
                      aria-hidden
                      className="h-3.5 w-3.5 text-muted-foreground transition-colors duration-150 ease-out-strong [@media(hover:hover)_and_(pointer:fine)]:group-hover/full:text-foreground"
                    />
                  </button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

/* ------------------------------------------------------------------- dialog */

const WorkDialog = ({
  work,
  open,
  onOpenChange,
  onClosed,
}: {
  work: Work;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onClosed: () => void;
}) => {
  // On a phone the screenshot is shown tall enough to read and pans sideways.
  // The hint only appears when there really is more to the right, and the
  // first view starts on the canvas (work.panStart), not the n8n sidebar.
  const scroller = useRef<HTMLDivElement | null>(null);
  const placed = useRef(false);
  const [pannable, setPannable] = useState(false);
  const panStart = work.panStart ?? 0;

  const measure = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const room = el.scrollWidth - el.clientWidth;
    const can = room > 4;
    setPannable(can);
    // Place once per opening; later resizes keep wherever the visitor panned to.
    // The img has width/height attributes, so its width is known before it loads.
    if (can && !placed.current) {
      placed.current = true;
      el.scrollLeft = Math.round(Math.min(room, el.scrollWidth * panStart));
    }
  }, [panStart]);

  useEffect(() => {
    if (!open) return;
    placed.current = false;
    const raf = window.requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [open, work.id, measure]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-[hsl(var(--shadow-tint)/0.86)] duration-200" />
        <DialogPrimitive.Content
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            onClosed();
          }}
          className="fixed inset-0 z-50 m-auto flex h-fit max-h-[calc(100svh-2rem)] w-[min(1180px,calc(100vw-2rem))] flex-col overflow-y-auto overscroll-contain rounded-lg border border-border bg-[hsl(var(--surface))] shadow-[var(--edge),var(--e3)] duration-200 ease-out-strong focus:outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-[0.97] data-[state=open]:zoom-in-[0.96] motion-reduce:data-[state=closed]:[--tw-exit-scale:1] motion-reduce:data-[state=open]:[--tw-enter-scale:1]"
        >
          {/* Stays put while the canvas scrolls under it, so the title and Close are always in reach. */}
          <div className="sticky top-0 z-10 flex shrink-0 items-start justify-between gap-6 border-b border-border bg-[hsl(var(--surface))] px-5 pb-4 pt-5 md:px-6">
            <div className="min-w-0">
              <DialogTitle className="text-balance font-display text-lg font-semibold tracking-tight text-foreground md:text-xl">
                {work.title}
              </DialogTitle>
              <p className="mt-1.5 font-mono text-xs tracking-wide text-muted-foreground">{work.kind}</p>
            </div>
            <DialogClose
              aria-label="Close"
              className="-mr-2 -mt-1.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-[color,background-color,transform] duration-150 ease-out-strong active:scale-[0.97] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[hsl(var(--surface-2))] [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground"
            >
              <X aria-hidden className="h-5 w-5" />
            </DialogClose>
          </div>
          <div
            ref={scroller}
            tabIndex={pannable ? 0 : undefined}
            role={pannable ? "region" : undefined}
            aria-label={pannable ? `${work.title} screenshot, scrolls sideways` : undefined}
            className="shrink-0 border-b border-border bg-[hsl(var(--surface-2))] max-md:overflow-x-auto max-md:overscroll-x-contain"
          >
            {/* From md up the canvas takes the full dialog width (the dialog scrolls); on a phone it pans. */}
            <img
              key={work.id}
              src={work.full.src}
              width={work.full.w}
              height={work.full.h}
              alt={work.alt}
              decoding="async"
              onLoad={measure}
              className="block h-auto w-full max-md:h-[min(50svh,420px)] max-md:w-auto max-md:max-w-none"
            />
          </div>
          {pannable && (
            <p className="shrink-0 px-5 pt-3 text-sm text-muted-foreground md:hidden">
              Swipe sideways to see the whole {work.kind === "web app" ? "screen" : "canvas"}.
            </p>
          )}
          <div className="flex shrink-0 flex-col gap-3 px-5 py-5 md:flex-row md:items-baseline md:justify-between md:gap-12 md:px-6">
            <DialogDescription className="max-w-[62ch] text-[15px] leading-relaxed text-muted-foreground md:text-base">
              {work.detail}
            </DialogDescription>
            <p className="shrink-0 font-mono text-xs tracking-wide text-muted-foreground">{toolLine(work)}</p>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
};

/* ------------------------------------------------------------------ section */

export const Workshop = () => {
  const wide = useMediaQuery("(min-width: 1024px)");
  const fine = useMediaQuery(FINE_POINTER_QUERY);
  const desk = wide && fine;

  const [dialog, setDialog] = useState({ open: false, i: 0 });
  const trigger = useRef<HTMLElement | null>(null);

  const openAt: OpenFn = (i, el) => {
    trigger.current = el;
    setDialog({ open: true, i });
  };

  return (
    <section id="portfolio" aria-labelledby="workshop-title" className="relative py-24 md:py-32">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        {desk ? <DeskView onOpen={openAt} /> : <TouchView onOpen={openAt} />}
      </div>
      <WorkDialog
        work={WORKS[dialog.i]}
        open={dialog.open}
        onOpenChange={(o) => setDialog((d) => ({ ...d, open: o }))}
        onClosed={() => trigger.current?.focus({ preventScroll: true })}
      />
    </section>
  );
};
