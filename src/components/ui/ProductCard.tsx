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
      <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex flex-col gap-1 z-10">
        {discountPercent && (
          <span className="bg-[#0B0B0B] text-[#D9C9B3] text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-xs tracking-wider uppercase shadow-2xs">
            -{discountPercent}%
          </span>
        )}
        {product.isNewArrival && (
          <span className="bg-[#D9C9B3] text-[#0B0B0B] text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-xs tracking-wider uppercase shadow-2xs">
            {t("productCard.newBadge")}
          </span>
        )}
        {totalStock > 0 && totalStock <= 3 && (
          <span className="bg-amber-600 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-xs tracking-wider uppercase shadow-2xs">
            {t("productCard.onlyLeft")} {totalStock}
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        aria-label="Wishlist"
        className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-neutral-700 hover:text-red-600 transition-colors shadow-2xs z-10"
      >
        <Heart
          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? "fill-red-600 text-red-600" : ""}`}
        />
      </button>

      {/* Quick View Link overlay (Desktop Only) */}
      <div className="hidden md:flex absolute inset-x-0 bottom-3 px-3 justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <span className="bg-white/95 text-[#0B0B0B] text-xs font-semibold px-4 py-1.5 rounded-sm shadow-md flex items-center gap-1.5 hover:bg-black hover:text-white transition-colors">
          <Eye className="w-3.5 h-3.5" /> {t("productCard.quickView")}
        </span>
      </div>
    </Link>

    {/* Product Content Details */}
    <div className="p-2.5 sm:p-3.5 md:p-4 flex flex-col flex-grow justify-between">
      <div>
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-[#686B6B] uppercase tracking-wider mb-1">
          <span className="truncate max-w-[60%]">{product.category}</span>
          <span className="shrink-0">{product.gender}</span>
        </div>

        <Link href={`/product/${product.slug}`} className="block">
          <h3 className="text-xs sm:text-sm font-semibold text-[#0B0B0B] line-clamp-2 leading-snug min-h-[2rem] sm:min-h-[2.5rem] group-hover:text-neutral-700 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Pricing Row */}
        <div className="mt-1.5 sm:mt-2 flex items-baseline gap-1.5 sm:gap-2">
          <span className="text-sm sm:text-base font-extrabold text-[#0B0B0B]">
            {priceLabel(product.basePrice)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.basePrice && (
            <span className="text-[10px] sm:text-xs text-neutral-400 line-through">
              {priceLabel(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>

      {/* Add to Cart CTA */}
      <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-neutral-100">
        {totalStock > 0 ? (
          <button
            onClick={handleQuickAdd}
            disabled={isAdded}
            className={`w-full py-2 sm:py-2.5 px-2 min-h-[36px] sm:min-h-[38px] text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] ${
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
            className="w-full py-2 sm:py-2.5 px-2 min-h-[36px] sm:min-h-[38px] text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-xs bg-neutral-200 text-neutral-500 cursor-not-allowed"
          >
            {t("productCard.outOfStock")}
          </button>
        )}
      </div>
    </div>
    </div>
  );
}
