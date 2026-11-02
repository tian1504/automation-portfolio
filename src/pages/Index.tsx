import { useEffect } from "react";
import { Ledger } from "@/components/desk/Ledger";
import { TitlePage } from "@/components/desk/TitlePage";
import { Chapter } from "@/components/desk/Chapter";
import { ClaudeCodeChapter } from "@/components/desk/ClaudeCodeChapter";
import { PlatePair, ShotPlate } from "@/components/desk/ShotPlates";
import { VoiceChapter } from "@/components/desk/VoiceChapter";
import { EcommerceChapter } from "@/components/desk/AmazonBuilds";
import { OutreachChapter } from "@/components/desk/OutreachChapter";
import { WorkDialogHost } from "@/components/desk/Workshop";
import { ClientWords } from "@/components/desk/ClientWords";
import { Terms } from "@/components/desk/Terms";
import { DeskClose } from "@/components/desk/DeskClose";
import { useLedgerWatch } from "@/components/desk/ledgerStore";

// Old anchors from earlier versions of the site (and shared links) that no
// longer have their own section map to the nearest one that does.
const LEGACY_HASH: Record<string, string> = {
  stack: "claude-code",
  portfolio: "agents",
};

/**
 * The homepage as five chapters, one per kind of work, each on its own
 * ground: Claude Code, AI agents, voice and chat agents, outreach and
 * marketing, e-commerce. The ledger in the margin keeps track of what has been seen.
 * Then what clients say, how it works and costs, and the close.
 */
const Index = () => {
  useLedgerWatch();

  // Arriving with a hash (cross-page back-links like /#builds): react-router
  // doesn't auto-scroll, and images shift layout as they load, so re-run the
  // jump a few times until it settles.
  useEffect(() => {
    const raw = window.location.hash.slice(1);
    if (!raw) return;
    const id = LEGACY_HASH[raw] ?? raw;
    let tries = 0;
    const timers: number[] = [];
    const scroll = () => {
      const el = document.getElementById(id);
      if (el) {
        // Instant, even though html is scroll-behavior: smooth (a smooth jump
        // would run every chapter's cover on the way down).
        const top = el.getBoundingClientRect().top + window.scrollY - parseFloat(getComputedStyle(el).scrollMarginTop || "0");
        window.scrollTo({ top, behavior: "instant" });
      }
      if (++tries < 3) timers.push(window.setTimeout(scroll, 200));
      // Once arrived, drop the hash (keeping router state) so Back and reload
      // restore the visitor's own position instead of jumping here again.
      else history.replaceState(history.state, "", window.location.pathname + window.location.search);
    };
    timers.push(window.setTimeout(scroll, 60));
    return () => timers.forEach(window.clearTimeout);
  }, []);

  // Dev only: label each act for the scrollcraft verification harness
  // (scripts/shoot.mjs samples per act and waits for html.sc-ready).
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const acts: Record<string, string> = {
      home: "flow",
      "claude-code": "flow",
      agents: "flow",
      voice: "flow",
      ecommerce: "flow",
      outreach: "flow",
      testimonials: "flow",
      pricing: "flow",
      contact: "flow",
    };
    Object.entries(acts).forEach(([id, act]) => document.getElementById(id)?.setAttribute("data-sc-act", act));
    document.documentElement.classList.add("sc-ready");
  }, []);

  return (
    <div className="min-h-screen pb-[calc(4rem+env(safe-area-inset-bottom))] xl:pb-0">
      <Ledger />
      <main className="xl:pl-[17rem]">
        <TitlePage />
        <Chapter id="claude-code">
          <ClaudeCodeChapter />
        </Chapter>
        <Chapter id="agents">
          <div className="mx-auto w-full max-w-[1200px] px-5 pb-24 pt-20 sm:px-8 md:pb-32 md:pt-28">
            <h3 className="max-w-[24ch] font-display text-[clamp(1.5rem,2.6vw,2.1rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-foreground">
              Three parts of one IT troubleshooting engine, built for one client.
            </h3>
            <div className="mt-12 space-y-24 md:mt-16 md:space-y-36">
              <ShotPlate id="deductive-labs" variant="feature" />
              <PlatePair ids={["multi-agent", "internal-gpt"]} />
            </div>
          </div>
        </Chapter>
        <Chapter id="voice">
          <VoiceChapter />
        </Chapter>
        <Chapter id="outreach">
          <OutreachChapter />
        </Chapter>
        <Chapter id="ecommerce">
          <EcommerceChapter />
        </Chapter>
        <ClientWords />
        <Terms />
        <DeskClose />
      </main>
      <WorkDialogHost />
    </div>
  );
};

export default Index;
