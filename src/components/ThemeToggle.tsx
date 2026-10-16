"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme || theme;

  useEffect(() => {
    // Break the synchronous call chain to satisfy strict lint rules
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-full border border-border bg-muted/40 flex items-center justify-center">
        <span className="w-4 h-4 rounded-full bg-muted-foreground/20 animate-pulse"></span>
      </div>
    );
  }

  return (
    <button
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className="relative flex items-center justify-center p-2 rounded-full bg-card border border-border hover:bg-muted text-foreground shadow-xs transition-colors duration-200 group"
      aria-label="Toggle theme"
    >
      {currentTheme === "dark" ? (
        <Sun className="h-4.5 w-4.5 text-amber-500 transition-transform group-hover:rotate-45" />
      ) : (
        <Moon className="h-4.5 w-4.5 text-primary transition-transform group-hover:-rotate-12" />
      )}
    </button>
  );
}
