"use client"

import { useFormContext } from "react-hook-form";
import { Check, Crown, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductFormValues } from "./types";

export function FormPricing() {
  const { setValue, watch } = useFormContext<ProductFormValues>();
  const pricingType = watch("pricingType");

  return (
    <div className="bg-white/1 px-4 lg:px-8 py-8 rounded-3xl space-y-6 border border-white/5">
      <div className="flex items-center gap-4 mb-2">
        <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
          <Crown className="h-5 w-5 text-amber-400" />
        </div>
        <h3 className="text-xl font-bold uppercase tracking-tight text-foreground">Pricing Type</h3>
      </div>

      <p className="text-sm text-muted-foreground">
        Choose who can access the full details of this product.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* FREE option */}
        <button
          type="button"
          onClick={() => setValue("pricingType", "FREE", { shouldValidate: true })}
          className={cn(
            "relative flex flex-col items-start gap-2 p-5 rounded-2xl border-2 text-left transition-all duration-200",
            pricingType === "FREE"
              ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10"
              : "border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/20"
          )}
        >
          <div className="flex items-center gap-2">
            <Zap className={cn("h-5 w-5", pricingType === "FREE" ? "text-indigo-400" : "text-muted-foreground")} />
            <span className={cn("font-bold text-base", pricingType === "FREE" ? "text-indigo-300" : "text-foreground")}>
              Free
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Anyone can view the full product details — no subscription required.
          </p>
          {pricingType === "FREE" && (
            <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-indigo-500 flex items-center justify-center">
              <Check className="h-3 w-3 text-white" />
            </div>
          )}
        </button>

        {/* PREMIUM option */}
        <button
          type="button"
          onClick={() => setValue("pricingType", "PREMIUM", { shouldValidate: true })}
          className={cn(
            "relative flex flex-col items-start gap-2 p-5 rounded-2xl border-2 text-left transition-all duration-200",
            pricingType === "PREMIUM"
              ? "border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10"
              : "border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/20"
          )}
        >
          <div className="flex items-center gap-2">
            <Crown className={cn("h-5 w-5", pricingType === "PREMIUM" ? "text-amber-400" : "text-muted-foreground")} />
            <span className={cn("font-bold text-base", pricingType === "PREMIUM" ? "text-amber-300" : "text-foreground")}>
              Premium
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Only subscribed members ($50 lifetime) can view full details.
          </p>
          {pricingType === "PREMIUM" && (
            <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-amber-500 flex items-center justify-center">
              <Check className="h-3 w-3 text-black" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
