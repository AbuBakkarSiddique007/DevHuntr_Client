"use client";

import Link from "next/link";
import { XCircle, ArrowLeft, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center p-4 bg-background">
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none -z-10">
        <div className="h-[500px] w-[500px] rounded-full bg-destructive/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-md text-center p-8 rounded-2xl bg-card border border-border shadow-lg animate-in fade-in zoom-in-95 duration-300">
        <div className="mx-auto mb-6 h-20 w-20 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
          <XCircle className="h-10 w-10 text-destructive" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-foreground">
          Payment Cancelled
        </h1>
        <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
          No charges were made. You can unlock premium tools anytime when you are ready.
        </p>

        <div className="flex flex-col gap-2.5">
          <Link href="/products">
            <Button className="w-full rounded-xl h-11 text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-black shadow-md shadow-amber-500/20">
              <Crown className="mr-2 h-4 w-4" /> Try Again
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" className="w-full rounded-xl h-11 border-border font-medium text-sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
