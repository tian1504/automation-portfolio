import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { SectionHeading } from '@/components/SectionHeading';

// Workflow screenshots
import workflowApollo from '@/assets/workflows/n8n-01.png';
import workflowHookBank from '@/assets/workflows/n8n-03.png';
import workflowInstagram from '@/assets/workflows/n8n-04.png';
import workflowRAG from '@/assets/workflows/n8n-workflow-RAG-2.png';
import workflowMultiAgent from '@/assets/workflows/multiagent_n8n.png';
import workflowInternalGPT from '@/assets/workflows/InternalChatGPT-N8N.png';

type Project = {
  image: string;
  category: 'data' | 'communication' | 'automation';
  categoryLabel: string;
  title: string;
  description: string;
  outcome: string;
  tools: string[];
};

// 6 featured projects — full magazine treatment
const PROJECTS: Project[] = [
  {
    image: workflowMultiAgent,
    category: 'communication',
    categoryLabel: 'Multi-Agent AI',
    title: 'Multi-Agent Orchestration System',
    description:
      'Designed an n8n-orchestrated system where specialized AI agents collaborate via structured reasoning to solve complex tasks one agent alone would fumble. Each agent owns a domain — research, analysis, drafting, review — and hands off with structured output.',
    outcome: 'Replaces 4–6 hours of cross-functional work per task with a 90-second pipeline.',
    tools: ['n8n', 'Claude', 'OpenAI', 'Gemini'],
  },
  {
    image: workflowRAG,
    category: 'data',
    categoryLabel: 'RAG Pipeline',
    title: 'Knowledge Base Pipeline',
    description:
      'Ingests company documents into a vector store (Pinecone) and serves retrieval-augmented answers with source citations on every response — not hallucinations. Wired into the team\'s existing Notion workspace as the single source of truth.',
    outcome: 'Internal answer accuracy went from "ask the senior" to citations on every reply.',
    tools: ['n8n', 'OpenAI', 'Pinecone', 'Notion'],
  },
  {
    image: workflowInternalGPT,
    category: 'communication',
    categoryLabel: 'Internal Assistant',
    title: 'Private ChatGPT for Operations',
    description:
      'A ChatGPT-style assistant wired into internal knowledge bases with role-based access. Employees ask, the bot answers — with sources. Used for onboarding, policy questions, and process documentation.',
    outcome: 'Cut tier-1 internal support requests by an estimated 60%.',
    tools: ['n8n', 'OpenAI', 'Notion'],
  },
  {
    image: workflowApollo,
    category: 'data',
    categoryLabel: 'Lead Engine',
    title: 'Apollo Lead Scraper & Icebreakers',
    description:
      'Scrapes ICP-fit leads from Apollo.io, enriches contact data with public sources, and drafts personalized icebreaker messages via OpenAI. Ships qualified outbound at scale without losing the human-written feel.',
    outcome: 'Generates 200+ enriched, personalized leads per week unattended.',
    tools: ['n8n', 'Apollo.io', 'OpenAI'],
  },
  {
    image: workflowHookBank,
    category: 'communication',
    categoryLabel: 'Creative Ops',
    title: 'Hook Bank & UGC Brief Builder',
    description:
      'Curates a library of viral hooks from social platforms and auto-generates UGC creative briefs tailored to brand voice and audience. Marketing team gets briefs that read like a senior strategist wrote them.',
    outcome: 'Marketing team ships 3× more creative variations per sprint.',
    tools: ['n8n', 'OpenAI', 'Airtable'],
  },
  {
    image: workflowInstagram,
    category: 'data',
    categoryLabel: 'Social Intelligence',
    title: 'Instagram Scraper & Hook Engine',
    description:
      'Scrapes Instagram profiles and posts at scale, analyzes engagement patterns by hour and content type, and surfaces hook ideas for the content team. Weekly digest delivered to Notion ready for the editorial calendar.',
    outcome: 'Replaces a weekly 4-hour manual research session with a Monday-morning report.',
    tools: ['n8n', 'Apify', 'OpenAI'],
  },
];

const categoryColor = (cat: Project['category']) => {
  if (cat === 'data') return '#4ade80';
  if (cat === 'communication') return '#60a5fa';
  return '#fb923c';
};

export const Portfolio = () => {
  return (
    <section id="portfolio" className="section-padding relative overflow-hidden">
      <div className="container-custom relative z-10">
        <SectionHeading
          number="04"
          label="Selected Work"
          title="Production workflows."
          description="Six featured automations running today across data, AI agents, and content systems. Each one shipped to a real client — the full archive lives on Upwork."
        />

        {/* Editorial alternating-row case studies */}
        <div className="max-w-6xl mx-auto">
          {PROJECTS.map((project, index) => {
            const isReversed = index % 2 === 1;
            return (
              <motion.article
                key={project.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
                  index === 0 ? 'pt-2' : 'pt-16 lg:pt-24'
                } ${index < PROJECTS.length - 1 ? 'pb-16 lg:pb-24 border-b border-border/60' : ''}`}
              >
                {/* Image — 7 cols */}
                <div
                  className={`lg:col-span-7 group/img relative ${
                    isReversed ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <div className="relative overflow-hidden border border-border bg-card/30 aspect-[16/10]">
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/img:scale-[1.04]"
                    />
                    {/* Subtle vignette for legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent pointer-events-none" />
                    {/* Category badge — top-left */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 backdrop-blur-sm bg-background/40 px-2.5 py-1 rounded-sm">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: categoryColor(project.category),
                          boxShadow: `0 0 8px ${categoryColor(project.category)}80`,
                        }}
                        aria-hidden
                      />
                      <span className="font-mono text-[10px] text-foreground/90 tracking-[0.2em] uppercase">
                        {project.categoryLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content — 5 cols */}
                <div
                  className={`lg:col-span-5 ${isReversed ? 'lg:order-1 lg:pr-4' : 'lg:order-2 lg:pl-4'}`}
                >
                  {/* Number + arrow */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="font-mono text-xs text-primary tracking-[0.25em] uppercase">
                      {String(index + 1).padStart(2, '0')} / {PROJECTS.length.toString().padStart(2, '0')}
                    </div>
                    <ArrowUpRight
                      className="h-4 w-4 text-muted-foreground/40"
                      aria-hidden
                    />
                  </div>

                  <h3 className="text-2xl md:text-3xl lg:text-[2rem] font-bold tracking-tight text-foreground leading-[1.1] mb-5">
                    {project.title}
                  </h3>

                  <p className="text-base text-muted-foreground leading-relaxed mb-5">
                    {project.description}
                  </p>

                  {/* Outcome — pulled out as the headline value */}
                  <div className="border-l-2 border-primary/60 pl-4 py-1 mb-7">
                    <div className="font-mono text-[10px] text-primary/80 tracking-[0.25em] uppercase mb-1">
                      Outcome
                    </div>
                    <div className="text-sm text-foreground/85 leading-relaxed">
                      {project.outcome}
                    </div>
                  </div>

                  {/* Tools */}
                  <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] text-muted-foreground tracking-wide">
                    {project.tools.map((tool, i) => (
                      <span key={tool} className="flex items-center gap-3">
                        <span className="text-foreground/70">{tool}</span>
                        {i < project.tools.length - 1 && <span className="text-border" aria-hidden>·</span>}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Upwork archive — quiet, editorial */}
        <div className="mt-24 pt-10 border-t border-border max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <div className="font-mono text-[11px] text-primary tracking-[0.25em] uppercase mb-3">More Work</div>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-tight">
                See the full archive on Upwork.
              </h3>
            </div>
            <a
              href="https://www.upwork.com/freelancers/~01ac0c23391406fb0d?nav_dir=pop"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-primary hover:text-primary-glow font-medium text-sm md:text-base self-start md:self-auto"
            >
              View my Upwork profile
              <ArrowUpRight className="h-4 w-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          <a
            href="https://www.upwork.com/freelancers/~01ac0c23391406fb0d?nav_dir=pop"
            target="_blank"
            rel="noopener noreferrer"
            className="block group relative"
          >
            <div className="relative overflow-hidden transition-all duration-300">
              <img
                src={new URL('../assets/upwork-profile-banner-clean.png', import.meta.url).href}
                alt="Eleazar Sebastian M. – Upwork profile preview"
                className="w-full h-auto block"
                style={{
                  marginLeft: '-3px',
                  width: 'calc(100% + 3px)',
                  // Two layered linear masks — horizontal + vertical fade,
                  // intersected so ALL 4 edges fade into the page background.
                  // No more visible rectangular boundary.
                  WebkitMaskImage:
                    'linear-gradient(to right, transparent 0%, #000 14%, #000 86%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%)',
                  WebkitMaskComposite: 'source-in',
                  maskImage:
                    'linear-gradient(to right, transparent 0%, #000 14%, #000 86%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%)',
                  maskComposite: 'intersect',
                }}
              />
              {/* Subtle yellow halo on hover, replaces the static border */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background:
                    'radial-gradient(ellipse 90% 80% at center, transparent 50%, hsl(45 93% 54% / 0.06) 80%, transparent 100%)',
                }}
              />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};
