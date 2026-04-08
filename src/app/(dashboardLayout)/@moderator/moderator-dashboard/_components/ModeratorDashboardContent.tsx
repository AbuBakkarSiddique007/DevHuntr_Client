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
      const fetchedProducts = productRes.products || [];
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
    <div className="space-y-12 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight">Moderation Center</h1>
        <p className="text-slate-500 dark:text-muted-foreground mt-2 text-lg md:text-xl">Maintain platform excellence by reviewing submissions and reports.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="p-8 rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm dark:shadow-none hover:border-purple-200 dark:hover:border-purple-500/30 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 -z-10 h-32 w-32 rounded-full bg-slate-100 dark:bg-white/5 blur-3xl group-hover:bg-purple-500/10 transition-colors"></div>
            <div className={`p-4 w-fit rounded-2xl bg-slate-50 dark:bg-white/5 group-hover:bg-purple-500/10 transition-colors mb-6 border border-slate-100 dark:border-white/5`}>
              <stat.Icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <h3 className="text-xs font-black text-slate-400 dark:text-muted-foreground mb-2 uppercase tracking-[0.2em] leading-none">{stat.title}</h3>
            <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        {/* Product Review Queue */}
        <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 backdrop-blur-xl p-8 md:p-10 shadow-sm dark:shadow-none relative overflow-hidden group">
          <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
            <h3 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3 text-slate-900 dark:text-white">
              <Hourglass className="h-7 w-7 text-orange-400" />
              Submission Queue
            </h3>
            <span className="px-3.5 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-orange-500/20">
              {pendingProducts.length} Pending
            </span>
          </div>

          <div className="space-y-4">
            {pendingProducts.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[2rem] bg-slate-50/50 dark:bg-white/2">
                <CheckCircle2 className="h-12 w-12 text-green-500/20 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-muted-foreground font-bold">Queue is clear! All products reviewed.</p>
              </div>
            ) : (
              pendingProducts.map((product) => (
                <div key={product.id} className="p-4 md:p-5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center gap-5 group/item hover:bg-slate-50 dark:hover:bg-white/10 transition-all shadow-sm dark:shadow-none">
                  <div className="h-16 w-16 rounded-xl border border-slate-100 dark:border-white/10 overflow-hidden shrink-0 bg-slate-100 dark:bg-white/5 relative shadow-md">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="64px"
                        className="h-full w-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-linear-to-br from-indigo-500/10 to-purple-500/10"><Eye className="h-6 w-6 text-purple-400" /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <h4 className="font-black text-slate-900 dark:text-white text-lg tracking-tight uppercase group-hover/item:text-purple-600 dark:group-hover/item:text-purple-400 transition-colors">{product.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-muted-foreground line-clamp-1 opacity-80">{product.description}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link href={`/products/${product.id}`}>
                      <Button size="icon" variant="ghost" className="h-11 w-11 rounded-xl hover:bg-purple-500/10 text-slate-700 dark:text-purple-400 border border-transparent hover:border-purple-500/20 transition-all">
                        <Eye className="h-5 w-5" />
                      </Button>
                    </Link>
                    <Button
                      onClick={() => handleProductStatus(product.id, "ACCEPTED")}
                      disabled={!!actionLoading}
                      size="icon"
                      className="h-11 w-11 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500 hover:text-white border border-green-500/20 shadow-lg shadow-green-500/5 transition-all"
                    >
                      {actionLoading?.id === product.id && actionLoading.action === "ACCEPT" ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
                    </Button>
                    <Button
                      onClick={() => {
                        setRejectingProduct(product);
                        setRejectionReason("");
                      }}
                      disabled={!!actionLoading}
                      size="icon"
                      className="h-11 w-11 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 shadow-lg shadow-red-500/5 transition-all"
                    >
                      {actionLoading?.id === product.id && actionLoading.action === "REJECT" ? <Loader2 className="h-5 w-5 animate-spin" /> : <XCircle className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Safety / Reports Queue */}
        <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 backdrop-blur-xl p-8 md:p-10 shadow-sm dark:shadow-none relative overflow-hidden group">
          <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
            <h3 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3 text-slate-900 dark:text-white">
              <Flag className="h-7 w-7 text-red-400" />
              Safety Reports
            </h3>
            <span className="px-3.5 py-1 bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-red-500/20">
              {reports.length} Active
            </span>
          </div>

          <div className="space-y-4">
            {reports.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[2rem] bg-slate-50/50 dark:bg-white/2">
                <ShieldCheck className="h-12 w-12 text-blue-500/20 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-muted-foreground font-bold">No active safety reports. Platform is clean.</p>
              </div>
            ) : (
              reports.map((report) => (
                <div key={report.id} className="p-6 rounded-[2rem] bg-red-50/50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/20 space-y-4 group/report hover:bg-red-100/50 dark:hover:bg-red-500/10 transition-all shadow-sm dark:shadow-none">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[10px] font-black uppercase text-red-600 dark:text-red-400 bg-red-400/10 px-3 py-1 rounded-full border border-red-500/10">Issue Detected</span>
                    <span className="text-[10px] text-slate-400 dark:text-muted-foreground/50 font-black uppercase tracking-widest">{new Date(report.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                      Report for <Link href={`/products/${report.product?.id}`} className="text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center gap-1 font-bold">{report.product?.name} <ArrowRight className="h-3 w-3" /></Link>
                    </p>
                    <p className="text-sm text-slate-600 dark:text-muted-foreground italic mt-3 py-4 px-5 bg-white dark:bg-black/20 rounded-2xl border border-slate-200 dark:border-white/5 shadow-inner">
                      &quot;{report.reason}&quot;
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-between items-center gap-4 pt-2">
                    <span className="text-[10px] text-slate-400 dark:text-muted-foreground/60 font-bold uppercase tracking-widest">Reporter: {report.reporter?.name}</span>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleReportStatus(report.id, "DISMISSED")}
                        disabled={!!actionLoading}
                        size="sm"
                        variant="ghost"
                        className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-foreground border border-slate-200 dark:border-transparent transition-all"
                      >
                        Dismiss
                      </Button>
                      <Button
                        onClick={() => handleReportStatus(report.id, "RESOLVED")}
                        disabled={!!actionLoading}
                        className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition-all"
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => {
            if (!actionLoading) setRejectingProduct(null);
          }}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="p-8 border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Reject Submission</h2>
              <p className="text-sm mt-3 text-slate-500 dark:text-muted-foreground leading-relaxed">
                Provide a short reason for rejecting <span className="text-red-500 font-bold">{rejectingProduct.name}</span>.
              </p>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 dark:text-muted-foreground uppercase tracking-[0.2rem] ml-1">
                  Rejection reason
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Broken link / incomplete description / misleading image"
                  className="w-full min-h-[140px] rounded-[1.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-5 text-sm text-slate-900 dark:text-foreground focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 transition-all resize-none shadow-inner"
                />
              </div>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1 rounded-2xl h-12 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-foreground font-bold hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                  disabled={!!actionLoading}
                  onClick={() => setRejectingProduct(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest bg-red-500 hover:bg-red-600 text-white shadow-xl shadow-red-500/25 transition-all"
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
