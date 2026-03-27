const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://devhuntrserver.onrender.com/api/v1";

export interface Statistics {
  totalUsers: number;
  totalProducts: number;
  totalComments: number;
  totalVotes: number;
  totalReports: number;
  featuredProducts: number;
  products: {
    pending: number;
    accepted: number;
    rejected: number;
  }
}

export const StatisticsService = {
  getStatistics: async (): Promise<Statistics> => {
    const res = await fetch(`${API_BASE}/statistics`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `HTTP ${res.status}`);
    }

    const result = await res.json();
    return result.data || result;
  },
};
