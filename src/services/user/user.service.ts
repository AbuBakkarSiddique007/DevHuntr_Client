import { safeFetch } from "@/lib/api.utils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://devhuntrserver.onrender.com/api/v1";

export interface UpdateProfilePayload {
    name?: string;
    photoUrl?: string;
    bio?: string;
}

export const UserService = {
    getMe: async () => {
        return safeFetch(`${API_BASE}/users/me`, {
            method: "GET",
            credentials: "include",
            cache: "no-store",
        });
    },

    updateMySubscription: async (isSubscribed: boolean) => {
        return safeFetch(`${API_BASE}/users/me/subscription`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isSubscribed }),
            credentials: "include",
        });
    },

    updateProfile: async (payload: UpdateProfilePayload) => {
        return safeFetch(`${API_BASE}/users/update-profile`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            credentials: "include",
        });
    },

    listUsers: async ({ page = 1, limit = 10 } = {}) => {
        return safeFetch(`${API_BASE}/users?page=${page}&limit=${limit}`, {
            method: "GET",
            credentials: "include",
        });
    },

    updateUserRole: async (id: string, role: string) => {
        return safeFetch(`${API_BASE}/users/${id}/role`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role }),
            credentials: "include",
        });
    },

    deleteUser: async (id: string) => {
        return safeFetch(`${API_BASE}/users/${id}`, {
            method: "DELETE",
            credentials: "include",
        });
    },
};
