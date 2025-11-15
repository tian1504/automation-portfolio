import { ExternalLink } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const projects = [
  {
    title: "Asana–Xero Integration Workflow",
    description: "Built a Make scenario that connects Asana and Xero, automating task creation and financial data sync so project work and invoices always stay in step.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    tags: ["Make", "Asana", "Xero"],
    filters: ["Make"],
  },
  {
    title: "Gmail Automation with AI",
    description: "Designed a Gmail automation in Make that reads incoming emails, classifies them with Google Gemini, extracts key details, and routes them automatically to the right label or team.",
    image: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&q=80",
    tags: ["Make", "Gmail", "Gemini"],
    filters: ["Make"],
  },
  {
    title: "Lead Gen Scraping & Enrichment Pipeline",
    description: "Used Apify + n8n to scrape public communities and reviews, enrich leads with third-party data, and send clean contact lists into Google Sheets and Airtable for sales teams.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    tags: ["n8n", "Apify", "Lead Generation"],
    filters: ["n8n", "Apify"],
  },
  {
    title: "Creative Intelligence Engine for UGC & Ads",
    description: "Built a 'creative intelligence' workflow that pulls ads, UGC, and reviews into Notion, scores them, and uses OpenAI/Gemini to generate hooks and briefs for new campaigns.",
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&q=80",
    tags: ["n8n", "HubSpot", "Notion", "OpenAI", "Gemini"],
    filters: ["n8n", "HubSpot"],
  },
];

const filterCategories = ["All", "Make", "n8n", "Zapier", "Apify", "HubSpot"];

export const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredProjects = activeFilter === "All" 
    ? projects 
    : projects.filter(project => project.filters.includes(activeFilter));

  return (
    <section id="portfolio" className="section-padding bg-secondary">
      <div className="container-custom">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Featured Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Automation solutions and workflows that have streamlined operations and improved efficiency.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap justify-center gap-3 mb-8 md:mb-12">
          {filterCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === category
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/50"
                  : "bg-background/50 text-foreground border border-border hover:border-primary hover:text-primary"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
          {filteredProjects.map((project, index) => (
            <Card key={index} className="overflow-hidden card-hover border-border group hover:scale-[1.02] hover:shadow-2xl transition-all duration-300">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl">{project.title}</CardTitle>
              </CardHeader>
              
              <CardContent>
                <CardDescription className="text-sm mb-4">
                  {project.description}
                </CardDescription>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      {tag}
                    </Badge>
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

        {/* Upwork Link Section */}
        <div className="text-center mt-16">
          <p className="text-lg text-foreground mb-2">
            Want to see more workflows?
          </p>
          <a
            href="https://www.upwork.com/freelancers/~01ac0c23391406fb0d"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg text-primary hover:text-primary/80 hover:underline transition-all duration-300 font-medium"
          >
            Visit my Upwork profile
          </a>
        </div>
      </div>
    </section>
  );
};
