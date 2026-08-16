import { ArrowUpRight, ArrowDown } from "lucide-react";
import { motion } from "motion/react";
import { SectionHeading } from "@/components/SectionHeading";
import deductiveImg from "@/assets/work/deductive-engine.webp";
import spapiImg from "@/assets/work/amazon-spapi-architecture.png";

type Kind = "image" | "diagram";
type Build = {
  kind: Kind;
  image?: string;
  diagram?: { steps: string[]; caption: string };
  categoryLabel: string;
  dotColor: string; // category dot in the visual badge
  title: string;
  description: string;
  outcomeLabel: string;
  outcome: string;
  tools: string[];
  tag: string;
  tagDot: "green" | "yellow" | "neutral";
};

const BUILDS: Build[] = [
  {
    kind: "image",
    image: spapiImg,
    categoryLabel: "Amazon SP-API",
    dotColor: "hsl(45 93% 54%)",
    title: "Amazon SP-API Sync Engine",
    description:
      "A fleet of n8n workflows against Amazon's Selling Partner API — order sync for the US and Canada marketplaces with gap-fill recovery, inventory sync, financial events, and returns reports — feeding the client's inventory management system. Handles LWA authentication, request throttling, pagination, and the asynchronous Reports API.",
    outcomeLabel: "Outcome",
    outcome:
      "Seller Central operations run hands-off — every order, return, and financial event lands in the IMS without a manual pull.",
    tools: ["n8n", "Amazon SP-API", "Reports API", "Webhooks"],
    tag: "Client build",
    tagDot: "green",
  },
  {
    kind: "diagram",
    diagram: {
      steps: ["Amazon SP-API", "n8n scheduled jobs", "Supabase (Postgres)", "Web dashboard", "Email / Slack re-order alerts"],
      caption: "seller-dashboard architecture — scheduled SP-API pulls to a live screen",
    },
    categoryLabel: "Seller Dashboard",
    dotColor: "#4ade80",
    title: "Amazon Seller Dashboard — Sales & Re-order Alerts",
    description:
      "A sales, inventory, and re-order dashboard for a US fragrance brand selling on Amazon. n8n pulls orders, inventory, finances, and pricing from SP-API on a schedule into Supabase; a custom web dashboard reads from it, with automated email and Slack alerts before stock runs out.",
    outcomeLabel: "Outcome",
    outcome:
      "Replaces manual Seller Central checks with one live screen — and a re-order alert before stock runs out, not after.",
    tools: ["Amazon SP-API", "n8n", "Supabase", "Netlify", "Slack"],
    tag: "Client build · In delivery",
    tagDot: "yellow",
  },
  {
    kind: "diagram",
    diagram: {
      steps: ["AbeBooks · Biblio · Alibris", "Scraper engine (live listing reads)", "Margin math — price, condition, postage, Amazon fees", "Daily buy list (CSV + run log)"],
      caption: "book-sourcing engine — every margin computed from what the listing says today",
    },
    categoryLabel: "FBA Sourcing",
    dotColor: "#60a5fa",
    title: "Used-Book FBA Sourcing Engine",
    description:
      "A sourcing engine for a used-book Amazon FBA seller: scrapes AbeBooks, Biblio, and Alibris, opens every listing at run time for the live price, condition, and seller location, prices in postage and Amazon fees, and produces a daily buy list with a plain-text run log.",
    outcomeLabel: "Outcome",
    outcome:
      "Buy decisions come from live listing data, not a stale index — and every sourcing failure mode the client caught by hand is now guarded by an automated check.",
    tools: ["Node.js", "Web scraping", "Amazon FBA"],
    tag: "Client build · In delivery",
    tagDot: "yellow",
  },
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
];

const tagDotColor = (d: Build["tagDot"]) =>
  d === "green" ? "#4ade80" : d === "yellow" ? "hsl(45 93% 54%)" : "hsl(35 8% 55%)";

function ArchitectureDiagram({ steps, caption }: { steps: string[]; caption: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 py-5">
      <div className="flex flex-col items-center gap-0 w-full max-w-[420px]">
        {steps.map((step, i) => (
          <div key={step} className="flex flex-col items-center w-full">
            <div className="w-full border border-border bg-background/60 px-4 py-2.5 text-center">
              <span className="font-mono text-[11px] md:text-xs text-foreground/85 tracking-wide">{step}</span>
            </div>
            {i < steps.length - 1 && (
              <ArrowDown className="h-4 w-4 my-1 text-primary/70" aria-hidden />
            )}
          </div>
        ))}
      </div>
      <div className="absolute bottom-3 left-4 right-4 font-mono text-[10px] text-muted-foreground/70 tracking-wide truncate">
        {caption}
      </div>
    </div>
  );
}

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
          {/* Vignette (only over real-image screenshots, for legibility) */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent pointer-events-none" />
        </>
      )}

      {build.kind === "diagram" && build.diagram && (
        <ArchitectureDiagram steps={build.diagram.steps} caption={build.diagram.caption} />
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
          label="Amazon & Product Builds"
          title="Amazon systems, shipped."
          description="Amazon SP-API is the specialty I go deepest on — sync engines, seller dashboards, and sourcing automation for FBA businesses — plus one full-stack SaaS build. Everything here is real client work; diagrams show the actual architecture."
        />

        <div className="max-w-6xl mx-auto">
          {BUILDS.map((build, index) => {
            const isReversed = index % 2 === 1;
            const visual = (
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
