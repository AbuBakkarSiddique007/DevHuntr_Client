"use client";

import {
   Users,
   Package,
   CreditCard,
   Activity,
   Zap,
   TrendingUp,
   Globe,
   ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
   const stats = [
      { title: "Total Users", value: "3,280", Icon: Users },
      { title: "Active Products", value: "856", Icon: Package },
      { title: "Premium Subs", value: "42", Icon: CreditCard },
      { title: "System Health", value: "99.9%", Icon: Activity },
   ];

   return (
      <div className="space-y-8 max-w-6xl mx-auto shadow-2xl p-6 bg-white/1 rounded-3xl border border-white/5 animate-in fade-in duration-700">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
               <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
                  <Zap className="h-8 w-8 text-yellow-500 fill-yellow-500/20" />
                  System Administrator
               </h1>
               <p className="text-muted-foreground mt-1 text-lg">Global oversight and platform-wide configuration console.</p>
            </div>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
               <div key={stat.title} className="p-6 rounded-2xl border border-white/5 bg-white/2 backdrop-blur-sm hover:bg-white/4 transition-all group">
                  <div className="p-3 w-fit rounded-xl bg-white/5 group-hover:bg-blue-500/10 transition-colors mb-4">
                     <stat.Icon className="h-5 w-5 text-blue-400" />
                  </div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</h3>
                  <p className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</p>
               </div>
            ))}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
               <div className="rounded-2xl border border-white/5 bg-white/2 p-8 shadow-2xl relative overflow-hidden group">
                  <div className="flex items-start justify-between mb-10">
                     <div>
                        <h3 className="text-2xl font-bold mb-2 text-foreground">Platform Performance</h3>
                        <p className="text-muted-foreground flex items-center gap-2">
                           <Globe className="h-4 w-4" /> Global traffic distribution and server load.
                        </p>
                     </div>
                     <TrendingUp className="h-8 w-8 text-blue-500/30" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <div className="space-y-2">
                        <p className="text-xs font-bold text-muted-foreground uppercase">CPU Load</p>
                        <p className="text-xl font-bold text-foreground font-mono">14.2%</p>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                           <div className="bg-blue-500 h-full rounded-full" style={{ width: '14.2%' }}></div>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <p className="text-xs font-bold text-muted-foreground uppercase">Memory</p>
                        <p className="text-xl font-bold text-foreground font-mono">3.8 GB</p>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                           <div className="bg-purple-500 h-full rounded-full" style={{ width: '42%' }}></div>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <p className="text-xs font-bold text-muted-foreground uppercase">Latency</p>
                        <p className="text-xl font-bold text-foreground font-mono">24ms</p>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                           <div className="bg-green-500 h-full rounded-full" style={{ width: '12%' }}></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/2 p-6 backdrop-blur-sm h-fit">
               <h3 className="text-lg font-bold mb-6 flex items-center justify-between">
                  Audit logs
                  <ShieldAlert className="h-5 w-5 text-red-500" />
               </h3>
               <div className="space-y-4">
                  {["User 'sarah' upgraded", "Settings updated", "Maintenance scheduled", "Security alert: Bot_99"].map((log, i) => (
                     <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all cursor-pointer">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                        <p className="text-xs text-muted-foreground truncate">{log}</p>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
}
