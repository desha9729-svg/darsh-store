"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { HeroBanner } from "@/components/home/HeroBanner";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { ProductGridSection } from "@/components/home/ProductGridSection";
import { WhyDrsh } from "@/components/home/WhyDrsh";
import { TrustGuarantees } from "@/components/ui/TrustGuarantees";
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
      <section className="py-10 sm:py-16 md:py-20 bg-[#F4EFEA] border-b border-neutral-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="bg-[#0B0B0B] text-white rounded-sm overflow-hidden grid grid-cols-1 lg:grid-cols-2 shadow-xl">
            {/* Visual Side */}
            <div className="relative min-h-[260px] sm:min-h-[350px] lg:min-h-[460px]">
              <Image
                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1200"
                alt="Everyday Essentials Gift Box"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-[#D9C9B3] text-[#0B0B0B] text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-xs">
                {t("promoBox.badge")}
              </div>
            </div>

            {/* Editorial Content Side */}
            <div className="p-5 sm:p-10 lg:p-14 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[#D9C9B3] text-[11px] sm:text-xs font-bold uppercase tracking-widest mb-2 sm:mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t("promoBox.category")}</span>
                </div>
                <h3 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  {t("promoBox.title")}
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {t("promoBox.desc")}
                </p>
                <div className="mt-4 sm:mt-6 flex flex-wrap items-baseline gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl font-black text-[#D9C9B3]">
                    1,599 {language === "ar" ? "ج.م" : "EGP"}
                  </span>
                  <span className="text-xs sm:text-sm text-neutral-500 line-through">
                    2,100 {language === "ar" ? "ج.م" : "EGP"}
                  </span>
                  <span className="text-[10px] sm:text-xs bg-red-900/80 text-red-200 px-2 py-0.5 rounded-xs font-bold">
                    {t("promoBox.save")} 501 {language === "ar" ? "ج.م" : "EGP"}
                  </span>
                </div>
              </div>

              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-neutral-800">
                <Link
                  href="/product/drsh-minimalist-everyday-gift-set"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-8 sm:py-3.5 bg-[#D9C9B3] text-[#0B0B0B] text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-white transition-all duration-300 min-h-[44px]"
                >
                  <span>{t("promoBox.orderCod")}</span>
                  <ArrowRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 05: Global Buyer Protection & Trust Guarantees */}
      <section className="py-8 sm:py-12 bg-[#F5F5F3] border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <TrustGuarantees variant="horizontal" showLink={true} />
        </div>
      </section>

      {/* 06: Why DRSH Trust Pillars */}
      <WhyDrsh />
    </div>
  );
}
