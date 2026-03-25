"use client";

import { useEffect, useState } from "react";
import { ProductService, Product, ProductTag } from "@/services/product/product.service";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Ghost, MessageSquare, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProductDetailClient({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await ProductService.getProductById(id);
        setProduct(res.data || res);
      } catch (err) {
        console.error("Failed to load product details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 animate-pulse">
        <div className="h-10 w-32 bg-white/5 rounded-full mb-8"></div>
        <div className="glass h-[400px] w-full rounded-3xl"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center min-h-[calc(100vh-100px)] flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
        <Link href="/products">
          <Button variant="outline" className="rounded-full glass mt-4">Back to Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 min-h-[calc(100vh-100px)]">


      <div className="relative overflow-hidden rounded-[2rem] glass p-8 md:p-12 mb-12 shadow-2xl shadow-purple-500/10 border border-border/50 group">
        <div className="absolute top-0 right-0 -z-10 h-[300px] w-[300px] rounded-full bg-indigo-500/10 blur-[100px] group-hover:bg-purple-500/20 transition-colors duration-700"></div>

        <Link href="/products" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8 bg-black/20 px-4 py-2 rounded-full border border-white/5 backdrop-blur-md">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Explore
        </Link>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">

          <div className="shrink-0">
            {product.image ? (
              <img src={product.image} alt={product.name} className="h-32 w-32 md:h-48 md:w-48 rounded-3xl object-cover shadow-2xl border border-white/10" />
            ) : (
              <div className="h-32 w-32 md:h-48 md:w-48 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 shadow-2xl">
                <Ghost className="h-16 w-16 text-purple-400" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-3">
                <a href={product.externalLink || "#"} target="_blank" rel="noreferrer">
                  <Button className="rounded-full border-white/20 hover:bg-neutral-200 shadow-md">
                    Visit App <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap pb-4 border-b border-border/40">
              {product.tags && product.tags.map((tagObj: ProductTag) => (
                <span key={tagObj.id} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-muted-foreground">
                  #{tagObj.tag.name}
                </span>
              ))}
            </div>

            <h2 className="text-xl font-semibold opacity-90">About this product</h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="glass p-8 rounded-[2rem]">
            <h3 className="text-2xl font-bold flex items-center mb-6">
              <MessageSquare className="mr-3 h-6 w-6 text-purple-400" />
              Discussion
            </h3>
            <p className="text-muted-foreground">
              (Comments component will be integrated in Part 4)
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass p-6 rounded-3xl text-center space-y-4 shadow-xl border-purple-500/20">
            <h4 className="font-semibold text-muted-foreground uppercase tracking-widest text-xs">Net Votes</h4>
            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
              {product.upvoteCount - product.downvoteCount}
            </div>
            <p className="text-sm text-muted-foreground pb-4">(Voting component integrated in Part 4)</p>
          </div>

          <div className="glass p-4 rounded-3xl flex items-center justify-between group cursor-pointer hover:bg-destructive/10 hover:border-destructive/30 border border-transparent transition-all">
            <span className="text-sm font-medium text-muted-foreground group-hover:text-destructive transition-colors">Report an issue</span>
            <ShieldAlert className="h-4 w-4 text-muted-foreground group-hover:text-destructive transition-colors" />
          </div>
        </div>
      </div>

    </div>
  );
}
