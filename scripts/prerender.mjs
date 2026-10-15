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
  jobTitle: "AI Automation Engineer",
  url: `${SITE}/`,
  email: "mailto:tian1504@gmail.com",
  sameAs: [
    "https://www.linkedin.com/in/eleazar-sebastian-martinez-76210983/",
    "https://www.upwork.com/freelancers/~01ac0c23391406fb0d",
    "https://github.com/tian1504",
  ],
  knowsAbout: [
    "AI automation",
    "AI agents",
    "n8n workflow automation",
    "Amazon Selling Partner API (SP-API)",
    "Amazon seller dashboards",
    "Claude",
    "Supabase",
    "Node.js",
  ],
};

// Prices exactly as the Terms section states them.
const OFFERS = [
  {
    name: "Amazon System Build",
    description:
      "SP-API sync workflows for orders, inventory, financials and returns; live seller dashboards with re-order alerts; sourcing and buy-decision tools.",
    minPrice: 900,
    maxPrice: 2400,
  },
  {
    name: "AI Agent and Workflow Build",
    description:
      "AI customer agents, n8n and Make workflows, internal AI assistants that answer with citations, data pipelines, API and CRM integrations.",
    minPrice: 600,
    maxPrice: 1800,
  },
  {
    name: "Maintenance and Growth",
    description: "Up to 5 hours of updates a month, monitoring and quick fixes, priority support, a monthly summary.",
    price: 200,
    unit: "MON",
  },
].map((o) => ({
  "@type": "Offer",
  itemOffered: { "@type": "Service", name: o.name, description: o.description, provider: { "@id": PERSON_ID } },
  priceSpecification: o.unit
    ? { "@type": "UnitPriceSpecification", price: o.price, priceCurrency: "USD", unitCode: o.unit }
    : { "@type": "PriceSpecification", minPrice: o.minPrice, maxPrice: o.maxPrice, priceCurrency: "USD" },
}));

const caseStudy = (url, headline, description) => ({
  "@context": "https://schema.org",
  "@graph": [
    { ...PERSON },
    {
      "@type": "Article",
      "@id": `${SITE}${url}#article`,
      headline,
      description,
      url: `${SITE}${url}`,
      author: { "@id": PERSON_ID },
      publisher: { "@id": PERSON_ID },
      image: `${SITE}/og-card.png`,
      isPartOf: { "@id": `${SITE}/#website` },
    },
  ],
});

const PAGES = [
  {
    url: "/",
    title: "Eleazar Sebastian Martinez | AI Automation Engineer",
    description:
      "I build AI agents, n8n workflows and Amazon SP-API tools that take the daily checks off your team. Fixed price per milestone.",
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
    url: "/case-study/seller-dashboard",
    title: "The Seller Dashboard: Amazon sales and re-order alerts | Eleazar Sebastian Martinez",
    description:
      "Case study: one screen that tells an Amazon seller what needs doing this morning, built with SP-API, n8n, Supabase and React.",
  },
  {
    url: "/case-study/amazon-sp-api",
    title: "The SP-API Sync Engine: Amazon data into an inventory system | Eleazar Sebastian Martinez",
    description:
      "Case study: about forty-five n8n workflows that keep a seller’s back office fed with orders, returns, settlements, inventory and fees from Amazon SP-API.",
  },
  {
    url: "/case-study/book-sourcing-engine",
    title: "The Book Sourcing Engine: used-book Amazon FBA sourcing | Eleazar Sebastian Martinez",
    description:
      "Case study: about 2,000 listings scanned each morning, every margin computed from the live listing, a daily buy list inside the budget.",
  },
];
for (const p of PAGES) {
  if (!p.jsonld) p.jsonld = caseStudy(p.url, p.title.split(" | ")[0], p.description);
}

// ---------------------------------------------------------------------------

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function setMeta(html, page) {
  const abs = `${SITE}${page.url}`;
  const rules = [
    [/<title>[\s\S]*?<\/title>/, `<title>${esc(page.title)}</title>`],
    [/(<meta name="description" content=")[^"]*(")/, `$1${esc(page.description)}$2`],
    [/(<link rel="canonical" href=")[^"]*(")/, `$1${abs}$2`],
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
  console.log(`prerendered ${page.url.padEnd(34)} ${String(text.length).padStart(6)} chars of text`);
}

const today = new Date().toISOString().slice(0, 10);
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  PAGES.map((p) => `  <url><loc>${SITE}${p.url}</loc><lastmod>${today}</lastmod></url>`).join("\n") +
  `\n</urlset>\n`;
fs.writeFileSync(path.join(DIST, "sitemap.xml"), sitemap);
console.log(`wrote sitemap.xml (${PAGES.length} pages)`);

fs.rmSync(SSR_DIR, { recursive: true, force: true });
