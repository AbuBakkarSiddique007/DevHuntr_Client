"use client";

import { useEffect, useState } from "react";
import { ProductService, Product } from "@/services/product/product.service";
import { TagService, Tag } from "@/services/tag/tag.service";
import Link from "next/link";
import Image from "next/image";
import { Ghost, Search, ChevronLeft, ChevronRight, ArrowUpRight, Crown, Lock, X } from "lucide-react";
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

  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 min-h-[calc(100vh-100px)]">

      {/* Header & Search */}
      <div className="flex flex-col items-center text-center gap-6 mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 text-slate-900 dark:text-white">
            Explore Products
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover the best tech products built by the community.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex w-full md:w-auto gap-2 p-2 rounded-full shadow-lg shadow-purple-500/5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-xl group">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-muted-foreground group-focus-within:text-purple-500 transition-colors" />
            <Input
              placeholder="Search products..."
              className="pl-9 pr-10 rounded-full border-none bg-transparent shadow-none focus-visible:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-muted-foreground"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <Button type="submit" className="rounded-full bg-purple-600 hover:bg-purple-700 text-white transition-all shadow-md active:scale-95">
            Search
          </Button>
        </form>
      </div>

      {/* Main Content Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
        
        {/* Left Sidebar: Filters */}
        <aside className="lg:col-span-1 space-y-10 order-2 lg:order-1 sticky top-24">
          
          {/* Pricing Filter */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest px-1">
              Pricing Mode
            </h3>
            <div className="flex flex-col gap-2 bg-slate-100 dark:bg-white/5 p-2 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setPricingType(""); setPage(1); }}
                className={`w-full justify-start rounded-2xl px-4 h-11 transition-all ${!pricingType ? 'bg-white dark:bg-white/10 shadow-sm font-bold text-slate-900 dark:text-white' : 'text-slate-500 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'}`}
              >
                All Products
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setPricingType("FREE"); setPage(1); }}
                className={`w-full justify-start rounded-2xl px-4 h-11 transition-all ${pricingType === "FREE" ? 'bg-white dark:bg-white/10 shadow-sm font-bold text-slate-900 dark:text-white' : 'text-slate-500 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'}`}
              >
                Free Access
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setPricingType("PREMIUM"); setPage(1); }}
                className={`w-full justify-start rounded-2xl px-4 h-11 flex items-center gap-1.5 transition-all ${pricingType === "PREMIUM" ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20' : 'text-slate-500 dark:text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/5 dark:hover:bg-white/5'}`}
              >
                <Crown className="h-4 w-4" /> Premium
              </Button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest px-1">
              Browse Categories
            </h3>
            <div className="flex flex-wrap lg:flex-col gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setSelectedTag(""); setPage(1); }}
                className={`w-auto lg:w-full justify-start rounded-xl px-4 h-10 transition-all text-sm ${!selectedTag ? 'bg-purple-600 text-white shadow-md font-bold' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-muted-foreground hover:bg-slate-200 dark:hover:bg-white/10'}`}
              >
                All Categories
              </Button>
              {tags.map((t) => (
                <Button
                  key={t.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => { 
                    setSelectedTag(prev => prev === t.name ? "" : t.name); 
                    setPage(1); 
                  }}
                  className={`w-auto lg:w-full justify-start rounded-xl px-4 h-10 transition-all text-sm ${selectedTag === t.name ? 'bg-purple-600 text-white shadow-md font-bold hover:bg-purple-700' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-muted-foreground hover:bg-slate-200 dark:hover:bg-white/10'}`}
                >
                  {t.name}
                </Button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Content: Products Grid */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse rounded-[2rem] glass h-[320px]" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Link key={product.id} href={`/products/${product.id}`} className="group relative rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-background/50 p-6 flex flex-col h-full hover:shadow-[0_20px_40px_-15px_rgba(139,92,246,0.15)] dark:hover:shadow-purple-500/10 hover:border-purple-200 dark:hover:border-purple-500/30 transition-all duration-500 overflow-hidden">
                    {/* ... (Existing Card JSX) ... */}
                    <div className="flex justify-between items-start mb-6">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={56}
                          height={56}
                          className="h-14 w-14 rounded-2xl object-cover border border-slate-100 dark:border-white/10 group-hover:scale-105 transition-transform shadow-sm"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-2xl bg-linear-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center border border-slate-100 dark:border-white/10 group-hover:scale-105 transition-transform">
                          <Ghost className="h-6 w-6 text-purple-400" />
                        </div>
                      )}

                      <div className="flex items-center gap-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 transition-colors shadow-none dark:shadow-inner">
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
                    </div>

                    {/* Premium Badge */}
                    {product.pricingType === "PREMIUM" && (
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                        <Crown className="h-3 w-3" />
                        Premium
                      </div>
                    )}

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

              {/* Pagination */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-16">
                <Button
                  variant="outline"
                  className="rounded-full bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 h-10 px-4 disabled:opacity-50"
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
                      className={`h-10 w-10 rounded-full border-none transition-all ${page === pageNum
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110"
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
                  className="rounded-full bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 h-10 px-4 disabled:opacity-50"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  Next <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center glass rounded-[2.5rem] border border-slate-200 dark:border-white/10">
              <Ghost className="h-20 w-20 text-slate-300 dark:text-white/10 mb-6" />
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white">No products found</h2>
              <p className="text-slate-500 dark:text-muted-foreground text-lg">Try adjusting your filters or search term.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
