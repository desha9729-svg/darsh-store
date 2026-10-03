"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { useLanguage } from "@/context/language-context";
import { CATEGORIES } from "@/data/mock-products";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
  Globe,
  ChevronDown,
} from "lucide-react";

function HeaderNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { language, toggleLanguage, t, isRTL } = useLanguage();
  const { itemCount, setIsCartOpen } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const activeCategory = searchParams.get("category");
  const activeGender = searchParams.get("gender");

  const isAllActive = pathname === "/shop" && !activeCategory && !activeGender;
  const isWatchesActive = pathname === "/shop" && activeCategory === "watches";
  const isBagsActive = pathname === "/shop" && activeCategory === "bags";
  const isJewelryActive = pathname === "/shop" && activeCategory === "jewelry";
  const isEyewearActive = pathname === "/shop" && activeCategory === "eyewear";
  const isMenActive = pathname === "/shop" && activeGender === "men";
  const isWomenActive = pathname === "/shop" && activeGender === "women";

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const getCategoryTitle = (slug: string) => {
    if (language === "ar") {
      switch (slug) {
        case "watches": return "ساعات";
        case "bags": return "حقائب وجلود";
        case "jewelry": return "مجوهرات وخواتم";
        case "eyewear": return "نظارات";
        case "wallets": return "محافظ";
        case "perfumes": return "عطور";
        default: return slug;
      }
    }
    switch (slug) {
      case "watches": return "Watches";
      case "bags": return "Bags & Leather";
      case "jewelry": return "Jewelry & Rings";
      case "eyewear": return "Eyewear";
      case "wallets": return "Wallets";
      case "perfumes": return "Fragrances";
      default: return slug;
    }
  };

  return (
    <>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-[#F5F5F3]/95 backdrop-blur-md border-b border-neutral-200 transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              className="w-10 h-10 flex items-center justify-center text-[#0B0B0B] hover:text-[#686B6B] transition-colors rounded-sm"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* DRSH Brand Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#0B0B0B] text-[#D9C9B3] rounded-sm flex items-center justify-center font-bold text-lg sm:text-xl tracking-tighter border border-[#D9C9B3]/40 group-hover:border-[#D9C9B3] transition-colors">
              <span>D</span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl sm:text-2xl tracking-widest text-[#0B0B0B] leading-none">
                DRSH
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-widest text-[#686B6B] uppercase font-semibold mt-0.5">
                {t("brand.subTagline")}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm font-medium tracking-wide">
            
            {/* Shop All with Dropdown */}
            <div
              className="relative py-2"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <Link
                href="/shop"
                className={`relative py-1.5 flex items-center gap-1 transition-colors ${
                  isAllActive
                    ? "text-[#0B0B0B] font-bold after:content-[''] after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-[#0B0B0B]"
                    : "text-[#0B0B0B] hover:text-[#686B6B]"
                }`}
              >
                <span>{t("nav.allProducts")}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#686B6B]" />
              </Link>

              {/* Mega Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute top-full -left-4 rtl:-left-auto rtl:-right-4 w-72 bg-white border border-neutral-200 rounded-sm shadow-xl p-3 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                  <div className="p-2 border-b border-neutral-100 text-[11px] font-bold uppercase tracking-wider text-[#686B6B]">
                    {language === "ar" ? "تصفح حسب القسم" : "Browse by Category"}
                  </div>
                  <div className="py-2 space-y-1">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/shop?category=${cat.slug}`}
                        onClick={() => setDropdownOpen(false)}
                        className={`flex items-center justify-between p-2 rounded-xs text-xs font-semibold hover:bg-neutral-50 hover:text-black transition-colors ${
                          activeCategory === cat.slug
                            ? "bg-[#D9C9B3]/25 text-black font-bold"
                            : "text-[#0B0B0B]"
                        }`}
                      >
                        <span>{getCategoryTitle(cat.slug)}</span>
                        <span className="text-[10px] text-neutral-400 font-normal">
                          {cat.itemCount}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Direct Category Links */}
            <Link
              href="/shop?category=watches"
              className={`relative py-1.5 transition-colors ${
                isWatchesActive
                  ? "text-[#0B0B0B] font-bold after:content-[''] after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-[#0B0B0B]"
                  : "text-[#0B0B0B] hover:text-[#686B6B]"
              }`}
            >
              {t("nav.watches")}
            </Link>

            <Link
              href="/shop?category=bags"
              className={`relative py-1.5 transition-colors ${
                isBagsActive
                  ? "text-[#0B0B0B] font-bold after:content-[''] after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-[#0B0B0B]"
                  : "text-[#0B0B0B] hover:text-[#686B6B]"
              }`}
            >
              {t("nav.bags")}
            </Link>

            <Link
              href="/shop?category=jewelry"
              className={`relative py-1.5 transition-colors ${
                isJewelryActive
                  ? "text-[#0B0B0B] font-bold after:content-[''] after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-[#0B0B0B]"
                  : "text-[#0B0B0B] hover:text-[#686B6B]"
              }`}
            >
              {t("nav.jewelry")}
            </Link>

            <Link
              href="/shop?category=eyewear"
              className={`relative py-1.5 transition-colors ${
                isEyewearActive
                  ? "text-[#0B0B0B] font-bold after:content-[''] after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-[#0B0B0B]"
                  : "text-[#0B0B0B] hover:text-[#686B6B]"
              }`}
            >
              {t("nav.eyewear")}
            </Link>

            {/* Gender links */}
            <div className="h-4 w-px bg-neutral-300 mx-1" />

            <Link
              href="/shop?gender=men"
              className={`relative py-1.5 transition-colors ${
                isMenActive
                  ? "text-[#0B0B0B] font-bold after:content-[''] after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-[#0B0B0B]"
                  : "text-[#686B6B] hover:text-[#0B0B0B]"
              }`}
            >
              {t("nav.men")}
            </Link>

            <Link
              href="/shop?gender=women"
              className={`relative py-1.5 transition-colors ${
                isWomenActive
                  ? "text-[#0B0B0B] font-bold after:content-[''] after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-[#0B0B0B]"
                  : "text-[#686B6B] hover:text-[#0B0B0B]"
              }`}
            >
              {t("nav.women")}
            </Link>
          </nav>

          {/* Actions: Search, Language Switcher, Track, Cart */}
          <div className="flex items-center gap-1.5 sm:gap-4">
            {/* Quick Mobile Language Switcher (1-tap access on phone) */}
            <button
              onClick={toggleLanguage}
              aria-label="Change Language"
              className="inline-flex sm:hidden items-center justify-center px-2 py-1 border border-neutral-300 rounded-sm text-[11px] font-bold text-[#0B0B0B] hover:bg-neutral-100 min-h-[36px] transition-colors"
            >
              <Globe className="w-3 h-3 mr-1 rtl:mr-0 rtl:ml-1 text-neutral-600" />
              <span>{language === "ar" ? "EN" : "عربي"}</span>
            </button>

            {/* Desktop Language Switcher */}
            <button
              onClick={toggleLanguage}
              aria-label="Change Language"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 border border-neutral-300 rounded-sm text-xs font-bold text-[#0B0B0B] hover:border-[#0B0B0B] hover:bg-neutral-100 min-h-[38px] transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[#686B6B]" />
              <span>{language === "ar" ? "English" : "عربي"}</span>
            </button>

            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
              className="w-10 h-10 flex items-center justify-center text-[#0B0B0B] hover:text-[#686B6B] rounded-sm transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link
              href="/track-order"
              className="hidden md:inline-flex items-center text-xs font-semibold uppercase tracking-wider text-[#686B6B] hover:text-[#0B0B0B] border border-neutral-300 px-3 py-1.5 rounded-sm hover:border-[#0B0B0B] min-h-[38px] transition-colors"
            >
              {t("nav.trackOrder")}
            </Link>

            {/* Bag Button with Count */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Open Cart"
              className="relative w-10 h-10 flex items-center justify-center text-[#0B0B0B] hover:text-[#686B6B] rounded-sm transition-colors"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              {itemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 sm:-top-1 sm:-right-1 w-4.5 h-4.5 sm:w-5 sm:h-5 bg-[#0B0B0B] text-[#D9C9B3] text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center border border-[#D9C9B3]/50">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Expandable Search Drawer */}
        {searchOpen && (
          <div className="border-t border-neutral-200 bg-[#FFFFFF] px-4 py-4 shadow-md transition-all">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  placeholder={t("nav.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-[#F5F5F3] border border-neutral-300 rounded-sm py-3 px-10 text-sm text-[#0B0B0B] placeholder-neutral-500 focus:outline-none focus:border-[#0B0B0B] transition-colors"
                />
                <Search className={`absolute ${isRTL ? "right-3" : "left-3"} w-4 h-4 text-neutral-500`} />
                <button
                  type="submit"
                  className={`absolute ${isRTL ? "left-2" : "right-2"} px-4 py-1.5 bg-[#0B0B0B] text-white text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-neutral-800`}
                >
                  {language === "ar" ? "بحث" : "Search"}
                </button>
              </form>
              <div className="flex items-center gap-2 mt-2 text-xs text-[#686B6B]">
                <span className="font-semibold">{t("nav.popular")}</span>
                <Link href="/shop?category=watches" className="hover:underline">{t("nav.watches")}</Link>
                <span>•</span>
                <Link href="/shop?category=jewelry" className="hover:underline">{t("nav.jewelry")}</Link>
                <span>•</span>
                <Link href="/shop?category=bags" className="hover:underline">{t("nav.bags")}</Link>
                <span>•</span>
                <Link href="/shop?category=wallets" className="hover:underline">{t("nav.wallets")}</Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            className={`fixed inset-y-0 ${
              isRTL ? "right-0" : "left-0"
            } max-w-xs w-full bg-[#FFFFFF] shadow-2xl flex flex-col justify-between p-6 z-50`}
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#0B0B0B] text-[#D9C9B3] rounded-sm flex items-center justify-center font-bold text-lg">
                    D
                  </div>
                  <span className="font-extrabold text-xl tracking-widest text-[#0B0B0B]">
                    DRSH
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-neutral-600 hover:text-black"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Language Switcher in Mobile Drawer */}
              <div className="py-4 border-b border-neutral-200 flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-600">
                  {language === "ar" ? "اللغة:" : "Language:"}
                </span>
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-1.5 px-3 py-1 bg-[#F5F5F3] border border-neutral-300 rounded-sm text-xs font-bold text-black"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{language === "ar" ? "English" : "العربية"}</span>
                </button>
              </div>

              <div className="py-6 space-y-4">
                <p className="text-xs uppercase font-bold tracking-widest text-[#686B6B]">
                  {language === "ar" ? "الأقسام" : "Collections"}
                </p>
                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block text-lg font-medium transition-colors ${
                    isAllActive ? "font-bold text-black" : "text-[#0B0B0B] hover:text-[#D9C9B3]"
                  }`}
                >
                  {t("nav.allProducts")}
                </Link>
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block text-lg font-medium transition-colors ${
                      activeCategory === cat.slug
                        ? "font-bold text-black"
                        : "text-[#0B0B0B] hover:text-[#D9C9B3]"
                    }`}
                  >
                    {getCategoryTitle(cat.slug)}
                  </Link>
                ))}
              </div>

              <div className="pt-4 border-t border-neutral-200 space-y-3">
                <Link
                  href="/track-order"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-sm font-semibold text-[#0B0B0B]"
                >
                  <span>{t("nav.trackOrder")}</span>
                  <ArrowRight className={`w-4 h-4 text-[#686B6B] ${isRTL ? "rotate-180" : ""}`} />
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm text-[#686B6B] hover:text-black"
                >
                  {t("nav.about")}
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm text-[#686B6B] hover:text-black"
                >
                  {t("nav.contact")}
                </Link>
                <div className="pt-2 border-t border-neutral-100 flex flex-col space-y-2 text-xs text-[#686B6B]">
                  <Link
                    href="/security"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-black font-medium"
                  >
                    🛡️ {language === "ar" ? "سياسة الأمان وحماية المشتري" : "Buyer Protection & Security"}
                  </Link>
                  <Link
                    href="/shipping"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-black"
                  >
                    🚚 {language === "ar" ? "الشحن ومواعيد التوصيل" : "Shipping & Delivery"}
                  </Link>
                  <Link
                    href="/returns"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-black"
                  >
                    🔄 {language === "ar" ? "سياسة الاسترجاع والاستبدال" : "Returns & Exchanges"}
                  </Link>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200 text-xs text-[#686B6B]">
              <p className="font-semibold text-[#0B0B0B]">{t("hero.codBadge")}</p>
              <p className="mt-1">{t("hero.shippingBadge")}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function Header() {
  return (
    <Suspense fallback={<div className="h-28 bg-[#F5F5F3]" />}>
      <HeaderNav />
    </Suspense>
  );
}
