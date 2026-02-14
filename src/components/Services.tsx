import { Bot, Workflow, Database, Zap, Globe, Brain } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const services = [
  {
    icon: Bot,
    title: "AI Integration",
    description: "Integrate cutting-edge AI models into your workflows to automate decision-making and content generation.",
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    description: "Design and implement end-to-end automation workflows that eliminate repetitive tasks and boost productivity.",
  },
  {
    icon: Database,
    title: "Data Pipeline Engineering",
    description: "Build robust data pipelines that collect, transform, and sync data across your entire tech stack.",
  },
  {
    icon: Zap,
    title: "No-Code/Low-Code Solutions",
    description: "Leverage platforms like n8n, Make, and Zapier to rapidly deploy automations without extensive coding.",
  },
  {
    icon: Globe,
    title: "API Integration",
    description: "Connect disparate systems and services through custom API integrations for seamless data flow.",
  },
  {
    icon: Brain,
    title: "Process Optimization",
    description: "Analyze and optimize your business processes to identify automation opportunities and efficiency gains.",
  },
];

export const Services = () => {
  return (
    <section id="services" className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            What I Do
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            I help businesses scale by automating processes, integrating AI, and building custom workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card
                key={index}
                className="card-hover border-border bg-card group"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
