"use client";

import { useEffect, useState } from "react";
import { ProductService, Product } from "@/services/product/product.service";
import { ProductCard } from "@/components/shared/ProductCard";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FeaturedProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await ProductService.getFeaturedProducts({ page, limit: 12 });
      const r = response as unknown as { data?: { products?: Product[]; meta?: { total?: number; totalPages?: number } }; products?: Product[]; meta?: { total?: number; totalPages?: number } };
      const productsData = r?.data?.products || r?.products || [];
      setProducts(Array.isArray(productsData) ? productsData : []);
      const meta = r?.data?.meta || r?.meta;
      const calculatedPages = meta?.total ? Math.ceil(meta.total / 12) : 1;
      setTotalPages(meta?.totalPages || calculatedPages);
    } catch (err) {
      console.error("Failed to load featured products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 min-h-[calc(100vh-100px)]">

      {/* Header */}
      <div className="flex flex-col items-center text-center mb-14 px-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Star className="h-3.5 w-3.5 fill-current" /> Curated Community Showcase
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-foreground">
          Featured Excellence
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl leading-relaxed">
          Discover handpicked, top-tier products recognized for their outstanding impact, innovation, and craftsmanship.
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="skeleton h-[320px] rounded-2xl" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-14">
            <Button
              variant="outline"
              className="rounded-full bg-card border-border h-9 px-3.5 text-xs text-foreground hover:bg-muted disabled:opacity-50"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              <ChevronLeft className="mr-1 h-3.5 w-3.5" /> Previous
            </Button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? "default" : "outline"}
                  className={`h-8 w-8 rounded-full text-xs font-semibold transition-colors ${
                    page === pageNum
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "border-border bg-card text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              className="rounded-full bg-card border-border h-9 px-3.5 text-xs text-foreground hover:bg-muted disabled:opacity-50"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Next <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl bg-card border border-border p-8">
          <Star className="h-14 w-14 text-amber-500/40 mb-3" />
          <h2 className="text-xl font-bold mb-1 text-foreground">No featured products yet</h2>
          <p className="text-muted-foreground text-sm max-w-sm">
            Check back later for curated community picks or launch your own product.
          </p>
        </div>
      )}
    </div>
  );
}
