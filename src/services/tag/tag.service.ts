const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://devhuntrserver.onrender.com/api/v1";

export interface Tag {
  id: string;
  name: string;
}

export const TagService = {
  getTags: async (): Promise<Tag[]> => {
    const res = await fetch(`${API_BASE}/tags`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `HTTP ${res.status}`);
    }

    const result = await res.json();
    return result.data.tags || result.tags || [];
  },

  createTag: async (name: string): Promise<Tag> => {
    const res = await fetch(`${API_BASE}/tags`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
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
