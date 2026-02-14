import { Button } from "@/components/ui/button";
import { TubesCursor } from "@/components/ui/tubes-cursor";

export function TubesHero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background canvas */}
      <div className="absolute inset-0 z-0">
        <TubesCursor />
        {/* Readability overlay */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      </div>

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center pointer-events-none">
        {/* Let clicks pass through to the canvas except buttons */}
        <div className="max-w-2xl space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
            AI-powered troubleshooting with session memory
          </h1>
          <p className="text-lg md:text-xl text-white/80">
            Continuous conversation, faster root-cause isolation, and clean technical reports.
          </p>
        </div>

        <div className="mt-8 flex gap-4 pointer-events-auto">
          <Button size="lg">Try the Demo</Button>
          <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
            View Portfolio
          </Button>
        </div>

        <p className="mt-12 text-sm text-white/50">
          Tip: click on the empty background area to change colors.
        </p>
      </div>
    </section>
  );
}
