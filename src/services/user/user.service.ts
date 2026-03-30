const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://devhuntrserver.onrender.com/api/v1";

export interface UpdateProfilePayload {
    name?: string;
    photoUrl?: string;
}

export const UserService = {
    getMe: async () => {
        const res = await fetch(`${API_BASE}/users/me`, {
            method: "GET",
            credentials: "include",
            cache: "no-store",
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || errorData.message || `HTTP ${res.status}`);
        }
        return res.json();
    },

    updateMySubscription: async (isSubscribed: boolean) => {
        const res = await fetch(`${API_BASE}/users/me/subscription`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ isSubscribed }),
            credentials: "include",
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || errorData.message || `HTTP ${res.status}`);
        }
        return res.json();
    },

    updateProfile: async (payload: UpdateProfilePayload) => {
        const res = await fetch(`${API_BASE}/users/update-profile`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
            credentials: "include",
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || errorData.message || `HTTP ${res.status}`);
        }
        return res.json();
    },

    listUsers: async ({ page = 1, limit = 10 } = {}) => {
        const res = await fetch(`${API_BASE}/users?page=${page}&limit=${limit}`, {
            method: "GET",
            credentials: "include",
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || errorData.message || `HTTP ${res.status}`);
        }
        return res.json();
    },

    updateUserRole: async (id: string, role: string) => {
        const res = await fetch(`${API_BASE}/users/${id}/role`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ role }),
            credentials: "include",
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || errorData.message || `HTTP ${res.status}`);
        }
        return res.json();
    },
};
