"use client";

import { useEffect, useState } from "react";
import { ProductService, Product } from "@/services/product/product.service";
import Link from "next/link";
import Image from "next/image";
import { Ghost, Star } from "lucide-react";

export function FeaturedGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await ProductService.getFeaturedProducts();
        const productsData = response?.data?.products || [];
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

        <div className="flex flex-col items-center text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
            
            Featured Innovation
          </h2>
          <p className="text-muted-foreground">Handpicked excellence from our community.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group relative rounded-[2rem] border border-yellow-500/20 bg-background/50 p-6 flex flex-col h-full hover:shadow-2xl hover:shadow-yellow-500/10 hover:border-yellow-500/40 transition-all duration-500 overflow-hidden">

              <div className="absolute top-0 right-0 -z-10 h-32 w-32 rounded-full bg-yellow-500/5 blur-[50px] group-hover:bg-yellow-500/10 transition-colors"></div>

              <div className="flex justify-between items-start mb-6">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-2xl object-cover border border-white/10 group-hover:scale-105 transition-transform shadow-lg"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-2xl bg-linear-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform shadow-lg">
                    <Ghost className="h-8 w-8 text-yellow-500" />
                  </div>
                )}

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 hover:bg-white/10 transition-colors shadow-inner h-fit">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold text-green-400">▲</span>
                      <span className="text-sm font-bold text-foreground">{product.upvoteCount}</span>
                    </div>
                    <div className="w-px h-3 bg-white/20" />
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold text-red-400">▼</span>
                      <span className="text-sm font-bold text-foreground">{product.downvoteCount}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-3 py-1.5 h-fit">
                    <span className="text-[10px] font-bold text-yellow-500">FEATURED</span>
                  </div>
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
