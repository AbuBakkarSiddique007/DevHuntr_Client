"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ProductService } from "@/services/product/product.service";
import { Rocket, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { productSchema, ProductFormValues } from "./product/types";
import { FormBasics } from "./product/FormBasics";
import { FormCategories } from "./product/FormCategories";
import { FormPricing } from "./product/FormPricing";

export function ProductForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      tagIds: [],
      pricingType: "FREE",
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    setLoading(true);
    try {
      await ProductService.createProduct(data);
      toast.success("Product launched successfully!");
      router.push("/user-dashboard/my-products");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to launch product";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <FormBasics />
        
        <FormCategories />
        
        <FormPricing />

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={loading}
            size="lg"
            className="w-full sm:w-auto rounded-lg px-8 h-11 text-sm font-semibold"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Rocket className="mr-2 h-4 w-4" />
            )}
            {loading ? "Launching..." : "Launch Product"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
