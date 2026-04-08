"use client";

import { useEffect, useState } from "react";
import { ProductService, Product } from "@/services/product/product.service";
import { ProductCard } from "@/components/shared/ProductCard";
import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FeaturedGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await ProductService.getFeaturedProducts({ limit: 4 });
        const productsData = response.products;
        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (err) {
        console.error("Failed to fetch featured products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <section className="py-24 relative z-10 text-slate-900 dark:text-foreground">
        <div className="container mx-auto px-4">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse rounded-[2.5rem] bg-slate-100 dark:bg-white/5 h-[320px]" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 relative z-10 text-slate-900 dark:text-foreground">
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-col items-center mb-16 gap-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-widest">
            <Star className="h-3.5 w-3.5 fill-current" /> Curated Picks
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">Featured Excellence</h2>
          <p className="text-slate-500 dark:text-muted-foreground text-lg max-w-2xl">Handpicked creative tools and resources for modern developers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}

          {products.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground border border-dashed border-slate-200 dark:border-white/10 rounded-[2.5rem] bg-slate-50/50 dark:bg-white/2">
              <div className="flex flex-col items-center gap-3">
                <Star className="h-12 w-12 text-slate-300 dark:text-white/10" />
                <p className="font-bold">No featured products at the moment.</p>
                <p className="text-sm opacity-60 uppercase tracking-widest">Handpicking quality daily</p>
              </div>
            </div>
          )}
        </div>

        {products.length > 0 && (
          <div className="mt-16 flex justify-center">
             <Link href="/featured">
                <Button size="lg" variant="outline" className="rounded-full border-slate-200 dark:border-purple-500/30 hover:bg-slate-50 dark:hover:bg-purple-500/10 text-slate-900 dark:text-purple-400 font-bold px-8 h-14 group transition-all hover:scale-105 shadow-lg shadow-black/5 dark:shadow-purple-500/5">
                   Explore All Excellence <ArrowUpRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
             </Link>
          </div>
        )}
      </div>
    </section>
  );
}
