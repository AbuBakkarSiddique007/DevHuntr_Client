"use client";

import { useEffect, useState } from "react";
import { ProductService, Product, ProductTag } from "@/services/product/product.service";
import Link from "next/link";
import Image from "next/image";
import { Ghost } from "lucide-react";

export function TrendingGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await ProductService.getTrendingProducts();
        const productsData = response?.data?.products || [];
        setProducts(Array.isArray(productsData) ? productsData : []);

      } catch (err) {
        console.error("Failed to fetch trending products", err);

      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="animate-pulse rounded-2xl glass h-[250px]" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.slice(0, 6).map((product) => (
        <Link key={product.id} href={`/products/${product.id}`} className="group relative rounded-2xl border border-border/50 bg-background/50 p-6 flex flex-col h-full hover:shadow-2xl hover:shadow-purple-500/10 hover:border-purple-500/30 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                width={56}
                height={56}
                className="h-14 w-14 rounded-2xl object-cover border border-white/10 group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="h-14 w-14 rounded-2xl bg-linear-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform">
                <Ghost className="h-6 w-6 text-purple-400" />
              </div>
            )}
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 hover:bg-white/10 transition-colors">
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
          </div>

          <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors line-clamp-1">{product.name}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4 grow">
            {product.description}
          </p>

          <div className="flex gap-2 mt-auto flex-wrap">
            {product.tags &&
              product.tags
                .slice(0, 2)
                .map((tagObj: ProductTag) => {
                  const tagName =
                    tagObj?.tag?.name ||
                    (tagObj as any)?.name;

                  if (!tagName) return null;

                  return (
                    <span
                      key={tagObj.id}
                      className="text-[10px] px-2 py-1 rounded-md bg-white/5 border border-white/10 text-muted-foreground uppercase tracking-wider"
                    >
                      {tagName}
                    </span>
                  );
                })}
          </div>
        </Link>
      ))}

      {products.length === 0 && (
        <div className="col-span-full py-12 text-center text-muted-foreground glass rounded-2xl">
          No trending products right now. Be the first to launch!
        </div>
      )}
    </div>
  );
}
