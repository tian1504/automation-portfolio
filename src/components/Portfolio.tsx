import DomeGallery from '@/components/DomeGallery';

const WORKFLOW_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?q=80&w=900&auto=format&fit=crop',
    alt: 'Multi-Agent RAG Troubleshooting Copilot (n8n)'
  },
  {
    src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=900&auto=format&fit=crop',
    alt: 'Creative Intelligence Engine – ad, UGC, and review scoring (n8n)'
  },
  {
    src: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?q=80&w=900&auto=format&fit=crop',
    alt: 'UGC Brief Generator Pipeline (n8n)'
  },
  {
    src: 'https://images.unsplash.com/photo-1581090700227-1e37b190418e?q=80&w=900&auto=format&fit=crop',
    alt: 'Gmail → Notion → Slack intelligence for orders (n8n)'
  },
  {
    src: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=900&auto=format&fit=crop',
    alt: 'Order Alert Engine – Shopify to Slack (Zapier)'
  },
  {
    src: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=900&auto=format&fit=crop',
    alt: 'Lead Qualification + CRM Enrichment (Zapier)'
  },
  {
    src: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=900&auto=format&fit=crop',
    alt: 'Calendar & Meeting Pack Builder (Zapier)'
  },
  {
    src: 'https://images.unsplash.com/photo-1581090700227-1e37b190418e?q=80&w=900&auto=format&fit=crop',
    alt: 'Invoice & Receipt Auto-Filer (Make.com)'
  },
  {
    src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=900&auto=format&fit=crop',
    alt: 'Inventory Replenishment Notifier (Make.com)'
  }
];

export const Portfolio = () => {
  return (
    <section id="portfolio" className="section-padding bg-secondary">
      <div className="container-custom">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Featured Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Automation solutions and workflows that have streamlined operations and improved efficiency.
          </p>
        </div>

        {/* Dome Gallery */}
        <div className="mx-auto max-w-6xl" style={{ height: '650px' }}>
          <DomeGallery
            images={WORKFLOW_IMAGES}
            overlayBlurColor="#05030F"
            grayscale={true}
            openedImageWidth="720px"
            openedImageHeight="420px"
          />
        </div>

        {/* Upwork Link Section */}
        <div className="text-center mt-16">
          <p className="text-sm text-muted-foreground mb-2">
            Want to see more workflows?
          </p>
          <a
            href="https://www.upwork.com/freelancers/~01ac0c23391406fb0d?nav_dir=pop"
            target="_blank"
            rel="noopener noreferrer"
            className="upwork-link text-xl font-bold text-primary inline-block mb-8"
          >
            {"View my Upwork profile".split("").map((ch, index) => (
              <span key={index} className="upwork-char">
                {ch === " " ? "\u00A0" : ch}
              </span>
            ))}
          </a>
          
          {/* Upwork Profile Preview Image */}
          <a
            href="https://www.upwork.com/freelancers/~01ac0c23391406fb0d?nav_dir=pop"
            target="_blank"
            rel="noopener noreferrer"
            className="block max-w-4xl mx-auto group"
          >
            <div className="bg-background rounded-lg border-2 border-primary/30 shadow-lg shadow-primary/20 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/30 hover:border-primary/50">
              <img
                src={new URL('../assets/upwork-profile-banner-clean.png', import.meta.url).href}
                alt="Eleazar Sebastian M. – Upwork profile preview"
                className="w-full h-auto"
              />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};
