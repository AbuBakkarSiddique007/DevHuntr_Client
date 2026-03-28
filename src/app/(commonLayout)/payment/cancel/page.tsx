"use client";

import Link from "next/link";
import { XCircle, ArrowLeft, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none -z-10">
        <div className="h-[600px] w-[600px] rounded-full bg-red-500/5 blur-[120px]" />
      </div>

      <div className="w-full max-w-md text-center animate-in fade-in zoom-in-95 duration-500">

        <div className="mx-auto mb-8 h-24 w-24 rounded-3xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
          <XCircle className="h-12 w-12 text-red-400" />
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight mb-4">
          Payment Cancelled
        </h1>
        <p className="text-muted-foreground mb-10 leading-relaxed">
          No worries — your payment was cancelled and you haven&apos;t been charged. You can subscribe whenever you&apos;re ready.
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/products">
            <Button className="w-full rounded-2xl h-12 text-base font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/25">
              <Crown className="mr-2 h-4 w-4" /> Try Again
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" className="w-full rounded-2xl h-12 border-white/10">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
