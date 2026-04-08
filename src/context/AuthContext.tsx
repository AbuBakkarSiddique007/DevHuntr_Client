"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AuthService } from "@/services/auth/auth.service";
import { UserService } from "@/services/user/user.service";

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

interface UserResponse {
  data?: User;
  user?: User;
  id?: string;
  name?: string;
  role?: Role;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      await AuthService.refreshSession();
      return true;
    } catch {
      return false;
    }
  }, []);

  const checkSession = useCallback(async () => {
    setIsLoading(true);
    try {
      let data: User | null = null;
      try {
        const response = await UserService.getMe({ silent: true }) as UserResponse;
        data = (response?.data || response?.user || (response?.id ? response : null)) as User | null;
      } catch (err: unknown) {
        if ((err as { status?: number })?.status === 401) {
          const refreshed = await refreshSession();
          if (refreshed) {
            const response = await UserService.getMe({ silent: true }) as UserResponse;
            data = ((response?.data || response?.user || (response?.id ? response : null)) as unknown) as User | null;
          } else {
            throw err;
          }
        } else {
          throw err;
        }
      }

      setUser(data);
    } catch {
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
      await AuthService.logout();
    } catch (err) {
      console.warn("Logout request failed, clearing local state anyway.", err);
    }
    setUser(null);
  };

  const updateUser = async (payload: Partial<User>) => {
    try {
      const response = (await UserService.updateProfile(payload)) as unknown as UserResponse;
      const updatedUser = (response?.data || response?.user || (response?.id ? response : null)) as User;
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
