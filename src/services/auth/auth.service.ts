import { safeFetch } from "@/lib/api.utils";
import {
    clearStoredTokens,
    getStoredRefreshToken,
    setStoredRefreshToken,
    setStoredToken,
} from "@/lib/token.utils";

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

export interface AuthDataPayload {
    token?: string;
    accessToken?: string;
    refreshToken?: string;
    user?: unknown;
}

export interface AuthApiResponse {
    token?: string;
    accessToken?: string;
    refreshToken?: string;
    user?: unknown;
    data?: AuthDataPayload;
}

export const AuthService = {
    register: async (payload: RegisterPayload) => {
        const response = (await safeFetch(`${API_BASE}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            credentials: "include",
        })) as AuthApiResponse;

        const token = response?.token || response?.accessToken || response?.data?.token || response?.data?.accessToken;
        const refreshToken = response?.refreshToken || response?.data?.refreshToken;
        if (token) setStoredToken(token);
        if (refreshToken) setStoredRefreshToken(refreshToken);

        return response;
    },

    login: async (payload: LoginPayload) => {
        const response = (await safeFetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            credentials: "include",
        })) as AuthApiResponse;

        const token = response?.token || response?.accessToken || response?.data?.token || response?.data?.accessToken;
        const refreshToken = response?.refreshToken || response?.data?.refreshToken;
        if (token) setStoredToken(token);
        if (refreshToken) setStoredRefreshToken(refreshToken);

        return response;
    },

    logout: async () => {
        try {
            return await safeFetch(`${API_BASE}/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
        } finally {
            clearStoredTokens();
        }
    },

    refreshSession: async () => {
        const refreshToken = getStoredRefreshToken();
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (refreshToken) {
            headers["x-refresh-token"] = refreshToken;
        }

        const response = (await safeFetch(`${API_BASE}/auth/refresh`, {
            method: "POST",
            headers,
            body: JSON.stringify({ refreshToken }),
            credentials: "include",
        })) as AuthApiResponse;

        const token = response?.accessToken || response?.token;
        if (token) setStoredToken(token);
        if (response?.refreshToken) setStoredRefreshToken(response.refreshToken);

        return response;
    },
};
