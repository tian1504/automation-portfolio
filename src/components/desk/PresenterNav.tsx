import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BOOKING_URL, jumpTo } from "@/lib/desk";
import avatar from "@/assets/desk/avatar.webp";

/**
 * The presenter chip. The grammar's nav is the person, not a bar: on desktop a
 * small chip top-right (his face, the wordmark, three jumps, the one action);
 * on phones a dock at the thumb from the first frame (Menu, Prices, the action).
 * Case-study pages get `CaseStudyBar` below instead.
 */

const CHIP_LINKS = [
  { id: "work", label: "Work" },
  { id: "testimonials", label: "Reviews" },
  { id: "pricing", label: "Prices" },
];

const SHEET_LINKS = [
  { id: "work", label: "Work" },
  { id: "builds", label: "More builds" },
  { id: "portfolio", label: "Workflows" },
  { id: "testimonials", label: "Reviews" },
  { id: "experience", label: "Experience" },
  { id: "pricing", label: "Prices" },
  { id: "faq", label: "Questions" },
  { id: "contact", label: "Contact" },
];

/**
 * Where keyboard focus lands after a jump, when it is not the anchor itself.
 * #work is an aria-hidden marker inside the pinned stage; its visible heading
 * sits after the hero copy, so the next Tab continues to the case-study link.
 */
const FOCUS_AFTER_JUMP: Record<string, string> = { work: "work-title" };
const jump = (id: string) => jumpTo(id, FOCUS_AFTER_JUMP[id]);

/** Let modified clicks (new tab, new window) keep the browser's behaviour. */
const isPlainClick = (e: React.MouseEvent) =>
  e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

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

export const PresenterNav = () => {
  const [open, setOpen] = useState(false);
  // A link chosen in the sheet waits until the sheet has fully closed (scroll
  // lock released), then jumps and takes focus with it.
  const pending = useRef<string | null>(null);

  const go = (id: string) => (e: React.MouseEvent) => {
    if (!isPlainClick(e)) return;
    e.preventDefault();
    jump(id);
  };

  const goFromSheet = (id: string) => (e: React.MouseEvent) => {
    if (!isPlainClick(e)) return;
    e.preventDefault();
    pending.current = id;
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* Desktop: the chip */}
      <nav
        aria-label="Main"
        className="fixed right-5 top-5 z-50 hidden items-center gap-1 rounded-xl border border-border/80 bg-[hsl(var(--surface))] py-1.5 pl-1.5 pr-1.5 shadow-[var(--e2)] lg:flex"
      >
        <a
          href="#home"
          onClick={go("home")}
          className="group flex items-center gap-2.5 rounded-lg py-1 pl-1 pr-3"
          aria-label="Eleazar, back to top"
        >
          <img src={avatar} alt="" width={28} height={28} className="h-7 w-7 rounded-full object-cover" />
          <span className="font-display text-[15px] font-semibold tracking-tight text-foreground">
            Eleazar<span className="text-primary">.</span>
          </span>
        </a>
        <span aria-hidden className="mx-1 h-5 w-px bg-border" />
        {CHIP_LINKS.map((l) => (
          <a
            key={l.id}
            href={`#${l.id}`}
            onClick={go(l.id)}
            className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors duration-150 ease-out-strong [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground"
          >
            {l.label}
          </a>
        ))}
        <BookButton className="ml-1 h-9 px-4 text-sm" />
      </nav>

      {/* Phone: the dock */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-[hsl(var(--surface))] pb-[env(safe-area-inset-bottom)] lg:hidden">
        <nav aria-label="Main" className="mx-auto flex h-16 max-w-xl items-center gap-2 px-3">
          {/* A real trigger, so closing the sheet (X, Escape, overlay) hands
              focus back to Menu. */}
          <SheetTrigger asChild>
            <button
              type="button"
              className="inline-flex h-11 items-center gap-2 rounded-md px-3 text-sm font-medium text-foreground transition-transform duration-150 ease-out-strong active:scale-[0.97]"
            >
              <Menu className="h-4 w-4" aria-hidden />
              Menu
            </button>
          </SheetTrigger>
          <a
            href="#pricing"
            onClick={go("pricing")}
            className="inline-flex h-11 items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-[transform,color] duration-150 ease-out-strong active:scale-[0.97] [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground"
          >
            Prices
          </a>
          <BookButton className="ml-auto h-11 px-5 text-[15px]" />
        </nav>
      </div>

      <SheetContent
        side="bottom"
        // The primitive's own close is a 16px icon; this sheet draws a 44px one
        // in its header row instead.
        className="rounded-t-xl border-border bg-[hsl(var(--surface))] px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-3 [&>button:last-child]:hidden"
        onCloseAutoFocus={(e) => {
          const id = pending.current;
          if (!id) return; // closed without a choice: focus returns to Menu
          pending.current = null;
          e.preventDefault();
          jump(id);
        }}
      >
        <div className="flex items-center gap-3 pb-2">
          <img src={avatar} alt="" width={36} height={36} className="h-9 w-9 rounded-full object-cover" />
          <div className="min-w-0 flex-1">
            <SheetTitle className="font-display text-base font-semibold tracking-tight text-foreground">
              Eleazar<span className="text-primary">.</span>
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">I usually reply within 24 hours</SheetDescription>
          </div>
          <SheetClose className="-mr-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-foreground transition-transform duration-150 ease-out-strong active:scale-[0.97]">
            <X className="h-5 w-5" aria-hidden />
            <span className="sr-only">Close menu</span>
          </SheetClose>
        </div>
        <ul className="border-t border-border">
          {SHEET_LINKS.map((l) => (
            <li key={l.id} className="border-b border-border">
              <a
                href={`#${l.id}`}
                onClick={goFromSheet(l.id)}
                className="flex min-h-12 items-center text-base text-foreground/90"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <BookButton className="mt-4 h-12 w-full text-base" />
      </SheetContent>
    </Sheet>
  );
};

/**
 * Case-study pages keep their slim sticky bar in place of the chip and dock:
 * the wordmark home, the way back to where this build sits on the homepage,
 * and the one action, so Book a call is one tap away at every scroll depth.
 */
export const CaseStudyBar = ({ backTo }: { backTo: string }) => (
  <header className="sticky top-0 z-20 border-b border-border/60 bg-background/70 backdrop-blur-md">
    <div className="container-custom flex h-14 items-center gap-1 sm:gap-3">
      <Link
        to="/"
        className="mr-auto inline-flex h-11 items-center font-display text-base font-bold tracking-tight text-foreground"
      >
        Eleazar<span className="text-primary">.</span>
      </Link>
      <a
        href={backTo}
        className="inline-flex h-11 items-center gap-1.5 whitespace-nowrap rounded-md px-2 font-mono text-xs text-muted-foreground transition-colors duration-150 ease-out-strong [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground"
      >
        <span aria-hidden>←</span>
        Back to work
      </a>
      <BookButton className="h-11 shrink-0 whitespace-nowrap px-4 text-sm lg:h-9" />
    </div>
  </header>
);
