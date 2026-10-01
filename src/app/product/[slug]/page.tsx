"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS } from "@/data/mock-products";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import { ProductCard } from "@/components/ui/ProductCard";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ShoppingBag,
  ArrowRight,
  Heart,
  ChevronRight,
  Share2,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { addItem } = useCart();

  const product = PRODUCTS.find((p) => p.slug === slug) || PRODUCTS[0];

  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const discountAmount =
    selectedVariant.compareAtPrice && selectedVariant.compareAtPrice > selectedVariant.price
      ? selectedVariant.compareAtPrice - selectedVariant.price
      : 0;

  const handleAddToCart = () => {
    if (selectedVariant.stockQuantity > 0) {
      addItem(product, selectedVariant, quantity);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  const handleBuyNow = () => {
    if (selectedVariant.stockQuantity > 0) {
      addItem(product, selectedVariant, quantity);
      router.push("/checkout");
    }
  };

  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-[#686B6B] mb-8 uppercase tracking-wider">
        <Link href="/" className="hover:text-black">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/shop?category=${product.categorySlug}`} className="hover:text-black">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
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
                Save {formatPrice(discountAmount)}
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
                {formatPrice(selectedVariant.price)}
              </span>
              {selectedVariant.compareAtPrice && (
                <span className="text-base text-neutral-400 line-through">
                  {formatPrice(selectedVariant.compareAtPrice)}
                </span>
              )}
            </div>

            {/* Stock Level Real Verification */}
            <div className="mt-3">
              {selectedVariant.stockQuantity > 5 ? (
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-xs border border-green-200">
                  <Check className="w-3.5 h-3.5" />
                  <span>In Stock (متوفر للشحن الفوري)</span>
                </div>
              ) : selectedVariant.stockQuantity > 0 ? (
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xs border border-amber-300">
                  <span>Only {selectedVariant.stockQuantity} Left in Stock (متبقي كمية محدودة)</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-xs border border-red-200">
                  <span>Out of Stock (نفد من المخزون)</span>
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
                  Select Style / Color:
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 text-xs font-bold tracking-wider rounded-sm border transition-all ${
                        selectedVariant.id === v.id
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
            <div className="mt-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0B0B0B] mb-2">
                Quantity:
              </label>
              <div className="inline-flex items-center border border-neutral-300 rounded-sm bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100"
                >
                  -
                </button>
                <span className="px-4 py-2 text-xs font-bold text-black">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(selectedVariant.stockQuantity, quantity + 1))
                  }
                  className="px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons: Add to Bag & Buy Now */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch gap-3">
              <button
                onClick={handleAddToCart}
                disabled={selectedVariant.stockQuantity === 0}
                className={`flex-1 py-4 px-6 text-xs font-extrabold uppercase tracking-widest rounded-sm flex items-center justify-center gap-2 shadow-md transition-all ${
                  isAdded
                    ? "bg-green-700 text-white"
                    : "bg-[#0B0B0B] text-white hover:bg-[#D9C9B3] hover:text-[#0B0B0B]"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add to Bag
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={selectedVariant.stockQuantity === 0}
                className="flex-1 py-4 px-6 bg-[#D9C9B3] text-[#0B0B0B] text-xs font-extrabold uppercase tracking-widest rounded-sm flex items-center justify-center gap-2 hover:bg-[#c5bbb0] transition-colors shadow-sm"
              >
                <span>Buy Now (Cash on Delivery)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                aria-label="Wishlist"
                className="px-4 py-4 bg-white border border-neutral-300 rounded-sm hover:border-black flex items-center justify-center transition-colors"
              >
                <Heart
                  className={`w-5 h-5 ${isWishlisted ? "fill-red-600 text-red-600" : "text-neutral-700"}`}
                />
              </button>
            </div>
          </div>

          {/* Delivery & Trust Assurance Card */}
          <div className="mt-10 p-5 bg-white border border-neutral-200 rounded-sm space-y-3">
            <div className="flex items-center gap-3 text-xs text-[#0B0B0B]">
              <ShieldCheck className="w-4 h-4 text-[#D9C9B3] shrink-0" />
              <span><strong>Cash on Delivery (COD):</strong> الدفع نقدًا عند الاستلام فقط بدون أي بطاقات دفع.</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#0B0B0B]">
              <Truck className="w-4 h-4 text-[#D9C9B3] shrink-0" />
              <span><strong>Fast Shipping:</strong> شحن لجميع محافظات مصر خلال 24 - 72 ساعة عبر بوسطة.</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#0B0B0B]">
              <RotateCcw className="w-4 h-4 text-[#D9C9B3] shrink-0" />
              <span><strong>Inspection Guarantee:</strong> حق فتح الشحنة ومعاينتها قبل الاستلام مع المندوب.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      <div className="mt-20 border-t border-neutral-200 pt-12">
        <h3 className="text-base font-bold uppercase tracking-wider text-[#0B0B0B] mb-6">
          Product Details & Specifications
        </h3>
        <div className="max-w-xl bg-white border border-neutral-200 rounded-sm divide-y divide-neutral-100 text-xs">
          <div className="flex justify-between p-3.5">
            <span className="text-[#686B6B]">Brand</span>
            <span className="font-semibold text-[#0B0B0B]">DRSH (درش)</span>
          </div>
          <div className="flex justify-between p-3.5">
            <span className="text-[#686B6B]">Material</span>
            <span className="font-semibold text-[#0B0B0B]">{product.material || "High Grade"}</span>
          </div>
          <div className="flex justify-between p-3.5">
            <span className="text-[#686B6B]">Target</span>
            <span className="font-semibold text-[#0B0B0B] capitalize">{product.gender}</span>
          </div>
          <div className="flex justify-between p-3.5">
            <span className="text-[#686B6B]">Active SKU</span>
            <span className="font-mono font-semibold text-[#0B0B0B]">{selectedVariant.sku}</span>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-24 border-t border-neutral-200 pt-16">
        <h3 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-[#0B0B0B] mb-8">
          You May Also Like
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
