import { ArrowRight, Calendar } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { NumberTicker } from "@/components/ui/number-ticker";
import { HeroRobot } from "@/components/HeroRobot";
import portraitImage from "@/assets/portrait.png";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const codeLineVariant = {
  hidden: { opacity: 0, x: -6 },
  visible: { opacity: 1, x: 0 },
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
          transition={{ staggerChildren: 0.1, delayChildren: 0.05 }}
          className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-center max-w-7xl mx-auto"
        >
          {/* Left: editorial text column */}
          <div className="order-2 lg:order-1 space-y-7 relative">
            {/* 3D Spline robot — sits behind the name, "hugging" the text. Desktop only (perf). */}
            <motion.div
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
              className="hidden lg:block absolute -left-24 -right-24 -top-40 h-[700px] -z-10 pointer-events-none"
            >
              <HeroRobot className="w-full h-full opacity-90" />
            </motion.div>

            {/* Mono label */}
            <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="hero-tag inline-flex relative">
              AI AUTOMATION ENGINEER
            </motion.div>

            {/* Massive editorial name */}
            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="font-display font-bold tracking-tightest leading-[0.92] text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] text-foreground"
            >
              Eleazar<br />
              Sebastian<br />
              Martinez<span className="text-primary">.</span>
            </motion.h1>

            {/* Subhead — home stack voice */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="space-y-3 max-w-md text-base md:text-lg text-muted-foreground leading-relaxed"
            >
              <p>
                I build{" "}
                <span className="text-foreground font-medium">AI agents and automations</span>{" "}
                that actually ship.
              </p>
              <p>
                <span className="font-mono text-foreground">n8n</span>{" "}
                <span className="text-muted-foreground/60">+</span>{" "}
                <span className="font-mono text-foreground">Claude</span>{" "}
                is my home stack —{" "}
                <span className="font-mono text-foreground/85">Make</span>,{" "}
                <span className="font-mono text-foreground/85">Zapier</span>, and custom integrations when the architecture calls for them.
              </p>
            </motion.div>

            {/* CTAs */}
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

            {/* Inline credentials strip — availability + verifiable signals */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-4 text-xs md:text-sm font-mono text-muted-foreground"
            >
              <span className="flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/70 animate-ping" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
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

          {/* Right: workflow code window */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="order-1 lg:order-2 w-full max-w-xl mx-auto lg:mx-0 lg:justify-self-end"
          >
            <WorkflowWindow />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const WorkflowWindow = () => (
  <div className="relative">
    {/* Soft glow behind window */}
    <div
      aria-hidden
      className="absolute -inset-6 -z-10 rounded-3xl opacity-40 blur-3xl"
      style={{ background: "radial-gradient(circle at 60% 30%, hsl(45 93% 54% / 0.18), transparent 65%)" }}
    />

    <div className="rounded-xl border border-border bg-card/70 backdrop-blur-md overflow-hidden font-mono text-[13px] shadow-2xl shadow-black/40">
      {/* Title bar */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-secondary/50">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]/80" />
        </div>
        <span className="text-[11px] text-muted-foreground tracking-wide">
          ai-customer-agent.workflow.ts
        </span>
        <span className="ml-auto text-[10px] text-primary flex items-center gap-1.5 uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          live
        </span>
      </div>

      {/* Code body */}
      <div className="px-4 py-5 leading-[1.7]">
        <div className="flex">
          {/* Line numbers */}
          <div className="text-muted-foreground/40 select-none pr-4 text-right tabular-nums text-[12px]">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Code — line-by-line typewriter reveal */}
          <motion.div
            className="text-muted-foreground flex-1 overflow-x-auto"
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.07, delayChildren: 0.5 }}
          >
            <motion.div variants={codeLineVariant}>
              <span className="text-[hsl(15_60%_72%)]">export const</span>{" "}
              <span className="text-foreground">agent</span>
              {" = "}
              <span className="text-foreground">{"{"}</span>
            </motion.div>
            <motion.div variants={codeLineVariant} className="pl-4">
              <span className="text-foreground">name</span>:{" "}
              <span className="text-primary">"AI Customer Agent"</span>,
            </motion.div>
            <motion.div variants={codeLineVariant} className="pl-4">
              <span className="text-foreground">model</span>:{" "}
              <span className="text-[hsl(190_45%_70%)]">claude</span>.opus<span className="text-foreground">,</span>
            </motion.div>
            <motion.div variants={codeLineVariant} className="pl-4">
              <span className="text-foreground">tools</span>:{" "}
              <span className="text-foreground">[</span>
            </motion.div>
            <motion.div variants={codeLineVariant} className="pl-8">
              <span className="text-[hsl(190_45%_70%)]">crm</span>.lookup
              <span className="text-foreground">(email)</span>,
            </motion.div>
            <motion.div variants={codeLineVariant} className="pl-8">
              <span className="text-[hsl(190_45%_70%)]">knowledge</span>.search
              <span className="text-foreground">(query)</span>,
            </motion.div>
            <motion.div variants={codeLineVariant} className="pl-8">
              <span className="text-[hsl(190_45%_70%)]">ticket</span>.create
              <span className="text-foreground">({"{"} </span>
              priority<span className="text-foreground"> {"}"})</span>,
            </motion.div>
            <motion.div variants={codeLineVariant} className="pl-8">
              <span className="text-[hsl(190_45%_70%)]">handoff</span>.toHuman
              <span className="text-foreground">()</span>,
            </motion.div>
            <motion.div variants={codeLineVariant} className="pl-4">
              <span className="text-foreground">],</span>
            </motion.div>
            <motion.div variants={codeLineVariant} className="pl-4">
              <span className="text-foreground">memory</span>:{" "}
              <span className="text-[hsl(190_45%_70%)]">vector</span>.thread<span className="text-foreground">,</span>
            </motion.div>
            <motion.div variants={codeLineVariant}>
              <span className="text-foreground">{"};"}</span>
              {/* Blinking cursor at end of last line */}
              <span
                aria-hidden
                className="inline-block w-[7px] h-[14px] ml-1 -mb-0.5 bg-primary/85 align-middle animate-cursor-blink"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-secondary/40 text-[11px]">
        <div className="flex items-center gap-2.5 text-muted-foreground">
          <img
            src={portraitImage}
            alt="Eleazar"
            className="w-5 h-5 rounded-full object-cover border border-border"
          />
          <span className="text-foreground/80">@eleazar</span>
          <span className="text-border" aria-hidden>·</span>
          <span>n8n + Claude + Pinecone</span>
        </div>
        <span className="text-muted-foreground hidden sm:inline">~/agents</span>
      </div>
    </div>
  </div>
);
