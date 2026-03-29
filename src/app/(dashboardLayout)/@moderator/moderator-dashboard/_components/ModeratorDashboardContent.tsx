"use client";

import { useEffect, useState } from "react";
import {
  ClipboardCheck,
  Hourglass,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Loader2,
  Eye,
  Flag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductService, Product } from "@/services/product/product.service";
import { ReportService, Report } from "@/services/report/report.service";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { StatisticsService, ModeratorStats } from "@/services/statistics/statistics.service";

export function ModeratorDashboardContent() {
  const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<{ id: string; action: "ACCEPT" | "REJECT" | "REPORT" } | null>(null);
  const [rejectingProduct, setRejectingProduct] = useState<Product | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [moderatorStats, setModeratorStats] = useState<ModeratorStats | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const productRes = await ProductService.getQueueProducts({ page: 1, limit: 50 });
      const fetchedProducts = productRes.data?.products || productRes.data || productRes.products || productRes;
      setPendingProducts(Array.isArray(fetchedProducts) ? fetchedProducts : []);

      const reportRes = await ReportService.getReports({ status: "OPEN" });
      const fetchedReports = reportRes.data || reportRes.reports || [];
      setReports(Array.isArray(fetchedReports) ? fetchedReports : []);

      const stats = await StatisticsService.getModeratorStats();
      setModeratorStats(stats);
      
    } catch (err) {
      console.error("Failed to fetch moderator data", err);
      toast.error("Failed to load moderation queues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProductStatus = async (id: string, status: "ACCEPTED" | "REJECTED", reason?: string) => {
    setActionLoading({ id, action: status === "ACCEPTED" ? "ACCEPT" : "REJECT" });
    try {
      await ProductService.updateProductStatus(id, status, reason);
      toast.success(`Product ${status.toLowerCase()} successfully`);
      setPendingProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Action failed");
    } finally {
      setActionLoading(null);
      fetchData();
    }
  };

  const handleReportStatus = async (id: string, status: "RESOLVED" | "DISMISSED") => {
    setActionLoading({ id, action: "REPORT" });
    try {
      await ReportService.updateReportStatus(id, status);
      toast.success(`Report ${status.toLowerCase()} successfully`);
      setReports(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Action failed");
    } finally {
      setActionLoading(null);
      fetchData();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
      </div>
    );
  }

  const stats = [
    { title: "Pending Reviews", value: (moderatorStats?.pendingReviews ?? pendingProducts?.length ?? 0).toString(), Icon: Hourglass, color: "text-orange-400" },
    { title: "Active Reports", value: (moderatorStats?.activeReports ?? reports?.length ?? 0).toString(), Icon: AlertCircle, color: "text-red-400" },
    { title: "Resolved Today", value: (moderatorStats?.resolvedToday ?? 0).toString(), Icon: ShieldCheck, color: "text-green-400" },
    { title: "Dismissed Today", value: (moderatorStats?.dismissedToday ?? 0).toString(), Icon: ClipboardCheck, color: "text-blue-400" },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-foreground">Moderation Center</h1>
        <p className="text-muted-foreground mt-2 text-lg">Review submissions, manage reports, and keep the feed clean.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 rounded-3xl border border-white/5 bg-white/2 backdrop-blur-xl hover:bg-white/5 transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 -z-10 h-24 w-24 rounded-full bg-purple-500/5 blur-2xl group-hover:bg-purple-500/10 transition-colors"></div>
            <div className="p-3 w-fit rounded-2xl bg-white/5 group-hover:bg-purple-500/10 transition-colors mb-4">
              <stat.Icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <h3 className="text-sm font-bold text-muted-foreground mb-1 uppercase tracking-widest">{stat.title}</h3>
            <p className="text-3xl font-black text-foreground tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Product Review Queue */}
        <div className="rounded-[2rem] border border-white/5 bg-[#0d1117]/40 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <Hourglass className="h-6 w-6 text-orange-400" />
              Submission Queue
            </h3>
            <span className="px-3 py-1 bg-orange-500/10 text-orange-400 text-xs font-bold rounded-full border border-orange-500/20">
              {pendingProducts.length} Pending
            </span>
          </div>

          <div className="space-y-4">
            {pendingProducts.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl">
                <CheckCircle2 className="h-12 w-12 text-green-500/20 mx-auto mb-4" />
                <p className="text-muted-foreground">Queue is clear! All products reviewed.</p>
              </div>
            ) : (
              pendingProducts.map((product) => (
                <div key={product.id} className="p-4 rounded-2xl bg-white/2 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center gap-4 group/item hover:bg-white/5 transition-all">
                  <div className="h-12 w-12 rounded-xl border border-white/10 overflow-hidden shrink-0 bg-white/5 relative">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center"><Eye className="h-5 w-5 text-muted-foreground" /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-foreground truncate">{product.name}</h4>
                    <p className="text-xs text-muted-foreground truncate">{product.description}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link href={`/products/${product.id}`}>
                      <Button size="icon" variant="ghost" className="h-9 w-9 rounded-lg hover:bg-white/10">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      onClick={() => handleProductStatus(product.id, "ACCEPTED")}
                      disabled={!!actionLoading}
                      size="icon"
                      className="h-9 w-9 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white border border-green-500/20"
                    >
                      {actionLoading?.id === product.id && actionLoading.action === "ACCEPT" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                    </Button>
                    <Button
                      onClick={() => {
                        setRejectingProduct(product);
                        setRejectionReason("");
                      }}
                      disabled={!!actionLoading}
                      size="icon"
                      className="h-9 w-9 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20"
                    >
                      {actionLoading?.id === product.id && actionLoading.action === "REJECT" ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Safety / Reports Queue */}
        <div className="rounded-[2rem] border border-white/5 bg-[#0d1117]/40 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <Flag className="h-6 w-6 text-red-400" />
              Safety Reports
            </h3>
            <span className="px-3 py-1 bg-red-500/10 text-red-400 text-xs font-bold rounded-full border border-red-500/20">
              {reports.length} Active
            </span>
          </div>

          <div className="space-y-4">
            {reports.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl">
                <ShieldCheck className="h-12 w-12 text-blue-500/20 mx-auto mb-4" />
                <p className="text-muted-foreground">No active safety reports. Platform is clean.</p>
              </div>
            ) : (
              reports.map((report) => (
                <div key={report.id} className="p-5 rounded-2xl bg-red-500/5 border border-red-500/10 space-y-3 group/report hover:bg-red-500/10 transition-all">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-black uppercase text-red-400 bg-red-400/10 px-2 py-0.5 rounded">Issue Detected</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{new Date(report.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      Report for <Link href={`/products/${report.product?.id}`} className="text-purple-400 hover:underline inline-flex items-center gap-1">{report.product?.name} <ArrowRight className="h-3 w-3" /></Link>
                    </p>
                    <p className="text-sm text-muted-foreground italic mt-2 py-2 px-3 bg-black/20 rounded-xl border border-white/5">
                      &quot;{report.reason}&quot;
                    </p>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[10px] text-muted-foreground">Reporter: {report.reporter?.name}</span>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleReportStatus(report.id, "DISMISSED")}
                        disabled={!!actionLoading}
                        size="sm"
                        variant="ghost"
                        className="h-8 rounded-lg text-xs font-bold hover:bg-white/10"
                      >
                        Dismiss
                      </Button>
                      <Button
                        onClick={() => handleReportStatus(report.id, "RESOLVED")}
                        disabled={!!actionLoading}
                        className="h-8 rounded-lg text-xs font-bold bg-red-500 hover:bg-red-600 text-white"
                      >
                        {actionLoading?.id === report.id && actionLoading.action === "REPORT" ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <ShieldCheck className="h-3 w-3 mr-2" />}
                        Resolve
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* REJECT MODAL */}
      {rejectingProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => {
            if (!actionLoading) setRejectingProduct(null);
          }}
        >
          <div
            className="w-full max-w-md bg-[#0d1117] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="p-6 border-b border-white/5 bg-white/2">
              <h2 className="text-xl font-black tracking-tight text-foreground">Reject product</h2>
              <p className="text-sm mt-2 text-muted-foreground">
                Provide a short reason for rejecting <span className="text-foreground font-bold">{rejectingProduct.name}</span>.
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
                  placeholder="e.g. Broken link / incomplete description / misleading image"
                  className="w-full min-h-[120px] rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-2xl border-white/10"
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
                    await handleProductStatus(id, "REJECTED", reason);
                  }}
                >
                  {actionLoading?.id === rejectingProduct.id && actionLoading.action === "REJECT" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Rejection"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
