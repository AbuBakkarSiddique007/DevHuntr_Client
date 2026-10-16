"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { XCircle, Search, Loader2, Eye } from "lucide-react";
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
        const r = res as unknown as { data?: { products?: Product[] }; products?: Product[] };
        const items = r?.data?.products || r?.products || [];
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
    return products.filter((p) => (p.name || "").toLowerCase().includes(q));
  }, [products, search]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <XCircle className="h-6 w-6 text-destructive" />
            Rejected Products
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Archived submissions that did not pass moderation guidelines.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            aria-label="Search rejected products"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-xs rounded-xl"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-60">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center shadow-xs">
          <div className="flex flex-col items-center gap-3 max-w-sm mx-auto">
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
              <XCircle className="h-6 w-6" />
            </div>
            <h2 className="text-base font-bold text-foreground">No rejected products found</h2>
            <p className="text-muted-foreground text-xs">No records match your query.</p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
          {/* Mobile card list (below md) */}
          <div className="md:hidden divide-y divide-border">
            {filtered.map((product) => (
              <div key={product.id} className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 rounded-xl bg-muted border border-border overflow-hidden shrink-0 relative">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={44}
                        height={44}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                        <XCircle className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground text-sm truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {product.description || "No description"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/50">
                  <div className="inline-flex items-center justify-center gap-2 px-2.5 py-1 rounded-lg bg-muted border border-border text-xs font-semibold">
                    <span className="text-emerald-600 dark:text-emerald-400">▲ {product.upvoteCount ?? 0}</span>
                    <span className="text-rose-500 dark:text-red-400">▼ {product.downvoteCount ?? 0}</span>
                  </div>

                  <Link href={`/products/${product.id}`}>
                    <Button size="sm" variant="ghost" className="h-8 px-2.5 rounded-lg text-muted-foreground hover:text-foreground text-xs font-medium">
                      <Eye className="h-3.5 w-3.5 mr-1" /> View Product
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table (md+) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border bg-muted/40">
                  <th className="py-3 px-4 sm:px-6">Product</th>
                  <th className="py-3 px-4 text-center">Score</th>
                  <th className="py-3 px-4 sm:px-6 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-xl bg-muted border border-border overflow-hidden shrink-0 relative">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={44}
                              height={44}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                              <XCircle className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground text-sm truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-1 max-w-md">{product.description || "No description"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center justify-center gap-2 px-2.5 py-1 rounded-lg bg-muted border border-border text-xs font-semibold">
                        <span className="text-emerald-600 dark:text-emerald-400">▲ {product.upvoteCount ?? 0}</span>
                        <span className="text-rose-500 dark:text-red-400">▼ {product.downvoteCount ?? 0}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <Link href={`/products/${product.id}`}>
                        <Button size="icon-sm" variant="ghost" aria-label="View product page" className="hover:text-primary">
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
