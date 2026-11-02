import type { CSSProperties } from "react";
import { Bot, Mail, ShoppingCart, type LucideIcon } from "lucide-react";
import { BRAND_PATHS } from "./BrandIcon.data";

/**
 * Brand marks for the chapters (the tools each kind of work is built on).
 * Shapes from Simple Icons (CC0); the marks themselves belong to their
 * brands and are shown only to name the tool. `tone="brand"` uses the brand's
 * own color (very dark brand colors fall back to the page ink so they stay
 * visible on the dark grounds); `tone="ink"` uses the current text color.
 */

/** Brands whose marks are not in the open set (or not ours to use) get a plain icon instead. */
export type IconKey = keyof typeof BRAND_PATHS | "mail" | "bot" | "cart";

const LUCIDE: Record<string, LucideIcon> = { mail: Mail, bot: Bot, cart: ShoppingCart };
/** Colors for the plain icons in "brand" tone: the store icon in Amazon's orange (not their logo). */
const PLAIN_BRAND: Record<string, string> = { cart: "#FF9900" };

/** Relative luminance of a #rrggbb color, 0 to 1. */
function luminance(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

export function BrandIcon({
  icon,
  tone = "ink",
  className = "",
  style,
  title,
}: {
  icon: IconKey;
  tone?: "brand" | "ink";
  className?: string;
  style?: CSSProperties;
  title?: string;
}) {
  const L = LUCIDE[icon];
  if (L) {
    const color = tone === "brand" ? PLAIN_BRAND[icon] : undefined;
    return (
      <L
        role={title ? "img" : undefined}
        aria-hidden={title ? undefined : true}
        aria-label={title}
        className={className}
        style={color ? { color, ...style } : style}
        strokeWidth={1.6}
      />
    );
  }
  const b = BRAND_PATHS[icon as keyof typeof BRAND_PATHS];
  if (!b) return null;
  const fill = tone === "brand" && luminance(b.hex) > 0.04 ? b.hex : "currentColor";
  return (
    <svg
      viewBox="0 0 24 24"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className={className}
      style={style}
    >
      <path d={b.path} fill={fill} />
    </svg>
  );
}

const PLAIN: Record<string, string> = { mail: "Email", bot: "AI agent", cart: "Online store" };
export const brandTitle = (icon: IconKey) => PLAIN[icon] ?? BRAND_PATHS[icon as keyof typeof BRAND_PATHS]?.title ?? icon;
