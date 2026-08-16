import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";

const CALENDLY = "https://calendly.com/tian1504/30min";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6 },
} as const;

const FUNNEL = [
  { n: "~2,000", label: "listings scanned each morning" },
  { n: "~700", label: "distinct books that pass the buying rules" },
  { n: "6–8", label: "books that fit the $200 daily budget" },
];

const BUGS = [
  {
    n: "01",
    title: "“0.00” means “no forecast”",
    body:
      "The research tool writes 0.00 when it has no forecast for a book. Read as a real zero, that made a book look like a guaranteed loss — and it was silently dropping 44 of 150 books before anyone saw them.",
  },
  {
    n: "02",
    title: "Two fees, exactly $0.99 apart",
    body:
      "Two of the vendor's endpoints return a fee for the same book that differ by exactly $0.99. Using the wrong pairing overstated profit by 36 percent.",
  },
  {
    n: "03",
    title: "The cookie that moved postage $29",
    body:
      "A cookie flag decided whether the shop quoted postage to the buyer's real destination or guessed from the server's IP. Set wrong, it quoted $33.00 on a book that costs $3.75 to post domestically.",
  },
  {
    n: "04",
    title: "Two definitions of what a book costs",
    body:
      "Postage was inside the profit calculation but not inside the code that spent the budget — so the tool overspent by the postage and picked the cheapest sticker price instead of the cheapest landed cost. The fix: one function is the single definition of what a book costs, and every path that touches money routes through it.",
  },
  {
    n: "05",
    title: "The config that only looked current",
    body:
      "The delivery postcode lived in an env file the server read once at startup. Changing the file wasn't enough: a running server kept the old value and quoted the wrong city for an entire run while looking completely correct on screen. Every run now records which postcode it used — and says so on screen.",
  },
];

const CHECKS = [
  "Postage is inside the money, on every path that spends it.",
  "The fee constants have not silently drifted.",
  "The spreadsheet export still carries the byte order mark Excel needs.",
  "A row that could not be verified is dropped, not shown.",
];

const CaseStudyBookSourcing = () => (
  <div className="min-h-screen flex flex-col">
    {/* Minimal top bar */}
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="container-custom h-14 flex items-center justify-between">
        <Link to="/" className="font-display font-bold tracking-tight text-base text-foreground">
          Eleazar<span className="text-primary">.</span>
        </Link>
        <a
          href="/#builds"
          className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors rounded-sm px-1 py-1 -mx-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          ← Back to work
        </a>
      </div>
    </header>

    <main className="flex-1">
      {/* Hero */}
      <section className="section-padding pt-16 md:pt-20">
        <div className="container-custom max-w-5xl mx-auto">
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground border border-border rounded-sm px-2 py-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "hsl(45 93% 54%)" }} aria-hidden />
            Client build · In delivery
          </span>
          <p className="mt-5 font-mono text-xs md:text-sm text-muted-foreground">
            A sourcing engine for a book arbitrage seller · Node + Express · vanilla JS · Chrome DevTools Protocol
          </p>
          <h1 className="mt-4 font-display font-bold tracking-tighter-2 leading-[1.02] text-4xl md:text-5xl lg:text-6xl text-foreground">
            The Book Sourcing Engine<span className="text-primary">.</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-xl">
            Two thousand listings in, seven verified books out — every margin computed from what the listing
            actually says today, not what an index said last week.
          </p>
        </div>
      </section>

      {/* 01 Problem */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto">
          <SectionHeading
            number="01"
            label="The problem"
            title="An indexed price, and nothing else."
            description="The client buys used books cheap and resells them on Amazon FBA. He was choosing books by hand from a paid research tool that gave him an indexed price and nothing more — so he was buying copies that had already sold, copies in unsellable condition, and copies from overseas sellers whose postage ate the entire margin. He found all of this himself, checking one list by hand."
          />
        </div>
      </section>

      {/* 02 What I built */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto">
          <SectionHeading
            number="02"
            label="What I built"
            title="A sourcing engine and a morning control panel."
            description="Node and Express on the back; plain HTML, CSS, and vanilla JavaScript on the front. No framework, no build step, no bundler, no database — JSON files on disk are the store. Four dependencies across both halves. About 7,700 lines."
          />
          <motion.div {...reveal} className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-px border border-border bg-border/60">
            {FUNNEL.map((step, i) => (
              <div key={step.n} className="bg-background p-6 md:p-8 relative">
                <div className="font-display font-bold text-3xl md:text-4xl text-foreground">
                  {step.n}
                </div>
                <div className="mt-2 font-mono text-[11px] text-muted-foreground leading-relaxed tracking-wide">
                  {step.label}
                </div>
                {i < FUNNEL.length - 1 && (
                  <ArrowRight className="hidden md:block absolute right-[-9px] top-1/2 -translate-y-1/2 h-4 w-4 text-primary z-10" aria-hidden />
                )}
              </div>
            ))}
          </motion.div>
          <p className="mt-6 text-muted-foreground leading-relaxed max-w-2xl">
            The narrowing is the product. Each surviving book is opened on the shop that actually sells it, and
            the last stage — real Amazon fees, per book — is what cuts seven hundred candidates down to single
            figures.
          </p>
        </div>
      </section>

      {/* 03 Scraping */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto">
          <SectionHeading
            number="03"
            label="The scraping"
            title="Four shops, read politely."
            description="One shop serves plain HTML, so a fetch is enough. Three sit behind bot protection, so those go through a real browser driven over the Chrome DevTools Protocol with a throwaway profile. Nothing defeats a challenge: the engine waits for the ones that clear on their own, and reports the ones that do not."
          />
        </div>
      </section>

      {/* 04 The silent bugs */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto">
          <SectionHeading
            number="04"
            label="The engineering that matters"
            title="Five bugs that never threw an error."
            description="Every one of these produced confident, wrong numbers. Finding them is most of what the client paid for."
          />
          <div className="mt-2 space-y-6 max-w-2xl">
            {BUGS.map((bug, i) => (
              <motion.div
                key={bug.n}
                {...reveal}
                className={`border-l-2 pl-5 ${i === 0 ? "border-primary/60" : "border-border"}`}
              >
                <div className="font-mono text-xs text-muted-foreground mb-1">{bug.n}</div>
                <div className="font-bold text-foreground">{bug.title}</div>
                <div className="text-sm text-muted-foreground leading-relaxed mt-1">{bug.body}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 05 Verification */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto">
          <SectionHeading
            number="05"
            label="Verification"
            title="230 checks before any change ships."
            description="The checks pin behaviour, not implementation. A few of them:"
          />
          <ul className="mt-2 space-y-3 max-w-2xl">
            {CHECKS.map((check) => (
              <li key={check} className="flex items-start gap-3">
                <span className="font-mono text-primary text-sm mt-0.5 flex-shrink-0">→</span>
                <span className="text-sm md:text-base text-muted-foreground leading-relaxed">{check}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-muted-foreground leading-relaxed max-w-2xl">
            One gate fails on purpose until changes to the scraping engine are committed deliberately — so the
            engine can never be edited casually.
          </p>
        </div>
      </section>

      {/* 06 The interface */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto">
          <SectionHeading
            number="06"
            label="The interface"
            title="An antiquarian bindery, not a dashboard."
            description="One non-technical person reads this once each morning. The visual identity is bottle-green leather, gold tooling, and aged paper — because it is a book business. After the theme change, every text-and-background pair was measured for WCAG AA contrast; the lowest ratio on the page is 4.67:1."
          />
          <p className="mt-2 text-muted-foreground leading-relaxed max-w-2xl">
            Each row shows the profit subtraction written out in full, so the client can check the arithmetic
            himself; the condition and the town the copy ships from; and the sales rank expressed as a rough
            waiting time rather than a raw number.
          </p>
        </div>
      </section>

      {/* 07 What I deliberately did not do */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto">
          <SectionHeading
            number="07"
            label="Judgement calls"
            title="What I deliberately did not build."
            description=""
          />
          <div className="space-y-6 max-w-2xl">
            <div className="border-l-2 border-border pl-5">
              <div className="font-bold text-foreground">The 25-percent rule</div>
              <div className="text-sm text-muted-foreground leading-relaxed mt-1">
                The client asked for a "buy at 25 percent of the Amazon price" rule. That number appears nowhere
                in his vendor's published training — it was his own invention. I built it, switched it off, and
                replaced it with a rule that a book must cost less than its own average price over six months:
                a price compared to what that book normally goes for, not to an arbitrary percentage.
              </div>
            </div>
            <div className="border-l-2 border-border pl-5">
              <div className="font-bold text-foreground">Automated Amazon sign-in</div>
              <div className="text-sm text-muted-foreground leading-relaxed mt-1">
                Signing into his Amazon account automatically would have bought slightly better data. It would
                also have put the account his business depends on through automated foreign sign-ins. I declined —
                the marginal gain is not worth the account.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 08 Outcome */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto">
          <SectionHeading
            number="08"
            label="Outcome"
            title="Seven books, to the cent."
            description="Every figure on a saved list recomputes to the cent from the engine's own functions. A typical morning: 7 books, $196.98 of a $200 budget, $67.78 of estimated profit — every copy verified live before it reached the screen."
          />
          <p className="mt-2 text-muted-foreground leading-relaxed max-w-2xl">
            Stated plainly: no book has sold through yet, so the profit figures are estimates and are described
            that way. What the engine has already removed are the silent losses — the sold copies, the unsellable
            conditions, the overseas postage — that used to be discovered by hand, after the money was spent.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto">
          <div className="border border-border bg-card/40 p-8 md:p-12">
            <h2 className="font-display font-bold tracking-tight text-2xl md:text-3xl text-foreground">
              Running an Amazon operation on hand-checking?
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed max-w-xl">
              Tell me what you verify by hand every morning. I'll tell you which parts a system can verify for
              you — and which parts it honestly can't.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild className="group">
                <a href={CALENDLY} target="_blank" rel="noopener noreferrer">
                  Book a 30-min call
                  <ArrowUpRight className="ml-2 h-4 w-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </Button>
              <Button asChild variant="ghost">
                <a href="/#builds">See more builds</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
);

export default CaseStudyBookSourcing;
