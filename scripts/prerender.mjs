/**
 * Build-time pre-render. Runs after `vite build` (client) and
 * `vite build --ssr src/entry-server.tsx --outDir dist-ssr`.
 *
 * For every real page it writes dist/<path>/index.html containing:
 *   - the page's own text as plain HTML (so search engines and AI crawlers
 *     that do not run JavaScript can read it; visitors' browsers replace it
 *     with the live app as soon as it starts),
 *   - its own title, description, canonical URL and social tags,
 *   - schema.org JSON-LD describing only what the page visibly states.
 * Each page is then a real file, so the host answers 200 (not the 404
 * fallback) for it. Also writes sitemap.xml and 404.html.
 *
 * A new page needs three things: its component, a <Route> in both
 * src/App.tsx and src/entry-server.tsx, and an entry in PAGES below.
 *
 * Node built-ins only: no extra packages.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const SITE = "https://eleazarai.dev";
const DIST = path.resolve("dist");
const SSR_DIR = path.resolve("dist-ssr");

const PERSON_ID = `${SITE}/#person`;
const PERSON = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: "Eleazar Sebastian Martinez",
  alternateName: "Basti",
  jobTitle: "AI Automation Engineer",
  description:
    "AI automation engineer in Calamba, Laguna, Philippines. Builds AI agents and real software with Claude Code that take the daily checks off a team.",
  url: `${SITE}/`,
  email: "mailto:tian1504@gmail.com",
  address: { "@type": "PostalAddress", addressLocality: "Calamba", addressRegion: "Laguna", addressCountry: "PH" },
  sameAs: [
    "https://www.linkedin.com/in/eleazar-sebastian-martinez-76210983/",
    "https://www.upwork.com/freelancers/eleazarautomation",
    "https://github.com/tian1504",
  ],
  knowsAbout: [
    "AI automation",
    "Claude Code",
    "AI agents",
    "AI chat agents",
    "n8n workflow automation",
    "Cold email operations",
    "Claude",
    "Supabase",
    "Node.js",
    "Amazon Selling Partner API (SP-API)",
    "Amazon seller dashboards",
  ],
};

// Prices exactly as the Terms section states them, in the same order.
const OFFERS = [
  {
    name: "AI Agent and Workflow Build",
    url: `${SITE}/ai-agents`,
    description:
      "AI customer agents, n8n and Make workflows, internal AI assistants that answer with citations, data pipelines, API and CRM integrations.",
    minPrice: 600,
    maxPrice: 1800,
  },
  {
    name: "Amazon System Build",
    description:
      "SP-API sync workflows for orders, inventory, financials and returns; live seller dashboards with re-order alerts; sourcing and buy-decision tools.",
    minPrice: 900,
    maxPrice: 2400,
  },
  {
    name: "Maintenance and Growth",
    description: "Up to 5 hours of updates a month, monitoring and quick fixes, priority support, a monthly summary.",
    price: 200,
    unit: "MON",
  },
].map((o) => ({
  "@type": "Offer",
  itemOffered: {
    "@type": "Service",
    name: o.name,
    ...(o.url ? { url: o.url } : {}),
    description: o.description,
    provider: { "@id": PERSON_ID },
  },
  priceSpecification: o.unit
    ? { "@type": "UnitPriceSpecification", price: o.price, priceCurrency: "USD", unitCode: o.unit }
    : { "@type": "PriceSpecification", minPrice: o.minPrice, maxPrice: o.maxPrice, priceCurrency: "USD" },
}));

const breadcrumb = (url, name) => ({
  "@type": "BreadcrumbList",
  "@id": `${SITE}${url}#breadcrumb`,
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
    { "@type": "ListItem", position: 2, name, item: `${SITE}${url}` },
  ],
});

const caseStudy = (p) => {
  const headline = p.title.split(" | ")[0];
  return {
    "@context": "https://schema.org",
    "@graph": [
      { ...PERSON },
      {
        "@type": "Article",
        "@id": `${SITE}${p.url}#article`,
        headline,
        description: p.description,
        url: `${SITE}${p.url}`,
        datePublished: p.published,
        dateModified: p.modified,
        author: { "@id": PERSON_ID },
        publisher: { "@id": PERSON_ID },
        image: `${SITE}/og-card.png`,
        isPartOf: { "@id": `${SITE}/#website` },
      },
      breadcrumb(p.url, headline),
    ],
  };
};

// A service page: the page itself, plus the service it describes (with the
// published price only where the page shows one).
const servicePage = (p) => {
  const headline = p.title.split(" | ")[0];
  return {
    "@context": "https://schema.org",
    "@graph": [
      { ...PERSON },
      {
        "@type": "WebPage",
        "@id": `${SITE}${p.url}#webpage`,
        name: headline,
        description: p.description,
        url: `${SITE}${p.url}`,
        datePublished: p.published,
        dateModified: p.modified,
        author: { "@id": PERSON_ID },
        isPartOf: { "@id": `${SITE}/#website` },
        about: { "@id": `${SITE}${p.url}#service` },
        breadcrumb: { "@id": `${SITE}${p.url}#breadcrumb` },
      },
      {
        "@type": "Service",
        "@id": `${SITE}${p.url}#service`,
        name: p.service.name,
        description: p.service.description,
        url: `${SITE}${p.url}`,
        provider: { "@id": PERSON_ID },
        ...(p.service.offer ? { offers: p.service.offer } : {}),
      },
      breadcrumb(p.url, headline),
    ],
  };
};

// `published` and `modified` are the dates the page's own content was first
// put up and last changed (from the git history); the sitemap uses `modified`.
const PAGES = [
  {
    url: "/",
    title: "Eleazar Sebastian Martinez | AI Automation and Claude Code",
    description:
      "I build AI agents and real software with Claude Code that take the daily checks off your team. Fixed price per milestone.",
    modified: "2026-11-03",
    jsonld: {
      "@context": "https://schema.org",
      "@graph": [
        { ...PERSON, makesOffer: OFFERS },
        {
          "@type": "WebSite",
          "@id": `${SITE}/#website`,
          url: `${SITE}/`,
          name: "Eleazar Sebastian Martinez, AI Automation Engineer",
          publisher: { "@id": PERSON_ID },
        },
      ],
    },
  },
  {
    url: "/claude-code",
    kind: "service",
    title: "Claude Code Developer for Hire | Eleazar Sebastian Martinez",
    description:
      "Real software built with Claude Code and held to written checks: my own meeting-notes app, fact-checked AI tool reviews and 14 sites on automatic deploys.",
    published: "2026-11-03",
    modified: "2026-11-03",
    service: {
      name: "Claude Code builds",
      description:
        "Software built with Claude Code to written rules and checks, on the client's own accounts, with the code, credentials and docs handed over.",
    },
  },
  {
    url: "/ai-agents",
    kind: "service",
    title: "AI Agent Developer for Hire | Eleazar Sebastian Martinez",
    description:
      "AI agents that read a question, find the answer and hand the work on: an IT troubleshooting engine with specialist agents, and an Instagram booking agent.",
    published: "2026-11-03",
    modified: "2026-11-03",
    service: {
      name: "AI Agent and Workflow Build",
      description:
        "AI customer agents, n8n and Make workflows, internal AI assistants that answer with citations, data pipelines, API and CRM integrations.",
      offer: {
        "@type": "Offer",
        priceSpecification: { "@type": "PriceSpecification", minPrice: 600, maxPrice: 1800, priceCurrency: "USD" },
      },
    },
  },
  {
    url: "/case-study/fact-checked-ai-reviews",
    title: "Fact-Checked AI Reviews with Claude Code | Case Study",
    description:
      "Case study: every vendor page saved, every quoted fact re-found by a script, and a Claude Code hook that blocks the commit when a review page fails.",
    published: "2026-11-03",
    modified: "2026-11-03",
  },
  {
    url: "/case-study/instagram-dm-agent",
    title: "Instagram DM Booking Agent for Med Spas | Case Study",
    description:
      "Case study: an Instagram AI agent built for an agency serving med spas, to answer DMs and book consults in the thread. ManyChat, n8n, OpenAI, GoHighLevel.",
    published: "2026-11-03",
    modified: "2026-11-03",
  },
  {
    url: "/case-study/cold-email-safety-checks",
    title: "Cold Email Safety Checks on the Instantly API | Case Study",
    description:
      "Case study: five checks that stop a cold email send if any one fails, built on Node.js and the Instantly API for an Australian plumbing business.",
    published: "2026-11-03",
    modified: "2026-11-03",
  },
  {
    url: "/case-study/seller-dashboard",
    title: "Amazon Seller Dashboard with Re-order Alerts | Case Study",
    description:
      "Case study: one screen that tells an Amazon seller what needs doing this morning, built with Amazon SP-API, GitHub Actions, Supabase and React.",
    published: "2026-08-16",
    modified: "2026-10-16",
  },
  {
    url: "/case-study/amazon-sp-api",
    title: "Amazon SP-API to Inventory System with n8n | Case Study",
    description:
      "Case study: about forty-five n8n workflows that keep a seller’s back office fed with orders, returns, settlements, inventory and fees from Amazon SP-API.",
    published: "2026-08-16",
    modified: "2026-09-24",
  },
  {
    url: "/case-study/book-sourcing-engine",
    title: "Used-Book Amazon FBA Sourcing Engine | Case Study",
    description:
      "Case study: about 2,000 listings scanned each morning, every margin computed from the live listing, a daily buy list inside the budget.",
    published: "2026-08-16",
    modified: "2026-11-02",
  },
];
for (const p of PAGES) {
  if (!p.jsonld) p.jsonld = p.kind === "service" ? servicePage(p) : caseStudy(p);
  // Search results cut titles at about 60 characters and descriptions at about 155.
  if (p.title.length > 60) throw new Error(`prerender: title over 60 characters on ${p.url}`);
  if (p.description.length > 160) throw new Error(`prerender: description over 160 characters on ${p.url}`);
}

// ---------------------------------------------------------------------------

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function setMeta(html, page) {
  const abs = `${SITE}${page.url}`;
  const ogType = page.url.startsWith("/case-study/") ? "article" : "website";
  const rules = [
    [/<title>[\s\S]*?<\/title>/, `<title>${esc(page.title)}</title>`],
    [/(<meta name="description" content=")[^"]*(")/, `$1${esc(page.description)}$2`],
    [/(<link rel="canonical" href=")[^"]*(")/, `$1${abs}$2`],
    [/(<meta property="og:type" content=")[^"]*(")/, `$1${ogType}$2`],
    [/(<meta property="og:url" content=")[^"]*(")/, `$1${abs}$2`],
    [/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(page.title)}$2`],
    [/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(page.description)}$2`],
    [/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(page.title)}$2`],
    [/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(page.description)}$2`],
  ];
  for (const [re, rep] of rules) {
    if (!re.test(html)) throw new Error(`prerender: index.html is missing ${re}`);
    html = html.replace(re, rep);
  }
  return html;
}

const template = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
if (!template.includes('<div id="root"></div>')) throw new Error('prerender: <div id="root"></div> not found');

// 404.html stays the plain app shell: unknown paths still answer 404, and the
// app shows its Not Found page.
fs.writeFileSync(path.join(DIST, "404.html"), template);

const { render } = await import(pathToFileURL(path.join(SSR_DIR, "entry-server.js")).href);

// React logs its usual server-render notes (layout effects do nothing on a
// server); they are expected here, so keep the build log readable.
const quiet = console.error;
console.error = () => {};
const rendered = PAGES.map((p) => [p, render(p.url)]);
console.error = quiet;

for (const [page, body] of rendered) {
  const text = body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (text.length < 1000) throw new Error(`prerender: ${page.url} rendered only ${text.length} characters`);
  let html = setMeta(template, page);
  const ld = JSON.stringify(page.jsonld).replace(/</g, "\\u003c");
  html = html.replace("</head>", `    <script type="application/ld+json">${ld}</script>\n  </head>`);
  html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  const out = page.url === "/" ? path.join(DIST, "index.html") : path.join(DIST, page.url, "index.html");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  console.log(`prerendered ${page.url.padEnd(38)} ${String(text.length).padStart(6)} chars of text`);
}

const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  PAGES.map((p) => `  <url><loc>${SITE}${p.url}</loc><lastmod>${p.modified}</lastmod></url>`).join("\n") +
  `\n</urlset>\n`;
fs.writeFileSync(path.join(DIST, "sitemap.xml"), sitemap);
console.log(`wrote sitemap.xml (${PAGES.length} pages)`);

fs.rmSync(SSR_DIR, { recursive: true, force: true });
