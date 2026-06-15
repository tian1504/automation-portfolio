import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { OutboundDashboardMock } from "@/components/saas/OutboundDashboardMock";
import { AuditTeaserAnimated } from "@/components/AuditTeaserAnimated";
import deductiveImg from "@/assets/work/deductive-engine.webp";

type Kind = "image" | "audit-teaser" | "mock-outbound";
type Build = {
  kind: Kind;
  image?: string;
  categoryLabel: string;
  dotColor: string; // category dot in the visual badge
  title: string;
  description: string;
  outcomeLabel: string;
  outcome: string;
  tools: string[];
  tag: string;
  tagDot: "green" | "yellow" | "neutral";
  to?: string;
};

const BUILDS: Build[] = [
  {
    kind: "image",
    image: deductiveImg,
    categoryLabel: "AI SaaS",
    dotColor: "#4ade80",
    title: "DeductiveLabs — AI IT-Troubleshooting Engine",
    description:
      "A React + Gemini + n8n + Supabase “deductive engine” for IT support — a chat-based, step-by-step diagnosis flow behind an intelligence dashboard that tracks sessions, confidence, knowledge-base coverage, and skill gaps, with automated email digests.",
    outcomeLabel: "Outcome",
    outcome:
      "Turns a senior engineer's diagnostic playbook into a self-serve system — a structured report on every ticket, plus analytics on where the team's knowledge gaps are.",
    tools: ["React", "Gemini", "n8n", "Supabase"],
    tag: "Client build",
    tagDot: "green",
  },
  {
    kind: "audit-teaser",
    categoryLabel: "Lead-Gen Funnel",
    dotColor: "hsl(45 93% 54%)",
    title: "AI Automation Audit — Live Funnel",
    description:
      "A 5-question quiz that returns a personalized automation plan — what to automate, the hours and dollars it could reclaim, and where to start. The plan is generated client-side by a rules engine, wireable to my real n8n + an LLM.",
    outcomeLabel: "Try it",
    outcome: "Get your own automation plan in ~60 seconds — no signup to see it.",
    tools: ["React", "Rules engine", "n8n (LLM-ready)"],
    tag: "Concept · Live demo",
    tagDot: "yellow",
    to: "/audit",
  },
  {
    kind: "mock-outbound",
    categoryLabel: "Outbound SaaS",
    dotColor: "#60a5fa",
    title: "AI Outbound Engine",
    description:
      "A concept that extends the Apollo Lead Scraper in my Work above: a designed product — lead list with ICP-fit scores, enrichment chips, AI-written icebreakers, reply pills — plus the full n8n architecture behind it.",
    outcomeLabel: "Projected",
    outcome:
      "200+ enriched, personalized leads/week unattended (real Apollo metric); ~15 hrs/week of SDR research removed (modeled).",
    tools: ["n8n", "Apollo.io", "OpenAI", "CRM"],
    tag: "Concept build",
    tagDot: "neutral",
    to: "/case-study/outbound-engine",
  },
];

const tagDotColor = (d: Build["tagDot"]) =>
  d === "green" ? "#4ade80" : d === "yellow" ? "hsl(45 93% 54%)" : "hsl(35 8% 55%)";

function Visual({ build }: { build: Build }) {
  return (
    <div className="relative overflow-hidden border border-border bg-card/30 aspect-[16/10]">
      {build.kind === "image" && (
        <>
          <img
            src={build.image}
            alt={build.title}
            loading="lazy"
            className="w-full h-full object-contain p-3 brightness-[0.94] saturate-[0.97] transition-transform duration-700 ease-out group-hover/img:scale-[1.02]"
          />
          {/* Tone the light product UI into the dark section; lifts on hover */}
          <div className="absolute inset-0 bg-background/20 group-hover/img:bg-background/0 transition-colors duration-500 pointer-events-none" />
        </>
      )}

      {build.kind === "mock-outbound" && (
        <div className="absolute inset-0">
          <OutboundDashboardMock className="!border-0 !rounded-none !shadow-none" />
        </div>
      )}

      {build.kind === "audit-teaser" && <AuditTeaserAnimated />}

      {/* Vignette (only over real-image screenshots, for legibility) */}
      {build.kind === "image" && (
        <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent pointer-events-none" />
      )}
    </div>
  );
}

export const Builds = () => {
  return (
    <section id="builds" className="section-padding relative overflow-hidden">
      <div className="container-custom relative z-10">
        <SectionHeading
          number="05"
          label="Funnels & SaaS"
          title="Products & concepts."
          description="Lead-gen funnels and product builds — one shipped client SaaS, one live interactive demo you can try, and one concept that extends my real outbound work. Concept builds are labeled as such."
        />

        <div className="max-w-6xl mx-auto">
          {BUILDS.map((build, index) => {
            const isReversed = index % 2 === 1;
            const visual = build.to ? (
              <Link to={build.to} className="block group/img relative" aria-label={build.title}>
                <Visual build={build} />
              </Link>
            ) : (
              <div className="group/img relative">
                <Visual build={build} />
              </div>
            );

            return (
              <motion.article
                key={build.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
                  index === 0 ? "pt-2" : "pt-16 lg:pt-24"
                } ${index < BUILDS.length - 1 ? "pb-16 lg:pb-24 border-b border-border/60" : ""}`}
              >
                <div className={`lg:col-span-7 ${isReversed ? "lg:order-2" : "lg:order-1"}`}>{visual}</div>

                <div className={`lg:col-span-5 ${isReversed ? "lg:order-1 lg:pr-4" : "lg:order-2 lg:pl-4"}`}>
                  {/* Tag + index */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-border bg-card/40 text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: tagDotColor(build.tagDot) }} aria-hidden />
                        {build.tag}
                      </span>
                      <span className="font-mono text-xs text-primary tracking-[0.25em] uppercase">
                        {String(index + 1).padStart(2, "0")} / {BUILDS.length.toString().padStart(2, "0")}
                      </span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground/40" aria-hidden />
                  </div>

                  <h3 className="text-2xl md:text-3xl lg:text-[2rem] font-bold tracking-tight text-foreground leading-[1.1] mb-5">
                    {build.title}
                  </h3>

                  <p className="text-base text-muted-foreground leading-relaxed mb-5">{build.description}</p>

                  {/* Outcome */}
                  <div className="border-l-2 border-primary/60 pl-4 py-1 mb-6">
                    <div className="font-mono text-[10px] text-primary/80 tracking-[0.25em] uppercase mb-1">
                      {build.outcomeLabel}
                    </div>
                    <div className="text-sm text-foreground/85 leading-relaxed">{build.outcome}</div>
                  </div>

                  {/* The audit item owns the section's single yellow CTA */}
                  {build.kind === "audit-teaser" && (
                    <Button asChild className="mb-6 group">
                      <Link to="/audit">
                        Take the 60-second audit
                        <ArrowUpRight className="ml-2 h-4 w-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </Button>
                  )}

                  {/* Tools */}
                  <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] text-muted-foreground tracking-wide">
                    {build.tools.map((tool, i) => (
                      <span key={tool} className="flex items-center gap-3">
                        <span className="text-foreground/70">{tool}</span>
                        {i < build.tools.length - 1 && <span className="text-border" aria-hidden>·</span>}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
