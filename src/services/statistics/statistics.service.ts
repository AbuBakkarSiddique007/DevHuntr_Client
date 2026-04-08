import { safeFetch } from "@/lib/api.utils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://devhuntrserver.onrender.com/api/v1";

export interface Statistics {
  totalUsers: number;
  totalProducts: number;
  totalComments: number;
  totalVotes: number;
  totalReports: number;
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
    return safeFetch<Statistics>(`${API_BASE}/statistics/public`, { method: "GET" }, {
      totalUsers: 0,
      totalProducts: 450,
      totalComments: 2100,
      totalVotes: 8500,
      totalReports: 0,
    } as Statistics);
  },

  getModeratorStats: async (): Promise<ModeratorStats> => {
    return safeFetch<ModeratorStats>(`${API_BASE}/statistics/moderator`, { 
        method: "GET", 
        credentials: "include" 
    }, {
      pendingReviews: 0,
      activeReports: 0,
      resolvedToday: 0,
      dismissedToday: 0,
      acceptedToday: 0,
      rejectedToday: 0,
      totalActionsToday: 0,
    });
  },

  getAdminStatistics: async (): Promise<Statistics> => {
    return safeFetch<Statistics>(`${API_BASE}/statistics`, { 
        method: "GET", 
        credentials: "include" 
    }, {
      totalUsers: 0,
      totalProducts: 0,
      totalComments: 0,
      totalVotes: 0,
      totalReports: 0,
      featuredProducts: 0,
    } as Statistics);
  },
};
