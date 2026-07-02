"use client";

import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

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
  const label = isDark ? "mode clair" : "mode sombre";

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={isDark}
      aria-label={`Passer en mode ${isDark ? "clair" : "sombre"}`}
      title={`Passer en ${label}`}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-sm text-muted transition hover:bg-surface-veil hover:text-foreground"
    >
      {isDark ? (
        <FaSun aria-hidden="true" className="text-amber-300" />
      ) : (
        <FaMoon aria-hidden="true" />
      )}
    </button>
  );
}
