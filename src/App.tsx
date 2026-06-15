import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DotGrid from "@/components/DotGrid";
import { ScrollProgress } from "@/components/ScrollProgress";
import Index from "./pages/Index";
import Audit from "./pages/Audit";
import CaseStudyOutbound from "./pages/CaseStudyOutbound";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* Subtle ambient DotGrid — faint warm texture + a soft (not neon) cursor reveal */}
      <div className="fixed inset-0 z-0 opacity-70 pointer-events-none">
        <DotGrid
          dotSize={2}
          gap={32}
          baseColor="#2a241d"
          activeColor="#e0b53a"
          proximity={130}
          shockRadius={150}
          shockStrength={1.6}
        />
      </div>
      {/* Site content */}
      <div className="relative z-[1]">
        <ScrollProgress />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/audit" element={<Audit />} />
            <Route path="/case-study/outbound-engine" element={<CaseStudyOutbound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
