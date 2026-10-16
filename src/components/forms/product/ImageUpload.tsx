"use client";

import { useState, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductFormValues } from "./types";
import Image from "next/image";
import { uploadImage } from "@/lib/upload";

export function ImageUpload() {
  const { setValue, watch, formState: { errors } } = useFormContext<ProductFormValues>();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const imageUrl = watch("image");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const uploadedUrl = await uploadImage(file);
    if (uploadedUrl) {
      setValue("image", uploadedUrl, { shouldValidate: true });
    }
    setIsUploading(false);
  };

  const removeImage = () => {
    setValue("image", "", { shouldValidate: true });
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Product Thumbnail</label>
      
      <div 
        className={cn(
          "relative group cursor-pointer rounded-xl border-2 border-dashed transition-colors min-h-[190px] flex flex-col items-center justify-center overflow-hidden",
          imageUrl 
            ? "border-primary/30 bg-primary/5" 
            : "border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/40",
          errors.image && "border-destructive/50 bg-destructive/5"
        )}
        onClick={() => !imageUrl && !isUploading && fileInputRef.current?.click()}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-2 animate-in fade-in">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-xs font-medium text-muted-foreground">Uploading image...</p>
          </div>
        ) : imageUrl ? (
          <div className="relative w-full aspect-video sm:aspect-auto sm:h-44 animate-in zoom-in-95">
            <Image 
              src={imageUrl} 
              alt="Preview" 
              fill 
              sizes="(max-width: 640px) 100vw, 400px"
              className="object-contain p-2"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeImage();
              }}
              className="absolute top-3 right-3 h-8 w-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/90 transition-colors shadow-sm"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 p-6 text-center animate-in slide-in-from-bottom-2">
            <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Click to upload thumbnail</p>
              <p className="text-xs text-muted-foreground mt-0.5">JPG, PNG, WebP (Max 5MB)</p>
            </div>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/jpg, image/webp"
          className="hidden"
        />
      </div>

      {errors.image && (
        <p className="text-xs text-destructive font-medium ml-1">
          {errors.image.message}
        </p>
      )}
    </div>
  );
}
