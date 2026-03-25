"use client";

import { useEffect, useState } from "react";
import { ProductService, Product } from "@/services/product/product.service";
import Link from "next/link";
import { Ghost, Star } from "lucide-react";

export function FeaturedGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await ProductService.getFeaturedProducts();

        const extractedData = res?.data?.data || res?.data || res;

        setProducts(Array.isArray(extractedData) ? extractedData : []);
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
      <section className="py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl glass h-[220px]" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-16 relative z-10">
      <div className="container mx-auto px-4">

        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
              <Star className="h-7 w-7 text-yellow-500 fill-yellow-500/20" />
              Featured Innovation
            </h2>
            <p className="text-muted-foreground">Handpicked excellence from our community.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group relative rounded-[2rem] border border-yellow-500/20 bg-background/50 p-6 flex flex-col h-full hover:shadow-2xl hover:shadow-yellow-500/10 hover:border-yellow-500/40 transition-all duration-500 overflow-hidden">

              <div className="absolute top-0 right-0 -z-10 h-32 w-32 rounded-full bg-yellow-500/5 blur-[50px] group-hover:bg-yellow-500/10 transition-colors"></div>

              <div className="flex justify-between items-start mb-6">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="h-16 w-16 rounded-2xl object-cover border border-white/10 group-hover:scale-105 transition-transform shadow-lg" />
                ) : (
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform shadow-lg">
                    <Ghost className="h-8 w-8 text-yellow-500" />
                  </div>
                )}

                <div className="flex flex-col items-center bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-3 py-1.5">
                  <span className="text-[10px] font-bold text-yellow-500">FEATURED</span>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-500 transition-colors line-clamp-1">{product.name}</h3>
              <p className="text-muted-foreground text-sm line-clamp-2 mt-auto">
                {product.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
