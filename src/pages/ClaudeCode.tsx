import type { ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CaseStudyBar } from "@/components/desk/PresenterNav";
import { CaseLink } from "@/components/desk/CaseLink";
import { PlainHeading } from "@/components/PlainHeading";
import { BOOKING_URL, reveal } from "@/lib/desk";
import tinDraft from "@/assets/desk/thisisnoted/tin-ai-draft.webp";
import appLaunchPoster from "@/assets/desk/app-launch-poster.webp";

/**
 * Service page: building with Claude Code. Every fact here is copied from the
 * homepage's Claude Code chapter (ClaudeCodeChapter.tsx), the terms
 * (Terms.tsx), public/llms.txt or the case studies it links. All text is
 * plain, always-visible markup so crawlers read it without scrolling; only
 * the two images use the entrance.
 */

/** Homepage anchors are plain links (a router Link would not scroll to them). Same look as CaseLink. */
const AnchorLink = ({ href, children, label }: { href: string; children: string; label?: string }) => (
  <a
    href={href}
    aria-label={label}
    className="group inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-foreground underline decoration-border underline-offset-4 transition-[text-decoration-color,opacity] duration-150 ease-out-strong active:opacity-70 [@media(hover:hover)_and_(pointer:fine)]:hover:decoration-foreground"
  >
    {children}
    <ArrowRight
      aria-hidden
      className="h-4 w-4 transition-transform duration-150 ease-out-strong [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-0.5"
    />
  </a>
);

type Row = { label: string; value: string };

/** Label rows in the homepage's style, without the entrance, so every word is in the first paint. */
const Rows = ({ rows }: { rows: Row[] }) => (
  <dl className="border-t border-border">
    {rows.map((r) => (
      <div key={r.label} className="border-b border-border py-2.5 sm:grid sm:grid-cols-[7.25rem_1fr] sm:gap-5 sm:py-3">
        {/* A real space, so copied text and screen readers never join label and value. */}
        <dt className="label-mono mr-1.5 inline text-muted-foreground sm:mr-0 sm:block sm:pt-[5px]">{r.label}</dt>{" "}
        <dd className="inline text-[15px] leading-normal text-foreground/80 sm:block sm:leading-relaxed md:text-base">
          {r.value}
        </dd>
      </div>
    ))}
  </dl>
);

/** A screenshot or still. Only the image enters; the caption is always visible. */
const Shot = ({ src, alt, w, h, caption }: { src: string; alt: string; w: number; h: number; caption: string }) => (
  <figure className="m-0">
    <motion.div {...reveal}>
      <img
        src={src}
        alt={alt}
        width={w}
        height={h}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full rounded-xl border border-border"
      />
    </motion.div>
    <figcaption className="mt-3 text-sm text-muted-foreground">{caption}</figcaption>
  </figure>
);

/** One build: number, name, what it does and the check behind it, then rows, a picture and a link. */
const Build = ({
  n,
  title,
  first = false,
  rows,
  shot,
  link,
  children,
}: {
  n: string;
  title: string;
  first?: boolean;
  rows?: Row[];
  shot?: ReactNode;
  link: ReactNode;
  children: ReactNode;
}) => (
  <article className={`border-l-2 pl-5 ${first ? "border-primary/60" : "border-border"}`}>
    <div className="font-mono text-xs text-muted-foreground mb-1">{n}</div>
    <h3 className="font-bold text-lg md:text-xl text-foreground">{title}</h3>
    <div className="mt-2 max-w-2xl space-y-3 text-muted-foreground leading-relaxed">{children}</div>
    {rows && (
      <div className="mt-5 max-w-2xl">
        <Rows rows={rows} />
      </div>
    )}
    {shot && <div className="mt-8">{shot}</div>}
    <div className="mt-4">{link}</div>
  </article>
);

/** How a build goes, as the homepage's terms word it. */
const STEPS = [
  {
    when: "Day 1",
    title: "Call and audit",
    body: "A 30-minute call. I look at your current setup, ask where the hours go, and point out what is worth automating first.",
  },
  {
    when: "Days 2 to 3",
    title: "Written scope",
    body: "Deliverables, timeline and a fixed price per milestone, in writing. You sign off before I start.",
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

const ClaudeCode = () => (
  <div className="min-h-screen flex flex-col">
    <CaseStudyBar backTo="/#claude-code" />

    <main className="flex-1">
      {/* Hero */}
      <section className="section-padding pt-16 md:pt-20">
        <div className="container-custom max-w-5xl mx-auto">
          <p className="font-mono text-xs md:text-sm text-muted-foreground">
            Claude Code · React · TypeScript · Electron · Remotion · GitHub · Chrome Web Store
          </p>
          <h1 className="mt-4 font-display font-bold tracking-tighter-2 leading-[1.02] text-4xl md:text-5xl lg:text-6xl text-foreground">
            Claude Code builds, held to written checks<span className="text-primary">.</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-xl">
            My own meeting-notes app, fact-checked AI tool reviews for a client, 14 websites on automatic deploys and a
            browser extension on the Chrome Web Store. Each one is below, with the checks it had to pass.
          </p>
        </div>
      </section>

      {/* 01 How I work */}
      <section className="section-padding pt-0" aria-labelledby="how-i-work">
        <div className="container-custom max-w-5xl mx-auto">
          <PlainHeading id="how-i-work" title="How I work with Claude Code." />
          <p className="max-w-[30ch] font-display text-2xl md:text-3xl font-medium leading-[1.2] tracking-tight text-foreground">
            Claude Code is my engineering partner. I set the rules and write the checks, and the work is not done until
            it passes them.
          </p>
          <p className="mt-8 max-w-2xl text-muted-foreground leading-relaxed">
            On the fact-checked AI tool reviews I build for a client, that rule is enforced in code. Since 17 October
            2026, a Claude Code hook checks each commit Claude makes against the parts of the written standard a script
            can test. If a finished page fails, or one of its quoted facts cannot be re-found, the commit is blocked.
          </p>
          <div className="mt-4">
            <CaseLink to="/case-study/fact-checked-ai-reviews" label="Read the case study: Fact-checked AI tool reviews" />
          </div>
        </div>
      </section>

      {/* 02 What I have built */}
      <section className="section-padding pt-0" aria-labelledby="what-i-built">
        <div className="container-custom max-w-5xl mx-auto">
          <PlainHeading id="what-i-built" title="What I have built with Claude Code." />
          <div className="max-w-3xl space-y-16">
            <Build
              n="01"
              first
              title="ThisIsNoted, my own meeting-notes app"
              rows={[
                { label: "Built with", value: "Claude Code, Electron, React and TypeScript." },
                { label: "Status", value: "My own product, not released yet. The Windows version comes first." },
              ]}
              shot={
                <Shot
                  src={tinDraft}
                  w={1583}
                  h={905}
                  alt="A ThisIsNoted note with its draft: main points, a decision and an open question, each quoting the typed line it came from, then action items with who and when."
                  caption="Each point quotes the line it came from. Shown in practice mode (simple word rules, not real AI) with sample notes."
                />
              }
              link={
                <AnchorLink href="/#b-thisisnoted" label="See it on the homepage: ThisIsNoted">
                  See it on the homepage
                </AnchorLink>
              }
            >
              <p>
                AI notes you can check. Every AI point shows where it came from, and plain code (not the AI) flags names,
                numbers and dates that are not in your notes, the meeting invite or what was said on the call. Your typed
                text is never changed.
              </p>
              <p>
                1,327 automated tests and a 187-step click-through of the real app were passing on 26 October 2026. There
                is also an evaluation kit of 11 made-up meetings with answer keys.
              </p>
            </Build>

            <Build
              n="02"
              title="Fact-checked AI tool reviews"
              rows={[
                { label: "For", value: "A client building a US review site about AI tools." },
                { label: "Status", value: "Client build, in delivery." },
              ]}
              link={
                <CaseLink to="/case-study/fact-checked-ai-reviews" label="Read the case study: Fact-checked AI tool reviews" />
              }
            >
              <p>
                A Claude Code project that tests AI tools hands-on, and will not let a review page out until every vendor
                fact in it is re-found in a saved copy of the vendor’s page.
              </p>
              <p>
                Every vendor page a review relies on is saved. A script re-finds each quoted fact in the saved page and
                records the page, the time and the result. So far that is 4 review pages and 208 facts, all re-found, over
                175 commits between 16 October and 1 November 2026.
              </p>
            </Build>

            <Build
              n="03"
              title="14 websites on automatic deploys"
              rows={[
                { label: "For", value: "A US membership business that teaches business owners to use AI." },
                { label: "Status", value: "Delivered, May 2026." },
              ]}
              link={
                <AnchorLink href="/#b-site-ops" label="See it on the homepage: 14 websites on automatic deploys">
                  See it on the homepage
                </AnchorLink>
              }
            >
              <p>
                I moved 13 sites from drag-and-drop uploads to GitHub with automatic deploys, and launched a 14th the same
                way. Logged test deploys went live in 7 to 14 seconds.
              </p>
              <p>
                Every move followed a written checklist (live status, security headers, deploy source, hardcoded paths,
                assets, domain), with the results logged. All 14 sites are set up with 5 security headers.
              </p>
              <p>
                The hand-over is a one-page guide, written so no developer background is needed. In 4 steps, it teaches
                the team to change their own sites by asking Claude Code.
              </p>
            </Build>

            <Build
              n="04"
              title="Cart-filling browser extension"
              rows={[{ label: "Status", value: "Built and published on the Chrome Web Store." }]}
              link={
                <AnchorLink href="/#b-browser-extension" label="See it on the homepage: Cart-filling browser extension">
                  See it on the homepage
                </AnchorLink>
              }
            >
              <p>
                It loads a used-book seller’s morning picks into his shop baskets. After he pays, it reads his orders and
                logs each one into his inventory system. It never buys, never sees a card and stores no password: it
                works inside his own signed-in browser.
              </p>
              <p>
                Tested live: baskets filled on both shops, and 3 real orders from one shop logged, with 13 duplicates
                refused. It does not guess: an order it cannot match without doubt is refused, with the reason.
              </p>
            </Build>

            <Build
              n="05"
              title="A launch video, made from code"
              rows={[{ label: "Built with", value: "Remotion, React and Claude Code, in wide and vertical versions." }]}
              shot={
                <Shot
                  src={appLaunchPoster}
                  w={1280}
                  h={720}
                  alt="A still from the launch video: a made-up meeting-notes app recording a call, with two action items pulled from what was said and the line “Every word, captured.”"
                  caption="A still from the 36-second launch video, for a made-up app."
                />
              }
              link={
                <AnchorLink href="/#b-motion-graphics" label="Watch it on the homepage: A launch video, made from code">
                  Watch it on the homepage
                </AnchorLink>
              }
            >
              <p>
                A 36-second launch video for a made-up app, built entirely in code with Remotion and Claude Code. There is
                no editing app and no stock footage, and the music is generated by code on the same beat as the picture.
              </p>
            </Build>

            <article className="border-l-2 border-border pl-5">
              <div className="font-mono text-xs text-muted-foreground mb-1">06</div>
              <h3 className="font-bold text-lg md:text-xl text-foreground">Checks on other builds</h3>
              <ul className="mt-3 max-w-2xl space-y-4">
                <li>
                  <p className="text-muted-foreground leading-relaxed">
                    All 45 commits on a seller dashboard were written with Claude Code.
                  </p>
                  <CaseLink to="/case-study/seller-dashboard" label="Read the case study: The Seller Dashboard" />
                </li>
                <li>
                  <p className="text-muted-foreground leading-relaxed">
                    On a used-book sourcing engine, 600 checks (as of November 2026) run before any change ships.
                  </p>
                  <CaseLink to="/case-study/book-sourcing-engine" label="Read the case study: The Book Sourcing Engine" />
                </li>
                <li>
                  <p className="text-muted-foreground leading-relaxed">
                    An Instagram AI chat agent I built for an agency had 219 automated checks across 7 test suites.
                    That engagement ended in July 2026.
                  </p>
                  <CaseLink to="/case-study/instagram-dm-agent" label="Read the case study: Instagram AI chat agent" />
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* 03 After handoff */}
      <section className="section-padding pt-0" aria-labelledby="after-handoff">
        <div className="container-custom max-w-5xl mx-auto">
          <PlainHeading id="after-handoff" title="After handoff." />
          <div className="max-w-2xl space-y-4 text-muted-foreground leading-relaxed">
            <p>
              A finished build runs on your accounts, with full documentation and a recorded walkthrough. It is yours to
              keep.
            </p>
            <p>If your team wants to extend or fix it without me, I can run paid training sessions.</p>
            <p>
              If you would like me to keep looking after it, the Maintenance and Growth plan is $200 a month and covers up
              to 5 hours of updates, monitoring and small fixes. Bigger ongoing work is priced per scope.
            </p>
          </div>
        </div>
      </section>

      {/* 04 Price and process */}
      <section className="section-padding pt-0" aria-labelledby="price-and-process">
        <div className="container-custom max-w-5xl mx-auto">
          <PlainHeading id="price-and-process" title="Price and how a build goes." />
          <div className="max-w-2xl space-y-4 text-muted-foreground leading-relaxed">
            <p>
              You get a written scope and a fixed price for each milestone. You sign off before I build anything, so there
              are no surprise invoices.
            </p>
            <p>
              Your hosting, domain costs and third-party API spend are not part of the price. They are listed in the
              scope, and I don’t mark them up. For a smaller job, hourly consults and fixes start from $15 an hour.
            </p>
          </div>
          <div className="mt-4">
            <AnchorLink href="/#pricing" label="See the price list on the homepage">
              See the price list
            </AnchorLink>
          </div>

          <h3 className="mt-14 text-xl font-semibold tracking-tight text-foreground md:text-2xl">How a build goes.</h3>
          <ol className="mt-6 max-w-2xl space-y-6">
            {STEPS.map((s, i) => (
              <li key={s.title} className={`border-l-2 pl-5 ${i === 0 ? "border-primary/60" : "border-border"}`}>
                <div className="font-mono text-xs text-muted-foreground mb-1">{s.when}</div>
                <div className="font-bold text-foreground">{s.title}</div>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto">
          <div className="border border-border bg-card/40 p-8 md:p-12">
            <h2 className="font-display font-bold tracking-tight text-2xl md:text-3xl text-foreground">
              Want something built with Claude Code?
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed max-w-xl">
              Tell me what it has to do and how you would check that it works. We’ll start with a 30-minute call about
              your current setup and where the hours go.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild className="group">
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                  Book a call
                  <span className="sr-only"> (opens in a new tab)</span>
                  <ArrowUpRight
                    aria-hidden
                    className="ml-2 h-4 w-4 transition-transform duration-150 ease-out-strong [@media(hover:hover)_and_(pointer:fine)]:group-hover:-translate-y-0.5 [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-0.5"
                  />
                </a>
              </Button>
              <Button asChild variant="ghost">
                <a href="/#claude-code">See the Claude Code builds</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
);

export default ClaudeCode;
