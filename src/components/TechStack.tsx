import { motion } from "motion/react";
import { SectionHeadingMin } from "@/components/SectionHeadingMin";

type Tool = { name: string; primary?: boolean };
type Category = { name: string; tools: Tool[] };

const stack: Category[] = [
  {
    name: "Automation",
    tools: [
      { name: "n8n", primary: true },
      { name: "Make" },
      { name: "Zapier" },
    ],
  },
  {
    name: "AI Models",
    tools: [
      { name: "Claude", primary: true },
      { name: "OpenAI" },
      { name: "Gemini" },
    ],
  },
  {
    name: "Data & Storage",
    tools: [
      { name: "Notion", primary: true },
      { name: "Airtable", primary: true },
      { name: "HubSpot" },
      { name: "GoHighLevel" },
    ],
  },
  {
    name: "Scraping & Code",
    tools: [
      { name: "Apify", primary: true },
      { name: "Python" },
      { name: "Custom APIs" },
    ],
  },
];

export const TechStack = () => {
  return (
    <section className="section-padding relative">
      <div className="container-custom max-w-5xl">
        <SectionHeadingMin
          title="Stack"
          description="A small, opinionated kit. Bold = my home stack."
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-12">
          {stack.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <h3 className="font-mono text-[11px] text-primary tracking-[0.2em] uppercase mb-4">
                {category.name}
              </h3>
              <ul className="space-y-2">
                {category.tools.map((tool) => (
                  <li
                    key={tool.name}
                    className={
                      tool.primary
                        ? "text-[15px] font-semibold text-foreground"
                        : "text-[15px] text-muted-foreground"
                    }
                  >
                    {tool.name}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
