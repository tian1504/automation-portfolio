import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { SectionHeadingMin } from "@/components/SectionHeadingMin";

const plans = [
  {
    title: "Hourly / Advisory",
    price: "$20 / hr",
    description: "Quick consults, fixes, and scoped tasks. Automation review, troubleshooting, planning.",
    cta: "Request quote",
  },
  {
    title: "Automation Build",
    price: "$600 – $1,800",
    description: "End-to-end workflow builds. n8n / Make / Zapier with API integrations, AI steps where useful, handoff documentation.",
    cta: "Book brief",
    featured: true,
  },
  {
    title: "Data Pipeline Build",
    price: "$900 – $2,400",
    description: "Custom scraping, dedupe, enrichment. Automated delivery to Notion / Airtable / Sheets with scoring and reporting.",
    cta: "Discuss project",
  },
  {
    title: "Maintenance & Growth",
    price: "$200 / month",
    description: "Up to 5 hrs of updates monthly. Monitoring, quick fixes, priority support, performance summary.",
    cta: "Start retainer",
  },
];

export const Pricing = () => {
  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="pricing" className="section-padding relative">
      <div className="container-custom max-w-5xl">
        <SectionHeadingMin
          title="Pricing"
          description="Four ways to engage. Transparent scope, no surprises."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              {plan.featured && (
                <div className="font-mono text-[10px] text-primary tracking-[0.2em] uppercase mb-2">
                  Most popular
                </div>
              )}
              <h3 className="text-base font-semibold text-foreground mb-2 tracking-tight">
                {plan.title}
              </h3>
              <div className="text-lg font-bold text-primary mb-3 font-mono tracking-tight">
                {plan.price}
              </div>
              <p className="text-[15px] text-muted-foreground leading-relaxed mb-4">
                {plan.description}
              </p>
              <a
                href="#contact"
                onClick={scrollToContact}
                className="group inline-flex items-center gap-1.5 text-[13px] text-primary hover:text-primary-glow font-medium"
              >
                {plan.cta}
                <ArrowUpRight className="h-3 w-3 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
