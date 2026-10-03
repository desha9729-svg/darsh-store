"use client";

import React from "react";
import Link from "next/link";
import { EGYPTIAN_GOVERNORATES } from "@/data/egypt-governorates";
import { useLanguage } from "@/context/language-context";
import { Truck, ShieldCheck, Clock, MapPin, ArrowLeft } from "lucide-react";

export default function ShippingPage() {
  const { language, t, isRTL } = useLanguage();

  return (
    <div className="bg-[#F5F5F3] min-h-screen py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#686B6B] hover:text-[#0B0B0B]"
          >
            <ArrowLeft className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
            <span>{language === "ar" ? "الرئيسية" : "Home"}</span>
          </Link>
        </div>

        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="w-12 h-12 bg-[#0B0B0B] text-[#D9C9B3] rounded-sm flex items-center justify-center mx-auto mb-4">
            <Truck className="w-6 h-6" />
          </div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#686B6B]">
            {language === "ar" ? "الشحن والتوصيل في مصر" : "Nationwide Delivery"}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B0B0B] tracking-tight uppercase mt-2">
            {language === "ar" ? "سياسة الشحن ومواعيد التوصيل" : "Shipping & Delivery Policy"}
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-neutral-600">
            {language === "ar"
              ? "نوفر الشحن السريع لجميع محافظات جمهورية مصر العربية بالتعاون مع شركة بوسطة، مع ميزة الدفع نقدًا عند الاستلام وحق المعاينة قبل الدفع."
              : "Fast, reliable tracked delivery across all Egypt governorates via Bosta with Cash on Delivery and inspection upon arrival."}
          </p>
        </div>

        {/* 3 Core Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-sm border border-neutral-200 shadow-xs">
            <ShieldCheck className="w-6 h-6 text-[#0B0B0B] mb-3" />
            <h3 className="font-bold text-sm text-[#0B0B0B]">
              {language === "ar" ? "الدفع عند الاستلام (COD)" : "Cash on Delivery"}
            </h3>
            <p className="text-xs text-neutral-600 mt-1">
              {language === "ar"
                ? "لا تحتاج لأي بطاقة دفع بنكية. ادفع للمندوب نقدًا عند استلام الشحنة."
                : "No advance payment required. Pay directly in cash upon receiving your order."}
            </p>
          </div>

          <div className="bg-white p-6 rounded-sm border border-neutral-200 shadow-xs">
            <Clock className="w-6 h-6 text-[#0B0B0B] mb-3" />
            <h3 className="font-bold text-sm text-[#0B0B0B]">
              {language === "ar" ? "توصيل خلال 24 - 72 ساعة" : "24 - 72h Delivery"}
            </h3>
            <p className="text-xs text-neutral-600 mt-1">
              {language === "ar"
                ? "توصيل سريع للقاهرة والجيزة والإسكندرية ومحافظات الدلتا والصعيد."
                : "Fast turnaround covering Cairo, Giza, Alexandria, Delta, and Upper Egypt."}
            </p>
          </div>

          <div className="bg-white p-6 rounded-sm border border-neutral-200 shadow-xs">
            <MapPin className="w-6 h-6 text-[#0B0B0B] mb-3" />
            <h3 className="font-bold text-sm text-[#0B0B0B]">
              {language === "ar" ? "حق المعاينة قبل الدفع" : "Inspect Before Paying"}
            </h3>
            <p className="text-xs text-neutral-600 mt-1">
              {language === "ar"
                ? "يحق لك فحص الطرد والتأكد من سلامة ومطابقة القطع قبل سداد المبلغ."
                : "Inspect your items upon courier arrival to ensure perfect condition."}
            </p>
          </div>
        </div>

        {/* Governorates Table */}
        <div className="bg-white border border-neutral-200 rounded-sm overflow-hidden shadow-xs">
          <div className="p-4 sm:p-6 border-b border-neutral-200 flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0B0B0B]">
              {language === "ar" ? "جدول تسعيرة الشحن لكل المحافظات" : "Governorate Shipping Rates"}
            </h3>
            <span className="text-[11px] sm:text-xs text-[#686B6B]">Bosta Logistics</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 p-4 sm:p-6">
            {EGYPTIAN_GOVERNORATES.map((g) => (
              <div key={g.id} className="p-3 sm:p-3.5 bg-neutral-50 border border-neutral-200 rounded-xs flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#0B0B0B] block">
                    {language === "ar" ? g.nameAr : g.nameEn}
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    {language === "ar" ? `التوصيل: ${g.deliveryDays}` : `SLA: ${g.deliveryDays}`}
                  </span>
                </div>
                <span className="font-black text-black bg-[#D9C9B3]/40 border border-[#D9C9B3] px-2.5 py-1 rounded-xs">
                  {g.fee} {language === "ar" ? "ج.م" : "EGP"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cross policy navigation footer */}
        <div className="mt-8 p-4 sm:p-6 bg-white border border-neutral-200 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-neutral-600 font-medium text-center sm:text-left rtl:sm:text-right">
            {language === "ar" ? "تعرف أيضًا على حقوقك في المعاينة والاستبدال والأمان:" : "Learn more about your inspection, exchange & buyer protection rights:"}
          </span>
          <div className="flex items-center gap-4">
            <Link href="/returns" className="font-bold text-[#0B0B0B] hover:text-[#8C7A65] underline">
              {language === "ar" ? "سياسة الاستبدال (14 يوم)" : "Returns Policy"}
            </Link>
            <span>•</span>
            <Link href="/security" className="font-bold text-[#0B0B0B] hover:text-[#8C7A65] underline">
              {language === "ar" ? "حماية المشتري والأمان" : "Buyer Security"}
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
