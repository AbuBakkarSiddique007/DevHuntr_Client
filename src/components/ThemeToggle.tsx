"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
        <span className="w-4 h-4 rounded-full bg-white/20 animate-pulse"></span>
      </div>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative flex items-center justify-center p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white hover:text-white"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)] transition-transform hover:rotate-90" />
      ) : (
        <Moon className="h-5 w-5 text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)] transition-transform hover:scale-110" />
      )}
    </button>
  );
}
