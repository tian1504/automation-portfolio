import n8n from "@/assets/logos/si/n8n.svg";
import openai from "@/assets/logos/si/openai.svg";
import gemini from "@/assets/logos/si/googlegemini.svg";
import claude from "@/assets/logos/si/claude.svg";
import notion from "@/assets/logos/si/notion.svg";
import airtable from "@/assets/logos/si/airtable.svg";
import zapier from "@/assets/logos/si/zapier.svg";
import make from "@/assets/logos/si/make.svg";
import slack from "@/assets/logos/si/slack.svg";
import supabase from "@/assets/logos/si/supabase.svg";
import netlify from "@/assets/logos/si/netlify.svg";
import react from "@/assets/logos/si/react.svg";
import nodejs from "@/assets/logos/si/nodedotjs.svg";
import amazon from "@/assets/logos/si/amazon.svg";
import python from "@/assets/logos/si/python.svg";

// Brand marks (simple-icons, CC0) rendered in brand color via CSS mask.
// Colors are the official brand hexes, except where the official color is
// too dark to read on a near-black page (Notion, Slack, OpenAI, Make) —
// those use the recognizable light variant of the brand. Matched loosely so
// "Supabase (pgvector)" or "Amazon SP-API" still resolve; techs without a
// mark render as text only — no icon beats a wrong icon.
type IconDef = { re: RegExp; src: string; color: string };

const ICONS: IconDef[] = [
  { re: /n8n/i, src: n8n, color: "#EA4B71" },
  { re: /openai/i, src: openai, color: "#74AA9C" },
  { re: /gemini/i, src: gemini, color: "#8E75B2" },
  { re: /claude/i, src: claude, color: "#D97757" },
  { re: /notion/i, src: notion, color: "#E8E4DC" },
  { re: /airtable/i, src: airtable, color: "#18BFFF" },
  { re: /zapier/i, src: zapier, color: "#FF4F00" },
  { re: /^make\b/i, src: make, color: "#B368F7" },
  { re: /slack/i, src: slack, color: "#E01E5A" },
  { re: /supabase/i, src: supabase, color: "#3FCF8E" },
  { re: /netlify/i, src: netlify, color: "#00C7B7" },
  { re: /react/i, src: react, color: "#61DAFB" },
  { re: /node/i, src: nodejs, color: "#5FA04E" },
  { re: /amazon|sp-api|fba|reports api/i, src: amazon, color: "#FF9900" },
  { re: /python/i, src: python, color: "#4B8BBE" },
];

export const techIconFor = (name: string): IconDef | undefined =>
  ICONS.find(({ re }) => re.test(name));

export const TechIcon = ({ name, className = "" }: { name: string; className?: string }) => {
  const icon = techIconFor(name);
  if (!icon) return null;
  return (
    <span
      aria-hidden
      className={`inline-block h-3.5 w-3.5 flex-shrink-0 ${className}`}
      style={{
        backgroundColor: icon.color,
        maskImage: `url("${icon.src}")`,
        WebkitMaskImage: `url("${icon.src}")`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
};
