import { Check } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    title: "AI Scraping & Data Pipelines",
    price: "$900 – $2,400",
    description: "Scrape, normalize, and automate data at scale.",
    features: [
      "Custom web scraping (social, e-comm, directories)",
      "Data cleanup + dedupe + enrichment",
      "Automated delivery to Notion / Airtable / Sheets",
      "Scoring / ranking / reporting workflows",
    ],
    buttonText: "Discuss Scraping Project",
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
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Clear Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-2">
            Choose the engagement that fits your automation goals.
          </p>
          <p className="text-sm text-muted-foreground/70">
            Transparent scope. Fast delivery. No fluff.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={`border-border relative transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                plan.highlighted
                  ? "border-primary/50 shadow-glow scale-[1.02]"
                  : "hover:border-primary/30"
              }`}
            >
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
