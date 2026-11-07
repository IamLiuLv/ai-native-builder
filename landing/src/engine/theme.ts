// Light / dark follows the book. The book (VitePress) stores the reader's choice in
// localStorage under "vitepress-theme-appearance" ("light" | "dark" | "auto"); this site is
// served from the same origin, so it reads the same key. "auto" or nothing → the OS setting.
// index.html applies the class before first paint (no flash); this keeps it in sync after.

import { useEffect, useState } from "react";

export const APPEARANCE_KEY = "vitepress-theme-appearance";

function prefersDark(): boolean {
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(APPEARANCE_KEY);
  } catch {
    // Storage can be blocked (private mode, some in-app webviews): fall back to the OS.
  }
  if (stored === "dark") return true;
  if (stored === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function apply(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#1b1915" : "#fbf8f1");
}

/** Toggle the theme here; the book picks the same choice up on its next page load. */
export function setAppearance(dark: boolean) {
  try {
    localStorage.setItem(APPEARANCE_KEY, dark ? "dark" : "light");
  } catch {
    // Not persisted, but still applied for this page.
  }
  apply(dark);
}

/** Whether the page is dark right now, re-rendering when it changes. */
export function useDark(): boolean {
  const [dark, setDark] = useState(() => typeof document !== "undefined" && document.documentElement.classList.contains("dark"));
  useEffect(() => {
    const sync = () => apply(prefersDark());
    sync();
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", sync);
    // Another tab (e.g. the book) changed the choice.
    const onStorage = (e: StorageEvent) => e.key === APPEARANCE_KEY && sync();
    window.addEventListener("storage", onStorage);
    const observer = new MutationObserver(() => setDark(document.documentElement.classList.contains("dark")));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    setDark(document.documentElement.classList.contains("dark"));
    return () => {
      media.removeEventListener("change", sync);
      window.removeEventListener("storage", onStorage);
      observer.disconnect();
    };
  }, []);
  return dark;
}
