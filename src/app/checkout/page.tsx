"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { useLanguage } from "@/context/language-context";
import { formatPrice } from "@/lib/utils";
import { EGYPTIAN_GOVERNORATES, getShippingByGovernorate } from "@/data/egypt-governorates";
import { createOrderInDatabase } from "@/lib/database-service";
import { validateCoupon, incrementCouponUsage } from "@/lib/coupons-store";
import { ShieldCheck, Truck, Lock, ArrowLeft, ArrowRight, Tag, CheckCircle2 } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { language, t, isRTL } = useLanguage();

  // Egyptian Address Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [secondaryPhone, setSecondaryPhone] = useState("");
  const [email, setEmail] = useState("");
  const [governorate, setGovernorate] = useState(EGYPTIAN_GOVERNORATES[0].id);
  const [city, setCity] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [buildingNo, setBuildingNo] = useState("");
  const [floorNo, setFloorNo] = useState("");
  const [apartmentNo, setApartmentNo] = useState("");
  const [landmark, setLandmark] = useState("");
  const [notes, setNotes] = useState("");

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponSuccessMsg, setCouponSuccessMsg] = useState("");
  const [couponError, setCouponError] = useState("");

  // Order submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Dynamic Shipping calculation
  const shippingInfo = useMemo(() => {
    return getShippingByGovernorate(governorate);
  }, [governorate]);

  const totalAmount = Math.max(0, subtotal + shippingInfo.fee - discountAmount);

  const priceLabel = (val: number) => {
    return language === "ar" ? `${val} ج.م` : formatPrice(val);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccessMsg("");
    
    if (!couponCode.trim()) return;

    const res = validateCoupon(couponCode, subtotal);
    if (res.valid) {
      setDiscountAmount(res.discountAmount);
      setCouponApplied(true);
      setCouponSuccessMsg(
        language === "ar"
          ? res.message
          : `Coupon applied! You saved ${res.discountAmount} EGP.`
      );
    } else {
      setCouponError(
        language === "ar"
          ? res.message
          : res.message.includes("الحد الأدنى")
          ? "Minimum order amount not met."
          : "Invalid or inactive coupon code."
      );
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!fullName.trim()) {
      setFormError(language === "ar" ? "يرجى كتابة الاسم بالكامل." : "Please enter your full name.");
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setFormError(language === "ar" ? "يرجى إدخال رقم موبايل مصري صحيح (مثال: 010xxxxxxxx)." : "Please enter a valid Egyptian mobile phone number.");
      return;
    }
    if (!city.trim() || !streetAddress.trim()) {
      setFormError(language === "ar" ? "يرجى توضيح المدينة واسم الشارع بالتفصيل." : "Please provide your city and full street address.");
      return;
    }

    setIsSubmitting(true);

    const randomOrderNum = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `DRSH-${randomOrderNum}`;

    const orderRecord = {
      orderNumber,
      customerName: fullName,
      phone,
      governorate: shippingInfo.nameEn,
      governorateAr: shippingInfo.nameAr,
      city,
      streetAddress,
      buildingNo,
      floorNo,
      apartmentNo,
      landmark,
      notes,
      items,
      subtotal,
      shippingFee: shippingInfo.fee,
      discountAmount,
      totalAmount,
      status: "pending_confirmation",
      createdAt: new Date().toISOString(),
      bostaTrackingNumber: `BST-${randomOrderNum}-EGY`,
    };

    // Save to local storage for instant receipt rendering
    try {
      localStorage.setItem(`drsh_order_${orderNumber}`, JSON.stringify(orderRecord));
      localStorage.setItem("drsh_latest_order", orderNumber);
    } catch {
      // storage
    }

    // Save to Supabase PostgreSQL if configured
    createOrderInDatabase({
      orderNumber,
      address: {
        fullName,
        phone,
        secondaryPhone,
        email,
        governorate: shippingInfo.nameAr,
        city,
        streetAddress,
        buildingNo,
        floorNo,
        apartmentNo,
        landmark,
        notes,
      },
      items,
      subtotal,
      shippingFee: shippingInfo.fee,
      discount: discountAmount,
      totalAmount,
      status: "pending_confirmation",
      bostaTrackingNumber: `BST-${randomOrderNum}-EGY`,
    }).catch((err) => console.warn("Supabase order sync:", err));

    // Increment coupon usage count if applied
    if (couponApplied && couponCode.trim()) {
      incrementCouponUsage(couponCode.trim());
    }

    setTimeout(() => {
      clearCart();
      router.push(`/order/confirmed/${orderNumber}`);
    }, 800);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-[#0B0B0B]">{t("cart.emptyTitle")}</h2>
        <p className="text-sm text-neutral-500 mt-2">
          {t("cart.emptyDesc")}
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex px-8 py-3 bg-[#0B0B0B] text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#D9C9B3] hover:text-[#0B0B0B] transition-colors"
        >
          {t("cart.exploreBtn")}
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F5F3] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation back */}
        <div className="mb-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#686B6B] hover:text-[#0B0B0B]"
          >
            <ArrowLeft className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
            <span>{t("checkout.backBtn")}</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Form: Customer Details & Egyptian Address */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B0B0B] uppercase tracking-tight">
                {t("checkout.heading")}
              </h1>
              <p className="text-xs text-[#686B6B] mt-1 uppercase tracking-wider">
                {t("checkout.subheading")}
              </p>
            </div>

            {formError && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-sm">
                {formError}
              </div>
            )}

            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-8">
              
              {/* 1. Customer Information */}
              <div className="bg-white p-6 sm:p-8 rounded-sm border border-neutral-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#0B0B0B] pb-3 border-b border-neutral-100 flex items-center justify-between">
                  <span>{t("checkout.step1Title")}</span>
                  <span className="text-[10px] text-[#686B6B] font-mono">STEP 01</span>
                </h3>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0B0B0B] mb-1.5">
                    {t("checkout.fullName")}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t("checkout.fullNamePlaceholder")}
                    className="w-full bg-[#F5F5F3] border border-neutral-300 rounded-sm p-3 text-sm focus:outline-none focus:border-[#0B0B0B]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0B0B0B] mb-1.5">
                      {t("checkout.phone")}
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t("checkout.phonePlaceholder")}
                      className="w-full bg-[#F5F5F3] border border-neutral-300 rounded-sm p-3 text-sm focus:outline-none focus:border-[#0B0B0B]"
                    />
                    <span className="text-[10px] text-[#686B6B] mt-1 block">
                      {t("checkout.phoneNotice")}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0B0B0B] mb-1.5">
                      {t("checkout.secondaryPhone")}
                    </label>
                    <input
                      type="tel"
                      value={secondaryPhone}
                      onChange={(e) => setSecondaryPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full bg-[#F5F5F3] border border-neutral-300 rounded-sm p-3 text-sm focus:outline-none focus:border-[#0B0B0B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0B0B0B] mb-1.5">
                    {t("checkout.email")}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ahmed@example.com"
                    className="w-full bg-[#F5F5F3] border border-neutral-300 rounded-sm p-3 text-sm focus:outline-none focus:border-[#0B0B0B]"
                  />
                </div>
              </div>

              {/* 2. Egyptian Shipping Address */}
              <div className="bg-white p-6 sm:p-8 rounded-sm border border-neutral-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#0B0B0B] pb-3 border-b border-neutral-100 flex items-center justify-between">
                  <span>{t("checkout.step2Title")}</span>
                  <span className="text-[10px] text-[#686B6B] font-mono">STEP 02</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0B0B0B] mb-1.5">
                      {t("checkout.governorate")}
                    </label>
                    <select
                      value={governorate}
                      onChange={(e) => setGovernorate(e.target.value)}
                      className="w-full bg-[#F5F5F3] border border-neutral-300 rounded-sm p-3 text-sm font-medium focus:outline-none focus:border-[#0B0B0B]"
                    >
                      {EGYPTIAN_GOVERNORATES.map((g) => (
                        <option key={g.id} value={g.id}>
                          {language === "ar" ? `${g.nameAr} - ${g.nameEn}` : `${g.nameEn} - ${g.nameAr}`} ({priceLabel(g.fee)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0B0B0B] mb-1.5">
                      {t("checkout.city")}
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder={t("checkout.cityPlaceholder")}
                      className="w-full bg-[#F5F5F3] border border-neutral-300 rounded-sm p-3 text-sm focus:outline-none focus:border-[#0B0B0B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0B0B0B] mb-1.5">
                    {t("checkout.street")}
                  </label>
                  <input
                    type="text"
                    required
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder={language === "ar" ? "اسم الشارع وتفاصيل العنوان" : "Street name and prominent details"}
                    className="w-full bg-[#F5F5F3] border border-neutral-300 rounded-sm p-3 text-sm focus:outline-none focus:border-[#0B0B0B]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#0B0B0B] mb-1">
                      {t("checkout.bldg")}
                    </label>
                    <input
                      type="text"
                      value={buildingNo}
                      onChange={(e) => setBuildingNo(e.target.value)}
                      placeholder="14"
                      className="w-full bg-[#F5F5F3] border border-neutral-300 rounded-sm p-2.5 text-xs focus:outline-none focus:border-[#0B0B0B]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#0B0B0B] mb-1">
                      {t("checkout.floor")}
                    </label>
                    <input
                      type="text"
                      value={floorNo}
                      onChange={(e) => setFloorNo(e.target.value)}
                      placeholder="3"
                      className="w-full bg-[#F5F5F3] border border-neutral-300 rounded-sm p-2.5 text-xs focus:outline-none focus:border-[#0B0B0B]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#0B0B0B] mb-1">
                      {t("checkout.apt")}
                    </label>
                    <input
                      type="text"
                      value={apartmentNo}
                      onChange={(e) => setApartmentNo(e.target.value)}
                      placeholder="12"
                      className="w-full bg-[#F5F5F3] border border-neutral-300 rounded-sm p-2.5 text-xs focus:outline-none focus:border-[#0B0B0B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0B0B0B] mb-1.5">
                    {t("checkout.landmark")}
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder={language === "ar" ? "مثال: بجوار صيدلية العزبي، رن الجرس" : "e.g. Next to Metro Market, Ring doorbell"}
                    className="w-full bg-[#F5F5F3] border border-neutral-300 rounded-sm p-3 text-sm focus:outline-none focus:border-[#0B0B0B]"
                  />
                </div>
              </div>

              {/* 3. Payment Method: Cash on Delivery (Strictly COD) */}
              <div className="bg-white p-6 sm:p-8 rounded-sm border border-neutral-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#0B0B0B] pb-3 border-b border-neutral-100 flex items-center justify-between">
                  <span>{t("checkout.step3Title")}</span>
                  <span className="text-[10px] text-[#686B6B] font-mono">STEP 03</span>
                </h3>

                <div className="p-4 border-2 border-[#0B0B0B] bg-[#F5F5F3] rounded-sm flex items-start gap-4">
                  <div className="w-5 h-5 rounded-full border-4 border-[#0B0B0B] bg-white shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-[#0B0B0B]">
                        {t("checkout.codTitle")}
                      </span>
                      <span className="bg-[#0B0B0B] text-[#D9C9B3] text-[9px] font-bold uppercase px-2 py-0.5 rounded-xs">
                        {t("checkout.codBadge")}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                      {t("checkout.codDesc")}
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column: Order Summary & Placement */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-sm border border-neutral-200 shadow-xs sticky top-28 space-y-6">
              <h3 className="text-base font-bold uppercase tracking-wider text-[#0B0B0B] pb-4 border-b border-neutral-200">
                {t("checkout.summaryTitle")} ({items.length})
              </h3>

              {/* Items List */}
              <div className="max-h-64 overflow-y-auto divide-y divide-neutral-100 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="py-3 flex items-center gap-3">
                    <div className="relative w-14 h-14 bg-neutral-100 rounded-xs overflow-hidden shrink-0">
                      <Image src={item.image} alt={item.productName} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-[#0B0B0B] truncate">
                        {item.productName}
                      </h4>
                      <p className="text-[11px] text-[#686B6B]">{item.variantTitle} × {item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-[#0B0B0B]">
                      {priceLabel(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="pt-4 border-t border-neutral-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder={t("checkout.couponPlaceholder")}
                    disabled={couponApplied}
                    className="flex-1 bg-[#F5F5F3] border border-neutral-300 rounded-sm px-3 py-2 text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-black"
                  />
                  <button
                    type="submit"
                    disabled={couponApplied || !couponCode.trim()}
                    className="px-4 py-2 bg-[#0B0B0B] text-white text-xs font-bold uppercase rounded-sm hover:bg-neutral-800 disabled:opacity-50"
                  >
                    {t("checkout.applyCoupon")}
                  </button>
                </div>
                {couponApplied && (
                  <div className="flex items-center justify-between mt-2 pt-1">
                    <p className="text-xs text-green-700 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{couponSuccessMsg || t("checkout.couponSuccess")}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setCouponApplied(false);
                        setDiscountAmount(0);
                        setCouponCode("");
                        setCouponSuccessMsg("");
                      }}
                      className="text-[11px] text-red-600 hover:text-red-800 font-bold underline cursor-pointer"
                    >
                      {language === "ar" ? "إلغاء الخصم" : "Remove"}
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className="text-xs text-red-600 mt-1.5 font-medium">{couponError}</p>
                )}
              </form>

              {/* Price Calculation */}
              <div className="pt-4 border-t border-neutral-200 space-y-2.5 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>{t("checkout.subtotalLabel")}</span>
                  <span className="font-semibold text-[#0B0B0B]">{priceLabel(subtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>{t("checkout.shippingLabel")} ({language === "ar" ? shippingInfo.nameAr : shippingInfo.nameEn} • {shippingInfo.deliveryDays})</span>
                  <span className="font-semibold text-[#0B0B0B]">{priceLabel(shippingInfo.fee)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-700 font-semibold">
                    <span>{t("checkout.discountLabel")}</span>
                    <span>-{priceLabel(discountAmount)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-neutral-200 flex justify-between text-base font-extrabold text-[#0B0B0B]">
                  <span>{t("checkout.totalLabel")}</span>
                  <span>{priceLabel(totalAmount)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-[#0B0B0B] text-white text-xs font-extrabold uppercase tracking-widest rounded-sm hover:bg-[#D9C9B3] hover:text-[#0B0B0B] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {isSubmitting ? t("checkout.confirming") : t("checkout.confirmBtn")}
                </span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#686B6B]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0B0B0B]" />
                <span>{t("checkout.safeNotice")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
