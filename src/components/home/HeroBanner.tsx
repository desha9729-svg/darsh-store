"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export function HeroBanner() {
  const { t, isRTL } = useLanguage();

  return (
    <section className="relative bg-[#0B0B0B] text-white overflow-hidden py-24 sm:py-32 lg:py-40">
      {/* Background Subtle Gradient & Texture */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-neutral-950/90 to-neutral-900/60 z-10" />
      
      {/* Background Graphic Asset */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=1600')",
        }}
      />

      {/* Decorative Gold Geometric Accent Line */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#D9C9B3] to-transparent z-20 opacity-80" />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#D9C9B3]/15 border border-[#D9C9B3]/40 rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#D9C9B3]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#D9C9B3]">
              {t("hero.badge")}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight uppercase leading-none font-sans text-white">
            {t("hero.title1")} <br />
            <span className="text-[#D9C9B3] italic font-serif">{t("hero.title2")}</span>
          </h1>

          {/* Arabic Subtitle & Philosophy */}
          <p className="mt-6 text-base sm:text-lg text-neutral-300 leading-relaxed max-w-xl">
            {t("hero.subtitle")}
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              href="/shop"
              className="px-8 py-4 bg-[#D9C9B3] text-[#0B0B0B] font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
            >
              <span>{t("hero.shopAll")}</span>
              <ArrowRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
            </Link>

            <Link
              href="/shop?category=watches"
              className="px-8 py-4 bg-transparent text-white font-bold text-xs uppercase tracking-widest rounded-sm border border-neutral-700 hover:border-white transition-all duration-300 flex items-center justify-center"
            >
              {t("hero.exploreTimepieces")}
            </Link>
          </div>

          {/* Key Assurance */}
          <div className="mt-12 flex items-center gap-6 pt-6 border-t border-neutral-800 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D9C9B3]" />
              <span>{t("hero.codBadge")}</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#D9C9B3]" />
              <span>{t("hero.shippingBadge")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
