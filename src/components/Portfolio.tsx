import { ExternalLink } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

import n8nWorkflowRAG from "@/assets/n8n-workflow-RAG.png";

const projects = [
  {
    id: "rag-troubleshooting-copilot",
    title: "Multi-Agent RAG Troubleshooting Copilot (n8n)",
    subtitle: "AI copilot that guides users through IT troubleshooting using internal runbooks and RAG.",
    description: "Built an n8n workflow that receives chat messages from users and routes them through a network of specialist AI agents (deductive, product profile, quick isolation, and full isolation). Each agent uses RAG against internal runbooks to generate step-by-step troubleshooting instructions. The result is faster triage, consistent fixes, and less load on L2/L3 engineers.",
    image: n8nWorkflowRAG,
    tags: ["n8n", "OpenAI", "RAG", "IT Support"],
    filters: ["n8n"],
    link: "#",
  },
];

const filterCategories = ["All", "Make", "n8n", "Zapier"];

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
                {project.subtitle && (
                  <p className="text-sm text-primary font-medium mt-1">{project.subtitle}</p>
                )}
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
          <p className="text-sm text-muted-foreground mb-2">
            Want to see more workflows?
          </p>
          <a
            href="https://www.upwork.com/freelancers/~01ac0c23391406fb0d?nav_dir=pop"
            target="_blank"
            rel="noopener noreferrer"
            className="upwork-link text-xl font-bold text-primary inline-block mb-8"
          >
            {"View my Upwork profile".split("").map((ch, index) => (
              <span key={index} className="upwork-char">
                {ch === " " ? "\u00A0" : ch}
              </span>
            ))}
          </a>
          
          {/* Upwork Profile Preview Image */}
          <a
            href="https://www.upwork.com/freelancers/~01ac0c23391406fb0d?nav_dir=pop"
            target="_blank"
            rel="noopener noreferrer"
            className="block max-w-4xl mx-auto group"
          >
            <div className="bg-background rounded-lg border-2 border-primary/30 shadow-lg shadow-primary/20 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/30 hover:border-primary/50">
              <img
                src={new URL('../assets/upwork-profile-banner-clean.png', import.meta.url).href}
                alt="Eleazar Sebastian M. – Upwork profile preview"
                className="w-full h-auto"
              />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};
