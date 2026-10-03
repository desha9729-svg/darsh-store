"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CATEGORIES } from "@/data/mock-products";
import { useLanguage } from "@/context/language-context";
import { ArrowUpRight } from "lucide-react";

export function FeaturedCategories() {
  const { language, t } = useLanguage();

  const getCategoryName = (cat: typeof CATEGORIES[0]) => {
    if (language === "ar") {
      switch (cat.slug) {
        case "watches": return "ساعات فاخرة";
        case "bags": return "حقائب وجلود";
        case "jewelry": return "مجوهرات وخواتم";
        case "eyewear": return "نظارات شمسية";
        case "wallets": return "محافظ رجالي";
        case "perfumes": return "عطور مركزة";
        default: return cat.name;
      }
    }
    return cat.name;
  };

  return (
    <section className="py-10 sm:py-16 md:py-20 bg-[#F5F5F3]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-10">
          <div>
            <span className="text-[11px] sm:text-xs uppercase font-extrabold tracking-widest text-[#686B6B]">
              {t("categories.eyebrow")}
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-[#0B0B0B] tracking-tight mt-1">
              {t("categories.title")}
            </h2>
          </div>
          <Link
            href="/shop"
            className="mt-3 sm:mt-0 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#0B0B0B] hover:text-[#686B6B] flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <span>{t("categories.viewAll")}</span>
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4 md:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative bg-white border border-neutral-200/80 rounded-sm overflow-hidden flex flex-col p-2 sm:p-3 transition-all duration-300 hover:shadow-md hover:border-neutral-400"
            >
              <div className="relative aspect-square w-full bg-neutral-100 rounded-xs overflow-hidden mb-2 sm:mb-3">
                {cat.imageUrl && (
                  <Image
                    src={cat.imageUrl}
                    alt={getCategoryName(cat)}
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                  />
                )}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </div>

              <div className="text-center">
                <h3 className="text-[11px] sm:text-xs font-bold text-[#0B0B0B] uppercase tracking-wider group-hover:text-[#686B6B] transition-colors truncate">
                  {getCategoryName(cat)}
                </h3>
                <span className="text-[9px] sm:text-[10px] text-[#686B6B] mt-0.5 block">
                  {cat.itemCount} {t("categories.itemsCount")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
