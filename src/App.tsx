import { Component, lazy, Suspense, type ReactNode } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { MotionConfig } from "motion/react";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";

// Case studies load on demand, so the homepage ships only what it shows.
const CaseStudyBookSourcing = lazy(() => import("./pages/CaseStudyBookSourcing"));
const CaseStudySpApi = lazy(() => import("./pages/CaseStudySpApi"));
const CaseStudySellerDashboard = lazy(() => import("./pages/CaseStudySellerDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

const Blank = () => <div className="min-h-screen bg-background" />;

/**
 * If a page fails to load or render (most often a case study whose chunk a
 * deploy replaced while this tab was open), show a plain way out instead of
 * an empty page. While main.tsx is already reloading for a fresh build, stay
 * blank so the message doesn't flash.
 */
class PageBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    if (document.documentElement.hasAttribute("data-reloading")) return <Blank />;
    return (
      <main className="flex min-h-screen items-center">
        <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
          <h1 className="h-section max-w-[20ch] font-display font-semibold text-foreground">
            This page didn’t load.
          </h1>
          <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-muted-foreground md:text-[17px]">
            The site may have been updated while you had it open. Reloading usually fixes it.
          </p>
          <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-base">
            <a
              href={window.location.href}
              onClick={(e) => {
                e.preventDefault();
                window.location.reload();
              }}
              className="inline-flex min-h-11 items-center text-foreground underline decoration-border underline-offset-4 transition-colors duration-150 ease-out-strong [@media(hover:hover)_and_(pointer:fine)]:hover:decoration-foreground"
            >
              Reload the page
            </a>
            <a
              href="/"
              className="inline-flex min-h-11 items-center text-muted-foreground underline decoration-border underline-offset-4 transition-colors duration-150 ease-out-strong [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground"
            >
              Go to the homepage
            </a>
          </p>
        </div>
      </main>
    );
  }
}

const Pages = () => {
  // A new route gets a fresh boundary, so Back recovers from a failed page.
  const { pathname } = useLocation();
  return (
    <PageBoundary key={pathname}>
      <Suspense fallback={<Blank />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/case-study/book-sourcing-engine" element={<CaseStudyBookSourcing />} />
          <Route path="/case-study/amazon-sp-api" element={<CaseStudySpApi />} />
          <Route path="/case-study/seller-dashboard" element={<CaseStudySellerDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </PageBoundary>
  );
};

const App = () => (
  // reducedMotion="user": entrance transforms drop for visitors who ask for
  // less motion; opacity (which carries comprehension) stays.
  <MotionConfig reducedMotion="user">
    <div className="relative z-[1]">
      <BrowserRouter>
        <ScrollToTop />
        <Pages />
      </BrowserRouter>
    </div>
  </MotionConfig>
);

export default App;
