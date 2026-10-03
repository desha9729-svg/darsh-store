"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS } from "@/data/mock-products";
import { useProducts } from "@/context/products-context";
import { useCart } from "@/context/cart-context";
import { useLanguage } from "@/context/language-context";
import { formatPrice } from "@/lib/utils";
import { ProductCard } from "@/components/ui/ProductCard";
import { TrustGuarantees } from "@/components/ui/TrustGuarantees";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ShoppingBag,
  ArrowRight,
  Heart,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { addItem } = useCart();
  const { language, t, isRTL } = useLanguage();
  const { products } = useProducts();

  const product = products.find((p) => p.slug === slug) || PRODUCTS.find((p) => p.slug === slug) || products[0] || PRODUCTS[0];

  const [selectedVariantId, setSelectedVariantId] = useState<string>(product?.variants?.[0]?.id || "");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Sync selected variant
  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];

  const priceLabel = (val: number) => {
    return language === "ar" ? `${val} ج.م` : formatPrice(val);
  };

  const discountAmount =
    selectedVariant?.compareAtPrice && selectedVariant.compareAtPrice > selectedVariant.price
      ? selectedVariant.compareAtPrice - selectedVariant.price
      : 0;

  const handleAddToCart = () => {
    if (selectedVariant && selectedVariant.stockQuantity > 0) {
      addItem(product, selectedVariant, quantity);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  const handleBuyNow = () => {
    if (selectedVariant && selectedVariant.stockQuantity > 0) {
      addItem(product, selectedVariant, quantity);
      router.push("/checkout");
    }
  };

  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 4);
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 md:py-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 rtl:space-x-reverse text-xs text-[#686B6B] mb-6 sm:mb-8 uppercase tracking-wider">
        <Link href="/" className="hover:text-black">{t("nav.home")}</Link>
        <ChevronIcon className="w-3.5 h-3.5" />
        <Link href={`/shop?category=${product.categorySlug}`} className="hover:text-black">
          {product.category}
        </Link>
        <ChevronIcon className="w-3.5 h-3.5" />
        <span className="text-black font-semibold line-clamp-1">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        
        {/* Left Column: Image Gallery */}
        <div className="flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex sm:flex-col gap-3 shrink-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-sm overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx
                      ? "border-[#0B0B0B] opacity-100"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main Selected Image */}
          <div className="relative aspect-square flex-1 bg-neutral-100 rounded-sm overflow-hidden border border-neutral-200 shadow-xs">
            <Image
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {discountAmount > 0 && (
              <span className="absolute top-4 left-4 bg-[#0B0B0B] text-[#D9C9B3] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-xs">
                {t("productPage.save")} {priceLabel(discountAmount)}
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Product Meta & Purchasing Controls */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs uppercase tracking-widest text-[#686B6B] mb-2">
              <span>{product.category} • {product.gender}</span>
              <span className="font-mono">{selectedVariant.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B0B0B] tracking-tight">
              {product.name}
            </h1>

            {/* Price Row */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-black text-[#0B0B0B]">
                {priceLabel(selectedVariant.price)}
              </span>
              {selectedVariant.compareAtPrice && (
                <span className="text-base text-neutral-400 line-through">
                  {priceLabel(selectedVariant.compareAtPrice)}
                </span>
              )}
            </div>

            {/* Stock Level Real Verification */}
            <div className="mt-3">
              {selectedVariant.stockQuantity > 5 ? (
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-xs border border-green-200">
                  <Check className="w-3.5 h-3.5" />
                  <span>{t("productPage.inStockNotice")}</span>
                </div>
              ) : selectedVariant.stockQuantity > 0 ? (
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xs border border-amber-300">
                  <span>{t("productPage.lowStockNotice")} ({selectedVariant.stockQuantity})</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-xs border border-red-200">
                  <span>{t("productPage.outOfStockNotice")}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="mt-6 text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 pt-6">
              {product.description}
            </p>

            {/* Variant Selector */}
            {product.variants.length > 1 && (
              <div className="mt-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0B0B0B] mb-2">
                  {t("productPage.selectStyle")}
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`px-4 py-2 text-xs font-bold tracking-wider rounded-sm border transition-all ${
                        selectedVariant?.id === v.id
                          ? "bg-[#0B0B0B] text-white border-[#0B0B0B]"
                          : "bg-white text-neutral-800 border-neutral-300 hover:border-neutral-500"
                      }`}
                    >
                      {v.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mt-5 sm:mt-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0B0B0B] mb-2">
                {t("productPage.quantity")}
              </label>
              <div className="inline-flex items-center border border-neutral-300 rounded-sm bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                  className="w-9 h-9 flex items-center justify-center text-sm font-bold text-neutral-700 hover:bg-neutral-100 transition-colors"
                >
                  -
                </button>
                <span className="w-10 text-center text-xs font-bold text-black">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(selectedVariant.stockQuantity, quantity + 1))
                  }
                  aria-label="Increase quantity"
                  className="w-9 h-9 flex items-center justify-center text-sm font-bold text-neutral-700 hover:bg-neutral-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons: Add to Bag & Buy Now */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch gap-3">
              <button
                onClick={handleAddToCart}
                disabled={selectedVariant.stockQuantity === 0}
                className={`flex-1 py-3.5 sm:py-4 px-4 sm:px-6 min-h-[44px] text-xs font-extrabold uppercase tracking-widest rounded-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] ${
                  isAdded
                    ? "bg-green-700 text-white"
                    : "bg-[#0B0B0B] text-white hover:bg-[#D9C9B3] hover:text-[#0B0B0B]"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" /> {t("productCard.addedToBag")}
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> {t("productPage.addToBag")}
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={selectedVariant.stockQuantity === 0}
                className="flex-1 py-3.5 sm:py-4 px-4 sm:px-6 min-h-[44px] bg-[#D9C9B3] text-[#0B0B0B] text-xs font-extrabold uppercase tracking-widest rounded-sm flex items-center justify-center gap-2 hover:bg-[#c5bbb0] transition-colors shadow-sm active:scale-[0.99]"
              >
                <span>{t("productPage.buyNowCod")}</span>
                <ArrowRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
              </button>

              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                aria-label="Wishlist"
                className="w-12 sm:w-14 min-h-[44px] bg-white border border-neutral-300 rounded-sm hover:border-black flex items-center justify-center transition-colors self-center sm:self-auto"
              >
                <Heart
                  className={`w-5 h-5 ${isWishlisted ? "fill-red-600 text-red-600" : "text-neutral-700"}`}
                />
              </button>
            </div>
          </div>

          {/* Delivery & Trust Assurance Card (Replaced with Global TrustGuarantees) */}
          <div className="mt-8 sm:mt-10">
            <TrustGuarantees variant="compact" showLink={true} />
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      <div className="mt-20 border-t border-neutral-200 pt-12">
        <h3 className="text-base font-bold uppercase tracking-wider text-[#0B0B0B] mb-6">
          {t("productPage.specsTitle")}
        </h3>
        <div className="max-w-xl bg-white border border-neutral-200 rounded-sm divide-y divide-neutral-100 text-xs">
          <div className="flex justify-between p-3.5">
            <span className="text-[#686B6B]">{t("productPage.brandLabel")}</span>
            <span className="font-semibold text-[#0B0B0B]">DRSH (درش)</span>
          </div>
          <div className="flex justify-between p-3.5">
            <span className="text-[#686B6B]">{t("productPage.materialLabel")}</span>
            <span className="font-semibold text-[#0B0B0B]">{product.material || "High Grade"}</span>
          </div>
          <div className="flex justify-between p-3.5">
            <span className="text-[#686B6B]">{t("productPage.targetLabel")}</span>
            <span className="font-semibold text-[#0B0B0B] capitalize">{product.gender}</span>
          </div>
          <div className="flex justify-between p-3.5">
            <span className="text-[#686B6B]">{t("productPage.sku")}</span>
            <span className="font-mono font-semibold text-[#0B0B0B]">{selectedVariant.sku}</span>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-24 border-t border-neutral-200 pt-16">
        <h3 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-[#0B0B0B] mb-8">
          {t("productPage.relatedTitle")}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
