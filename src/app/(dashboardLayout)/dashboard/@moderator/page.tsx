"use client";

import {
  ClipboardCheck,
  Hourglass,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowRight,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ModeratorDashboard() {
  const stats = [
    { title: "Pending Reviews", value: "24", Icon: Hourglass, color: "orange" },
    { title: "Total Decisions", value: "1,450", Icon: ClipboardCheck, color: "blue" },
    { title: "Acceptance Rate", value: "68%", Icon: ShieldCheck, color: "green" },
    { title: "Reports Flagged", value: "12", Icon: AlertCircle, color: "red" },
  ];

  const reviewQueue = [
    { name: "AI Code Assistant", owner: "DevPro", submitted: "10 mins ago", category: "AI Tools" },
    { name: "CryptoTracker Ultra", owner: "BitMaster", submitted: "45 mins ago", category: "Fintech" },
    { name: "ZenMode App", owner: "MindfulDev", submitted: "2 hours ago", category: "Lifestyle" },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto shadow-2xl p-4 bg-white/1 rounded-3xl border border-white/5 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Review Console</h1>
        <p className="text-muted-foreground mt-1 text-lg">Evaluate new submissions and maintain platform code quality standards.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 rounded-2xl border border-white/5 bg-white/2 backdrop-blur-sm hover:bg-white/4 transition-all group">
            <div className="p-3 w-fit rounded-xl bg-white/5 group-hover:bg-purple-500/10 transition-colors mb-4">
              <stat.Icon className="h-5 w-5 text-purple-400" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/2 p-6 backdrop-blur-sm">
        <h3 className="text-xl font-bold mb-8">Priority Review Queue</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-white/5">
                <th className="pb-4">Product Name</th>
                <th className="pb-4">Category</th>
                <th className="pb-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {reviewQueue.map((item, i) => (
                <tr key={i} className="group hover:bg-white/1 transition-colors">
                  <td className="py-4">
                    <span className="font-bold text-foreground group-hover:text-purple-400 transition-colors">{item.name}</span>
                  </td>
                  <td className="py-4 font-medium text-sm text-muted-foreground">
                    <span className="px-2 py-0.5 bg-white/5 rounded-md border border-white/5 text-[10px] uppercase">{item.category}</span>
                  </td>
                  <td className="py-4 text-right">
                    <Button size="sm" variant="ghost" className="text-purple-400 hover:text-purple-300 gap-2">
                      Review <ArrowRight className="h-3 w-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
