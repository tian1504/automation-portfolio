import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";
import { cn } from "@/lib/utils";

// Three build/retainer engagements. The $20/hr hourly option is intentionally
// kept OFF the card grid (rendered as a quiet line below) so it doesn't anchor
// the whole offer low.
const pricingPlans = [
  {
    badge: "Most chosen",
    title: "Automation Build",
    price: "$600 – $1,800",
    description: "End-to-end workflow builds that remove busywork.",
    features: [
      "Multi-step automation using n8n / Make / Zapier",
      "API integrations + Notion / Airtable / Sheets",
      "AI steps with OpenAI / Gemini where useful",
      "Clear handoff + documentation",
      "2 revision rounds",
    ],
    buttonText: "Book a build brief",
    highlighted: true,
  },
  {
    badge: "For data-heavy projects",
    title: "Data Pipeline Build",
    price: "$900 – $2,400",
    description: "Scrape, clean, enrich, and pipeline data into your stack.",
    features: [
      "Custom scraping (social, e-comm, directories, APIs)",
      "Dedupe, normalize, enrich",
      "Automated delivery to Notion / Airtable / Sheets",
      "Scoring, ranking, scheduled reporting",
    ],
    buttonText: "Discuss a data project",
    highlighted: false,
  },
  {
    badge: "Monthly retainer",
    title: "Maintenance & Growth",
    price: "$200 / mo",
    description: "Keep your automations healthy and improving.",
    features: [
      "Up to 5 hrs updates / month",
      "Monitoring + quick fixes",
      "Priority support",
      "Monthly performance summary",
    ],
    buttonText: "Start maintenance",
    highlighted: false,
  },
];

export const Pricing = () => {
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    contactSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="pricing" className="section-padding">
      <div className="container-custom">
        <SectionHeading
          number="08"
          label="Pricing"
          title="What it costs."
          description="Fixed scope, fixed price — you sign off on everything before I build a thing, so there are never surprise invoices. Pick the engagement that fits the work."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <div
              key={plan.title}
              className={cn(
                "relative flex flex-col rounded-xl border p-7 transition-colors duration-300",
                plan.highlighted
                  ? "border-primary/40 bg-card/60"
                  : "border-border bg-card/25 hover:border-border/80"
              )}
            >
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-5">
                {plan.badge}
              </div>

              <h3 className="text-lg font-bold text-foreground mb-2">{plan.title}</h3>
              <div className="text-[1.75rem] font-semibold tracking-tight text-foreground mb-3">
                {plan.price}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-7">
                {plan.description}
              </p>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground/45" aria-hidden />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={scrollToContact}
                variant={plan.highlighted ? "default" : "outline"}
                className="w-full"
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>

        {/* Hourly option — kept honest but deliberately de-anchored from the grid */}
        <p className="mt-10 text-center font-mono text-sm text-muted-foreground max-w-2xl mx-auto">
          Smaller scope?{" "}
          <span className="text-foreground">Hourly consults &amp; fixes from $20/hr</span> —{" "}
          <button
            onClick={scrollToContact}
            className="text-primary hover:underline underline-offset-4"
          >
            request a quote
          </button>
          .
        </p>
      </div>
    </section>
  );
};
