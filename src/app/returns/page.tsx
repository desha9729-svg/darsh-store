"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { RefreshCw, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

export default function ReturnsPage() {
  const { language, isRTL } = useLanguage();

  return (
    <div className="bg-[#F5F5F3] min-h-screen py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
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

        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="w-12 h-12 bg-[#0B0B0B] text-[#D9C9B3] rounded-sm flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-6 h-6" />
          </div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#686B6B]">
            {language === "ar" ? "حقوق العميل وضمان الجودة" : "Customer Rights & Guarantees"}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B0B0B] tracking-tight uppercase mt-2">
            {language === "ar" ? "سياسة الاستبدال والاسترجاع" : "Returns & Exchanges Policy"}
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-neutral-600">
            {language === "ar"
              ? "في درش نسعى لتقديم تجربة تسوق مريحة خالية من أي مخاطر؛ لذا نوفر حق المعاينة الفورية مع المندوب وضمان الاستبدال لمدة 14 يومًا."
              : "At DRSH, we believe in complete customer peace of mind with on-spot courier inspection and a 14-day exchange warranty."}
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-sm p-6 sm:p-10 shadow-xs space-y-8 text-xs sm:text-sm text-neutral-700 leading-relaxed">
          <div>
            <h3 className="text-base font-bold text-[#0B0B0B] mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-700" />
              <span>{language === "ar" ? "1. حق المعاينة الفورية عند الاستلام" : "1. Instant Inspection Upon Arrival"}</span>
            </h3>
            <p>
              {language === "ar"
                ? "يحق للعميل عند وصول مندوب شركة بوسطة فتح الشحنة والتأكد من سلامة القطع ومطابقتها للمواصفات المعروضة على الموقع قبل سداد المبلغ نقدًا. وفي حال وجود أي اختلاف يحق للعميل رفض استلام الشحنة مباشرة دون دفع أي رسوم إضافية."
                : "Upon arrival of the Bosta courier, you have the full right to inspect your parcel before paying. If any item differs from your expectations, you may decline the delivery directly."}
            </p>
          </div>

          <div className="pt-6 border-t border-neutral-100">
            <h3 className="text-base font-bold text-[#0B0B0B] mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-700" />
              <span>{language === "ar" ? "2. فترة الاستبدال (14 يومًا)" : "2. 14-Day Exchange Policy"}</span>
            </h3>
            <p>
              {language === "ar"
                ? "يمكنك طلب استبدال المقاس أو اللون أو تبديل القطعة بمنتج آخر خلال 14 يومًا من تاريخ الاستلام، بشرط أن تكون المنتجات بحالتها الأصلية غير مستخدمة ومرفقة بالعلبة والبطاقات التابعة لدرش."
                : "You may request an exchange for another size, color, or alternative model within 14 days of delivery, provided the item remains unused in its original DRSH presentation box with tags intact."}
            </p>
          </div>

          <div className="pt-6 border-t border-neutral-100">
            <h3 className="text-base font-bold text-[#0B0B0B] mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>{language === "ar" ? "3. كيفية تقديم طلب الاستبدال" : "3. How to Request an Exchange"}</span>
            </h3>
            <p>
              {language === "ar"
                ? "كل ما عليك هو التواصل مع خدمة عملاء درش عبر الواتساب أو صفحة اتصل بنا مع تزويدنا برقم الأوردر (مثال: DRSH-10452)، وسيتم إرسال مندوب بوسطة لتسليمك القطعة البديلة واستلام القطعة السابقة من باب منزلك."
                : "Simply message our support team on WhatsApp or via our Contact page with your Order Number (e.g. DRSH-10452). A Bosta courier will be scheduled to exchange your item right at your doorstep."}
            </p>
          </div>

          <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/contact"
              className="w-full sm:w-auto text-center px-6 py-3 bg-[#0B0B0B] text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#D9C9B3] hover:text-[#0B0B0B] transition-colors min-h-[44px] flex items-center justify-center"
            >
              {language === "ar" ? "تواصل مع خدمة العملاء لطلب استبدال" : "Contact Support for Exchange"}
            </Link>
            <Link
              href="/security"
              className="w-full sm:w-auto text-center px-6 py-3 bg-white border border-neutral-300 text-black text-xs font-bold uppercase tracking-wider rounded-sm hover:border-black transition-colors min-h-[44px] flex items-center justify-center"
            >
              {language === "ar" ? "سياسة حماية المشتري والأمان" : "Buyer Protection Policy"}
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
