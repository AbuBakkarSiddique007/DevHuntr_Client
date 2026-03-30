const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://devhuntrserver.onrender.com/api/v1";

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    photoUrl?: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export const AuthService = {
    register: async (payload: RegisterPayload) => {
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: "POST",
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

    login: async (payload: LoginPayload) => {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
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

    logout: async () => {
        const res = await fetch(`${API_BASE}/auth/logout`, {
            method: "POST",
            credentials: "include",
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || errorData.message || `HTTP ${res.status}`);
        }
        return res.json();
    },

    refreshSession: async () => {
        const res = await fetch(`${API_BASE}/auth/refresh`, {
            method: "POST",
            credentials: "include",
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || errorData.message || `HTTP ${res.status}`);
        }
        return res.json();
    },
};
