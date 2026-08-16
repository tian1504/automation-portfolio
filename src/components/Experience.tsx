import { motion } from "motion/react";
import { SectionHeading } from "@/components/SectionHeading";

type Experience = {
  period: string;
  periodShort: string;
  title: string;
  company: string;
  bullets: string[];
  skills: string[];
};

const experiences: Experience[] = [
  {
    period: "Apr 2026 — Present",
    periodShort: "2026 — NOW",
    title: "AI DM Agent — Instagram → GoHighLevel Pipeline",
    company: "Freelance · AVA (Tamara)",
    bullets: [
      "Shipped the full agent: 24/7 Instagram DM automation that classifies inbound intent, handles objections, and generates context-aware replies with Claude.",
      "Implemented two-way Instagram Graph API integration handling verification handshake, inbound message events, and outbound automated replies.",
      "Routes confirmed bookings into GoHighLevel with contact deduplication, pipeline opportunity creation, and team alerts.",
      "Runs end to end without human input — escalates to a human only when the conversation actually needs one.",
    ],
    skills: ["n8n", "Claude", "Instagram Graph API", "GoHighLevel", "AI Agents", "Webhooks"],
  },
  {
    period: "2026",
    periodShort: "2026",
    title: "AI Member-Matching Engine — Airtable Logic Layer",
    company: "Freelance",
    bullets: [
      "Designed a multi-workflow matching system with Airtable as the structured logic layer — a configurable scoring and ranking engine over parsed member data.",
      "Validation gates enforce data quality before any match is made; personalized introduction emails are generated automatically.",
      "Hardened from prototype to stable production — resolved race conditions and rebuilt the field-mapping logic.",
    ],
    skills: ["n8n", "Airtable", "LLM Scoring", "Validation Gates"],
  },
  {
    period: "Nov 2025 — Present",
    periodShort: "2025 — NOW",
    title: "Automation Specialist — Amazon SP-API & Sourcing",
    company: "Freelance",
    bullets: [
      "Built automations against Amazon's Selling Partner API — LWA authentication, request throttling, pagination, and the asynchronous Reports API.",
      "Live sales and inventory dashboards with re-order alerts; inbound-shipment and order-status workflows synced to the inventory system.",
      "Two-stage LLM product-sourcing bot: strict brand / UPC / MPN / SKU matching plus SOP rules, with Apify supplier scraping and Keepa pricing — buy / no-buy verdicts delivered to Slack with sourced reasoning.",
      "Added logging and monitoring so failures are easy to track and debug in production.",
    ],
    skills: ["n8n", "Amazon SP-API", "Python", "OpenAI", "Apify", "Keepa"],
  },
  {
    period: "Sep 2025 — Nov 2025",
    periodShort: "2025",
    title: "Creative Intelligence — Social Media Scraping & UGC",
    company: "Sanlava (E-commerce & Social Brand)",
    bullets: [
      'Designed a "creative intelligence" workflow that scrapes ads, UGC, and reviews from TikTok, Instagram, Facebook, and Google.',
      "Structured data into Notion databases (Organic Posts, Ads, Reviews, Trends, Hook Bank) — single source of truth for creative ideas.",
      "Used OpenAI and Gemini to generate hooks, UGC briefs, and static ad prompts based on scraped data and custom scoring rules.",
      "Automated weekly runs, scoring, and QA so the marketing team gets fresh, ready-to-use creative insights without manual research.",
    ],
    skills: ["n8n", "Apify", "Notion", "OpenAI", "Gemini", "UGC"],
  },
  {
    period: "2012 — Jul 2026",
    periodShort: "2012 — 2026",
    title: "System Administrator — Windows & Azure Cloud Engineer",
    company: "Enterprise Infrastructure",
    bullets: [
      "Managed large fleets of Windows Server environments with strong focus on uptime, security updates, and compliance.",
      "Automated patching and reporting via PowerShell and Azure Update Manager — kept systems consistently up to date at scale.",
      "Troubleshot complex L3 issues across VMware, networking, storage, and backups in production environments.",
      "Worked with global teams to plan changes, communicate risks, and document runbooks for stable, repeatable operations.",
    ],
    skills: ["Windows Server", "Azure", "PowerShell", "VMware", "Patch Management"],
  },
];

export const Experience = () => {
  return (
    <section id="experience" className="section-padding">
      <div className="container-custom">
        <SectionHeading
          number="03"
          label="Experience"
          title="Where I've shipped."
          description="A decade-plus in enterprise systems, full-time on AI automation since July 2026 — every workflow I build has to survive production, not just look good in a demo."
        />

        <div className="max-w-5xl mx-auto">
          {experiences.map((exp, index) => (
            <motion.article
              key={exp.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className={`group grid grid-cols-1 md:grid-cols-[170px_1fr] gap-6 md:gap-10 py-10 ${
                index === 0 ? "border-t border-border" : ""
              } border-b border-border`}
            >
              {/* Year anchor — left column */}
              <div className="md:pt-1">
                <div className="font-mono text-xs text-primary tracking-[0.2em] uppercase">
                  {exp.periodShort}
                </div>
                <div className="hidden md:block mt-2 font-mono text-[11px] text-muted-foreground/60 tracking-wider">
                  {exp.period}
                </div>
              </div>

              {/* Content — right column */}
              <div>
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground leading-tight mb-1.5 group-hover:text-primary transition-colors">
                  {exp.title}
                </h3>
                <div className="text-sm text-muted-foreground mb-5 font-medium">
                  {exp.company}
                </div>

                <ul className="space-y-2.5 mb-6 text-sm md:text-base text-muted-foreground/95 leading-relaxed">
                  {exp.bullets.map((bullet, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-primary/60 mt-0.5 select-none flex-shrink-0" aria-hidden>—</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-x-3 gap-y-1.5 font-mono text-[11px] text-muted-foreground tracking-wide">
                  {exp.skills.map((skill, i) => (
                    <span key={skill} className="flex items-center gap-3">
                      <span className="text-foreground/70">{skill}</span>
                      {i < exp.skills.length - 1 && <span className="text-border" aria-hidden>·</span>}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
