import { useState } from "react";
import n8nLogo from "@/assets/logos/n8n.svg";
import makeLogo from "@/assets/logos/make.svg";
import zapierLogo from "@/assets/logos/zapier.svg";
import notionLogo from "@/assets/logos/notion.svg";
import apifyLogo from "@/assets/logos/apify.svg";
import hubspotLogo from "@/assets/logos/hubspot.svg";
import airtableLogo from "@/assets/logos/airtable.svg";
import openaiLogo from "@/assets/logos/openai.svg";
import geminiLogo from "@/assets/logos/gemini.svg";

const techTools = [
  { name: "n8n", logo: n8nLogo },
  { name: "Make.com", logo: makeLogo },
  { name: "Zapier", logo: zapierLogo },
  { name: "Notion", logo: notionLogo },
  { name: "Apify", logo: apifyLogo },
  { name: "HubSpot", logo: hubspotLogo },
  { name: "Airtable", logo: airtableLogo },
  { name: "OpenAI", logo: openaiLogo },
  { name: "Gemini", logo: geminiLogo },
];

export const TechStack = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Subtle pattern background */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            hsl(45 93% 54%) 10px,
            hsl(45 93% 54%) 11px
          )`
        }} />
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Tools I Build With
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A stack of automation and data tools that play nicely together.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 md:gap-12 max-w-4xl mx-auto">
          {techTools.map((tool, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-4"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className={`
                  w-28 h-28 md:w-32 md:h-32 rounded-full 
                  bg-card border-2 border-primary/30
                  flex items-center justify-center
                  cursor-pointer
                  transition-all duration-300
                  p-6
                  ${hoveredIndex === index 
                    ? 'border-primary shadow-[0_0_30px_hsl(45_93%_54%_/_0.5)] scale-110 rotate-3' 
                    : 'hover:border-primary/50'
                  }
                `}
                style={{
                  animation: hoveredIndex === index 
                    ? 'jelly 0.5s ease-in-out' 
                    : `float 3s ease-in-out infinite ${index * 0.2}s`,
                }}
              >
                <img 
                  src={tool.logo} 
                  alt={tool.name}
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="text-sm md:text-base font-medium text-primary">
                {tool.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
