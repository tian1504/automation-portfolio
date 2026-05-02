import { ArrowUpRight, Calendar } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";
import portraitImage from "@/assets/portrait.png";

const BOOKING_URL = "https://calendly.com/tian1504/30min";

const channels = [
  {
    label: "Email",
    handle: "tian1504@gmail.com",
    href: "https://mail.google.com/mail/?view=cm&to=tian1504@gmail.com",
  },
  {
    label: "LinkedIn",
    handle: "in/eleazar-sebastian-martinez",
    href: "https://www.linkedin.com/in/eleazar-sebastian-martinez-76210983/",
  },
  {
    label: "GitHub",
    handle: "tian1504",
    href: "https://github.com/tian1504",
  },
  {
    label: "Upwork",
    handle: "Top Rated",
    href: "https://www.upwork.com/freelancers/~01ac0c23391406fb0d?nav_dir=pop",
  },
];

export const Contact = () => {
  return (
    <section id="contact" className="section-padding relative">
      <div className="container-custom">
        <SectionHeading
          number="09"
          label="Contact"
          title="Let's talk."
          description="Best way is a quick call — I usually reply within 24 hours. Tell me what's leaking time and I'll tell you if I can help."
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16 items-start">
          {/* Channels list */}
          <div className="border-t border-border">
            {channels.map((channel, index) => (
              <motion.a
                key={channel.label}
                href={channel.href}
                target={channel.href.startsWith("http") ? "_blank" : undefined}
                rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group flex items-center justify-between py-5 border-b border-border hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center gap-6">
                  <span className="font-mono text-[11px] text-primary tracking-[0.25em] uppercase w-20">
                    {channel.label}
                  </span>
                  <span className="text-base md:text-lg text-foreground/85 group-hover:text-foreground transition-colors">
                    {channel.handle}
                  </span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
              </motion.a>
            ))}
          </div>

          {/* Booking card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative border border-primary/30 bg-primary/[0.04] p-8 lg:p-10 rounded-sm overflow-hidden"
          >
            <div
              aria-hidden
              className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-30 blur-3xl"
              style={{ background: "radial-gradient(circle, hsl(45 93% 54% / 0.5), transparent 70%)" }}
            />
            <div className="relative">
              {/* Editorial portrait with availability indicator */}
              <div className="relative inline-block mb-6">
                <div className="relative w-24 h-24 md:w-28 md:h-28 overflow-hidden rounded-sm border border-border bg-card/40">
                  <img
                    src={portraitImage}
                    alt="Eleazar Sebastian Martinez"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                {/* Green availability dot, sits on the bottom-right corner of the portrait */}
                <span
                  className="absolute -bottom-1 -right-1 flex h-4 w-4"
                  aria-label="Currently available for new projects"
                >
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/70 animate-ping" />
                  <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-400 border-[2.5px] border-background" />
                </span>
              </div>

              <div className="font-mono text-[11px] text-primary tracking-[0.25em] uppercase mb-4">
                Booking
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3 tracking-tight leading-tight">
                Book a 30-min discovery call.
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-7 leading-relaxed">
                Tell me what your team is doing manually right now. I'll come back with a quick automation plan or a referral if it's outside my lane.
              </p>
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium h-11 px-5 group"
                asChild
              >
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule on Calendly
                  <ArrowUpRight className="ml-2 h-4 w-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-24 md:mt-32 border-t border-border">
        <div className="container-custom py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-muted-foreground">
          <span>
            © {new Date().getFullYear()} — Eleazar Sebastian Martinez.
          </span>
          <span className="text-muted-foreground/70">
            Built in React + Tailwind, with entirely too much n8n.
          </span>
        </div>
      </footer>
    </section>
  );
};
