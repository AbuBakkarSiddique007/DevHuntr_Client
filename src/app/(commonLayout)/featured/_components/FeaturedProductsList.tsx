"use client";

import { useEffect, useState } from "react";
import { ProductService, Product } from "@/services/product/product.service";
import Link from "next/link";
import Image from "next/image";
import { Ghost, ChevronLeft, ChevronRight, Star, ArrowUpRight, Lock } from "lucide-react";
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
      const productsData = response?.data?.products || [];
      setProducts(Array.isArray(productsData) ? productsData : []);
      const meta = response?.data?.meta;
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
    <div className="container mx-auto px-4 py-12 md:py-20 min-h-[calc(100vh-100px)]">

      {/* Header */}
      <div className="flex flex-col items-center text-center mb-16 px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 text-slate-900 dark:text-white">
          Featured Excellence
        </h1>
        <p className="text-muted-foreground text-lg max-w-3xl">
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
              <Link key={product.id} href={`/products/${product.id}`} className="group relative rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-background/50 p-6 flex flex-col h-full hover:shadow-[0_20px_40px_-15px_rgba(139,92,246,0.15)] dark:hover:shadow-purple-500/10 hover:border-purple-200 dark:hover:border-purple-500/30 transition-all duration-500 overflow-hidden">

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
                    <div className="h-16 w-16 rounded-2xl bg-linear-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center border border-slate-100 dark:border-white/10 group-hover:scale-105 transition-transform shadow-md dark:shadow-lg">
                      <Ghost className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                  )}

                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 transition-colors shadow-none dark:shadow-inner h-fit">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-semibold text-green-500">▲</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-foreground">{product.upvoteCount}</span>
                      </div>
                      <div className="w-px h-3 bg-slate-300 dark:bg-white/20" />
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-semibold text-rose-500">▼</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-foreground">{product.downvoteCount}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center bg-purple-500/10 dark:bg-yellow-500/10 border border-purple-500/20 dark:border-yellow-500/20 rounded-xl px-2 py-1 h-fit">
                      <span className="text-[10px] font-bold text-purple-600 dark:text-yellow-500">FEATURED</span>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">{product.name}</h3>
                <p className="text-slate-600 dark:text-muted-foreground text-sm line-clamp-3 mb-6 grow leading-relaxed">
                  {product.description || (
                    <span className="flex items-center gap-1.5 text-amber-500/70 italic">
                      <Lock className="h-3 w-3" /> Premium content
                    </span>
                  )}
                </p>

                <div className="flex items-center text-xs font-bold text-purple-600 dark:text-purple-400 group-hover:gap-2 transition-all mt-auto pt-4 border-t border-slate-100 dark:border-white/5">
                  Explore Product
                  <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                </div>
              </Link>
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
