import { motion } from "motion/react";
import { EASE_OUT, reveal, revealAt, useStill } from "@/lib/desk";
import { BuildTitle, Rows } from "./Plate";
import { BuildList } from "./Workshop";
import { buildElementId } from "./ledgerStore";
import { CaseLink } from "./CaseLink";

/**
 * Chapter four, on paper: outreach and marketing. First the checks that keep
 * a client's cold email safe (what the system checks, never how the
 * campaigns did), with the one finding the client agreed can be shown; then
 * the engines that find leads and write content.
 * Source for every cold-email line: the cold-email ops research pack
 * pack (02-cold-email-ops.md, checked against the code on 2 Nov 2026).
 */

const GATES = [
  {
    rule: "The campaign can be read.",
    why: "Without this, a count of 0 could mean nothing happened, or that the check could not look.",
  },
  {
    rule: "Every sending mailbox is active, warmed up and healthy.",
    why: "A mailbox that is missing, inactive, has warm-up off or scores under 90 (Instantly’s own bar) stops it.",
  },
  {
    rule: "Bounces stay at 3% or under, per person emailed.",
    why: "Only judged once 50 or more people have been emailed, because 1 bounce in 20 says nothing. Above 2% is a warning.",
  },
  { rule: "The list of sent emails can be read.", why: "Otherwise the bounce rate was never really checked." },
  {
    rule: "No AI reply agent is switched on.",
    why: "It could answer a prospect in the client’s name before a person has read the reply.",
  },
];

const LEAD_ROWS = [
  { label: "For", value: "The same plumbing business: commercial property and strata agencies to email." },
  {
    label: "Sources",
    value:
      "Collected from public agency websites and a property-listing site. Every address that gets emailed keeps the page it was read from. 97% of the list was read off a page; the rest, guessed from a name pattern, are never emailed.",
  },
  {
    label: "The gate",
    value: "Before an address could be emailed, a real browser re-read its source page for opt-out notices: 1,044 pages in 2 hours 32 minutes.",
  },
  { label: "Customers", value: "Checked against the client’s own job records, so his customers came off, except 2 firms he asked to keep in." },
  { label: "Built with", value: "Claude Code and Node.js, with a Spam Act 2003 note that cites every rule by section and clause." },
  { label: "Status", value: <span className="text-foreground">Delivered in September 2026, and in use.</span> },
];

const ROWS = [
  { label: "For", value: "An Australian plumbing business: 4 campaigns, about 940 contacts." },
  { label: "Runs on", value: "Node.js and the Instantly API. The daily check only reads; it never sends anything itself." },
  {
    label: "Bounces",
    value: "Counted per person emailed, not with Instantly’s own “contacted” figure, which matched neither the people nor the emails.",
  },
  {
    label: "It warns",
    value:
      "When anyone replies (a person reads every reply) or unsubscribes, and when a send setting differs from the plan. It also prints what it cannot see: complaints inside replies, and replies that go to another inbox.",
  },
  {
    label: "Also",
    value:
      "A preflight of 50+ checks before a campaign launches. Every opt-out copied to a record that outlives Instantly, for the Spam Act. Mailboxes stepped from 10 to 20 to 30 emails a day, with a rule to step back.",
  },
];

/** The five checks on one drawn line: it draws down once, each check lands on it in turn. */
function Gates() {
  const reduce = useStill();
  return (
    <ol className="relative" aria-label="The five checks">
      <motion.span
        aria-hidden
        className="absolute bottom-10 left-[11.5px] top-3 w-px origin-top bg-foreground/40"
        initial={reduce ? false : { scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, margin: "0px 0px -18% 0px" }}
        transition={{ duration: 1.6, ease: EASE_OUT }}
      />
      {GATES.map((g, i) => (
        <motion.li
          key={g.rule}
          {...revealAt(i, 0.12)}
          className="relative grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-4 pb-7"
        >
          <span className="tabular relative mt-[2px] grid h-6 w-6 place-items-center rounded-[5px] border border-foreground/55 bg-[hsl(var(--ch-ground))] font-mono text-[11px] text-foreground">
            {i + 1}
          </span>
          <div>
            <p className="text-[17px] font-medium leading-snug text-foreground md:text-lg">{g.rule}</p>
            <p className="mt-1 max-w-[52ch] text-[15px] leading-relaxed text-muted-foreground">{g.why}</p>
          </div>
        </motion.li>
      ))}
      <motion.li {...revealAt(GATES.length, 0.12)} className="relative grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-4">
        <span className="relative mt-[2px] grid h-6 w-6 place-items-center rounded-full bg-foreground font-mono text-[10px] font-semibold text-[hsl(var(--ch-ground))]">
          !
        </span>
        <p className="text-[17px] leading-snug text-foreground md:text-lg">
          <span className="font-semibold">If any one fails, the send stops.</span>{" "}
          <span className="text-muted-foreground">The check runs at every check-in.</span>
        </p>
      </motion.li>
    </ol>
  );
}

export const OutreachChapter = () => (
  <div className="mx-auto w-full max-w-[1200px] px-5 pb-24 pt-20 sm:px-8 md:pb-32 md:pt-28">
    <article
      id={buildElementId("cold-email")}
      data-build="cold-email"
      aria-labelledby="cold-email-title"
      className="scroll-mt-10"
    >
      <BuildTitle id="cold-email-title">Cold-email safety checks</BuildTitle>
      <motion.p {...revealAt(1)} className="mt-4 max-w-[44ch] text-[17px] leading-snug text-muted-foreground md:text-lg">
        Cold email can hurt a business fast: emails that bounce, a mailbox in poor health, a reply nobody reads. So the
        campaigns run behind five checks.
      </motion.p>

      <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-14 md:mt-16 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-7">
          <Gates />
        </div>
        <div className="lg:col-span-5">
          <Rows rows={ROWS} first={1} />
          <div className="mt-6">
            <CaseLink to="/case-study/cold-email-safety-checks" label="Read the case study: Cold-email safety checks" />
          </div>
        </div>
      </div>

      {/* The one finding that may be shown */}
      <motion.figure {...reveal} className="mx-0 mt-20 border-t border-foreground/25 pt-10 md:mt-28 md:pt-14">
        <blockquote className="max-w-[26ch] font-display text-[clamp(1.75rem,3.6vw,3.1rem)] font-medium leading-[1.1] tracking-[-0.03em] text-foreground">
          Instantly’s analytics said 0 unsubscribes. 3 people had used the unsubscribe link.
        </blockquote>
        <figcaption className="mt-6 max-w-[58ch] text-[15px] leading-relaxed text-muted-foreground md:text-base">
          Found on 31 October 2026, from the lead records. An earlier weekly report had repeated the 0. The check now
          counts unsubscribes from the lead records and labels that analytics line as missing them.
        </figcaption>
      </motion.figure>
    </article>

    {/* The list behind the campaigns: every address with its source */}
    <article
      id={buildElementId("lead-list")}
      data-build="lead-list"
      aria-labelledby="lead-list-title"
      className="mt-24 grid grid-cols-[minmax(0,1fr)] scroll-mt-10 gap-10 md:mt-36 lg:grid-cols-12 lg:gap-x-10"
    >
      <div className="lg:col-span-5">
        <BuildTitle id="lead-list-title">A lead list where every emailed address has a source</BuildTitle>
        <motion.p {...revealAt(1)} className="mt-4 max-w-[40ch] text-[17px] leading-snug text-muted-foreground md:text-lg">
          The list behind the property-manager campaigns: every address was found on a real page, and that page was checked for a no-marketing notice before the address was loaded.
        </motion.p>
      </div>
      <div className="lg:col-span-7">
        <Rows rows={LEAD_ROWS} first={1} />
      </div>
    </article>

    <div className="mt-24 md:mt-36">
      <BuildList ids={["apollo", "hook-bank", "instagram", "static-ad"]} titleId="engines-title" title="Engines that find leads and write the content." />
    </div>
  </div>
);
