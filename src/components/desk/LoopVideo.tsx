import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { useStill } from "@/lib/desk";
import { Pause, Play } from "lucide-react";

/**
 * A silent looping video that plays only while it is well on screen, with a
 * visible pause button (anything that moves for more than 5 seconds must be
 * stoppable). Nothing downloads until it is near the screen. Reduced motion:
 * it waits on its poster until the visitor presses play.
 */
export function LoopVideo({
  src,
  poster,
  w,
  h,
  label,
  className = "",
}: {
  src: string;
  poster: string;
  w: number;
  h: number;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useStill();
  const near = useInView(ref, { once: true, margin: "0px 0px 60% 0px" });
  const inView = useInView(ref, { amount: 0.5 });
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v || !near) return;
    if (inView && !paused && !reduce) void v.play().catch(() => {});
    else v.pause();
  }, [inView, near, paused, reduce]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      setPaused(false);
      void v.play().catch(() => {});
    } else {
      setPaused(true);
      v.pause();
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-xl border border-border bg-black shadow-[var(--edge),var(--e3)] ${className}`}>
      <video
        ref={ref}
        src={near ? src : undefined}
        poster={poster}
        width={w}
        height={h}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="block h-auto w-full"
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause the video" : "Play the video"}
        className="absolute bottom-3 right-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-[transform,background-color] duration-150 ease-out-strong active:scale-[0.96] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-black/75"
      >
        {playing ? <Pause aria-hidden className="h-4 w-4" /> : <Play aria-hidden className="ml-0.5 h-4 w-4" />}
      </button>
    </div>
  );
}
