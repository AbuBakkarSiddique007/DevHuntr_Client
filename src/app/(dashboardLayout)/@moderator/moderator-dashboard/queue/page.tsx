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
      const data = res.data?.products || res.data || res.products || res;
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
          <h1 className="text-3xl font-extrabold tracking-tight">Full Review Queue</h1>
          <p className="text-muted-foreground mt-1 text-lg">In-depth management of all pending submissions.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search queue..."
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

      <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/2 shadow-sm dark:shadow-none overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-transparent">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <ListOrdered className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <p className="font-bold">Pending Submissions</p>
              <p className="text-xs text-muted-foreground">{filtered.length} items</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="rounded-xl border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-foreground"
            onClick={fetchQueue}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
          </Button>
        </div>

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
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-6 px-6"><div className="h-10 w-56 bg-white/5 rounded-lg" /></td>
                    <td className="py-6 px-4"><div className="h-10 w-20 bg-white/5 rounded-lg mx-auto" /></td>
                    <td className="py-6 px-6"><div className="h-10 w-32 bg-white/5 rounded-lg ml-auto" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <CheckCircle2 className="h-12 w-12 text-green-500/20" />
                      <div>
                        <p className="text-lg font-bold text-muted-foreground">Queue is clear</p>
                        <p className="text-sm text-muted-foreground/60">No pending submissions right now.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product.id} className="group hover:bg-slate-50 dark:hover:bg-white/2 transition-all">
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 overflow-hidden shrink-0">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-foreground group-hover:text-purple-400 transition-colors truncate uppercase tracking-tight">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-1 max-w-105">{product.description}</p>
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
                        <Link href={`/products/${product.id}`}>
                          <Button size="sm" variant="ghost" className="h-9 w-9 p-0 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-foreground">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          onClick={() => handleStatus(product.id, "ACCEPTED")}
                          disabled={!!actionLoading}
                          size="sm"
                          className="h-9 w-9 p-0 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white border border-green-500/20"
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
                          size="sm"
                          className="h-9 w-9 p-0 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20"
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => {
            if (!actionLoading) setRejectingProduct(null);
          }}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="p-6 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/2">
              <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-foreground">Reject product</h2>
              <p className="text-sm mt-2 text-muted-foreground">
                Provide a short reason. This will be saved with the rejection.
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">
                  Rejection reason
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Broken link / incomplete description / spam"
                  className="w-full min-h-[120px] rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-4 text-sm text-slate-900 dark:text-foreground focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 transition-all resize-none shadow-sm dark:shadow-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-2xl border-slate-200 dark:border-white/10 text-slate-700 dark:text-foreground"
                  disabled={!!actionLoading}
                  onClick={() => setRejectingProduct(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="flex-1 rounded-2xl font-bold bg-red-500 hover:bg-red-600 text-white"
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
