import { useState } from "react";

const techTools = [
  { name: "n8n", icon: "🔗" },
  { name: "Make.com", icon: "⚙️" },
  { name: "Zapier", icon: "⚡" },
  { name: "Apify", icon: "🕷️" },
  { name: "Notion", icon: "📝" },
  { name: "HubSpot", icon: "🎯" },
  { name: "Google Sheets", icon: "📊" },
  { name: "Airtable", icon: "📋" },
  { name: "Slack", icon: "💬" },
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8 max-w-6xl mx-auto">
          {techTools.map((tool, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className={`
                  w-24 h-24 md:w-28 md:h-28 rounded-full 
                  bg-card border-2 border-primary/30
                  flex items-center justify-center
                  cursor-pointer
                  transition-all duration-300
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
                <span className="text-4xl md:text-5xl">{tool.icon}</span>
              </div>
              
              <div
                className={`
                  mt-3 text-sm md:text-base font-medium text-primary
                  transition-all duration-300
                  ${hoveredIndex === index 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-2'
                  }
                `}
              >
                {tool.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
