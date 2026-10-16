"use client";

import { useEffect, useState } from "react";
import { Activity, Loader2, LineChart, Users, Package, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { StatisticsService } from "@/services/statistics/statistics.service";

type Stats = {
  totalUsers?: number;
  totalProducts?: number;
  featuredProducts?: number;
  totalReports?: number;
  products?: {
    pending: number;
    accepted: number;
    rejected: number;
  };
};

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const data = await StatisticsService.getAdminStatistics();
        setStats(data ?? null);
      } catch (err) {
        const error = err as Error;
        toast.error(error.message || "Failed to load analytics");
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [refreshKey]);

  const cards = [
    { title: "Total Users", value: stats?.totalUsers, Icon: Users },
    { title: "Total Products", value: stats?.totalProducts, Icon: Package },
    { title: "Featured Products", value: stats?.featuredProducts, Icon: Package },
    { title: "Pending Reviews", value: stats?.products?.pending, Icon: LineChart },
    { title: "Total Reports", value: stats?.totalReports, Icon: Activity },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3 text-foreground">
            <LineChart className="h-7 w-7 text-primary" />
            Analytics
          </h1>
          <p className="text-muted-foreground mt-1 text-base">High-level platform statistics and growth metrics.</p>
        </div>

        <Button
          variant="outline"
          className="rounded-xl border-border hover:bg-muted font-medium"
          onClick={() => setRefreshKey((k) => k + 1)}
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Refresh Data
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-36 rounded-2xl" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c) => (
            <div
              key={c.title}
              className="p-6 rounded-2xl border border-border bg-card shadow-xs hover:border-primary/40 transition-colors group relative overflow-hidden"
            >
              <div className="p-3 w-fit rounded-xl bg-primary/10 mb-4">
                <c.Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">{c.title}</h3>
              <p className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                {typeof c.value === "number" ? c.value.toLocaleString() : "—"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center shadow-xs">
          <div className="inline-flex items-center gap-2 text-muted-foreground text-sm font-medium">
            <Info className="h-4 w-4" /> Analytics endpoint not available or unauthorized.
          </div>
          <p className="text-xs text-muted-foreground/70 mt-2">
            Expected `GET /api/v1/statistics`.
          </p>
        </div>
      )}
    </div>
  );
}
