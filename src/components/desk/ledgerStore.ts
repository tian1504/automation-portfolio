import { useEffect, useSyncExternalStore } from "react";
import { CHAPTERS } from "./chapters";

/**
 * The ledger's memory: which chapter the visitor is in, and which builds they
 * have seen. One small store for the whole page (no React state on scroll):
 * the margin index and the phone dock read it, the page writes it.
 * Nothing is saved; a fresh visit starts a fresh ledger.
 */

type State = { current: string | null; seen: ReadonlySet<string> };

let state: State = { current: null, seen: new Set() };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function markSeen(id: string) {
  if (state.seen.has(id)) return;
  const seen = new Set(state.seen);
  seen.add(id);
  state = { ...state, seen };
  emit();
}

function setCurrent(id: string | null) {
  if (state.current === id) return;
  state = { ...state, current: id };
  emit();
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const SERVER: State = { current: null, seen: new Set() };

export function useLedger() {
  return useSyncExternalStore(subscribe, () => state, () => SERVER);
}

/** Every build id in the page, in order. */
export const ALL_BUILDS = CHAPTERS.flatMap((c) => c.builds.map((b) => b.id));

/** The page element for a build: `data-build` carries its id. */
export const buildElementId = (id: string) => `b-${id}`;

/**
 * Watches the page once, from the Index: whichever ledger section is crossing
 * the middle of the screen is current, and a build counts as seen once it has
 * sat in the middle band for a moment (a fast fling past it does not count).
 * Sections can nest (Questions sits inside Prices): the innermost one on the
 * middle line wins. Builds that appear later (a layout swap at a breakpoint)
 * are picked up as they arrive.
 */
export function useLedgerWatch() {
  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>("[data-ledger-section]")];
    const live = new Set<Element>();
    const middle = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) live.add(e.target);
          else live.delete(e.target);
        }
        // Document order: the last live one is the innermost (or the later of two touching ones).
        const inner = sections.filter((s) => live.has(s)).pop();
        if (inner) setCurrent(inner.getAttribute("data-ledger-section"));
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    sections.forEach((s) => middle.observe(s));

    const timers = new Map<Element, number>();
    const band = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = e.target.getAttribute("data-build");
          if (!id) continue;
          if (e.isIntersecting) {
            if (!timers.has(e.target)) {
              timers.set(
                e.target,
                window.setTimeout(() => {
                  markSeen(id);
                  band.unobserve(e.target);
                }, 450),
              );
            }
          } else {
            window.clearTimeout(timers.get(e.target));
            timers.delete(e.target);
          }
        }
      },
      { rootMargin: "-30% 0px -30% 0px" },
    );
    const watched = new WeakSet<Element>();
    const watch = (root: ParentNode) => {
      const found = [...(root instanceof Element && root.matches("[data-build]") ? [root] : []), ...root.querySelectorAll("[data-build]")];
      for (const b of found) {
        const id = b.getAttribute("data-build");
        if (!id || watched.has(b) || state.seen.has(id)) continue;
        watched.add(b);
        band.observe(b);
      }
    };
    watch(document);
    const added = new MutationObserver((records) => {
      for (const r of records) r.addedNodes.forEach((n) => n instanceof Element && watch(n));
    });
    added.observe(document.querySelector("main") ?? document.body, { childList: true, subtree: true });

    return () => {
      middle.disconnect();
      band.disconnect();
      added.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);
}
