"use client";

import { MoonStar, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type Theme = "light" | "dark";

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  try {
    localStorage.setItem("noshirvani-theme", theme);
  } catch {
    // Theme switching still works when browser storage is unavailable.
  }
  window.dispatchEvent(new Event("app-theme-change"));
}

function subscribeToTheme(onChange: () => void) {
  function syncStoredTheme(event: StorageEvent) {
    if (event.key !== "noshirvani-theme") return;
    const theme = event.newValue === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    onChange();
  }
  window.addEventListener("storage", syncStoredTheme);
  window.addEventListener("app-theme-change", onChange);
  return () => {
    window.removeEventListener("storage", syncStoredTheme);
    window.removeEventListener("app-theme-change", onChange);
  };
}

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribeToTheme, currentTheme, () => "light");

  function toggleTheme() {
    const nextTheme = currentTheme() === "dark" ? "light" : "dark";
    const update = () => applyTheme(nextTheme);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const documentWithTransition = document as Document & {
      startViewTransition?: (callback: () => void) => void;
    };
    if (!reducedMotion && documentWithTransition.startViewTransition) {
      documentWithTransition.startViewTransition(update);
      return;
    }
    document.documentElement.classList.add("theme-transitioning");
    update();
    window.setTimeout(() => document.documentElement.classList.remove("theme-transitioning"), 400);
  }

  const dark = theme === "dark";
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={dark ? "فعال‌کردن تم روشن" : "فعال‌کردن تم تیره"}
      aria-pressed={dark}
      className={cn("relative overflow-hidden", className)}
      onClick={toggleTheme}
    >
      <Sun
        className={cn(
          "absolute size-5 transition-all duration-300",
          dark ? "-rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100",
        )}
        aria-hidden="true"
      />
      <MoonStar
        className={cn(
          "absolute size-5 transition-all duration-300",
          dark ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0",
        )}
        aria-hidden="true"
      />
    </Button>
  );
}
