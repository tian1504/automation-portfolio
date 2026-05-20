import { motion } from "motion/react";
import { Star } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { GridPattern } from "@/components/ui/grid-pattern";

type Testimonial = {
  quote: string;
  project: string;
  period: string;
  tags: string[];
};

// Real reviews from Upwork (client names are anonymous per Upwork policy)
const testimonials: Testimonial[] = [
  {
    quote:
      "He has deep knowledge in workflow automation. His technical background helped the project to be more than I envisioned.",
    project: "n8n Multi-Agent Framework Design",
    period: "Dec 2025 — Feb 2026",
    tags: ["Committed to Quality", "Solution Oriented", "Detail Oriented"],
  },
  {
    quote:
      "Eleazar brought the vision into reality. I wasn't sure how the automation was going to work but he showed us that everything was possible. He works really quick.",
    project: "AI Automation — Image Generation",
    period: "Jan 2026",
    tags: ["Reliable", "Committed to Quality"],
  },
  {
    quote:
      "Great experience working with this developer. Responsive, detail-oriented, and delivered high-quality work on time. Excellent communication throughout. Highly recommended.",
    project: "Workflow Automation — Asana, Zapier, HubSpot",
    period: "Oct — Nov 2025",
    tags: ["Reliable", "Collaborative", "Clear Communicator", "Accountable for Outcomes"],
  },
];

export const Testimonials = () => {
  return (
    <section id="testimonials" className="section-padding relative overflow-hidden">
      {/* Editorial graph-paper backdrop, fades at edges */}
      <GridPattern
        width={48}
        height={48}
        x={-1}
        y={-1}
        className="absolute inset-0 fill-primary/[0.04] stroke-primary/[0.10] [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_75%)]"
      />

      <div className="container-custom relative z-10">
        <SectionHeading
          number="05"
          label="Testimonials"
          title="What clients say."
          description="Three of my five-star Upwork engagements. The full set lives on my profile."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border max-w-6xl">
          {testimonials.map((t, index) => (
            <motion.figure
              key={t.project}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="relative bg-background p-7 lg:p-9 flex flex-col"
            >
              {/* 5-star + Upwork verified */}
              <div className="flex items-center gap-2.5 mb-5">
                <div className="flex gap-0.5" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                  ))}
                </div>
                <span className="text-border" aria-hidden>·</span>
                <span className="font-mono text-[10px] text-muted-foreground tracking-[0.2em] uppercase">
                  Verified on Upwork
                </span>
              </div>

              {/* Editorial quote mark */}
              <div
                aria-hidden
                className="font-display text-5xl leading-none text-primary/40 mb-2 select-none"
              >
                &ldquo;
              </div>

              <blockquote className="text-base md:text-[17px] text-foreground/90 leading-relaxed mb-6 flex-1">
                {t.quote}
              </blockquote>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {t.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] text-muted-foreground tracking-wider px-2 py-1 border border-border bg-secondary/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <figcaption className="border-t border-border pt-4 mt-auto">
                <div className="font-mono text-[10px] text-primary tracking-[0.2em] uppercase mb-1">
                  {t.project}
                </div>
                <div className="font-mono text-[10px] text-muted-foreground/70 tracking-wider">
                  {t.period}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
};
