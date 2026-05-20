import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { SectionHeadingMin } from "@/components/SectionHeadingMin";

const faqs = [
  {
    q: "How long does a typical build take?",
    a: "Most automation builds ship in 1–3 weeks. Audits and scoped fixes are usually 3–5 days. RAG and AI-agent projects take 2–4 weeks depending on knowledge base size and tool count.",
  },
  {
    q: "Do you sign NDAs?",
    a: "Yes — mutual NDAs are welcome and we can sign before kickoff. I work with several clients under NDA already.",
  },
  {
    q: "Do you work with my team's existing tools?",
    a: "Yes. I work in your stack — Slack, Notion, HubSpot, Airtable, Sheets, whatever you have. I'm not married to any platform; I pick the right tool for the job.",
  },
  {
    q: "What's not included in a build?",
    a: "Backend infrastructure (your AWS / GCP), domain costs, and third-party API spend (OpenAI, Apify, Pinecone, etc.) — these get itemized in the scope. I don't mark them up.",
  },
  {
    q: "Do you offer ongoing maintenance?",
    a: "Yes. The $200/month Maintenance & Growth retainer covers up to 5 hours of updates, monitoring, and quick fixes. Bigger ongoing builds are billed per scope.",
  },
  {
    q: "Can you train my team to maintain the workflows?",
    a: "Yes. Every build comes with documentation. I can also run paid training sessions so your team can extend and debug workflows without me.",
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="section-padding relative">
      <div className="container-custom max-w-3xl">
        <SectionHeadingMin
          title="FAQ"
          description="If something isn't covered here, the booking call is where we figure it out together."
        />

        <AccordionPrimitive.Root type="single" collapsible className="border-t border-border/40">
          {faqs.map((item, index) => (
            <AccordionPrimitive.Item
              key={item.q}
              value={`item-${index}`}
              className="border-b border-border/40"
            >
              <AccordionPrimitive.Header>
                <AccordionPrimitive.Trigger className="group flex w-full items-center justify-between gap-6 py-5 text-left transition-colors hover:text-primary [&[data-state=open]_.faq-icon-bar-vert]:rotate-90 [&[data-state=open]_.faq-icon-bar-vert]:opacity-0">
                  <span className="text-[15px] md:text-base font-medium text-foreground/95 group-hover:text-primary transition-colors leading-snug">
                    {item.q}
                  </span>
                  <span className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                    <span className="absolute h-px w-3 bg-current" />
                    <span className="faq-icon-bar-vert absolute h-3 w-px bg-current transition-all duration-300" />
                  </span>
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <div className="pb-5 pr-10 text-[15px] text-muted-foreground leading-relaxed max-w-2xl">
                  {item.a}
                </div>
              </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
          ))}
        </AccordionPrimitive.Root>
      </div>
    </section>
  );
};
