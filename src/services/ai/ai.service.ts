import { safeFetch } from "@/lib/api.utils";

export interface AISuggestion {
  title: string;
  description: string;
  category: string;
}

export const AIService = {
  /**
   * Fetches semantic search suggestions based on user input.
   */
  getSearchSuggestions: async (query: string): Promise<AISuggestion[]> => {
    try {
      const res = await safeFetch<{ data: AISuggestion[] }>(`/api/ai/suggestions?query=${encodeURIComponent(query)}`, {
        method: "GET",
        silent: true,
      }, { data: [] });
      return res.data;
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
      const res = await safeFetch<{ data: AISuggestion[] }>(`/api/ai/recommendations`, {
        method: "GET",
        silent: true,
      }, { data: [] });
      return res.data;
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
  },

  /**
   * Sends a message to the AI Chat Assistant.
   */
  sendMessage: async (message: string, history: { role: string; text: string }[] = []): Promise<Response> => {
    try {
      return await fetch(`/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history }),
      });
    } catch (err) {
      console.error("AI Chat fetch failed", err);
      throw err;
    }
  }
};
