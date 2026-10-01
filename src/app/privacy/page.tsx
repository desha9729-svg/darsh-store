"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
          <ShieldCheck className="w-10 h-10 text-[#0B0B0B] mx-auto mb-3" />
          <h1 className="text-3xl font-extrabold text-[#0B0B0B] uppercase tracking-tight">
            {language === "ar" ? "سياسة الخصوصية وأمان البيانات" : "Privacy Policy"}
          </h1>
          <p className="mt-2 text-xs text-neutral-500">
            {language === "ar" ? "آخر تحديث: 2026 • متجر درش (DRSH)" : "Last updated: 2026 • DRSH Store"}
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-sm p-6 sm:p-10 shadow-xs space-y-6 text-xs sm:text-sm text-neutral-700 leading-relaxed">
          <section>
            <h3 className="text-sm font-bold text-[#0B0B0B] uppercase tracking-wide mb-2">
              {language === "ar" ? "1. البيانات التي نجمعها" : "1. Information We Collect"}
            </h3>
            <p>
              {language === "ar"
                ? "نقوم بجمع البيانات الضرورية فقط لإتمام وتوصيل طلبك (الاسم، رقم الهاتف، وعنوان التوصيل داخل مصر). نحن لا نطلب أو نخزن أي بيانات بطاقات ائتمانية بنكية نظرًا لأن المتجر يعتمد كليًا على نظام الدفع نقدًا عند الاستلام (Cash on Delivery)."
                : "We collect only essential information required to fulfill and deliver your orders (name, mobile number, and delivery address in Egypt). We do not collect or store any banking credit card credentials as our store is exclusively Cash on Delivery."}
            </p>
          </section>

          <section className="pt-4 border-t border-neutral-100">
            <h3 className="text-sm font-bold text-[#0B0B0B] uppercase tracking-wide mb-2">
              {language === "ar" ? "2. مشاركة البيانات مع شريك الشحن (بوسطة)" : "2. Logistics Data Sharing (Bosta)"}
            </h3>
            <p>
              {language === "ar"
                ? "يتم تزويد شركة الشحن الرسمية (بوسطة) باسمك ورقم هاتفك وعنوانك لغرض وحيد وهو إيصال الشحنة لك وتنسيق موعد التسليم مع المندوب."
                : "Your name, phone number, and delivery address are securely shared with our logistics partner (Bosta Express) strictly to facilitate courier dispatch and doorstep parcel delivery."}
            </p>
          </section>

          <section className="pt-4 border-t border-neutral-100">
            <h3 className="text-sm font-bold text-[#0B0B0B] uppercase tracking-wide mb-2">
              {language === "ar" ? "3. أمان وحماية المعلومات" : "3. Data Security & Protection"}
            </h3>
            <p>
              {language === "ar"
                ? "نحن نلتزم بحماية خصوصيتك ومعلوماتك، ولا نقوم أبدًا ببيع أو تأجير أي بيانات لأي أطراف إعلانية خارجية."
                : "We take rigorous measures to safeguard your personal details and never sell, rent, or trade customer information with third-party advertisers."}
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
