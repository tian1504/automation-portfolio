import { useEffect, useId, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import { Pause, Play } from "lucide-react";

/**
 * A short audio excerpt with its real waveform (peaks measured from the file
 * at build time, not drawn by hand). Nothing loads until the visitor presses
 * play. The played part of the waveform fills in as it plays.
 */

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export function AudioClip({
  src,
  peaks,
  duration,
  title,
  note,
}: {
  src: string;
  peaks: number[];
  duration: number;
  title: string;
  note: string;
}) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const progress = useMotionValue(0);
  const clip = useTransform(progress, (p) => `inset(0 ${100 - p * 100}% 0 0)`);
  const labelId = useId();

  // Smooth fill while playing (timeupdate only fires a few times a second).
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const tick = () => {
      const a = audio.current;
      if (a && a.duration) progress.set(a.currentTime / a.duration);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, progress]);

  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) a.play().catch(() => setPlaying(false));
    else a.pause();
  };

  const n = peaks.length;
  const bars = (
    <svg viewBox={`0 0 ${n * 4} 40`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
      {peaks.map((p, i) => {
        const h = Math.max(2, p * 38);
        return <rect key={i} x={i * 4 + 0.5} y={20 - h / 2} width={2.4} height={h} rx={1.2} />;
      })}
    </svg>
  );

  return (
    <div className="rounded-xl border border-border bg-[hsl(var(--surface))] p-4 shadow-[var(--edge),var(--e1)] sm:p-5">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggle}
          aria-describedby={labelId}
          aria-label={playing ? "Pause the excerpt" : "Play the excerpt"}
          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-[transform,background-color] duration-150 ease-out-strong active:scale-[0.96] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-primary/90"
        >
          {playing ? <Pause aria-hidden className="h-5 w-5" /> : <Play aria-hidden className="ml-0.5 h-5 w-5" />}
        </button>
        <div className="min-w-0 flex-1">
          <p id={labelId} className="text-[15px] font-medium leading-snug text-foreground [text-wrap:balance]">
            {title}
          </p>
          <div className="relative mt-2 h-9">
            <div className="absolute inset-0 fill-muted-foreground/35">{bars}</div>
            <motion.div className="absolute inset-0 fill-foreground" style={{ clipPath: clip }}>
              {bars}
            </motion.div>
          </div>
        </div>
        <span className="tabular shrink-0 font-mono text-[12px] text-muted-foreground">
          {fmt(playing || time > 0 ? time : duration)}
        </span>
      </div>
      <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{note}</p>
      <audio
        ref={audio}
        src={src}
        preload="none"
        onPlay={() => setPlaying(true)}
        onError={() => setPlaying(false)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onEnded={(e) => {
          setPlaying(false);
          setTime(0);
          progress.set(0);
          e.currentTarget.currentTime = 0;
        }}
      />
    </div>
  );
}
