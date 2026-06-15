import { useState } from "react";
import { ArrowUpRight, Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import type { Answers, AuditPlan } from "@/lib/auditPlan";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CALENDLY = "https://calendly.com/tian1504/30min";

// TODO: wire to n8n — POST { email, answers, plan } to a webhook that emails the
// plan and creates a CRM lead. Left intentionally client-side for the demo.
const WEBHOOK_URL = ""; // TODO

export function CaptureCard({ plan, answers }: { plan: AuditPlan; answers: Answers }) {
  const [showEmail, setShowEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  void plan;
  void answers;
  void WEBHOOK_URL;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      toast.error("That email doesn't look right — mind checking it?");
      return;
    }
    // No network call in the demo; this is where the n8n webhook would fire.
    setSubmitted(true);
    toast.success(`Got it — I'll send your plan to ${email} shortly.`);
  };

  return (
    <div className="rounded-xl border border-border bg-card/40 p-6 md:p-7">
      <h3 className="text-lg md:text-xl font-bold text-foreground tracking-tight">
        Want this plan — and want it built?
      </h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        Book a call and we'll turn this into a working system, or have it sent to your inbox to sit on.
      </p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" className="group h-11 w-full sm:w-auto">
          <a href={CALENDLY} target="_blank" rel="noopener noreferrer">
            Book a 30-min call to build this
            <ArrowUpRight className="ml-2 h-4 w-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </Button>
        {!showEmail && !submitted && (
          <Button variant="outline" size="lg" className="h-11 w-full sm:w-auto" onClick={() => setShowEmail(true)}>
            <Mail className="mr-2 h-4 w-4" />
            Email me this plan
          </Button>
        )}
      </div>

      {showEmail && !submitted && (
        <form onSubmit={submit} className="mt-4 flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            aria-label="Your email"
            className="w-full h-11 rounded-md border border-border bg-background px-4 text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button type="submit" variant="outline" size="lg" className="h-11 shrink-0">
            Send it
          </Button>
        </form>
      )}

      {submitted && (
        <div className="mt-4 flex items-center gap-2 text-sm text-foreground">
          <Check className="h-4 w-4 text-primary" />
          On its way — check your inbox shortly.
        </div>
      )}

      <p className="mt-5 font-mono text-[11px] leading-relaxed text-muted-foreground/70">
        This plan was generated from your answers by a rules engine — the same logic I wire into
        n8n + an LLM for clients. Want it running live on your real data? That's the call.
      </p>
    </div>
  );
}
