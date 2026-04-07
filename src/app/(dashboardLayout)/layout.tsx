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
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar role={user.role} userName={user.name} photoUrl={user.photoUrl} />

      <div className="flex-1 flex flex-col min-w-0 bg-gray-50/50 dark:bg-black/20 overflow-hidden relative">

        <div className="absolute top-0 right-0 -z-10 h-96 w-96 rounded-full bg-purple-500/5 blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 -z-10 h-96 w-96 rounded-full bg-indigo-500/5 blur-[100px]"></div>

        <header className="h-20 shrink-0 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-background/40 backdrop-blur-xl flex items-center justify-between px-6 md:px-10 z-40 sticky top-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search in dashboard..."
                className="pl-9 rounded-xl border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 focus-visible:ring-purple-500/50 h-10 w-full"
              />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="max-w-7xl mx-auto pb-12 text-foreground">
            {children}
            {slot}
          </div>
        </main>
      </div>
    </div>
  );
}
