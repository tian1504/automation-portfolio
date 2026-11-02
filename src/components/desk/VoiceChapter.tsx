import { motion } from "motion/react";
import { revealAt } from "@/lib/desk";
import twoTakes from "@/assets/desk/voice/el-two-takes.webp";
import dubSettings from "@/assets/desk/voice/el-dub-settings.webp";
import dubCredits from "@/assets/desk/voice/el-dub-credits.webp";
import dmBooking from "@/assets/desk/igdm/ig-dm-booking.webp";
import dmBooked from "@/assets/desk/igdm/ig-dm-booked.webp";
import dmReturning from "@/assets/desk/igdm/ig-dm-returning.webp";
import dmHandoff from "@/assets/desk/igdm/ig-dm-handoff.webp";
import dmBrain from "@/assets/desk/igdm/ig-dm-brain-split.webp";
import { BuildTitle, Rows } from "./Plate";
import { Count } from "./Count";
import { AudioClip } from "./AudioClip";
import { StackCards, type StackItem } from "./StackCards";
import { buildElementId } from "./ledgerStore";

/**
 * Chapter three: voice and chat agents.
 * The Instagram agent is shown by its real test conversations (from his own
 * technical guide, cropped: no account names, handles, profile photos, the
 * agency's address or the sandbox spa's town), stacked as cards. Facts come
 * from that guide (27 Apr 2026); the engagement ended in July 2026.
 * The ElevenLabs work is a client project (hands-on reviews for an AI tools
 * review site). Every figure is from the paid Starter plan runs (27 Oct 2026),
 * as he asked; the audio sample was made on Starter, which carries a
 * commercial licence, from a script about a made-up company.
 */

const IG_CARDS: StackItem[] = [
  {
    id: "ask",
    title: "Someone asks to book.",
    body: "It asks which service, then when, and offers two open times from the spa’s calendar.",
    shots: [
      {
        src: dmBooking,
        w: 1239,
        h: 694,
        alt: "An Instagram DM thread: the person asks to book a consult, the agent asks which service (Botox) and when (weekday morning), offers two open times on Monday, and asks how to send the intake form.",
      },
    ],
  },
  {
    id: "booked",
    title: "Booked, inside the DM.",
    body: "It takes an email for the intake form and confirms. A calendar event, the GoHighLevel pipeline and a team alert follow.",
    shots: [
      {
        src: dmBooked,
        w: 1239,
        h: 381,
        alt: "The end of a second test booking: the person picks email, gives an address, and the agent replies that the Botox appointment is confirmed and the intake form is on its way. The spa's location is covered.",
      },
    ],
  },
  {
    id: "people",
    title: "It remembers people, and knows when to hand over.",
    body: "A returning client is welcomed back by name. Someone unsure about a date gets a callback, flagged for the team.",
    shots: [
      {
        src: dmReturning,
        w: 570,
        h: 236,
        alt: "The agent greets a returning client by name, mentions their last Botox visit and asks what they would like to book.",
      },
      {
        src: dmHandoff,
        w: 573,
        h: 660,
        alt: "The person asks for a callback instead of picking a date; the agent asks for a time of day and a way to reach them, then says the team has been flagged.",
      },
    ],
  },
  {
    id: "brain",
    title: "Behind it: 7 n8n workflows.",
    body: "This one is the brain, shown in two rows. It reads the message, checks the knowledge base, runs the AI agent, decides the next step and replies in under 2 seconds.",
    dark: true,
    shots: [
      {
        src: dmBrain,
        w: 960,
        h: 524,
        alt: "The n8n workflow behind the agent, in full color: a webhook, the returning-contact lookup, the knowledge base cache, the AI agent with its OpenAI model and memory, the next-step decision, the calendar lookup and the reply.",
      },
    ],
  },
];

const IG_ROWS = [
  { label: "For", value: "An agency that sets up Instagram booking agents for med spas." },
  {
    label: "What it does",
    value:
      "Answers DMs from each spa’s own knowledge base (a Google Doc their team edits) and books consults in five steps: service, preferred time, two open slots, how to send the intake form, contact details.",
  },
  {
    label: "Follow-ups",
    value: "If someone goes quiet, it follows up after 1 hour and after 20 hours, then stops at Meta’s 24-hour limit.",
  },
  {
    label: "People",
    value: "Medical, refund, legal or “talk to a person” messages are never answered by the AI: it takes a callback time and contact, then alerts the team.",
  },
  {
    label: "Built with",
    value: "ManyChat for Instagram, 7 n8n workflows, an OpenAI model (gpt-4o-mini), GoHighLevel, Google Calendar and Gmail.",
  },
  {
    label: "Checks",
    value: "219 automated checks across 7 test suites, all passing on 27 April 2026. The rule: no workflow change went back into n8n until they passed.",
  },
  { label: "Status", value: <span className="text-foreground">Client build, delivered. The engagement ended in July 2026.</span> },
];

const EL_ROWS = [
  {
    label: "Accuracy",
    value:
      "The take was read back by speech-to-text and compared with the script. The only differences were number formats (“6” as “six”) and the made-up name Kestrelwick, heard as “Kestrel Wick”.",
  },
  {
    label: "Long takes",
    value:
      "A long script of 1,521 words became 8 min 40 s of audio in about 128 seconds. Its last 2 minutes (342 words) read back with no wrong words; the only differences were number formats and spacing.",
  },
  {
    label: "Pauses",
    value:
      "Pause tags drift. Pauses ran 1.0 to 1.2 seconds up to 4:50, then 1.6 to 1.9 seconds after 5:13, while the average speaking speed held at 186 to 187 words a minute.",
  },
  {
    label: "Dubbing",
    value:
      "For the same 71-second file, dubbing v2 quoted 16,046 credits and v1 quoted 3,566. Filipino and Spanish dubs took about 2 minutes each on v1.",
  },
  {
    label: "Billing",
    value: "Speech to text was charged exactly ElevenLabs’ stated 330 credits a minute (660 credits for a 2-minute file, 392 for a 71-second one).",
  },
  {
    label: "Tools",
    value: "ElevenLabs text to speech (Eleven v4), speech to text, dubbing, voice cloning and the API (read only).",
  },
];

/** Real loudness of the excerpt, 72 buckets (measured from public/media/elevenlabs-sample.mp3). */
const PEAKS = [
  1.0, 0.51, 0.07, 0.01, 0.01, 0.03, 0.45, 0.46, 0.82, 0.39, 0.64, 0.71, 0.36, 0.74, 0.26, 0.22, 0.8, 0.64, 0.62, 0.68,
  0.54, 0.32, 0.74, 0.37, 0.36, 0.55, 0.03, 0.01, 0.02, 0.57, 0.81, 0.51, 0.61, 0.52, 0.55, 0.35, 0.19, 0.71, 0.61, 0.55,
  0.44, 0.36, 0.64, 0.51, 0.76, 0.05, 0.76, 0.69, 0.93, 0.62, 0.49, 0.42, 0.03, 0.54, 0.48, 0.43, 0.67, 0.44, 0.11, 0.61,
  0.83, 0.67, 0.53, 0.05, 0.42, 0.59, 0.48, 0.56, 0.4, 0.54, 0.04, 0.0,
];

/** A product screenshot at no more than its own size (phones swipe it sideways rather than shrink it). */
const Shot = ({ src, w, h, caption, i }: { src: string; w: number; h: number; caption: string; i: number }) => (
  <motion.figure {...revealAt(i)} className="m-0 min-w-0">
    <div className="overflow-x-auto overscroll-x-contain rounded-lg border border-border bg-white shadow-[var(--edge),var(--e2)]">
      <img
        src={src}
        alt=""
        width={w}
        height={h}
        loading="lazy"
        decoding="async"
        className="block h-auto w-[var(--w)] max-w-none lg:w-full lg:max-w-[var(--w)]"
        style={{ ["--w" as string]: `${Math.round(w * 0.8)}px` }}
      />
    </div>
    <figcaption className="mt-3 text-sm text-muted-foreground">{caption}</figcaption>
  </motion.figure>
);

/** The dubbing bar, as its two readable ends: the settings chips and the credit quote. */
const DubShot = () => (
  <motion.figure {...revealAt(1)} className="m-0 min-w-0">
    <div className="flex flex-wrap items-center gap-3">
      <div className="overflow-hidden rounded-lg border border-border bg-white shadow-[var(--edge),var(--e2)]">
        <img src={dubSettings} alt="" width={600} height={76} loading="lazy" decoding="async" className="block h-auto w-[480px] max-w-full" />
      </div>
      <div className="overflow-hidden rounded-lg border border-border bg-white shadow-[var(--edge),var(--e2)]">
        <img src={dubCredits} alt="" width={224} height={76} loading="lazy" decoding="async" className="block h-auto w-[179px] max-w-full" />
      </div>
    </div>
    <figcaption className="mt-3 text-sm text-muted-foreground">
      Dubbing v1 into Filipino, quoted at 3,566 credits for the 71-second file (both ends of the same bar).
    </figcaption>
  </motion.figure>
);

export const VoiceChapter = () => (
  <div className="mx-auto w-full max-w-[1200px] px-5 pb-24 pt-20 sm:px-8 md:pb-32 md:pt-28">
    {/* The Instagram agent: its real test conversations, then its label */}
    <article
      id={buildElementId("instagram-agent")}
      data-build="instagram-agent"
      aria-labelledby="instagram-agent-title"
      className="scroll-mt-10"
    >
      <div className="max-w-[44rem]">
        <BuildTitle id="instagram-agent-title">Instagram AI chat agent</BuildTitle>
        <motion.p {...revealAt(1)} className="mt-4 text-[17px] leading-snug text-muted-foreground md:text-lg">
          Built for a client to answer Instagram DMs for med spas and book consults inside the thread. The engagement ended in July 2026. These are its real test conversations.
        </motion.p>
      </div>

      <div className="mt-10 md:mt-14">
        <StackCards items={IG_CARDS} label="The Instagram agent, in its own test conversations" />
        <p className="mt-4 text-sm text-muted-foreground">
          Screenshots from testing in the client’s sandbox, so no real customer is shown. Cropped to remove account names and photos; the grey bar covers the spa’s town. The test person is me.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-[minmax(0,1fr)] gap-10 md:mt-20 lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-5">
          <motion.p
            {...revealAt(0)}
            className="max-w-[20ch] font-display text-[clamp(1.5rem,2.8vw,2.3rem)] font-medium leading-[1.12] tracking-[-0.025em] text-foreground"
          >
            Built so every text DM becomes a GoHighLevel contact within 60 seconds.
          </motion.p>
        </div>
        <div className="lg:col-span-7">
          <Rows rows={IG_ROWS} first={1} />
        </div>
      </div>
    </article>

    {/* The voice project: a real excerpt, one sentence of figures, then what was measured */}
    <article
      id={buildElementId("elevenlabs")}
      data-build="elevenlabs"
      aria-labelledby="elevenlabs-title"
      className="mt-24 scroll-mt-10 md:mt-36"
    >
      <BuildTitle id="elevenlabs-title">ElevenLabs voice project</BuildTitle>
      <motion.p {...revealAt(1)} className="mt-4 max-w-[52ch] text-[17px] leading-snug text-muted-foreground md:text-lg">
        A client project, October 2026: a hands-on review of ElevenLabs for an AI tools review site, with every take measured.
      </motion.p>

      <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-10 md:mt-14 lg:grid-cols-12 lg:items-end lg:gap-x-8">
        <motion.p
          {...revealAt(2)}
          className="max-w-[30ch] font-display text-[clamp(1.6rem,3.2vw,2.75rem)] font-medium leading-[1.12] tracking-[-0.025em] text-foreground lg:col-span-7"
        >
          One click turned a 189-word script into <Count to={71.3} decimals={1} /> seconds of speech, ready in about{" "}
          <Count to={18} /> seconds.
        </motion.p>
        <motion.div {...revealAt(3)} className="lg:col-span-5">
          <AudioClip
            src="/media/elevenlabs-sample.mp3"
            peaks={PEAKS}
            duration={34.4}
            title="Listen: the first 34 seconds of the narration"
            note="AI voice (ElevenLabs, Eleven v4): the same script in another library voice, made on the paid Starter plan. The company in the script is made up."
          />
        </motion.div>
      </div>

      <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-12 md:mt-16 lg:grid-cols-12 lg:gap-x-8">
        <div className="min-w-0 space-y-10 lg:col-span-6">
          <Shot src={twoTakes} w={860} h={142} i={0} caption="One click gave two versions. The second cost 0 credits." />
          <DubShot />
        </div>
        <div className="lg:col-span-6">
          <Rows rows={EL_ROWS} first={1} />
        </div>
      </div>
    </article>
  </div>
);
