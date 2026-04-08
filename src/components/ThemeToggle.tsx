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
      <div className="w-9 h-9 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex items-center justify-center">
        <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-white/20 animate-pulse"></span>
      </div>
    );
  }

  return (
    <button
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className="relative flex items-center justify-center p-2 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-900 dark:text-white shadow-sm dark:shadow-none transition-all duration-300 group"
      aria-label="Toggle theme"
    >
      {currentTheme === "dark" ? (
        <Sun className="h-5 w-5 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.3)] transition-transform group-hover:rotate-45" />
      ) : (
        <Moon className="h-5 w-5 text-indigo-600 drop-shadow-[0_0_8px_rgba(79,70,229,0.2)] transition-transform group-hover:-rotate-12" />
      )}
    </button>
  );
}
