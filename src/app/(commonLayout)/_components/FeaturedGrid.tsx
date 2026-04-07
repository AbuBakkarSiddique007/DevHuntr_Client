"use client";

import { useEffect, useState } from "react";
import { ProductService, Product } from "@/services/product/product.service";
import Link from "next/link";
import Image from "next/image";
import { Ghost } from "lucide-react";

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

  return (
    <section className="py-16 relative z-10 text-slate-900 dark:text-foreground">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 flex items-center gap-3 text-slate-900 dark:text-white">
            Featured Innovation
          </h2>
          <p className="text-slate-600 dark:text-muted-foreground/80 text-lg max-w-2xl">Handpicked excellence from our community.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse rounded-[2rem] border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 h-[320px]" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} className="group relative rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-background/50 p-6 flex flex-col h-full shadow-[0_8px_30px_-10px_rgba(0,0,0,0.05)] dark:shadow-none hover:shadow-[0_8px_30px_-5px_rgba(139,92,246,0.2)] dark:hover:shadow-yellow-500/10 hover:border-purple-200 dark:hover:border-yellow-500/40 transition-all duration-500 overflow-hidden">

                <div className="absolute top-0 right-0 -z-10 h-32 w-32 rounded-full bg-purple-500/5 dark:bg-yellow-500/5 blur-[50px] group-hover:bg-purple-500/10 dark:group-hover:bg-yellow-500/10 transition-colors"></div>

                <div className="flex justify-between items-start mb-6">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-2xl object-cover border border-slate-100 dark:border-white/10 group-hover:scale-105 transition-transform shadow-md dark:shadow-lg"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-2xl bg-linear-to-br from-[#207e82]/10 to-[#207e82]/5 flex items-center justify-center border border-slate-100 dark:border-white/10 group-hover:scale-105 transition-transform shadow-md dark:shadow-lg">
                      <Ghost className="h-8 w-8 text-[#207e82]" />
                    </div>
                  )}

                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 group-hover:bg-slate-100 dark:hover:bg-white/10 transition-colors shadow-none dark:shadow-inner h-fit">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-semibold text-[#207e82]">▲</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-foreground">{product.upvoteCount}</span>
                      </div>
                      <div className="w-px h-3 bg-slate-300 dark:bg-white/20" />
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-semibold text-rose-500 dark:text-red-400">▼</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-foreground">{product.downvoteCount}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center bg-purple-500/10 dark:bg-yellow-500/10 border border-purple-500/20 dark:border-yellow-500/20 rounded-xl px-3 py-1.5 h-fit">
                      <span className="text-[10px] font-bold text-purple-600 dark:text-yellow-500">FEATURED</span>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-yellow-500 transition-colors line-clamp-1">{product.name}</h3>
                <p className="text-slate-600 dark:text-muted-foreground text-sm line-clamp-2 mt-auto">
                  {product.description}
                </p>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
