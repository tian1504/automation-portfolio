import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// React Router keeps the previous scroll position across route changes, so
// arriving on a shorter page from deep in the home page lands mid- or
// end-of-page. Reset to the top whenever the pathname changes; in-page hash
// scrolling (e.g. /#builds) is handled by the Index page itself afterwards.
export const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};
