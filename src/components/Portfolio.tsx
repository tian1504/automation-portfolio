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
import workflowRAG from '@/assets/workflows/n8n-workflow-RAG-2.png';
import workflowMultiAgent from '@/assets/workflows/multiagent_n8n.png';
import workflowInternalGPT from '@/assets/workflows/InternalChatGPT-N8N.png';

const WORKFLOW_IMAGES = [
  { src: workflowStatic, thumbnail: workflowStatic, alt: 'Static Prompt & Image Engine (n8n)' },
  { src: workflowApollo, thumbnail: workflowApollo, alt: 'Apollo Lead Scraper & Icebreakers' },
  { src: workflowVideoGen, thumbnail: workflowVideoGen, alt: 'AI Video Generator & Facebook Uploader' },
  { src: workflowHookBank, thumbnail: workflowHookBank, alt: 'Hook Bank & UGC Brief Builder' },
  { src: workflowInstagram, thumbnail: workflowInstagram, alt: 'Instagram Scraper & Hook Idea Engine' },
  { src: workflowWeather, thumbnail: workflowWeather, alt: 'Daily Weather Quote & Image Poster' },
  { src: workflowOrganic, thumbnail: workflowOrganic, alt: 'Multi-Channel Organic Content System' },
  { src: workflowRAG, thumbnail: workflowRAG, alt: 'RAG Knowledge Base Pipeline' },
  { src: workflowMultiAgent, thumbnail: workflowMultiAgent, alt: 'Multi-Agent AI System' },
  { src: workflowInternalGPT, thumbnail: workflowInternalGPT, alt: 'Internal ChatGPT Assistant' },
  // Minimal focal point icons
  { src: AiAutomationDome, thumbnail: AiAutomationDome, alt: 'AI Automation' },
  { src: AiAutomationDome, thumbnail: AiAutomationDome, alt: 'AI Automation' },
];

export const Portfolio = () => {
  return (
    <section id="portfolio" className="section-padding relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0a0f1e 0%, #1a0f2e 100%)' }}>
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
        <div className="mx-auto max-w-6xl" style={{ height: '700px' }}>
          <DomeGallery
            images={WORKFLOW_IMAGES}
            overlayBlurColor="#0d0a1a"
            grayscale={false}
            openedImageWidth="900px"
            openedImageHeight="520px"
            imageBorderRadius="16px"
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
            <div className="bg-black rounded-lg border-2 border-primary/30 shadow-lg shadow-primary/20 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/30 hover:border-primary/50">
              <img
                src={new URL('../assets/upwork-profile-banner-clean.png', import.meta.url).href}
                alt="Eleazar Sebastian M. – Upwork profile preview"
                className="w-full h-auto"
                style={{ marginLeft: '-3px', width: 'calc(100% + 3px)' }}
              />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};
