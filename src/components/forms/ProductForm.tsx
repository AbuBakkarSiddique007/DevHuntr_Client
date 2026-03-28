"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tag, TagService } from "@/services/tag/tag.service";
import { ProductService } from "@/services/product/product.service";
import { Rocket, Loader2, Check, Ghost, Crown, Zap } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  image: z.string().url("Please enter a valid image URL"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  externalLink: z.string().url("Please enter a valid product link"),
  tagIds: z.array(z.string()).min(1, "Please select at least one tag"),
  pricingType: z.enum(["FREE", "PREMIUM"]).default("FREE"),
});


type ProductFormValues = z.infer<typeof productSchema>;

export function ProductForm() {
  const router = useRouter();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingTags, setFetchingTags] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      tagIds: [],
      pricingType: "FREE",
    },
  });

  const selectedTagIds = watch("tagIds");
  const pricingType = watch("pricingType");

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await TagService.getTags();
        setTags(data);
      } catch (err) {
        console.error("Failed to fetch tags", err);
        toast.error("Failed to load categories");
      } finally {
        setFetchingTags(false);
      }
    };
    fetchTags();
  }, []);

  const toggleTag = (tagId: string) => {
    const current = [...selectedTagIds];
    const index = current.indexOf(tagId);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(tagId);
    }
    setValue("tagIds", current, { shouldValidate: true });
  };

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      <div className="bg-white/1 px-4 lg:px-8 py-8 rounded-3xl space-y-6 border border-white/5">
        <div className="flex items-center gap-4 mb-2">
          <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Ghost className="h-5 w-5 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold uppercase tracking-tight">The Basics</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Product Name</label>
            <Input
              {...register("name")}
              placeholder="e.g. Acme Dashboard"
              className="rounded-2xl border-white/10 bg-white/5 h-12 focus:ring-purple-500/50"
            />
            {errors.name && <p className="text-xs text-destructive ml-1">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Thumbnail URL</label>
            <Input
              {...register("image")}
              placeholder="https://example.com/logo.png"
              className="rounded-2xl border-white/10 bg-white/5 h-12"
            />
            {errors.image && <p className="text-xs text-destructive ml-1">{errors.image.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Short Description</label>
          <Textarea
            {...register("description")}
            placeholder="What does your product do? (min 10 chars)"
            className="rounded-2xl border-white/10 bg-white/5 min-h-[120px] resize-none"
          />
          {errors.description && <p className="text-xs text-destructive ml-1">{errors.description.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Launch URL/External Link</label>
          <Input
            {...register("externalLink")}
            placeholder="https://yourapp.com"
            className="rounded-2xl border-white/10 bg-white/5 h-12"
          />
          {errors.externalLink && <p className="text-xs text-destructive ml-1">{errors.externalLink.message}</p>}
        </div>
      </div>

      <div className="bg-white/1 px-4 lg:px-8 py-8 rounded-3xl space-y-6 border border-white/5">
        <div className="flex items-center gap-4 mb-2">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
            <Check className="h-5 w-5 text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold uppercase tracking-tight">Categories</h3>
        </div>

        <p className="text-sm text-muted-foreground">Select at least one tag that best describes your product.</p>

        {fetchingTags ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={cn(
                  "px-4 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all duration-300",
                  selectedTagIds.includes(tag.id)
                    ? "bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/30"
                    : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:border-white/20"
                )}
              >
                {tag.name}
              </button>
            ))}
          </div>
        )}
        {errors.tagIds && <p className="text-xs text-destructive mt-2 ml-1">{errors.tagIds.message}</p>}
      </div>

      {/* Pricing Type Section */}
      <div className="bg-white/1 px-4 lg:px-8 py-8 rounded-3xl space-y-6 border border-white/5">
        <div className="flex items-center gap-4 mb-2">
          <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <Crown className="h-5 w-5 text-amber-400" />
          </div>
          <h3 className="text-xl font-bold uppercase tracking-tight">Pricing Type</h3>
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

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="rounded-2xl px-10 h-14 bg-linear-to-r from-purple-600 to-pink-600 hover:opacity-90 shadow-2xl shadow-purple-500/30 border-none text-lg font-bold group"
        >
          {loading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Rocket className="mr-2 h-5 w-5 group-hover:animate-bounce" />
          )}
          {loading ? "Launching..." : "Launch Product"}
        </Button>
      </div>
    </form>
  );
}
