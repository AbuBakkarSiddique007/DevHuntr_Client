"use client";

import { Rocket, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FinalCTASection() {
  return (
    <section className="py-24 relative overflow-hidden bg-card/30 border-t border-border">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full h-full opacity-15 pointer-events-none"
          style={{ background: "radial-gradient(circle at 10% 10%, var(--primary) 0%, transparent 50%)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-full h-full opacity-15 pointer-events-none"
          style={{ background: "radial-gradient(circle at 90% 90%, var(--primary) 0%, transparent 50%)" }}
        />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="relative mb-8">
            <div className="h-16 w-16 rounded-2xl bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Rocket className="h-8 w-8 text-white" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 h-5 w-5 text-amber-500" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground mb-6 leading-tight">
            Your next big launch{" "}
            <span className="bg-linear-to-r from-purple-500 via-indigo-500 to-pink-500 bg-clip-text text-transparent">
              starts here.
            </span>
          </h2>

          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mb-10 leading-relaxed">
            Join thousands of developers, indie hackers, and founders shipping tomorrow&apos;s breakthrough software.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto justify-center">
            <Link href="/user-dashboard/launch" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto h-12 px-8 rounded-full bg-linear-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-semibold shadow-lg shadow-purple-500/25 border-none transition-all hover:-translate-y-0.5 group"
              >
                Submit Your Project{" "}
                <Rocket className="ml-2 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Button>
            </Link>

            <Link href="/products" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-12 px-8 rounded-full border-border bg-background hover:bg-muted text-foreground font-semibold transition-all group"
              >
                Browse Products{" "}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
