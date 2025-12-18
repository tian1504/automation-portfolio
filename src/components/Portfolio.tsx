import DomeGallery from '@/components/DomeGallery';
import n8nLogo from '@/assets/logos/n8n.svg';
import workflowRAG from '@/assets/workflows/n8n-workflow-RAG-2.png';
import workflowOrganic from '@/assets/workflows/organic_workflows_labels_compact.png';
import workflowApollo from '@/assets/workflows/Apollo_LeadScraper.png';
import workflowHookBank from '@/assets/workflows/Hook_bank_UGC_-_N8N.png';
import workflowStats from '@/assets/workflows/Stats_prompt_and_Image_Gen.png';

const WORKFLOW_IMAGES = [
  {
    src: workflowRAG,
    thumbnail: n8nLogo,
    alt: 'Deductive-lab RAG System (n8n)'
  },
  {
    src: workflowOrganic,
    thumbnail: n8nLogo,
    alt: 'Social Media Organic Workflows (n8n)'
  },
  {
    src: workflowApollo,
    thumbnail: n8nLogo,
    alt: 'Apollo Lead Scraper (n8n)'
  },
  {
    src: workflowHookBank,
    thumbnail: n8nLogo,
    alt: 'Hook Bank Builder & UGC (n8n)'
  },
  {
    src: workflowStats,
    thumbnail: n8nLogo,
    alt: 'Static Prompt & Image Gen (n8n)'
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
            grayscale={false}
            openedImageWidth="900px"
            openedImageHeight="520px"
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
