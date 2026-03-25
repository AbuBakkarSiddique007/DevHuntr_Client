"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkSession = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users/me`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const response = await res.json();
      setUser(response.data || response.user || response);

    } catch {
      console.log("No active logged-in session.");
      setUser(null);

    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, { method: "POST", credentials: "include" });
    } catch (err) {
      console.warn("Logout request failed, clearing local state anyway.", err);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, logout, checkSession }}>
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
