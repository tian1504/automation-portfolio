import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CaseStudyBar } from "@/components/desk/PresenterNav";
import { CaseLink } from "@/components/desk/CaseLink";
import { PlainHeading } from "@/components/PlainHeading";
import { BOOKING_URL, STILL } from "@/lib/desk";
// The same full-color crops the homepage shows (Workshop.data.ts), and the
// originals they were cut from, for the "see the full screen" links.
import deductiveColor from "@/assets/desk/workshop/deductive-labs-preview-color.webp";
import multiAgentColor from "@/assets/desk/workshop/multi-agent-preview-color.webp";
import internalGptColor from "@/assets/desk/workshop/internal-gpt-preview-color.webp";
import deductiveFull from "@/assets/desk/workshop/deductive-full.webp";
import multiAgentFull from "@/assets/desk/workshop/multi-agent-full.webp";
import internalGptFull from "@/assets/desk/workshop/internal-gpt-full.webp";
// The Instagram agent's handover, from its own test conversations (VoiceChapter.tsx).
import dmHandoff from "@/assets/desk/igdm/ig-dm-handoff.webp";

/**
 * Service page: AI agent builds. Every fact here is copied from the homepage
 * sources (Workshop.data.ts, chapters.ts, VoiceChapter.tsx, Terms.tsx) or
 * public/llms.txt. Text is never faded in, so crawlers that do not scroll
 * read every word; only the pictures use the reveal.
 */

const reveal = {
  initial: STILL ? (false as const) : { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: STILL ? 0 : 0.6 },
} as const;

const LINK =
  "group inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-foreground underline decoration-border underline-offset-4 transition-[text-decoration-color,opacity] duration-150 ease-out-strong active:opacity-70 [@media(hover:hover)_and_(pointer:fine)]:hover:decoration-foreground";

/** A plain link to a homepage anchor, in the same quiet style as CaseLink. */
const HomeLink = ({ href, children }: { href: string; children: string }) => (
  <a href={href} className={LINK}>
    {children}
    <ArrowRight
      aria-hidden
      className="h-4 w-4 transition-transform duration-150 ease-out-strong [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-0.5"
    />
  </a>
);

type Img = { src: string; w: number; h: number };

type Part = {
  id: string;
  title: string;
  kind: "web app" | "n8n canvas";
  tools: string[];
  body: string;
  img: Img;
  full: Img;
  alt: string;
};

const PARTS: Part[] = [
  {
    id: "deductive-labs",
    title: "DeductiveLabs IT Troubleshooting Engine",
    kind: "web app",
    tools: ["React", "Gemini", "n8n", "Supabase"],
    body:
      "I built a chat that walks IT support through a diagnosis one step at a time, behind a dashboard that tracks sessions, confidence, knowledge base coverage and skill gaps. Summary emails go out automatically.",
    img: { src: deductiveColor, w: 1300, h: 591 },
    full: { src: deductiveFull, w: 1300, h: 691 },
    alt: "The DeductiveLabs intelligence dashboard: session totals, average confidence, knowledge base coverage and a problem category heatmap",
  },
  {
    id: "multi-agent",
    title: "Multi-Agent Orchestration System",
    kind: "n8n canvas",
    tools: ["n8n", "OpenAI"],
    body:
      "Part of the same engine. A product manager agent reads the issue, a summary agent condenses it, and a switch hands it to one of four specialist agents, each with its own OpenAI model.",
    img: { src: multiAgentColor, w: 1305, h: 593 },
    full: { src: multiAgentFull, w: 1592, h: 697 },
    alt: "n8n canvas of the DeductiveLabs agent flow: a webhook and a chat trigger, a product manager agent, an incident summary agent, and a switch that routes to four specialist agents",
  },
  {
    id: "internal-gpt",
    title: "Problem Identification Agent",
    kind: "n8n canvas",
    tools: ["n8n", "Gemini"],
    body:
      "Also part of the engine. It takes a question and any files from the app, reads images, PDFs and text files, searches the knowledge base, runs a web search only when needed, and sends one answer back to the app.",
    img: { src: internalGptColor, w: 1337, h: 608 },
    full: { src: internalGptFull, w: 1682, h: 659 },
    alt: "n8n canvas of the Problem Identification Agent: a webhook from the app, branches that read images and files, a knowledge base search, an optional web search, and a reply to the app",
  },
];

type Plan = { name: string; price: string; unit: string; covers: string[] };

const PLANS: Plan[] = [
  {
    name: "AI Agent and Workflow Build",
    price: "$600 to $1,800",
    unit: "per build",
    covers: [
      "AI customer agents that know your knowledge base",
      "n8n and Make workflows",
      "Internal AI assistants that answer with citations",
      "Data pipelines",
      "API and CRM integrations",
    ],
  },
  {
    name: "Maintenance and Growth",
    price: "$200",
    unit: "a month",
    covers: ["Up to 5 hours of updates a month", "Monitoring and small fixes", "Priority support", "A monthly summary"],
  },
];

const STEPS = [
  {
    n: "01",
    when: "Day 1",
    title: "Call and audit",
    body: "A 30-minute call. I look at your current setup, ask where the hours go, and point out what is worth automating first.",
  },
  {
    n: "02",
    when: "Days 2 to 3",
    title: "Written scope",
    body: "Deliverables, timeline and a fixed price per milestone, in writing. You sign off before I start.",
  },
  {
    n: "03",
    when: "1 to 3 weeks",
    title: "Build",
    body: "I work in your tools, so the handoff is clean. You see working pieces every few days, with a weekly check-in.",
  },
  {
    n: "04",
    when: "Final week",
    title: "Handoff",
    body: "It runs on your accounts, with full documentation and a recorded walkthrough. Yours to keep.",
  },
];

const FAQS = [
  {
    q: "How long does a typical build take?",
    a: "Most builds take 1 to 3 weeks from signed scope to handoff. Full audits and small fixes take 3 to 5 days. AI agent and knowledge base projects take 2 to 4 weeks, depending on their size.",
  },
  {
    q: "What’s not included in a build?",
    a: "Your hosting (AWS or GCP), domain costs and third-party API spend such as OpenAI, Apify or Pinecone. They are listed in the scope, and I don’t mark them up.",
  },
  {
    q: "Can you train my team to maintain the workflows?",
    a: "Yes. Every build comes with documentation, and I can run paid training sessions so your team can extend and fix the workflows without me.",
  },
];

const PartRow = ({ part: p }: { part: Part }) => (
  <article aria-labelledby={`${p.id}-title`} className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-12 lg:items-center lg:gap-x-10">
    <figure className="m-0 lg:col-span-7">
      <motion.div
        {...reveal}
        className="overflow-hidden rounded-lg border border-border/70 bg-background shadow-[var(--edge),var(--e2)]"
      >
        <img
          src={p.img.src}
          width={p.img.w}
          height={p.img.h}
          alt={p.alt}
          loading="lazy"
          decoding="async"
          className="block aspect-[11/5] h-auto w-full object-cover"
        />
      </motion.div>
      <figcaption className="mt-3 flex flex-wrap items-center gap-x-4 font-mono text-[11px] tracking-wide text-muted-foreground">
        <span>{p.kind}</span>
        <a
          href={p.full.src}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center underline decoration-border underline-offset-4 transition-colors duration-150 ease-out-strong [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground"
        >
          {p.kind === "web app" ? "See the full screen" : "See the full canvas"}
          <span className="sr-only"> of the {p.title} (opens in a new tab)</span>
        </a>
      </figcaption>
    </figure>
    <div className="lg:col-span-5">
      <h3 id={`${p.id}-title`} className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
        {p.title}
      </h3>
      <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-muted-foreground md:text-base">{p.body}</p>
      <p className="mt-3 font-mono text-[11px] tracking-wide text-muted-foreground/85">{p.tools.join(" · ")}</p>
    </div>
  </article>
);

const AiAgents = () => (
  <div className="min-h-screen flex flex-col">
    <CaseStudyBar backTo="/#agents" />

    <main className="flex-1">
      {/* Hero */}
      <section className="section-padding pt-16 md:pt-20">
        <div className="container-custom max-w-5xl mx-auto">
          <p className="font-mono text-xs md:text-sm text-muted-foreground">
            AI agents and workflows · n8n · OpenAI · Gemini · React · Supabase · ManyChat · GoHighLevel
          </p>
          <h1 className="mt-4 font-display font-bold tracking-tighter-2 leading-[1.02] text-4xl md:text-5xl lg:text-6xl text-foreground">
            AI agents that find the answer and hand the work on<span className="text-primary">.</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-xl">
            I have built agents that read a support question or an Instagram DM, look for the answer in a knowledge
            base, and pass the work on to a specialist agent or to a person on the team. This page shows each one,
            what a build costs and how one goes.
          </p>
        </div>
      </section>

      {/* 01 What I have built */}
      <section className="section-padding pt-0" aria-labelledby="built-title">
        <div className="container-custom max-w-5xl mx-auto">
          <PlainHeading
            id="built-title"
            title="What I have built"
            description="Three parts of one IT troubleshooting engine, built for one client, and an Instagram agent built to book consults in the DMs."
          />
          <div className="space-y-16 md:space-y-24">
            {PARTS.map((p) => (
              <PartRow key={p.id} part={p} />
            ))}
          </div>
          <div className="mt-8">
            <HomeLink href="/#agents">See all three on the homepage</HomeLink>
          </div>

          <article aria-labelledby="instagram-agent-title" className="mt-16 max-w-2xl border-l-2 border-primary/60 pl-5 md:mt-24">
            <h3 id="instagram-agent-title" className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
              Instagram AI chat agent
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground md:text-base">
              I also built an Instagram agent for an agency that sets up booking agents for med spas. It was made to
              answer DMs from each spa’s own knowledge base (a Google Doc their team edits) and book consults inside the
              thread. I built it with ManyChat, 7 n8n workflows, an OpenAI model (gpt-4o-mini), GoHighLevel and Google
              Calendar. It was a client build, delivered, and the engagement ended in July 2026.
            </p>
            <div className="mt-2">
              <CaseLink to="/case-study/instagram-dm-agent" label="Read the case study: Instagram AI chat agent" />
            </div>
          </article>
        </div>
      </section>

      {/* 02 Handing over to people */}
      <section className="section-padding pt-0" aria-labelledby="handover-title">
        <div className="container-custom max-w-5xl mx-auto">
          <PlainHeading
            id="handover-title"
            title="Handing over to people"
            description="The Instagram agent had a rule for messages the AI should never answer."
          />
          <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-12 lg:items-start lg:gap-x-10">
            <div className="lg:col-span-6">
              <div className="border-l-2 border-primary/60 pl-5">
                <p className="font-mono text-xs text-muted-foreground mb-1">The rule</p>
                <p className="font-bold leading-relaxed text-foreground">
                  Medical, refund, legal or “talk to a person” messages were never answered by the AI. It took a
                  callback time and contact, then alerted the team.
                </p>
              </div>
              <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed text-muted-foreground md:text-base">
                Someone unsure about a date got a callback too, flagged for the team.
              </p>
            </div>
            <figure className="m-0 min-w-0 lg:col-span-5 lg:col-start-8">
              <motion.div
                {...reveal}
                className="max-w-[458px] overflow-hidden rounded-lg border border-border bg-white shadow-[var(--edge),var(--e2)]"
              >
                <img
                  src={dmHandoff}
                  width={573}
                  height={660}
                  alt="The person asks for a callback instead of picking a date; the agent asks for a time of day and a way to reach them, then says the team has been flagged."
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full"
                />
              </motion.div>
              <figcaption className="mt-3 text-sm text-muted-foreground">
                One of the agent’s test conversations, from the client’s sandbox, so no real customer is shown.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* 03 What it costs */}
      <section className="section-padding pt-0" aria-labelledby="cost-title">
        <div className="container-custom max-w-5xl mx-auto">
          <PlainHeading
            id="cost-title"
            title="What it costs"
            description="You get a written scope and a fixed price for each milestone. You sign off before I build anything, so there are no surprise invoices."
          />
          <ul className="max-w-3xl border-t border-foreground">
            {PLANS.map((plan) => (
              <li
                key={plan.name}
                className="grid grid-cols-1 gap-y-3 border-b border-border py-6 sm:grid-cols-[1fr_auto] sm:gap-x-8"
              >
                <h3 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">{plan.name}</h3>
                <p className="font-display font-semibold tracking-tight text-foreground sm:text-right">
                  <span className="whitespace-nowrap text-2xl leading-none md:text-[28px]">{plan.price}</span>{" "}
                  <span className="text-[15px] font-normal tracking-normal text-muted-foreground">{plan.unit}</span>
                </p>
                <div className="sm:col-span-2">
                  <p className="font-mono text-xs text-muted-foreground mb-2">Covers</p>
                  <ul className="space-y-1 text-[15px] leading-relaxed text-muted-foreground">
                    {plan.covers.map((c) => (
                      <li key={c} className="flex gap-2">
                        <span aria-hidden className="text-foreground/40">·</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
            Each build is split into fixed-price milestones. Smaller job? Hourly consults and fixes from{" "}
            <span className="whitespace-nowrap">
              <span className="text-foreground">$15</span> an hour.
            </span>
          </p>
          <div className="mt-2">
            <HomeLink href="/#pricing">See every plan on the homepage</HomeLink>
          </div>
        </div>
      </section>

      {/* 04 How a build goes */}
      <section className="section-padding pt-0" aria-labelledby="process-title">
        <div className="container-custom max-w-5xl mx-auto">
          <PlainHeading id="process-title" title="How a build goes" />
          <ol className="space-y-6 max-w-2xl">
            {STEPS.map((s, i) => (
              <li key={s.n} className={`border-l-2 pl-5 ${i === 0 ? "border-primary/60" : "border-border"}`}>
                <p className="font-mono text-xs text-muted-foreground mb-1">
                  {s.n} · {s.when}
                </p>
                <h3 className="font-bold text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mt-1">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 05 Questions */}
      <section className="section-padding pt-0" aria-labelledby="questions-title">
        <div className="container-custom max-w-5xl mx-auto">
          <PlainHeading id="questions-title" title="Questions" />
          <div className="max-w-3xl border-t border-foreground">
            {FAQS.map((f) => (
              <div key={f.q} className="border-b border-border py-5">
                <h3 className="text-base font-medium leading-snug text-foreground md:text-[17px]">{f.q}</h3>
                <p className="mt-2 max-w-[62ch] text-[15px] leading-relaxed text-muted-foreground md:text-base">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto">
          <div className="border border-border bg-card/40 p-8 md:p-12">
            <h2 className="font-display font-bold tracking-tight text-2xl md:text-3xl text-foreground">
              Tell me what your team keeps answering.
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed max-w-xl">
              On a 30-minute call I’ll look at your current setup, ask where the hours go, and point out what is worth
              automating first.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild className="group">
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                  Book a call
                  <span className="sr-only"> (opens in a new tab)</span>
                  <ArrowUpRight
                    aria-hidden
                    className="ml-2 h-4 w-4 transition-transform duration-150 ease-out-strong [@media(hover:hover)_and_(pointer:fine)]:group-hover:-translate-y-0.5 [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-0.5"
                  />
                </a>
              </Button>
              <Button asChild variant="ghost">
                <a href="/">See more builds</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
);

export default AiAgents;
