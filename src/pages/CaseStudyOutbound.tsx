import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";
import { OutboundDashboardMock } from "@/components/saas/OutboundDashboardMock";
import { OutboundNodeCanvas } from "@/components/saas/OutboundNodeCanvas";

const CALENDLY = "https://calendly.com/tian1504/30min";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6 },
} as const;

const STEPS = [
  { n: "01", title: "Filter", detail: "Define the ICP once — title, headcount, industry, buying signals — and the engine only ever works leads that fit." },
  { n: "02", title: "Scrape", detail: "Pull matching contacts from Apollo on a schedule. No more manual list-building." },
  { n: "03", title: "Enrich", detail: "Layer on public signals — recent launches, role changes, tech stack — so every lead carries context." },
  { n: "04", title: "Write", detail: "An LLM drafts a first line that references a real signal, in your voice. Not “Hi {{firstName}}”." },
  { n: "05", title: "Send", detail: "Queue through your sending tool with throttling and guardrails so your domains stay healthy." },
  { n: "06", title: "Triage", detail: "Every reply is classified — interested, not now, or auto-handle — and the CRM updates itself." },
];

const OUTCOMES = [
  { label: "Real — Apollo build", text: "200+ enriched, personalized leads per week, unattended." },
  { label: "Modeled", text: "~15 hrs/week of SDR research time removed." },
  { label: "By design", text: "Every reply triaged and the CRM updated automatically." },
];

const CaseStudyOutbound = () => (
  <div className="min-h-screen flex flex-col">
    {/* Minimal top bar */}
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="container-custom h-14 flex items-center justify-between">
        <Link to="/" className="font-display font-bold tracking-tight text-base text-foreground">
          Eleazar<span className="text-primary">.</span>
        </Link>
        <a href="/#builds" className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors rounded-sm px-1 py-1 -mx-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
          ← Back to work
        </a>
      </div>
    </header>

    <main className="flex-1">
      {/* Hero */}
      <section className="section-padding pt-16 md:pt-20">
        <div className="container-custom max-w-5xl mx-auto">
          <span className="inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground border border-border rounded-sm px-2 py-1">
            Concept build
          </span>
          <p className="mt-5 font-mono text-xs md:text-sm text-muted-foreground">
            A working concept that extends my real Apollo lead-scraper build — shown as product design and
            architecture, not a live app. · n8n + OpenAI + CRM
          </p>
          <h1 className="mt-4 font-display font-bold tracking-tighter-2 leading-[1.02] text-4xl md:text-5xl lg:text-6xl text-foreground">
            The AI Outbound Engine<span className="text-primary">.</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-xl">
            ICP in. Enriched, personalized, sent, and reply-triaged out. The rep only ever touches a warm reply.
          </p>
          <motion.div {...reveal} className="mt-10">
            <OutboundDashboardMock />
          </motion.div>
        </div>
      </section>

      {/* 01 Problem */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto">
          <SectionHeading number="01" label="The problem" title="Personalization doesn't scale — so outbound rots." description="Real personalization works, but it costs minutes per lead. The moment volume goes up, reps drop the research and fall back on “Hi {{firstName}}” — and reply rates crater." />
        </div>
      </section>

      {/* 02 Approach */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto">
          <SectionHeading number="02" label="The approach" title="Treat outbound as one pipeline, not five tools." description="Instead of a rep stitching together a scraper, an enrichment tool, a doc of templates, a sender, and a CRM by hand, the whole thing runs as a single n8n pipeline with an LLM doing the writing — and a human only in the loop where it matters." />
        </div>
      </section>

      {/* 03 How it works */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto">
          <SectionHeading number="03" label="How it works" title="ICP in, warm replies out." description="Six moves, fully wired. The same node vocabulary I build for clients in n8n." />
          <motion.div {...reveal}>
            <OutboundNodeCanvas />
          </motion.div>
          <div className="mt-12 space-y-5 max-w-2xl">
            {STEPS.map((s, i) => (
              <motion.div key={s.n} {...reveal} className={`border-l-2 pl-5 ${i === 0 ? "border-primary/60" : "border-border"}`}>
                <div className="font-mono text-xs text-muted-foreground mb-1">{s.n}</div>
                <div className="font-bold text-foreground">{s.title}</div>
                <div className="text-sm text-muted-foreground leading-relaxed mt-1">{s.detail}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 04 What it produces */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto">
          <SectionHeading number="04" label="What it produces" title="Projected impact, anchored to a real number." description="The lead volume is the real metric from the Apollo build it extends; the time saved is modeled honestly from it." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {OUTCOMES.map((o) => (
              <motion.div key={o.text} {...reveal} className="border-l-2 border-primary/60 pl-4 py-1">
                <div className="font-mono text-[10px] text-primary/80 tracking-[0.2em] uppercase mb-2">{o.label}</div>
                <div className="text-sm text-foreground/85 leading-relaxed">{o.text}</div>
              </motion.div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div {...reveal} className="rounded-xl border border-border bg-card/30 p-6">
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-3">The manual way</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A rep builds a list, researches each prospect, writes each message by hand, sends, then logs
                replies in the CRM. ~6 minutes a lead — and personalization is the first thing dropped under volume.
              </p>
            </motion.div>
            <motion.div {...reveal} className="rounded-xl border border-primary/30 bg-card/40 p-6">
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary mb-3">The engine</div>
              <p className="text-sm text-foreground/85 leading-relaxed">
                The pipeline runs unattended. Leads arrive scored, enriched, and message-ready; replies sort
                themselves. The rep spends their time only on people who already raised a hand.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto border-t border-border pt-12">
          <h2 className="font-display font-bold tracking-tighter-2 text-3xl md:text-4xl text-foreground">
            Want this built on your stack?
          </h2>
          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <Button asChild size="lg" className="h-12 px-6">
              <a href={CALENDLY} target="_blank" rel="noopener noreferrer">Book a call to build this</a>
            </Button>
            <a href="/#portfolio" className="group inline-flex items-center gap-1.5 font-medium text-sm text-muted-foreground hover:text-foreground transition-colors">
              See the real Apollo workflow it's built on
              <ArrowUpRight className="h-4 w-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </section>
    </main>
  </div>
);

export default CaseStudyOutbound;
