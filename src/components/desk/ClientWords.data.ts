/**
 * Copy for the "In my clients' words" act and the record under it.
 * Reviews are verbatim from Upwork (src/components/Testimonials.tsx, and the
 * owner's own screenshot for the newest); only the punctuation around them is
 * typographic. A review Upwork shows cut short ends where the cut is, with an
 * ellipsis: no words are added. Roles keep every original bullet and skill
 * from src/components/Experience.tsx, with the dashes rewritten and the page's
 * house style applied (no serial comma, US spelling). The reviews stay word
 * for word, so their commas and wording are the clients' own.
 */

export type Review = {
  quote: string;
  project: string;
  period: string;
  /** Upwork's star rating for the contract (every one so far is 5.0). */
  rating: number;
  /** "Endorsed by client": the skills and qualities the client ticked. */
  tags: string[];
  /** A line of context under the quote, in his own voice (never part of the review). */
  note?: string;
};

/** The newest review leads. Upwork shows it cut short; the quote stops where Upwork's does. */
export const LEAD_REVIEW: Review = {
  quote:
    "Basti has been incredible to work with. He goes above and beyond the task given and brings solutions proactively. He is also an excellent communicator and keeps you updated…",
  project: "n8n Fix",
  period: "Aug to Oct 2026",
  rating: 5,
  tags: ["n8n", "Google Sheets Automation", "Automation", "Solution Oriented", "Clear Communicator", "Accountable for Outcomes"],
  note: "Basti is short for Sebastian, my middle name.",
};

export const MORE_REVIEWS: Review[] = [
  {
    quote:
      "Eleazar brought the vision into reality. I wasn’t sure how the automation is going to work but he showed us that everything was possible. He works really quick and very knowledgeable",
    project: "AI Automation, Image Generation",
    period: "Jan 2026",
    rating: 5,
    tags: ["Reliable", "Committed to Quality"],
  },
  {
    quote:
      "He has deep knowledge in workflow automation. His technical background helped the project to be more than I envisioned.",
    project: "n8n Multi-Agent Framework Design",
    period: "Dec 2025 to Feb 2026",
    rating: 5,
    tags: ["Committed to Quality", "Solution Oriented", "Detail Oriented"],
  },
  {
    quote:
      "Great experience working with this developer. They were responsive, detail-oriented, and delivered high-quality work on time. Excellent communication throughout the project. Highly recommended.",
    project: "Workflow Automation (Asana, Zapier, HubSpot)",
    period: "Oct to Nov 2025",
    rating: 5,
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
      "600 automated checks (as of November 2026) pin behavior before any change ships; a deliberate gate keeps the scraping engine from being edited casually.",
      "A second check goes back to Amazon and the shops and reproduces every figure from the source, so no list reaches the client unverified.",
      "Phased, milestone-based engagement. Sourcing failure modes the client caught by hand are now guarded by automated checks.",
    ],
    skills: ["Node.js", "Web Scraping", "Chrome DevTools Protocol", "Amazon FBA"],
  },
  {
    period: "Apr to Jul 2026",
    title: "AI DM Agent (Instagram to GoHighLevel)",
    client: "Freelance · Agency client (Instagram bookings for med spas)",
    bullets: [
      "Built the full agent to read the intent of each Instagram DM, answer from the client’s knowledge base and book consults inside the DM thread, with an OpenAI model (gpt-4o-mini).",
      "Built the first version on Instagram’s own webhooks (the verification handshake and inbound message events), with replies sent through ManyChat.",
      "Set it up so every DM created or updated one GoHighLevel contact (no duplicates), and a confirmed booking added a calendar event, moved the pipeline opportunity to Booked, sent the intake form and alerted the team.",
      "Medical, refund, legal or “talk to a person” messages were never answered by the AI: they went to a person, through a callback request and a team alert.",
    ],
    skills: ["n8n", "OpenAI", "ManyChat", "Instagram Graph API", "GoHighLevel", "AI Agents"],
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
