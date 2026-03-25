"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Bell, Sun, Moon, User as UserIcon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Sidebar } from "./_components/Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  admin: React.ReactNode;
  moderator: React.ReactNode;
  dashboard: React.ReactNode;
}

export default function DashboardLayout({
  children,
  admin,
  moderator,
  dashboard,
}: DashboardLayoutProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?callback=/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!user) return null;

  let slot = dashboard;
  if (user.role === "ADMIN") {
    slot = admin;
  } else if (user.role === "MODERATOR") {
    slot = moderator;
  }

  return (
    <div className={`flex min-h-screen w-full bg-background ${isDark ? 'dark' : ''}`}>
      <Sidebar role={user.role} userName={user.name} />

      <div className="flex-1 flex flex-col min-w-0 bg-gray-50/50 dark:bg-black/20 overflow-hidden relative">

        <div className="absolute top-0 right-0 -z-10 h-96 w-96 rounded-full bg-purple-500/5 blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 -z-10 h-96 w-96 rounded-full bg-indigo-500/5 blur-[100px]"></div>

        <header className="h-20 shrink-0 border-b border-white/5 bg-background/40 backdrop-blur-xl flex items-center justify-between px-6 md:px-10 z-40 sticky top-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search in dashboard..."
                className="pl-9 rounded-xl border-white/10 bg-white/5 focus-visible:ring-purple-500/50 h-10 w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground transition-all hover:bg-white/10">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-purple-500 rounded-full border-2 border-background"></span>
            </button>

            <button
              onClick={() => setIsDark(!isDark)}
              className="h-10 w-10 flex items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-all"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block"></div>

            <button className="flex items-center gap-3 p-1 pr-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              {user.photoUrl ? (
                <img src={user.photoUrl} alt={user.name} className="h-8 w-8 rounded-lg object-cover" />
              ) : (
                <div className="h-8 w-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <UserIcon className="h-4 w-4 text-purple-400" />
                </div>
              )}
              <span className="text-sm font-bold hidden lg:block">{user.name.split(' ')[0]}</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="max-w-7xl mx-auto pb-12 text-foreground">
            {slot}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
