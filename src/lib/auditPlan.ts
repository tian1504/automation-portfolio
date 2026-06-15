// Pure, deterministic logic for the AI Automation Audit funnel.
// No React, no side effects — given the same answers it always returns the same
// plan. This is the "rules engine" the funnel runs client-side (and the same
// shape we'd later hand to n8n + an LLM to run live on a client's real data).

export type Answers = {
  timeSink: string;
  teamSize: string;
  tools: string[];
  bottleneck: string;
  hoursLost: string;
};

export type PlanStep = { n: string; title: string; detail: string };

export type AuditPlan = {
  segment: string;
  segmentBlurb: string;
  situation: string;
  hoursReclaimed: number;
  dollarsPerMonth: number;
  loadedRate: number;
  hoursLostMid: number;
  steps: PlanStep[];
  engagement: { name: string; price: string };
  archetype: string;
};

export type Question = {
  id: keyof Answers;
  kicker: string;
  multi: boolean;
  question: string;
  options: string[];
};

export const QUESTIONS: Question[] = [
  {
    id: "timeSink",
    kicker: "Time sink",
    multi: false,
    question: "What does your team spend the most time on?",
    options: [
      "Lead gen & outreach — finding prospects, researching, cold messaging",
      "Customer support & inbox — answering the same questions over and over",
      "Data entry & reporting — copying between tools, building reports by hand",
      "Content & social — writing posts, briefs, repurposing, scheduling",
      "Scheduling & ops admin — booking, follow-ups, internal coordination",
    ],
  },
  {
    id: "teamSize",
    kicker: "Team",
    multi: false,
    question: "How big is the team doing this work?",
    options: ["Just me / solo", "2–5 people", "6–15 people", "16–50 people", "50+ people"],
  },
  {
    id: "tools",
    kicker: "Your stack",
    multi: true,
    question: "Which tools do you already live in? (pick all that apply)",
    options: [
      "HubSpot / Salesforce / Pipedrive (CRM)",
      "Slack / Microsoft Teams",
      "Google Workspace / Microsoft 365",
      "Notion / Airtable",
      "Spreadsheets (Sheets / Excel)",
      "Instagram / LinkedIn / TikTok",
      "Email / Outreach tool (Apollo, Instantly, etc.)",
      "Mostly manual — no real system yet",
    ],
  },
  {
    id: "bottleneck",
    kicker: "Bottleneck",
    multi: false,
    question: "Where does the work actually get stuck?",
    options: [
      "We can't generate enough qualified leads",
      "We're drowning in repetitive questions & messages",
      "Data is scattered and reporting eats our week",
      "We can't produce content fast enough",
      "Things slip through the cracks — no follow-up or hand-off",
    ],
  },
  {
    id: "hoursLost",
    kicker: "Hours lost",
    multi: false,
    question: "Roughly how many hours a week does this eat — across the team?",
    options: ["Under 5 hours", "5–10 hours", "10–20 hours", "20–40 hours", "40+ hours"],
  },
];

// ── Archetypes — each maps to a real engagement pattern Eleazar ships.
type Archetype = "lead" | "support" | "data" | "content" | "ops";

const ARCHETYPE_LABEL: Record<Archetype, string> = {
  lead: "Apollo Lead Engine",
  support: "Internal GPT support bot",
  data: "Data pipeline",
  content: "Hook Bank & UGC engine",
  ops: "Ops automation",
};

const ARCHETYPE_STEPS: Record<Archetype, PlanStep[]> = {
  lead: [
    { n: "01", title: "Scrape & qualify", detail: "Pull ICP-fit leads from Apollo / LinkedIn on a schedule and auto-filter by your fit criteria." },
    { n: "02", title: "Enrich & personalize", detail: "Enrich each contact and draft a genuinely personalized first line with an LLM — no copy-paste." },
    { n: "03", title: "Sync & track", detail: "Push message-ready leads into your CRM with status tracking and reply alerts." },
  ],
  support: [
    { n: "01", title: "Ingest your knowledge", detail: "Index your docs, Notion, and past tickets into a vector store the bot can actually search." },
    { n: "02", title: "Draft cited answers", detail: "An AI agent answers the repeat questions with citations, not guesses — drafts or auto-replies." },
    { n: "03", title: "Escalate cleanly", detail: "Anything it's unsure of routes to a human with full context — nothing slips." },
  ],
  data: [
    { n: "01", title: "Collect & clean", detail: "Pull from your sources (APIs, sheets, scrapes), then dedupe and normalize automatically." },
    { n: "02", title: "Enrich & score", detail: "Enrich records and apply your scoring rules so the data arrives decision-ready." },
    { n: "03", title: "Deliver on schedule", detail: "Land structured feeds and reports in Notion / Airtable / Sheets on a schedule — no manual pulls." },
  ],
  content: [
    { n: "01", title: "Mine what's working", detail: "Scrape top-performing hooks and posts across platforms into one searchable library." },
    { n: "02", title: "Generate on-brand", detail: "An LLM turns that library plus your voice into briefs, hooks, and post variants." },
    { n: "03", title: "Queue & schedule", detail: "Ready-to-use creative lands in your calendar weekly — no blank-page Mondays." },
  ],
  ops: [
    { n: "01", title: "Map the handoffs", detail: "Wire your CRM, Slack, email, and calendar so work moves without manual nudging." },
    { n: "02", title: "Automate the follow-through", detail: "Auto-create tasks, reminders, and follow-ups so nothing falls through the cracks." },
    { n: "03", title: "Monitor & alert", detail: "Logging and alerts surface failures fast, with a weekly summary of what ran." },
  ],
};

const AUTOMATION_BUILD = { name: "Automation Build", price: "$600 – $1,800" };
const DATA_PIPELINE_BUILD = { name: "Data Pipeline Build", price: "$900 – $2,400" };

// bottleneck wins; timeSink is the fallback when bottleneck is blank.
const BOTTLENECK_ARCHETYPE: Record<string, Archetype> = {
  "We can't generate enough qualified leads": "lead",
  "We're drowning in repetitive questions & messages": "support",
  "Data is scattered and reporting eats our week": "data",
  "We can't produce content fast enough": "content",
  "Things slip through the cracks — no follow-up or hand-off": "ops",
};
const TIMESINK_ARCHETYPE: Record<string, Archetype> = {
  "Lead gen & outreach — finding prospects, researching, cold messaging": "lead",
  "Customer support & inbox — answering the same questions over and over": "support",
  "Data entry & reporting — copying between tools, building reports by hand": "data",
  "Content & social — writing posts, briefs, repurposing, scheduling": "content",
  "Scheduling & ops admin — booking, follow-ups, internal coordination": "ops",
};

const HOURS_MID: Record<string, number> = {
  "Under 5 hours": 4,
  "5–10 hours": 8,
  "10–20 hours": 15,
  "20–40 hours": 30,
  "40+ hours": 50,
};
const LOADED_RATE: Record<string, number> = {
  "Just me / solo": 40,
  "2–5 people": 45,
  "6–15 people": 50,
  "16–50 people": 60,
  "50+ people": 70,
};
const TEAM_SHORT: Record<string, string> = {
  "Just me / solo": "solo",
  "2–5 people": "2–5 person",
  "6–15 people": "6–15 person",
  "16–50 people": "16–50 person",
  "50+ people": "50+ person",
};
const TIMESINK_SHORT: Record<string, string> = {
  "Lead gen & outreach — finding prospects, researching, cold messaging": "lead gen & outreach",
  "Customer support & inbox — answering the same questions over and over": "customer support",
  "Data entry & reporting — copying between tools, building reports by hand": "data entry & reporting",
  "Content & social — writing posts, briefs, repurposing, scheduling": "content & social",
  "Scheduling & ops admin — booking, follow-ups, internal coordination": "scheduling & ops admin",
};
const BOTTLENECK_SHORT: Record<string, string> = {
  "We can't generate enough qualified leads": "not enough qualified leads",
  "We're drowning in repetitive questions & messages": "repetitive questions eating the day",
  "Data is scattered and reporting eats our week": "scattered data and manual reporting",
  "We can't produce content fast enough": "content that can't keep pace",
  "Things slip through the cracks — no follow-up or hand-off": "things slipping through the cracks",
};
const BIG_TEAMS = new Set(["6–15 people", "16–50 people", "50+ people"]);

export function generatePlan(answers: Answers): AuditPlan {
  const archetype: Archetype =
    BOTTLENECK_ARCHETYPE[answers.bottleneck] ?? TIMESINK_ARCHETYPE[answers.timeSink] ?? "ops";

  const hoursLostMid = HOURS_MID[answers.hoursLost] ?? 8;
  const loadedRate = LOADED_RATE[answers.teamSize] ?? 45;
  const hoursReclaimed = Math.max(2, Math.round(hoursLostMid * 0.6));
  const dollarsPerMonth = Math.round((hoursReclaimed * loadedRate * 4.33) / 50) * 50;

  // Segment by how much is at stake.
  let segment: string;
  let segmentBlurb: string;
  if (hoursLostMid >= 20 || (BIG_TEAMS.has(answers.teamSize) && hoursLostMid >= 15)) {
    segment = "Automation ROI: high";
    segmentBlurb = "You're losing enough hours that automation pays for itself fast. This is the moment to systematize the busywork.";
  } else if (hoursLostMid >= 8) {
    segment = "Scaling but stuck";
    segmentBlurb = "You're growing, but manual work is starting to cap how far the team can stretch. Time to take the busywork off their plate.";
  } else {
    segment = "Early & lean";
    segmentBlurb = "You're lean, so every hour counts. One focused automation frees you up to do the work only you can do.";
  }

  // Echo their inputs back so the plan feels read, not generic.
  const teamShort = TEAM_SHORT[answers.teamSize] ?? "small";
  const timeSinkShort = TIMESINK_SHORT[answers.timeSink] ?? "manual work";
  const bottleneckShort = BOTTLENECK_SHORT[answers.bottleneck] ?? "manual work piling up";
  const realTools = answers.tools.filter((t) => t !== "Mostly manual — no real system yet");
  const toolsPhrase =
    realTools.length === 0
      ? "no real system yet"
      : realTools
          .slice(0, 2)
          .map((t) => t.replace(/\s*\(.*\)$/, "").split(" / ")[0])
          .join(" + ");

  const situation = `A ${teamShort} team losing roughly ${hoursLostMid} hours a week to ${timeSinkShort}, working across ${toolsPhrase}. The real bottleneck: ${bottleneckShort}.`;

  const engagement = archetype === "data" ? DATA_PIPELINE_BUILD : AUTOMATION_BUILD;

  return {
    segment,
    segmentBlurb,
    situation,
    hoursReclaimed,
    dollarsPerMonth,
    loadedRate,
    hoursLostMid,
    steps: ARCHETYPE_STEPS[archetype],
    engagement,
    archetype: ARCHETYPE_LABEL[archetype],
  };
}
