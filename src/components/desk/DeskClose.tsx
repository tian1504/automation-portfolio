import { Fragment, useRef, type MouseEvent } from "react";
import { cubicBezier, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import {
  BOOKING_URL,
  EMAIL,
  EMAIL_URL,
  GITHUB_URL,
  LINKEDIN_URL,
  UPWORK_URL,
  revealAt,
} from "@/lib/desk";
import deskLg from "@/assets/desk/close-desk.webp";
import deskSm from "@/assets/desk/close-desk-sm.webp";

/**
 * ACT 8, "At the desk" (resolve). The bookend keeps the opening's layout (copy
 * on the left, the picture on the right) but not its picture: the opening
 * meets you face to face, the close shows him at work, in the evening, with
 * the real seller dashboard on the monitor and a real n8n editor on the
 * laptop. The photo settles a few pixels on entry, then everything holds.
 * Nothing follows this section; the footer line lives inside it.
 */

/** Profiles open in a new tab. The address (mailto) is listed before them. */
const PROFILES = [
  { label: "LinkedIn", href: LINKEDIN_URL },
  { label: "Upwork", href: UPWORK_URL },
  { label: "GitHub", href: GITHUB_URL },
] as const;

/** Wrapped only between sentences, so no line ends on a stray word. */
const REDUCERS = [
  "Fixed price per milestone.",
  "Runs on your accounts.",
  "Code, credentials and docs stay yours.",
] as const;

const LINK =
  "group inline-flex h-11 items-center gap-1 text-[14px] text-foreground underline decoration-border underline-offset-4 transition-colors duration-150 ease-out-strong active:text-muted-foreground sm:text-[15px] [@media(min-width:1024px)_and_(pointer:fine)]:h-9 [@media(hover:hover)_and_(pointer:fine)]:hover:decoration-foreground";

/** The photo melts into the page on every side the copy or the section edge touches. */
const PHOTO_MASK_DESK =
  "linear-gradient(to right, transparent 0%, #000 26%), linear-gradient(to bottom, transparent 0%, #000 18%, #000 86%, transparent 100%)";
const PHOTO_MASK_PHONE =
  "linear-gradient(to bottom, #000 62%, transparent 100%), linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)";

const settle = cubicBezier(0.5, 1, 0.89, 1);

/**
 * The address is printed so it can be read and copied anywhere. Dragging
 * across it to select it does not open the mail app; a still click, a tap or
 * Enter always does.
 */
function useSelectableMailto() {
  const press = useRef<[number, number] | null>(null);
  const onMouseDown = (e: MouseEvent<HTMLAnchorElement>) => {
    press.current = [e.clientX, e.clientY];
  };
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const at = press.current;
    press.current = null;
    const dragged = at !== null && Math.hypot(e.clientX - at[0], e.clientY - at[1]) > 3;
    if (e.detail > 0 && dragged && !window.getSelection()?.isCollapsed) e.preventDefault();
  };
  return { onMouseDown, onClick };
}

export const DeskClose = () => {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const rv = (i: number) => (reduce ? {} : revealAt(i));
  const mailto = useSelectableMailto();

  // 0 when the section's top meets the viewport bottom, 1 when it docks at the top.
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const photoY = useTransform(p, [0.05, 0.85], [28, 0], { ease: settle });
  const photoScale = useTransform(p, [0.05, 0.85], [1.035, 1], { ease: settle });

  const maskStyle = (mask: string, composite: boolean) => ({
    WebkitMaskImage: mask,
    maskImage: mask,
    ...(composite ? { WebkitMaskComposite: "source-in", maskComposite: "intersect" as const } : {}),
  });

  return (
    <section
      id="contact"
      ref={ref}
      aria-labelledby="close-title"
      className="relative isolate overflow-hidden bg-background [overflow:clip] lg:min-h-svh"
    >
      {/* The picture: him at work. Decorative (the copy carries the meaning). */}
      <div
        aria-hidden
        className="relative w-full lg:absolute lg:bottom-0 lg:right-0 lg:w-[min(70vw,calc((100svh-2rem)*1.777))]"
      >
        <motion.div
          className="aspect-[4/3] w-full sm:aspect-[16/10] lg:aspect-[1388/781]"
          style={reduce ? undefined : { y: photoY, scale: photoScale }}
        >
          <img
            src={deskLg}
            srcSet={`${deskSm} 900w, ${deskLg} 1388w`}
            sizes="(max-width: 1023px) 100vw, 70vw"
            alt=""
            width={1388}
            height={781}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="hidden h-full w-full select-none object-cover lg:block"
            style={maskStyle(PHOTO_MASK_DESK, true)}
          />
          <img
            src={deskLg}
            srcSet={`${deskSm} 900w, ${deskLg} 1388w`}
            sizes="100vw"
            alt=""
            width={1388}
            height={781}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="h-full w-full select-none object-cover object-[68%_50%] lg:hidden"
            style={maskStyle(PHOTO_MASK_PHONE, true)}
          />
        </motion.div>
      </div>

      {/* Desktop: a column of density under the copy only (never a full-frame
          overlay), so the photo keeps its contrast to the right of the text. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] hidden lg:block"
        style={{
          background:
            "linear-gradient(90deg, hsl(var(--background)) 0, hsl(var(--background) / 0.9) calc(max(8vw, (100vw - 1200px) / 2 + 2rem) + min(34vw, 470px) - 2rem), hsl(var(--background) / 0) calc(max(8vw, (100vw - 1200px) / 2 + 2rem) + min(34vw, 470px) + 9rem))",
        }}
      />

      {/* The copy, where the opening's headline sat. */}
      <div className="relative z-10 -mt-12 flex flex-col px-5 pb-8 sm:-mt-16 sm:px-8 lg:mt-0 lg:min-h-svh lg:justify-center lg:py-24 lg:pl-[max(8vw,calc((100vw-1200px)/2+2rem))] lg:pr-0">
        <div className="max-w-[520px] lg:w-[min(34vw,470px)]">
          <motion.h2
            id="close-title"
            {...rv(0)}
            className="h-section font-display font-semibold text-foreground"
          >
            Tell me what you check every morning.
          </motion.h2>
          <motion.p
            {...rv(1)}
            className="mt-4 max-w-[46ch] text-base leading-relaxed text-muted-foreground md:text-[17px]"
          >
            In 30 minutes, I’ll tell you plainly if I can automate it and what it would take. If
            it’s outside my lane, I’ll say so.
          </motion.p>
          <motion.div
            {...rv(2)}
            className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5"
          >
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 shrink-0 items-center justify-center self-start rounded-md bg-primary px-5 font-medium text-primary-foreground transition-[transform,background-color] duration-150 ease-out-strong active:scale-[0.97] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-primary/90"
            >
              Book a call
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <p className="text-sm leading-snug text-muted-foreground">
              I’m taking new projects,
              <br className="hidden sm:inline" /> and I usually reply within 24 hours.
            </p>
          </motion.div>
          <motion.p
            {...rv(3)}
            className="mt-7 max-w-[44ch] border-t border-border pt-4 text-[15px] leading-snug text-foreground/80 [text-wrap:balance]"
          >
            {REDUCERS.map((r) => (
              <Fragment key={r}>
                <span className="whitespace-nowrap">{r}</span>{" "}
              </Fragment>
            ))}
          </motion.p>

          {/* Colophon: quiet channels, then the last line on the page. */}
          <motion.div {...rv(4)} className="mt-8 lg:mt-12">
            <ul className="flex flex-wrap gap-x-5 gap-y-0 sm:gap-x-6">
              <li>
                {/* mailto hands off to the visitor's mail app; it opens no tab,
                    so it carries no arrow and no new-tab note. */}
                <a href={EMAIL_URL} draggable={false} {...mailto} className={`${LINK} select-text`}>
                  {EMAIL}
                </a>
              </li>
              {PROFILES.map((c) => (
                <li key={c.label}>
                  <a href={c.href} target="_blank" rel="noopener noreferrer" className={LINK}>
                    {c.label}
                    <ArrowUpRight
                      aria-hidden
                      className="hidden h-3.5 w-3.5 text-muted-foreground transition-[transform,color] duration-150 ease-out-strong sm:block [@media(hover:hover)_and_(pointer:fine)]:group-hover:-translate-y-px [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-px [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-foreground"
                    />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              © 2026 Eleazar Sebastian Martinez. Built in React, with entirely too much n8n.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
