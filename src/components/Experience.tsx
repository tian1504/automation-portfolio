import { Briefcase, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";

const experiences = [
  {
    title: "Senior AI Automation Engineer",
    company: "TechCorp Solutions",
    period: "2022 - Present",
    responsibilities: [
      "Led automation initiatives that reduced manual processing time by 70%",
      "Designed and implemented AI-powered chatbots serving 10k+ users",
      "Built custom integrations between Salesforce, HubSpot, and internal tools",
      "Mentored junior engineers in workflow automation best practices",
    ],
    skills: ["n8n", "OpenAI API", "Python", "REST APIs", "PostgreSQL"],
  },
  {
    title: "Workflow Automation Specialist",
    company: "Digital Innovations Inc",
    period: "2020 - 2022",
    responsibilities: [
      "Developed 30+ automation workflows using Make and Zapier",
      "Integrated Notion databases with company CRM and project management tools",
      "Created data scraping solutions with Apify for market research",
      "Reduced data entry errors by 85% through automated validation systems",
    ],
    skills: ["Make", "Zapier", "Airtable", "Google Apps Script", "Apify"],
  },
  {
    title: "Business Process Analyst",
    company: "StartupHub Ventures",
    period: "2018 - 2020",
    responsibilities: [
      "Analyzed business processes to identify automation opportunities",
      "Implemented Google Workspace automations for 50+ person team",
      "Created documentation and training materials for automation tools",
      "Collaborated with stakeholders to gather requirements and deliver solutions",
    ],
    skills: ["Google Workspace", "Process Mapping", "Data Analysis", "Documentation"],
  },
];

export const Experience = () => {
  return (
    <section id="experience" className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Work Experience
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A proven track record of delivering automation solutions that drive real business results.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {experiences.map((exp, index) => (
            <Card key={index} className="border-l-4 border-l-primary p-6 card-hover">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1">
                    {exp.title}
                  </h3>
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Briefcase className="h-4 w-4" />
                    <span className="font-medium">{exp.company}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground bg-secondary px-3 py-1 rounded-full text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>{exp.period}</span>
                </div>
              </div>

              <ul className="space-y-2 mb-4 list-disc list-inside text-muted-foreground">
                {exp.responsibilities.map((resp, idx) => (
                  <li key={idx}>{resp}</li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2">
                {exp.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
