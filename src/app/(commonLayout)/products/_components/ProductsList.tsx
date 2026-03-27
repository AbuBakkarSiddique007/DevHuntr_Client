"use client";

import { useEffect, useState } from "react";
import { ProductService, Product } from "@/services/product/product.service";
import Link from "next/link";
import Image from "next/image";
import { Ghost, Search, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await ProductService.getProducts({ page, limit: 12, search });
      const productsData = response?.data?.products || [];
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 min-h-[calc(100vh-100px)]">

      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-indigo-400">
            Explore Products
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover the best tech products built by the community.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex w-full md:w-auto gap-2 p-2 rounded-full shadow-lg shadow-purple-500/5 glass">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-9 rounded-full border-none bg-transparent shadow-none focus-visible:ring-0"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <Button type="submit" className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors">
            Search
          </Button>
        </form>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl glass h-[300px]" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} className="group relative rounded-2xl border border-border/50 bg-background/50 p-6 flex flex-col h-full hover:shadow-2xl hover:shadow-purple-500/20 hover:border-purple-500/40 transition-all duration-300">

                <div className="flex justify-between items-start mb-6">
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

                  <div className="flex flex-col items-center bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 hover:bg-purple-500/20 transition-colors">
                    <span className="text-[10px] font-semibold text-purple-200">▲</span>
                    <span className="text-sm font-bold text-foreground">{product.upvoteCount - product.downvoteCount}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors line-clamp-1">{product.name}</h3>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-6 grow">
                  {product.description}
                </p>

                <div className="flex items-center text-xs font-semibold text-primary group-hover:text-primary/80 mt-auto">
                  View Details
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 mt-16">
            <Button
              variant="outline"
              className="rounded-full glass"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <span className="text-sm font-medium px-4 py-2 glass rounded-full">
              Page {page}
            </span>
            <Button
              variant="outline"
              className="rounded-full glass"
              onClick={() => setPage(p => p + 1)}
            >
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center glass rounded-3xl mt-8">
          <Ghost className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <h2 className="text-2xl font-bold mb-2">No products found</h2>
          <p className="text-muted-foreground">Try adjusting your search criteria to find what you&apos;re looking for.</p>
        </div>
      )}
    </div>
  );
}
