"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Ghost } from "lucide-react";
import { ProductFormValues } from "./types";

export function FormBasics() {
  const { register, formState: { errors } } = useFormContext<ProductFormValues>();

  return (
    <div className="bg-white/1 px-4 lg:px-8 py-8 rounded-3xl space-y-6 border border-white/5">
      <div className="flex items-center gap-4 mb-2">
        <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
          <Ghost className="h-5 w-5 text-purple-400" />
        </div>
        <h3 className="text-xl font-bold uppercase tracking-tight text-foreground">The Basics</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Product Name</label>
          <Input
            {...register("name")}
            placeholder="e.g. NextGen SaaS Platform"
            className="rounded-2xl border-white/10 bg-white/5 h-12 focus:ring-purple-500/50"
          />
          {errors.name && <p className="text-xs text-destructive ml-1">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Thumbnail URL</label>
          <Input
            {...register("image")}
            placeholder="https://i.ibb.co/product-mockup.png"
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
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Launch URL / External Link</label>
        <Input
          {...register("externalLink")}
          placeholder="https://yourproduct.com/launch"
          className="rounded-2xl border-white/10 bg-white/5 h-12"
        />
        {errors.externalLink && <p className="text-xs text-destructive ml-1">{errors.externalLink.message}</p>}
      </div>
    </div>
  );
}
