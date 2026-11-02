import type { ReactNode } from "react";
import { motion } from "motion/react";
import { reveal, revealAt } from "@/lib/desk";

/**
 * Shared parts for the chapters' build plates: the museum-style label rows
 * (For / What it does / Runs on / Status) the Amazon plates already use, and
 * a build's title.
 */

/** Label rows: label beside its value from sm up, run in at the start of the line on phones. */
export const Rows = ({ rows, first = 2 }: { rows: { label: string; value: ReactNode }[]; first?: number }) => (
  <dl className="border-t border-border">
    {rows.map((r, i) => (
      <motion.div
        key={r.label}
        {...revealAt(i + first, 0.05)}
        className="border-b border-border py-2.5 sm:grid sm:grid-cols-[7.25rem_1fr] sm:gap-5 sm:py-3"
      >
        {/* The {" "} is a real space, so copied text and screen readers never join label and value. */}
        <dt className="label-mono mr-1.5 inline text-muted-foreground sm:mr-0 sm:block sm:pt-[5px]">{r.label}</dt>{" "}
        <dd className="inline text-[15px] leading-normal text-foreground/80 sm:block sm:max-w-[38em] sm:leading-relaxed md:text-base">
          {r.value}
        </dd>
      </motion.div>
    ))}
  </dl>
);

/** A build's title inside a chapter. */
export const BuildTitle = ({ id, children, className = "" }: { id: string; children: ReactNode; className?: string }) => (
  <motion.h3
    {...reveal}
    id={id}
    className={`font-display text-[clamp(1.6rem,2.6vw,2.25rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-foreground ${className}`}
  >
    {children}
  </motion.h3>
);
