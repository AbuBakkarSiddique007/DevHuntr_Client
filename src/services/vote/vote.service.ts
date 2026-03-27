const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export type VoteType = "UPVOTE" | "DOWNVOTE";

export interface VoteStatus {
  voteType: VoteType | null;
}

export const VoteService = {
  checkVote: async (productId: string): Promise<VoteStatus> => {
    const res = await fetch(`${API_BASE}/votes/${productId}/check`, {
      credentials: "include",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || `HTTP ${res.status}`);
    }
    return res.json();
  },

  castVote: async (productId: string, voteType: VoteType) => {
    const res = await fetch(`${API_BASE}/votes/${productId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ voteType }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || `HTTP ${res.status}`);
    }
    return res.json();
  },
};
