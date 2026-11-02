import { motion } from "motion/react";
import { jumpTo, reveal, revealAt } from "@/lib/desk";
import appLaunchPoster from "@/assets/desk/app-launch-poster.webp";
import { BuildTitle, Rows } from "./Plate";
import { Count } from "./Count";
import { LoopVideo } from "./LoopVideo";
import { ShotTabs, type ShotTab } from "./ShotTabs";
import tinToday from "@/assets/desk/thisisnoted/tin-today.webp";
import tinDraft from "@/assets/desk/thisisnoted/tin-ai-draft.webp";
import tinCarry from "@/assets/desk/thisisnoted/tin-carry-over.webp";
import tinRules from "@/assets/desk/thisisnoted/tin-ai-rules.webp";
import { buildElementId } from "./ledgerStore";

/**
 * Chapter one: Claude Code. How he builds, shown by what the builds had to
 * pass. First the checks behind builds elsewhere on the page (real counts,
 * each a jump to its build), then builds that live only here.
 * Every figure comes from the build's own files (see the research notes in
 * scrollcraft/builds/eleazarai-chapters, local).
 */

/**
 * Some of the checks behind the builds, said in one sentence rather than as a
 * row of big numbers. Each figure is a jump to its build and ticks up once
 * when it comes into view.
 */
const CHECKS: { pre: string; n: number; unit: string; post: string; to: string }[] = [
  { pre: "", n: 1327, unit: " tests", post: " on my own meeting-notes app", to: "thisisnoted" },
  { pre: ", ", n: 600, unit: " checks", post: " on a used-book sourcing engine", to: "build-sourcing" },
  { pre: ", ", n: 219, unit: " checks", post: " on an Instagram AI agent", to: "instagram-agent" },
  { pre: ", and ", n: 208, unit: " quoted facts", post: " re‑found by a script before an AI tool review could ship", to: "review-system" },
];

/** A real entry from the ElevenLabs review's checked claims file (only the empty flags and notes arrays removed). */
const CLAIM = `{
  "row": "Pricing: Free $0, 10,000 credits a month",
  "quote": "Free $0 (10,000 credits)",
  "file": "evidence/audit/V27us-elevenlabs-pricing.txt",
  "vendorHost": "elevenlabs.io",
  "check": {
    "status": "OK",
    "header": {
      "status": "200",
      "finalUrl": "https://elevenlabs.io/pricing",
      "utc": "2026-10-27T12:47:20.566Z",
      "title": "ElevenLabs Pricing for Creators & Businesses of All Sizes"
    }
  }
}`;

const REVIEW_ROWS = [
  { label: "For", value: "A client building a US review site about AI tools." },
  {
    label: "How",
    value:
      "Every vendor page a review relies on is saved. A script re-finds each quoted fact in the saved page and records the page, the time and the result.",
  },
  {
    label: "The gate",
    value:
      "Since 17 October, a Claude Code hook checks each commit Claude makes against the parts of the written standard a script can test. If a finished page fails, or one of its quoted facts cannot be re-found, the commit is blocked.",
  },
  { label: "So far", value: "4 review pages and 208 facts, all re-found. 175 commits between 16 October and 1 November 2026." },
  { label: "Status", value: <span className="text-foreground">Client build, in delivery.</span> },
];

const SITES_ROWS = [
  { label: "For", value: "A US membership business that teaches business owners to use AI." },
  {
    label: "What I did",
    value:
      "Moved 13 sites from drag-and-drop uploads to GitHub with automatic deploys, and launched a 14th the same way. Logged test deploys went live in 7 to 14 seconds.",
  },
  {
    label: "Checks",
    value:
      "Every move followed a written checklist (live status, security headers, deploy source, hardcoded paths, assets, domain), with the results logged. All 14 sites are set up with 5 security headers.",
  },
  {
    label: "Hand-over",
    value: "A one-page guide, written so no developer background is needed, that teaches the team to change their own sites by asking Claude Code, in 4 steps.",
  },
  { label: "Status", value: <span className="text-foreground">Delivered, May 2026.</span> },
];

const EXTENSION_ROWS = [
  {
    label: "What it does",
    value:
      "Loads a used-book seller’s morning picks into his shop baskets. After he pays, it reads his orders and logs each one into his inventory system.",
  },
  { label: "Safety", value: "It never buys, never sees a card and stores no password: it works inside his own signed-in browser." },
  { label: "Proof", value: "Tested live: baskets filled on both shops, and 3 real orders from one shop logged, with 13 duplicates refused." },
  { label: "When unsure", value: "An order it cannot match without doubt is refused, with the reason. It never guesses." },
  { label: "Status", value: <span className="text-foreground">Built and published on the Chrome Web Store.</span> },
];

/** ThisIsNoted: real screens from the app's own click-through test, which runs on made-up sample meetings. */
const TIN_TABS: ShotTab[] = [
  {
    id: "today",
    label: "Today",
    src: tinToday,
    w: 1583,
    h: 905,
    alt: "ThisIsNoted's Today screen: meetings from the calendar with a Take notes button, and a card asking you to promise, once, that you will tell everyone in each meeting that it is transcribed.",
    caption: "Today: meetings from your calendar, and a one-time promise to tell everyone in each meeting that it is transcribed. Sample data.",
  },
  {
    id: "draft",
    label: "The draft",
    src: tinDraft,
    w: 1583,
    h: 905,
    alt: "A note with its draft: main points, a decision and an open question, each quoting the typed line it came from, then action items with who and when.",
    caption: "Each point quotes the line it came from. Shown in practice mode (simple word rules, not real AI) with sample notes.",
  },
  {
    id: "carry",
    label: "Carry-over",
    src: tinCarry,
    w: 1583,
    h: 905,
    alt: "The next meeting in a series opens with a line saying what carries over from the last one: 2 open action items, 1 decision and 1 open question.",
    caption: "The next meeting in a series opens with what carries over from the last one. Sample data.",
  },
  {
    id: "rules",
    label: "The AI’s rules",
    src: tinRules,
    w: 1583,
    h: 905,
    alt: "The app's help page listing the ten rules the AI follows, such as never changing your typed text and showing where every point came from.",
    caption: "The rules the AI follows, written into the app’s help for anyone to read.",
  },
];

const TIN_ROWS = [
  {
    label: "The idea",
    value:
      "AI notes you can check. Every AI point shows where it came from, and plain code (not the AI) flags names, numbers and dates that are not in your notes, the meeting invite or what was said on the call. Your typed text is never changed.",
  },
  {
    label: "Meetings",
    value:
      "From a calendar file, a private Google or Outlook calendar link, or a pasted invite. The next meeting in a series opens with its open to-dos, decisions and questions.",
  },
  {
    label: "Live notes",
    value:
      "Optional transcription with your own ElevenLabs or Soniox key, after a one-time promise to tell everyone in each meeting. ThisIsNoted keeps no audio.",
  },
  {
    label: "Your AI",
    value: "Your own Claude or OpenRouter key, a practice mode labelled “not real AI”, or off. Keys are encrypted with Windows’ own protection.",
  },
  {
    label: "Checks",
    value:
      "1,327 automated tests and a 187-step click-through of the real app, passing on 26 October 2026, and an evaluation kit of 11 made-up meetings with answer keys.",
  },
  { label: "Built with", value: "Claude Code, Electron, React and TypeScript." },
  { label: "Status", value: <span className="text-foreground">My own product, not released yet. The Windows version comes first.</span> },
];

const isPlainClick = (e: React.MouseEvent) => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

export const ClaudeCodeChapter = () => (
  <div className="mx-auto w-full max-w-[1200px] px-5 pb-24 pt-20 sm:px-8 md:pb-32 md:pt-28">
    {/* The stance, with the checks behind it beside it at reading size (one big line, not two). */}
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 md:gap-8 lg:grid-cols-12 lg:items-end lg:gap-x-12">
    <motion.p
      {...reveal}
      className="max-w-[24ch] font-display text-[clamp(1.55rem,2.6vw,2.3rem)] font-medium leading-[1.15] tracking-[-0.025em] text-foreground lg:col-span-7"
    >
      Claude Code is my engineering partner. I set the rules and write the checks, and the work is not done until it passes them.
    </motion.p>

    <motion.p
      {...revealAt(1)}
      className="max-w-[46ch] border-l border-border pl-5 text-[15px] leading-relaxed text-muted-foreground md:text-base lg:col-span-5 lg:mb-1.5"
    >
      Some of the checks behind these builds:{" "}
      {CHECKS.map((c) => (
        <span key={c.to}>
          {c.pre}
          <a
            href={`#${buildElementId(c.to)}`}
            onClick={(e) => {
              if (!isPlainClick(e)) return;
              e.preventDefault();
              jumpTo(buildElementId(c.to));
            }}
            className="whitespace-nowrap font-medium text-foreground underline decoration-foreground/15 decoration-1 underline-offset-4 transition-[text-decoration-color] duration-150 ease-out-strong [@media(hover:hover)_and_(pointer:fine)]:hover:decoration-foreground/70"
          >
            <Count to={c.n} />
            {c.unit}
          </a>
          {c.post}
        </span>
      ))}
      . All 45 commits on a{" "}
      <a
        href={`#${buildElementId("seller-dashboard")}`}
        onClick={(e) => {
          if (!isPlainClick(e)) return;
          e.preventDefault();
          jumpTo(buildElementId("seller-dashboard"));
        }}
        className="whitespace-nowrap font-medium text-foreground underline decoration-foreground/15 decoration-1 underline-offset-4 transition-[text-decoration-color] duration-150 ease-out-strong [@media(hover:hover)_and_(pointer:fine)]:hover:decoration-foreground/70"
      >
        seller dashboard
      </a>{" "}
      were written with Claude Code.
    </motion.p>
    </div>

    {/* His own product, shown by its real screens */}
    <article
      id={buildElementId("thisisnoted")}
      data-build="thisisnoted"
      aria-labelledby="thisisnoted-title"
      className="mt-24 scroll-mt-10 md:mt-36"
    >
      <div className="max-w-[46rem]">
        <BuildTitle id="thisisnoted-title">
          {/* The product's own wordmark colors: "Noted" in its blue (the dark-ground shade). */}
          ThisIs<span className="text-[#6B9BFF]">Noted</span>, my own meeting-notes app
        </BuildTitle>
        <motion.p {...revealAt(1)} className="mt-4 text-[17px] leading-snug text-muted-foreground md:text-lg">
          Meeting notes from your calendar, tidied by AI. You type in your own shorthand during the meeting; it drafts the
          summary, decisions and to-dos, and every point shows where it came from. Not released yet: the Windows version is
          nearly ready.
        </motion.p>
      </div>
      <motion.div {...revealAt(2)} className="mt-10 md:mt-14">
        <ShotTabs tabs={TIN_TABS} label="ThisIsNoted screens" />
      </motion.div>
      <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-10 md:mt-16 lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-5">
          <motion.p
            {...revealAt(0)}
            className="max-w-[18ch] font-display text-[clamp(1.5rem,2.8vw,2.3rem)] font-medium leading-[1.12] tracking-[-0.025em] text-foreground"
          >
            Quick notes in, professional notes out.
          </motion.p>
        </div>
        <div className="min-w-0 lg:col-span-7">
          <Rows rows={TIN_ROWS} first={1} />
        </div>
      </div>
    </article>

    {/* Built only here: a launch video made from code */}
    <article
      id={buildElementId("motion-graphics")}
      data-build="motion-graphics"
      aria-labelledby="motion-graphics-title"
      className="mt-24 scroll-mt-10 md:mt-36"
    >
      <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-12 lg:items-end lg:gap-x-8">
        <div className="lg:col-span-8">
          <motion.div {...reveal}>
            <LoopVideo
              src="/media/app-launch-720.mp4"
              poster={appLaunchPoster}
              w={1280}
              h={720}
              label="A 36-second launch video for a made-up meeting-notes app, made from code"
            />
          </motion.div>
        </div>
        <div className="lg:col-span-4 lg:pb-4">
          <BuildTitle id="motion-graphics-title">A launch video, made from code</BuildTitle>
          <motion.p {...revealAt(1)} className="mt-4 text-[15px] leading-relaxed text-muted-foreground md:text-base">
            A 36-second launch video for a made-up app, built entirely in code with Remotion and Claude Code: no editing
            app, no stock footage, and music generated by code on the same beat as the picture (shown here without sound).
          </motion.p>
          <motion.p {...revealAt(2)} className="mt-3 font-mono text-[11px] tracking-wide text-muted-foreground/85">
            Remotion · React · Claude Code · wide and vertical
          </motion.p>
        </div>
      </div>
    </article>

    {/* Fact-checked reviews: one real entry from the checker */}
    <article
      id={buildElementId("review-system")}
      data-build="review-system"
      aria-labelledby="review-system-title"
      className="mt-24 scroll-mt-10 md:mt-36"
    >
      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-6">
          <BuildTitle id="review-system-title">Fact-checked AI tool reviews</BuildTitle>
          <motion.p {...revealAt(1)} className="mt-4 max-w-[44ch] text-[17px] leading-snug text-muted-foreground md:text-lg">
            A Claude Code project that tests AI tools hands-on, and will not let a review page out until every vendor fact
            in it is re-found in a saved copy of the vendor’s page.
          </motion.p>
          <div className="mt-8">
            <Rows rows={REVIEW_ROWS} />
          </div>
        </div>
        <motion.figure {...revealAt(2)} className="m-0 lg:col-span-6 lg:pt-2">
          <pre className="overflow-x-auto rounded-xl border border-border bg-[hsl(var(--surface))] p-5 font-mono text-[12.5px] leading-[1.65] text-foreground/85 shadow-[var(--edge),var(--e2)] sm:text-[13px]">
            <code>{CLAIM}</code>
          </pre>
          <figcaption className="mt-3 text-sm text-muted-foreground">
            One of the 73 checked facts behind the ElevenLabs review, as the checker left it (empty fields removed).
          </figcaption>
        </motion.figure>
      </div>
    </article>

    {/* Two more, as labels side by side */}
    <div className="mt-24 grid grid-cols-[minmax(0,1fr)] gap-16 md:mt-36 lg:grid-cols-12 lg:gap-x-8">
      <article
        id={buildElementId("site-ops")}
        data-build="site-ops"
        aria-labelledby="site-ops-title"
        className="scroll-mt-10 lg:col-span-6"
      >
        <BuildTitle id="site-ops-title">14 websites on automatic deploys</BuildTitle>
        <div className="mt-6">
          <Rows rows={SITES_ROWS} first={1} />
        </div>
      </article>
      <article
        id={buildElementId("browser-extension")}
        data-build="browser-extension"
        aria-labelledby="browser-extension-title"
        className="scroll-mt-10 lg:col-span-6 lg:mt-20"
      >
        <BuildTitle id="browser-extension-title">Cart-filling browser extension</BuildTitle>
        <div className="mt-6">
          <Rows rows={EXTENSION_ROWS} first={1} />
        </div>
      </article>
    </div>
  </div>
);
