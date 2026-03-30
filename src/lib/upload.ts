import { toast } from "sonner";

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

export interface UploadResponse {
  url: string;
  delete_url: string;
}

export const uploadImage = async (file: File): Promise<string | null> => {
  // Validation: Type (JPG/PNG)
  const validTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!validTypes.includes(file.type)) {
    toast.error("Please upload a JPG or PNG image.");
    return null;
  }

  // Validation: Size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    toast.error("File size must be less than 5MB.");
    return null;
  }

  if (!IMGBB_API_KEY) {
    toast.error("ImgBB API Key is missing. Please check your environment variables.");
    return null;
  }

  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");

    const data = await res.json();
    return data.data.url;
  } catch (err) {
    console.error("Upload error:", err);
    toast.error("Failed to upload image. Please try again.");
    return null;
  }
};
