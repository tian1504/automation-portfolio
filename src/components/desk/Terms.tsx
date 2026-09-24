import { Fragment, useLayoutEffect, useRef, useState, type RefObject } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { BOOKING_URL, PHONE_QUERY, reveal, revealAt, useMediaQuery } from "@/lib/desk";

/**
 * Act 7, "The terms". The one bone-paper section: a hard ground cut, a price
 * ledger (rows, not cards), a process ruler that draws itself from the steps
 * block's own scroll progress, and the questions folded away.
 */

type Plan = {
  name: string;
  tag?: string;
  from: string;
  to?: string;
  unit: string;
  covers: string[];
};

const PLANS: Plan[] = [
  {
    name: "Amazon System Build",
    tag: "The specialty",
    from: "$900",
    to: "$2,400",
    unit: "per build",
    covers: [
      "SP-API sync workflows for orders, inventory, financials and returns",
      "Live seller dashboards with re-order alerts",
      "Sourcing and buy-decision tools",
      "Runs on your accounts, credentials stay yours",
      "Handoff doc and recorded walkthrough",
    ],
  },
  {
    name: "AI Agent and Workflow Build",
    from: "$600",
    to: "$1,800",
    unit: "per build",
    covers: [
      "AI customer agents that know your knowledge base",
      "n8n and Make workflows",
      "Internal AI assistants that answer with citations",
      "Data pipelines",
      "API and CRM integrations",
    ],
  },
  {
    name: "Maintenance and Growth",
    from: "$200",
    unit: "a month",
    covers: [
      "Up to 5 hours of updates a month",
      "Monitoring and small fixes",
      "Priority support",
      "A monthly summary",
    ],
  },
];

const STEPS = [
  {
    when: "Day 1",
    title: "Call and audit",
    body: "A 30-minute call. I look at your current setup, ask where the hours go, and point out what is worth automating first.",
  },
  {
    when: "Days 2 to 3",
    title: "Written scope",
    body: "Deliverables, timeline and a fixed price per milestone, in writing. You sign off before I start.",
  },
  {
    when: "1 to 3 weeks",
    title: "Build",
    body: "I work in your tools, so the handoff is clean. You see working pieces every few days, with a weekly check-in.",
  },
  {
    when: "Final week",
    title: "Handoff",
    body: "It runs on your accounts, with full documentation and a recorded walkthrough. Yours to keep.",
  },
];

const FAQS = [
  {
    q: "How long does a typical build take?",
    a: "Most builds take 1 to 3 weeks from signed scope to handoff. Full audits and small fixes take 3 to 5 days. AI agent and knowledge base projects take 2 to 4 weeks, depending on their size.",
  },
  {
    q: "Do you sign NDAs?",
    a: "Yes. I’m happy to sign a mutual NDA before we start, and I already work with several clients under NDA.",
  },
  {
    q: "Do you work with my team’s existing tools?",
    a: "Yes. I work in your stack: Slack, Notion, HubSpot, Airtable, Sheets or whatever you already use. I’m not tied to one platform, so I pick the right tool for the job.",
  },
  {
    q: "What’s not included in a build?",
    a: "Your hosting (AWS or GCP), domain costs and third-party API spend such as OpenAI, Apify or Pinecone. They are listed in the scope, and I don’t mark them up.",
  },
  {
    q: "Do you offer ongoing maintenance?",
    a: "Yes. The $200 a month Maintenance and Growth plan covers up to 5 hours of updates, monitoring and small fixes. Bigger ongoing work is priced per scope.",
  },
  {
    q: "Can you train my team to maintain the workflows?",
    a: "Yes. Every build comes with documentation, and I can run paid training sessions so your team can extend and fix the workflows without me.",
  },
];

/* ------------------------------------------------------------------ ledger */

/** The spaces are real text (inside the small "to" and before the unit), so
 *  copy-paste, search snippets and screen readers get "$900 to $2,400 per
 *  build", not "$900to$2,400per build". The range itself never splits. */
const Price = ({ plan }: { plan: Plan }) => (
  <p className="font-display font-semibold tracking-tight text-foreground tabular">
    <span className="whitespace-nowrap text-[26px] leading-none sm:text-[28px] lg:text-[32px]">
      {plan.from}
      {plan.to && (
        <>
          <span className="text-[16px] font-normal tracking-normal text-muted-foreground">
            {" to "}
          </span>
          {plan.to}
        </>
      )}
    </span>{" "}
    <span className="ml-1 text-[15px] font-normal tracking-normal text-muted-foreground lg:ml-0 lg:mt-1.5 lg:block">
      {plan.unit}
    </span>
  </p>
);

/** Sets one covered item so it wraps cleanly: a hyphenated word ("re-order",
 *  "SP-API") never breaks at its hyphen, and the first two and last two words
 *  are held together, so a wrap never strands one word that reads as part of
 *  the item before or after it ("knowledge / base", "Internal / AI"). */
const setItem = (text: string) => {
  const words = text.split(" ");
  const last = words.length - 1;
  return words.map((w, k) => (
    <Fragment key={k}>
      {w.includes("-") ? <span className="whitespace-nowrap">{w}</span> : w}
      {k < last && (k === 0 || k === last - 1 ? " " : " ")}
    </Fragment>
  ));
};

/** A dot only separates two items that share a line. Where the next item wraps
 *  to a new line, the line break already separates them, so the dot that would
 *  end the line is hidden. Only its opacity changes: it keeps its width (hiding
 *  it never moves a break) and copied text still reads "alerts · Sourcing".
 *  Re-measured when the block resizes or a font finishes loading, never per
 *  scroll frame. */
function useLineEndDots(ref: RefObject<HTMLElement>) {
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const measure = () => {
      const items = Array.from(root.querySelectorAll<HTMLElement>("li"));
      items.forEach((li, j) => {
        const dot = li.querySelector<HTMLElement>("[data-dot]");
        const next = items[j + 1];
        if (!dot || !next) return;
        const a = dot.getBoundingClientRect();
        const b = Array.from(next.getClientRects()).find((r) => r.width > 0);
        dot.style.opacity = b && b.top > a.top + a.height * 0.6 ? "0" : "";
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    document.fonts?.addEventListener("loadingdone", measure);
    return () => {
      ro.disconnect();
      document.fonts?.removeEventListener("loadingdone", measure);
    };
  }, [ref]);
}

/** What a plan covers, set as one run-in line (a price sheet, not a feature list).
 *  The dot rides on the end of each item, so a wrap never starts a line with
 *  it, and it is hidden where it would end one. A short item moves to the next
 *  line whole instead of splitting; it only wraps inside itself when it is
 *  wider than the whole line (a 320px screen, large text), so it can never
 *  push the page sideways. */
const Covers = ({ items }: { items: string[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  useLineEndDots(ref);
  return (
    <div ref={ref} className="text-[15px] leading-[1.65] text-muted-foreground">
      <span className="label-mono mr-2 text-foreground">Covers</span>{" "}
      <ul className="inline">
        {items.map((c, j) => (
          <Fragment key={c}>
            <li className={c.length <= 38 ? "inline-block max-w-full" : "inline"}>
              {setItem(c)}
              {j < items.length - 1 && (
                <span aria-hidden data-dot className="px-1 text-foreground/40">
                  {" ·"}
                </span>
              )}
            </li>{" "}
          </Fragment>
        ))}
      </ul>
    </div>
  );
};

const LedgerRow = ({ plan, i }: { plan: Plan; i: number }) => (
  <motion.li
    {...revealAt(i, 0.07)}
    className={`grid grid-cols-1 gap-y-2.5 border-b py-5 sm:gap-y-3 sm:grid-cols-[1fr_auto] sm:gap-x-8 sm:py-6 lg:grid-cols-12 lg:items-baseline lg:py-7 ${
      i === PLANS.length - 1 ? "border-foreground" : "border-border"
    } ${plan.tag ? "lg:pt-12" : ""}`}
  >
    <div className="relative lg:col-span-4">
      {plan.tag && (
        <p className="label-mono mb-2.5 text-foreground lg:absolute lg:-top-6 lg:mb-0">
          {plan.tag}
        </p>
      )}
      <h3 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
        {plan.name}
      </h3>
    </div>

    <div className="sm:self-end sm:text-right lg:col-span-3 lg:col-start-10 lg:row-start-1 lg:self-auto">
      <Price plan={plan} />
    </div>

    <div className="mt-1 max-w-[64ch] sm:col-span-2 lg:col-span-5 lg:col-start-5 lg:row-start-1 lg:mt-0 lg:max-w-none">
      <Covers items={plan.covers} />
    </div>
  </motion.li>
);

/* ------------------------------------------------------------------- ruler */

/** Offset of `el` from `root` along one axis, through the offsetParent chain
 *  (layout position, so entrance transforms never skew the measurement). */
function offsetWithin(el: HTMLElement, root: HTMLElement, axis: "x" | "y") {
  let v = 0;
  let node: HTMLElement | null = el;
  while (node && node !== root) {
    v += axis === "x" ? node.offsetLeft : node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return v;
}

const StopNode = ({
  progress,
  at,
  still,
  nodeRef,
}: {
  progress: MotionValue<number>;
  at: number;
  still: boolean;
  nodeRef: (el: HTMLSpanElement | null) => void;
}) => {
  const fill = useTransform(progress, [Math.max(0, at - 0.025), at + 0.005], [0, 1]);
  return (
    <span
      ref={nodeRef}
      aria-hidden
      className="absolute left-0 top-[10px] block h-[9px] w-[9px] rounded-[1px] border border-foreground/50 bg-[hsl(var(--bone))] lg:relative lg:top-auto lg:mt-3"
    >
      <motion.span
        className="absolute -inset-px rounded-[1px] bg-foreground"
        style={{ opacity: still ? 1 : fill }}
      />
    </span>
  );
};

const ProcessRuler = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const nodes = useRef<(HTMLSpanElement | null)[]>([]);
  const phone = useMediaQuery(PHONE_QUERY);
  const still = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 85%", "end 60%"],
  });
  const [stops, setStops] = useState<number[]>(() => STEPS.map((_, i) => i / STEPS.length));

  // Where each stop sits along the drawn line, as a fraction of its length.
  // Re-measured only when the block resizes, never per scroll frame.
  useLayoutEffect(() => {
    const list = listRef.current;
    const track = trackRef.current;
    if (!list || !track) return;
    const axis = phone ? "y" : "x";
    const measure = () => {
      const len = phone ? track.offsetHeight : track.offsetWidth;
      if (!len) return;
      const start = offsetWithin(track, list, axis);
      const next = nodes.current.map((n) => {
        if (!n) return 0;
        const size = phone ? n.offsetHeight : n.offsetWidth;
        const c = offsetWithin(n, list, axis) + size / 2 - start;
        return Math.round(Math.min(1, Math.max(0, c / len)) * 1000) / 1000;
      });
      setStops((prev) => (prev.every((v, i) => v === next[i]) ? prev : next));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [phone]);

  const drawn = still
    ? phone
      ? { scaleY: 1, originY: 0 }
      : { scaleX: 1, originX: 0 }
    : phone
      ? { scaleY: scrollYProgress, originY: 0 }
      : { scaleX: scrollYProgress, originX: 0 };

  return (
    <div ref={listRef} className="relative mt-8 lg:mt-12">
      {/* The ruler: a quiet track with minor ticks, and the ink line drawn over it. */}
      <div
        ref={trackRef}
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-[4px] top-[14px] w-px bg-border lg:bottom-auto lg:left-0 lg:right-0 lg:top-[32px] lg:h-px lg:w-auto"
      >
        <div className="absolute bottom-full left-0 right-0 hidden h-[5px] bg-[repeating-linear-gradient(to_right,hsl(var(--bone-rule))_0_1px,transparent_1px_12px)] lg:block" />
        {/* End tick: at the right end on desktop, at the foot on phone. */}
        <div className="absolute -top-[5px] right-0 hidden h-[11px] w-px bg-foreground/50 lg:block" />
        <div className="absolute -left-[5px] bottom-0 h-px w-[11px] bg-foreground/50 lg:hidden" />
        <motion.div className="absolute inset-0 bg-foreground" style={drawn} />
      </div>

      <ol className="grid grid-cols-1 gap-y-5 sm:gap-y-6 lg:grid-cols-4 lg:gap-x-8">
        {STEPS.map((s, i) => (
          <motion.li
            key={s.title}
            {...revealAt(i, 0.07)}
            className="relative grid max-w-[30rem] grid-cols-[1fr_auto] items-baseline gap-x-4 pl-8 lg:block lg:max-w-none lg:pl-0"
          >
            <p className="label-mono col-start-2 row-start-1 h-4 leading-4 text-muted-foreground">
              {s.when}
            </p>
            <StopNode
              progress={scrollYProgress}
              at={stops[i] ?? 0}
              still={still}
              nodeRef={(el) => {
                nodes.current[i] = el;
              }}
            />
            <h4 className="col-start-1 row-start-1 text-lg font-semibold tracking-tight text-foreground lg:mt-5">
              {s.title}
            </h4>
            <p className="col-span-2 mt-1 max-w-[46ch] text-[15px] leading-relaxed text-muted-foreground lg:mt-1.5 lg:pr-2">
              {s.body}
            </p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
};

/* --------------------------------------------------------------- questions */

const Questions = () => (
  <AccordionPrimitive.Root type="single" collapsible className="border-t border-foreground">
    {FAQS.map((item, i) => (
      <AccordionPrimitive.Item key={item.q} value={`q-${i}`} className="border-b border-border">
        <AccordionPrimitive.Header asChild>
          <h4>
            <AccordionPrimitive.Trigger className="group flex min-h-12 w-full items-center justify-between gap-6 py-3 text-left">
              <span className="text-base font-medium leading-snug text-foreground decoration-foreground/35 underline-offset-4 transition-opacity duration-150 ease-out-strong group-active:opacity-70 md:text-[17px] [@media(hover:hover)_and_(pointer:fine)]:group-hover:underline">
                {item.q}
              </span>
              <span
                aria-hidden
                className="relative flex h-5 w-5 shrink-0 items-center justify-center text-foreground transition-transform duration-150 ease-out-strong group-active:scale-90"
              >
                <span className="absolute h-px w-3 bg-current" />
                <span className="absolute h-3 w-px bg-current transition-[transform,opacity] duration-200 ease-out-strong group-data-[state=open]:rotate-90 group-data-[state=open]:opacity-0" />
              </span>
            </AccordionPrimitive.Trigger>
          </h4>
        </AccordionPrimitive.Header>
        <AccordionPrimitive.Content className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-1 data-[state=open]:duration-200 motion-reduce:data-[state=open]:slide-in-from-top-0 data-[state=open]:ease-out-strong">
          <p className="max-w-[62ch] pb-5 pr-10 text-[15px] leading-relaxed text-muted-foreground md:text-base">
            {item.a}
          </p>
        </AccordionPrimitive.Content>
      </AccordionPrimitive.Item>
    ))}
  </AccordionPrimitive.Root>
);

/* ----------------------------------------------------------------- section */

export const Terms = () => (
  <section id="pricing" className="ground-bone relative py-24 md:py-32" aria-labelledby="terms-title">
    <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
      <motion.div {...reveal} className="max-w-[40rem]">
        <h2
          id="terms-title"
          className="h-section font-display font-semibold text-foreground"
        >
          Fixed price, per milestone.
        </h2>
        <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-muted-foreground md:text-[17px]">
          You get a written scope and a fixed price for each milestone. You sign off before I build
          anything, so there are no surprise invoices.
        </p>
      </motion.div>

      {/* The price ledger */}
      <div id="services" className="mt-12 scroll-mt-6 md:mt-16 lg:scroll-mt-20">
        <ul className="border-t border-foreground">
          {PLANS.map((p, i) => (
            <LedgerRow key={p.name} plan={p} i={i} />
          ))}
        </ul>
        <motion.p {...reveal} className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
          Each build is split into <span className="whitespace-nowrap">fixed-price</span>{" "}
          milestones. <br className="hidden sm:inline" />
          Smaller job? Hourly consults and fixes from{" "}
          <span className="whitespace-nowrap">
            <span className="tabular text-foreground">$15</span> an hour.
          </span>
        </motion.p>
      </div>

      {/* How a build goes: the ruler */}
      <div id="process" className="mt-14 scroll-mt-6 md:mt-20 lg:scroll-mt-20">
        <motion.h3 {...reveal} className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          How a build goes.
        </motion.h3>
        <ProcessRuler />
      </div>

      {/* Questions, folded away */}
      {/* Desktop: the heading holds the left column and the close sits at its
          foot, level with the last question. Phone: heading, questions, close. */}
      <div
        id="faq"
        className="mt-14 grid scroll-mt-6 grid-cols-1 md:mt-20 lg:scroll-mt-20 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-8"
      >
        <motion.h3
          {...reveal}
          className="text-xl font-semibold tracking-tight text-foreground md:text-2xl lg:col-span-4 lg:pt-2"
        >
          Questions.
        </motion.h3>

        <motion.div
          {...reveal}
          className="mt-6 lg:col-span-8 lg:col-start-5 lg:row-span-2 lg:row-start-1 lg:mt-0"
        >
          <Questions />
        </motion.div>

        <motion.div
          {...reveal}
          className="mt-8 flex items-center justify-between gap-5 sm:justify-start sm:gap-6 lg:col-span-4 lg:row-start-2 lg:mt-0 lg:flex-col lg:items-start lg:gap-4 lg:self-end lg:pr-8"
        >
          <p className="max-w-[26ch] text-[15px] leading-snug text-muted-foreground lg:max-w-[34ch]">
            Not sure which fits? <br className="hidden lg:inline" />
            We’ll work it out on the call.
          </p>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 shrink-0 items-center rounded-md border border-[hsl(var(--accent-deep))] bg-primary px-5 font-medium text-primary-foreground transition-[transform,background-color] duration-150 ease-out-strong active:scale-[0.97] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-primary/90"
          >
            Book a call
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </motion.div>
      </div>
    </div>
  </section>
);
