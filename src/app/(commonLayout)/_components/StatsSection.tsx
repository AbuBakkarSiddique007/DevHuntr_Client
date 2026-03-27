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
    { label: "Community Members", value: stats?.totalUsers || "1.2k+", icon: Users, color: "text-blue-400" },
    { label: "Products Launched", value: stats?.totalProducts || "450+", icon: Rocket, color: "text-purple-400" },
    { label: "Upvotes Given", value: stats?.totalVotes || "8.5k+", icon: ThumbsUp, color: "text-emerald-400" },
    { label: "Discussion Posts", value: stats?.totalComments || "2.1k+", icon: MessageCircle, color: "text-pink-400" },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center space-y-3 group">
              <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <div>
                <p className="text-3xl font-extrabold tracking-tight text-white">
                   {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                </p>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
