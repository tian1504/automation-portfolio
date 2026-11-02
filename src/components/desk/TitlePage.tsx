import { BOOKING_URL, UPWORK_URL, jumpTo } from "@/lib/desk";
import farSoft from "@/assets/desk/far-canvas-soft.webp";
import cutout from "@/assets/desk/eleazar.webp";
import cutoutSm from "@/assets/desk/eleazar-sm.webp";
import { CHAPTERS } from "./chapters";

/**
 * The title page. Nothing pinned, nothing scrubbed: his face, his trade, and
 * the contents (the four kinds of work, each a chapter below). On wide
 * screens the contents live in the ledger margin, so the page itself keeps
 * only the headline, the line under it and the one action.
 * His real n8n canvas sits soft behind him, a still image: chapter one is
 * where it comes to life.
 */

const H1 = "AI automation engineer.";
const SUBLINE = "I’m Eleazar. I build AI agents and real software with Claude Code that take the daily checks off your team.";

const NEW_TAB = <span className="sr-only"> (opens in a new tab)</span>;

const isPlainClick = (e: React.MouseEvent) => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

export const TitlePage = () => {
  return (
    <section id="home" data-ledger-section="home" aria-label="Introduction" className="relative overflow-hidden [overflow:clip]">
      {/* Planes: the canvas soft and far, a warm light, him. All still. */}
      <div aria-hidden className="absolute inset-0">
        <img
          src={farSoft}
          alt=""
          width={1538}
          height={634}
          decoding="async"
          className="absolute left-1/2 top-[36%] w-[170%] max-w-none -translate-x-[34%] -translate-y-1/2 opacity-50 lg:top-[44%] lg:w-[112%] lg:-translate-x-[40%]"
          style={{
            WebkitMaskImage: "radial-gradient(ellipse 58% 62% at 62% 50%, #000 22%, transparent 72%)",
            maskImage: "radial-gradient(ellipse 58% 62% at 62% 50%, #000 22%, transparent 72%)",
          }}
        />
        <div
          className="absolute left-1/2 top-[40%] h-[70svh] w-[70svh] -translate-x-1/2 -translate-y-1/2 rounded-full lg:left-[72%] lg:top-[42%] lg:h-[92svh] lg:w-[92svh]"
          style={{ background: "radial-gradient(closest-side, hsl(32 18% 26% / 0.55), hsl(32 18% 20% / 0.18) 55%, transparent)" }}
        />
      </div>

      {/* Phone and tablet wordmark (wide screens have the margin). */}
      <a
        href="#home"
        className="absolute left-5 top-3 z-10 inline-flex min-h-11 items-center font-display text-base font-semibold tracking-tight text-foreground sm:left-8 xl:hidden"
      >
        <span>
          Eleazar<span className="text-primary">.</span>
        </span>
      </a>

      <div className="relative mx-auto grid w-full max-w-[1200px] grid-cols-1 px-5 sm:px-8 lg:min-h-svh lg:grid-cols-12 lg:gap-x-8">
        {/* The words */}
        <div className="relative z-10 pt-[13svh] lg:col-span-6 lg:flex lg:flex-col lg:justify-center lg:pb-[8svh] lg:pt-24">
          <h1
            className="font-display text-[clamp(2.4rem,9.6vw,3.2rem)] font-semibold leading-[1.0] tracking-[-0.04em] text-foreground lg:text-[clamp(3.4rem,5vw,4.75rem)]"
          >
            {H1}
          </h1>
          <p className="mt-5 max-w-[34ch] text-[16px] leading-relaxed text-muted-foreground sm:text-[17px] lg:mt-7 lg:text-lg">
            {SUBLINE}
          </p>

          {/* Contents (the margin carries it on wide screens) */}
          <nav aria-label="Contents" className="mt-8 hidden max-w-[30rem] lg:block xl:hidden">
            <Contents />
          </nav>

          <div className="mt-9 hidden flex-wrap items-center gap-x-5 gap-y-3 lg:flex">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center rounded-md bg-primary px-5 font-medium text-primary-foreground transition-[transform,background-color] duration-150 ease-out-strong active:scale-[0.97] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-primary/90"
            >
              Book a call
              {NEW_TAB}
            </a>
            <TrustLine />
          </div>
          <div className="mt-5 lg:hidden">
            <TrustLine />
          </div>
        </div>

        {/* Him, in his own column (never under the words) */}
        <div aria-hidden className="relative h-[52svh] lg:col-span-6 lg:h-auto">
          <img
            src={cutout}
            srcSet={`${cutoutSm} 600w, ${cutout} 1165w`}
            sizes="(max-width: 1023px) 90vw, 50vw"
            alt=""
            width={1165}
            height={1080}
            decoding="async"
            fetchPriority="high"
            className="absolute bottom-[-24px] left-1/2 h-full w-auto max-w-none -translate-x-1/2 lg:bottom-0 lg:left-[52%] lg:h-[86svh]"
          />
          <div className="absolute inset-x-[-50vw] bottom-0 h-[22svh] bg-gradient-to-b from-transparent to-background lg:h-[26svh]" />
        </div>

        {/* Phones: the contents follow him, still on the title page's ground. */}
        <nav aria-label="Contents" className="relative z-10 pb-16 pt-2 lg:hidden">
          <Contents />
        </nav>
      </div>
    </section>
  );
};

const TrustLine = () => (
  <ul className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] leading-relaxed text-muted-foreground">
    <li>
      <a
        href={UPWORK_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="-my-3 inline-flex min-h-11 items-center whitespace-nowrap text-foreground/85 underline decoration-border underline-offset-4 transition-[text-decoration-color,opacity] duration-150 ease-out-strong active:opacity-70 [@media(hover:hover)_and_(pointer:fine)]:hover:decoration-foreground"
      >
        Upwork Top Rated
        {NEW_TAB}
      </a>
    </li>
    <li className="whitespace-nowrap">
      <span aria-hidden className="mr-2.5 text-muted-foreground/60">
        ·
      </span>
      14 years in enterprise IT
    </li>
    <li className="whitespace-nowrap max-lg:basis-full">
      <span aria-hidden className="mr-2.5 text-muted-foreground/60 max-lg:hidden">
        ·
      </span>
      Fixed price per milestone
    </li>
  </ul>
);

/** The four chapters, each a jump. */
const Contents = () => (
  <ol className="border-t border-border/80">
    {CHAPTERS.map((c, k) => (
      <li key={c.id} className="border-b border-border/80">
        <a
          href={`#${c.id}`}
          onClick={(e) => {
            if (!isPlainClick(e)) return;
            e.preventDefault();
            jumpTo(c.id, `${c.id}-title`);
          }}
          className="group grid min-h-12 grid-cols-[1.5rem_minmax(0,1fr)_auto] items-center gap-x-2 py-1.5 transition-colors duration-150 ease-out-strong"
        >
          <span className="tabular font-mono text-[11px] text-muted-foreground">{k + 1}</span>
          <span className="text-[17px] font-medium tracking-[-0.01em] text-foreground">{c.title}</span>
          <span className="tabular text-[13px] text-muted-foreground transition-colors duration-150 ease-out-strong [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-foreground">
            {c.builds.length} builds
          </span>
        </a>
      </li>
    ))}
  </ol>
);
