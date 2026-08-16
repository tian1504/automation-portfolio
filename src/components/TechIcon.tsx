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

// Monochrome brand marks (simple-icons, CC0). Matched loosely so entries like
// "Supabase (pgvector)" or "Amazon SP-API" still resolve. Techs without a
// mark render as text only — no icon beats a wrong icon.
const ICONS: Array<[RegExp, string]> = [
  [/n8n/i, n8n],
  [/openai/i, openai],
  [/gemini/i, gemini],
  [/claude/i, claude],
  [/notion/i, notion],
  [/airtable/i, airtable],
  [/zapier/i, zapier],
  [/^make\b/i, make],
  [/slack/i, slack],
  [/supabase/i, supabase],
  [/netlify/i, netlify],
  [/react/i, react],
  [/node/i, nodejs],
  [/amazon|sp-api|fba|reports api/i, amazon],
  [/python/i, python],
];

export const techIconFor = (name: string): string | undefined =>
  ICONS.find(([re]) => re.test(name))?.[1];

export const TechIcon = ({ name, className = "" }: { name: string; className?: string }) => {
  const src = techIconFor(name);
  if (!src) return null;
  return (
    <img
      src={src}
      alt=""
      aria-hidden
      loading="lazy"
      className={`h-3.5 w-3.5 invert opacity-60 ${className}`}
    />
  );
};
