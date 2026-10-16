"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Orbit, 
  LogOut, 
  Menu, 
  X, 
  UserCircle, 
  LayoutDashboard, 
  ChevronDown, 
  Contact,
  Sparkles,
  Search,
  Compass,
  Flame,
  Info
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/products",  label: "Explore",   icon: Compass },
  { href: "/featured",  label: "Featured",  icon: Flame },
  { href: "/about",     label: "About Us",  icon: Info },
  { href: "/contact",   label: "Contact",   icon: Contact },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Scroll elevation listener
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isUserMenuOpen]);

  // Close menus when route changes
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }

  const isActive = (href: string) => pathname === href;

  return (
    <header
      className={cn(
        "sticky top-0 z-[--z-header] w-full transition-all duration-300",
        scrolled
          ? "bg-background/80 dark:bg-background/70 backdrop-blur-2xl border-b border-border/80 shadow-xs shadow-primary/5 py-2.5"
          : "bg-background/60 dark:bg-background/40 backdrop-blur-xl border-b border-border/30 py-3 sm:py-4"
      )}
      style={{ zIndex: "var(--z-header)" }}
    >
      <div className="container mx-auto px-3.5 sm:px-6 flex items-center justify-between gap-3 sm:gap-4">

        {/* ── Brand Logo ── */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl bg-linear-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white shadow-md shadow-purple-500/25 group-hover:shadow-purple-500/40 group-hover:scale-105 transition-all duration-300 shrink-0">
            <Orbit className="h-4.5 w-4.5 sm:h-5 sm:w-5 animate-[spin_8s_linear_infinite]" />
            <div className="absolute inset-0 rounded-2xl bg-white/20 blur-xs opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight bg-clip-text text-transparent bg-linear-to-r from-purple-600 via-indigo-600 to-pink-600 dark:from-white dark:via-white/90 dark:to-white/70">
              DevHuntr
            </span>
            <span className="hidden xs:inline-flex px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 tracking-wider uppercase shrink-0">
              Live
            </span>
          </div>
        </Link>

        {/* ── Center Floating Dock / Navigation (Desktop Only) ── */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center">
          <div className="flex items-center gap-1 p-1 rounded-full bg-muted/40 dark:bg-card/40 backdrop-blur-xl border border-border/60 shadow-inner">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "relative px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5",
                    active
                      ? "bg-background text-foreground shadow-xs border border-border/50 font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <Icon className={cn("h-3.5 w-3.5", active ? "text-primary" : "opacity-60")} />
                  <span>{label}</span>
                  {active && (
                    <span className="h-1 w-1 rounded-full bg-primary absolute -bottom-0.5 left-1/2 -translate-x-1/2 shadow-xs shadow-primary" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* ── Desktop Right Controls (Desktop Only) ── */}
        <div className="hidden md:flex items-center gap-3">
          {/* Quick Search Shortcut */}
          <Link
            href="/products"
            aria-label="Search tech products"
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground bg-muted/40 hover:bg-muted/70 hover:text-foreground border border-border/50 transition-all group"
          >
            <Search className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="hidden xl:inline">Search...</span>
            <kbd className="hidden xl:inline px-1.5 py-0.2 text-[10px] font-mono font-medium rounded bg-background border border-border/60 text-muted-foreground/80">
              ⌘K
            </kbd>
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Desktop Auth Controls */}
          {user ? (
            <div className="flex items-center gap-2.5">
              {/* Creator Launch Shortcut */}
              {user.role === "USER" && (
                <Link href="/user-dashboard/launch">
                  <Button
                    size="sm"
                    className="rounded-full bg-linear-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-90 shadow-md shadow-purple-500/20 text-white text-xs font-semibold px-4 py-1.5 transition-all hover:scale-[1.02] active:scale-[0.98] border-none gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Launch App</span>
                  </Button>
                </Link>
              )}

              {/* Desktop User Dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button
                  aria-label="Open user menu"
                  aria-expanded={isUserMenuOpen}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 pr-2.5 rounded-full bg-muted/40 hover:bg-muted/80 border border-border/60 hover:border-primary/40 transition-all cursor-pointer shadow-2xs"
                >
                  {user?.photoUrl ? (
                    <Image
                      src={user.photoUrl}
                      alt={user?.name || "User"}
                      width={32}
                      height={32}
                      className="h-7 w-7 rounded-full object-cover ring-1 ring-primary/20"
                    />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-linear-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      {user?.name ? user.name.charAt(0).toUpperCase() : <UserCircle className="h-4 w-4" />}
                    </div>
                  )}
                  <span className="text-xs font-semibold max-w-[90px] truncate text-foreground">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 text-muted-foreground transition-transform duration-300",
                      isUserMenuOpen && "rotate-180"
                    )}
                  />
                </button>

                {/* macOS / Linear-Style Profile Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-card/95 backdrop-blur-2xl border border-border shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200 z-modal">
                    <div className="p-3 rounded-xl bg-muted/40 border border-border/40 mb-1.5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          {user?.role}
                        </span>
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                      <p className="text-xs font-semibold text-foreground truncate">{user?.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
                    </div>

                    <div className="space-y-0.5">
                      <Link
                        href={`/${user?.role?.toLowerCase() || "user"}-dashboard`}
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-muted/80 transition-colors group"
                      >
                        <LayoutDashboard className="h-4 w-4 text-primary" />
                        <span>Console Dashboard</span>
                      </Link>
                      {user?.role === "USER" && (
                        <Link
                          href="/user-dashboard/launch"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-muted/80 transition-colors group"
                        >
                          <Sparkles className="h-4 w-4 text-purple-500" />
                          <span>Submit Product</span>
                        </Link>
                      )}
                    </div>

                    <div className="h-px bg-border/60 my-1.5" />

                    <button
                      onClick={async () => {
                        setIsUserMenuOpen(false);
                        await logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-xs font-medium text-muted-foreground hover:text-foreground px-3.5 hover:bg-muted/50 cursor-pointer"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="rounded-full bg-linear-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-90 shadow-md shadow-purple-500/25 text-white text-xs font-semibold px-4 py-1.5 hover:scale-[1.02] active:scale-[0.98] transition-all border-none cursor-pointer"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* ── Mobile Action Controls (Mobile Only) ── */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Unified Mobile Menu Button */}
          {user ? (
            /* Logged-in state: avatar + menu icon in a sleek compact pill */
            <button
              aria-label={isMobileMenuOpen ? "Close menu" : "Open user and navigation menu"}
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "flex items-center gap-1.5 p-1 pl-1 pr-2 rounded-full border transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0",
                isMobileMenuOpen
                  ? "bg-primary/10 border-primary/40 text-primary"
                  : "bg-muted/50 hover:bg-muted/80 border-border/70 text-foreground"
              )}
            >
              {user.photoUrl ? (
                <Image
                  src={user.photoUrl}
                  alt={user.name || "User"}
                  width={26}
                  height={26}
                  className="h-6.5 w-6.5 rounded-full object-cover ring-1 ring-primary/40 shrink-0"
                />
              ) : (
                <div className="h-6.5 w-6.5 rounded-full bg-linear-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
              )}
              {isMobileMenuOpen ? (
                <X className="h-4 w-4 shrink-0 transition-transform duration-200" />
              ) : (
                <Menu className="h-4 w-4 shrink-0 transition-transform duration-200" />
              )}
            </button>
          ) : (
            /* Guest state: clean circular hamburger button */
            <button
              aria-label={isMobileMenuOpen ? "Close menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "flex items-center justify-center h-9 w-9 rounded-full border transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0",
                isMobileMenuOpen
                  ? "bg-primary/10 border-primary/40 text-primary"
                  : "bg-muted/50 hover:bg-muted/80 border-border/70 text-muted-foreground hover:text-foreground"
              )}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>

      {/* ── Mobile Full-Width Menu Drawer ── */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden absolute top-full left-0 w-full bg-background/95 dark:bg-card/95 backdrop-blur-3xl border-b border-border shadow-2xl p-4 sm:p-5 flex flex-col gap-3 animate-in slide-in-from-top-2 fade-in duration-200 max-h-[calc(100dvh-5rem)] overflow-y-auto"
          style={{ zIndex: "var(--z-header)" }}
        >
          {/* Quick Search inside mobile menu */}
          <Link
            href="/products"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-muted/50 border border-border/60 text-muted-foreground text-xs font-medium hover:border-primary/40 transition-colors"
          >
            <Search className="h-3.5 w-3.5 text-primary" />
            <span>Search apps, tools & products...</span>
          </Link>

          {/* Nav Links */}
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={cn("h-4 w-4", active ? "text-primary" : "opacity-60")} />
                    <span>{label}</span>
                  </div>
                  {active && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                </Link>
              );
            })}
          </div>

          <div className="h-px bg-border/60 my-1" />

          {/* User actions on mobile */}
          {user ? (
            <div className="flex flex-col gap-2 pt-1">
              {/* User Profile Card */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border/40">
                {user?.photoUrl ? (
                  <Image
                    src={user.photoUrl}
                    alt={user?.name || "User"}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover ring-1 ring-primary/20 shrink-0"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-linear-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <UserCircle className="h-5 w-5" />}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{user?.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                  {user?.role}
                </span>
              </div>

              {/* Launch Shortcut for Creators */}
              {user.role === "USER" && (
                <Link
                  href="/user-dashboard/launch"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 font-semibold bg-linear-to-r from-purple-600 via-indigo-600 to-pink-600 rounded-xl text-white text-xs shadow-md shadow-purple-500/20 active:scale-[0.98] transition-all"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Launch New App</span>
                </Link>
              )}

              {/* Console Dashboard Link */}
              <Link
                href={`/${user?.role?.toLowerCase() || "user"}-dashboard`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 font-medium text-foreground hover:bg-muted/60 rounded-xl transition-colors text-xs"
              >
                <LayoutDashboard className="h-4 w-4 text-primary" />
                <span>Console Dashboard</span>
              </Link>

              {/* Sign Out Button */}
              <button
                onClick={async () => {
                  setIsMobileMenuOpen(false);
                  await logout();
                }}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 font-medium text-destructive hover:bg-destructive/10 rounded-xl transition-colors text-xs cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-1">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full rounded-xl text-xs h-10 border-border/60">
                  Sign In
                </Button>
              </Link>
              <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full rounded-xl text-xs h-10 bg-linear-to-r from-purple-600 via-indigo-600 to-pink-600 text-white font-semibold shadow-md shadow-purple-500/20 border-none">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
