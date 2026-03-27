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

export default function UserDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await ProductService.getMyProducts({ limit: 100 });
        const data = res.data?.products || res.products || res;
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Creator Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-lg">Launch products, monitor reviews, and track votes.</p>
        </div>

        <Link href="/user-dashboard/launch">
          <Button className="rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:opacity-90 gap-2 font-bold shadow-lg shadow-purple-500/20">
            <PlusCircle className="h-4 w-4" /> Launch Product
          </Button>
        </Link>
      </div>

      <div className="mt-12 text-center p-8 border border-white/5 bg-white/2 rounded-3xl animate-in fade-in zoom-in-95 duration-700 delay-500">
        <h3 className="text-xl font-bold mb-3">Ready to share your creation?</h3>
        <p className="text-muted-foreground mb-6">Join thousands of developers launching their products on DevHuntr.</p>
        <Link href="/user-dashboard/launch">
          <button className="px-8 py-4 bg-linear-to-r from-purple-600 to-indigo-600 rounded-xl font-bold hover:opacity-90 shadow-lg shadow-purple-500/25 transition-all hover:scale-105 active:scale-95">
            Launch Your App Now
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="p-6 rounded-3xl border border-white/5 bg-white/2 backdrop-blur-xl hover:bg-white/5 transition-all group relative overflow-hidden">
             <div className="absolute top-0 right-0 -z-10 h-24 w-24 rounded-full bg-purple-500/5 blur-2xl group-hover:bg-purple-500/10 transition-colors"></div>
            <div className={`p-3 w-fit rounded-2xl bg-white/5 group-hover:bg-purple-500/10 transition-colors mb-4`}>
              <stat.Icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <h3 className="text-sm font-bold text-muted-foreground mb-1 uppercase tracking-widest">{stat.title}</h3>
            <p className="text-3xl font-black text-foreground tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

