import { safeFetch } from "@/lib/api.utils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://devhuntrserver.onrender.com/api/v1";

export interface Comment {
  id: string;
  description: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    photoUrl?: string;
  };
}

export interface PostCommentResponse {
  data?: Comment;
  id?: string;
  description?: string;
  createdAt?: string;
  author?: {
    id: string;
    name: string;
    photoUrl?: string;
  };
}

export const CommentService = {
  getComments: async (productId: string, { page = 1, limit = 20 } = {}): Promise<Comment[]> => {
    const url = `${API_BASE}/comments/${productId}?page=${page}&limit=${limit}`;
    const result = await safeFetch<{ comments?: Comment[] } | Comment[]>(
      url,
      { credentials: "include" },
      []
    );
    if (Array.isArray(result)) return result;
    return result?.comments || [];
  },

  postComment: async (productId: string, content: string): Promise<PostCommentResponse> => {
    return safeFetch<PostCommentResponse>(`${API_BASE}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ productId, description: content }),
    });
  },
};
