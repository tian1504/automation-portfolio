import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DotGrid from "@/components/DotGrid";
import { ScrollProgress } from "@/components/ScrollProgress";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* Subtle ambient DotGrid — calm, on-brand */}
      <div className="fixed inset-0 z-0 opacity-50 pointer-events-none">
        <DotGrid
          dotSize={2}
          gap={36}
          baseColor="#1f1d1a"
          activeColor="#facc15"
          proximity={90}
          shockRadius={140}
          shockStrength={1.5}
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
