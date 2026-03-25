"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Ghost, LogOut, Menu, UserCircle } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          <Link href="/#trending" className="text-sm font-medium text-muted-foreground hover:text-foreground hover:scale-105 transition-all">
            Trending
          </Link>
        </nav>

        {/* AUTH ACTIONS */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/products/launch">
                <Button size="sm" className="hidden lg:flex rounded-full bg-linear-to-r from-purple-600 to-pink-600 hover:opacity-90 shadow-lg shadow-purple-500/25 border-none transition-all hover:-translate-y-0.5">
                  Launch App
                </Button>
              </Link>
              <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group">
                <UserCircle className="h-5 w-5 group-hover:text-purple-500 transition-colors" />
                <span>{user.name}</span>
              </Link>
              <Button onClick={() => logout()} variant="outline" size="sm" className="rounded-full border-white/20 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
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
          <Link href="/#trending" className="px-4 py-2 font-medium hover:bg-white/5 rounded-lg transition-colors">Trending</Link>
          <div className="h-px bg-border my-2" />
          {user ? (
            <>
              <Link href="/products/launch" className="px-4 py-2 font-medium bg-linear-to-r from-purple-600 to-pink-600 rounded-lg text-white text-center">Launch App</Link>
              <Link href="/dashboard" className="px-4 py-2 font-medium hover:bg-white/5 rounded-lg transition-colors">Dashboard</Link>
              <Button onClick={() => logout()} variant="destructive" className="w-full justify-start mt-2">
                Logout
              </Button>
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
