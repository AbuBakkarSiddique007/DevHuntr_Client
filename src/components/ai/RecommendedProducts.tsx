"use client";

import { useEffect, useState } from "react";
import { AIService, AISuggestion } from "@/services/ai/ai.service";
import { Sparkles, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function RecommendedProducts() {
  const [recommendations, setRecommendations] = useState<AISuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecs = async () => {
      const data = await AIService.getRecommendations();
      setRecommendations(data);
      setIsLoading(false);
    };
    fetchRecs();
  }, []);

  if (!isLoading && (!recommendations || recommendations.length === 0)) return null;

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-purple-600 dark:text-purple-400">AI Personalized</span>
          </div>
          <h2 className="text-3xl font-black tracking-tighter">Recommended For You</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 rounded-[2.5rem] bg-slate-100 dark:bg-white/5 animate-pulse border border-slate-200 dark:border-white/10" />
          ))
        ) : (
          recommendations.map((item, idx) => (
            <div 
              key={idx}
              className="group relative p-8 rounded-[2.5rem] bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 hover:border-purple-500/50 transition-all duration-500 shadow-xl shadow-slate-200/50 dark:shadow-none hover:-translate-y-2 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="h-10 w-10 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/40">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
              </div>

              <div className="space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-black uppercase tracking-widest border border-purple-500/20">
                  {item.category}
                </span>
                <h3 className="text-xl font-bold leading-tight group-hover:text-purple-600 transition-colors uppercase tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-muted-foreground leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 dark:text-muted-foreground/50 uppercase tracking-widest">Powered by Gemini</span>
                <Link href="/products" className="text-xs font-black text-purple-600 hover:underline">Explore More</Link>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
