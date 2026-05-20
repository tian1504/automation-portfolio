import { motion } from "motion/react";
import { SectionHeadingMin } from "@/components/SectionHeadingMin";

type Testimonial = {
  quote: string;
  project: string;
  period: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "He has deep knowledge in workflow automation. His technical background helped the project to be more than I envisioned.",
    project: "n8n Multi-Agent Framework Design",
    period: "Dec 2025 — Feb 2026",
  },
  {
    quote:
      "Eleazar brought the vision into reality. I wasn't sure how the automation was going to work but he showed us that everything was possible. He works really quick.",
    project: "AI Automation — Image Generation",
    period: "Jan 2026",
  },
  {
    quote:
      "Great experience working with this developer. Responsive, detail-oriented, and delivered high-quality work on time. Excellent communication throughout. Highly recommended.",
    project: "Workflow Automation — Asana, Zapier, HubSpot",
    period: "Oct — Nov 2025",
  },
];

export const Testimonials = () => {
  return (
    <section id="testimonials" className="section-padding relative">
      <div className="container-custom max-w-3xl">
        <SectionHeadingMin
          title="What clients say"
          description="Three five-star Upwork engagements."
        />

        <div className="space-y-12">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.project}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <blockquote className="text-[17px] md:text-lg text-foreground/90 leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-3 text-[13px] text-muted-foreground font-mono tracking-wide">
                — {t.project}, {t.period}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
};
