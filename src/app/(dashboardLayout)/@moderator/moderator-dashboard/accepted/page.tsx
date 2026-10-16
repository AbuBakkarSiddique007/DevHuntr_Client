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
        const r = res as unknown as { data?: { products?: Product[] }; products?: Product[] };
        const items = r?.data?.products || r?.products || [];
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Accepted Products</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Browse all approved and live products.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search accepted..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-lg border-border bg-background h-10 w-full"
            />
          </div>
          <Button variant="outline" size="icon" className="rounded-lg border-border h-10 w-10 text-muted-foreground hover:text-foreground shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-80">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/40 p-16 text-center">
          <div className="flex flex-col items-center gap-3 max-w-sm mx-auto">
            <div className="h-14 w-14 rounded-full bg-success/10 flex items-center justify-center border border-success/20">
              <CheckCircle2 className="h-7 w-7 text-success" />
            </div>
            <h3 className="text-lg font-semibold">No accepted products found</h3>
            <p className="text-muted-foreground text-sm">Try adjusting your search criteria.</p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
          {/* Mobile card list (below md) */}
          <div className="md:hidden divide-y divide-border">
            {filtered.map((product) => (
              <div key={product.id} className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-lg bg-muted border border-border overflow-hidden shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground text-sm truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/50">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-muted border border-border text-xs font-medium">
                    <span className="text-primary font-semibold">+{product.upvoteCount ?? 0}</span>
                    <span className="text-muted-foreground">-{product.downvoteCount ?? 0}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button 
                      onClick={() => handleToggleFeature(product.id, product.isFeatured ?? false)}
                      disabled={actionLoading === product.id}
                      size="sm" 
                      variant="ghost" 
                      className={`h-8 px-2.5 rounded-lg text-xs font-medium ${product.isFeatured ? 'text-amber-500 bg-amber-500/10 border border-amber-500/20' : 'text-muted-foreground hover:text-amber-500'}`}
                    >
                      {actionLoading === product.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                      ) : (
                        <Star className={`h-3.5 w-3.5 mr-1 ${product.isFeatured ? 'fill-current' : ''}`} />
                      )}
                      {product.isFeatured ? "Featured" : "Feature"}
                    </Button>
                    <Link href={`/products/${product.id}`}>
                      <Button size="sm" variant="ghost" className="h-8 px-2.5 rounded-lg text-muted-foreground hover:text-foreground text-xs font-medium">
                        <Eye className="h-3.5 w-3.5 mr-1" /> View
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table (md+) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border bg-muted/40">
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-4 text-center">Votes</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((product) => (
                  <tr key={product.id} className="group hover:bg-muted/40 transition-colors">
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-muted border border-border overflow-hidden shrink-0">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground group-hover:text-primary transition-colors truncate tracking-tight">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-1 max-w-130">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-4 text-center">
                      <div className="inline-flex items-center justify-center gap-2.5 px-3 py-1 rounded-md bg-muted border border-border text-xs font-medium">
                        <span className="text-primary font-semibold">+{product.upvoteCount ?? 0}</span>
                        <span className="text-muted-foreground">-{product.downvoteCount ?? 0}</span>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          onClick={() => handleToggleFeature(product.id, product.isFeatured ?? false)}
                          disabled={actionLoading === product.id}
                          size="icon" 
                          variant="ghost" 
                          title={product.isFeatured ? "Remove from Featured" : "Mark as Featured"}
                          className={`h-9 w-9 rounded-lg ${product.isFeatured ? 'text-amber-500 hover:text-amber-600 bg-amber-500/10 border border-amber-500/20' : 'text-muted-foreground hover:text-amber-500 hover:bg-muted'}`}
                        >
                          {actionLoading === product.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Star className={`h-4 w-4 ${product.isFeatured ? 'fill-current' : ''}`} />}
                        </Button>
                        <Link href={`/products/${product.id}`}>
                          <Button size="icon" variant="ghost" className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground" title="View Details">
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
