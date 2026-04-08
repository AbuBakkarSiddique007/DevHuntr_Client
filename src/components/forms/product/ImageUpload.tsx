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
    <div className="space-y-4">
      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Product Thumbnail</label>
      
      <div 
        className={cn(
          "relative group cursor-pointer rounded-3xl border-2 border-dashed transition-all duration-300 min-h-[200px] flex flex-col items-center justify-center overflow-hidden",
          imageUrl 
            ? "border-purple-500/30 bg-purple-500/5" 
            : "border-white/10 bg-white/5 hover:border-purple-500/50 hover:bg-purple-500/5",
          errors.image && "border-red-500/50 bg-red-500/5"
        )}
        onClick={() => !imageUrl && !isUploading && fileInputRef.current?.click()}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-3 animate-in fade-in">
            <Loader2 className="h-10 w-10 animate-spin text-purple-400" />
            <p className="text-sm font-medium text-purple-300">Uploading to ImgBB...</p>
          </div>
        ) : imageUrl ? (
          <div className="relative w-full aspect-video sm:aspect-auto sm:h-48 animate-in zoom-in-95">
            <Image 
              src={imageUrl} 
              alt="Preview" 
              fill 
              sizes="(max-width: 640px) 100vw, 400px"
              className="object-contain p-4"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeImage();
              }}
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-red-500/80 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg backdrop-blur-md"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 p-8 text-center animate-in slide-in-from-bottom-2">
            <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Upload className="h-8 w-8 text-muted-foreground group-hover:text-purple-400" />
            </div>
            <div>
              <p className="text-base font-bold text-foreground">Click to upload image</p>
              <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest">JPG, PNG (Max 5MB)</p>
            </div>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/jpg"
          className="hidden"
        />
      </div>

      {errors.image && (
        <p className="text-xs text-red-400 font-medium ml-1">
          {errors.image.message}
        </p>
      )}
    </div>
  );
}
