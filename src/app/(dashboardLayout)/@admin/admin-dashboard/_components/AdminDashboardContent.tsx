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
      <div className="space-y-10 max-w-6xl mx-auto animate-in fade-in duration-700">

         {/* Header */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
               <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
                  <Zap className="h-8 w-8 text-yellow-500 fill-yellow-500/20" />
                  Admin Control Panel
               </h1>
               <p className="text-muted-foreground mt-1 text-lg">Real-time platform analytics and system overview.</p>
            </div>
            <Button
               variant="outline"
               className="rounded-xl border-white/10 bg-white/5 flex items-center gap-2"
               onClick={() => setRefreshKey(k => k + 1)}
               disabled={loading}
            >
               <RefreshCw className="h-4 w-4" /> Refresh
            </Button>
         </div>

         {hasData ? (
            <>
               {/* Primary Stats */}
               <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Platform Overview</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                     {primaryCards.map((stat) => (
                        <div key={stat.title} className="p-6 rounded-2xl border border-white/5 bg-white/2 backdrop-blur-sm hover:bg-white/4 transition-all group relative overflow-hidden">
                           <div className={`absolute top-0 right-0 -z-10 h-24 w-24 rounded-full bg-white/5 blur-2xl ${stat.glow} transition-colors`} />
                           <div className={`p-3 w-fit rounded-xl bg-white/5 ${stat.glow} transition-colors mb-4`}>
                              <stat.Icon className={`h-5 w-5 ${stat.color}`} />
                           </div>
                           <h3 className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</h3>
                           <p className="text-2xl font-bold text-foreground tracking-tight">
                              {typeof stat.value === "number" ? stat.value.toLocaleString() : "—"}
                           </p>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Secondary Stats */}
               <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Product & Moderation</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                     {secondaryCards.map((stat) => (
                        <div key={stat.title} className={`p-5 rounded-2xl border border-white/5 bg-white/2 backdrop-blur-sm border-l-4 ${stat.border} hover:bg-white/4 transition-all`}>
                           <div className="flex items-center gap-2 mb-3">
                              <stat.Icon className={`h-4 w-4 ${stat.color}`} />
                              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.title}</h3>
                           </div>
                           <p className="text-3xl font-black text-foreground">
                              {typeof stat.value === "number" ? stat.value.toLocaleString() : "—"}
                           </p>
                        </div>
                     ))}
                  </div>
               </div>
            </>
         ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/2 p-12 text-center">
               <div className="inline-flex items-center gap-2 text-muted-foreground">
                  <Info className="h-4 w-4" /> Statistics not available or unauthorized.
               </div>
            </div>
         )}
      </div>
   );
}
