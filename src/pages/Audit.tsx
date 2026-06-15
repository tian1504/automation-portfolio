import { Link } from "react-router-dom";
import { AuditFunnel } from "@/components/audit/AuditFunnel";

const Audit = () => (
  <div className="min-h-screen flex flex-col">
    {/* Minimal top bar — no full nav; this is a single-purpose page */}
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="container-custom h-14 flex items-center justify-between">
        <Link to="/" className="font-display font-bold tracking-tight text-base text-foreground">
          Eleazar<span className="text-primary">.</span>
        </Link>
        <Link
          to="/"
          className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors rounded-sm px-1 py-1 -mx-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          ← Back to site
        </Link>
      </div>
    </header>

    <main className="container-custom max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center py-12 md:py-20">
      <AuditFunnel />
    </main>
  </div>
);

export default Audit;
