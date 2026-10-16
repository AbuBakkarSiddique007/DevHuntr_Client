"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  Package,
  Clock,
  ThumbsUp,
  PlusCircle,
  Loader2,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProductService, Product } from "@/services/product/product.service";
import { StatusBadge } from "@/components/shared/StatusBadge";
import Image from "next/image";

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
      <div className="flex items-center justify-center min-h-[350px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalUpvotes = products.reduce((acc, p) => acc + (p.upvoteCount || 0), 0);
  const pendingCount = products.filter(p => p.status === "PENDING").length;
  const featuredCount = products.filter(p => p.isFeatured).length;

  const stats = [
    { title: "Total Upvotes", value: (totalUpvotes || 0).toString(), Icon: ThumbsUp, color: "text-emerald-500" },
    { title: "My Products", value: (products?.length || 0).toString(), Icon: Package, color: "text-primary" },
    { title: "Pending Reviews", value: (pendingCount || 0).toString(), Icon: Clock, color: "text-amber-500" },
    { title: "Featured Projects", value: (featuredCount || 0).toString(), Icon: TrendingUp, color: "text-pink-500" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Creator Console</h1>
          <p className="text-muted-foreground text-sm mt-1">Track votes, manage review status, and launch new products.</p>
        </div>

        <Link href="/user-dashboard/launch">
          <Button className="rounded-xl h-10 px-4 bg-linear-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white gap-2 font-semibold text-xs shadow-md shadow-purple-500/20 border-none">
            <PlusCircle className="h-4 w-4" /> Launch Product
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="p-5 sm:p-6 rounded-2xl border border-border bg-card shadow-xs hover:border-primary/30 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.title}</span>
              <div className="p-2 rounded-xl bg-muted text-foreground">
                <stat.Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold tracking-tight text-foreground">Recent Products</h2>
            <p className="text-xs text-muted-foreground">Your recent submissions and their current review status.</p>
          </div>
          <Link href="/user-dashboard/my-products" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="py-12 text-center space-y-3 border border-dashed border-border rounded-xl bg-muted/20">
            <Package className="h-10 w-10 text-muted-foreground/40 mx-auto" />
            <p className="font-semibold text-foreground text-sm">No products submitted yet</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Ready to ship? Launch your app or tool to reach thousands of makers on DevHuntr.
            </p>
            <Link href="/user-dashboard/launch">
              <Button size="sm" className="rounded-xl mt-2">
                Submit Your First App
              </Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {products.slice(0, 5).map((product) => (
              <div key={product.id} className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3 min-w-0">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-xl object-cover border border-border shrink-0"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-xl bg-muted border border-border flex items-center justify-center shrink-0">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{product.pricingType || "FREE"} • {product.upvoteCount || 0} upvotes</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={product.status || "PENDING"} size="sm" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
