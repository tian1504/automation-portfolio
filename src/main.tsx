import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

/*
 * A deploy renames the hashed page chunks, so a tab opened before it asks for
 * files that no longer exist, and the next case-study click fails to load.
 * Reload once to pick up the new build. If loading fails again within a few
 * seconds of that reload (an outage, not a stale tab), don't loop: let the
 * error reach App's page boundary, which offers a plain Reload link.
 */
const RELOADED_AT = "eleazar:chunk-reload-at";
const RETRY_WINDOW_MS = 10_000;

window.addEventListener("vite:preloadError", () => {
  try {
    const last = Number(sessionStorage.getItem(RELOADED_AT) ?? 0);
    if (Date.now() - last < RETRY_WINDOW_MS) return;
    sessionStorage.setItem(RELOADED_AT, String(Date.now()));
  } catch {
    return; // No storage means no guard against a loop, so don't auto-reload.
  }
  // The load error still reaches the boundary (kept blank by this flag) and
  // the console, so a real failure stays visible in the logs.
  document.documentElement.setAttribute("data-reloading", "");
  window.location.reload();
});

createRoot(document.getElementById("root")!).render(<App />);
