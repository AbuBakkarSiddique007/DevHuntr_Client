"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldAlert, Search, Filter, Loader2, Eye, CheckCircle2, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ReportService, Report } from "@/services/report/report.service";

export default function ModeratorReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<{ id: string; action: "DISMISS" | "REJECT" } | null>(null);
  const [rejectingReport, setRejectingReport] = useState<Report | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await ReportService.getReports({ status: "OPEN", limit: 50 });
      const data = res.data?.reports || res.reports || res.data || res;
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return reports;
    return reports.filter((r) =>
      r.product.name.toLowerCase().includes(q) ||
      r.reason.toLowerCase().includes(q)
    );
  }, [reports, search]);

  const handleStatus = async (
    reportId: string,
    status: "RESOLVED" | "DISMISSED",
    rejectProduct = false,
    reason?: string
  ) => {
    setActionLoading({ id: reportId, action: rejectProduct ? "REJECT" : "DISMISS" });
    try {
      await ReportService.updateReportStatus(reportId, status, rejectProduct, reason);
      toast.success(rejectProduct ? "Product rejected and reports resolved" : "Report dismissed");


      // If we rejected the product, we resolved ALL reports for it.
      // The backend updateMany handles the DB, but we should update local state:
      if (rejectProduct) {
        const productId = reports.find(r => r.id === reportId)?.product.id;

        setReports(prev => prev.filter(r => r.product.id !== productId));
      } else {

        setReports(prev => prev.filter(r => r.id !== reportId));
      }

    } catch (err) {
      toast.error("Action failed");
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };
  

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="h-7 w-7 text-destructive" />
            Report Management
          </h1>
          <p className="text-muted-foreground mt-1 text-base">Review and resolve community-flagged products.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
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
            <div className="h-8 w-8 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Pending Reports</p>
              <p className="text-xs text-muted-foreground">{filtered.length} active flags</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg border-border"
            onClick={fetchReports}
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
                  <div className="h-10 w-10 rounded-lg bg-muted shrink-0" />
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="h-4 w-32 bg-muted rounded" />
                    <div className="h-3 w-20 bg-muted rounded" />
                  </div>
                </div>
                <div className="h-12 w-full bg-muted rounded-lg" />
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="py-16 px-4 text-center">
              <div className="flex flex-col items-center gap-3">
                <CheckCircle2 className="h-10 w-10 text-success/40" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Safe & Clear</p>
                  <p className="text-xs text-muted-foreground">No community flags to review at the moment.</p>
                </div>
              </div>
            </div>
          ) : (
            filtered.map((report) => (
              <div key={report.id} className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted border border-border overflow-hidden shrink-0">
                    {report.product.image && (
                      <Image
                        src={report.product.image}
                        alt={report.product.name}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground text-sm truncate">
                      {report.product.name}
                    </p>
                    <Link
                      href={`/products/${report.product.id}`}
                      className="text-xs text-primary hover:underline inline-flex items-center gap-1 font-medium mt-0.5"
                    >
                      View Product <Eye className="h-3 w-3" />
                    </Link>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/50 border border-border/60 text-xs space-y-1">
                  <p className="text-foreground italic leading-relaxed">&quot;{report.reason}&quot;</p>
                  <p className="text-muted-foreground pt-1 border-t border-border/40">
                    Reported by <span className="font-medium text-foreground">{report.reporter.name}</span>
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button
                    onClick={() => handleStatus(report.id, "DISMISSED")}
                    disabled={!!actionLoading}
                    size="sm"
                    variant="outline"
                    className="h-8 px-3 rounded-lg border-border text-xs font-medium"
                  >
                    {actionLoading?.id === report.id && actionLoading.action === "DISMISS" ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                    ) : null}
                    Dismiss
                  </Button>
                  <Button
                    onClick={() => {
                      setRejectingReport(report);
                      setRejectionReason("");
                    }}
                    disabled={!!actionLoading}
                    size="sm"
                    variant="destructive"
                    className="h-8 px-3 rounded-lg text-xs font-medium"
                  >
                    {actionLoading?.id === report.id && actionLoading.action === "REJECT" ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                    ) : null}
                    Take Action
                  </Button>
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
                <th className="py-4 px-6">Reported Product</th>
                <th className="py-4 px-6">Reason / Reporter</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-5 px-6"><div className="h-10 w-56 bg-muted rounded-lg" /></td>
                    <td className="py-5 px-6"><div className="h-10 w-64 bg-muted rounded-lg" /></td>
                    <td className="py-5 px-6"><div className="h-10 w-32 bg-muted rounded-lg ml-auto" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <CheckCircle2 className="h-12 w-12 text-success/40" />
                      <div>
                        <p className="text-base font-semibold text-foreground">Safe & Clear</p>
                        <p className="text-sm text-muted-foreground">No community flags to review at the moment.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((report) => (
                  <tr key={report.id} className="group hover:bg-muted/40 transition-colors">
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-muted border border-border overflow-hidden shrink-0">
                          {report.product.image && (
                            <Image
                              src={report.product.image}
                              alt={report.product.name}
                              width={40}
                              height={40}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                            {report.product.name}
                          </p>
                          <Link href={`/products/${report.product.id}`} className="text-xs text-primary/80 hover:text-primary flex items-center gap-1 transition-colors font-medium">
                            View Product <Eye className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="space-y-1">
                        <p className="text-sm text-foreground italic">&quot;{report.reason}&quot;</p>
                        <p className="text-xs text-muted-foreground">
                          By <span className="font-medium text-foreground">{report.reporter.name}</span>
                        </p>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          onClick={() => handleStatus(report.id, "DISMISSED")}
                          disabled={!!actionLoading}
                          size="sm"
                          variant="outline"
                          className="h-9 px-3.5 rounded-lg border-border text-xs font-medium"
                        >
                          {actionLoading?.id === report.id && actionLoading.action === "DISMISS" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Dismiss"
                          )}
                        </Button>
                        <Button
                          onClick={() => {
                            setRejectingReport(report);
                            setRejectionReason("");
                          }}
                          disabled={!!actionLoading}
                          size="sm"
                          variant="destructive"
                          className="h-9 px-3.5 rounded-lg text-xs font-medium"
                        >
                          {actionLoading?.id === report.id && actionLoading.action === "REJECT" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Take Action"
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
      {rejectingReport && (
        <div
          className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => {
            if (!actionLoading) setRejectingReport(null);
          }}
        >
          <div
            className="w-full max-w-md bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="p-6 border-b border-border bg-destructive/10">
              <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Confirm Product Rejection
              </h2>
              <p className="text-xs mt-1 text-muted-foreground font-medium">
                Target: <span className="text-destructive font-semibold">{rejectingReport.product.name}</span>
              </p>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-muted-foreground">
                This will permanently reject the product, hide it from all public feeds, and resolve all pending reports for it.
              </p>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Resolution Reason
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why this product is being removed..."
                  className="w-full min-h-[100px] rounded-lg border border-border bg-background p-3 text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-lg"
                  disabled={!!actionLoading}
                  onClick={() => setRejectingReport(null)}
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
                    const reportId = rejectingReport.id;
                    setRejectingReport(null);
                    await handleStatus(reportId, "RESOLVED", true, reason);
                  }}
                >
                  Confirm Reject
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
