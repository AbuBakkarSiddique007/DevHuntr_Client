"use client";

import Image from "next/image";
import Link from "next/link";
import { Ghost, Crown, ArrowUpRight, Lock } from "lucide-react";
import { Product } from "@/services/product/product.service";
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
        "group relative rounded-2xl border border-border bg-card text-card-foreground p-6 flex flex-col h-full shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden",
        className
      )}
    >
      <div className="absolute top-0 right-0 -z-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors pointer-events-none" />

      <div className="flex justify-between items-start mb-5">
        <div className="relative">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name || "Product"}
              width={56}
              height={56}
              className="h-14 w-14 rounded-xl object-cover border border-border group-hover:scale-105 transition-transform shadow-sm"
            />
          ) : (
            <div className="h-14 w-14 rounded-xl bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-border group-hover:scale-105 transition-transform shadow-sm">
              <Ghost className="h-7 w-7 text-primary" />
            </div>
          )}

          {product.isFeatured && (
            <div
              className="absolute -top-2.5 -left-2.5 bg-amber-500 text-white p-1.5 rounded-lg shadow-md shadow-amber-500/25 border-2 border-card"
              title="Featured Product"
            >
              <Crown className="h-3 w-3" />
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2.5">
          <div className="flex items-center gap-2.5 bg-muted/60 border border-border rounded-lg px-2.5 py-1.5 transition-colors">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">▲</span>
              <span className="text-xs font-bold text-foreground">
                {product.upvoteCount ?? 0}
              </span>
            </div>
            <div className="w-px h-3 bg-border" />
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-rose-500 dark:text-red-400">▼</span>
              <span className="text-xs font-bold text-foreground">
                {product.downvoteCount ?? 0}
              </span>
            </div>
          </div>

          <div
            className={cn(
              "text-xs px-2.5 py-0.5 rounded-full border font-semibold uppercase tracking-wider leading-none",
              product.pricingType === "PREMIUM"
                ? "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
            )}
          >
            {product.pricingType || "FREE"}
          </div>
        </div>
      </div>

      <div className="grow flex flex-col">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {product.name || "Untitled Product"}
          </h3>
          <ArrowUpRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary shrink-0" />
        </div>

        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 grow leading-relaxed">
          {product.isLocked && !product.description ? (
            <span className="flex items-center gap-1.5 text-amber-500/80 italic text-xs">
              <Lock className="h-3 w-3" /> Description locked for Premium
            </span>
          ) : (
            product.description || "No description available."
          )}
        </p>

        <div className="pt-3 border-t border-border flex items-center justify-between text-xs font-semibold">
          <span className="text-primary group-hover:translate-x-1 transition-transform flex items-center gap-1.5">
            Explore Product <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-500" />
    </Link>
  );
}
