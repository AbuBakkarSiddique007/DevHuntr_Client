"use client";

import { Send, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-background border-t border-border">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle at center, var(--primary) 0%, transparent 70%)" }}
        />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto p-6 sm:p-10 md:p-14 rounded-2xl bg-card border border-border text-center relative overflow-hidden shadow-xs">
          <div className="relative z-10 flex flex-col items-center gap-5">
            <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm">
              <Zap className="h-6 w-6 fill-current" />
            </div>

            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
              The Maker&apos;s Weekly
            </h2>
            <p className="text-muted-foreground text-base max-w-xl leading-relaxed">
              Don&apos;t miss out on emerging launches. Join{" "}
              <span className="text-foreground font-semibold">5,000+ indie makers</span>{" "}
              who get the best curated developer tools delivered weekly.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="w-full max-w-md mt-4 flex flex-col sm:flex-row gap-2.5 p-1.5 rounded-2xl bg-muted/50 border border-border focus-within:border-primary/50 transition-colors"
            >
              <div className="grow relative">
                <Input
                  type="email"
                  aria-label="Email address for newsletter"
                  placeholder="name@example.com"
                  className="rounded-xl border-none bg-transparent h-11 pl-4 text-foreground placeholder:text-muted-foreground focus-visible:ring-0 text-sm"
                  required
                />
              </div>
              <Button
                type="submit"
                className="rounded-xl h-11 px-6 bg-primary text-primary-foreground hover:opacity-90 font-semibold text-xs tracking-wider uppercase group/btn shrink-0"
              >
                Subscribe{" "}
                <Send className="ml-1.5 h-3.5 w-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </Button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>No Spam</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>Curated Top Picks</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                <span>Unsubscribe Anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
