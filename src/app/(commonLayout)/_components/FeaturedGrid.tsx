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
      <section className="py-24 relative z-10 text-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-[320px]" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 relative z-10 text-foreground">
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-col items-center mb-16 gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Star className="h-3.5 w-3.5 fill-current" /> Curated Picks
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Featured Excellence</h2>
          <p className="text-muted-foreground text-base max-w-2xl">Handpicked creative tools and resources for modern developers.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}

          {products.length === 0 && (
            <div className="col-span-full py-16 text-center text-muted-foreground border border-dashed border-border rounded-2xl bg-muted/30">
              <div className="flex flex-col items-center gap-3">
                <Star className="h-10 w-10 text-muted-foreground/30" />
                <p className="font-semibold text-foreground">No featured products at the moment.</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Handpicking quality daily</p>
              </div>
            </div>
          )}
        </div>

        {products.length > 0 && (
          <div className="mt-12 flex justify-center">
             <Link href="/featured">
                <Button size="lg" variant="outline" className="rounded-xl border-border hover:bg-muted font-semibold px-6 h-11 group transition-colors shadow-xs">
                   Explore All Featured <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Button>
             </Link>
          </div>
        )}
      </div>
    </section>
  );
}
