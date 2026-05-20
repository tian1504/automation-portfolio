import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { SectionHeadingMin } from "@/components/SectionHeadingMin";

type Project = {
  title: string;
  description: string;
  tools: string[];
  category: "data" | "communication" | "automation";
};

// 6 featured projects rendered as text-only rows
const PROJECTS: Project[] = [
  {
    title: "Multi-Agent Orchestration System",
    description:
      "Specialized AI agents collaborate via structured reasoning to solve complex tasks one agent alone would fumble.",
    tools: ["n8n", "Claude", "OpenAI", "Gemini"],
    category: "communication",
  },
  {
    title: "Knowledge Base Pipeline (RAG)",
    description:
      "Ingest company docs into a vector store; serve retrieval-augmented answers with citations on every response.",
    tools: ["n8n", "OpenAI", "Pinecone", "Notion"],
    category: "data",
  },
  {
    title: "Private ChatGPT for Operations",
    description:
      "A ChatGPT-style assistant wired into internal knowledge bases. Cuts tier-1 support requests by ~60%.",
    tools: ["n8n", "OpenAI", "Notion"],
    category: "communication",
  },
  {
    title: "Apollo Lead Scraper & Icebreakers",
    description:
      "Scrapes ICP-fit leads, enriches contacts, drafts personalized icebreakers. 200+ qualified leads per week unattended.",
    tools: ["n8n", "Apollo.io", "OpenAI"],
    category: "data",
  },
  {
    title: "Hook Bank & UGC Brief Builder",
    description:
      "Curates viral hooks from social and auto-generates UGC creative briefs tailored to brand voice. 3× more creative variations per sprint.",
    tools: ["n8n", "OpenAI", "Airtable"],
    category: "communication",
  },
  {
    title: "Instagram Scraper & Hook Engine",
    description:
      "Scrapes profiles at scale, analyzes engagement, surfaces hook ideas. Weekly digest to Notion replacing 4hr of manual research.",
    tools: ["n8n", "Apify", "OpenAI"],
    category: "data",
  },
];

export const Portfolio = () => {
  return (
    <section id="portfolio" className="section-padding relative">
      <div className="container-custom max-w-4xl">
        <SectionHeadingMin
          title="Selected Work"
          description="Six production automations running today. Full archive lives on Upwork."
        />

        <div className="divide-y divide-border/50 border-t border-b border-border/50">
          {PROJECTS.map((project, index) => (
            <motion.a
              key={project.title}
              href="https://www.upwork.com/freelancers/~01ac0c23391406fb0d?nav_dir=pop"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: (index % 6) * 0.04 }}
              className="group flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-8 py-6"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="font-mono text-[11px] text-muted-foreground/60 tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-base md:text-lg font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                </div>
                <p className="text-[15px] text-muted-foreground leading-relaxed pl-7 md:pl-9">
                  {project.description}
                </p>
              </div>

              <div className="flex items-center gap-4 md:gap-6 pl-7 md:pl-0">
                <span className="font-mono text-[11px] text-muted-foreground/80 tracking-wide hidden md:block">
                  {project.tools.join(" · ")}
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all flex-shrink-0"
                />
              </div>
              {/* tools on mobile */}
              <span className="md:hidden font-mono text-[11px] text-muted-foreground/80 tracking-wide pl-7">
                {project.tools.join(" · ")}
              </span>
            </motion.a>
          ))}
        </div>

        {/* Upwork link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-10"
        >
          <a
            href="https://www.upwork.com/freelancers/~01ac0c23391406fb0d?nav_dir=pop"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-[15px] text-primary hover:text-primary-glow"
          >
            See the full archive on Upwork
            <ArrowUpRight className="h-4 w-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};
