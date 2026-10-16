"use client";

import { ProductForm } from "@/components/forms/ProductForm";
import { Rocket, Sparkles } from "lucide-react";

export default function LaunchProductPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in duration-300">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Showcase your creation</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Launch Your Product
        </h1>

        <p className="text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed">
          Share your innovation with the maker community. High quality submissions are reviewed and featured globally.
        </p>
      </div>

      <div className="relative">
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-indigo-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <ProductForm />
      </div>

      <div className="p-6 bg-card rounded-2xl text-center border border-border space-y-2 shadow-xs">
        <h2 className="text-base font-bold flex items-center justify-center gap-2 text-foreground">
          <Rocket className="h-4 w-4 text-primary" />
          What happens next?
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto text-xs leading-relaxed">
          Your product will be reviewed by our moderation team. Once approved, it appears in the explore feed and community members can upvote and discuss it.
        </p>
      </div>
    </div>
  );
}
