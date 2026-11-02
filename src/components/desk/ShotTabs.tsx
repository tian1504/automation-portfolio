import { useId, useRef, useState, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import { EASE_OUT } from "@/lib/desk";

/**
 * Real app screenshots in one window, with a tab per screen: the visitor
 * clicks through the app instead of reading about it. Every screenshot is
 * in the page (stacked in one grid cell) and only the chosen one is shown,
 * so switching is instant and the frame never jumps. Arrow keys move between
 * tabs (the tabs pattern).
 */

export type ShotTab = { id: string; label: string; src: string; w: number; h: number; alt: string; caption: string };

export function ShotTabs({ tabs, label }: { tabs: ShotTab[]; label: string }) {
  const [active, setActive] = useState(0);
  const base = useId();
  const btns = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (i: number) => (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = tabs.length - 1;
    const to =
      e.key === "ArrowRight" ? (i === last ? 0 : i + 1)
      : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (to === null) return;
    e.preventDefault();
    setActive(to);
    btns.current[to]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label={label} className="flex flex-wrap gap-1.5">
        {tabs.map((t, i) => {
          const on = i === active;
          return (
            <button
              key={t.id}
              ref={(el) => {
                btns.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${base}-tab-${i}`}
              aria-selected={on}
              aria-controls={`${base}-panel`}
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={onKey(i)}
              className={`relative isolate inline-flex h-10 items-center rounded-md px-3.5 text-[14px] font-medium transition-[color,transform] duration-150 ease-out-strong active:scale-[0.97] ${
                on ? "text-foreground" : "text-muted-foreground [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground"
              }`}
            >
              {on && (
                <motion.span
                  layoutId={`${base}-pill`}
                  aria-hidden
                  className="absolute inset-0 -z-10 rounded-md bg-[hsl(var(--surface-2))] shadow-[var(--edge)]"
                  transition={{ duration: 0.22, ease: EASE_OUT }}
                />
              )}
              {t.label}
            </button>
          );
        })}
      </div>

      <figure
        id={`${base}-panel`}
        role="tabpanel"
        aria-labelledby={`${base}-tab-${active}`}
        className="m-0 mt-4"
      >
        {/* A plain window frame around the real screens. */}
        <div className="overflow-hidden rounded-xl border border-border bg-[hsl(var(--surface))] shadow-[var(--edge),var(--e3)]">
          <div aria-hidden className="flex h-8 items-center gap-1.5 border-b border-border px-3">
            <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
          </div>
          {/* Phones: the screen keeps a readable size and swipes sideways. */}
          <div
            className="overflow-x-auto overscroll-x-contain sm:overflow-visible"
            tabIndex={0}
            role="region"
            aria-label={`${label}: ${tabs[active].label}, scrolls sideways on small screens`}
          >
          <div className="grid w-[820px] bg-white sm:w-auto">
            {tabs.map((t, i) => (
              <img
                key={t.id}
                src={t.src}
                width={t.w}
                height={t.h}
                alt={i === active ? t.alt : ""}
                aria-hidden={i !== active}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="block h-auto w-full transition-opacity duration-200 ease-out-strong [grid-area:1/1]"
                style={{ opacity: i === active ? 1 : 0 }}
              />
            ))}
          </div>
          </div>
        </div>
        <p className="mt-2 text-[12px] text-muted-foreground sm:hidden">Swipe sideways to see the whole screen.</p>
        <figcaption className="mt-3 text-sm text-muted-foreground">{tabs[active].caption}</figcaption>
      </figure>
    </div>
  );
}
