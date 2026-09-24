import { forwardRef, type CSSProperties, type ReactNode } from "react";

/**
 * The physical screen he holds up: a thin dark bezel with a lit top lip and a
 * shadow tinted to the ground. Shared by the hero turn (DeskStage) and the
 * closing bookend (DeskClose) so the object reads as the same screen.
 */
export const SCREEN_BEZEL = "hsl(30 6% 10%)";

type ScreenShellProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Inner padding between bezel and content, in px. */
  bezel?: number;
};

export const ScreenShell = forwardRef<HTMLDivElement, ScreenShellProps>(
  ({ children, className = "", style, bezel = 6 }, ref) => (
    <div
      ref={ref}
      className={`relative rounded-[10px] ${className}`}
      style={{
        background: SCREEN_BEZEL,
        padding: bezel,
        boxShadow:
          "inset 0 1px 0 hsl(40 25% 96% / 0.10), inset 0 0 0 1px hsl(40 25% 96% / 0.05), var(--e3)",
        ...style,
      }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[5px]">{children}</div>
    </div>
  ),
);
ScreenShell.displayName = "ScreenShell";
