"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useProducts } from "@/context/products-context";
import { ProductCard } from "@/components/ui/ProductCard";
import { useLanguage } from "@/context/language-context";
import { ArrowRight } from "lucide-react";

export function ProductGridSection() {
  const { t, isRTL } = useLanguage();
  const { products } = useProducts();
  const [activeTab, setActiveTab] = useState<"featured" | "new" | "bestseller">("featured");

  const filteredProducts = products.filter((p) => {
    if (activeTab === "new") return p.isNewArrival;
    if (activeTab === "bestseller") return p.isBestSeller;
    return p.isFeatured;
  });

  return (
    <section className="py-10 sm:py-16 md:py-20 bg-white border-y border-neutral-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 md:mb-12 gap-4">
          <div>
            <span className="text-[11px] sm:text-xs uppercase font-extrabold tracking-widest text-[#686B6B]">
              {t("featured.eyebrow")}
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-[#0B0B0B] tracking-tight mt-1">
              {t("featured.title")}
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 sm:gap-2 p-1 bg-[#F5F5F3] rounded-sm border border-neutral-200 self-start md:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab("featured")}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-xs transition-colors shrink-0 ${
                activeTab === "featured"
                  ? "bg-[#0B0B0B] text-white shadow-xs"
                  : "text-[#686B6B] hover:text-[#0B0B0B]"
              }`}
            >
              {t("featured.featured")}
            </button>
            <button
              onClick={() => setActiveTab("new")}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-xs transition-colors shrink-0 ${
                activeTab === "new"
                  ? "bg-[#0B0B0B] text-white shadow-xs"
                  : "text-[#686B6B] hover:text-[#0B0B0B]"
              }`}
            >
              {t("featured.newArrivals")}
            </button>
            <button
              onClick={() => setActiveTab("bestseller")}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-xs transition-colors shrink-0 ${
                activeTab === "bestseller"
                  ? "bg-[#0B0B0B] text-white shadow-xs"
                  : "text-[#686B6B] hover:text-[#0B0B0B]"
              }`}
            >
              {t("featured.bestSellers")}
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-8 sm:mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-3.5 bg-transparent border border-[#0B0B0B] text-[#0B0B0B] font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#0B0B0B] hover:text-white transition-all duration-300"
          >
            <span>{t("featured.exploreCatalog")}</span>
            <ArrowRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
          </Link>
        </div>
      </div>
    </section>
  );
}
