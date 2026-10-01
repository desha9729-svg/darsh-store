"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PRODUCTS, CATEGORIES } from "@/data/mock-products";
import { ProductCard } from "@/components/ui/ProductCard";
import { Filter, SlidersHorizontal, X, RotateCcw } from "lucide-react";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialGender = searchParams.get("gender") || "all";
  const initialQuery = searchParams.get("q") || "";

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedGender, setSelectedGender] = useState<string>(initialGender);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<"featured" | "newest" | "price-asc" | "price-desc">("featured");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category filter
      if (selectedCategory !== "all" && product.categorySlug !== selectedCategory) {
        return false;
      }
      // Gender filter
      if (selectedGender !== "all") {
        if (product.gender !== selectedGender && product.gender !== "unisex") {
          return false;
        }
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesCat = product.category.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesDesc) return false;
      }
      // Stock filter
      if (inStockOnly) {
        const stock = product.variants.reduce((acc, v) => acc + v.stockQuantity, 0);
        if (stock <= 0) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "newest") return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      if (sortBy === "price-asc") return a.basePrice - b.basePrice;
      if (sortBy === "price-desc") return b.basePrice - a.basePrice;
      return 0; // featured default
    });
  }, [selectedCategory, selectedGender, searchQuery, inStockOnly, sortBy]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedGender("all");
    setSearchQuery("");
    setInStockOnly(false);
    setSortBy("featured");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Page Header */}
      <div className="border-b border-neutral-200 pb-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B0B0B] uppercase tracking-tight">
              {selectedCategory === "all"
                ? "All Accessories"
                : CATEGORIES.find((c) => c.slug === selectedCategory)?.name || "Shop Collection"}
            </h1>
            <p className="text-xs text-[#686B6B] mt-1.5 uppercase tracking-wider">
              {filteredProducts.length} pieces available • Cash on Delivery nationwide
            </p>
          </div>

          {/* Quick Gender Toggle */}
          <div className="flex items-center gap-1.5 p-1 bg-white border border-neutral-300 rounded-sm self-start md:self-auto">
            {["all", "men", "women", "unisex"].map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGender(g)}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors ${
                  selectedGender === g
                    ? "bg-[#0B0B0B] text-white"
                    : "text-[#686B6B] hover:text-[#0B0B0B]"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Filter / Sort Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-100">
          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 bg-white border border-neutral-300 text-xs font-bold uppercase rounded-sm"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            {/* Active search tag */}
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-200 text-xs font-medium rounded-full">
                Searching: &ldquo;{searchQuery}&rdquo;
                <button onClick={() => setSearchQuery("")} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {(selectedCategory !== "all" || selectedGender !== "all" || inStockOnly || searchQuery) && (
              <button
                onClick={resetFilters}
                className="text-xs text-[#686B6B] hover:text-[#0B0B0B] underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset all
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#686B6B] uppercase font-semibold">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-neutral-300 rounded-sm py-1.5 px-3 text-xs font-medium text-[#0B0B0B] focus:outline-none focus:border-[#0B0B0B]"
            >
              <option value="featured">Featured Collection</option>
              <option value="newest">New Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-8 pr-6 border-r border-neutral-200">
          {/* Categories Filter */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#0B0B0B] mb-4">
              Categories
            </h3>
            <div className="space-y-2 text-sm">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`block w-full text-left transition-colors ${
                  selectedCategory === "all" ? "font-bold text-[#0B0B0B]" : "text-[#686B6B] hover:text-[#0B0B0B]"
                }`}
              >
                All Products ({PRODUCTS.length})
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`block w-full text-left transition-colors ${
                    selectedCategory === cat.slug
                      ? "font-bold text-[#0B0B0B]"
                      : "text-[#686B6B] hover:text-[#0B0B0B]"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="pt-6 border-t border-neutral-200">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#0B0B0B] mb-3">
              Availability
            </h3>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-[#0B0B0B]">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded-xs border-neutral-300 text-[#0B0B0B] focus:ring-0"
              />
              <span>In Stock Only</span>
            </label>
          </div>

          {/* Payment Confidence Badge */}
          <div className="p-4 bg-[#D9C9B3]/20 border border-[#D9C9B3]/50 rounded-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B0B0B]">
              Cash on Delivery
            </h4>
            <p className="text-[11px] text-[#686B6B] mt-1 leading-normal">
              No online card needed. All orders are fulfilled with COD via Bosta logistics.
            </p>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center bg-white border border-neutral-200 rounded-sm">
              <SlidersHorizontal className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-[#0B0B0B]">No products matched your criteria</h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                Try loosening your filters or searching with different keywords.
              </p>
              <button
                onClick={resetFilters}
                className="mt-6 px-6 py-2.5 bg-[#0B0B0B] text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#D9C9B3] hover:text-[#0B0B0B] transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/60" onClick={() => setMobileFilterOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white p-6 shadow-2xl flex flex-col justify-between z-50 animate-in slide-in-from-right duration-300">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                <h3 className="text-base font-bold uppercase tracking-wider text-[#0B0B0B]">Filters</h3>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X className="w-5 h-5 text-neutral-500" />
                </button>
              </div>

              {/* Categories */}
              <div className="py-6 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#686B6B]">Category</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => { setSelectedCategory("all"); setMobileFilterOpen(false); }}
                    className={`block w-full text-left text-sm ${selectedCategory === "all" ? "font-bold text-black" : "text-neutral-600"}`}
                  >
                    All Categories
                  </button>
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => { setSelectedCategory(c.slug); setMobileFilterOpen(false); }}
                      className={`block w-full text-left text-sm ${selectedCategory === c.slug ? "font-bold text-black" : "text-neutral-600"}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-[#0B0B0B]">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded-xs"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 bg-[#0B0B0B] text-white font-bold text-xs uppercase tracking-wider rounded-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20 text-center">Loading collection...</div>}>
      <ShopContent />
    </Suspense>
  );
}
