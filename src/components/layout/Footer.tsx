"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Truck, Clock, RefreshCw } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export function Footer() {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-[#0B0B0B] text-neutral-300 pt-16 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Trust Badges Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 mb-12 border-b border-neutral-800">
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <ShieldCheck className="w-6 h-6 text-[#D9C9B3] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                {t("footer.badge1Title")}
              </h4>
              <p className="text-xs text-neutral-400 mt-1">
                {t("footer.badge1Desc")}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <Truck className="w-6 h-6 text-[#D9C9B3] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                {t("footer.badge2Title")}
              </h4>
              <p className="text-xs text-neutral-400 mt-1">
                {t("footer.badge2Desc")}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <RefreshCw className="w-6 h-6 text-[#D9C9B3] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                {t("footer.badge3Title")}
              </h4>
              <p className="text-xs text-neutral-400 mt-1">
                {t("footer.badge3Desc")}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <Clock className="w-6 h-6 text-[#D9C9B3] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                {t("footer.badge4Title")}
              </h4>
              <p className="text-xs text-neutral-400 mt-1">
                {t("footer.badge4Desc")}
              </p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-neutral-800">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#D9C9B3] text-[#0B0B0B] rounded-sm flex items-center justify-center font-extrabold text-lg">
                D
              </div>
              <span className="font-extrabold text-2xl tracking-widest text-white">DRSH</span>
            </div>
            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              {t("footer.storyText")}
            </p>
            <p className="text-xs text-[#D9C9B3] font-medium tracking-wide">
              {language === "ar"
                ? "درش — قطع تكمل إطلالتك وتبرز تفاصيل أسلوبك."
                : "DRSH — Pieces that complete your style and elevate every detail."}
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              {t("footer.shopHeading")}
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li><Link href="/shop?category=watches" className="hover:text-white transition-colors">{t("nav.watches")}</Link></li>
              <li><Link href="/shop?category=bags" className="hover:text-white transition-colors">{t("nav.bags")}</Link></li>
              <li><Link href="/shop?category=jewelry" className="hover:text-white transition-colors">{t("nav.jewelry")}</Link></li>
              <li><Link href="/shop?category=eyewear" className="hover:text-white transition-colors">{t("nav.eyewear")}</Link></li>
              <li><Link href="/shop?category=wallets" className="hover:text-white transition-colors">{t("nav.wallets")}</Link></li>
              <li><Link href="/shop?category=perfumes" className="hover:text-white transition-colors">{t("nav.perfumes")}</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              {t("footer.careHeading")}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-400">
              <li><Link href="/track-order" className="hover:text-white transition-colors">{t("nav.trackOrder")}</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">{t("footer.shippingLink")}</Link></li>
              <li><Link href="/returns" className="hover:text-white transition-colors">{t("footer.returnsLink")}</Link></li>
              <li><Link href="/security" className="text-[#D9C9B3] hover:text-white font-medium transition-colors flex items-center gap-1"><span>🛡️</span><span>{t("footer.securityLink")}</span></Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">{t("nav.contact")}</Link></li>
            </ul>
          </div>

          {/* About & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              {t("footer.aboutHeading")}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-400">
              <li><Link href="/about" className="hover:text-white transition-colors">{t("nav.about")}</Link></li>
              <li><Link href="/security" className="hover:text-white transition-colors">{t("footer.securityLink")}</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">{t("footer.privacyLink")}</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">{t("footer.termsLink")}</Link></li>
              <li><Link href="/admin" className="text-neutral-500 hover:text-neutral-400 text-xs">{t("nav.admin")}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Egypt Notice */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs text-neutral-500 gap-3 sm:gap-4">
          <p>© {new Date().getFullYear()} DRSH (درش) Store. {t("footer.rights")}</p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-neutral-400 text-center">
            <span>{language === "ar" ? "الدفع نقدًا عند الاستلام (COD)" : "Cash on Delivery (COD)"}</span>
            <span>•</span>
            <span>{language === "ar" ? "معاينة مجانية مع المندوب" : "Inspection Upon Delivery"}</span>
            <span>•</span>
            <span>Bosta Logistics</span>
            <span>•</span>
            <span>{language === "ar" ? "جمهورية مصر العربية" : "Egypt"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
