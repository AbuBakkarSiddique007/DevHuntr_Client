"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ListOrdered, Search, Filter, Loader2, Eye, CheckCircle2, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ProductService, Product } from "@/services/product/product.service";

export default function ModeratorQueuePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<{ id: string; action: "ACCEPT" | "REJECT" } | null>(null);
  const [rejectingProduct, setRejectingProduct] = useState<Product | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await ProductService.getQueueProducts({ page: 1, limit: 50 });
      const r = res as unknown as { data?: { products?: Product[] }; products?: Product[] };
      const data = r?.data?.products || r?.data || r?.products || res.products;
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load queue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, search]);

  const handleStatus = async (
    id: string,
    status: "ACCEPTED" | "REJECTED",
    rejectionReasonInput?: string
  ) => {
    setActionLoading({ id, action: status === "ACCEPTED" ? "ACCEPT" : "REJECT" });
    try {
      await ProductService.updateProductStatus(id, status, rejectionReasonInput);
      toast.success(`Product ${status.toLowerCase()} successfully`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Review Queue</h1>
          <p className="text-muted-foreground mt-1 text-base">In-depth management of all pending submissions.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search queue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-lg border-border bg-background h-10 w-full"
            />
          </div>
          <Button variant="outline" size="icon" className="rounded-lg border-border h-10 w-10 text-muted-foreground hover:text-foreground">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border bg-muted/40">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-warning/10 border border-warning/20 flex items-center justify-center shrink-0">
              <ListOrdered className="h-4 w-4 text-warning" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Pending Submissions</p>
              <p className="text-xs text-muted-foreground">{filtered.length} items awaiting review</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg border-border"
            onClick={fetchQueue}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
          </Button>
        </div>

        {/* Mobile card list (below md) */}
        <div className="md:hidden divide-y divide-border">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 space-y-3 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-muted shrink-0" />
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="h-4 w-32 bg-muted rounded" />
                    <div className="h-3 w-48 bg-muted rounded" />
                  </div>
                </div>
                <div className="h-8 w-full bg-muted rounded-lg" />
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="py-16 px-4 text-center">
              <div className="flex flex-col items-center gap-3">
                <CheckCircle2 className="h-10 w-10 text-success/40" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Queue is clear</p>
                  <p className="text-xs text-muted-foreground">No pending submissions right now.</p>
                </div>
              </div>
            </div>
          ) : (
            filtered.map((product) => (
              <div key={product.id} className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-lg bg-muted border border-border overflow-hidden shrink-0">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
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
                    <Link href={`/products/${product.id}`}>
                      <Button size="sm" variant="ghost" className="h-8 px-2.5 rounded-lg text-xs text-muted-foreground hover:text-foreground">
                        <Eye className="h-3.5 w-3.5 mr-1" /> View
                      </Button>
                    </Link>
                    <Button
                      onClick={() => handleStatus(product.id, "ACCEPTED")}
                      disabled={!!actionLoading}
                      size="sm"
                      className="h-8 px-2.5 rounded-lg bg-success/10 text-success hover:bg-success hover:text-success-foreground border border-success/20 text-xs font-medium"
                    >
                      {actionLoading?.id === product.id && actionLoading.action === "ACCEPT" ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Accept
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => {
                        setRejectingProduct(product);
                        setRejectionReason("");
                      }}
                      disabled={!!actionLoading}
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2.5 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive border border-destructive/20 text-xs font-medium"
                    >
                      {actionLoading?.id === product.id && actionLoading.action === "REJECT" ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <>
                          <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
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
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-5 px-6"><div className="h-10 w-56 bg-muted rounded-lg" /></td>
                    <td className="py-5 px-4"><div className="h-10 w-20 bg-muted rounded-lg mx-auto" /></td>
                    <td className="py-5 px-6"><div className="h-10 w-32 bg-muted rounded-lg ml-auto" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <CheckCircle2 className="h-12 w-12 text-success/40" />
                      <div>
                        <p className="text-base font-semibold text-foreground">Queue is clear</p>
                        <p className="text-sm text-muted-foreground">No pending submissions right now.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product.id} className="group hover:bg-muted/40 transition-colors">
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-muted border border-border overflow-hidden shrink-0">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground group-hover:text-primary transition-colors truncate tracking-tight">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-1 max-w-105">{product.description}</p>
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
                        <Link href={`/products/${product.id}`}>
                          <Button size="icon" variant="ghost" className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          onClick={() => handleStatus(product.id, "ACCEPTED")}
                          disabled={!!actionLoading}
                          size="icon"
                          className="h-9 w-9 rounded-lg bg-success/10 text-success hover:bg-success hover:text-success-foreground border border-success/20"
                        >
                          {actionLoading?.id === product.id && actionLoading.action === "ACCEPT" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          onClick={() => {
                            setRejectingProduct(product);
                            setRejectionReason("");
                          }}
                          disabled={!!actionLoading}
                          size="icon"
                          variant="ghost"
                          className="h-9 w-9 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive border border-destructive/20"
                        >
                          {actionLoading?.id === product.id && actionLoading.action === "REJECT" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REJECT MODAL */}
      {rejectingProduct && (
        <div
          className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => {
            if (!actionLoading) setRejectingProduct(null);
          }}
        >
          <div
            className="w-full max-w-md bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="p-6 border-b border-border bg-muted/20">
              <h2 className="text-lg font-bold tracking-tight text-foreground">Reject product</h2>
              <p className="text-sm mt-1 text-muted-foreground">
                Provide a short reason. This will be visible to the submitter.
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Rejection reason
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Broken link / incomplete description / spam"
                  className="w-full min-h-[120px] rounded-lg border border-border bg-background p-3 text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-lg"
                  disabled={!!actionLoading}
                  onClick={() => setRejectingProduct(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  className="flex-1 rounded-lg font-medium"
                  disabled={!!actionLoading || !rejectionReason.trim()}
                  onClick={async () => {
                    const reason = rejectionReason.trim();
                    const id = rejectingProduct.id;
                    setRejectingProduct(null);
                    await handleStatus(id, "REJECTED", reason);
                  }}
                >
                  {actionLoading?.action === "REJECT" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reject"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
