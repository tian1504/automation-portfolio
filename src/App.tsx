import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollProgress } from "@/components/ScrollProgress";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";
import CaseStudyBookSourcing from "./pages/CaseStudyBookSourcing";
import CaseStudySpApi from "./pages/CaseStudySpApi";
import CaseStudySellerDashboard from "./pages/CaseStudySellerDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* Site content */}
      <div className="relative z-[1]">
        <ScrollProgress />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/case-study/book-sourcing-engine" element={<CaseStudyBookSourcing />} />
            <Route path="/case-study/amazon-sp-api" element={<CaseStudySpApi />} />
            <Route path="/case-study/seller-dashboard" element={<CaseStudySellerDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
