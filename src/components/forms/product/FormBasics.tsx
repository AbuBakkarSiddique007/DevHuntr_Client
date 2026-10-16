"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Ghost } from "lucide-react";
import { ProductFormValues } from "./types";
import { ImageUpload } from "./ImageUpload";

export function FormBasics() {
  const { register, formState: { errors } } = useFormContext<ProductFormValues>();

  return (
    <div className="bg-card px-6 py-6 rounded-xl space-y-6 border border-border shadow-xs">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Ghost className="h-4.5 w-4.5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Basic Information</h3>
          <p className="text-xs text-muted-foreground">Essential details about what you built</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-5 flex flex-col justify-center">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Product Name</label>
            <Input
              {...register("name")}
              placeholder="e.g. NextGen SaaS Platform"
              className="rounded-lg border-border bg-background h-10"
            />
            {errors.name && <p className="text-xs text-destructive ml-1">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Launch URL / External Link</label>
            <Input
              {...register("externalLink")}
              placeholder="https://yourproduct.com/launch"
              className="rounded-lg border-border bg-background h-10"
            />
            {errors.externalLink && <p className="text-xs text-destructive ml-1">{errors.externalLink.message}</p>}
          </div>
        </div>

        <div className="flex flex-col justify-end">
          <ImageUpload />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Short Description</label>
        <Textarea
          {...register("description")}
          placeholder="What does your product do? (minimum 10 characters)"
          className="rounded-lg border-border bg-background min-h-[120px] resize-none"
        />
        {errors.description && <p className="text-xs text-destructive ml-1">{errors.description.message}</p>}
      </div>
    </div>
  );
}
