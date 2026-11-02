import type { IconKey } from "./BrandIcon";

/**
 * The page's chapters: one per kind of work, each on its own ground. The
 * ledger in the margin (Ledger.tsx) reads this list, and every build named
 * here carries a matching `data-build` id on the page, so the ledger can tick
 * it once it has been seen.
 * Order: Claude Code first (how he builds), Amazon last (one kind of work
 * among five, not the headline).
 */

export type Ground = "clay" | "canvas" | "ink" | "amber" | "paper";

export type Chapter = {
  id: string;
  /** The chapter's name, as the title plate and the ledger show it. */
  title: string;
  /** One plain line under the title. */
  line: string;
  ground: Ground;
  /** The marks shown on the title card (the first is the chapter's own). */
  icons: IconKey[];
  /** Said beside the icons: for marks that cannot be shown (Amazon) or are not self-explanatory. */
  iconNote?: string;
  builds: { id: string; name: string }[];
};

export const CHAPTERS: Chapter[] = [
  {
    id: "claude-code",
    title: "Claude Code",
    line: "Real builds, made with Claude Code and held to written checks.",
    ground: "clay",
    icons: ["claudecode"],
    builds: [
      { id: "thisisnoted", name: "ThisIsNoted, my meeting-notes app" },
      { id: "motion-graphics", name: "A launch video made from code" },
      { id: "review-system", name: "Fact-checked AI tool reviews" },
      { id: "site-ops", name: "14 websites on automatic deploys" },
      { id: "browser-extension", name: "Cart-filling browser extension" },
    ],
  },
  {
    id: "agents",
    title: "AI agents",
    line: "Agents that read a question, find the answer and hand the work on.",
    ground: "canvas",
    icons: ["bot"],
    builds: [
      { id: "deductive-labs", name: "IT troubleshooting engine" },
      { id: "multi-agent", name: "Multi-agent support system" },
      { id: "internal-gpt", name: "Problem identification agent" },
    ],
  },
  {
    id: "voice",
    title: "Voice & chat agents",
    line: "An Instagram agent built to book consults in the DMs, and voice work measured to the second.",
    ground: "ink",
    icons: ["instagram", "elevenlabs"],
    iconNote: "Instagram and ElevenLabs",
    builds: [
      { id: "instagram-agent", name: "Instagram AI chat agent" },
      { id: "elevenlabs", name: "ElevenLabs voice project" },
    ],
  },
  {
    id: "outreach",
    title: "Outreach & marketing",
    line: "Cold email that stops itself before it does harm, and engines that write the content.",
    ground: "paper",
    icons: ["mail"],
    builds: [
      { id: "cold-email", name: "Cold-email safety checks" },
      { id: "lead-list", name: "Sourced lead list" },
      { id: "apollo", name: "Lead scraper and icebreakers" },
      { id: "hook-bank", name: "Hook bank and UGC briefs" },
      { id: "instagram", name: "Instagram hook engine" },
      { id: "static-ad", name: "Static ad generator" },
    ],
  },
  {
    id: "ecommerce",
    title: "E-commerce",
    line: "Amazon systems that tell a seller what to fix first.",
    ground: "amber",
    icons: ["cart"],
    iconNote: "Amazon",
    builds: [
      { id: "seller-dashboard", name: "Seller dashboard" },
      { id: "build-sync", name: "SP-API sync engine" },
      { id: "build-sourcing", name: "Book sourcing engine" },
    ],
  },
];
