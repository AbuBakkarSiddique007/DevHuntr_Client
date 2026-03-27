"use client";

import { useEffect, useState } from "react";
import {
   Users,
   Package,
   MessageSquare,
   ThumbsUp,
   Zap,
   ShieldAlert,
   Loader2,
   Star,
   AlertCircle
} from "lucide-react";
import { StatisticsService, Statistics } from "@/services/statistics/statistics.service";
import { toast } from "sonner";

export default function AdminDashboard() {
   const [stats, setStats] = useState<Statistics | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchStats = async () => {
         try {
            const data = await StatisticsService.getStatistics();
            setStats(data);
         } catch (err) {
            console.error(err);
            toast.error("Failed to load dashboard statistics");
         } finally {
            setLoading(false);
         }
      };
      fetchStats();
   }, []);

   if (loading) {
      return (
         <div className="flex h-[80vh] items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
         </div>
      );
   }

   const statCards = [
      { title: "Total Users", value: stats?.totalUsers || 0, Icon: Users, color: "text-blue-400" },
      { title: "Total Products", value: stats?.totalProducts || 0, Icon: Package, color: "text-purple-400" },
      { title: "Engagement (Votes)", value: stats?.totalVotes || 0, Icon: ThumbsUp, color: "text-green-400" },
      { title: "Discussions", value: stats?.totalComments || 0, Icon: MessageSquare, color: "text-pink-400" },
   ];

   return (
      <div className="space-y-8 max-w-6xl mx-auto p-6 bg-white/1 rounded-3xl border border-white/5 animate-in fade-in duration-700">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
               <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
                  <Zap className="h-8 w-8 text-yellow-500 fill-yellow-500/20" />
                  Admin Control Panel
               </h1>
               <p className="text-muted-foreground mt-1 text-lg">Real-time platform analytics and system overview.</p>
            </div>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat) => (
               <div key={stat.title} className="p-6 rounded-2xl border border-white/5 bg-white/2 backdrop-blur-sm hover:bg-white/4 transition-all group">
                  <div className="p-3 w-fit rounded-xl bg-white/5 group-hover:bg-blue-500/10 transition-colors mb-4">
                     <stat.Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</h3>
                  <p className="text-2xl font-bold text-foreground tracking-tight">
                     {stat.value.toLocaleString()}
                  </p>
               </div>
            ))}
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-white/5 bg-white/2 backdrop-blur-sm">
               <div className="flex items-center gap-3 mb-4">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <h3 className="font-bold">Featured</h3>
               </div>
               <p className="text-3xl font-black text-foreground">{stats?.featuredProducts || 0}</p>
               <p className="text-xs text-muted-foreground mt-1 text-uppercase tracking-wider">Highlighted products</p>
            </div>

            <div className="p-6 rounded-2xl border border-white/5 bg-white/2 backdrop-blur-sm border-l-4 border-l-yellow-500/50">
               <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  <h3 className="font-bold">Pending Review</h3>
               </div>
               <p className="text-3xl font-black text-foreground">{stats?.products.pending || 0}</p>
               <p className="text-xs text-muted-foreground mt-1 text-uppercase tracking-wider">Awaiting moderation</p>
            </div>

            <div className="p-6 rounded-2xl border border-white/5 bg-white/2 backdrop-blur-sm border-l-4 border-l-red-500/50">
               <div className="flex items-center gap-3 mb-4">
                  <ShieldAlert className="h-5 w-5 text-red-500" />
                  <h3 className="font-bold">Total Reports</h3>
               </div>
               <p className="text-3xl font-black text-foreground">{stats?.totalReports || 0}</p>
               <p className="text-xs text-muted-foreground mt-1 text-uppercase tracking-wider">User safety flags</p>
            </div>
         </div>
      </div>
   );
}
