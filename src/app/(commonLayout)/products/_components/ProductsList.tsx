"use client";

import { useEffect, useState } from "react";
import { ProductService, Product } from "@/services/product/product.service";
import { TagService, Tag } from "@/services/tag/tag.service";
import Link from "next/link";
import Image from "next/image";
import { Ghost, Search, ChevronLeft, ChevronRight, ArrowUpRight, Crown, Lock, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [pricingType, setPricingType] = useState("");

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await ProductService.getProducts({ page, limit: 10, search, tag: selectedTag, pricingType });
      const productsData = response?.data?.products || [];
      setProducts(Array.isArray(productsData) ? productsData : []);
      const meta = response?.data?.meta;
      const calculatedPages = meta?.total ? Math.ceil(meta.total / 10) : 1;
      setTotalPages(meta?.totalPages || calculatedPages);
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    TagService.getTags().then(setTags).catch(console.error);
  }, []);

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, selectedTag, pricingType]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 min-h-[calc(100vh-100px)]">

      {/* Header & Search */}
      <div className="flex flex-col items-center text-center gap-6 mb-8">
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

      {/* Filters (Tags & Pricing) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="relative w-full md:w-64 shrink-0">
          <select
            value={selectedTag}
            onChange={(e) => { setSelectedTag(e.target.value); setPage(1); }}
            className="flex h-10 w-full items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-background appearance-none cursor-pointer glass backdrop-blur-md transition-colors hover:bg-white/10 text-foreground"
          >
            <option value="" className="bg-[#1a1a2e] text-foreground p-2">All Categories</option>
            {tags.map(t => (
              <option key={t.id} value={t.name} className="bg-[#1a1a2e] text-foreground p-2">{t.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
        </div>

        <div className="flex items-center gap-2 shrink-0 bg-white/5 p-1.5 rounded-full border border-white/10 w-full sm:w-auto justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setPricingType(""); setPage(1); }}
            className={`rounded-full px-4 h-8 transition-colors ${!pricingType ? 'bg-white/10 font-bold text-white' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}
          >
            All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setPricingType("FREE"); setPage(1); }}
            className={`rounded-full px-4 h-8 transition-colors ${pricingType === "FREE" ? 'bg-white/10 font-bold text-white' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}
          >
            Free
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setPricingType("PREMIUM"); setPage(1); }}
            className={`rounded-full px-4 h-8 flex items-center gap-1.5 transition-colors ${pricingType === "PREMIUM" ? 'bg-amber-500/20 text-amber-400 font-bold hover:bg-amber-500/30 border border-amber-500/20' : 'text-muted-foreground hover:text-amber-400 hover:bg-amber-500/10'}`}
          >
            <Crown className="h-3 w-3" /> Premium
          </Button>
        </div>
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

                  <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 hover:bg-white/10 transition-colors shadow-inner">
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

                {/* Premium Badge */}
                {product.pricingType === "PREMIUM" && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold">
                    <Crown className="h-3 w-3" />
                    Premium
                  </div>
                )}

                <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors line-clamp-1">{product.name}</h3>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-6 grow">
                  {product.description || (
                    <span className="flex items-center gap-1.5 text-amber-400/70 italic">
                      <Lock className="h-3 w-3" /> Premium content
                    </span>
                  )}
                </p>

                <div className="flex items-center text-xs font-semibold text-primary group-hover:text-primary/80 mt-auto">
                  View Details
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-16">
            <Button
              variant="outline"
              className="rounded-full glass h-10 px-4 disabled:opacity-50"
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
                  className={`h-10 w-10 rounded-full glass border-none transition-all ${page === pageNum
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110"
                    : "hover:bg-white/10"
                    }`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              className="rounded-full glass h-10 px-4 disabled:opacity-50"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Next <ChevronRight className="ml-1 h-4 w-4" />
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
