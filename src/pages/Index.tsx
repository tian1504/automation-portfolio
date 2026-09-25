import { useEffect } from "react";
import { PresenterNav } from "@/components/desk/PresenterNav";
import { DeskStage } from "@/components/desk/DeskStage";
import { AmazonBuilds } from "@/components/desk/AmazonBuilds";
import { Workshop } from "@/components/desk/Workshop";
import { ClientWords } from "@/components/desk/ClientWords";
import { Terms } from "@/components/desk/Terms";
import { DeskClose } from "@/components/desk/DeskClose";

// Old anchors from earlier versions of the site (and shared links) that no
// longer have their own section map to the nearest one that does.
const LEGACY_HASH: Record<string, string> = {
  stack: "builds",
};

const Index = () => {
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
        // would play the pinned hero in fast-forward on the way down).
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
      home: "pin",
      builds: "flow",
      portfolio: "flow",
      testimonials: "flow",
      pricing: "flow",
      contact: "flow",
    };
    Object.entries(acts).forEach(([id, act]) => document.getElementById(id)?.setAttribute("data-sc-act", act));
    document.documentElement.classList.add("sc-ready");
  }, []);

  return (
    <div className="min-h-screen pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0">
      <PresenterNav />
      <main>
        <DeskStage />
        <AmazonBuilds />
        <Workshop />
        <ClientWords />
        <Terms />
        <DeskClose />
      </main>
    </div>
  );
};

export default Index;
