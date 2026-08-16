import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  BellRing,
  Database,
  LayoutDashboard,
  ShoppingCart,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";
import { ArchitectureDiagram } from "@/components/Builds";
import dashboardImg from "@/assets/work/seller-dashboard-redacted.png";

const CALENDLY = "https://calendly.com/tian1504/30min";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6 },
} as const;

const PIPELINE = [
  { icon: ShoppingCart, label: "Amazon SP-API", sub: "orders · inventory · finances · pricing" },
  { icon: Workflow, label: "n8n scheduled jobs", sub: "refresh one snapshot on an interval" },
  { icon: Database, label: "Supabase (Postgres)", sub: "a single snapshot row · read-only to the browser" },
  { icon: LayoutDashboard, label: "React dashboard", sub: "Recharts · published on Netlify" },
  { icon: BellRing, label: "Morning briefing & alerts", sub: "what needs doing, worst first" },
];

const DECISIONS = [
  {
    n: "01",
    title: "A snapshot, not a query engine",
    body:
      "n8n writes one JSON snapshot to Supabase on a schedule; the dashboard reads a single row. If Supabase is ever unreachable, the app falls back to a bundled copy of the same shape — so the dashboard can never fail to load on the morning the client needs it.",
  },
  {
    n: "02",
    title: "Read-only by construction",
    body:
      "The browser holds only a publishable key gated by row-level security. The dashboard can read the snapshot and nothing else — there is no write path from the client's screen to his data.",
  },
  {
    n: "03",
    title: "Fresh stock on demand, safely",
    body:
      "A “Refresh” button calls a Supabase Edge Function that pulls current stock from Amazon right now. The Amazon credentials live server-side only, and the function patches inventory quantities alone — it cannot touch the sales history.",
  },
  {
    n: "04",
    title: "Season-first, not report-first",
    body:
      "This is a seasonal business with an October peak, so the dashboard's real job is ordering ahead: it compares this year's plan against last year's actuals, computes what to order per product, and generates a pre-season purchase order. A real PO has already gone out through it.",
  },
  {
    n: "05",
    title: "Feedback arrives as video, and gets treated as spec",
    body:
      "The client reviews by recording screen-share walkthroughs. Each one is transcribed with timestamps and paired with a frame of exactly what he pointed at — so “this number here” never gets misread, and every iteration traces back to his own words.",
  },
];

const CaseStudySellerDashboard = () => (
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
            For a US outdoor-products brand on Amazon · SP-API · n8n · Supabase · React · Netlify
          </p>
          <h1 className="mt-4 font-display font-bold tracking-tighter-2 leading-[1.02] text-4xl md:text-5xl lg:text-6xl text-foreground">
            The Seller Dashboard<span className="text-primary">.</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-xl">
            One screen that tells an Amazon seller what needs doing this morning — and what to ship before the
            season peak, not after it.
          </p>
          <motion.figure {...reveal} className="mt-10">
            <div className="relative overflow-hidden border border-border bg-card/30">
              <img
                src={dashboardImg}
                alt="The seller dashboard: a morning briefing panel beside out-of-stock, shipping, and stranded-stock lists"
                className="w-full h-auto block"
                loading="eager"
              />
            </div>
            <figcaption className="mt-3 font-mono text-[10px] text-muted-foreground tracking-wide">
              the live dashboard — brand, product names, and figures blurred for client confidentiality
            </figcaption>
          </motion.figure>
        </div>
      </section>

      {/* 01 Problem */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto">
          <SectionHeading
            number="01"
            label="The problem"
            title="Seller Central knows everything and tells you nothing first."
            description="The client's numbers lived in Seller Central: orders in one report, inventory in another, fees in a third. Nothing said which product was out of stock and still selling, or what had to ship this week to survive an October peak that must be ordered for months in advance. Every answer was a manual dig."
          />
        </div>
      </section>

      {/* 02 What I built */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto">
          <SectionHeading
            number="02"
            label="What I built"
            title="A morning briefing, then the season."
            description="The dashboard opens on TODAY — what needs doing, worst first: products out of stock and still selling with the dollars at risk per day, what needs shipping to Amazon and by when, stock Amazon is holding but not selling, and shipments on the way. Below it: season planning against last year's actuals, a pre-season purchase-order generator, store pulse with daily revenue, and a profit view built from Amazon's real financial records — fees charged, not estimated."
          />
          <motion.div {...reveal} className="relative overflow-hidden border border-border bg-card/30 max-w-2xl">
            <ArchitectureDiagram
              steps={PIPELINE}
              caption="dashboard architecture — scheduled SP-API pulls to one snapshot, one screen"
            />
          </motion.div>
        </div>
      </section>

      {/* 03 Decisions */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto">
          <SectionHeading
            number="03"
            label="The engineering that matters"
            title="Five decisions behind one calm screen."
            description=""
          />
          <div className="space-y-6 max-w-2xl">
            {DECISIONS.map((d, i) => (
              <motion.div
                key={d.n}
                {...reveal}
                className={`border-l-2 pl-5 ${i === 0 ? "border-primary/60" : "border-border"}`}
              >
                <div className="font-mono text-xs text-muted-foreground mb-1">{d.n}</div>
                <div className="font-bold text-foreground">{d.title}</div>
                <div className="text-sm text-muted-foreground leading-relaxed mt-1">{d.body}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 04 Outcome */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto">
          <SectionHeading
            number="04"
            label="Outcome"
            title="The morning check takes one screen."
            description="In delivery and iterating with the client: the daily briefing replaces the manual dig through Seller Central, re-order alerts fire before stock runs out, and the first pre-season purchase order has already gone to the manufacturer through the dashboard's own generator. The build continues from the client's recorded walkthroughs — his words, timestamped, driving each release."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto">
          <div className="border border-border bg-card/40 p-8 md:p-12">
            <h2 className="font-display font-bold tracking-tight text-2xl md:text-3xl text-foreground">
              What does your morning check look like?
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed max-w-xl">
              If it involves five Seller Central tabs and a spreadsheet, tell me what you look for. I'll show you
              what one screen of it could look like.
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

export default CaseStudySellerDashboard;
