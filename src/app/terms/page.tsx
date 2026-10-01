"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { FileText, ArrowLeft } from "lucide-react";

export default function TermsPage() {
  const { language, isRTL } = useLanguage();

  return (
    <div className="bg-[#F5F5F3] min-h-screen py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#686B6B] hover:text-[#0B0B0B]"
          >
            <ArrowLeft className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
            <span>{language === "ar" ? "الرئيسية" : "Home"}</span>
          </Link>
        </div>

        <div className="text-center max-w-xl mx-auto mb-12">
          <FileText className="w-10 h-10 text-[#0B0B0B] mx-auto mb-3" />
          <h1 className="text-3xl font-extrabold text-[#0B0B0B] uppercase tracking-tight">
            {language === "ar" ? "الشروط والأحكام" : "Terms & Conditions"}
          </h1>
          <p className="mt-2 text-xs text-neutral-500">
            {language === "ar" ? "شروط الاستخدام والطلب من متجر درش (DRSH)" : "Usage & Purchasing Terms • DRSH Store"}
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-sm p-6 sm:p-10 shadow-xs space-y-6 text-xs sm:text-sm text-neutral-700 leading-relaxed">
          <section>
            <h3 className="text-sm font-bold text-[#0B0B0B] uppercase tracking-wide mb-2">
              {language === "ar" ? "1. طلب المنتجات والأسعار" : "1. Orders & Pricing"}
            </h3>
            <p>
              {language === "ar"
                ? "جميع الأسعار المعروضة على المتجر محددة بالجنيه المصري (EGP). يحق لدرش تحديث الأسعار أو إلغاء أي طلب ناتج عن خطأ تسعيري غير مقصود بعد إخطار العميل هاتفياً."
                : "All prices on the platform are denominated in Egyptian Pounds (EGP). DRSH reserves the right to adjust pricing or cancel orders resulting from inadvertent typographical errors after notifying the customer."}
            </p>
          </section>

          <section className="pt-4 border-t border-neutral-100">
            <h3 className="text-sm font-bold text-[#0B0B0B] uppercase tracking-wide mb-2">
              {language === "ar" ? "2. التزام العميل عند طلب الدفع عند الاستلام" : "2. COD Order Commitment"}
            </h3>
            <p>
              {language === "ar"
                ? "عند تأكيد طلبك بنظام الدفع عند الاستلام، يلتزم العميل بالرد على اتصالات ورسائل مندوب الشحن وتجهيز قيمة الطلب نقدًا عند الوصول، وفي حال تعذر الاستلام يرجى إخطارنا مسبقًا لتنسيق موعد بديل."
                : "By submitting a Cash on Delivery order, the customer commits to being reachable via phone for delivery coordination and having the cash amount ready upon arrival."}
            </p>
          </section>

          <section className="pt-4 border-t border-neutral-100">
            <h3 className="text-sm font-bold text-[#0B0B0B] uppercase tracking-wide mb-2">
              {language === "ar" ? "3. حقوق الملكية الفكرية" : "3. Intellectual Property"}
            </h3>
            <p>
              {language === "ar"
                ? "جميع الشعارات، مونوغرام حرف D، التصاميم والصور المعروضة على متجر DRSH هي ملكية حصرية لعلامة درش التجارية ومحمية بموجب القوانين المصرية والدولية."
                : "All logos, the 'D' monogram emblem, brand designs, and imagery featured on DRSH are proprietary intellectual property protected under Egyptian and international copyright laws."}
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
