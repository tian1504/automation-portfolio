import { createRef, useMemo, type ReactNode, type RefObject } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useMediaQuery } from "@/lib/desk";

/**
 * Real screenshots on cards that stack as you scroll: each card holds near
 * the top of the screen and the next one is laid over it, a few pixels lower,
 * so the pile shows its edges. A card steps back a little (smaller, dimmer)
 * while the next one slides over it: the same language as the chapter title
 * cards. Every card keeps the same room after it, so the whole pile holds
 * until the last card has landed.
 * Phones (under 640px): a plain list. Desktop screenshots shrunk to a phone
 * are unreadable, so each one shows at about 56% of its pixels and swipes
 * sideways when wider than the card, and the cards fit their content (cards of
 * different heights cannot stack cleanly).
 * Reduced motion: the same plain list.
 */

export type StackShot = { src: string; w: number; h: number; alt: string; className?: string };
export type StackItem = { id: string; title: string; body?: ReactNode; shots: StackShot[]; dark?: boolean };

const OFFSET = 14;
/** Phone scale for screenshots: chat text lands at about 10px. */
const PHONE_SCALE = 0.56;

export function StackCards({ items, label }: { items: StackItem[]; label: string }) {
  const reduce = useReducedMotion();
  const phone = useMediaQuery("(max-width: 639.98px)");
  const flat = !!reduce || phone;
  const refs = useMemo(() => items.map(() => createRef<HTMLLIElement>()), [items]);
  return (
    <ol aria-label={label} className="relative">
      {items.map((it, i) => (
        <Card key={it.id} item={it} i={i} self={refs[i]} next={refs[i + 1] ?? null} flat={flat} />
      ))}
    </ol>
  );
}

function Card({
  item,
  i,
  self,
  next,
  flat,
}: {
  item: StackItem;
  i: number;
  self: RefObject<HTMLLIElement>;
  next: RefObject<HTMLLIElement> | null;
  flat: boolean;
}) {
  // 0 while the next card is still below the screen, 1 once it has reached its place over this one.
  // (The last card has no next one; its progress is never used.)
  const { scrollYProgress } = useScroll(next ? { target: next, offset: ["start end", "start start"] } : {});
  return (
    <li
      ref={self}
      className={flat ? "mb-6" : "sticky pb-[26svh]"}
      style={flat ? undefined : { top: `calc(9svh + ${i * OFFSET}px)` }}
    >
      <CardFace item={item} i={i} cover={flat || !next ? null : scrollYProgress} fixed={!flat} />
    </li>
  );
}

function CardFace({
  item,
  i,
  cover,
  fixed,
}: {
  item: StackItem;
  i: number;
  cover: MotionValue<number> | null;
  fixed: boolean;
}) {
  const zero = useMotionValue(0);
  const scale = useTransform(cover ?? zero, [0, 1], [1, 0.94]);
  const dim = useTransform(cover ?? zero, [0, 0.9], [0, 0.55]);
  return (
    <motion.div
      className={`relative flex origin-top flex-col overflow-hidden rounded-xl border border-border bg-[hsl(var(--surface))] shadow-[var(--edge),var(--e3)] ${
        fixed ? "h-[min(70svh,720px)]" : ""
      }`}
      style={cover ? { scale, willChange: "transform" } : undefined}
    >
      <div className="flex items-baseline gap-3 border-b border-border px-4 py-3 sm:px-6 sm:py-4">
        <span className="tabular font-mono text-[11px] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
        <p className="min-w-0 text-[16px] leading-snug sm:text-[17px]">
          <span className="font-semibold text-foreground">{item.title}</span>
          {item.body ? <span className="text-muted-foreground"> {item.body}</span> : null}
        </p>
      </div>
      <div
        className={`min-h-0 flex-1 p-3 sm:p-6 ${fixed ? "flex items-center justify-center gap-6" : "space-y-4"} ${
          item.dark ? "bg-[hsl(30_6%_6%)]" : "bg-[hsl(36_14%_86%)]"
        }`}
      >
        {item.shots.map((s) =>
          fixed ? (
            <img
              key={s.src}
              src={s.src}
              width={s.w}
              height={s.h}
              alt={s.alt}
              loading="lazy"
              decoding="async"
              draggable={false}
              className={`block h-auto max-h-full w-auto min-w-0 max-w-full rounded-md object-contain shadow-[0_1px_2px_hsl(30_20%_20%/0.18),0_8px_24px_-8px_hsl(30_20%_20%/0.28)] ${s.className ?? ""}`}
            />
          ) : (
            <PhoneShot key={s.src} s={s} dark={!!item.dark} title={item.title} />
          ),
        )}
      </div>
      {cover && <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-[hsl(var(--shadow-tint))]" style={{ opacity: dim }} />}
    </motion.div>
  );
}

/** A screenshot at a readable size on a phone; it swipes sideways when wider than the card. */
function PhoneShot({ s, dark, title }: { s: StackShot; dark: boolean; title: string }) {
  const pw = Math.round(s.w * PHONE_SCALE);
  const wide = pw > 300;
  return (
    <div className="min-w-0">
      <div
        className="overflow-x-auto overscroll-x-contain rounded-md"
        tabIndex={wide ? 0 : undefined}
        role={wide ? "region" : undefined}
        aria-label={wide ? `${title} Screenshot, scrolls sideways` : undefined}
      >
        <img
          src={s.src}
          width={s.w}
          height={s.h}
          alt={s.alt}
          loading="lazy"
          decoding="async"
          draggable={false}
          style={{ width: wide ? `${pw}px` : `min(${pw}px, 100%)` }}
          className="block h-auto max-w-none rounded-md shadow-[0_1px_2px_hsl(30_20%_20%/0.18),0_8px_24px_-8px_hsl(30_20%_20%/0.28)]"
        />
      </div>
      {wide && (
        <p className={`mt-2 text-[12px] ${dark ? "text-[hsl(40_25%_96%/0.6)]" : "text-[hsl(30_10%_30%)]"}`}>
          {dark ? "Swipe sideways to see the whole workflow." : "Swipe sideways to see the whole thread."}
        </p>
      )}
    </div>
  );
}
