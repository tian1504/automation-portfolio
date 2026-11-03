/**
 * Build-time pre-render (no browser involved): turns each page into plain HTML
 * so search engines and AI crawlers that do not run JavaScript can read it.
 * Used only by scripts/prerender.mjs after `vite build`; visitors still get the
 * normal app, which replaces this HTML as soon as it starts.
 */
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { Route, Routes } from "react-router-dom";
import { MotionConfig } from "motion/react";
import Index from "./pages/Index";
import ClaudeCode from "./pages/ClaudeCode";
import AiAgents from "./pages/AiAgents";
import CaseStudyFactCheckedReviews from "./pages/CaseStudyFactCheckedReviews";
import CaseStudyInstagramAgent from "./pages/CaseStudyInstagramAgent";
import CaseStudyColdEmail from "./pages/CaseStudyColdEmail";
import CaseStudyBookSourcing from "./pages/CaseStudyBookSourcing";
import CaseStudySpApi from "./pages/CaseStudySpApi";
import CaseStudySellerDashboard from "./pages/CaseStudySellerDashboard";

export function render(url: string) {
  return renderToString(
    <MotionConfig reducedMotion="user">
      <div className="relative z-[1]">
        <StaticRouter location={url}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/claude-code" element={<ClaudeCode />} />
            <Route path="/ai-agents" element={<AiAgents />} />
            <Route path="/case-study/fact-checked-ai-reviews" element={<CaseStudyFactCheckedReviews />} />
            <Route path="/case-study/instagram-dm-agent" element={<CaseStudyInstagramAgent />} />
            <Route path="/case-study/cold-email-safety-checks" element={<CaseStudyColdEmail />} />
            <Route path="/case-study/book-sourcing-engine" element={<CaseStudyBookSourcing />} />
            <Route path="/case-study/amazon-sp-api" element={<CaseStudySpApi />} />
            <Route path="/case-study/seller-dashboard" element={<CaseStudySellerDashboard />} />
          </Routes>
        </StaticRouter>
      </div>
    </MotionConfig>,
  );
}
