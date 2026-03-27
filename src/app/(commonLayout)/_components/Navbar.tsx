"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Ghost, LogOut, Menu, UserCircle, LayoutDashboard, ChevronDown } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/70 backdrop-blur-xl supports-backdrop-filter:bg-background/40 transition-all duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform duration-300">
            <Ghost className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
            DevHuntr
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/products" className="text-sm font-medium text-muted-foreground hover:text-foreground hover:scale-105 transition-all">
            Products
          </Link>
        </nav>

        {/* AUTH ACTIONS */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              {user.role === "USER" && (
                <Link href="/user-dashboard/launch">
                  <Button size="sm" className="hidden lg:flex rounded-full bg-linear-to-r from-purple-600 to-pink-600 hover:opacity-90 shadow-lg shadow-purple-500/25 border-none transition-all hover:-translate-y-0.5">
                    Launch App
                  </Button>
                </Link>
              )}

              {/* USER DROPDOWN */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  onBlur={() => setTimeout(() => setIsUserMenuOpen(false), 200)}
                  className="flex items-center gap-2 p-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                >
                  {user?.photoUrl ? (
                    <Image
                      src={user.photoUrl}
                      alt={user?.name || "User"}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full object-cover border border-white/10"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-linear-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center border border-white/10">
                      <UserCircle className="h-5 w-5 text-purple-400" />
                    </div>
                  )}
                  <ChevronDown className={`h-4 w-4 text-muted-foreground group-hover:text-foreground transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-background/95 backdrop-blur-2xl border border-white/10 shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-3 py-2 border-b border-white/5 mb-1">
                      <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider">{user?.role} Console</p>
                      <p className="text-sm font-bold truncate">{user?.name}</p>
                    </div>

                    <Link href={`/${user?.role?.toLowerCase()}-dashboard`} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors group">
                      <LayoutDashboard className="h-4 w-4 group-hover:text-purple-500 transition-colors" />
                      Dashboard
                    </Link>

                    <button
                      onClick={() => logout()}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors group"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="rounded-full hover:bg-white/5 transition-all">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button className="rounded-full bg-linear-to-r from-indigo-500 to-purple-600 hover:opacity-90 shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-0.5">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          className="md:hidden p-2 text-foreground/80 hover:text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* MOBILE NAV */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background/95 backdrop-blur-3xl border-b border-border p-4 flex flex-col gap-4 animate-in slide-in-from-top-4 fade-in-90">
          <Link href="/products" className="px-4 py-2 font-medium hover:bg-white/5 rounded-lg transition-colors">Products</Link>
          <div className="h-px bg-border my-2" />
          {user ? (
            <>
              {user.role === "USER" && (
                <Link href="/user-dashboard/launch" className="px-4 py-2 font-medium bg-linear-to-r from-purple-600 to-pink-600 rounded-lg text-white text-center shadow-lg shadow-purple-500/20">Launch App</Link>
              )}
              <Link href={`/${user?.role?.toLowerCase()}-dashboard`} className="flex items-center gap-3 px-4 py-3 font-medium hover:bg-white/5 rounded-xl transition-colors group">
                <LayoutDashboard className="h-5 w-5 text-purple-400" />
                Dashboard
              </Link>
              <button
                onClick={() => logout()}
                className="flex items-center gap-3 w-full px-4 py-3 font-medium text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/login"><Button variant="outline" className="w-full">Sign In</Button></Link>
              <Link href="/register"><Button className="w-full bg-linear-to-r from-indigo-500 to-purple-600">Get Started</Button></Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
