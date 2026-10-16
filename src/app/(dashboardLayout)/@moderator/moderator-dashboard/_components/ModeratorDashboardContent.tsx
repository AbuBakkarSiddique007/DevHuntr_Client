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
import { Textarea } from "@/components/ui/textarea";
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
      <div className="flex items-center justify-center min-h-[350px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = [
    { title: "Pending Reviews", value: (moderatorStats?.pendingReviews ?? pendingProducts?.length ?? 0).toString(), Icon: Hourglass, color: "text-amber-500" },
    { title: "Active Reports", value: (moderatorStats?.activeReports ?? reports?.length ?? 0).toString(), Icon: AlertCircle, color: "text-rose-500" },
    { title: "Resolved Today", value: (moderatorStats?.resolvedToday ?? 0).toString(), Icon: ShieldCheck, color: "text-emerald-500" },
    { title: "Dismissed Today", value: (moderatorStats?.dismissedToday ?? 0).toString(), Icon: ClipboardCheck, color: "text-blue-500" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Moderation Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">Review new submissions, resolve reports, and enforce platform standards.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="p-5 sm:p-6 rounded-2xl border border-border bg-card shadow-xs flex flex-col justify-between">
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold tracking-tight flex items-center gap-2 text-foreground">
              <Hourglass className="h-4 w-4 text-amber-500" />
              Submission Queue
            </h2>
            <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-full border border-amber-500/20">
              {pendingProducts.length} Pending
            </span>
          </div>

          <div className="space-y-3">
            {pendingProducts.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-xl bg-muted/20">
                <CheckCircle2 className="h-8 w-8 text-emerald-500/40 mx-auto mb-2" />
                <p className="text-xs font-semibold text-muted-foreground">Queue clear! All products reviewed.</p>
              </div>
            ) : (
              pendingProducts.map((product) => (
                <div key={product.id} className="p-3.5 rounded-xl bg-muted/40 border border-border flex items-center justify-between gap-3 hover:bg-muted/60 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-lg border border-border overflow-hidden shrink-0 bg-muted relative">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="40px"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground text-sm truncate">{product.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">{product.description || "No description provided"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Link href={`/products/${product.id}`}>
                      <Button size="icon-sm" variant="ghost" aria-label="Inspect product" className="hover:text-primary">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      onClick={() => handleProductStatus(product.id, "ACCEPTED")}
                      disabled={!!actionLoading}
                      size="icon-sm"
                      aria-label="Accept product"
                      className="bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      {actionLoading?.id === product.id && actionLoading.action === "ACCEPT" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                    </Button>
                    <Button
                      onClick={() => {
                        setRejectingProduct(product);
                        setRejectionReason("");
                      }}
                      disabled={!!actionLoading}
                      size="icon-sm"
                      aria-label="Reject product"
                      variant="destructive"
                    >
                      {actionLoading?.id === product.id && actionLoading.action === "REJECT" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold tracking-tight flex items-center gap-2 text-foreground">
              <Flag className="h-4 w-4 text-destructive" />
              Safety Reports
            </h2>
            <span className="px-2.5 py-0.5 bg-destructive/10 text-destructive text-xs font-semibold rounded-full border border-destructive/20">
              {reports.length} Active
            </span>
          </div>

          <div className="space-y-3">
            {reports.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-xl bg-muted/20">
                <ShieldCheck className="h-8 w-8 text-blue-500/40 mx-auto mb-2" />
                <p className="text-xs font-semibold text-muted-foreground">No active safety reports. Platform is clean.</p>
              </div>
            ) : (
              reports.map((report) => (
                <div key={report.id} className="p-4 rounded-xl bg-destructive/5 border border-destructive/20 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">Reported</span>
                    <span className="text-xs text-muted-foreground">{new Date(report.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      Product:{" "}
                      <Link href={`/products/${report.product?.id}`} className="text-primary hover:underline inline-flex items-center gap-1">
                        {report.product?.name} <ArrowRight className="h-3 w-3" />
                      </Link>
                    </p>
                    <p className="text-xs text-foreground/90 italic mt-1.5 p-2.5 bg-background rounded-lg border border-border">
                      &ldquo;{report.reason}&rdquo;
                    </p>
                  </div>
                  <div className="flex justify-between items-center gap-2 pt-1">
                    <span className="text-xs text-muted-foreground truncate">By: {report.reporter?.name || "Anonymous"}</span>
                    <div className="flex gap-1.5 shrink-0">
                      <Button
                        onClick={() => handleReportStatus(report.id, "DISMISSED")}
                        disabled={!!actionLoading}
                        size="xs"
                        variant="outline"
                        className="rounded-lg text-xs"
                      >
                        Dismiss
                      </Button>
                      <Button
                        onClick={() => handleReportStatus(report.id, "RESOLVED")}
                        disabled={!!actionLoading}
                        size="xs"
                        className="rounded-lg text-xs bg-destructive text-destructive-foreground hover:opacity-90"
                      >
                        {actionLoading?.id === report.id && actionLoading.action === "REPORT" ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <ShieldCheck className="h-3 w-3 mr-1" />}
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
          className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => { if (!actionLoading) setRejectingProduct(null); }}
        >
          <div
            className="w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-xl space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div>
              <h2 className="text-lg font-bold text-foreground">Reject Submission</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Provide constructive feedback for rejecting <span className="text-destructive font-semibold">{rejectingProduct.name}</span>.
              </p>
            </div>

            <div className="space-y-1.5 text-left">
              <label htmlFor="rejection-reason" className="text-xs font-semibold text-foreground">
                Rejection reason
              </label>
              <Textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Incomplete description, broken preview link, or duplicate submission..."
                className="min-h-[110px] text-sm resize-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-xl"
                disabled={!!actionLoading}
                onClick={() => setRejectingProduct(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="flex-1 rounded-xl bg-destructive text-destructive-foreground hover:opacity-90 font-semibold"
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
      )}
    </div>
  );
}
