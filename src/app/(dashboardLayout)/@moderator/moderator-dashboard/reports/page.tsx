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
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <ShieldAlert className="h-8 w-8 text-red-400" />
            Report Management
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">Review and resolve community-flagged products.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
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

      <div className="rounded-2xl border border-white/5 bg-white/2 backdrop-blur-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="font-bold">Pending Reports</p>
              <p className="text-xs text-muted-foreground">{filtered.length} active flags</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="rounded-xl border-white/10 bg-white/5"
            onClick={fetchReports}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-white/5">
                <th className="py-5 px-6">Reported Product</th>
                <th className="py-5 px-6">Reason / Reporter</th>
                <th className="py-5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-6 px-6"><div className="h-10 w-56 bg-white/5 rounded-lg" /></td>
                    <td className="py-6 px-6"><div className="h-10 w-64 bg-white/5 rounded-lg" /></td>
                    <td className="py-6 px-6"><div className="h-10 w-32 bg-white/5 rounded-lg ml-auto" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <CheckCircle2 className="h-12 w-12 text-green-500/20" />
                      <div>
                        <p className="text-lg font-bold text-muted-foreground">Safe & Clear</p>
                        <p className="text-sm text-muted-foreground/60">No community flags to review at the moment.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((report) => (
                  <tr key={report.id} className="group hover:bg-white/2 transition-all">
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/5 overflow-hidden shrink-0">
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
                          <p className="font-bold text-foreground group-hover:text-purple-400 transition-colors truncate">
                            {report.product.name}
                          </p>
                          <Link href={`/products/${report.product.id}`} className="text-[10px] text-purple-400/60 hover:text-purple-400 flex items-center gap-1 transition-colors uppercase tracking-widest font-black">
                            View Product <Eye className="h-2.5 w-2.5" />
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="space-y-1">
                        <p className="text-sm text-foreground italic">&quot;{report.reason}&quot;</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                          By <span className="text-foreground">{report.reporter.name}</span>
                        </p>
                      </div>
                    </td>
                    <td className="py-6 px-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Button
                          onClick={() => handleStatus(report.id, "DISMISSED")}
                          disabled={!!actionLoading}
                          size="sm"
                          variant="outline"
                          className="h-9 px-4 rounded-xl border-white/10 hover:bg-white/5 text-xs font-bold"
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
                          className="h-9 px-4 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 text-xs font-bold"
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => {
            if (!actionLoading) setRejectingReport(null);
          }}
        >
          <div
            className="w-full max-w-md bg-[#0d1117] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-white/10 bg-red-500/5">
              <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Confirm Product Rejection
              </h2>
              <p className="text-xs mt-1 text-muted-foreground uppercase tracking-widest font-bold">
                Action on: <span className="text-red-400">{rejectingReport.product.name}</span>
              </p>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-muted-foreground">
                This will permanently reject the product, hide it from all public feeds, and resolve all pending reports for it.
              </p>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">
                  Resolution Reason
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why this product is being removed..."
                  className="w-full min-h-[100px] rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-red-500/20 transition-all resize-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-2xl border-white/10 h-11 font-bold"
                  disabled={!!actionLoading}
                  onClick={() => setRejectingReport(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="flex-1 rounded-2xl font-bold bg-red-600 hover:bg-red-700 text-white h-11"
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
