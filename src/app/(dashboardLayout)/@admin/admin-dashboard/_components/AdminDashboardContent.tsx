"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Users,
  Package,
  MessageSquare,
  ThumbsUp,
  Loader2,
  Activity,
  Star,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Info,
  ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { StatisticsService } from "@/services/statistics/statistics.service";
import Link from "next/link";

type PublicStats = {
  totalUsers?: number;
  totalProducts?: number;
  totalComments?: number;
  totalVotes?: number;
};

type AdminStats = {
  totalReports?: number;
  featuredProducts?: number;
  products?: {
    pending: number;
    accepted: number;
    rejected: number;
  };
};

export function AdminDashboardContent() {
  const [publicStats, setPublicStats] = useState<PublicStats | null>(null);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchAllStats = useCallback(async () => {
    setLoading(true);
    try {
      const [publicData, adminData] = await Promise.all([
        StatisticsService.getStatistics(),
        StatisticsService.getAdminStatistics(),
      ]);

      setPublicStats(publicData);
      setAdminStats(adminData as AdminStats);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllStats();
  }, [fetchAllStats, refreshKey]);

  const primaryCards = [
    { title: "Total Users", value: publicStats?.totalUsers, Icon: Users, color: "text-blue-500" },
    { title: "Total Products", value: publicStats?.totalProducts, Icon: Package, color: "text-primary" },
    { title: "Engagement (Votes)", value: publicStats?.totalVotes, Icon: ThumbsUp, color: "text-emerald-500" },
    { title: "Discussions", value: publicStats?.totalComments, Icon: MessageSquare, color: "text-pink-500" },
  ];

  const secondaryCards = [
    { title: "Featured Products", value: adminStats?.featuredProducts, Icon: Star, color: "text-amber-500" },
    { title: "Pending Reviews", value: adminStats?.products?.pending, Icon: AlertCircle, color: "text-orange-500" },
    { title: "Accepted Products", value: adminStats?.products?.accepted, Icon: CheckCircle, color: "text-emerald-500" },
    { title: "Rejected Products", value: adminStats?.products?.rejected, Icon: XCircle, color: "text-rose-500" },
    { title: "Total Reports", value: adminStats?.totalReports, Icon: Activity, color: "text-destructive" },
  ];

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const hasData = publicStats || adminStats;

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <ShieldAlert className="h-7 w-7 text-primary" />
            Admin Overview
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Platform analytics, user moderation, and system telemetry.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin-dashboard/users">
            <Button variant="outline" size="sm" className="rounded-xl h-9 text-xs">
              Manage Users
            </Button>
          </Link>
          <Button
            size="sm"
            className="rounded-xl h-9 text-xs font-semibold gap-2"
            onClick={() => setRefreshKey(k => k + 1)}
            disabled={loading}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>
      </div>

      {hasData ? (
        <>
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Platform Metrics</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {primaryCards.map((stat) => (
                <div key={stat.title} className="p-5 sm:p-6 rounded-2xl border border-border bg-card shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.title}</span>
                    <div className="p-2 rounded-xl bg-muted text-foreground">
                      <stat.Icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    {typeof stat.value === "number" ? stat.value.toLocaleString() : "—"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product & Moderation Status</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {secondaryCards.map((stat) => (
                <div key={stat.title} className="p-4 rounded-xl border border-border bg-card shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">{stat.title}</span>
                    <stat.Icon className={`h-3.5 w-3.5 ${stat.color} shrink-0`} />
                  </div>
                  <p className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    {typeof stat.value === "number" ? stat.value.toLocaleString() : "—"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <Info className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-lg font-bold text-foreground">No telemetry available</p>
          <p className="text-xs text-muted-foreground mt-1">Platform metrics could not be fetched. Check database connection.</p>
          <Button size="sm" className="mt-4 rounded-xl" onClick={() => setRefreshKey(k => k + 1)}>
            Retry Sync
          </Button>
        </div>
      )}
    </div>
  );
}
