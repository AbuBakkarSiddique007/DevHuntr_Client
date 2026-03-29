"use client"

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Loader2, Check } from "lucide-react";
import { Tag, TagService } from "@/services/tag/tag.service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ProductFormValues } from "./types";

export function FormCategories() {
  const { setValue, watch, formState: { errors } } = useFormContext<ProductFormValues>();
  const [tags, setTags] = useState<Tag[]>([]);
  const [fetchingTags, setFetchingTags] = useState(true);

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

  return (
    <div className="bg-white/1 px-4 lg:px-8 py-8 rounded-3xl space-y-6 border border-white/5">
      <div className="flex items-center gap-4 mb-2">
        <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
          <Check className="h-5 w-5 text-indigo-400" />
        </div>
        <h3 className="text-xl font-bold uppercase tracking-tight text-foreground">Categories</h3>
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
  );
}
