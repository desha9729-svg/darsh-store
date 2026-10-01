"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/ecommerce";
import { useCart } from "@/context/cart-context";
import { useLanguage } from "@/context/language-context";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, Eye, Heart, Check } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { language, t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const defaultVariant = product.variants[0];
  const totalStock = product.variants.reduce((acc, v) => acc + v.stockQuantity, 0);

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.basePrice
      ? Math.round(((product.compareAtPrice - product.basePrice) / product.compareAtPrice) * 100)
      : null;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (defaultVariant && totalStock > 0) {
      addItem(product, defaultVariant, 1);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const priceLabel = (val: number) => {
    return language === "ar" ? `${val} ج.م` : formatPrice(val);
  };

  return (
    <div
      className="group relative bg-[#FFFFFF] border border-neutral-200/80 rounded-sm overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:border-neutral-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Link href={`/product/${product.slug}`} className="relative aspect-square w-full bg-neutral-100 overflow-hidden block">
        <Image
          src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discountPercent && (
            <span className="bg-[#0B0B0B] text-[#D9C9B3] text-[10px] font-bold px-2 py-0.5 rounded-xs tracking-wider uppercase">
              -{discountPercent}%
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-[#D9C9B3] text-[#0B0B0B] text-[10px] font-bold px-2 py-0.5 rounded-xs tracking-wider uppercase">
              {t("productCard.newBadge")}
            </span>
          )}
          {totalStock > 0 && totalStock <= 3 && (
            <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-xs tracking-wider uppercase">
              {t("productCard.onlyLeft")} {totalStock}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          aria-label="Wishlist"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-neutral-700 hover:text-red-600 transition-colors shadow-xs z-10"
        >
          <Heart
            className={`w-4 h-4 ${isWishlisted ? "fill-red-600 text-red-600" : ""}`}
          />
        </button>

        {/* Quick View Link overlay */}
        <div className="absolute inset-x-0 bottom-3 px-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <span className="bg-white/95 text-[#0B0B0B] text-xs font-semibold px-4 py-1.5 rounded-sm shadow-md flex items-center gap-1.5 hover:bg-black hover:text-white transition-colors">
            <Eye className="w-3.5 h-3.5" /> {t("productCard.quickView")}
          </span>
        </div>
      </Link>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-[#686B6B] uppercase tracking-wider mb-1">
            <span>{product.category}</span>
            <span>{product.gender}</span>
          </div>

          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="text-sm font-semibold text-[#0B0B0B] line-clamp-1 group-hover:text-neutral-700 transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Pricing Row */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-base font-bold text-[#0B0B0B]">
              {priceLabel(product.basePrice)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.basePrice && (
              <span className="text-xs text-neutral-400 line-through">
                {priceLabel(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart CTA */}
        <div className="mt-4 pt-3 border-t border-neutral-100">
          {totalStock > 0 ? (
            <button
              onClick={handleQuickAdd}
              disabled={isAdded}
              className={`w-full py-2.5 px-3 text-xs font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 transition-all ${
                isAdded
                  ? "bg-green-700 text-white"
                  : "bg-[#0B0B0B] text-white hover:bg-[#D9C9B3] hover:text-[#0B0B0B]"
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" /> {t("productCard.addedToBag")}
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" /> {t("productCard.addToBag")}
                </>
              )}
            </button>
          ) : (
            <button
              disabled
              className="w-full py-2.5 px-3 text-xs font-bold uppercase tracking-wider rounded-sm bg-neutral-200 text-neutral-500 cursor-not-allowed"
            >
              {t("productCard.outOfStock")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
