"use client";

import { useEffect, useState } from "react";
import { Activity, Loader2, LineChart, Users, Package, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

type Stats = {
  totalUsers?: number;
  totalProducts?: number;
  pendingProducts?: number;
  reportsOpen?: number;
};

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/statistics`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || err.message || `HTTP ${res.status}`);
        }

        const json = await res.json();
        const data = json?.data || json;
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
    { title: "Pending Products", value: stats?.pendingProducts, Icon: LineChart },
    { title: "Open Reports", value: stats?.reportsOpen, Icon: Activity },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <LineChart className="h-7 w-7 text-blue-400" />
            Analytics
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">High-level platform statistics.</p>
        </div>

        <Button
          variant="outline"
          className="rounded-xl border-white/10 bg-white/5"
          onClick={() => setRefreshKey((k) => k + 1)}
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-70">
          <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c) => (
            <div
              key={c.title}
              className="p-6 rounded-3xl border border-white/5 bg-white/2 backdrop-blur-xl hover:bg-white/5 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 -z-10 h-24 w-24 rounded-full bg-blue-500/5 blur-2xl group-hover:bg-blue-500/10 transition-colors" />
              <div className="p-3 w-fit rounded-2xl bg-white/5 group-hover:bg-blue-500/10 transition-colors mb-4">
                <c.Icon className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="text-sm font-bold text-muted-foreground mb-1 uppercase tracking-widest">{c.title}</h3>
              <p className="text-3xl font-black text-foreground tracking-tight">
                {typeof c.value === "number" ? c.value.toLocaleString() : "—"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/2 p-12 text-center">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
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
