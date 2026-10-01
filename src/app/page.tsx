"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { HeroBanner } from "@/components/home/HeroBanner";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { ProductGridSection } from "@/components/home/ProductGridSection";
import { WhyDrsh } from "@/components/home/WhyDrsh";
import { useLanguage } from "@/context/language-context";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HomePage() {
  const { t, isRTL, language } = useLanguage();

  return (
    <div>
      {/* 01: Hero Banner */}
      <HeroBanner />

      {/* 02: Featured Categories */}
      <FeaturedCategories />

      {/* 03: Curated Product Grid */}
      <ProductGridSection />

      {/* 04: Featured Collection Showcase Banner (Everyday Essentials) */}
      <section className="py-20 bg-[#F4EFEA] border-b border-neutral-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0B0B0B] text-white rounded-sm overflow-hidden grid grid-cols-1 lg:grid-cols-2 shadow-xl">
            {/* Visual Side */}
            <div className="relative min-h-[350px] lg:min-h-[460px]">
              <Image
                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1200"
                alt="Everyday Essentials Gift Box"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
              <div className="absolute top-6 left-6 bg-[#D9C9B3] text-[#0B0B0B] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-xs">
                {t("promoBox.badge")}
              </div>
            </div>

            {/* Editorial Content Side */}
            <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[#D9C9B3] text-xs font-bold uppercase tracking-widest mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t("promoBox.category")}</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  {t("promoBox.title")}
                </h3>
                <p className="mt-4 text-sm text-neutral-300 leading-relaxed">
                  {t("promoBox.desc")}
                </p>
                <div className="mt-6 flex items-baseline gap-3">
                  <span className="text-2xl font-black text-[#D9C9B3]">
                    1,599 {language === "ar" ? "ج.م" : "EGP"}
                  </span>
                  <span className="text-sm text-neutral-500 line-through">
                    2,100 {language === "ar" ? "ج.م" : "EGP"}
                  </span>
                  <span className="text-xs bg-red-900/80 text-red-200 px-2 py-0.5 rounded-xs font-bold">
                    {t("promoBox.save")} 501 {language === "ar" ? "ج.م" : "EGP"}
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-800">
                <Link
                  href="/product/drsh-minimalist-everyday-gift-set"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#D9C9B3] text-[#0B0B0B] text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-white transition-all duration-300"
                >
                  <span>{t("promoBox.orderCod")}</span>
                  <ArrowRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 05: Why DRSH Trust Pillars */}
      <WhyDrsh />
    </div>
  );
}
