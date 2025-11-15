import { ExternalLink } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "Asana–Xero Integration Workflow",
    description: "Built a workflow in Make that connects Asana and Xero, automating task creation, financial data sync, and status updates so the team doesn't have to jump between tools.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    tags: ["Make", "Asana", "Xero"],
    category: "Make",
    link: "#",
  },
  {
    title: "Gmail Automation with AI (Gemini)",
    description: "Designed a Make scenario that reads incoming Gmail messages, classifies them using Google Gemini AI, extracts key details, and routes them automatically to the right label or team.",
    image: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&q=80",
    tags: ["Make", "Gmail", "Gemini AI"],
    category: "Make",
    link: "#",
  },
  {
    title: "Lead Gen Scraping & Enrichment Pipeline",
    description: "Used Apify + n8n to scrape public community posts and reviews, enrich leads with third-party data, and send clean contact lists into Google Sheets and Airtable for sales teams.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    tags: ["n8n", "Apify", "Lead Generation"],
    category: "n8n + Apify",
    link: "#",
  },
  {
    title: "Creative Intelligence Engine for UGC & Ads",
    description: "Built a 'weekly intelligence engine' that pulls ads, UGC, and reviews into Notion, scores them, and feeds AI-generated hooks and briefs to speed up creative testing.",
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&q=80",
    tags: ["n8n", "Notion", "OpenAI", "Gemini"],
    category: "n8n + Notion",
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
