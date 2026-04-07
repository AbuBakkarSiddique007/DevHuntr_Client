"use client";

import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>
        {children}
        <Toaster position="top-center" />
      </AuthProvider>
    </ThemeProvider>
  );
}
