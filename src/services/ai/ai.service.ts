import { safeFetch } from "@/lib/api.utils";

export interface AISuggestion {
  title: string;
  description: string;
  category: string;
}

export const AIService = {
  /**
   * Fetches AI-powered search suggestions based on the user's query.
   */
  getSearchSuggestions: async (query: string): Promise<AISuggestion[]> => {
    if (!query || query.length < 2) return [];
    
    try {
      return await safeFetch(`/api/ai/suggestions?query=${encodeURIComponent(query)}`, {
        method: "GET",
        silent: true,
      }, []);
    } catch (err) {
      console.error("AI Suggestions failed", err);
      return [];
    }
  },

  /**
   * Fetches personalized recommendations for the current user.
   */
  getRecommendations: async (): Promise<AISuggestion[]> => {
    try {
      return await safeFetch(`/api/ai/recommendations`, {
        method: "GET",
        silent: true,
      }, []);
    } catch (err) {
      console.error("AI Recommendations failed", err);
      return [];
    }
  },

  /**
   * Fetches a semantic summary of current trends.
   */
  getTrendingInsight: async (): Promise<string> => {
    try {
      const res = await safeFetch<{ insight: string }>(`/api/ai/trending-insight`, {
        method: "GET",
        silent: true,
      }, { insight: "" });
      return res.insight;
    } catch {
      return "";
    }
  }
};
