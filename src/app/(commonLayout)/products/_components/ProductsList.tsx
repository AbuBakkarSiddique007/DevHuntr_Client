"use client";

import { useEffect, useState, useRef } from "react";
import { ProductService, Product, ProductListResponse } from "@/services/product/product.service";
import { TagService, Tag } from "@/services/tag/tag.service";
import { ProductCard } from "@/components/shared/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search, Crown, ChevronLeft, ChevronRight, Ghost, X, SlidersHorizontal
} from "lucide-react";

export function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [pricingType, setPricingType] = useState<"FREE" | "PREMIUM" | "">("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Suggestions state
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await ProductService.getProducts({ page, limit: 12, search, tag: selectedTag, pricingType }) as ProductListResponse;
      const productsData = response?.products || [];
      setProducts(productsData);
      
      const meta = response?.meta;
      const calculatedPages = meta?.total ? Math.ceil(meta.total / 12) : 1;
      setTotalPages(meta?.totalPages || calculatedPages);
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchInput.length < 1) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await ProductService.getProducts({ search: searchInput, limit: 5 }) as ProductListResponse;
        const data = response?.products || [];
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Suggestions fetch failed", err);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    TagService.getTags().then(setTags).catch(console.error);
  }, []);

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, selectedTag, pricingType]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    setSearch(searchInput);
    setPage(1);
    setShowSuggestions(false);
  };

  const selectSuggestion = (name: string) => {
    setSearchInput(name);
    setSearch(name);
    setPage(1);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  const renderFilterControls = () => (
    <>
      {/* Pricing Filter */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-primary uppercase tracking-wider px-1">
          Pricing Mode
        </h3>
        <div className="flex flex-col gap-1.5 bg-card p-2 rounded-2xl border border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setPricingType(""); setPage(1); setMobileFiltersOpen(false); }}
            className={`w-full justify-start rounded-xl px-3.5 h-10 transition-colors ${
              !pricingType
                ? "bg-primary/10 text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            All Products
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setPricingType("FREE"); setPage(1); setMobileFiltersOpen(false); }}
            className={`w-full justify-start rounded-xl px-3.5 h-10 transition-colors ${
              pricingType === "FREE"
                ? "bg-primary/10 text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            Free Access
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setPricingType("PREMIUM"); setPage(1); setMobileFiltersOpen(false); }}
            className={`w-full justify-start rounded-xl px-3.5 h-10 flex items-center gap-1.5 transition-colors ${
              pricingType === "PREMIUM"
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/20"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Crown className="h-4 w-4 text-amber-500" /> Premium
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-semibold text-primary uppercase tracking-wider">
            Categories
          </h3>
          {selectedTag && (
            <button
              onClick={() => { setSelectedTag(""); setPage(1); }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Reset
            </button>
          )}
        </div>
        <div className="flex flex-wrap lg:flex-col gap-1.5 max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setSelectedTag(""); setPage(1); setMobileFiltersOpen(false); }}
            className={`w-auto lg:w-full justify-start rounded-xl px-3.5 h-9 transition-colors text-xs ${
              !selectedTag
                ? "bg-primary text-primary-foreground font-semibold"
                : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
            }`}
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
                setMobileFiltersOpen(false);
              }}
              className={`w-auto lg:w-full justify-start rounded-xl px-3.5 h-9 transition-colors text-xs ${
                selectedTag === t.name
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
            >
              {t.name}
            </Button>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 min-h-[calc(100vh-100px)]">

      {/* Header & Search */}
      <div className="flex flex-col items-center text-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-foreground">
            Explore Products
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl">
            Discover the best tech products built by the indie maker community.
          </p>
        </div>

        <div className="relative w-full max-w-lg" ref={searchRef}>
          <form onSubmit={handleSearch} className="flex w-full gap-2 p-1.5 rounded-full bg-card border border-border shadow-sm focus-within:border-primary/50 transition-colors relative z-20">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                aria-label="Search products"
                placeholder="Search products, tools, tech..."
                className="pl-9 pr-9 rounded-full border-none bg-transparent shadow-none focus-visible:ring-0 text-foreground placeholder:text-muted-foreground h-9 text-sm"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => searchInput.length > 0 && setShowSuggestions(true)}
              />
              {searchInput && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={clearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <Button
              type="submit"
              className="rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity px-5 h-9 font-medium text-xs"
            >
              Search
            </Button>
          </form>

          {/* SUGGESTIONS DROPDOWN */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full mt-2 left-0 w-full p-2 bg-card border border-border rounded-2xl shadow-xl z-dropdown animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="space-y-1 max-h-[280px] overflow-y-auto custom-scrollbar">
                {suggestions.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => selectSuggestion(product.name)}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-muted rounded-xl transition-colors flex items-center gap-3 group"
                  >
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center border border-border group-hover:border-primary/30 shrink-0">
                      <Search className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium truncate">
                        {product.tags?.[0]?.tag?.name || "Product"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Filter Toggle */}
        <div className="flex lg:hidden items-center justify-between w-full pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="flex items-center gap-2 rounded-xl border-border bg-card text-foreground"
          >
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            <span>Filters {Boolean(selectedTag || pricingType) && "• Active"}</span>
          </Button>

          {(selectedTag || pricingType) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setSelectedTag(""); setPricingType(""); setPage(1); }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear filters
            </Button>
          )}
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFiltersOpen && (
          <div className="lg:hidden w-full p-4 rounded-2xl bg-card border border-border space-y-6 text-left animate-in slide-in-from-top-2 duration-200">
            {renderFilterControls()}
          </div>
        )}
      </div>

      {/* Main Content Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Desktop Sidebar: Filters */}
        <aside className="hidden lg:block lg:col-span-1 space-y-8 sticky top-24">
          {renderFilterControls()}
        </aside>

        {/* Right Content: Products Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="skeleton h-[320px] rounded-2xl" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
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
              <Ghost className="h-16 w-16 text-muted-foreground/40 mb-4" />
              <h2 className="text-xl font-bold tracking-tight mb-1 text-foreground">No products found</h2>
              <p className="text-muted-foreground text-sm max-w-sm">
                Try adjusting your search terms or clearing your category filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
