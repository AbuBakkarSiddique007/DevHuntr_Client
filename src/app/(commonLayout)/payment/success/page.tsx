"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { CheckCircle, Crown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  const { user, checkSession } = useAuth();
  const dashboardUrl = `/${user?.role?.toLowerCase() || "user"}-dashboard`;

  useEffect(() => {
    checkSession();
    const interval = setInterval(() => checkSession(), 1500);
    const timeout = setTimeout(() => clearInterval(interval), 7500);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [checkSession]);

  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center p-4 bg-background">
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none -z-10">
        <div className="h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-md text-center p-8 rounded-2xl bg-card border border-border shadow-lg animate-in fade-in zoom-in-95 duration-300">
        <div className="mx-auto mb-6 h-20 w-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
        </div>

        <div className="mb-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold">
          <Crown className="h-3 w-3" /> Lifetime Member
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 mt-2 text-foreground">
          You&apos;re Premium! 🎉
        </h1>
        <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
          Your payment was successful. You now have <span className="text-foreground font-semibold">lifetime access</span> to all premium products on DevHuntr.
        </p>

        <div className="flex flex-col gap-2.5">
          <Link href="/products">
            <Button className="w-full rounded-xl h-11 text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-black shadow-md shadow-amber-500/20 border-none transition-all">
              <Crown className="mr-2 h-4 w-4" /> Explore Premium Products
            </Button>
          </Link>
          <Link href={dashboardUrl}>
            <Button variant="outline" className="w-full rounded-xl h-11 border-border font-medium text-sm">
              Go to Dashboard <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
