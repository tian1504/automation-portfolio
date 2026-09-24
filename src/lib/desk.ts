import { useEffect, useState } from "react";

/** The one action on the site. One label ("Book a call"), one destination. */
export const BOOKING_URL = "https://calendly.com/tian1504/30min";
export const UPWORK_URL = "https://www.upwork.com/freelancers/~01ac0c23391406fb0d?nav_dir=pop";
export const EMAIL = "tian1504@gmail.com";
/** mailto, so phones and in-app browsers hand it to a mail app (no sign-in wall). */
export const EMAIL_URL = `mailto:${EMAIL}`;
export const LINKEDIN_URL = "https://www.linkedin.com/in/eleazar-sebastian-martinez-76210983/";
export const GITHUB_URL = "https://github.com/tian1504";

/** Strong ease-out used for every UI and entrance transition on the page. */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/**
 * Visitors who ask for less motion get entrances that start in place. Motion's
 * WAAPI fade drops back to its inline `opacity: 0` for one painted frame when a
 * fade finishes, which reads as a blink; with no fade there is nothing to blink.
 * Read once at load (a live preference change applies on the next visit).
 */
const PREFERS_REDUCED =
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Entrance for ordinary flow content: a 14px rise and a fade over 620ms,
 * fired once, slightly inside the viewport. Spread onto a motion element.
 */
export const reveal = {
  initial: PREFERS_REDUCED ? (false as const) : { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "0px 0px -12% 0px" },
  transition: PREFERS_REDUCED ? { duration: 0 } : { duration: 0.62, ease: EASE_OUT },
};

/** Stagger helper for a list of reveals (30 to 80ms apart). */
export const revealAt = (i: number, step = 0.06) => ({
  ...reveal,
  transition: { ...reveal.transition, delay: PREFERS_REDUCED ? 0 : i * step },
});

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

/** Phone layout: below Tailwind's lg breakpoint the page uses the bottom dock. */
export const PHONE_QUERY = "(max-width: 1023.98px)";
export const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";

/**
 * Jump to an in-page anchor, instantly when the visitor prefers reduced motion.
 * The URL is left alone (no stale hash for Back or reload to jump to), and
 * keyboard focus moves with the view so the next Tab continues from there.
 * `focusId` names a different element to focus when the anchor itself is not
 * focusable content (e.g. #work, which sits inside the pinned stage).
 */
export function jumpTo(id: string, focusId?: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  const target = (focusId && document.getElementById(focusId)) || el;
  if (!target.hasAttribute("tabindex") && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(target.tagName)) {
    target.setAttribute("tabindex", "-1");
  }
  target.focus({ preventScroll: true });
}
