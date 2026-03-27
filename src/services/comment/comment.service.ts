const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://devhuntrserver.onrender.com/api/v1";

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    photoUrl?: string;
  };
}

export const CommentService = {
  getComments: async (productId: string, { page = 1, limit = 20 } = {}) => {
    const res = await fetch(
      `${API_BASE}/comments/${productId}?page=${page}&limit=${limit}`,
      { credentials: "include" }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || `HTTP ${res.status}`);
    }
    return res.json();
  },

  postComment: async (productId: string, content: string) => {
    const res = await fetch(`${API_BASE}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ productId, content }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || `HTTP ${res.status}`);
    }
    return res.json();
  },
};
