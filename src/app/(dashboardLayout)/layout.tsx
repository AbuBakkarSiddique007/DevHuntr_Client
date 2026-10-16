"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import React from "react";
import {
  Search,
  Loader2,
  Menu,
  X,
  ChevronRight,
  LayoutDashboard
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Sidebar } from "./_components/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

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
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setIsMobileSidebarOpen(false);
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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

  // Derive human-readable page name for breadcrumb
  const pathSegments = pathname.split("/").filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1] || "dashboard";
  const pageTitle = lastSegment
    .replace("-dashboard", " Overview")
    .replace("-", " ")
    .replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="flex min-h-screen w-full bg-background relative">
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm lg:hidden"
          style={{ zIndex: "var(--z-sidebar)" }}
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 w-64 lg:w-auto transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isMobileSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{ zIndex: "var(--z-modal)" }}
      >
        <Sidebar
          role={user.role}
          userName={user.name}
          photoUrl={user.photoUrl}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden relative">
        <div className="absolute top-0 right-0 -z-10 h-80 w-80 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

        <header
          className="h-16 shrink-0 border-b border-border bg-card/60 backdrop-blur-xl flex items-center justify-between px-3 sm:px-4 lg:px-8 sticky top-0"
          style={{ zIndex: "var(--z-header)" }}
        >
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button 
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              aria-label={isMobileSidebarOpen ? "Close sidebar menu" : "Open sidebar menu"}
              className="lg:hidden p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              {isMobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
              <Link href={`/${user.role.toLowerCase()}-dashboard`} className="hover:text-foreground flex items-center gap-1 transition-colors shrink-0">
                <LayoutDashboard className="h-3.5 w-3.5 text-primary" />
                <span>Console</span>
              </Link>
              <ChevronRight className="h-3 w-3 text-muted-foreground/60 shrink-0" />
              <span className="font-semibold text-foreground truncate max-w-[140px] lg:max-w-[200px]">{pageTitle}</span>
            </div>

            {/* Mobile-only page title */}
            <span className="sm:hidden text-sm font-bold text-foreground truncate max-w-[140px]">{pageTitle}</span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search: hidden on mobile, visible on sm+ */}
            <form onSubmit={handleSearchSubmit} className="relative hidden sm:block w-48 sm:w-56 lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                aria-label="Search all products"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 rounded-full border-border bg-muted/60 text-xs focus-visible:ring-primary/30 w-full"
              />
            </form>

            <ThemeToggle />

            {/* Role badge: hidden on mobile */}
            <span className="hidden sm:inline-flex text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20 shrink-0">
              {user.role}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-300">
          <div className="max-w-7xl mx-auto pb-12 text-foreground">
            {slot}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
