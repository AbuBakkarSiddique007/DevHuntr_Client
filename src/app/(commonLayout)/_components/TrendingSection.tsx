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
    <section className="py-24 border-y border-border bg-card/40 relative z-10 overflow-hidden text-foreground">
      <div className="absolute inset-0 bg-primary/5 blur-3xl -z-10 pointer-events-none" />
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-14 gap-3">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold uppercase tracking-wider">
              <ArrowRight className="h-3.5 w-3.5" /> Hot This Week
            </div>
            {insight && (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium animate-in fade-in zoom-in duration-500">
                <Sparkles className="h-3.5 w-3.5" /> {insight}
              </div>
            )}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Trending Right Now</h2>
          <p className="text-muted-foreground text-base max-w-xl">The most upvoted products by the community this week.</p>
        </div>

        <TrendingGrid />

        <div className="mt-14 flex justify-center">
          <Link href="/products">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-border bg-background hover:bg-muted text-foreground font-semibold px-8 h-12 group transition-all"
            >
              View all products{" "}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
