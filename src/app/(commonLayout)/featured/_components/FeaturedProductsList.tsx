"use client";

import { useEffect, useState } from "react";
import { ProductService, Product } from "@/services/product/product.service";
import Link from "next/link";
import Image from "next/image";
import { Ghost, ChevronLeft, ChevronRight, Star } from "lucide-react";
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
      <div className="flex flex-col items-center text-center gap-4 mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 flex items-center justify-center gap-4">
          <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-orange-500">
            Featured Products
          </span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Discover the handpicked, top-tier products recognized by the community for their outstanding impact and innovation.
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="animate-pulse rounded-[2rem] glass h-[250px]" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
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
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4 grow">
                  {product.description}
                </p>
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-16">
            <Button
              variant="outline"
              className="rounded-full h-10 px-4 disabled:opacity-50 glass border-yellow-500/20 text-yellow-500 hover:bg-yellow-500/10 hover:border-yellow-500/40 hover:text-yellow-400 transition-colors"
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
                  className={`h-10 w-10 rounded-full transition-all ${page === pageNum
                    ? "bg-linear-to-r from-yellow-500 to-amber-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)] scale-110 font-bold border-none"
                    : "glass border-yellow-500/20 text-yellow-500 hover:bg-yellow-500/10 hover:border-yellow-500/40"
                    }`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              className="rounded-full h-10 px-4 disabled:opacity-50 glass border-yellow-500/20 text-yellow-500 hover:bg-yellow-500/10 hover:border-yellow-500/40 hover:text-yellow-400 transition-colors"
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
