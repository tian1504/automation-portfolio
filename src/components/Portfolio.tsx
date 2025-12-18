import DomeGallery from '@/components/DomeGallery';
import AiAutomationDome from '@/assets/AI-AutomationDome.png';

// 7 workflow screenshots
import workflowStatic from '@/assets/workflows/n8n-07.png';
import workflowApollo from '@/assets/workflows/n8n-01.png';
import workflowVideoGen from '@/assets/workflows/n8n-02.png';
import workflowHookBank from '@/assets/workflows/n8n-03.png';
import workflowInstagram from '@/assets/workflows/n8n-04.png';
import workflowWeather from '@/assets/workflows/n8n-05.png';
import workflowOrganic from '@/assets/workflows/n8n-06.png';

const WORKFLOW_IMAGES = [
  { src: workflowStatic, thumbnail: AiAutomationDome, alt: 'Static Prompt & Image Engine (n8n)' },
  { src: workflowApollo, thumbnail: AiAutomationDome, alt: 'Apollo Lead Scraper & Icebreakers' },
  { src: workflowVideoGen, thumbnail: AiAutomationDome, alt: 'AI Video Generator & Facebook Uploader' },
  { src: workflowHookBank, thumbnail: AiAutomationDome, alt: 'Hook Bank & UGC Brief Builder' },
  { src: workflowInstagram, thumbnail: AiAutomationDome, alt: 'Instagram Scraper & Hook Idea Engine' },
  { src: workflowWeather, thumbnail: AiAutomationDome, alt: 'Daily Weather Quote & Image Poster' },
  { src: workflowOrganic, thumbnail: AiAutomationDome, alt: 'Multi-Channel Organic Content System' },
  // Generic AI Automation tiles
  { src: AiAutomationDome, thumbnail: AiAutomationDome, alt: 'AI Automation' },
  { src: AiAutomationDome, thumbnail: AiAutomationDome, alt: 'AI Automation' },
  { src: AiAutomationDome, thumbnail: AiAutomationDome, alt: 'AI Automation' },
  { src: AiAutomationDome, thumbnail: AiAutomationDome, alt: 'AI Automation' },
  { src: AiAutomationDome, thumbnail: AiAutomationDome, alt: 'AI Automation' },
  { src: AiAutomationDome, thumbnail: AiAutomationDome, alt: 'AI Automation' },
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
            segments={26}
            fit={0.55}
            padFactor={0.2}
            maxHorizontalRotationDeg={75}
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
