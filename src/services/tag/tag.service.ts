import { safeFetch } from "@/lib/api.utils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://devhuntrserver.onrender.com/api/v1";

export interface Tag {
  id: string;
  name: string;
}

const FALLBACK_TAGS: Tag[] = [
  { id: "fallback-1", name: "AI Chatbots" },
  { id: "fallback-2", name: "Developer Tools" },
  { id: "fallback-3", name: "Productivity" },
  { id: "fallback-4", name: "Open Source" },
  { id: "fallback-5", name: "Design & Creative" },
  { id: "fallback-6", name: "Analytics" },
  { id: "fallback-7", name: "LLM Developer Tools" },
  { id: "fallback-8", name: "SaaS" },
];

export const TagService = {
  getTags: async (): Promise<Tag[]> => {
    try {
      const result = await safeFetch<{ tags?: Tag[] } | Tag[]>(
        `${API_BASE}/tags`,
        {
          method: "GET",
          credentials: "include",
          silent: true,
        },
        { tags: [] }
      );

      if (Array.isArray(result)) {
        return result.length > 0 ? result : FALLBACK_TAGS;
      }

      if (result && Array.isArray(result.tags) && result.tags.length > 0) {
        return result.tags;
      }

      return FALLBACK_TAGS;
    } catch (err) {
      console.warn("[TagService] Handled network/adblocker fetch error gracefully:", err);
      return FALLBACK_TAGS;
    }
  },

  createTag: async (name: string): Promise<Tag> => {
    return safeFetch<Tag>(`${API_BASE}/tags`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
      credentials: "include",
    });
  },
};
