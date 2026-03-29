"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://devhuntrserver.onrender.com/api/v1";

export type Role = "USER" | "MODERATOR" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  photoUrl?: string;
  isSubscribed: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  updateUser: (payload: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      return res.ok;
    } catch {
      return false;
    }
  }, []);

  const checkSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const runMe = async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        try {
          return await fetch(`${API_BASE}/users/me`, {
            method: "GET",
            credentials: "include",
            cache: "no-store",
            signal: controller.signal,
          });
        } finally {
          clearTimeout(timeoutId);
        }
      };

      let res = await runMe();

      if (res.status === 401) {
        const refreshed = await refreshSession();
        if (refreshed) {
          res = await runMe();
        }
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const response = await res.json();

      setUser(response.data || response.user || response);

    } catch (err) {
      console.log("No active logged-in session.", err);
      setUser(null);

    } finally {
      setIsLoading(false);
    }
  }, [refreshSession]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include"
      });

    } catch (err) {
      console.warn("Logout request failed, clearing local state anyway.", err);
    }
    setUser(null);
  };

  const updateUser = async (payload: Partial<User>) => {
    try {
      const res = await fetch(`${API_BASE}/users/update-profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",

      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));

        throw new Error(errorData.error || errorData.message || `HTTP ${res.status}`);
      }
      const response = await res.json();
      const updatedUser = response.data || response.user || response;

      setUser(updatedUser);

    } catch (err) {
      console.error("Profile update failed", err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, logout, checkSession, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
