import { useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BOOKING_URL, EASE_OUT, UPWORK_URL, jumpTo } from "@/lib/desk";
import avatar from "@/assets/desk/avatar.webp";
import { CHAPTERS, type Chapter } from "./chapters";
import { buildElementId, useLedger } from "./ledgerStore";
import { BrandIcon } from "./BrandIcon";

/**
 * The ledger margin, the page's navigation and its signature. A fixed index of
 * the four kinds of work: the chapter you are in lights up and lists its
 * builds, each build gets a mark once you have looked at it, and the other
 * chapters fold to a row of marks. Every line is a jump. By the close it is a
 * record of what you walked through.
 *
 * Wide screens (1280 and up): a column in the left margin, always there.
 * Narrower screens: a dock at the thumb carries the current chapter and its
 * marks; tapping it opens the whole ledger as a sheet.
 */

const AFTER = [
  { id: "testimonials", label: "Reviews" },
  { id: "pricing", label: "Prices" },
  { id: "faq", label: "Questions" },
  { id: "contact", label: "Contact" },
];

/** Where focus lands after a jump to a chapter: its title. */
const focusFor = (id: string) => (CHAPTERS.some((c) => c.id === id) ? `${id}-title` : undefined);

const isPlainClick = (e: MouseEvent) => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

const BookButton = ({ className = "" }: { className?: string }) => (
  <a
    href={BOOKING_URL}
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-flex items-center justify-center rounded-md bg-primary font-medium text-primary-foreground transition-[transform,background-color] duration-150 ease-out-strong active:scale-[0.97] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-primary/90 ${className}`}
  >
    Book a call
    <span className="sr-only"> (opens in a new tab)</span>
  </a>
);

/** One mark per build: filled once seen. */
const Marks = ({ chapter, seen }: { chapter: Chapter; seen: ReadonlySet<string> }) => {
  const n = chapter.builds.filter((b) => seen.has(b.id)).length;
  return (
    <span className="flex items-center gap-[3px]" role="img" aria-label={`${n} of ${chapter.builds.length} seen`}>
      {chapter.builds.map((b) => (
        <span
          key={b.id}
          className={`h-[5px] w-[5px] rounded-full transition-colors duration-300 ease-out-strong ${
            seen.has(b.id) ? "bg-foreground/85" : "ring-1 ring-inset ring-muted-foreground/45"
          }`}
        />
      ))}
    </span>
  );
};

/** The tick beside a build: draws itself once the build has been seen. */
const Tick = ({ on }: { on: boolean }) => (
  <svg viewBox="0 0 12 12" aria-hidden className="h-3 w-3 shrink-0 overflow-visible">
    <circle cx="6" cy="6" r="5.25" fill="none" strokeWidth="1" className="stroke-muted-foreground/40" />
    <motion.path
      d="M3.4 6.2 5.2 8 8.7 4.3"
      fill="none"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="stroke-foreground"
      initial={false}
      animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }}
      transition={{ duration: 0.45, ease: EASE_OUT }}
    />
  </svg>
);

type Go = (id: string, focusId?: string) => (e: MouseEvent) => void;

/**
 * The index itself, shared by the margin and the sheet. `open` lists the
 * builds of every chapter (the sheet has the room); otherwise only the
 * current chapter unfolds.
 */
function Index({ go, open = false }: { go: Go; open?: boolean }) {
  const { current, seen } = useLedger();
  const reduce = useReducedMotion();
  return (
    <ol className="space-y-1">
      {CHAPTERS.map((c, k) => {
        const here = current === c.id;
        const unfold = open || here;
        return (
          <motion.li key={c.id} layout={reduce ? false : "position"} transition={{ duration: 0.35, ease: EASE_OUT }}>
            <a
              href={`#${c.id}`}
              onClick={go(c.id, focusFor(c.id))}
              aria-current={here ? "location" : undefined}
              className={`group grid min-h-10 grid-cols-[1.25rem_minmax(0,1fr)_auto] items-center gap-x-1.5 rounded-md text-[15px] leading-tight transition-colors duration-150 ease-out-strong ${
                here ? "text-foreground" : "text-muted-foreground [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground"
              }`}
            >
              {/* The chapter's mark: lit in its own color while you are in it. */}
              <BrandIcon icon={c.icons[0]} tone={here ? "brand" : "ink"} className="h-[15px] w-[15px]" />
              <span className="sr-only">{k + 1}. </span>
              <span className="truncate font-medium tracking-[-0.01em]">{c.title}</span>
              <Marks chapter={c} seen={seen} />
            </a>
            <AnimatePresence initial={false}>
              {unfold && (
                <motion.ul
                  key="builds"
                  initial={reduce ? false : { opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, transition: { duration: 0.12 } }}
                  transition={{ duration: 0.3, ease: EASE_OUT }}
                  className="mb-2 ml-[1.625rem] space-y-0.5"
                >
                  {c.builds.map((b) => {
                    const on = seen.has(b.id);
                    return (
                      <li key={b.id}>
                        <a
                          href={`#${buildElementId(b.id)}`}
                          onClick={go(buildElementId(b.id))}
                          className={`flex min-h-8 items-center gap-2 text-[13px] leading-snug transition-colors duration-150 ease-out-strong ${
                            on ? "text-foreground/85" : "text-muted-foreground"
                          } [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground`}
                        >
                          <Tick on={on} />
                          <span className="min-w-0">{b.name}</span>
                          <span className="sr-only">{on ? " (seen)" : ""}</span>
                        </a>
                      </li>
                    );
                  })}
                </motion.ul>
              )}
            </AnimatePresence>
          </motion.li>
        );
      })}
    </ol>
  );
}

export const Ledger = () => {
  const [open, setOpen] = useState(false);
  // A line chosen in the sheet waits for the sheet to close (scroll lock
  // released), then jumps and takes focus with it.
  const pending = useRef<[string, string | undefined] | null>(null);
  const { current } = useLedger();
  const here = CHAPTERS.find((c) => c.id === current);
  const hereAt = here ? CHAPTERS.indexOf(here) + 1 : 0;
  const past = AFTER.find((a) => a.id === current);

  const go: Go = (id, focusId) => (e) => {
    if (!isPlainClick(e)) return;
    e.preventDefault();
    jumpTo(id, focusId);
  };
  const goFromSheet: Go = (id, focusId) => (e) => {
    if (!isPlainClick(e)) return;
    e.preventDefault();
    pending.current = [id, focusId];
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* Wide screens: the margin */}
      <nav
        aria-label="Main"
        className="fixed inset-y-0 left-0 z-40 hidden w-[17rem] flex-col border-r border-border/70 bg-background px-5 pb-6 pt-6 xl:flex"
      >
        <a href="#home" onClick={go("home")} className="flex items-center gap-2.5 self-start rounded-md py-1" aria-label="Eleazar, back to top">
          <img src={avatar} alt="" width={30} height={30} className="h-[30px] w-[30px] rounded-full object-cover" />
          <span className="font-display text-base font-semibold tracking-tight text-foreground">
            Eleazar<span className="text-primary">.</span>
          </span>
        </a>

        {/* Scrolls on its own when a short screen cannot fit the unfolded chapter; layoutScroll keeps the rows' slide measured right. */}
        <motion.div layoutScroll className="-mx-1 min-h-0 flex-1 overflow-y-auto overscroll-contain px-1">
        <p className="mt-6 font-mono [@media(min-height:820px)]:mt-10 text-[11px] uppercase tracking-[0.14em] text-muted-foreground/80">My work, by kind</p>
        <div className="mt-3">
          <Index go={go} />
        </div>

        <ul className="mt-6 space-y-0.5 border-t border-border/70 pt-4">
          {AFTER.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                onClick={go(l.id)}
                aria-current={current === l.id ? "location" : undefined}
                className={`flex min-h-8 items-center text-[14px] transition-colors duration-150 ease-out-strong ${
                  current === l.id ? "text-foreground" : "text-muted-foreground"
                } [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        </motion.div>

        <div className="shrink-0 border-t border-border/70 pt-4">
          <BookButton className="h-10 w-full text-sm" />
          <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground [@media(max-height:760px)]:hidden">
            <a
              href={UPWORK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-border underline-offset-4 transition-colors duration-150 ease-out-strong [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground"
            >
              Upwork Top Rated
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            . Fixed price per milestone.
          </p>
        </div>
      </nav>

      {/* Narrow screens: the dock */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-[hsl(var(--surface))] pb-[env(safe-area-inset-bottom)] xl:hidden">
        <nav aria-label="Main" className="mx-auto flex h-16 max-w-xl items-center gap-3 px-3">
          {/* A real trigger, so closing the sheet hands focus back here. */}
          <SheetTrigger asChild>
            <button
              type="button"
              className="flex h-11 min-w-0 flex-1 items-center gap-2.5 rounded-md px-2 text-left transition-transform duration-150 ease-out-strong active:scale-[0.98]"
            >
              {here ? (
                <>
                  <BrandIcon icon={here.icons[0]} tone="brand" className="h-4 w-4 shrink-0" />
                  <span className="sr-only">{hereAt}. </span>
                  <span className="min-w-0 truncate text-[15px] font-medium text-foreground">{here.title}</span>
                  <DockMarks chapter={here} />
                </>
              ) : (
                <span className="text-[15px] font-medium text-foreground">{past ? past.label : "Contents"}</span>
              )}
              <span className="sr-only">, open the contents</span>
            </button>
          </SheetTrigger>
          <BookButton className="h-11 shrink-0 px-5 text-[15px]" />
        </nav>
      </div>

      <SheetContent
        side="bottom"
        className="max-h-[88svh] overflow-y-auto rounded-t-xl border-border bg-[hsl(var(--surface))] px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-3 [&>button:last-child]:hidden"
        onCloseAutoFocus={(e) => {
          const next = pending.current;
          if (!next) return; // closed without a choice: focus goes back to the dock
          pending.current = null;
          e.preventDefault();
          jumpTo(next[0], next[1]);
        }}
      >
        <div className="flex items-center gap-3 pb-3">
          <img src={avatar} alt="" width={36} height={36} className="h-9 w-9 rounded-full object-cover" />
          <div className="min-w-0 flex-1">
            <SheetTitle className="font-display text-base font-semibold tracking-tight text-foreground">
              Eleazar<span className="text-primary">.</span>
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">My work, by kind. I usually reply within 24 hours.</SheetDescription>
          </div>
          <SheetClose className="-mr-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-foreground transition-transform duration-150 ease-out-strong active:scale-[0.97]">
            <X className="h-5 w-5" aria-hidden />
            <span className="sr-only">Close the contents</span>
          </SheetClose>
        </div>
        <div className="border-t border-border pt-2">
          <Index go={goFromSheet} open />
        </div>
        <ul className="mt-2 grid grid-cols-2 border-t border-border pt-1">
          {AFTER.map((l) => (
            <li key={l.id}>
              <a href={`#${l.id}`} onClick={goFromSheet(l.id)} className="flex min-h-11 items-center text-[15px] text-foreground/90">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <BookButton className="mt-3 h-12 w-full text-base" />
      </SheetContent>
    </Sheet>
  );
};

/** The dock's marks for the chapter in view. */
const DockMarks = ({ chapter }: { chapter: Chapter }) => {
  const { seen } = useLedger();
  return (
    <span className="ml-auto shrink-0 pl-1">
      <Marks chapter={chapter} seen={seen} />
    </span>
  );
};
