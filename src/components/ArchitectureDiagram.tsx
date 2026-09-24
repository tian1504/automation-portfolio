import type { LucideIcon } from "lucide-react";

export type DiagramStep = { icon: LucideIcon; label: string; sub: string };

export function ArchitectureDiagram({ steps, caption }: { steps: DiagramStep[]; caption: string }) {
  return (
    <div className="relative flex flex-col sm:aspect-[16/10]">
      {/* Static dot backdrop: texture without the cursor tricks */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(hsl(45 30% 45% / 0.13) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="relative flex-1 flex items-center justify-center px-5 pt-6 pb-4">
        <div className="w-full max-w-[420px]">
          {steps.map((step, i) => (
            <div key={step.label}>
              <div className="group/node flex items-center gap-3.5 border border-border bg-background/80 px-4 py-2.5 rounded-sm transition-colors duration-300 hover:border-primary/50">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-sm border border-primary/25 bg-primary/10 text-primary">
                  <step.icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[11px] md:text-xs text-foreground tracking-wide break-words sm:truncate">
                    {step.label}
                  </span>
                  <span className="block font-mono text-[10px] text-muted-foreground break-words sm:truncate mt-0.5 leading-snug">
                    {step.sub}
                  </span>
                </span>
                <span className="font-mono text-[9px] text-primary/50 tracking-widest flex-shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="relative mx-auto h-4 w-px bg-gradient-to-b from-primary/40 via-border to-primary/40">
                  <span
                    className="arch-pulse absolute left-1/2 -translate-x-1/2 h-[3px] w-[3px] rounded-full bg-primary motion-reduce:hidden"
                    style={{ animationDelay: `${i * 0.45}s` }}
                    aria-hidden
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="relative px-4 pb-3 flex">
        <span className="font-mono text-[10px] tracking-wide text-muted-foreground/80 border border-border/60 bg-background/70 rounded-sm px-2 py-1 break-words sm:truncate">
          {caption}
        </span>
      </div>
    </div>
  );
}
