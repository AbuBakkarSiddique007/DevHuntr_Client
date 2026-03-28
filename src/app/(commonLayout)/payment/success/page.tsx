"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { CheckCircle, Crown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  const { checkSession } = useAuth();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">

      <div className="fixed inset-0 flex items-center justify-center pointer-events-none -z-10">
        <div className="h-[600px] w-[600px] rounded-full bg-green-500/5 blur-[120px]" />
      </div>

      <div className="w-full max-w-md text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="mx-auto mb-8 h-24 w-24 rounded-3xl bg-green-500/10 border border-green-500/30 flex items-center justify-center">
          <CheckCircle className="h-12 w-12 text-green-400" />
        </div>

        <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
          <Crown className="h-3 w-3" /> Lifetime Member
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight mb-4 mt-4">
          You&apos;re Premium! 🎉
        </h1>
        <p className="text-muted-foreground mb-10 leading-relaxed">
          Your payment was successful. You now have <span className="text-amber-400 font-semibold">lifetime access</span> to all premium products on DevHuntr.
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/products">
            <Button className="w-full rounded-2xl h-12 text-base font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/25">
              <Crown className="mr-2 h-4 w-4" /> Explore Premium Products
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="w-full rounded-2xl h-12 border-white/10">
              Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
