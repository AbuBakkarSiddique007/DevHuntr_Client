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
    <div className="bg-card px-6 py-6 rounded-xl space-y-5 border border-border shadow-xs">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Check className="h-4.5 w-4.5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Categories</h3>
          <p className="text-xs text-muted-foreground">Select tags that best describe your product</p>
        </div>
      </div>

      {fetchingTags ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.id)}
              className={cn(
                "px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors",
                selectedTagIds.includes(tag.id)
                  ? "bg-primary border-primary text-primary-foreground shadow-xs"
                  : "bg-muted/50 border-border text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {tag.name}
            </button>
          ))}
        </div>
      )}
      {errors.tagIds && <p className="text-xs text-destructive mt-1 ml-1">{errors.tagIds.message}</p>}
    </div>
  );
}
