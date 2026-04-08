"use client";

import { Send, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-purple-50 dark:bg-slate-950">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full opacity-30 dark:opacity-20"
          style={{ background: "radial-gradient(circle at center, rgba(168,85,247,0.3) 0%, transparent 70%)" }}
        />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto p-12 md:p-20 rounded-[4rem] bg-white/80 dark:bg-white/5 backdrop-blur-3xl border border-purple-100 dark:border-white/10 text-center relative overflow-hidden shadow-2xl shadow-purple-100 dark:shadow-none">
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-purple-300/20 dark:bg-purple-500/20 blur-[80px]" />
          <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-blue-300/20 dark:bg-blue-500/20 blur-[80px]" />

          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="h-16 w-16 rounded-[2rem] bg-linear-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-xl shadow-purple-500/20 animate-bounce">
              <Zap className="h-8 w-8 text-white fill-current" />
            </div>

            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white">
              The Maker&apos;s Weekly
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed">
              Don&apos;t miss out on the next big tech launch. Join{" "}
              <span className="text-purple-600 dark:text-white font-bold">5,000+ indie makers</span>{" "}
              who get the best tools delivered to their inbox.
            </p>

            <form className="w-full max-w-lg mt-8 flex flex-col sm:flex-row gap-3 p-2 rounded-[2rem] bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus-within:border-purple-400 dark:focus-within:border-purple-500/50 transition-all duration-500 shadow-inner group">
              <div className="grow relative">
                <Input
                  type="email"
                  placeholder="name@email.com"
                  className="rounded-full border-none bg-transparent h-14 pl-6 text-slate-900 dark:text-white text-lg placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-0"
                  required
                />
              </div>
              <Button
                type="submit"
                className="rounded-full h-14 px-8 bg-purple-600 text-white hover:bg-purple-700 dark:bg-white dark:text-slate-900 dark:hover:bg-purple-500 dark:hover:text-white transition-all duration-500 font-black uppercase tracking-widest text-xs group/btn"
              >
                Subscribe Now <Send className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </Button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 opacity-70">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-slate-700 dark:text-white text-xs font-bold uppercase tracking-widest">No Spam</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span className="text-slate-700 dark:text-white text-xs font-bold uppercase tracking-widest">Top 12 Weekly Tools</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="text-slate-700 dark:text-white text-xs font-bold uppercase tracking-widest">Unsubscribe Anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
