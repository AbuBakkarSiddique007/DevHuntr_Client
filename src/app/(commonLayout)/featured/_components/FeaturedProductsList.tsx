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
    <div className="container mx-auto px-4 py-20 md:py-32 min-h-[calc(100vh-100px)]">

      {/* Header */}
      <div className="flex flex-col items-center text-center mb-20 px-4">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter mb-6 text-slate-900 dark:text-white">
          Featured Excellence
        </h1>
        <p className="text-slate-500 dark:text-muted-foreground text-lg md:text-xl max-w-3xl">
          Discover handpicked, top-tier products recognized by the community for their outstanding impact and innovation.
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="animate-pulse rounded-[2rem] glass h-[320px]" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-16">
            <Button
              variant="outline"
              className="rounded-full h-10 px-4 disabled:opacity-50 bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-muted-foreground hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Previous
            </Button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? "default" : "outline"}
                  className={`h-10 w-10 rounded-full transition-all border-none ${page === pageNum
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20 scale-110 font-bold"
                    : "text-slate-600 dark:text-muted-foreground hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              className="rounded-full h-10 px-4 disabled:opacity-50 bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-muted-foreground hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center glass rounded-3xl mt-8 border-yellow-500/10">
          <Star className="h-16 w-16 text-yellow-500/30 mb-4" />
          <h2 className="text-2xl font-bold mb-2">No featured products yet</h2>
          <p className="text-muted-foreground">Check back later for curated community picks.</p>
        </div>
      )}
    </div>
  );
}
