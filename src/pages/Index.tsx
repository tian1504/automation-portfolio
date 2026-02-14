import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TubesCursor } from "@/components/ui/tubes-cursor";
import { TechStack } from "@/components/TechStack";
import { Services } from "@/components/Services";
import { Experience } from "@/components/Experience";
import { Portfolio } from "@/components/Portfolio";
import { Pricing } from "@/components/Pricing";
import { Contact } from "@/components/Contact";

const Index = () => {
  return (
    <div className="min-h-screen">
      <TubesCursor />
      <Navbar />
      <Hero />
      <TechStack />
      <Services />
      <Experience />
      <Portfolio />
      <Pricing />
      <Contact />
    </div>
  );
};

export default Index;
