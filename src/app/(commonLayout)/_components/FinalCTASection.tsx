"use client";

import { Rocket, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FinalCTASection() {
  return (
    <section className="py-32 relative overflow-hidden bg-slate-100 dark:bg-slate-950">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full h-full opacity-20 dark:opacity-30"
          style={{ background: "radial-gradient(circle at 0% 0%, rgba(147,51,234,0.5) 0%, transparent 45%)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-full h-full opacity-20 dark:opacity-30"
          style={{ background: "radial-gradient(circle at 100% 100%, rgba(37,99,235,0.5) 0%, transparent 45%)" }}
        />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-12">
            <div className="h-24 w-24 rounded-[3rem] bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-[0_0_50px_-5px_rgba(168,85,247,0.4)] animate-pulse">
              <Rocket className="h-12 w-12 text-white" />
            </div>
            <Sparkles className="absolute -top-4 -right-4 h-8 w-8 text-amber-500 dark:text-amber-400 animate-bounce" />
          </div>

          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-slate-900 dark:text-white mb-8 max-w-5xl leading-none">
            Your Next Big Thing{" "}
            <span className="bg-linear-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
              Starts Here.
            </span>
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-xl md:text-2xl max-w-2xl mb-12 leading-relaxed">
            Join the premier indie maker community and get your product in front of thousands of developers today.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Link href="/user-dashboard/launch">
              <Button size="lg" className="h-16 px-10 rounded-2xl bg-purple-600 text-white hover:bg-purple-700 dark:bg-white dark:text-slate-900 dark:hover:bg-purple-500 dark:hover:text-white transition-all duration-500 font-black uppercase tracking-widest text-sm shadow-xl shadow-purple-500/20 group">
                Submit Your Project <Rocket className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </Link>

            <Link href="/products">
              <Button size="lg" variant="outline" className="h-16 px-10 rounded-2xl border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-500 font-black uppercase tracking-widest text-sm group">
                Browse Products <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
