import { Briefcase, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";

const experiences = [
  {
    title: "Automation Specialist – Amazon Product Workflows",
    company: "LB Ventures",
    period: "Nov 2025 – Present",
    responsibilities: [
      "Built and maintained automation workflows for Amazon product operations (orders, tracking, status updates).",
      "Connected email, Amazon notifications, and internal tools using platforms like Make.com, n8n, and Zapier to keep the team in sync.",
      "Automated Slack/email alerts for key events (new orders, shipment updates, cancellations) to reduce manual checking.",
      "Added logging and monitoring so failures are easy to track and debug.",
    ],
    skills: ["Slack Bot", "n8n", "OpenAI", "Amazon", "Notifications"],
  },
  {
    title: "Web Scraping & Automation Specialist (Contract)",
    company: "CountySports USA",
    period: "Nov 2025 – Nov 2025",
    responsibilities: [
      "Build and maintain web scraping workflows to collect high school athlete stats and game data from public sites and databases.",
      "Clean, normalize, and structure scraped data so it can be used in automated graphics templates and social content.",
      "Use tools like Google sheets, Python, and automation platforms (Zapier) to schedule scrapes, handle errors, and keep data feeds reliable.",
      "Collaborate with the owner/CEO to ensure data is accurate, on time, and ready to power high-engagement posts.",
    ],
    skills: ["Python", "Make.com", "Web Scraping", "Data Pipelines", "Photoshop & Datasets"],
  },
  {
    title: "Social Media Web Scraping & Creative Content Automation",
    company: "Sanlava (E-commerce & Social Brand)",
    period: "Sep 2025 – Nov 2025",
    responsibilities: [
      "Designed a \"creative intelligence\" workflow that scrapes ads, UGC, and reviews from platforms like TikTok, Instagram, Facebook, and Google.",
      "Structured data into Notion databases (Organic posts, Ads, Reviews, Trends, Hook Bank) to give the brand a single source of truth for creative ideas.",
      "Used OpenAI and Gemini to generate hooks, UGC briefs, and static ad prompts based on the scraped data and custom scoring rules.",
      "Automated weekly runs, scoring, and QA so the marketing team receives fresh, ready-to-use creative insights without manual research.",
    ],
    skills: ["n8n", "Apify", "Notion", "OpenAI", "Gemini", "Social Media", "UGC"],
  },
  {
    title: "System Administrator – Windows & Azure Cloud Engineer",
    company: "Enterprise Infrastructure Team",
    period: "2012 - 2025",
    responsibilities: [
      "Managed large fleets of Windows Server environments with a strong focus on uptime, security updates, and compliance.",
      "Automated patching and reporting using PowerShell and Azure Update Manager to keep systems consistently up to date.",
      "Troubleshot complex L3 issues across VMware, networking, storage, and backups in production environments.",
      "Worked with global teams to plan changes, communicate risks, and document runbooks for stable, repeatable operations.",
    ],
    skills: ["Windows Server", "Azure", "PowerShell", "VMware", "Patch Management", "Monitoring"],
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
