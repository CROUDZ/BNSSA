"use client";

import { useEffect, useState } from "react";

const THEME_KEY = "bnssa-theme";

type Theme = "light" | "dark";

const getSystemTheme = (): Theme => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = sessionStorage.getItem(THEME_KEY);
    const initial =
      stored === "light" || stored === "dark" ? stored : getSystemTheme();

    setTheme(initial);
    document.documentElement.dataset.theme = initial;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event: MediaQueryListEvent) => {
      if (sessionStorage.getItem(THEME_KEY)) return;
      const next = event.matches ? "dark" : "light";
      setTheme(next);
      document.documentElement.dataset.theme = next;
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const handleToggle = () => {
    if (!theme) return;
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    sessionStorage.setItem(THEME_KEY, next);
    document.documentElement.dataset.theme = next;
  };

  if (!mounted || !theme) return null;

  const isDark = theme === "dark";
  const label = isDark ? "Sombre" : "Clair";

  return (
    <div className="fixed right-4 top-4 z-50">
      <button
        type="button"
        onClick={handleToggle}
        aria-pressed={isDark}
        aria-label={`Passer en mode ${isDark ? "clair" : "sombre"}`}
        title={`Mode ${label}`}
        className="inline-flex items-center gap-2 rounded-full border border-soft bg-surface-veil px-3 py-1 text-xs font-semibold text-muted transition hover:text-foreground"
      >
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            isDark ? "bg-emerald-300" : "bg-amber-300"
          }`}
        />
        {label}
      </button>
    </div>
  );
}
