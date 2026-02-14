import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashCursor from "@/components/SplashCursor";
import { TubesCursor } from "@/components/ui/tubes-cursor";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* <SplashCursor /> */}
      <div className="relative z-0">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
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
