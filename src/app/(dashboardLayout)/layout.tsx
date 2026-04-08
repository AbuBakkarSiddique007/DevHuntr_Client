"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import React from "react";
import {
  Search,
  Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Sidebar } from "./_components/Sidebar";
import { Menu, X } from "lucide-react";
import { useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  admin: React.ReactNode;
  moderator: React.ReactNode;
  user: React.ReactNode;
}

export default function DashboardLayout({
  children,
  admin,
  moderator,
  user: userSlot,
}: DashboardLayoutProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
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

  let slot: React.ReactNode = null;
  if (user.role === "ADMIN") {
    slot = admin;
  } else if (user.role === "MODERATOR") {
    slot = moderator;
  } else {
    slot = userSlot;
  }

  return (
    <div className="flex min-h-screen w-full bg-background relative">
      {/* Mobile Sidebar Backdrop */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-60 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop Sticky, Mobile Drawer */}
      <div className={`fixed inset-y-0 left-0 z-70 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Sidebar role={user.role} userName={user.name} photoUrl={user.photoUrl} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-black/20 overflow-hidden relative">

        <div className="absolute top-0 right-0 -z-10 h-96 w-96 rounded-full bg-purple-500/5 blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 -z-10 h-96 w-96 rounded-full bg-indigo-500/5 blur-[100px]"></div>

        <header className="h-20 shrink-0 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-background/40 backdrop-blur-xl flex items-center justify-between px-6 lg:px-12 z-40 sticky top-0 md:gap-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 transition-all"
            >
              {isMobileSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <div className="relative w-full max-w-md hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                className="pl-9 rounded-2xl border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 focus-visible:ring-purple-500/30 h-11 w-full text-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-[0.2em] text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-100 dark:border-purple-500/20">
              {user.role} Dashboard
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="max-w-7xl mx-auto pb-12 text-foreground">
            {slot}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
