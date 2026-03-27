"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { XCircle, Search, Filter, Loader2, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ProductService, Product } from "@/services/product/product.service";

export default function ModeratorRejectedPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const res = await ProductService.getModerationProducts({ page: 1, limit: 100, status: "REJECTED" });
        const items = res?.data?.products || res?.products || [];
        const list = Array.isArray(items) ? items : [];
        setProducts(list);
      } catch (err) {
        const error = err as Error;
        toast.error(error.message || "Failed to load rejected products");
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
          <h1 className="text-3xl font-extrabold tracking-tight">Rejected Products</h1>
          <p className="text-muted-foreground mt-1 text-lg">Browse all rejected products.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search rejected..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-xl border-white/10 bg-white/5 h-10 w-full"
            />
          </div>
          <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 h-10 w-10 p-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-80">
          <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/2 p-20 text-center">
          <div className="flex flex-col items-center gap-4 max-w-sm mx-auto">
            <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="text-xl font-bold">No rejected products found</h3>
            <p className="text-muted-foreground text-sm">Try a different search.</p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 bg-white/2 backdrop-blur-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-white/5">
                  <th className="py-5 px-6">Product</th>
                  <th className="py-5 px-4 text-center">Votes</th>
                  <th className="py-5 px-6 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((product) => (
                  <tr key={product.id} className="group hover:bg-white/2 transition-all">
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/5 overflow-hidden shrink-0">
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
                      <div className="inline-flex items-center justify-center gap-3 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 shadow-sm">
                        <span className="text-xs font-bold text-purple-400">+{product.upvoteCount ?? 0}</span>
                        <span className="text-xs font-bold text-muted-foreground">-{product.downvoteCount ?? 0}</span>
                      </div>
                    </td>
                    <td className="py-6 px-6 text-right">
                      <Link href={`/products/${product.id}`}>
                        <Button size="sm" variant="ghost" className="h-9 w-9 p-0 rounded-lg hover:bg-white/10">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
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
