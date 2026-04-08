"use client";

import Image from "next/image";
import Link from "next/link";
import { Ghost, Crown, ArrowUpRight, Lock } from "lucide-react";
import { Product, ProductTag } from "@/services/product/product.service";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  if (!product) return null;

  return (
    <Link
      href={`/products/${product.id || "#"}`}
      className={cn(
        "group relative rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 backdrop-blur-xl p-8 flex flex-col h-full shadow-[0_8px_30px_-10px_rgba(0,0,0,0.05)] dark:shadow-none hover:shadow-[0_20px_50px_-15px_rgba(168,85,247,0.15)] hover:border-purple-200 dark:hover:border-purple-500/30 transition-all duration-500 hover:scale-[1.01] overflow-hidden",
        className
      )}
    >
      {/* Dynamic Glow Background */}
      <div className="absolute top-0 right-0 -z-10 h-32 w-32 rounded-full bg-purple-500/5 dark:bg-yellow-500/5 blur-[50px] group-hover:bg-purple-500/10 dark:group-hover:bg-yellow-500/10 transition-colors"></div>

      {/* Header Implementation */}
      <div className="flex justify-between items-start mb-6">
        <div className="relative">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name || "Product"}
              width={64}
              height={64}
              className="h-16 w-16 rounded-2xl object-cover border border-slate-100 dark:border-white/10 group-hover:scale-105 transition-transform shadow-md"
            />
          ) : (
            <div className="h-16 w-16 rounded-2xl bg-linear-to-br from-[#d8d860]/20 to-[#d8d860]/10 flex items-center justify-center border border-slate-100 dark:border-white/10 group-hover:scale-105 transition-transform shadow-md">
              <Ghost className="h-8 w-8 text-[#d8d860]" />
            </div>
          )}

          {/* Featured Ribbon / Badge */}
          {product.isFeatured && (
            <div className="absolute -top-3 -left-3 bg-amber-400 dark:bg-amber-500 text-white p-1.5 rounded-xl shadow-lg border-2 border-white dark:border-slate-900 animate-bounce group-hover:animate-none">
              <Crown className="h-3.5 w-3.5" />
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-3">
          {/* Vote Panel */}
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors shadow-none dark:shadow-inner">
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-[#d8d860]">▲</span>
              <span className="text-sm font-black text-slate-900 dark:text-foreground tracking-tighter">
                {product.upvoteCount ?? 0}
              </span>
            </div>
            <div className="w-px h-3 bg-slate-300 dark:bg-white/20" />
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-rose-500 dark:text-red-400">▼</span>
              <span className="text-sm font-black text-slate-900 dark:text-foreground tracking-tighter">
                {product.downvoteCount ?? 0}
              </span>
            </div>
          </div>

          {/* Pricing Badge */}
          <div className={cn(
            "text-[10px] px-2.5 py-1 rounded-lg border font-black uppercase tracking-widest leading-none",
            product.pricingType === "PREMIUM"
              ? "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400"
              : "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400"
          )}>
            {product.pricingType || "FREE"}
          </div>
        </div>
      </div>

      {/* Body Implementation */}
      <div className="grow flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-xl md:text-2xl font-black tracking-tighter text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
            {product.name || "Untitled Product"}
          </h3>
          <ArrowUpRight className="h-5 w-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-purple-600 dark:text-purple-400 shrink-0" />
        </div>

        <p className="text-slate-600 dark:text-muted-foreground text-sm line-clamp-2 mb-6 grow leading-relaxed">
          {product.isLocked && !product.description ? (
            <span className="flex items-center gap-1.5 text-amber-500/70 italic">
              <Lock className="h-3 w-3" /> Description locked for Premium
            </span>
          ) : (
            product.description || "No description available."
          )}
        </p>


        {/* Footer Link */}
        <div className="pt-5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-black uppercase tracking-[0.15em]">
          <span className="text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform flex items-center gap-2">
            Explore Product <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>

      {/* Modern Card Accent */}
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-linear-to-r from-purple-500 to-indigo-500 group-hover:w-full transition-all duration-700"></div>
    </Link>
  );
}
