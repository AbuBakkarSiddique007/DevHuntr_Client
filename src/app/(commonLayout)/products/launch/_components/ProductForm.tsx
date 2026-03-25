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
import { Rocket, Loader2, Check, Ghost } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  image: z.string().url("Please enter a valid image URL"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  externalLink: z.string().url("Please enter a valid product link"),
  tagIds: z.array(z.string()).min(1, "Please select at least one tag"),
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
    },
  });

  const selectedTagIds = watch("tagIds");

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
      router.push("/products");
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to launch product";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      <div className="glass p-8 rounded-[2rem] space-y-6 border-white/10">
        <div className="flex items-center gap-4 mb-2">
          <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Ghost className="h-5 w-5 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold">The Basics</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground ml-1">Product Name</label>
            <Input
              {...register("name")}
              placeholder="e.g. Acme Dashboard"
              className="rounded-2xl glass border-white/10 h-12 focus:ring-purple-500/50"
            />
            {errors.name && <p className="text-xs text-destructive ml-1">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground ml-1">Thumbnail URL</label>
            <Input
              {...register("image")}
              placeholder="https://example.com/logo.png"
              className="rounded-2xl glass border-white/10 h-12"
            />
            {errors.image && <p className="text-xs text-destructive ml-1">{errors.image.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground ml-1">Short Description</label>
          <Textarea
            {...register("description")}
            placeholder="What does your product do? (min 10 chars)"
            className="rounded-2xl glass border-white/10 min-h-[120px] resize-none"
          />
          {errors.description && <p className="text-xs text-destructive ml-1">{errors.description.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground ml-1">Launch URL/External Link</label>
          <Input
            {...register("externalLink")}
            placeholder="https://yourapp.com"
            className="rounded-2xl glass border-white/10 h-12"
          />
          {errors.externalLink && <p className="text-xs text-destructive ml-1">{errors.externalLink.message}</p>}
        </div>
      </div>

      <div className="glass p-8 rounded-[2rem] space-y-6 border-white/10">
        <div className="flex items-center gap-4 mb-2">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
            <Check className="h-5 w-5 text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold">Categories</h3>
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
                  "px-4 py-2 rounded-full border text-sm font-medium transition-all duration-300",
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

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="rounded-full px-8 h-14 bg-linear-to-r from-purple-600 to-pink-600 hover:opacity-90 shadow-2xl shadow-purple-500/30 border-none text-lg font-bold group"
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
