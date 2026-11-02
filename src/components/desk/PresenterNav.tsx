import { Link } from "react-router-dom";
import { BOOKING_URL } from "@/lib/desk";

/**
 * The case-study pages' bar. (The homepage's navigation is the ledger margin, Ledger.tsx.)
 */

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
