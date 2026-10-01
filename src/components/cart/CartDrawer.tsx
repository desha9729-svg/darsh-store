"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, ArrowRight } from "lucide-react";

export function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, subtotal, itemCount } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#0B0B0B]" />
              <h2 className="text-base font-bold uppercase tracking-wider text-[#0B0B0B]">
                Your Bag ({itemCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-black rounded-sm hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-[#0B0B0B]">Your bag is empty</h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                  Explore our curated accessories and find pieces that complete your personal style.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 px-6 py-2.5 bg-[#0B0B0B] text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#D9C9B3] hover:text-[#0B0B0B] transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-6 border-b border-neutral-100">
                  <div className="relative w-20 h-20 bg-neutral-100 rounded-sm overflow-hidden shrink-0">
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
                        <h4 className="text-sm font-semibold text-[#0B0B0B] line-clamp-1">
                          {item.productName}
                        </h4>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-neutral-400 hover:text-red-600 transition-colors ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-[#686B6B] mt-0.5">{item.variantTitle}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-neutral-200 rounded-sm">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="p-1 hover:bg-neutral-100 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5 text-neutral-600" />
                        </button>
                        <span className="px-3 text-xs font-semibold text-[#0B0B0B]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="p-1 hover:bg-neutral-100 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5 text-neutral-600" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-[#0B0B0B]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-6 bg-neutral-50 border-t border-neutral-200 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-neutral-600 text-xs">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#0B0B0B]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-500 text-xs">
                  <span>Shipping (Egypt)</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="pt-2 border-t border-neutral-200 flex justify-between text-base font-bold text-[#0B0B0B]">
                  <span>Estimated Total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>

              {/* COD Notice */}
              <div className="flex items-center gap-2 p-2.5 bg-[#D9C9B3]/25 border border-[#D9C9B3]/60 rounded-sm text-xs text-[#0B0B0B]">
                <ShieldCheck className="w-4 h-4 text-[#0B0B0B] shrink-0" />
                <span>Cash on Delivery: Pay only when your courier arrives.</span>
              </div>

              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-3.5 px-4 bg-[#0B0B0B] text-white text-xs font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors shadow-md"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
