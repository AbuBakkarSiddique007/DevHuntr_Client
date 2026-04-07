"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Search, Filter, Loader2, Eye, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ProductService, Product } from "@/services/product/product.service";

export default function ModeratorAcceptedPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleToggleFeature = async (id: string, currentStatus: boolean) => {
    setActionLoading(id);
    try {
      await ProductService.toggleFeatured(id);
      toast.success(`Product ${currentStatus ? 'removed from' : 'marked as'} featured`);
      setProducts(prev => prev.map(p => p.id === id ? { ...p, isFeatured: !p.isFeatured } : p));
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Failed to toggle feature status");
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const res = await ProductService.getModerationProducts({ page: 1, limit: 100, status: "ACCEPTED" });
        const items = res?.data?.products || res?.products || [];
        const list = Array.isArray(items) ? items : [];
        setProducts(list);
      } catch (err) {
        const error = err as Error;
        toast.error(error.message || "Failed to load accepted products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, search]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Accepted Products</h1>
          <p className="text-muted-foreground mt-1 text-lg">Browse all accepted products.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search accepted..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-xl border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 h-10 w-full"
            />
          </div>
          <Button variant="outline" className="rounded-xl border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 h-10 w-10 p-0 text-slate-700 dark:text-foreground">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-80">
          <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-white/10 bg-white dark:bg-white/2 p-20 text-center shadow-sm dark:shadow-none">
          <div className="flex flex-col items-center gap-4 max-w-sm mx-auto">
            <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
            <h3 className="text-xl font-bold">No accepted products found</h3>
            <p className="text-muted-foreground text-sm">Try a different search.</p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/2 shadow-sm dark:shadow-none overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-slate-200 dark:border-white/5">
                  <th className="py-5 px-6">Product</th>
                  <th className="py-5 px-4 text-center">Votes</th>
                  <th className="py-5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filtered.map((product) => (
                  <tr key={product.id} className="group hover:bg-slate-50 dark:hover:bg-white/2 transition-all">
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 overflow-hidden shrink-0">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-foreground group-hover:text-purple-400 transition-colors truncate uppercase tracking-tight">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-1 max-w-130">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-4 text-center">
                      <div className="inline-flex items-center justify-center gap-3 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                        <span className="text-xs font-bold text-purple-400">+{product.upvoteCount ?? 0}</span>
                        <span className="text-xs font-bold text-muted-foreground">-{product.downvoteCount ?? 0}</span>
                      </div>
                    </td>
                    <td className="py-6 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          onClick={() => handleToggleFeature(product.id, product.isFeatured ?? false)}
                          disabled={actionLoading === product.id}
                          size="sm" 
                          variant="ghost" 
                          title={product.isFeatured ? "Remove from Featured" : "Mark as Featured"}
                          className={`h-9 w-9 p-0 rounded-lg ${product.isFeatured ? 'text-yellow-500 dark:text-yellow-400 hover:text-yellow-600 dark:hover:text-yellow-500 bg-yellow-400/10 border border-yellow-400/20 shadow-[0_0_15px_rgba(250,204,21,0.2)]' : 'text-slate-500 dark:text-muted-foreground hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-slate-100 dark:hover:bg-white/10'}`}
                        >
                          {actionLoading === product.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Star className={`h-4 w-4 ${product.isFeatured ? 'fill-current' : ''}`} />}
                        </Button>
                        <Link href={`/products/${product.id}`}>
                          <Button size="sm" variant="ghost" className="h-9 w-9 p-0 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-foreground" title="View Details">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
