"use client";

import { useEffect, useState } from "react";
import { ProductService, Product } from "@/services/product/product.service";
import { ProductCard } from "@/components/shared/ProductCard";
import { Ghost } from "lucide-react";

export function TrendingGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await ProductService.getTrendingProducts();
        const r = response as unknown as { data?: { products?: Product[] }; products?: Product[] };
        const productsData = r?.data?.products || r?.products || (Array.isArray(response) ? response : []);
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="skeleton h-[320px]" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.slice(0, 6).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}

      {products.length === 0 && (
        <div className="col-span-full py-16 text-center text-muted-foreground border border-dashed border-border rounded-2xl bg-muted/30">
          <div className="flex flex-col items-center gap-3">
            <Ghost className="h-10 w-10 text-muted-foreground/40" />
            <p className="font-semibold text-foreground">No trending products right now.</p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Be the first to launch!</p>
          </div>
        </div>
      )}
    </div>
  );
}
