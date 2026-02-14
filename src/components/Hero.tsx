import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import portraitImage from "@/assets/portrait.png";

export const Hero = () => {
  const handleScroll = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-20">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
          {/* Left Column - Text Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            {/* AI Automation Specialist Tag */}
            <div className="hero-tag animate-fade-in mb-6 inline-flex">
              AI Automation Specialist
            </div>
            
            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-slide-up">
              Eleazar Sebastian Martinez
            </h1>

            {/* Subheadline */}
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 animate-slide-up [animation-delay:100ms]">
              I build automations that{" "}
              <span className="text-primary">remove busywork</span> and{" "}
              <span className="text-primary">scale your operations</span>
            </h2>

            {/* Supporting Text */}
            <p className="text-base md:text-lg text-muted-foreground mb-8 animate-slide-up [animation-delay:200ms]">
              I specialize in AI automation, data workflows, and integrations using cutting-edge tools like{" "}
              <span className="font-semibold text-foreground">n8n</span>,{" "}
              <span className="font-semibold text-foreground">Make</span>,{" "}
              <span className="font-semibold text-foreground">Zapier</span>,{" "}
              <span className="font-semibold text-foreground">Apify</span>, and{" "}
              <span className="font-semibold text-foreground">Notion</span>.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up [animation-delay:300ms]">
              <Button
                size="lg"
                className="bg-primary hover:bg-background hover:text-primary hover:border-primary border-2 border-primary text-primary-foreground shadow-lg transition-all group"
                onClick={() => handleScroll("#portfolio")}
              >
                View My Work
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                onClick={() => handleScroll("#contact")}
              >
                <Calendar className="mr-2 h-5 w-5" />
                Book a Call
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 grid grid-cols-3 gap-6 animate-fade-in [animation-delay:400ms]">
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">50+</div>
                <div className="text-xs md:text-sm text-muted-foreground">Automations Built</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">100%</div>
                <div className="text-xs md:text-sm text-muted-foreground">Client Satisfaction</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">1000+</div>
                <div className="text-xs md:text-sm text-muted-foreground">Hours Saved</div>
              </div>
            </div>
          </div>

          {/* Right Column - Portrait Image */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end animate-fade-in [animation-delay:200ms]">
            <div className="hero-profile-wrapper">
              <div className="hero-profile-aura">
                <img
                  src={portraitImage}
                  alt="Portrait of Eleazar Sebastian Martinez"
                  className="hero-profile-img w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
