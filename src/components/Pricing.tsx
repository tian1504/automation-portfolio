import { Check } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BorderBeam } from "@/components/ui/border-beam";
import { SectionHeading } from "@/components/SectionHeading";

const pricingPlans = [
  {
    badge: "Pay-as-you-go",
    title: "Hourly / Advisory",
    price: "$20 / hr",
    description: "For quick consults, fixes, and scoped tasks.",
    features: [
      "Automation review & optimization",
      "Zapier / Make / n8n troubleshooting",
      "Workflow planning & architecture",
    ],
    buttonText: "Request Hourly Quote",
    highlighted: false,
  },
  {
    badge: "Most Popular",
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
    buttonText: "Book Build Brief",
    highlighted: true,
  },
  {
    badge: "For Data-Heavy Projects",
    title: "Data Pipeline Build",
    price: "$900 – $2,400",
    description: "Scrape, clean, enrich, and pipeline data into your stack.",
    features: [
      "Custom scraping (social, e-comm, directories, APIs)",
      "Dedupe, normalize, enrich",
      "Automated delivery to Notion / Airtable / Sheets",
      "Scoring, ranking, scheduled reporting",
    ],
    buttonText: "Discuss Data Project",
    highlighted: false,
  },
  {
    badge: "Monthly Retainer",
    title: "Maintenance & Growth",
    price: "$200 / month",
    description: "Keep your automations healthy and improving.",
    features: [
      "Up to 5 hrs updates / month",
      "Monitoring + quick fixes",
      "Priority support",
      "Monthly performance summary",
    ],
    buttonText: "Start Maintenance",
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
          number="07"
          label="Pricing"
          title="What it costs."
          description="Four ways to engage — pick what fits the work. Transparent scope, fast delivery, no fluff."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={`border-border relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                plan.highlighted
                  ? "border-primary/50 shadow-glow scale-[1.02]"
                  : "hover:border-primary/30"
              }`}
            >
              {plan.highlighted && (
                <>
                  <BorderBeam
                    duration={8}
                    size={120}
                    colorFrom="#facc15"
                    colorTo="#fef3c7"
                    borderWidth={1.5}
                  />
                  <BorderBeam
                    duration={8}
                    size={120}
                    delay={4}
                    colorFrom="#facc15"
                    colorTo="#fef3c7"
                    borderWidth={1.5}
                  />
                </>
              )}
              <CardHeader className="pb-4">
                <Badge
                  variant={plan.highlighted ? "default" : "secondary"}
                  className="w-fit mb-3"
                >
                  {plan.badge}
                </Badge>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {plan.title}
                </h3>
                <div className="text-3xl font-bold text-primary mb-2">
                  {plan.price}
                </div>
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
