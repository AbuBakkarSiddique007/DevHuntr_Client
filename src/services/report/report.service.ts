import { safeFetch } from "@/lib/api.utils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://devhuntrserver.onrender.com/api/v1";

export type ReportStatus = "OPEN" | "RESOLVED" | "DISMISSED";

export interface Report {
  id: string;
  reason: string;
  status: ReportStatus;
  createdAt: string;
  product: { id: string; name: string; image?: string };
  reporter: { id: string; name: string };
}

export interface ReportListResponse {
  data?: {
    reports?: Report[];
    meta?: { total?: number };
  } & Report[];
  reports?: Report[];
  meta?: { total?: number };
}

export interface ReportActionResponse {
  success?: boolean;
  message?: string;
  data?: unknown;
}

export const ReportService = {
  submitReport: async (productId: string, reason: string): Promise<ReportActionResponse> => {
    return safeFetch<ReportActionResponse>(`${API_BASE}/reports`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ productId, reason }),
    });
  },

  getReports: async ({ page = 1, limit = 10, status = "OPEN" } = {}): Promise<ReportListResponse> => {
    return safeFetch<ReportListResponse>(
      `${API_BASE}/reports?page=${page}&limit=${limit}&status=${status}`,
      { credentials: "include" }
    );
  },

  updateReportStatus: async (
    reportId: string, 
    status: "RESOLVED" | "DISMISSED", 
    rejectProduct?: boolean, 
    rejectionReason?: string
  ): Promise<ReportActionResponse> => {
    return safeFetch<ReportActionResponse>(`${API_BASE}/reports/${reportId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status, rejectProduct, rejectionReason }),
    });
  },

  deleteReport: async (id: string): Promise<ReportActionResponse> => {
    return safeFetch<ReportActionResponse>(`${API_BASE}/reports/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
  },
};
