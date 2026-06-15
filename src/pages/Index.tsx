import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TechStack } from "@/components/TechStack";
import { Services } from "@/components/Services";
import { Experience } from "@/components/Experience";
import { Portfolio } from "@/components/Portfolio";
import { Builds } from "@/components/Builds";
import { Testimonials } from "@/components/Testimonials";
import { Process } from "@/components/Process";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { Contact } from "@/components/Contact";

const Index = () => {
  // Arriving with a hash (cross-page back-links like /#builds, /#portfolio):
  // react-router doesn't auto-scroll, and lazy content shifts layout, so
  // re-run scrollIntoView a few times until it settles. scroll-margin-top
  // (index.css) keeps the heading clear of the fixed navbar.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    let tries = 0;
    const timers: number[] = [];
    const scroll = () => {
      document.getElementById(id)?.scrollIntoView({ behavior: "auto" });
      if (++tries < 3) timers.push(window.setTimeout(scroll, 200));
    };
    timers.push(window.setTimeout(scroll, 60));
    return () => timers.forEach(window.clearTimeout);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <TechStack />
      <Services />
      <Experience />
      <Portfolio />
      <Builds />
      <Testimonials />
      <Process />
      <Pricing />
      <FAQ />
      <Contact />
    </div>
  );
};

export default Index;
