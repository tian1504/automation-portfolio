import { ExternalLink } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "AI-Powered Customer Support Automation",
    description: "Built an intelligent chatbot that handles 80% of customer inquiries automatically using OpenAI GPT-4 and n8n workflows.",
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&q=80",
    tags: ["n8n", "OpenAI", "Webhook", "Slack"],
    link: "#",
  },
  {
    title: "Multi-Platform Data Sync System",
    description: "Developed a real-time data synchronization system connecting Salesforce, HubSpot, and Google Sheets for seamless data flow.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    tags: ["Make", "Salesforce API", "HubSpot", "Google Sheets"],
    link: "#",
  },
  {
    title: "Automated Market Research Pipeline",
    description: "Created an end-to-end automation for web scraping, data cleaning, and analysis using Apify and custom Python scripts.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    tags: ["Apify", "Python", "Airtable", "Data Analysis"],
    link: "#",
  },
  {
    title: "Notion-Based Project Management System",
    description: "Designed a comprehensive project management workflow integrating Notion with Slack, Google Calendar, and email for automatic updates.",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80",
    tags: ["Notion API", "Zapier", "Google Calendar", "Slack"],
    link: "#",
  },
  {
    title: "E-commerce Order Fulfillment Automation",
    description: "Streamlined order processing and fulfillment for an e-commerce business, reducing processing time from hours to minutes.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
    tags: ["Shopify", "Make", "Email Automation", "Inventory Sync"],
    link: "#",
  },
  {
    title: "Lead Enrichment & Qualification System",
    description: "Automated lead enrichment and qualification process using AI to score and route leads to the appropriate sales team.",
    image: "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800&q=80",
    tags: ["n8n", "Clearbit API", "HubSpot", "AI Scoring"],
    link: "#",
  },
];

export const Portfolio = () => {
  return (
    <section id="portfolio" className="section-padding bg-secondary">
      <div className="container-custom">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Previous Work
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-world automation projects that delivered measurable results for clients across various industries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project, index) => (
            <Card key={index} className="overflow-hidden card-hover border-border group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <CardHeader>
                <CardTitle className="text-lg">{project.title}</CardTitle>
              </CardHeader>
              
              <CardContent>
                <CardDescription className="text-sm mb-4">
                  {project.description}
                </CardDescription>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 group/btn">
                  View Details
                  <ExternalLink className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
