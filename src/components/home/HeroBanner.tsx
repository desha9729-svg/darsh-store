"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";
import { ArrowRight, ShieldCheck, Sparkles, CheckCircle2, Truck } from "lucide-react";

export function HeroBanner() {
  const { t, isRTL, language } = useLanguage();

  return (
    <section className="relative bg-gradient-to-b from-[#FBF9F7] via-[#F5EFE6] to-[#ECE4D8] text-[#0B0B0B] overflow-hidden py-16 sm:py-24 lg:py-28 border-b border-neutral-200/80">
      {/* Subtle Architectural Grid Lines & Ambient Lighting */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      {/* Ambient warm light blur */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#D9C9B3]/40 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Text Content Column */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Eyebrow badge matching brand aesthetic */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#0B0B0B]/5 border border-[#0B0B0B]/10 rounded-full mb-6 self-start shadow-2xs">
              <div className="w-2 h-2 rounded-full bg-[#0B0B0B]" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#0B0B0B]">
                {t("hero.badge")}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight uppercase leading-[1.08] text-[#0B0B0B]">
              {t("hero.title1")} <br />
              <span className="text-[#8C7A65] italic font-serif relative inline-block">
                {t("hero.title2")}
                {/* Subtle underline stroke */}
                <span className="absolute bottom-1 inset-x-0 h-1 bg-[#D9C9B3] -z-10 opacity-70" />
              </span>
            </h1>

            {/* Subtitle & Philosophy */}
            <p className="mt-6 text-base sm:text-lg text-neutral-700 leading-relaxed max-w-xl font-normal">
              {t("hero.subtitle")}
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/shop"
                className="px-8 py-4 bg-[#0B0B0B] text-white font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-neutral-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <span>{t("hero.shopAll")}</span>
                <ArrowRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
              </Link>

              <Link
                href="/shop?category=watches"
                className="px-8 py-4 bg-white/80 backdrop-blur-xs text-[#0B0B0B] font-bold text-xs uppercase tracking-widest rounded-sm border border-neutral-300 hover:border-black hover:bg-white transition-all duration-300 flex items-center justify-center shadow-2xs"
              >
                {t("hero.exploreTimepieces")}
              </Link>
            </div>

            {/* Key Assurance / Trust Badges */}
            <div className="mt-12 flex flex-wrap items-center gap-6 pt-6 border-t border-neutral-300/80 text-xs text-neutral-700">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0B0B0B]" />
                <span className="font-semibold">{t("hero.codBadge")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#0B0B0B]" />
                <span className="font-semibold">{t("hero.shippingBadge")}</span>
              </div>
            </div>
          </div>

          {/* Visual Showcase Column (Curated Luxury Composition) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Flatlay Showcase Card */}
              <div className="relative aspect-[4/5] w-full rounded-sm overflow-hidden bg-neutral-100 border border-neutral-300/80 shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=1000"
                  alt="DRSH Accessories Collection"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center"
                />

                {/* Soft warm gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                {/* DRSH Emblem Floating Tag in Image */}
                <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-sm border border-neutral-200/80 shadow-md flex items-center gap-2.5">
                  <div className="w-6 h-6 bg-[#0B0B0B] text-[#D9C9B3] rounded-xs flex items-center justify-center font-bold text-xs">
                    D
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black tracking-widest text-[#0B0B0B] leading-none">
                      DRSH
                    </span>
                    <span className="text-[9px] text-neutral-500 font-medium tracking-wider">
                      درش • 2026
                    </span>
                  </div>
                </div>

                {/* Floating Bottom Card */}
                <div className="absolute bottom-5 inset-x-5 bg-white/95 backdrop-blur-md p-4 rounded-sm border border-neutral-200 shadow-lg flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold block">
                      {language === "ar" ? "تشكيلة حصرية" : "Exclusive Drop"}
                    </span>
                    <h4 className="text-xs font-extrabold text-[#0B0B0B] mt-0.5">
                      {language === "ar" ? "ساعات وإكسسوارات معمارية" : "Architectural Accessories"}
                    </h4>
                  </div>
                  <Link
                    href="/shop"
                    className="px-3 py-1.5 bg-[#0B0B0B] text-white text-[11px] font-bold uppercase rounded-xs hover:bg-[#D9C9B3] hover:text-[#0B0B0B] transition-colors"
                  >
                    {language === "ar" ? "تسوق" : "Shop"}
                  </Link>
                </div>
              </div>

              {/* Floating Decorative Accent Tag */}
              <div
                className={`absolute -bottom-4 ${
                  isRTL ? "-left-4" : "-right-4"
                } bg-[#0B0B0B] text-[#D9C9B3] p-3 rounded-sm shadow-xl hidden sm:flex items-center gap-2.5 border border-[#D9C9B3]/30`}
              >
                <CheckCircle2 className="w-4 h-4 text-[#D9C9B3]" />
                <span className="text-xs font-bold tracking-wide">
                  {language === "ar" ? "معاينة قبل الدفع" : "Inspect Upon Delivery"}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
