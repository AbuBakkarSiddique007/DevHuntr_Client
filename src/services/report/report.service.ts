const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export type ReportStatus = "OPEN" | "RESOLVED" | "DISMISSED";

export interface Report {
  id: string;
  reason: string;
  status: ReportStatus;
  createdAt: string;
  product: { id: string; name: string; image?: string };
  reporter: { id: string; name: string };
}

export const ReportService = {
  submitReport: async (productId: string, reason: string) => {
    const res = await fetch(`${API_BASE}/reports`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ productId, reason }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || `HTTP ${res.status}`);
    }
    return res.json();
  },

  getReports: async ({ page = 1, limit = 10, status = "OPEN" } = {}) => {
    const res = await fetch(
      `${API_BASE}/reports?page=${page}&limit=${limit}&status=${status}`,
      { credentials: "include" }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || `HTTP ${res.status}`);
    }
    return res.json();
  },

  updateReportStatus: async (
    reportId: string, 
    status: "RESOLVED" | "DISMISSED", 
    rejectProduct?: boolean, 
    rejectionReason?: string
  ) => {
    const res = await fetch(`${API_BASE}/reports/${reportId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status, rejectProduct, rejectionReason }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || `HTTP ${res.status}`);
    }
    return res.json();
  },
};
