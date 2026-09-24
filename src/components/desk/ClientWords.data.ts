/**
 * Copy for the "In my clients' words" act and the record under it.
 * Reviews are verbatim from Upwork (src/components/Testimonials.tsx); only the
 * punctuation around them is typographic. Roles keep every original bullet and
 * skill from src/components/Experience.tsx, with the dashes rewritten and the
 * page's house style applied (no serial comma, US spelling). The reviews stay
 * word for word, so their commas and wording are the clients' own.
 */

export type Review = {
  quote: string;
  project: string;
  period: string;
  tags: string[];
};

export const LEAD_REVIEW: Review = {
  quote:
    "Eleazar brought the vision into reality. I wasn’t sure how the automation was going to work but he showed us that everything was possible. He works really quick.",
  project: "AI Automation, Image Generation",
  period: "Jan 2026",
  tags: ["Reliable", "Committed to Quality"],
};

export const MORE_REVIEWS: Review[] = [
  {
    quote:
      "He has deep knowledge in workflow automation. His technical background helped the project to be more than I envisioned.",
    project: "n8n Multi-Agent Framework Design",
    period: "Dec 2025 to Feb 2026",
    tags: ["Committed to Quality", "Solution Oriented", "Detail Oriented"],
  },
  {
    quote:
      "Great experience working with this developer. Responsive, detail-oriented, and delivered high-quality work on time. Excellent communication throughout. Highly recommended.",
    project: "Workflow Automation (Asana, Zapier, HubSpot)",
    period: "Oct to Nov 2025",
    tags: ["Reliable", "Collaborative", "Clear Communicator", "Accountable for Outcomes"],
  },
];

export type Role = {
  period: string;
  title: string;
  client: string;
  bullets: string[];
  skills: string[];
};

export const ROLES: Role[] = [
  {
    period: "Aug 2026 to present",
    title: "Book-Sourcing Engine",
    client: "Freelance · Used-book Amazon FBA seller (Upwork)",
    bullets: [
      "Building a sourcing engine that scans about 2,000 used-book listings each morning across AbeBooks, Biblio and Alibris, and ends with a daily buy list that fits the client’s budget.",
      "Every surviving listing is opened live for its current price, condition and seller location. Postage and real Amazon fees are inside the margin before a book can be recommended.",
      "230 automated checks pin behavior before any change ships; a deliberate gate keeps the scraping engine from being edited casually.",
      "Phased, milestone-based engagement. Sourcing failure modes the client caught by hand are now guarded by automated checks.",
    ],
    skills: ["Node.js", "Web Scraping", "Chrome DevTools Protocol", "Amazon FBA"],
  },
  {
    period: "Apr 2026 to present",
    title: "AI DM Agent (Instagram to GoHighLevel)",
    client: "Freelance · AVA (Tamara)",
    bullets: [
      "Shipped the full agent: 24/7 Instagram DM automation that classifies inbound intent, handles objections and generates context-aware replies with Claude.",
      "Implemented two-way Instagram Graph API integration handling verification handshake, inbound message events and outbound automated replies.",
      "Routes confirmed bookings into GoHighLevel with contact deduplication, pipeline opportunity creation and team alerts.",
      "Runs end to end without human input. It escalates to a human only when the conversation actually needs one.",
    ],
    skills: ["n8n", "Claude", "Instagram Graph API", "GoHighLevel", "AI Agents", "Webhooks"],
  },
  {
    period: "Nov 2025 to present",
    title: "Automation Specialist, Amazon SP-API and Sourcing",
    client: "Freelance",
    bullets: [
      "Built automations against Amazon’s Selling Partner API: LWA authentication, request throttling, pagination and the asynchronous Reports API.",
      "Live sales and inventory dashboards with re-order alerts; inbound-shipment and order-status workflows synced to the inventory system.",
      "Two-stage LLM product-sourcing bot: strict brand / UPC / MPN / SKU matching plus SOP rules, with Apify supplier scraping and Keepa pricing. Buy / no-buy verdicts are delivered to Slack with sourced reasoning.",
      "Added logging and monitoring so failures are easy to track and debug in production.",
    ],
    skills: ["n8n", "Amazon SP-API", "Python", "OpenAI", "Apify", "Keepa"],
  },
  {
    period: "Sep to Nov 2025",
    title: "Creative Intelligence",
    client: "Sanlava (e-commerce and social brand)",
    bullets: [
      "Designed a “creative intelligence” workflow that scrapes ads, UGC and reviews from TikTok, Instagram, Facebook and Google.",
      "Structured data into Notion databases (Organic Posts, Ads, Reviews, Trends, Hook Bank), a single source of truth for creative ideas.",
      "Used OpenAI and Gemini to generate hooks, UGC briefs and static ad prompts based on scraped data and custom scoring rules.",
      "Automated weekly runs, scoring and QA so the marketing team gets fresh, ready-to-use creative insights without manual research.",
    ],
    skills: ["n8n", "Apify", "Notion", "OpenAI", "Gemini", "UGC"],
  },
  {
    period: "2012 to Jul 2026",
    title: "System Administrator, Windows and Azure Cloud",
    client: "Enterprise Infrastructure",
    bullets: [
      "Managed large fleets of Windows Server environments with strong focus on uptime, security updates and compliance.",
      "Automated patching and reporting via PowerShell and Azure Update Manager, keeping systems consistently up to date at scale.",
      "Troubleshot complex L3 issues across VMware, networking, storage and backups in production environments.",
      "Worked with global teams to plan changes, communicate risks and document runbooks for stable, repeatable operations.",
    ],
    skills: ["Windows Server", "Azure", "PowerShell", "VMware", "Patch Management"],
  },
];

/** The kit, grouped as on the old stack section. Plain text, no logos. */
export const TOOLS: { category: string; tools: string[] }[] = [
  { category: "Automation", tools: ["n8n", "Make", "Zapier"] },
  { category: "AI and agents", tools: ["Claude", "Claude Code", "OpenAI", "Gemini"] },
  { category: "Amazon", tools: ["SP-API", "Keepa API"] },
  { category: "Full stack", tools: ["Supabase", "React", "Node.js", "Python", "Netlify"] },
  { category: "Data and CRM", tools: ["Airtable", "Notion", "HubSpot", "GoHighLevel"] },
  { category: "Scraping and APIs", tools: ["Apify", "custom APIs"] },
];
