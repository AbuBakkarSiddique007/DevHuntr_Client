"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  Package,
  Clock,
  ThumbsUp,
  PlusCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProductService, Product } from "@/services/product/product.service";

export function UserDashboardContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await ProductService.getMyProducts({ limit: 100 });
        const r = res as unknown as { data?: { products?: Product[] }; products?: Product[] };
        const data = r?.data?.products || r?.products || res.products;
        const fetchedProducts = Array.isArray(data) ? data : [];
        setProducts(fetchedProducts);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
      </div>
    );
  }

  const totalUpvotes = products.reduce((acc, p) => acc + (p.upvoteCount || 0), 0);
  const pendingCount = products.filter(p => p.status === "PENDING").length;
  const featuredCount = products.filter(p => p.isFeatured).length;

  const stats = [
    { title: "Total Upvotes", value: (totalUpvotes || 0).toString(), Icon: ThumbsUp, color: "text-purple-400" },
    { title: "My Products", value: (products?.length || 0).toString(), Icon: Package, color: "text-indigo-400" },
    { title: "Pending Reviews", value: (pendingCount || 0).toString(), Icon: Clock, color: "text-orange-400" },
    { title: "Featured Projects", value: (featuredCount || 0).toString(), Icon: TrendingUp, color: "text-pink-400" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight">Creator Dashboard</h1>
          <p className="text-slate-500 dark:text-muted-foreground mt-2 text-lg md:text-xl">Launch products, monitor reviews, and track votes.</p>
        </div>

        <Link href="/user-dashboard/launch">
          <Button className="rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:opacity-90 gap-2 font-bold shadow-lg shadow-purple-500/20">
            <PlusCircle className="h-4 w-4" /> Launch Product
          </Button>
        </Link>
      </div>

      <div className="mt-12 text-center p-10 md:p-14 border border-slate-200 dark:border-white/5 bg-white dark:bg-white/2 rounded-[2.5rem] animate-in fade-in zoom-in-95 duration-700 delay-500 shadow-sm dark:shadow-none relative overflow-hidden group">
        <div className="absolute top-0 right-0 -z-10 h-64 w-64 rounded-full bg-purple-500/5 blur-[80px] group-hover:bg-purple-500/10 transition-colors"></div>
        <h3 className="text-2xl md:text-3xl font-black mb-3 text-slate-900 dark:text-white tracking-tight">Ready to share your creation?</h3>
        <p className="text-slate-500 dark:text-muted-foreground mb-8 text-lg">Join thousands of developers launching their products on DevHuntr.</p>
        <Link href="/user-dashboard/launch">
          <button className="px-10 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold shadow-xl shadow-purple-500/25 transition-all hover:scale-105 active:scale-95">
            Launch Your App Now
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="p-8 rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm dark:shadow-none hover:border-purple-200 dark:hover:border-purple-500/30 transition-all group relative overflow-hidden">
             <div className="absolute top-0 right-0 -z-10 h-32 w-32 rounded-full bg-slate-100 dark:bg-white/5 blur-3xl group-hover:bg-purple-500/10 transition-colors"></div>
            <div className={`p-4 w-fit rounded-2xl bg-slate-50 dark:bg-white/5 group-hover:bg-purple-500/10 transition-colors mb-6 border border-slate-100 dark:border-white/5`}>
              <stat.Icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <h3 className="text-xs font-black text-slate-400 dark:text-muted-foreground mb-2 uppercase tracking-[0.2em] leading-none">{stat.title}</h3>
            <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
