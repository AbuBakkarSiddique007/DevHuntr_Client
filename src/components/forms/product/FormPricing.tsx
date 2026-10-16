"use client"

import { useFormContext } from "react-hook-form";
import { Check, Crown, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductFormValues } from "./types";

export function FormPricing() {
  const { setValue, watch } = useFormContext<ProductFormValues>();
  const pricingType = watch("pricingType");

  return (
    <div className="bg-card px-6 py-6 rounded-xl space-y-5 border border-border shadow-xs">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <Crown className="h-4.5 w-4.5 text-amber-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Pricing Model</h3>
          <p className="text-xs text-muted-foreground">Choose who can access the full details of this product</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setValue("pricingType", "FREE", { shouldValidate: true })}
          className={cn(
            "relative flex flex-col items-start gap-1.5 p-4 rounded-xl border-2 text-left transition-colors",
            pricingType === "FREE"
              ? "border-primary bg-primary/5 shadow-xs"
              : "border-border bg-card hover:bg-muted/40"
          )}
        >
          <div className="flex items-center gap-2">
            <Zap className={cn("h-4.5 w-4.5", pricingType === "FREE" ? "text-primary" : "text-muted-foreground")} />
            <span className={cn("font-bold text-sm", pricingType === "FREE" ? "text-primary" : "text-foreground")}>
              Free
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Anyone can view the full product details without a subscription.
          </p>
          {pricingType === "FREE" && (
            <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
              <Check className="h-3 w-3 text-primary-foreground" />
            </div>
          )}
        </button>

        <button
          type="button"
          onClick={() => setValue("pricingType", "PREMIUM", { shouldValidate: true })}
          className={cn(
            "relative flex flex-col items-start gap-1.5 p-4 rounded-xl border-2 text-left transition-colors",
            pricingType === "PREMIUM"
              ? "border-amber-500 bg-amber-500/5 shadow-xs"
              : "border-border bg-card hover:bg-muted/40"
          )}
        >
          <div className="flex items-center gap-2">
            <Crown className={cn("h-4.5 w-4.5", pricingType === "PREMIUM" ? "text-amber-500" : "text-muted-foreground")} />
            <span className={cn("font-bold text-sm", pricingType === "PREMIUM" ? "text-amber-500" : "text-foreground")}>
              Premium
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Only subscribed members ($50 lifetime) can view full details.
          </p>
          {pricingType === "PREMIUM" && (
            <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-amber-500 flex items-center justify-center">
              <Check className="h-3 w-3 text-white" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
