import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { WorkflowBackdrop } from "@/components/WorkflowBackdrop";
import { MagicCard } from "@/components/ui/magic-card";

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
    <section id="services" className="section-padding relative overflow-hidden">
      <WorkflowBackdrop className="opacity-60" />

      <div className="container-custom relative z-10">
        <SectionHeading
          number="02"
          label="Services"
          title="What I build."
          description="Six engagements I run with clients. Each card below is a node — most projects connect two or three of them into a single working system."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: (index % 3) * 0.05 }}
            >
              <MagicCard
                className="rounded-sm h-full"
                gradientFrom="hsl(45 93% 54%)"
                gradientTo="hsl(45 93% 70%)"
                gradientColor="hsl(45 93% 54%)"
                gradientOpacity={0.08}
                gradientSize={260}
              >
                <div className="relative p-7 lg:p-9 h-full">
                  <div className="font-mono text-[11px] text-primary tracking-[0.25em] mb-6">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <h3 className="text-xl lg:text-2xl font-bold tracking-tight text-foreground mb-3 leading-tight">
                    {service.title}
                  </h3>

                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-sm">
                    {service.description}
                  </p>

                  <ArrowUpRight
                    className="absolute top-7 right-7 lg:top-9 lg:right-9 h-4 w-4 text-muted-foreground/40"
                    aria-hidden
                  />
                </div>
              </MagicCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
