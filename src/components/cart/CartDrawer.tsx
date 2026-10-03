"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { useLanguage } from "@/context/language-context";
import { formatPrice } from "@/lib/utils";
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, ArrowRight } from "lucide-react";

export function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, subtotal, itemCount } = useCart();
  const { language, t, isRTL } = useLanguage();

  if (!isCartOpen) return null;

  const priceLabel = (val: number) => {
    return language === "ar" ? `${val} ج.م` : formatPrice(val);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div
        className={`fixed inset-y-0 ${
          isRTL ? "left-0 pr-10" : "right-0 pl-10"
        } max-w-full flex`}
      >
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#0B0B0B]" />
              <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-[#0B0B0B]">
                {t("cart.title")} ({itemCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              aria-label="Close cart"
              className="w-9 h-9 flex items-center justify-center text-neutral-500 hover:text-black rounded-sm hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-[#0B0B0B]">{t("cart.emptyTitle")}</h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                  {t("cart.emptyDesc")}
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 px-6 py-2.5 bg-[#0B0B0B] text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#D9C9B3] hover:text-[#0B0B0B] transition-colors min-h-[40px]"
                >
                  {t("cart.exploreBtn")}
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-neutral-100">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-neutral-100 rounded-sm overflow-hidden shrink-0">
                    <Image
                      src={item.image}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs sm:text-sm font-semibold text-[#0B0B0B] line-clamp-1">
                          {item.productName}
                        </h4>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          aria-label="Remove item"
                          className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-red-600 transition-colors ml-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[11px] sm:text-xs text-[#686B6B] mt-0.5">{item.variantTitle}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2 sm:mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-neutral-200 rounded-sm">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="w-7 h-7 flex items-center justify-center hover:bg-neutral-100 transition-colors text-neutral-600"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-[#0B0B0B]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="w-7 h-7 flex items-center justify-center hover:bg-neutral-100 transition-colors text-neutral-600"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-xs sm:text-sm font-bold text-[#0B0B0B]">
                        {priceLabel(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 bg-neutral-50 border-t border-neutral-200 space-y-3 sm:space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-neutral-600 text-xs">
                  <span>{t("cart.subtotal")}</span>
                  <span className="font-semibold text-[#0B0B0B]">{priceLabel(subtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-500 text-[11px] sm:text-xs">
                  <span>{t("cart.shippingNotice")}</span>
                </div>
                <div className="pt-2 border-t border-neutral-200 flex justify-between text-sm sm:text-base font-bold text-[#0B0B0B]">
                  <span>{t("cart.total")}</span>
                  <span>{priceLabel(subtotal)}</span>
                </div>
              </div>

              {/* COD & Inspection Notice */}
              <div className="flex items-center gap-2 p-2 sm:p-2.5 bg-[#D9C9B3]/25 border border-[#D9C9B3]/60 rounded-sm text-[11px] sm:text-xs text-[#0B0B0B]">
                <ShieldCheck className="w-4 h-4 text-[#0B0B0B] shrink-0" />
                <span>{t("cart.codNotice")}</span>
              </div>

              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-3.5 px-4 bg-[#0B0B0B] text-white text-xs font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors shadow-md min-h-[44px]"
              >
                <span>{t("cart.checkoutBtn")}</span>
                <ArrowRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
