"use client";

import { ProductForm } from "@/components/forms/ProductForm";
import { Rocket, Sparkles } from "lucide-react";

export default function LaunchProductPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-widest mb-2">
          <Sparkles className="h-3 w-3" />
          <span>Showcase your creation</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">
          Launch your project
        </h1>

        <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Share your innovation with the community. Every great journey starts with a single launch.
        </p>
      </div>

      <div className="relative">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px] -z-10 animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px] -z-10 animate-pulse delay-700"></div>

        <ProductForm />
      </div>

      <div className="p-8 bg-white dark:bg-white/1 rounded-3xl text-center border border-slate-200 dark:border-white/5 space-y-4 shadow-sm dark:shadow-none">
        <h2 className="text-xl font-bold flex items-center justify-center gap-2 uppercase tracking-tight text-slate-900 dark:text-foreground">
          <Rocket className="h-5 w-5 text-purple-400" />
          Next Steps
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
          Your product will be reviewed by our moderators. Once accepted, it will appear on the global feed and can be voted by the community!
        </p>
      </div>
    </div>
  );
}
