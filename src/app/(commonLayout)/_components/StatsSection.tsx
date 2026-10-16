"use client";

import { useEffect, useState } from "react";
import { StatisticsService, Statistics } from "@/services/statistics/statistics.service";
import { Users, Rocket, ThumbsUp, MessageCircle } from "lucide-react";

export function StatsSection() {
  const [stats, setStats] = useState<Statistics | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await StatisticsService.getStatistics();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch statistics", err);
      }
    };
    fetchStats();
  }, []);

  const items = [
    { label: "Community Members", value: stats?.totalUsers || "1.2k+", icon: Users },
    { label: "Products Launched", value: stats?.totalProducts || "450+", icon: Rocket },
    { label: "Upvotes Given", value: stats?.totalVotes || "8.5k+", icon: ThumbsUp },
    { label: "Discussion Posts", value: stats?.totalComments || "2.1k+", icon: MessageCircle },
  ];

  return (
    <section className="py-20 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-8">
          {items.map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center space-y-2.5 sm:space-y-3 group p-4 sm:p-6 rounded-2xl bg-card border border-border shadow-xs hover:border-primary/30 transition-all">
              <div className="p-2.5 sm:p-3.5 rounded-xl bg-primary/10 border border-primary/20 text-primary group-hover:scale-105 transition-transform duration-300">
                <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground font-heading">
                  {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                </p>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
