import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CaseStudyBar } from "@/components/desk/PresenterNav";
import { CaseLink } from "@/components/desk/CaseLink";
import { PlainHeading } from "@/components/PlainHeading";
import { BOOKING_URL } from "@/lib/desk";

/**
 * Case study: the cold-email safety checks and the lead list behind them.
 * Every fact here comes from src/components/desk/OutreachChapter.tsx (GATES,
 * ROWS, the unsubscribe finding, LEAD_ROWS) or public/llms.txt.
 * Rule from the source: show what the system checks, never how the campaigns
 * did. The unsubscribe finding is the only result the client agreed to show.
 * All text is plain markup (no fade-in), so every word is in the pre-rendered
 * HTML for readers and crawlers that never scroll.
 */

const CHECKS = [
  {
    n: "01",
    rule: "The campaign can be read.",
    why: "Without this, a count of 0 could mean nothing happened, or that the check could not look.",
  },
  {
    n: "02",
    rule: "Every sending mailbox is active, warmed up and healthy.",
    why: "A mailbox that is missing, inactive, has warm-up off or scores under 90 (Instantly’s own bar) stops the send.",
  },
  {
    n: "03",
    rule: "Bounces stay at 3% or under, per person emailed.",
    why: "The rate is only judged once 50 or more people have been emailed, because 1 bounce in 20 says nothing. Above 2% is a warning.",
  },
  {
    n: "04",
    rule: "The list of sent emails can be read.",
    why: "Otherwise the bounce rate was never really checked.",
  },
  {
    n: "05",
    rule: "No AI reply agent is switched on.",
    why: "It could answer a prospect in the client’s name before a person has read the reply.",
  },
];

const LEAD_ROWS: { label: string; value: ReactNode }[] = [
  {
    label: "For",
    value: "The same plumbing business: commercial property and strata agencies to email.",
  },
  {
    label: "Sources",
    value:
      "Collected from public agency websites and a property-listing site. Every address that gets emailed keeps the page it was read from.",
  },
  {
    label: "Read off a page",
    value: "97% of the list. The rest were guessed from a name pattern, and those are never emailed.",
  },
  {
    label: "Opt-out re-check",
    value:
      "Before an address could be emailed, a real browser re-read its source page for opt-out notices: 1,044 pages in 2 hours 32 minutes.",
  },
  {
    label: "Customers",
    value:
      "Checked against the client’s own job records, so his customers came off, except 2 firms he asked to keep in.",
  },
  {
    label: "Status",
    value: <span className="text-foreground">Delivered in September 2026, and in use.</span>,
  },
];

const BUILT_WITH: { label: string; value: string }[] = [
  {
    label: "Safety checks",
    value: "Node.js and the Instantly API.",
  },
  {
    label: "Lead list",
    value: "Claude Code and Node.js.",
  },
];

/** A label and value list in the site's row style, with nothing hidden on load. */
const PlainRows = ({ rows }: { rows: { label: string; value: ReactNode }[] }) => (
  <dl className="border-t border-border max-w-2xl">
    {rows.map((r) => (
      <div
        key={r.label}
        className="border-b border-border py-2.5 sm:grid sm:grid-cols-[9rem_1fr] sm:gap-5 sm:py-3"
      >
        {/* The {" "} is a real space, so copied text and screen readers never join label and value. */}
        <dt className="label-mono mr-1.5 inline text-muted-foreground sm:mr-0 sm:block sm:pt-[5px]">{r.label}</dt>{" "}
        <dd className="inline text-[15px] leading-normal text-foreground/80 sm:block sm:leading-relaxed md:text-base">
          {r.value}
        </dd>
      </div>
    ))}
  </dl>
);

/** The CaseLink look for homepage anchors, which need a plain <a> so the browser scrolls to them. */
const AnchorLink = ({ href, children }: { href: string; children: string }) => (
  <a
    href={href}
    className="group inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-foreground underline decoration-border underline-offset-4 transition-[text-decoration-color,opacity] duration-150 ease-out-strong active:opacity-70 [@media(hover:hover)_and_(pointer:fine)]:hover:decoration-foreground"
  >
    {children}
    <ArrowRight
      aria-hidden
      className="h-4 w-4 transition-transform duration-150 ease-out-strong [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-0.5"
    />
  </a>
);

const CaseStudyColdEmail = () => (
  <div className="min-h-screen flex flex-col">
    <CaseStudyBar backTo="/#b-cold-email" />

    <main className="flex-1">
      {/* Hero */}
      <section className="section-padding pt-16 md:pt-20">
        <div className="container-custom max-w-5xl mx-auto">
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground border border-border rounded-sm px-2 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/70" aria-hidden />
            Client build
          </span>
          <p className="mt-5 font-mono text-xs md:text-sm text-muted-foreground">
            For an Australian plumbing business · Node.js · Instantly API
          </p>
          <h1 className="mt-4 font-display font-bold tracking-tighter-2 leading-[1.02] text-4xl md:text-5xl lg:text-6xl text-foreground">
            Cold email safety checks that stop the send<span className="text-primary">.</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-xl">
            I built five checks for an Australian plumbing business’s cold email campaigns. They run at every
            check-in. If any one fails, the send stops.
          </p>
        </div>
      </section>

      {/* Why it matters */}
      <section className="section-padding pt-0" aria-labelledby="why-title">
        <div className="container-custom max-w-5xl mx-auto">
          <PlainHeading
            id="why-title"
            title="Why cold email needs checks"
            description="Cold email can hurt a business fast: emails that bounce, a mailbox in poor health, a reply nobody reads. So the client’s 4 campaigns (about 940 contacts) run behind five checks."
          />
          <div className="max-w-2xl space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
            <p>
              The daily check runs on Node.js and the Instantly API. It only reads. It never sends anything itself.
            </p>
            <p>
              This page covers what the system checks. I don’t share how the campaigns did. The client agreed I could
              show one finding, and it’s further down.
            </p>
          </div>
        </div>
      </section>

      {/* The five checks */}
      <section className="section-padding pt-0" aria-labelledby="checks-title">
        <div className="container-custom max-w-5xl mx-auto">
          <PlainHeading id="checks-title" title="The five checks" />
          <ol className="space-y-6 max-w-2xl" aria-label="The five checks">
            {CHECKS.map((c, i) => (
              <li key={c.n} className={`border-l-2 pl-5 ${i === 0 ? "border-primary/60" : "border-border"}`}>
                <div className="font-mono text-xs text-muted-foreground mb-1" aria-hidden>
                  {c.n}
                </div>
                <h3 className="font-bold text-foreground">{c.rule}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mt-1">{c.why}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 max-w-2xl text-base md:text-lg leading-relaxed text-foreground">
            <span className="font-semibold">If any one fails, the send stops.</span>{" "}
            <span className="text-muted-foreground">The check runs at every check-in.</span>
          </p>
        </div>
      </section>

      {/* Bounces per person emailed */}
      <section className="section-padding pt-0" aria-labelledby="bounces-title">
        <div className="container-custom max-w-5xl mx-auto">
          <PlainHeading id="bounces-title" title="Why bounces are counted per person emailed" />
          <div className="max-w-2xl space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
            <p>
              Instantly has its own “contacted” figure, but it matched neither the people nor the emails. So the check
              counts bounces per person emailed.
            </p>
          </div>
        </div>
      </section>

      {/* Warnings */}
      <section className="section-padding pt-0" aria-labelledby="warns-title">
        <div className="container-custom max-w-5xl mx-auto">
          <PlainHeading id="warns-title" title="What it warns about" />
          <div className="max-w-2xl space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
            <p>
              The check warns when anyone replies (a person reads every reply) or unsubscribes, and when a send
              setting differs from the plan.
            </p>
            <p>
              It also prints what it cannot see: complaints inside replies, and replies that go to another inbox.
            </p>
          </div>
          <h3 className="mt-10 font-bold text-foreground">Before and during a campaign</h3>
          <p className="mt-2 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
            A preflight of 50+ checks runs before a campaign launches. Mailboxes were stepped up from 10 to 20 to 30
            emails a day, with a rule to step back.
          </p>
        </div>
      </section>

      {/* The one finding that may be shown */}
      <section className="section-padding pt-0" aria-labelledby="caught-title">
        <div className="container-custom max-w-5xl mx-auto">
          <PlainHeading
            id="caught-title"
            title="The unsubscribe finding"
            description="This is the one finding the client agreed I could show."
          />
          <figure className="mx-0 border-t border-border pt-10 md:pt-14">
            <blockquote className="max-w-[26ch] font-display text-[clamp(1.75rem,3.6vw,3.1rem)] font-medium leading-[1.1] tracking-[-0.03em] text-foreground">
              Instantly’s analytics said 0 unsubscribes. 3 people had used the unsubscribe link.
            </blockquote>
            <figcaption className="mt-6 max-w-[58ch] text-[15px] leading-relaxed text-muted-foreground md:text-base">
              Found on 31 October 2026, from the lead records. An earlier weekly report had repeated the 0. The check
              now counts unsubscribes from the lead records and labels that analytics line as missing them.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* The lead list */}
      <section className="section-padding pt-0" aria-labelledby="leads-title">
        <div className="container-custom max-w-5xl mx-auto">
          <PlainHeading
            id="leads-title"
            title="The lead list"
            description="The list behind the property-manager campaigns. Every address was found on a real page, and that page was checked for a no-marketing notice before the address was loaded."
          />
          <PlainRows rows={LEAD_ROWS} />
          <div className="mt-6">
            <AnchorLink href="/#b-lead-list">See the lead list on the homepage</AnchorLink>
          </div>
        </div>
      </section>

      {/* Law and opt-outs */}
      <section className="section-padding pt-0" aria-labelledby="law-title">
        <div className="container-custom max-w-5xl mx-auto">
          <PlainHeading id="law-title" title="The Spam Act and opt-outs" />
          <div className="max-w-2xl space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
            <p>Every opt-out is copied to a record that outlives Instantly, for the Spam Act.</p>
            <p>The lead list comes with a Spam Act 2003 note that cites every rule by section and clause.</p>
          </div>
        </div>
      </section>

      {/* Built with */}
      <section className="section-padding pt-0" aria-labelledby="built-title">
        <div className="container-custom max-w-5xl mx-auto">
          <PlainHeading id="built-title" title="Built with" />
          <PlainRows rows={BUILT_WITH} />
          <div className="mt-8">
            <CaseLink to="/claude-code">How I build with Claude Code</CaseLink>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto">
          <div className="border border-border bg-card/40 p-8 md:p-12">
            <h2 className="font-display font-bold tracking-tight text-2xl md:text-3xl text-foreground">
              Do your campaigns have a stop switch?
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed max-w-xl">
              Tell me what you send with and what worries you about it. I’ll tell you which checks I’d put in front
              of your send.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild className="group">
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                  Book a call
                  <span className="sr-only"> (opens in a new tab)</span>
                  <ArrowUpRight
                    aria-hidden
                    className="ml-2 h-4 w-4 transition-transform duration-150 ease-out-strong [@media(hover:hover)_and_(pointer:fine)]:group-hover:-translate-y-0.5 [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-0.5"
                  />
                </a>
              </Button>
              <Button asChild variant="ghost">
                <a href="/#outreach">See more outreach work</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
);

export default CaseStudyColdEmail;
