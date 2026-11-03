import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CaseStudyBar } from "@/components/desk/PresenterNav";
import { CaseLink } from "@/components/desk/CaseLink";
import { PlainHeading } from "@/components/PlainHeading";
import { BOOKING_URL } from "@/lib/desk";

/**
 * Case study: the Claude Code project behind a client's AI tool review site.
 * Every fact here comes from the review-system build on the homepage
 * (ClaudeCodeChapter: its intro, REVIEW_ROWS, CLAIM and caption, the 208 facts
 * check), the ElevenLabs intro in VoiceChapter, and public/llms.txt.
 * All text is plain (no fade-in), so every word is in the pre-rendered page.
 */

/** The same real entry the homepage shows, from the ElevenLabs review's checked claims (empty fields removed). */
const CLAIM = `{
  "row": "Pricing: Free $0, 10,000 credits a month",
  "quote": "Free $0 (10,000 credits)",
  "file": "evidence/audit/V27us-elevenlabs-pricing.txt",
  "vendorHost": "elevenlabs.io",
  "check": {
    "status": "OK",
    "header": {
      "status": "200",
      "finalUrl": "https://elevenlabs.io/pricing",
      "utc": "2026-10-27T12:47:20.566Z",
      "title": "ElevenLabs Pricing for Creators & Businesses of All Sizes"
    }
  }
}`;

const STEPS = [
  {
    n: "01",
    title: "Save the vendor’s page",
    body: "Every vendor page a review relies on is saved.",
  },
  {
    n: "02",
    title: "Re-find each quoted fact",
    body: "A script looks for each quoted fact in the saved copy of the page.",
  },
  {
    n: "03",
    title: "Record what it found",
    body: "For every fact, the script records the page, the time and the result.",
  },
];

const BLOCKS = [
  { n: "01", body: "A finished page fails that check." },
  { n: "02", body: "One of the page’s quoted facts cannot be re-found." },
];

const SO_FAR = [
  { n: "4", label: "review pages" },
  { n: "208", label: "quoted facts, all re-found" },
  { n: "175", label: "commits between 16 October and 1 November 2026" },
];

/** A homepage anchor, styled like CaseLink (a plain link, so the hash jump works from any page). */
const HomeLink = ({ href, children, label }: { href: string; children: string; label?: string }) => (
  <a
    href={href}
    aria-label={label}
    className="group inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-foreground underline decoration-border underline-offset-4 transition-[text-decoration-color,opacity] duration-150 ease-out-strong active:opacity-70 [@media(hover:hover)_and_(pointer:fine)]:hover:decoration-foreground"
  >
    {children}
    <ArrowRight
      aria-hidden
      className="h-4 w-4 transition-transform duration-150 ease-out-strong [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-0.5"
    />
  </a>
);

const CaseStudyFactCheckedReviews = () => (
  <div className="min-h-screen flex flex-col">
    <CaseStudyBar backTo="/#b-review-system" />

    <main className="flex-1">
      {/* Hero */}
      <section className="section-padding pt-16 md:pt-20">
        <div className="container-custom max-w-5xl mx-auto">
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground border border-border rounded-sm px-2 py-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "hsl(45 93% 54%)" }} aria-hidden />
            Client build · In delivery
          </span>
          <p className="mt-5 font-mono text-xs md:text-sm text-muted-foreground">
            For a client building a US review site about AI tools · Claude Code · a hook on each commit Claude makes
          </p>
          <h1 className="mt-4 font-display font-bold tracking-tighter-2 leading-[1.02] text-4xl md:text-5xl lg:text-6xl text-foreground">
            Fact-checked AI tool reviews<span className="text-primary">.</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-xl">
            A Claude Code project that tests AI tools hands-on for a client’s review site. A review page does not go
            out until every vendor fact in it is re-found in a saved copy of the vendor’s page.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed max-w-xl">
            I build with Claude Code, set the rules and write the checks, and the work is not done until it passes
            them.
          </p>
        </div>
      </section>

      {/* How the evidence works */}
      <section className="section-padding pt-0" aria-labelledby="evidence">
        <div className="container-custom max-w-5xl mx-auto">
          <PlainHeading id="evidence" title="How the evidence works" />
          <ol className="space-y-6 max-w-2xl">
            {STEPS.map((s, i) => (
              <li key={s.n} className={`border-l-2 pl-5 ${i === 0 ? "border-primary/60" : "border-border"}`}>
                <div className="font-mono text-xs text-muted-foreground mb-1">{s.n}</div>
                <h3 className="font-bold text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mt-1">{s.body}</p>
              </li>
            ))}
          </ol>

          <figure className="m-0 mt-12 max-w-2xl md:mt-16">
            <pre className="overflow-x-auto rounded-xl border border-border bg-[hsl(var(--surface))] p-5 font-mono text-[12.5px] leading-[1.65] text-foreground/85 shadow-[var(--edge),var(--e2)] sm:text-[13px]">
              <code>{CLAIM}</code>
            </pre>
            <figcaption className="mt-3 text-sm text-muted-foreground">
              One of the 73 checked facts behind the ElevenLabs review, as the checker left it (empty fields removed).
            </figcaption>
          </figure>

          <div className="mt-8 max-w-2xl">
            <h3 className="font-bold text-foreground">Reading the entry</h3>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              The fact is “Pricing: Free $0, 10,000 credits a month”. The words the script looked for in the saved page
              are “Free $0 (10,000 credits)”. The check came back OK, with the page (https://elevenlabs.io/pricing) and
              the time (27 October 2026, 12:47 UTC) recorded beside it.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              This entry comes from the ElevenLabs review. That review was hands-on, with every take measured, and what
              I measured is on the homepage.
            </p>
            <div className="mt-2">
              <HomeLink href="/#b-elevenlabs">See the ElevenLabs voice project on the homepage</HomeLink>
            </div>
          </div>
        </div>
      </section>

      {/* The gate */}
      <section className="section-padding pt-0" aria-labelledby="gate">
        <div className="container-custom max-w-5xl mx-auto">
          <PlainHeading
            id="gate"
            title="The gate on Claude’s commits"
            description="Since 17 October, a Claude Code hook checks each commit Claude makes against the parts of the written standard a script can test."
          />
          <p className="max-w-2xl font-bold text-foreground">The commit is blocked if:</p>
          <ul className="mt-4 space-y-6 max-w-2xl">
            {BLOCKS.map((b, i) => (
              <li key={b.n} className={`border-l-2 pl-5 ${i === 0 ? "border-primary/60" : "border-border"}`}>
                <div className="font-mono text-xs text-muted-foreground mb-1">{b.n}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* So far */}
      <section className="section-padding pt-0" aria-labelledby="so-far">
        <div className="container-custom max-w-5xl mx-auto">
          <PlainHeading id="so-far" title="So far" description="Client build, in delivery." />
          <dl className="grid max-w-3xl grid-cols-[minmax(0,1fr)] gap-8 sm:grid-cols-3">
            {SO_FAR.map((s) => (
              <div key={s.label} className="flex flex-col-reverse border-t border-border pt-4">
                <dt className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.label}</dt>
                <dd className="m-0 font-display text-4xl font-bold tracking-tighter-2 text-foreground md:text-5xl">
                  {s.n}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Onward */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            <CaseLink to="/claude-code">How I build with Claude Code</CaseLink>
            <HomeLink href="/#b-review-system" label="See this build on the homepage: Fact-checked AI tool reviews">
              See this build on the homepage
            </HomeLink>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto">
          <div className="border border-border bg-card/40 p-8 md:p-12">
            <h2 className="font-display font-bold tracking-tight text-2xl md:text-3xl text-foreground">
              Want a check like this on your own work?
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed max-w-xl">
              Tell me what your pages or reports must get right. We can work out together which parts a script can
              check before anything goes out.
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
                <a href="/#claude-code">More Claude Code builds</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
);

export default CaseStudyFactCheckedReviews;
