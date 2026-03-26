"use client";

import {
  TrendingUp,
  Package,
  MessageSquare,
  ThumbsUp,
  PlusCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UserDashboard() {
  const stats = [
    { title: "Total Upvotes", value: "128", Icon: ThumbsUp },
    { title: "My Products", value: "3", Icon: Package },
    { title: "Total Comments", value: "42", Icon: MessageSquare },
    { title: "Product Reach", value: "1.2k", Icon: TrendingUp },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">User Console</h1>
          <p className="text-muted-foreground mt-1 text-lg">Manage your creations and track your community engagement.</p>
        </div>
        <Link href="/dashboard/launch">
          <Button className="rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:opacity-90 gap-2 font-bold shadow-lg shadow-purple-500/20">
            <PlusCircle className="h-4 w-4" /> Launch Product
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="p-6 rounded-2xl border border-white/5 bg-white/2 backdrop-blur-sm hover:bg-white/4 transition-all group">
            <div className={`p-3 w-fit rounded-xl bg-white/5 group-hover:bg-purple-500/10 transition-colors mb-4`}>
              <stat.Icon className="h-5 w-5 text-purple-400" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
