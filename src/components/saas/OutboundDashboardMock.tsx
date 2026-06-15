import { GitBranch, Check, Clock, X } from "lucide-react";

/**
 * OutboundDashboardMock — a designed product-UI for the "AI Outbound Engine"
 * concept (extends Eleazar's real Apollo lead-scraper work). Real React/Tailwind
 * so it stays retina-crisp. Honestly framed as an illustrative mock, not a live app.
 * Yellow is rationed to the ICP-fit bars + the single "Interested" reply pill.
 */

type Enrich = "Enriched" | "Pending" | "Failed";
type Outreach = "Interested" | "Opened" | "Sent" | "Queued" | "Bounced";

type Lead = {
  name: string;
  initials: string;
  title: string;
  company: string;
  headcount: number;
  icp: number;
  enrich: Enrich;
  outreach: Outreach;
  warm?: boolean;
};

const LEADS: Lead[] = [
  { name: "Priya N.", initials: "PN", title: "Head of Ops", company: "DeductiveLabs", headcount: 38, icp: 94, enrich: "Enriched", outreach: "Interested", warm: true },
  { name: "Marcus T.", initials: "MT", title: "VP Sales", company: "Northfield", headcount: 120, icp: 88, enrich: "Enriched", outreach: "Opened" },
  { name: "Lena K.", initials: "LK", title: "Founder", company: "Brightloop", headcount: 12, icp: 82, enrich: "Enriched", outreach: "Sent" },
  { name: "David R.", initials: "DR", title: "Ops Lead", company: "Cohort Labs", headcount: 45, icp: 76, enrich: "Pending", outreach: "Queued" },
  { name: "Sofia M.", initials: "SM", title: "Head of Growth", company: "Vantage", headcount: 60, icp: 71, enrich: "Enriched", outreach: "Sent" },
  { name: "Tomas G.", initials: "TG", title: "COO", company: "Mailspring", headcount: 24, icp: 67, enrich: "Failed", outreach: "Bounced" },
  { name: "Aisha B.", initials: "AB", title: "RevOps", company: "Greenline", headcount: 95, icp: 63, enrich: "Enriched", outreach: "Opened" },
];

function IcpBar({ score }: { score: number }) {
  const filled = Math.max(1, Math.min(5, Math.round(score / 20)));
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5" aria-hidden>
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={`h-3 w-1 rounded-sm ${i < filled ? "bg-primary" : "bg-border"}`} />
        ))}
      </div>
      <span className="font-mono text-[11px] text-muted-foreground tabular-nums">{score}</span>
    </div>
  );
}

function EnrichChip({ state }: { state: Enrich }) {
  const map = {
    Enriched: { cls: "border-border text-foreground/80", Icon: Check },
    Pending: { cls: "border-border/60 text-muted-foreground", Icon: Clock },
    Failed: { cls: "border-destructive/40 text-destructive/80", Icon: X },
  } as const;
  const { cls, Icon } = map[state];
  return (
    <span className={`inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 font-mono text-[10px] ${cls}`}>
      <Icon className="h-3 w-3" /> {state}
    </span>
  );
}

function OutreachPill({ state }: { state: Outreach }) {
  const map: Record<Outreach, string> = {
    Interested: "border-primary/50 bg-primary/10 text-primary",
    Opened: "border-border/60 text-muted-foreground",
    Sent: "border-border text-foreground/70",
    Queued: "border-border/50 text-muted-foreground/70",
    Bounced: "border-destructive/40 text-destructive/80",
  };
  const label = state === "Interested" ? "Replied · Interested" : state;
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] ${map[state]}`}>
      {label}
    </span>
  );
}

function Metric({ label, value, modeled }: { label: string; value: string; modeled?: boolean }) {
  return (
    <div className="px-4 py-3">
      <div className="font-display font-bold text-lg md:text-xl text-foreground tracking-tight">{value}</div>
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-0.5">
        {label}
        {modeled && <sup className="ml-0.5 lowercase tracking-normal text-muted-foreground/60">modeled</sup>}
      </div>
    </div>
  );
}

const ARIA =
  "Product mock of the AI Outbound Engine: a lead table scored by ICP fit with enrichment and reply status, alongside an AI-written icebreaker for the top warm lead.";

export function OutboundDashboardMock({ className = "" }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label={ARIA}
      className={`rounded-xl border border-border bg-card/60 backdrop-blur-sm shadow-xl shadow-black/30 overflow-hidden ${className}`}
    >
      {/* Chrome */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-secondary/40">
        <GitBranch className="h-3 w-3 text-primary/80" aria-hidden />
        <span className="font-mono text-[11px] text-muted-foreground tracking-wide">outbound-engine</span>
        <span className="font-mono text-[10px] text-muted-foreground/55">· n8n + OpenAI</span>
        <span className="ml-auto flex items-center gap-3 font-mono text-[10px] text-muted-foreground">
          <span className="hidden sm:inline">247 leads in pipeline</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary/50" aria-hidden />
            live · concept
          </span>
        </span>
      </div>

      {/* Metrics rail */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border/60 border-b border-border">
        <Metric label="Leads enriched" value="200+" />
        <Metric label="Reply rate" value="7.4%" modeled />
        <Metric label="Hrs saved/wk" value="~15" modeled />
        <Metric label="Awaiting rep" value="6" />
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Lead table */}
        <div className="lg:col-span-8 lg:border-r border-border overflow-x-auto">
          <div className="min-w-[520px]">
            <div className="grid grid-cols-[1.6fr_1.3fr_0.9fr_0.9fr] gap-3 px-4 py-2 border-b border-border/60 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <span>Lead</span>
              <span>Company</span>
              <span>ICP fit</span>
              <span>Outreach</span>
            </div>
            {LEADS.map((l) => (
              <div
                key={l.name}
                className={`grid grid-cols-[1.6fr_1.3fr_0.9fr_0.9fr] gap-3 px-4 py-3 items-center border-b border-border/40 ${
                  l.warm ? "bg-primary/[0.04] ring-1 ring-inset ring-primary/30" : "hover:bg-foreground/[0.02]"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-card font-mono text-[10px] text-muted-foreground">
                    {l.initials}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm text-foreground truncate">{l.name}</span>
                    <span className="block font-mono text-[10px] text-muted-foreground truncate">{l.title}</span>
                  </span>
                </div>
                <div className="min-w-0">
                  <span className="block text-sm text-foreground/90 truncate">{l.company}</span>
                  <span className="inline-block mt-0.5 rounded-sm border border-border/60 px-1.5 font-mono text-[10px] text-muted-foreground">
                    {l.headcount}
                  </span>
                </div>
                <IcpBar score={l.icp} />
                <div className="flex flex-col items-start gap-1">
                  <OutreachPill state={l.outreach} />
                  <EnrichChip state={l.enrich} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI icebreaker panel */}
        <div className="lg:col-span-4 p-4 bg-secondary/20">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">AI-written icebreaker</span>
            <span className="font-mono text-[9px] text-muted-foreground/60">sample</span>
          </div>
          <div className="rounded-lg border border-border bg-card/60 p-3">
            <div className="font-mono text-[10px] text-muted-foreground mb-2">
              TO: Priya N. · Head of Ops · DeductiveLabs
            </div>
            <p className="text-[13px] text-foreground/90 leading-relaxed">
              Saw DeductiveLabs just shipped the triage-report-to-Supabase flow — slick. Most ops teams
              I work with hit a wall right after that launch: the diagnoses scale, the follow-up doesn't.
              Curious how you're handling that handoff?
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["signal: product launch", "role: Ops", "team: 38"].map((s) => (
                <span key={s} className="rounded-sm border border-border/60 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <span className="rounded-md border border-border px-2 py-1 font-mono text-[10px] text-muted-foreground">Regenerate</span>
              <span className="rounded-md border border-border px-2 py-1 font-mono text-[10px] text-foreground/70">Approve &amp; send</span>
            </div>
          </div>
          <div className="mt-2 space-y-2">
            {[
              { to: "Marcus T. · Northfield", line: "Northfield's outbound motion is clearly working — the gap is usually research time per rep…" },
              { to: "Lena K. · Brightloop", line: "Founders at Brightloop's stage rarely have time to personalize at volume…" },
            ].map((q) => (
              <div key={q.to} className="rounded-lg border border-border/60 bg-card/30 p-2.5">
                <div className="font-mono text-[10px] text-muted-foreground mb-0.5">TO: {q.to}</div>
                <p className="text-[11px] text-muted-foreground/80 leading-snug line-clamp-1">{q.line}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Caption */}
      <div className="px-3 py-2 border-t border-border bg-secondary/30">
        <span className="font-mono text-[10px] tracking-wide text-muted-foreground/70">
          illustrative product mock — not a live app
        </span>
      </div>
    </div>
  );
}
