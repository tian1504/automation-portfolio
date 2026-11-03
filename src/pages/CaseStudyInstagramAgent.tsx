import type { CSSProperties } from "react";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CaseStudyBar } from "@/components/desk/PresenterNav";
import { CaseLink } from "@/components/desk/CaseLink";
import { PlainHeading } from "@/components/PlainHeading";
import { BOOKING_URL, STILL } from "@/lib/desk";
// The same cropped test conversations the homepage shows (no account names,
// photos or the sandbox spa's town). Facts on this page come only from
// VoiceChapter.tsx, the AI DM Agent entry in ClientWords.data.ts and llms.txt.
import dmBooking from "@/assets/desk/igdm/ig-dm-booking.webp";
import dmBooked from "@/assets/desk/igdm/ig-dm-booked.webp";
import dmHandoff from "@/assets/desk/igdm/ig-dm-handoff.webp";
import dmBrain from "@/assets/desk/igdm/ig-dm-brain-split.webp";

/** Fades the screenshot frames in. Used on images only, never on text. */
const reveal = {
  initial: STILL ? (false as const) : { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: STILL ? 0 : 0.6 },
} as const;

const STEPS = [
  { n: "01", title: "Service", body: "It asked which service the person wanted." },
  { n: "02", title: "Preferred time", body: "Then it asked what time worked best, such as a weekday morning." },
  { n: "03", title: "Two open slots", body: "It offered two open times from the spa’s calendar." },
  { n: "04", title: "The intake form", body: "It asked how the person wanted the intake form sent." },
  {
    n: "05",
    title: "Contact details",
    body: "It took the contact details for the form, such as an email address, and confirmed the booking in the thread.",
  },
];

const AFTER_BOOKING = [
  "A calendar event was added.",
  "The pipeline opportunity in GoHighLevel moved to Booked.",
  "The intake form was sent.",
  "The team got an alert.",
];

/**
 * A screenshot in a plain frame. On phones it keeps a readable size and the
 * frame scrolls sideways; from md up it fits the column, never past `max`.
 */
const Shot = ({
  src,
  w,
  h,
  alt,
  phone,
  max = w,
  dark = false,
  caption,
  hint,
  className = "",
  eager = false,
}: {
  src: string;
  w: number;
  h: number;
  alt: string;
  /** Scale of the natural width used on phones. */
  phone: number;
  max?: number;
  dark?: boolean;
  caption: string;
  hint: string;
  className?: string;
  eager?: boolean;
}) => {
  const pw = Math.round(w * phone);
  const vars = { "--pw": `${pw}px`, "--mw": `${max}px` } as CSSProperties;
  return (
    <figure className={`m-0 min-w-0 ${className}`}>
      <motion.div
        {...reveal}
        className={`rounded-lg border border-border p-3 shadow-[var(--edge),var(--e2)] sm:p-5 ${
          dark ? "bg-[hsl(30_6%_6%)]" : "bg-white"
        }`}
      >
        <div className="overflow-x-auto overscroll-x-contain">
          <img
            src={src}
            alt={alt}
            width={w}
            height={h}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            draggable={false}
            style={vars}
            className="block h-auto w-[var(--pw)] max-w-none md:w-full md:max-w-[var(--mw)]"
          />
        </div>
      </motion.div>
      {pw > 300 && <p className="mt-2 text-[12px] text-muted-foreground md:hidden">{hint}</p>}
      <figcaption className="mt-3 text-sm leading-relaxed text-muted-foreground">{caption}</figcaption>
    </figure>
  );
};

const CaseStudyInstagramAgent = () => (
  <div className="min-h-screen flex flex-col">
    <CaseStudyBar backTo="/#b-instagram-agent" />

    <main className="flex-1">
      {/* Hero */}
      <section className="section-padding pt-16 md:pt-20">
        <div className="container-custom max-w-5xl mx-auto">
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground border border-border rounded-sm px-2 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" aria-hidden />
            Client build · Delivered
          </span>
          <p className="mt-5 font-mono text-xs md:text-sm text-muted-foreground">
            For an agency that sets up Instagram booking agents for med spas · ManyChat · 7 n8n workflows · OpenAI
            gpt-4o-mini · GoHighLevel · Google Calendar · Gmail
          </p>
          <h1 className="mt-4 font-display font-bold tracking-tighter-2 leading-[1.02] text-4xl md:text-5xl lg:text-6xl text-foreground">
            An Instagram agent built to book consults in the DMs<span className="text-primary">.</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-xl">
            I built this agent for an agency that sets up Instagram booking agents for med spas. It was made to
            answer DMs from each spa’s own knowledge base and book consults inside the thread. The engagement ended
            in July 2026.
          </p>
          <Shot
            className="mt-10"
            eager
            src={dmBooking}
            w={1239}
            h={694}
            phone={0.56}
            alt="An Instagram DM thread: the person asks to book a consult, the agent asks which service (Botox) and when (weekday morning), offers two open times on Monday, and asks how to send the intake form."
            hint="Swipe sideways to see the whole thread."
            caption="A real test conversation from the client’s sandbox, so no real customer is shown. The test person is me. The conversations on this page are cropped to remove account names and photos."
          />
        </div>
      </section>

      {/* Who it was for */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto">
          <PlainHeading
            title="Who it was for"
            description="An agency that sets up Instagram booking agents for med spas. I worked with them as a freelancer from April to July 2026."
          />
          <p className="max-w-2xl text-muted-foreground leading-relaxed">
            Each spa had its own knowledge base, a Google Doc that the spa’s team edited. I built the full agent to
            read the intent of each Instagram DM, answer from that knowledge base and book consults inside the DM
            thread, with an OpenAI model (gpt-4o-mini).
          </p>
        </div>
      </section>

      {/* How booking worked */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto">
          <PlainHeading title="How booking worked in the thread" description="Booking took five steps, all inside the DM." />
          <ol className="space-y-6 max-w-2xl">
            {STEPS.map((s, i) => (
              <li key={s.n} className={`border-l-2 pl-5 ${i === 0 ? "border-primary/60" : "border-border"}`}>
                <div className="font-mono text-xs text-muted-foreground mb-1" aria-hidden>
                  {s.n}
                </div>
                <h3 className="font-bold text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mt-1">{s.body}</p>
              </li>
            ))}
          </ol>
          <Shot
            className="mt-12"
            src={dmBooked}
            w={1239}
            h={381}
            phone={0.56}
            alt="The end of a second test booking: the person picks email, gives an address, and the agent replies that the Botox appointment is confirmed and the intake form is on its way. The spa’s location is covered."
            hint="Swipe sideways to see the whole thread."
            caption="The end of a second test booking. The grey bar covers the spa’s town."
          />
        </div>
      </section>

      {/* Contacts and bookings */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto">
          <PlainHeading
            title="Contacts and bookings"
            description="I set it up so every DM created or updated one GoHighLevel contact, with no duplicates. When a booking was confirmed, four things followed."
          />
          <ul className="space-y-3 max-w-2xl">
            {AFTER_BOOKING.map((line) => (
              <li key={line} className="border-l-2 border-border pl-5 text-muted-foreground leading-relaxed">
                {line}
              </li>
            ))}
          </ul>
          <div className="mt-12 max-w-2xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">The design goal</p>
            <p className="mt-3 font-display text-[clamp(1.5rem,2.8vw,2.3rem)] font-medium leading-[1.12] tracking-[-0.025em] text-foreground">
              Built so every text DM became a GoHighLevel contact within 60 seconds.
            </p>
          </div>
        </div>
      </section>

      {/* Returning people and the handoff */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto">
          <PlainHeading
            title="Returning people and the handoff to a person"
            description="It remembered people, and it knew when a person should take over."
          />
          <div className="space-y-4 max-w-2xl text-muted-foreground leading-relaxed">
            <p>
              A returning client was welcomed back by name. In testing, it mentioned their last Botox visit and asked
              what they would like to book.
            </p>
            <p>
              Some messages were never answered by the AI: medical, refund, legal or “talk to a person” messages.
              For those, it took a callback time and a way to reach the person, then alerted the team.
            </p>
            <p>Someone unsure about a date also got a callback, flagged for the team.</p>
          </div>
          <Shot
            className="mt-12 max-w-[37rem]"
            src={dmHandoff}
            w={573}
            h={660}
            phone={0.75}
            alt="The person asks for a callback instead of picking a date; the agent asks for a time of day and a way to reach them, then says the team has been flagged."
            hint="Swipe sideways to see the whole thread."
            caption="A test where the person asks for a callback instead of picking a date."
          />
        </div>
      </section>

      {/* Follow-ups */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto">
          <PlainHeading
            title="Follow-ups when someone went quiet"
            description="If someone went quiet, it followed up after 1 hour and again after 20 hours, then stopped at Meta’s 24-hour limit."
          />
        </div>
      </section>

      {/* Built with */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto">
          <PlainHeading
            title="What it was built with"
            description="ManyChat for Instagram, 7 n8n workflows, an OpenAI model (gpt-4o-mini), GoHighLevel, Google Calendar and Gmail."
          />
          <div className="space-y-4 max-w-2xl text-muted-foreground leading-relaxed">
            <p>
              I built the first version on Instagram’s own webhooks (the verification handshake and inbound message
              events), with replies sent through ManyChat.
            </p>
            <p>
              One of the 7 workflows was the brain. It read the message, checked the knowledge base, ran the AI agent,
              decided the next step and replied in under 2 seconds.
            </p>
          </div>
          <Shot
            className="mt-12"
            dark
            src={dmBrain}
            w={960}
            h={524}
            phone={0.8}
            alt="The n8n workflow behind the agent, in full color: a webhook, the returning-contact lookup, the knowledge base cache, the AI agent with its OpenAI model and memory, the next-step decision, the calendar lookup and the reply."
            hint="Swipe sideways to see the whole workflow."
            caption="The brain workflow in n8n, shown in two rows."
          />
        </div>
      </section>

      {/* Testing */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto">
          <PlainHeading
            title="How it was tested"
            description="219 automated checks across 7 test suites, all passing on 27 April 2026."
          />
          <p className="max-w-2xl text-muted-foreground leading-relaxed">
            The rule: no workflow change went back into n8n until the checks passed.
          </p>
        </div>
      </section>

      {/* Status */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto">
          <PlainHeading title="Status" description="Client build, delivered. The engagement ended in July 2026." />
        </div>
      </section>

      {/* Related */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto">
          <PlainHeading title="More of my agent work" />
          <div className="flex flex-col items-start gap-2">
            <CaseLink to="/ai-agents" label="AI agents I build: the service page">
              AI agents I build
            </CaseLink>
            <a
              href="/#voice"
              className="group inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-foreground underline decoration-border underline-offset-4 transition-[text-decoration-color,opacity] duration-150 ease-out-strong active:opacity-70 [@media(hover:hover)_and_(pointer:fine)]:hover:decoration-foreground"
            >
              Voice and chat agents on the homepage
              <ArrowRight
                aria-hidden
                className="h-4 w-4 transition-transform duration-150 ease-out-strong [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding pt-0">
        <div className="container-custom max-w-5xl mx-auto">
          <div className="border border-border bg-card/40 p-8 md:p-12">
            <h2 className="font-display font-bold tracking-tight text-2xl md:text-3xl text-foreground">
              Want one for your clinic or agency?
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed max-w-xl">
              Tell me how people book with you today and which DMs your team answers by hand. I’ll walk you through
              what an agent like this could handle for you.
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
                <a href="/">See all my work</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
);

export default CaseStudyInstagramAgent;
