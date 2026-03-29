import * as z from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  image: z.string().url("Please enter a valid image URL"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  externalLink: z.string().url("Please enter a valid product link"),
  tagIds: z.array(z.string()).min(1, "Please select at least one tag"),
  pricingType: z.enum(["FREE", "PREMIUM"]).default("FREE"),
});

export type ProductFormValues = z.infer<typeof productSchema>;
