const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export interface Statistics {
  totalUsers: number;
  totalProducts: number;
  totalComments: number;
  totalVotes: number;
  featuredProducts?: number;
  products?: {
    pending: number;
    accepted: number;
    rejected: number;
  };
}

export interface ModeratorStats {
  pendingReviews: number;
  activeReports: number;
  resolvedToday: number;
  dismissedToday: number;
  acceptedToday: number;
  rejectedToday: number;
  totalActionsToday: number;
}

export const StatisticsService = {
  getStatistics: async (): Promise<Statistics> => {
    const res = await fetch(`${API_BASE}/statistics/public`, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch statistics");
    }

    const { data } = await res.json();
    return data;
  },

  getModeratorStats: async (): Promise<ModeratorStats> => {
    const res = await fetch(`${API_BASE}/statistics/moderator`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `HTTP ${res.status}`);
    }

    const { data } = await res.json();
    return data;
  },
};
