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
    { label: "Community Members", value: stats?.totalUsers || "1.2k+", icon: Users, color: "text-[#298f9b]" },
    { label: "Products Launched", value: stats?.totalProducts || "450+", icon: Rocket, color: "text-[#298f9b]" },
    { label: "Upvotes Given", value: stats?.totalVotes || "8.5k+", icon: ThumbsUp, color: "text-[#298f9b]" },
    { label: "Discussion Posts", value: stats?.totalComments || "2.1k+", icon: MessageCircle, color: "text-[#298f9b]" },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center space-y-3 group">
              <div className={`p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 group-hover:scale-110 group-hover:bg-slate-50 dark:group-hover:bg-white/10 transition-all duration-500 shadow-md dark:shadow-none`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                </p>
                <p className="text-sm font-medium text-slate-600 dark:text-muted-foreground uppercase tracking-wider">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
