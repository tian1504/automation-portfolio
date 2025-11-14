import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  const handleScroll = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center hero-gradient pt-20">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-slide-up">
            I build automations that{" "}
            <span className="text-primary">remove busywork</span> and{" "}
            <span className="text-accent">scale your operations</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up [animation-delay:200ms]">
            I specialize in AI automation, data workflows, and integrations using cutting-edge tools like{" "}
            <span className="font-semibold text-foreground">n8n</span>,{" "}
            <span className="font-semibold text-foreground">Make</span>,{" "}
            <span className="font-semibold text-foreground">Zapier</span>,{" "}
            <span className="font-semibold text-foreground">Apify</span>, and{" "}
            <span className="font-semibold text-foreground">Notion</span>.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up [animation-delay:400ms]">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all group"
              onClick={() => handleScroll("#portfolio")}
            >
              View My Work
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all"
              onClick={() => handleScroll("#contact")}
            >
              <Calendar className="mr-2 h-5 w-5" />
              Book a Call
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in [animation-delay:600ms]">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground">Automations Built</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Client Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-sm text-muted-foreground">Hours Saved</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
