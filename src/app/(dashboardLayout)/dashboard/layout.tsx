"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  admin: React.ReactNode;
  moderator: React.ReactNode;
  dashboard: React.ReactNode;
}

export default function DashboardLayout({
  children,
  admin,
  moderator,
  dashboard,
}: DashboardLayoutProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?callback=/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!user) return null;

  let slot = dashboard;

  if (user.role === "ADMIN") {
    slot = admin;
  } else if (user.role === "MODERATOR") {
    slot = moderator;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">

        <main className="flex-1 px-4 py-8 md:px-8 lg:px-12 animate-in fade-in duration-500">
          <div className="max-w-7xl mx-auto">

            {slot}
            {children}

          </div>
        </main>
      </div>
    </div>
  );
}
