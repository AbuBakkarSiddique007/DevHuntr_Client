import { safeFetch } from "@/lib/api.utils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://devhuntrserver.onrender.com/api/v1";

export type VoteType = "UPVOTE" | "DOWNVOTE";

export interface VoteStatus {
  voteType: VoteType | null;
}

export const VoteService = {
  checkVote: async (productId: string): Promise<VoteStatus> => {
    return safeFetch(`${API_BASE}/votes/${productId}/check`, {
      credentials: "include",
    }, { voteType: null });
  },

  castVote: async (productId: string, voteType: VoteType) => {
    return safeFetch(`${API_BASE}/votes/${productId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ voteType }),
    });
  },
};
