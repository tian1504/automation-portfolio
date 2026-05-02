import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 py-24 overflow-hidden">
      <motion.div
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.08, delayChildren: 0.05 }}
        className="max-w-2xl w-full text-left"
      >
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.5 }}
          className="font-mono text-[11px] md:text-xs text-primary tracking-[0.25em] uppercase mb-6 flex items-center gap-3"
        >
          <span>404</span>
          <span className="h-px w-8 bg-primary/40" aria-hidden />
          <span>Not Found</span>
        </motion.div>

        <motion.h1
          variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.6 }}
          className="font-display font-bold tracking-tightest leading-[0.95] text-5xl md:text-6xl lg:text-7xl text-foreground mb-6"
        >
          This route<br />
          doesn't exist<span className="text-primary">.</span>
        </motion.h1>

        <motion.p
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.5 }}
          className="text-base md:text-lg text-muted-foreground mb-3 max-w-md leading-relaxed"
        >
          You hit{" "}
          <span className="font-mono text-foreground/85 break-all">{location.pathname}</span>
          {" "}— that's not a workflow I've shipped yet.
        </motion.p>

        <motion.p
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.5 }}
          className="text-sm text-muted-foreground/70 mb-10 font-mono"
        >
          {/* automation: graceful_degradation.fallback() */}
        </motion.p>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.5 }}
        >
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium group h-11 px-5"
            asChild
          >
            <a href="/">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to home
            </a>
          </Button>
        </motion.div>
      </motion.div>
    </main>
  );
};

export default NotFound;
