/**
 * SAMPLE data for the seller dashboard replica (SellerDashboard.tsx).
 *
 * The store, products and figures are invented. They were run once through
 * the real app's own math on a sample snapshot (Thursday October 15) and the
 * results are frozen here exactly as the app rendered them. There is no date
 * math, so the build-time pre-render and the browser always show the same text.
 *
 * Every label is the app's own wording, with one change: the stuck group's
 * hint uses a full stop where the app has a dash ("not reserved. Check in
 * Seller Central").
 */

export type Tone = "bad" | "warn" | "info" | "mute";
export type GroupKey = "out" | "urgent" | "send" | "stuck";

/** The line glyph on a row's light thumbnail tile (mapped to an icon in the component). */
export type Thumb =
  | "flashlight"
  | "bottle"
  | "lantern"
  | "jacket"
  | "mug"
  | "flame"
  | "droplets"
  | "footprints"
  | "tent"
  | "backpack";

export type DashRow = {
  name: string;
  detail: string;
  /** Amazon's own recommended quantity, under the detail ("Amazon: N"). */
  sub?: string;
  action: string;
  /** Already covered (stock on the way): muted, not a to-do. */
  calm?: boolean;
  thumb: Thumb;
};

export type DashGroup = {
  key: GroupKey;
  tone: Tone;
  /** The app's own emoji for the group. */
  icon: string;
  title: string;
  hint: string;
  /** All items in the group; the card shows the first three. */
  count: number;
  cta?: string;
  /** Footer link, only when the group has more than three items. */
  more?: string;
  rows: DashRow[];
};

export const STORE = {
  name: "Sample Outdoor Co.",
  sub: "Amazon US · Inventory & Season Command",
  updated: "Updated Oct 15, 2026",
  /** The replica's honesty label, in place of the app's freshness pill. */
  label: "Sample data",
  refresh: "Refresh",
} as const;

export const HEADING = {
  title: "Today",
  sub: "what needs doing, worst first",
} as const;

export const BRIEF = {
  eyebrow: "Daily briefing",
  weekday: "Thursday",
  monthDay: "October 15",
  day: {
    label: "Yesterday",
    revenue: "$1,119.96",
    sub: "41 orders · 45 units",
    /** Green in the app; it carries its own leading separator. */
    up: " · ▲ 10% vs Wednesday before",
  },
  stats: [
    { tone: "bad", value: "$375.81", label: "lost per day while out of stock" },
    { tone: "gold", value: "1,453", label: "units to ship into Amazon", pick: "Pick list · 11 products →" },
    { tone: "plain", value: "$624.74", label: "tied up in stock Amazon will not sell" },
  ],
} as const;

export const GROUPS: DashGroup[] = [
  {
    key: "out",
    tone: "bad",
    icon: "🚨",
    title: "Out of stock, still selling",
    hint: "losing sales right now",
    count: 3,
    cta: "Open send list →",
    rows: [
      { name: "Headlamp 300", detail: "$135.36/day at risk", sub: "Amazon: 270", action: "send 329", thumb: "flashlight" },
      { name: "Insulated Bottle 1L", detail: "$125.41/day at risk", action: "310 arriving", calm: true, thumb: "bottle" },
      { name: "Trail Lantern 400", detail: "$115.04/day at risk", sub: "Amazon: 70", action: "send 80", thumb: "lantern" },
    ],
  },
  {
    key: "urgent",
    tone: "warn",
    icon: "⏳",
    title: "Runs out before a shipment lands",
    hint: "ship these today",
    count: 2,
    cta: "Open send list →",
    rows: [
      { name: "Rain Shell Jacket", detail: "5 days left", sub: "Amazon: 85", action: "send 112", thumb: "jacket" },
      { name: "Camp Mug Steel", detail: "10 days left", sub: "Amazon: 170", action: "send 239", thumb: "mug" },
    ],
  },
  {
    key: "send",
    tone: "info",
    icon: "📦",
    title: "Needs shipping to Amazon",
    hint: "to cover the season ahead",
    count: 7,
    cta: "Open send list →",
    more: "Show all 7",
    rows: [
      { name: "Stove Fuel Canister", detail: "24 days left", sub: "Amazon: 200", action: "send 235", thumb: "flame" },
      { name: "Water Filter Straw", detail: "19 days left", sub: "Amazon: 120", action: "send 133", thumb: "droplets" },
      { name: "Gaiters Pair", detail: "28 days left", sub: "Amazon: 100", action: "send 126", thumb: "footprints" },
    ],
  },
  {
    key: "stuck",
    tone: "mute",
    icon: "🔒",
    title: "Stock Amazon is not selling",
    hint: "not sellable, not inbound, not reserved. Check in Seller Central",
    count: 3,
    rows: [
      { name: "Rain Shell Jacket", detail: "$268.65 tied up", action: "3 units", thumb: "jacket" },
      { name: "Hammock Single", detail: "$224.15 tied up", action: "5 units", thumb: "tent" },
      { name: "Dry Bag 20L", detail: "$131.94 tied up", action: "6 units", thumb: "backpack" },
    ],
  },
];

/**
 * The cards the replica shows, in triage order. The urgent group stays in the
 * data (the rail's totals include it) but is not drawn: the story is these
 * three, and on the 1600x1000 screen it would push the third card off the
 * bottom, as the empty urgent group did in the original screenshot.
 */
export const SHOWN: GroupKey[] = ["out", "send", "stuck"];
