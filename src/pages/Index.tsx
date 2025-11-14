import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TechStack } from "@/components/TechStack";
import { Services } from "@/components/Services";
import { Experience } from "@/components/Experience";
import { Portfolio } from "@/components/Portfolio";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <TechStack />
      <Services />
      <Experience />
      <Portfolio />
      <Testimonials />
      <Contact />
    </div>
  );
};

export default Index;
