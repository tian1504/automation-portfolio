import { ArrowRight, Calendar } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { NumberTicker } from "@/components/ui/number-ticker";
import { HeroNodeCanvas } from "@/components/HeroNodeCanvas";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export const Hero = () => {
  const handleScroll = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-center pt-28 pb-16 overflow-hidden"
    >
      <div className="container-custom relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.09, delayChildren: 0.05 }}
          className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center max-w-7xl mx-auto"
        >
          {/* Left: editorial text column — leads on mobile */}
          <div className="order-1 space-y-7">
            {/* Mono eyebrow — quiet, no pill */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="font-mono text-[0.72rem] uppercase tracking-[0.15em] text-muted-foreground"
            >
              AI Automation Engineer
            </motion.div>

            {/* Editorial name — lighter weight, the period is the one yellow mark */}
            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="font-display tracking-tighter-2 leading-[0.95] text-foreground text-[clamp(3.25rem,6vw,5rem)]"
              style={{ fontWeight: 530 }}
            >
              Eleazar<br />
              Sebastian<br />
              Martinez<span className="text-primary">.</span>
            </motion.h1>

            {/* Subhead — value-first: how I help the client, then the stack */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="space-y-3 max-w-md text-base md:text-lg text-muted-foreground leading-relaxed"
            >
              <p>
                I help lean teams{" "}
                <span className="text-foreground font-medium">automate the busywork</span>{" "}
                that quietly eats hours every week — support replies, lead gen, data entry, and reporting.
              </p>
              <p>
                <span className="font-mono text-foreground">n8n</span> +{" "}
                <span className="font-mono text-foreground">Claude</span> is my home stack —{" "}
                <span className="font-mono text-foreground">Make</span>,{" "}
                <span className="font-mono text-foreground">Zapier</span>, and custom code when the build calls for it. Shipped to production, documented, and yours to keep.
              </p>
            </motion.div>

            {/* CTAs — yellow lives on the primary action only */}
            <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="flex flex-col sm:flex-row gap-3 pt-1">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium group h-11 px-5"
                onClick={() => handleScroll("#portfolio")}
              >
                View My Work
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-foreground hover:bg-foreground/5 font-medium h-11 px-5"
                onClick={() => handleScroll("#contact")}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Book a call
              </Button>
            </motion.div>

            {/* Credibility strip — quiet, no second hue */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-4 text-xs md:text-sm font-mono text-muted-foreground"
            >
              <span className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/40" aria-hidden />
                <span className="text-foreground font-medium">Available for new projects</span>
              </span>
              <span className="text-border" aria-hidden>·</span>
              <span>
                <NumberTicker
                  value={50}
                  delay={0.4}
                  className="text-foreground font-medium tracking-normal !text-[inherit]"
                />
                <span className="text-foreground font-medium">+</span> production flows shipped
              </span>
              <span className="text-border" aria-hidden>·</span>
              <span className="text-foreground font-medium">Upwork Top Rated</span>
            </motion.div>
          </div>

          {/* Right: live workflow canvas — the real craft, not a stock asset */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="order-2 w-full max-w-xl mx-auto lg:mx-0 lg:justify-self-end"
          >
            <HeroNodeCanvas />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
