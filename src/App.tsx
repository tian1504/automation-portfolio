import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DotGrid from "@/components/DotGrid";
import { TubesCursor } from "@/components/ui/tubes-cursor";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* Fixed DotGrid background */}
      <div className="fixed inset-0 z-0">
        <DotGrid
          dotSize={4}
          gap={28}
          baseColor="#1a1a2e"
          activeColor="#5227FF"
          proximity={120}
          shockRadius={200}
          shockStrength={4}
        />
      </div>
      {/* Site content */}
      <div className="relative z-[1]">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
      {/* Global TubesCursor overlay */}
      <div className="fixed inset-0 z-10 pointer-events-none mix-blend-screen opacity-80">
        <TubesCursor />
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
