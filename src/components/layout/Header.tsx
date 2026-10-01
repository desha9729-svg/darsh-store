"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { Search, ShoppingBag, Menu, X, ArrowRight, ShieldCheck } from "lucide-react";

export function Header() {
  const { itemCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      {/* Top Utility Bar: Trust & COD announcement */}
      <div className="bg-[#0B0B0B] text-[#D9C9B3] text-xs py-2 px-4 text-center tracking-wider flex items-center justify-center gap-2 border-b border-neutral-800">
        <ShieldCheck className="w-3.5 h-3.5 text-[#D9C9B3]" />
        <span>Cash on Delivery Across All Egypt | شحن ودفع عند الاستلام بجميع المحافظات</span>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-[#F5F5F3]/95 backdrop-blur-md border-b border-neutral-200 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              className="p-2 text-[#0B0B0B] hover:text-[#686B6B] transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* DRSH Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* Geometric Monogram D */}
            <div className="w-10 h-10 bg-[#0B0B0B] text-[#D9C9B3] rounded-sm flex items-center justify-center font-bold text-xl tracking-tighter border border-[#D9C9B3]/40 group-hover:border-[#D9C9B3] transition-colors">
              <span>D</span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-widest text-[#0B0B0B] leading-none">
                DRSH
              </span>
              <span className="text-[10px] tracking-widest text-[#686B6B] uppercase font-semibold mt-0.5">
                درش • Accessories
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium tracking-wide">
            <Link href="/shop" className="text-[#0B0B0B] hover:text-[#686B6B] transition-colors">
              All Products
            </Link>
            <Link href="/shop?category=watches" className="text-[#0B0B0B] hover:text-[#686B6B] transition-colors">
              Watches
            </Link>
            <Link href="/shop?category=bags" className="text-[#0B0B0B] hover:text-[#686B6B] transition-colors">
              Bags
            </Link>
            <Link href="/shop?category=jewelry" className="text-[#0B0B0B] hover:text-[#686B6B] transition-colors">
              Jewelry & Rings
            </Link>
            <Link href="/shop?category=eyewear" className="text-[#0B0B0B] hover:text-[#686B6B] transition-colors">
              Eyewear
            </Link>
            <Link href="/shop?gender=men" className="text-[#686B6B] hover:text-[#0B0B0B] transition-colors">
              Men
            </Link>
            <Link href="/shop?gender=women" className="text-[#686B6B] hover:text-[#0B0B0B] transition-colors">
              Women
            </Link>
          </nav>

          {/* Actions: Search, Track, Cart */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
              className="p-2 text-[#0B0B0B] hover:text-[#686B6B] transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link
              href="/track-order"
              className="hidden sm:inline-flex text-xs font-semibold uppercase tracking-wider text-[#686B6B] hover:text-[#0B0B0B] border border-neutral-300 px-3 py-1.5 rounded-sm hover:border-[#0B0B0B] transition-colors"
            >
              Track Order
            </Link>

            {/* Bag Button with Count */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Open Cart"
              className="relative p-2 text-[#0B0B0B] hover:text-[#686B6B] transition-colors"
            >
              <ShoppingBag className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#0B0B0B] text-[#D9C9B3] text-xs font-bold rounded-full flex items-center justify-center border border-[#D9C9B3]/50">
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
                  placeholder="Search for watches, rings, bags, or styles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-[#F5F5F3] border border-neutral-300 rounded-sm py-3 px-4 pl-11 text-sm text-[#0B0B0B] placeholder-neutral-500 focus:outline-none focus:border-[#0B0B0B] transition-colors"
                />
                <Search className="absolute left-4 w-4 h-4 text-neutral-500" />
                <button
                  type="submit"
                  className="absolute right-2 px-4 py-1.5 bg-[#0B0B0B] text-white text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-neutral-800"
                >
                  Search
                </button>
              </form>
              <div className="flex items-center gap-2 mt-2 text-xs text-[#686B6B]">
                <span className="font-semibold">Popular:</span>
                <Link href="/shop?category=watches" className="hover:underline">Minimal Watch</Link>
                <span>•</span>
                <Link href="/shop?category=jewelry" className="hover:underline">Titanium Ring</Link>
                <span>•</span>
                <Link href="/shop?category=bags" className="hover:underline">Crossbody Bag</Link>
                <span>•</span>
                <Link href="/shop?category=wallets" className="hover:underline">Leather Wallet</Link>
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
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#FFFFFF] shadow-2xl flex flex-col justify-between p-6 z-50 animate-in slide-in-from-left duration-300">
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

              <div className="py-6 space-y-4">
                <p className="text-xs uppercase font-bold tracking-widest text-[#686B6B]">Collections</p>
                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-lg font-medium text-[#0B0B0B] hover:text-[#D9C9B3] transition-colors"
                >
                  All Products
                </Link>
                <Link
                  href="/shop?category=watches"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-lg font-medium text-[#0B0B0B] hover:text-[#D9C9B3] transition-colors"
                >
                  Watches
                </Link>
                <Link
                  href="/shop?category=bags"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-lg font-medium text-[#0B0B0B] hover:text-[#D9C9B3] transition-colors"
                >
                  Bags & Leather
                </Link>
                <Link
                  href="/shop?category=jewelry"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-lg font-medium text-[#0B0B0B] hover:text-[#D9C9B3] transition-colors"
                >
                  Jewelry & Rings
                </Link>
                <Link
                  href="/shop?category=eyewear"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-lg font-medium text-[#0B0B0B] hover:text-[#D9C9B3] transition-colors"
                >
                  Eyewear
                </Link>
                <Link
                  href="/shop?category=wallets"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-lg font-medium text-[#0B0B0B] hover:text-[#D9C9B3] transition-colors"
                >
                  Wallets
                </Link>
                <Link
                  href="/shop?category=perfumes"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-lg font-medium text-[#0B0B0B] hover:text-[#D9C9B3] transition-colors"
                >
                  Fragrances
                </Link>
              </div>

              <div className="pt-4 border-t border-neutral-200 space-y-3">
                <Link
                  href="/track-order"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-sm font-semibold text-[#0B0B0B]"
                >
                  <span>Track Your Order</span>
                  <ArrowRight className="w-4 h-4 text-[#686B6B]" />
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm text-[#686B6B] hover:text-black"
                >
                  About DRSH
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm text-[#686B6B] hover:text-black"
                >
                  Contact & Support
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-200 text-xs text-[#686B6B]">
              <p className="font-semibold text-[#0B0B0B]">Cash on Delivery Guaranteed</p>
              <p className="mt-1">Delivered via Bosta logistics across Egypt.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
