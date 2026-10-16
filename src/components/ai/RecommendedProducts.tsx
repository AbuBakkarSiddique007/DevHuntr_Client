"use client";

import { useEffect, useState } from "react";
import { AIService, AISuggestion } from "@/services/ai/ai.service";
import { Sparkles, ArrowUpRight } from "lucide-react";

export default function RecommendedProducts() {
  const [recommendations, setRecommendations] = useState<AISuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const data = await AIService.getRecommendations();
        setRecommendations(data || []);
      } catch (err) {
        console.error("Failed to load AI recommendations", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecs();
  }, []);

  if (!isLoading && (!recommendations || recommendations.length === 0)) return null;

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              AI Personalized
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Recommended For You
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-64 rounded-2xl" />
          ))
        ) : (
          recommendations.map((item, idx) => (
            <div 
              key={idx}
              className="group relative p-7 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all duration-300 shadow-xs hover:shadow-md overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider border border-primary/20">
                  {item.category}
                </span>
                <h3 className="text-lg font-bold leading-snug group-hover:text-primary transition-colors text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-primary">
                <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1.5">
                  Explore match <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
