import { motion } from "motion/react";
import { Terminal, TrendingUp, Webhook, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { OrbitTools } from "@/components/OrbitTools";
import { TechIcon } from "@/components/TechIcon";
import n8nLogo from "@/assets/logos/n8n.svg";
import makeLogo from "@/assets/logos/make.svg";
import zapierLogo from "@/assets/logos/zapier.svg";
import notionLogo from "@/assets/logos/notion.svg";
import apifyLogo from "@/assets/logos/apify.svg";
import hubspotLogo from "@/assets/logos/hubspot.svg";
import airtableLogo from "@/assets/logos/airtable.svg";
import openaiLogo from "@/assets/logos/openai.svg";
import geminiLogo from "@/assets/logos/gemini.svg";
import gohighlevelLogo from "@/assets/logos/gohighlevel.svg";

type Tool = {
  name: string;
  logo?: string;
  icon?: LucideIcon;
  /** Render via TechIcon (brand-colored mask) when no colored logo asset exists. */
  tech?: string;
  primary?: boolean;
};

type StackRow = {
  category: string;
  tools: Tool[];
};

const stack: StackRow[] = [
  {
    category: "Automation",
    tools: [
      { name: "n8n", logo: n8nLogo, primary: true },
      { name: "Make", logo: makeLogo },
      { name: "Zapier", logo: zapierLogo },
    ],
  },
  {
    category: "AI & Agents",
    tools: [
      { name: "Claude", tech: "Claude", primary: true },
      { name: "Claude Code", icon: Terminal, primary: true },
      { name: "OpenAI", logo: openaiLogo },
      { name: "Gemini", logo: geminiLogo },
    ],
  },
  {
    category: "Amazon",
    tools: [
      { name: "Amazon SP-API", tech: "Amazon SP-API", primary: true },
      { name: "Keepa API", icon: TrendingUp },
    ],
  },
  {
    category: "Full-Stack",
    tools: [
      { name: "Supabase", tech: "Supabase", primary: true },
      { name: "React", tech: "React" },
      { name: "Node.js", tech: "Node.js" },
      { name: "Python", tech: "Python" },
      { name: "Netlify", tech: "Netlify" },
    ],
  },
  {
    category: "Data & CRM",
    tools: [
      { name: "Airtable", logo: airtableLogo, primary: true },
      { name: "Notion", logo: notionLogo },
      { name: "HubSpot", logo: hubspotLogo },
      { name: "GoHighLevel", logo: gohighlevelLogo },
    ],
  },
  {
    category: "Scraping & APIs",
    tools: [
      { name: "Apify", logo: apifyLogo, primary: true },
      { name: "Custom APIs", icon: Webhook },
    ],
  },
];

const ToolChip = ({ tool, index }: { tool: Tool; index: number }) => {
  const Icon = tool.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className={`group inline-flex items-center gap-2.5 px-3 py-2 rounded-sm transition-colors duration-200 ${
        tool.primary
          ? "bg-primary/[0.05] hover:bg-primary/[0.10]"
          : "hover:bg-card/50"
      }`}
    >
      {tool.logo ? (
        <img
          src={tool.logo}
          alt=""
          aria-hidden
          className="w-5 h-5 object-contain flex-shrink-0"
        />
      ) : tool.tech ? (
        <TechIcon name={tool.tech} className="!h-5 !w-5" />
      ) : Icon ? (
        <Icon
          className={`w-[18px] h-[18px] flex-shrink-0 ${
            tool.primary ? "text-primary" : "text-foreground/70"
          }`}
          aria-hidden
        />
      ) : null}
      <span
        className={`font-mono text-sm tracking-tight ${
          tool.primary ? "text-foreground font-semibold" : "text-foreground/80 font-medium"
        }`}
      >
        {tool.name}
      </span>
    </motion.div>
  );
};

// The orbit shows a curated subset so the tiles keep breathing room.
const ORBIT_SKIP = new Set(["Keepa API", "Custom APIs", "Python", "HubSpot", "GoHighLevel", "Netlify"]);
const allTools: Tool[] = stack.flatMap((row) => row.tools).filter((t) => !ORBIT_SKIP.has(t.name));

export const TechStack = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="container-custom relative z-10">
        <SectionHeading
          number="01"
          label="The Stack"
          title="Tools I build with."
          description="A small, opinionated kit. Highlighted = my home stack — what I reach for first. The rest are fluent in, used as the architecture calls for them."
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 lg:gap-16 items-start">
          {/* LEFT: categorized table */}
          <div className="border-t border-border">
            {stack.map((row, rowIdx) => (
              <div
                key={row.category}
                className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-3 md:gap-6 py-7 border-b border-border items-start"
              >
                <div className="font-mono text-[11px] text-primary tracking-[0.25em] uppercase pt-2.5">
                  {row.category}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {row.tools.map((tool, idx) => (
                    <ToolChip key={tool.name} tool={tool} index={rowIdx * 4 + idx} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: orbital animation (desktop only) */}
          <div className="hidden lg:flex justify-center items-center self-center sticky top-32">
            <OrbitTools items={allTools} size={360} duration={32} />
          </div>
        </div>
      </div>
    </section>
  );
};
