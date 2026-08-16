import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  Clock,
  Download,
  KeyRound,
  LogIn,
  Send,
  Shuffle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";
import { ArchitectureDiagram } from "@/components/Builds";

const CALENDLY = "https://calendly.com/tian1504/30min";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6 },
} as const;

const STATS = [
  { n: "~45", label: "n8n workflows in one workspace" },
  { n: "8", label: "data types synced — orders, returns, financials, settlements, inventory, shipments, fees, catalog" },
  { n: "2", label: "marketplaces live (US + Canada), a third built and staged" },
];

const PIPELINE = [
  { icon: Clock, label: "Schedule / webhook trigger", sub: "daily and hourly syncs · on-demand tools" },
  { icon: KeyRound, label: "Shared LWA token sub-workflow", sub: "one place to rotate Amazon credentials" },
  { icon: LogIn, label: "IMS login", sub: "tenant-scoped bearer — data lands where it should" },
  { icon: Download, label: "Pull from SP-API", sub: "throttled · paginated · async reports polled" },
  { icon: Shuffle, label: "Reshape to the IMS contract", sub: "raw TSV reports become clean JSON" },
  { icon: Send, label: "POST /integrations/…", sub: "into the IMS · failures email immediately" },
];

const LESSONS = [
  {
    n: "01",
    title: "One token fetcher, everywhere",
    body:
      "Amazon access tokens last an hour. Instead of forty-five workflows each re-implementing OAuth, every one calls a single shared sub-workflow that does the LWA refresh-token exchange. When credentials rotate, they rotate in one place.",
  },
  {
    n: "02",
    title: "Reports that aren't ready when you ask",
    body:
      "Much of Amazon's data only comes from the asynchronous Reports API: request a report, get an ID, poll until it's done, then download and parse the raw TSV. That poll loop is factored once and reused, so every report-based sync behaves the same way.",
  },
  {
    n: "03",
    title: "The login decides where the data lands",
    body:
      "The client's IMS is multi-tenant, and the identity a workflow posts with decides which tenant receives the data. Data had historically landed in the wrong tenant through a shared support login. The fix was organizational as much as technical: a dedicated ingester identity, used by every sync, so the question can never come up again.",
  },
  {
    n: "04",
    title: "History is a workflow, not a script",
    body:
      "Loading the past is as important as syncing the present. One-shot backfill workflows exist for orders, returns, settlements, financial events, the inventory ledger, and FBA shipments — and the daily syncs have gap-fill twins that recover any missed window.",
  },
  {
    n: "05",
    title: "Failures email, silence doesn't",
    body:
      "Every sync routes failures through a shared error-handler that emails immediately with the workflow name and error. A quiet morning means the pipeline ran — not that nobody was looking.",
  },
  {
    n: "06",
    title: "Destructive operations stay gated",
    body:
      "Listing creation and deletion, label printing, and FBA inbound plan tools exist in the same workspace — deliberately gated for manual, on-demand use. A scheduled workflow should never be able to delete a listing on its own.",
  },
];

const CaseStudySpApi = () => (
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
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#4ade80" }} aria-hidden />
            Client build
          </span>
          <p className="mt-5 font-mono text-xs md:text-sm text-muted-foreground">
            Data integration for an Amazon FBA business · Amazon SP-API · n8n · US + Canada marketplaces
          </p>
          <h1 className="mt-4 font-display font-bold tracking-tighter-2 leading-[1.02] text-4xl md:text-5xl lg:text-6xl text-foreground">
            The SP-API Sync Engine<span className="text-primary">.</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-xl">
            Forty-five workflows that keep a seller's back office fed — orders, returns, settlements, inventory,
            and fees — without anyone pulling a report by hand.
          </p>
        </div>
      </section>

      {/* 01 Problem */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto">
          <SectionHeading
            number="01"
            label="The problem"
            title="The back office runs on data Amazon doesn't hand over."
            description="The client's inventory management system needs a continuous feed of everything Amazon knows — orders, returns, financial events, settlements, inventory, FBA shipments, fee estimates, catalog data — across two marketplaces. Amazon's Selling Partner API has all of it, but makes you earn it: hourly-expiring tokens, per-endpoint throttling, pagination, and reports that are generated asynchronously and fetched by polling. Pulling any of this by hand doesn't scale past day one."
          />
        </div>
      </section>

      {/* 02 Stats + the shape */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto">
          <SectionHeading
            number="02"
            label="What I built"
            title="One shape, repeated until it covers the business."
            description="Roughly forty-five n8n workflows in a single workspace: scheduled syncs that keep the IMS fed daily, on-demand webhook tools the team calls for product research and fee estimates, gated FBA and listing operations, one-shot backfills, and two shared sub-workflows everything else reuses."
          />
          <motion.div {...reveal} className="grid grid-cols-1 md:grid-cols-3 gap-px border border-border bg-border/60 mb-10">
            {STATS.map((stat) => (
              <div key={stat.n} className="bg-background p-6 md:p-8">
                <div className="font-display font-bold text-3xl md:text-4xl text-foreground">{stat.n}</div>
                <div className="mt-2 font-mono text-[11px] text-muted-foreground leading-relaxed tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
          <motion.div {...reveal} className="relative overflow-hidden border border-border bg-card/30 max-w-2xl">
            <ArchitectureDiagram
              steps={PIPELINE}
              caption="the shape every sync shares — learn one workflow, understand forty"
            />
          </motion.div>
        </div>
      </section>

      {/* 03 Engineering lessons */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto">
          <SectionHeading
            number="03"
            label="The engineering that matters"
            title="Six decisions that keep it boring."
            description="Boring is the goal. A sync engine earns its keep by never being interesting at 7am."
          />
          <div className="mt-2 space-y-6 max-w-2xl">
            {LESSONS.map((lesson, i) => (
              <motion.div
                key={lesson.n}
                {...reveal}
                className={`border-l-2 pl-5 ${i === 0 ? "border-primary/60" : "border-border"}`}
              >
                <div className="font-mono text-xs text-muted-foreground mb-1">{lesson.n}</div>
                <div className="font-bold text-foreground">{lesson.title}</div>
                <div className="text-sm text-muted-foreground leading-relaxed mt-1">{lesson.body}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 04 The handover */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto">
          <SectionHeading
            number="04"
            label="The handover"
            title="A system you can hand over is a system you actually own."
            description="The engine ships with a sixteen-section engineering handover: the architecture as a mental model, a per-workflow reference, an endpoint reference, an operations runbook, a known-issues register that states open risks plainly, and a first-week checklist for the next engineer. If it only runs while I'm holding it, it isn't finished."
          />
        </div>
      </section>

      {/* 05 Outcome */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto">
          <SectionHeading
            number="05"
            label="Outcome"
            title="The IMS stays fed. Nobody pulls reports."
            description="Orders, returns, financial events, settlements, inventory, shipments, and fees land in the IMS daily across both marketplaces, in the right tenant, with history backfilled. When something fails, the team knows by email before anyone notices a gap. The next marketplace — Walmart — is already built and staged against the same pattern."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto">
          <div className="border border-border bg-card/40 p-8 md:p-12">
            <h2 className="font-display font-bold tracking-tight text-2xl md:text-3xl text-foreground">
              Still exporting Seller Central reports by hand?
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed max-w-xl">
              Tell me which reports your team pulls every week. I'll tell you what a sync engine for your
              operation would look like — and what it wouldn't touch.
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

export default CaseStudySpApi;
