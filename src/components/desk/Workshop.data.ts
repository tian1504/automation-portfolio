// The workshop list. Every line is written from what the real canvas shows
// (checked against the full-color screenshots), not from the old Portfolio
// copy. Numbers and "Outcome" claims are left out until the owner confirms a
// source. Three rows are parts of one build (DeductiveLabs), so they sit
// together and say so.

// Warm mono previews, cut to the canvas alone (no n8n sidebar, header, tab
// strip, zoom controls or logs) and all at one 11:5 shape, so each one fills the
// preview frame edge to edge. Where a canvas was too short or ran in under the
// sidebar, its own empty ground or group fill is continued to the edge; the
// sidebar's collapse button and a hover "Execute workflow" chip are painted
// out. Nodes and wiring are untouched. Apollo shows its last two groups (the
// sheet and the icebreakers); the dialog shows every original in full.
import multiAgentPreview from "@/assets/desk/workshop/multi-agent-preview.webp";
import internalGptPreview from "@/assets/desk/workshop/internal-gpt-preview.webp";
import deductivePreview from "@/assets/desk/workshop/deductive-labs-preview.webp";
import apolloPreview from "@/assets/desk/workshop/apollo-preview.webp";
import hookBankPreview from "@/assets/desk/workshop/hook-bank-preview.webp";
import instagramPreview from "@/assets/desk/workshop/instagram-preview.webp";
import staticAdPreview from "@/assets/desk/workshop/static-ad-preview.webp";

// Full-color originals. Lossless WebP copies of src/assets/workflows/*.png
// (pixel-identical, about 60% lighter); internal-gpt loses a 7px white strip
// at the top and instagram a 3px strip at the bottom (browser edge in the
// capture). static-ad is Stats_prompt_and_Image_Gen.png, untrimmed.
import multiAgentFull from "@/assets/desk/workshop/multi-agent-full.webp";
import internalGptFull from "@/assets/desk/workshop/internal-gpt-full.webp";
import deductiveFull from "@/assets/desk/workshop/deductive-full.webp";
import apolloFull from "@/assets/desk/workshop/apollo-full.webp";
import hookBankFull from "@/assets/desk/workshop/hook-bank-full.webp";
import instagramFull from "@/assets/desk/workshop/instagram-full.webp";
import staticAdFull from "@/assets/desk/workshop/static-ad-full.webp";

type Img = { src: string; w: number; h: number };

export type Work = {
  id: string;
  title: string;
  /** One sentence for the list row. Kept short enough for one line from 1280 up (two at 1024). */
  line: string;
  /** The fuller plain description: the dialog and the phone disclosure. */
  detail: string;
  tools: string[];
  kind: "n8n canvas" | "web app";
  /** Warm mono preview, toned to the page: the canvas alone, 11:5. */
  preview: Img;
  /** The original full-color screenshot, shown only in the dialog. */
  full: Img;
  /** What the picture shows, for the alt text. */
  alt: string;
  /** Alt text for the preview when it shows only part of the canvas. */
  previewAlt?: string;
  /**
   * Phone dialog only, where the screenshot pans sideways: the point of the
   * image (0 to 1 of its width) to put at the left edge when it opens, so the
   * first view lands on the canvas and not on the n8n app sidebar.
   */
  panStart?: number;
};

export const WORKS: Work[] = [
  {
    id: "multi-agent",
    title: "Multi-Agent Orchestration System",
    line: "Routes each support issue to one of four specialist agents.",
    detail:
      "Part of the DeductiveLabs engine. A product manager agent reads the issue, a summary agent condenses it, and a switch hands it to one of four specialist agents, each with its own OpenAI model.",
    tools: ["n8n", "OpenAI"],
    kind: "n8n canvas",
    preview: { src: multiAgentPreview, w: 1305, h: 593 },
    full: { src: multiAgentFull, w: 1592, h: 697 },
    alt: "n8n canvas of the DeductiveLabs agent flow: a webhook and a chat trigger, a product manager agent, an incident summary agent, and a switch that routes to four specialist agents",
    panStart: 0.1,
  },
  {
    id: "internal-gpt",
    title: "Problem Identification Agent",
    line: "Reads a support question and its files, then finds an answer.",
    detail:
      "Part of the DeductiveLabs engine. It takes a question and any files from the app, reads images, PDFs and text files, searches the knowledge base, runs a web search only when needed, and sends one answer back to the app.",
    tools: ["n8n", "Gemini"],
    kind: "n8n canvas",
    preview: { src: internalGptPreview, w: 1337, h: 608 },
    full: { src: internalGptFull, w: 1682, h: 659 },
    alt: "n8n canvas of the Problem Identification Agent: a webhook from the app, branches that read images and files, a knowledge base search, an optional web search, and a reply to the app",
    panStart: 0,
  },
  {
    id: "deductive-labs",
    title: "DeductiveLabs IT Troubleshooting Engine",
    line: "Walks IT support through a diagnosis, one step at a time.",
    detail:
      "A chat that walks IT support through a diagnosis one step at a time, behind a dashboard that tracks sessions, confidence, knowledge base coverage and skill gaps. Summary emails go out automatically.",
    tools: ["React", "Gemini", "n8n", "Supabase"],
    kind: "web app",
    preview: { src: deductivePreview, w: 1300, h: 591 },
    full: { src: deductiveFull, w: 1300, h: 691 },
    alt: "The DeductiveLabs intelligence dashboard: session totals, average confidence, knowledge base coverage and a problem category heatmap",
    panStart: 0,
  },
  {
    id: "apollo",
    title: "Apollo Lead Scraper and Icebreakers",
    line: "Finds leads in Apollo and drafts a personal opener for each.",
    detail:
      "A form builds an Apollo search, and an Apify actor pulls the matching leads into a Google Sheet. For each new lead, the flow reads their website and OpenAI drafts a personal icebreaker into the same sheet.",
    tools: ["n8n", "Apify", "OpenAI", "Google Sheets"],
    kind: "n8n canvas",
    preview: { src: apolloPreview, w: 1196, h: 544 },
    full: { src: apolloFull, w: 1441, h: 938 },
    alt: "n8n canvas of the Apollo lead scraper in three groups: run the scraper, fill the sheet, write the icebreakers",
    previewAlt: "Part of the Apollo lead scraper’s n8n canvas: the groups that fill the sheet and write the icebreakers",
    panStart: 0.32,
  },
  {
    id: "hook-bank",
    title: "Hook Bank and UGC Brief Builder",
    line: "Builds a hook bank from top posts, then writes UGC briefs.",
    detail:
      "Pulls top organic posts, competitor ads and review themes from Notion, scores them, and has Gemini turn the best into a hook bank in Notion. A second flow picks the top hooks, writes UGC briefs and scripts, saves them to Notion, then creates a ClickUp task and posts a Slack message for the team.",
    tools: ["n8n", "Gemini", "Notion", "ClickUp", "Slack"],
    kind: "n8n canvas",
    preview: { src: hookBankPreview, w: 1200, h: 545 },
    full: { src: hookBankFull, w: 1582, h: 1017 },
    alt: "n8n canvas of the hook bank in two groups: building the hook library, and writing UGC briefs and scripts",
    panStart: 0.15,
  },
  {
    id: "instagram",
    title: "Instagram Scraper and Hook Engine",
    line: "Studies Instagram posts and suggests new hooks to try.",
    detail:
      "On a schedule, scrapes Instagram profiles through Apify and saves the posts to Notion. Gemini reads them and writes new hook ideas, which are cleaned and saved to a Notion database.",
    tools: ["n8n", "Apify", "Gemini", "Notion"],
    kind: "n8n canvas",
    preview: { src: instagramPreview, w: 1176, h: 535 },
    full: { src: instagramFull, w: 1640, h: 1024 },
    alt: "n8n canvas of the Instagram engine: scrape posts on a schedule, generate hook ideas, clean the data and save ideas to Notion",
    panStart: 0.16,
  },
  {
    id: "static-ad",
    title: "Static Ad Prompt and Image Generator",
    line: "Turns organic posts into static ad prompts and images.",
    detail:
      "On a schedule, reads organic posts from four Notion databases (Facebook, Instagram, TikTok and YouTube). For each post, Gemini writes a static ad prompt that is saved to Notion. The flow then generates the image through Google Cloud and uploads it to Google Drive.",
    tools: ["n8n", "Gemini", "Notion", "Google Drive"],
    kind: "n8n canvas",
    preview: { src: staticAdPreview, w: 1268, h: 576 },
    full: { src: staticAdFull, w: 1838, h: 927 },
    alt: "n8n canvas of the static prompt flow: four Notion databases of organic posts, a Gemini chain that writes a prompt, then nodes that generate an image and upload it to Google Drive",
    panStart: 0.1,
  },
];
