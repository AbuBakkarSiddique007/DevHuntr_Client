"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrendingGrid } from "./TrendingGrid";
import { useState, useEffect } from "react";
import { AIService } from "@/services/ai/ai.service";

export function TrendingSection() {
  const [insight, setInsight] = useState("");

  useEffect(() => {
    AIService.getTrendingInsight().then(setInsight);
  }, []);

  return (
    <section className="py-24 border-y border-slate-200 dark:border-border/30 dark:bg-black/50 relative z-10 overflow-hidden text-slate-900 dark:text-foreground">
      <div className="absolute inset-0 bg-purple-500/5 blur-[120px] -z-10"></div>
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-16 gap-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-black uppercase tracking-widest">
              <ArrowRight className="h-3.5 w-3.5" /> Hot This Week
            </div>
            {insight && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold animate-in fade-in zoom-in duration-700">
                <Sparkles className="h-3.5 w-3.5 text-purple-500" /> {insight}
              </div>
            )}
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">Trending Right Now</h2>
          <p className="text-slate-500 dark:text-muted-foreground text-lg max-w-2xl">The most upvoted products by the community this week.</p>
        </div>

        <TrendingGrid />

        <div className="mt-16 flex justify-center">
          <Link href="/products">
            <Button size="lg" variant="outline" className="rounded-full border-slate-200 dark:border-purple-500/30 hover:bg-slate-50 dark:hover:bg-purple-500/10 text-slate-900 dark:text-purple-400 font-bold px-8 h-14 group transition-all hover:scale-105 shadow-lg shadow-black/5 dark:shadow-purple-500/5">
              View all products <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
