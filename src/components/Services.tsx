import { motion } from "motion/react";
import { SectionHeadingMin } from "@/components/SectionHeadingMin";

const services = [
  {
    title: "AI Customer Agents",
    description:
      "Replace tier-1 support with a Claude agent that knows your knowledge base, drafts responses, and escalates only when a human is actually needed.",
  },
  {
    title: "n8n & Make Workflows",
    description:
      "Connect your CRM, Slack, email, and spreadsheets so data moves automatically. The recurring busywork — gone, monitored, documented.",
  },
  {
    title: "Internal AI Assistants",
    description:
      "A private ChatGPT trained on your docs, Notion, and PDFs. Your team asks; the bot answers with citations, not hallucinations.",
  },
  {
    title: "Data Pipelines",
    description:
      "Scrape websites, social, or APIs. Clean, dedupe, enrich. Deliver structured feeds into Airtable, Notion, or Sheets — reliably, on schedule.",
  },
  {
    title: "API & CRM Integrations",
    description:
      "Custom two-way connections between HubSpot, Apollo, Slack, Stripe, or any API. Error handling, retries, and monitoring built in.",
  },
  {
    title: "Automation Audits",
    description:
      "Review your existing setup. Find what's leaking time, money, or breaking silently. Get a prioritized fix list before any building starts.",
  },
];

export const Services = () => {
  return (
    <section id="services" className="section-padding relative">
      <div className="container-custom max-w-5xl">
        <SectionHeadingMin
          title="Services"
          description="Six engagements I run with clients."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: (index % 3) * 0.04 }}
            >
              <h3 className="text-base font-semibold text-foreground mb-2 tracking-tight">
                {service.title}
              </h3>
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
