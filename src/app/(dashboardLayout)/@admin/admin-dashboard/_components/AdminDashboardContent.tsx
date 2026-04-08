"use client";

import { useEffect, useState, useCallback } from "react";
import {
   Users,
   Package,
   MessageSquare,
   ThumbsUp,
   Zap,
   Loader2,
   Activity,
   Star,
   AlertCircle,
   CheckCircle,
   XCircle,
   RefreshCw,
   Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { StatisticsService } from "@/services/statistics/statistics.service";

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
      { title: "Total Users", value: publicStats?.totalUsers, Icon: Users, color: "text-blue-400", glow: "group-hover:bg-blue-500/10" },
      { title: "Total Products", value: publicStats?.totalProducts, Icon: Package, color: "text-purple-400", glow: "group-hover:bg-purple-500/10" },
      { title: "Engagement (Votes)", value: publicStats?.totalVotes, Icon: ThumbsUp, color: "text-green-400", glow: "group-hover:bg-green-500/10" },
      { title: "Discussions", value: publicStats?.totalComments, Icon: MessageSquare, color: "text-pink-400", glow: "group-hover:bg-pink-500/10" },
   ];

   const secondaryCards = [
      { title: "Featured Products", value: adminStats?.featuredProducts, Icon: Star, color: "text-yellow-400", border: "border-l-yellow-500/50" },
      { title: "Pending Reviews", value: adminStats?.products?.pending, Icon: AlertCircle, color: "text-orange-400", border: "border-l-orange-500/50" },
      { title: "Accepted Products", value: adminStats?.products?.accepted, Icon: CheckCircle, color: "text-green-400", border: "border-l-green-500/50" },
      { title: "Rejected Products", value: adminStats?.products?.rejected, Icon: XCircle, color: "text-red-400", border: "border-l-red-500/50" },
      { title: "Total Reports", value: adminStats?.totalReports, Icon: Activity, color: "text-red-500", border: "border-l-red-600/50" },
   ];

   if (loading) {
      return (
         <div className="flex h-[80vh] items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
         </div>
      );
   }

   const hasData = publicStats || adminStats;

   return (
    <div className="space-y-16 max-w-7xl mx-auto animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight flex items-center gap-4">
            <Zap className="h-10 w-10 text-yellow-500 fill-yellow-500/20" />
            Nexus Core
          </h1>
          <p className="text-slate-500 dark:text-muted-foreground mt-2 text-lg md:text-xl">Unified platform intelligence and governance.</p>
        </div>
        <Button
          variant="outline"
          className="rounded-2xl border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 h-14 px-6 flex items-center gap-3 font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 dark:hover:bg-white/10 transition-all shadow-sm"
          onClick={() => setRefreshKey(k => k + 1)}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Sync Intelligence
        </Button>
      </div>

      {hasData ? (
        <>
          {/* Primary Stats */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent"></div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-muted-foreground/60">Platform Equilibrium</p>
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {primaryCards.map((stat) => (
                <div key={stat.title} className="p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 backdrop-blur-xl hover:border-purple-200 dark:hover:border-purple-500/30 transition-all group relative overflow-hidden shadow-sm dark:shadow-none">
                  <div className={`absolute top-0 right-0 -z-10 h-32 w-32 rounded-full bg-slate-100 dark:bg-white/5 blur-3xl ${stat.glow} transition-colors`} />
                  <div className={`p-4 w-fit rounded-2xl bg-slate-50 dark:bg-white/5 ${stat.glow} transition-colors mb-6 border border-slate-100 dark:border-white/10`}>
                    <stat.Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <h3 className="text-[10px] font-black text-slate-400 dark:text-muted-foreground uppercase tracking-[0.2em] mb-2 leading-none">{stat.title}</h3>
                  <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                    {typeof stat.value === "number" ? stat.value.toLocaleString() : "—"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Secondary Stats */}
          <div className="space-y-8">
             <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent"></div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-muted-foreground/60">Governance Matrix</p>
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {secondaryCards.map((stat) => (
                <div key={stat.title} className={`p-6 rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 backdrop-blur-xl border-l-[6px] ${stat.border} hover:bg-slate-50 dark:hover:bg-white/5 transition-all shadow-sm dark:shadow-none group relative overflow-hidden`}>
                   <div className="absolute top-0 right-0 -z-10 h-16 w-16 rounded-full bg-slate-100/50 dark:bg-white/2 blur-2xl group-hover:bg-slate-200/50 dark:group-hover:bg-white/5 transition-colors" />
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                      <stat.Icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                    <h3 className="text-[10px] font-black text-slate-400 dark:text-muted-foreground uppercase tracking-widest">{stat.title}</h3>
                  </div>
                  <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                    {typeof stat.value === "number" ? stat.value.toLocaleString() : "—"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/2 p-20 text-center animate-in zoom-in-95 duration-500">
           <div className="h-20 w-20 rounded-[2rem] bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center mx-auto mb-6">
              <Info className="h-10 w-10 text-slate-300 dark:text-muted-foreground/20" />
           </div>
           <p className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Signal Lost</p>
           <p className="text-sm text-slate-500 dark:text-muted-foreground mt-2">Statistics are currently offline or access is restricted.</p>
           <Button className="mt-8 rounded-xl h-12 px-6 font-black uppercase tracking-widest bg-slate-900 dark:bg-white/10 text-white" onClick={() => setRefreshKey(k => k + 1)}>
              Reconnect
           </Button>
        </div>
      )}
    </div>
  );
}
