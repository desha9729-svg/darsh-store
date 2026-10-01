"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PRODUCTS, CATEGORIES } from "@/data/mock-products";
import { ProductCard } from "@/components/ui/ProductCard";
import { useLanguage } from "@/context/language-context";
import { Filter, SlidersHorizontal, X, RotateCcw } from "lucide-react";

function ShopContent({
  serverCategory,
  serverGender,
  serverQuery,
}: {
  serverCategory?: string;
  serverGender?: string;
  serverQuery?: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language, t } = useLanguage();

  // Combine URL searchParams with server-provided params for seamless SSR + Client navigation
  const selectedCategory = searchParams.get("category") ?? serverCategory ?? "all";
  const selectedGender = searchParams.get("gender") ?? serverGender ?? "all";
  const searchQuery = searchParams.get("q") ?? serverQuery ?? "";

  const [sortBy, setSortBy] = useState<"featured" | "newest" | "price-asc" | "price-desc">("featured");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  const updateCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    const queryStr = params.toString();
    router.push(queryStr ? `/shop?${queryStr}` : "/shop");
  };

  const updateGender = (gender: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (gender === "all") {
      params.delete("gender");
    } else {
      params.set("gender", gender);
    }
    const queryStr = params.toString();
    router.push(queryStr ? `/shop?${queryStr}` : "/shop");
  };

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    const queryStr = params.toString();
    router.push(queryStr ? `/shop?${queryStr}` : "/shop");
  };

  const resetFilters = () => {
    setInStockOnly(false);
    setSortBy("featured");
    router.push("/shop");
  };

  const getCategoryName = (cat: typeof CATEGORIES[0]) => {
    if (language === "ar") {
      switch (cat.slug) {
        case "watches": return "ساعات";
        case "bags": return "حقائب وجلود";
        case "jewelry": return "مجوهرات وخواتم";
        case "eyewear": return "نظارات";
        case "wallets": return "محافظ";
        case "perfumes": return "عطور";
        default: return cat.name;
      }
    }
    return cat.name;
  };

  // Instant reactive filtering
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // 1. Category Filter
      if (selectedCategory !== "all" && product.categorySlug !== selectedCategory) {
        return false;
      }
      // 2. Gender Filter
      if (selectedGender !== "all") {
        if (product.gender !== selectedGender && product.gender !== "unisex") {
          return false;
        }
      }
      // 3. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesCat = product.category.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesDesc) return false;
      }
      // 4. In Stock Filter
      if (inStockOnly) {
        const stock = product.variants.reduce((acc, v) => acc + v.stockQuantity, 0);
        if (stock <= 0) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "newest") return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      if (sortBy === "price-asc") return a.basePrice - b.basePrice;
      if (sortBy === "price-desc") return b.basePrice - a.basePrice;
      return 0;
    });
  }, [selectedCategory, selectedGender, searchQuery, inStockOnly, sortBy]);

  const currentCategoryObj = CATEGORIES.find((c) => c.slug === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Page Header */}
      <div className="border-b border-neutral-200 pb-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B0B0B] uppercase tracking-tight">
              {selectedCategory === "all"
                ? (language === "ar" ? "كل الإكسسوارات" : "All Accessories")
                : (currentCategoryObj ? getCategoryName(currentCategoryObj) : "Collection")}
            </h1>
            <p className="text-xs text-[#686B6B] mt-1.5 uppercase tracking-wider">
              {filteredProducts.length} {language === "ar" ? "منتج متوفر • شحن ودفع عند الاستلام بجميع المحافظات" : "pieces available • Cash on Delivery nationwide"}
            </p>
          </div>

          {/* Quick Gender Toggle */}
          <div className="flex items-center gap-1.5 p-1 bg-white border border-neutral-300 rounded-sm self-start md:self-auto">
            {[
              { id: "all", label: language === "ar" ? "الكل" : "All" },
              { id: "men", label: language === "ar" ? "رجالي" : "Men" },
              { id: "women", label: language === "ar" ? "حريمي" : "Women" },
              { id: "unisex", label: language === "ar" ? "للجنسين" : "Unisex" },
            ].map((g) => (
              <button
                key={g.id}
                onClick={() => updateGender(g.id)}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors ${
                  selectedGender === g.id
                    ? "bg-[#0B0B0B] text-white"
                    : "text-[#686B6B] hover:text-[#0B0B0B]"
                }`}
              >
                {g.label}
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
              <span>{language === "ar" ? "الفلاتر" : "Filters"}</span>
            </button>

            {/* Active search filter tag */}
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-200 text-xs font-medium rounded-full">
                {language === "ar" ? `بحث: "${searchQuery}"` : `Searching: "${searchQuery}"`}
                <button onClick={clearSearch} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Active category filter tag */}
            {selectedCategory !== "all" && currentCategoryObj && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D9C9B3]/30 border border-[#D9C9B3] text-xs font-bold rounded-full text-black">
                {getCategoryName(currentCategoryObj)}
                <button onClick={() => updateCategory("all")} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {(selectedCategory !== "all" || selectedGender !== "all" || inStockOnly || searchQuery) && (
              <button
                onClick={resetFilters}
                className="text-xs text-[#686B6B] hover:text-[#0B0B0B] underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> {language === "ar" ? "إعادة ضبط الفلاتر" : "Reset all"}
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#686B6B] uppercase font-semibold">
              {language === "ar" ? "الترتيب:" : "Sort:"}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-neutral-300 rounded-sm py-1.5 px-3 text-xs font-medium text-[#0B0B0B] focus:outline-none focus:border-[#0B0B0B]"
            >
              <option value="featured">{language === "ar" ? "المميزة" : "Featured Collection"}</option>
              <option value="newest">{language === "ar" ? "وصل حديثاً" : "New Arrivals"}</option>
              <option value="price-asc">{language === "ar" ? "السعر: من الأقل للأعلى" : "Price: Low to High"}</option>
              <option value="price-desc">{language === "ar" ? "السعر: من الأعلى للأقل" : "Price: High to Low"}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-8 pr-6 rtl:pr-0 rtl:pl-6 border-r rtl:border-r-0 rtl:border-l border-neutral-200">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#0B0B0B] mb-4">
              {language === "ar" ? "الأقسام" : "Categories"}
            </h3>
            <div className="space-y-2 text-sm">
              <button
                onClick={() => updateCategory("all")}
                className={`block w-full text-left rtl:text-right transition-colors ${
                  selectedCategory === "all" ? "font-bold text-[#0B0B0B] underline underline-offset-4" : "text-[#686B6B] hover:text-[#0B0B0B]"
                }`}
              >
                {language === "ar" ? `كل المنتجات (${PRODUCTS.length})` : `All Products (${PRODUCTS.length})`}
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => updateCategory(cat.slug)}
                  className={`block w-full text-left rtl:text-right transition-colors ${
                    selectedCategory === cat.slug
                      ? "font-bold text-[#0B0B0B] underline underline-offset-4"
                      : "text-[#686B6B] hover:text-[#0B0B0B]"
                  }`}
                >
                  {getCategoryName(cat)}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-200">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#0B0B0B] mb-3">
              {language === "ar" ? "التوفر" : "Availability"}
            </h3>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-[#0B0B0B]">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded-xs border-neutral-300 text-[#0B0B0B]"
              />
              <span>{language === "ar" ? "المتوفر في المخزون فقط" : "In Stock Only"}</span>
            </label>
          </div>

          <div className="p-4 bg-[#D9C9B3]/20 border border-[#D9C9B3]/50 rounded-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B0B0B]">
              {t("hero.codBadge")}
            </h4>
            <p className="text-[11px] text-[#686B6B] mt-1 leading-normal">
              {language === "ar"
                ? "لا تحتاج لأي بطاقة دفع. الشحن والدفع نقدًا عند الاستلام مع بوسطة."
                : "No online card needed. All orders are fulfilled with COD via Bosta logistics."}
            </p>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center bg-white border border-neutral-200 rounded-sm">
              <SlidersHorizontal className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-[#0B0B0B]">
                {language === "ar" ? "لم يتم العثور على منتجات مطابقة" : "No products matched your criteria"}
              </h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                {language === "ar" ? "جرب تقليل الفلاتر أو استخدام كلمات بحث مختلفة." : "Try loosening your filters or searching with different keywords."}
              </p>
              <button
                onClick={resetFilters}
                className="mt-6 px-6 py-2.5 bg-[#0B0B0B] text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#D9C9B3] hover:text-[#0B0B0B] transition-colors"
              >
                {language === "ar" ? "إعادة الضبط" : "Clear Filters"}
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
          <div className="fixed inset-y-0 right-0 rtl:right-auto rtl:left-0 max-w-xs w-full bg-white p-6 shadow-2xl flex flex-col justify-between z-50">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                <h3 className="text-base font-bold uppercase tracking-wider text-[#0B0B0B]">
                  {language === "ar" ? "الفلاتر" : "Filters"}
                </h3>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X className="w-5 h-5 text-neutral-500" />
                </button>
              </div>

              <div className="py-6 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#686B6B]">
                  {language === "ar" ? "القسم" : "Category"}
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={() => { updateCategory("all"); setMobileFilterOpen(false); }}
                    className={`block w-full text-left rtl:text-right text-sm ${selectedCategory === "all" ? "font-bold text-black underline" : "text-neutral-600"}`}
                  >
                    {language === "ar" ? "كل الأقسام" : "All Categories"}
                  </button>
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => { updateCategory(c.slug); setMobileFilterOpen(false); }}
                      className={`block w-full text-left rtl:text-right text-sm ${selectedCategory === c.slug ? "font-bold text-black underline" : "text-neutral-600"}`}
                    >
                      {getCategoryName(c)}
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
                  <span>{language === "ar" ? "المتوفر بالمخزون فقط" : "In Stock Only"}</span>
                </label>
              </div>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 bg-[#0B0B0B] text-white font-bold text-xs uppercase tracking-wider rounded-sm"
            >
              {language === "ar" ? "تطبيق الفلاتر" : "Apply Filters"}
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
