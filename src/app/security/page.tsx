"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import {
  ShieldCheck,
  Eye,
  RefreshCw,
  Truck,
  Lock,
  Headphones,
  CheckCircle2,
  ArrowLeft,
  ChevronRight,
  HelpCircle,
} from "lucide-react";

export default function SecurityPage() {
  const { language, t, isRTL } = useLanguage();

  const securityPillars = [
    {
      icon: Eye,
      title: t("security.pillar1Title"),
      desc: t("security.pillar1Desc"),
      badge: language === "ar" ? "حق المعاينة" : "Full Inspection",
    },
    {
      icon: ShieldCheck,
      title: t("security.pillar2Title"),
      desc: t("security.pillar2Desc"),
      badge: language === "ar" ? "صفر مخاطرة" : "Zero Risk",
    },
    {
      icon: RefreshCw,
      title: t("security.pillar3Title"),
      desc: t("security.pillar3Desc"),
      badge: language === "ar" ? "استبدال 14 يوم" : "14-Day Swap",
    },
    {
      icon: Lock,
      title: t("security.pillar4Title"),
      desc: t("security.pillar4Desc"),
      badge: language === "ar" ? "أصالة وجودة" : "Authentic",
    },
    {
      icon: Lock,
      title: t("security.pillar5Title"),
      desc: t("security.pillar5Desc"),
      badge: language === "ar" ? "بيانات مشفرة" : "Data Privacy",
    },
    {
      icon: Headphones,
      title: t("security.pillar6Title"),
      desc: t("security.pillar6Desc"),
      badge: language === "ar" ? "دعم مستمر" : "Live Support",
    },
  ];

  const faqs = [
    {
      q: language === "ar" ? "هل يحق لي فتح الشحنة ومعاينتها قبل الدفع؟" : "Can I inspect the parcel before paying?",
      a: language === "ar"
        ? "نعم، بالتأكيد وبشكل كامل. عند وصول مندوب شركة بوسطة، يحق لك فتح الطرد وفحص جودة ومقاس ومطابقة الإكسسوارات قبل دفع أي مبلغ مالي. وإذا لم تعجبك الشحنة، يمكنك الاعتذار وإرجاعها مباشرة مع المندوب دون أي التزام."
        : "Yes, 100%. When the Bosta courier arrives at your doorstep, you have the full right to unbox and inspect your items before handing over payment. If unsatisfied, you may reject the parcel on the spot with zero obligation.",
    },
    {
      q: language === "ar" ? "هل أحتاج لإدخال بطاقتي الائتمانية أو دفع أي عربون مسبق؟" : "Do I need a credit card or upfront deposit?",
      a: language === "ar"
        ? "لا على الإطلاق. متجر درش يعمل بنظام الدفع عند الاستلام (COD) فقط في جميع محافظات مصر. تدفع نقدًا للمندوب عند وصول شحنتك لباب بيتك فقط."
        : "Never. DRSH operates strictly on Cash on Delivery (COD) across all Egyptian governorates. You only pay in cash upon receiving your order in your hands.",
    },
    {
      q: language === "ar" ? "كيف أطلب استبدال المقاس أو الموديل بعد الاستلام؟" : "How do I request a size or model exchange?",
      a: language === "ar"
        ? "خلال 14 يومًا من الاستلام، يكفي أن تتواصل مع خدمة العملاء عبر الواتساب برقم الأوردر، وسنقوم بجدولة مندوب بوسطة ليصلك حتى باب بيتك لتسليمك المقاس الجديد واستلام القطعة السابقة دون أي تعقيد."
        : "Within 14 days of receipt, simply message our support on WhatsApp with your Order ID. We will schedule a courier to exchange your item right at your door.",
    },
    {
      q: language === "ar" ? "كيف تضمنون جودة الخامات وأصالة المنتجات؟" : "How do you guarantee material quality and authenticity?",
      a: language === "ar"
        ? "كل ساعة وإكسسوار في درش يتم تصنيعه وفق مواصفات دقيقة (ستانلس ستيل 316L مقاوم للصدأ، تيتانيوم، جلود طبيعية) مع فحص جودة مزدوج قبل الإغلاق في علبة درش المميزة."
        : "Every timepiece and accessory is crafted to strict architectural specifications (316L Stainless Steel, Titanium, Genuine Leather) and passes rigorous double inspection prior to dispatch.",
    },
  ];

  return (
    <div className="bg-[#F5F5F3] min-h-screen py-10 sm:py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#686B6B] hover:text-[#0B0B0B]"
          >
            <ArrowLeft className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
            <span>{language === "ar" ? "الرئيسية" : "Home"}</span>
          </Link>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#0B0B0B] text-[#D9C9B3] rounded-sm flex items-center justify-center mx-auto mb-4 border border-[#D9C9B3]/40 shadow-md">
            <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <span className="text-[11px] sm:text-xs uppercase font-extrabold tracking-widest text-[#686B6B] block">
            {t("security.eyebrow")}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0B0B0B] tracking-tight uppercase mt-2">
            {t("security.title")}
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-neutral-600 leading-relaxed">
            {t("security.subtitle")}
          </p>
        </div>

        {/* 4 Core Trust Badges Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10 sm:mb-14">
          <div className="bg-white p-4 sm:p-5 rounded-sm border border-neutral-200 shadow-2xs text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-[#D9C9B3]/25 flex items-center justify-center text-[#0B0B0B] mb-2.5">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-[#0B0B0B]">
              {t("trustGuarantees.badgeInspect")}
            </h3>
            <p className="text-[10px] sm:text-[11px] text-neutral-500 mt-1 leading-snug">
              {t("trustGuarantees.badgeInspectDesc")}
            </p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-sm border border-neutral-200 shadow-2xs text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-[#D9C9B3]/25 flex items-center justify-center text-[#0B0B0B] mb-2.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-[#0B0B0B]">
              {t("trustGuarantees.badgeCod")}
            </h3>
            <p className="text-[10px] sm:text-[11px] text-neutral-500 mt-1 leading-snug">
              {t("trustGuarantees.badgeCodDesc")}
            </p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-sm border border-neutral-200 shadow-2xs text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-[#D9C9B3]/25 flex items-center justify-center text-[#0B0B0B] mb-2.5">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-[#0B0B0B]">
              {t("trustGuarantees.badgeExchange")}
            </h3>
            <p className="text-[10px] sm:text-[11px] text-neutral-500 mt-1 leading-snug">
              {t("trustGuarantees.badgeExchangeDesc")}
            </p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-sm border border-neutral-200 shadow-2xs text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-[#D9C9B3]/25 flex items-center justify-center text-[#0B0B0B] mb-2.5">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-[#0B0B0B]">
              {t("trustGuarantees.badgeShipping")}
            </h3>
            <p className="text-[10px] sm:text-[11px] text-neutral-500 mt-1 leading-snug">
              {t("trustGuarantees.badgeShippingDesc")}
            </p>
          </div>
        </div>

        {/* Detailed 6 Pillars Grid */}
        <div className="bg-white border border-neutral-200 rounded-sm p-5 sm:p-8 md:p-10 shadow-xs mb-10 sm:mb-14">
          <h2 className="text-base sm:text-lg font-extrabold text-[#0B0B0B] uppercase tracking-wide pb-4 border-b border-neutral-100 mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-700" />
            <span>
              {language === "ar" ? "أركان الحماية والأمان المعتمدة في متجر درش" : "DRSH Security & Buyer Protection Pillars"}
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {securityPillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={idx} className="p-4 sm:p-5 bg-neutral-50 rounded-sm border border-neutral-200/80 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-sm bg-[#0B0B0B] text-[#D9C9B3] flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-white border border-neutral-300 px-2 py-0.5 rounded-xs text-[#0B0B0B]">
                        {p.badge}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-[#0B0B0B] mb-1.5">
                      {p.title}
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white border border-neutral-200 rounded-sm p-5 sm:p-8 shadow-xs mb-10 sm:mb-14">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-neutral-100">
            <HelpCircle className="w-5 h-5 text-[#0B0B0B]" />
            <h2 className="text-base sm:text-lg font-extrabold text-[#0B0B0B] uppercase tracking-wide">
              {language === "ar" ? "الأسئلة الشائعة حول الأمان وحماية المشتري" : "Frequently Asked Questions"}
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div key={i} className="p-4 bg-neutral-50 border border-neutral-200/80 rounded-sm">
                <h3 className="font-bold text-xs sm:text-sm text-[#0B0B0B] mb-2 flex items-start gap-2">
                  <span className="text-[#8C7A65] font-mono">Q{i + 1}.</span>
                  <span>{f.q}</span>
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed pl-5 rtl:pl-0 rtl:pr-5">
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Link to Contact / Shop */}
        <div className="p-6 bg-gradient-to-r from-neutral-900 to-black text-white rounded-sm text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left rtl:sm:text-right">
            <h3 className="font-bold text-sm uppercase tracking-wider text-white">
              {language === "ar" ? "هل لديك استفسار إضافي؟" : "Have More Questions?"}
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              {language === "ar" ? "فريق خدمة عملاء درش مستعد لمساعدتك عبر الواتساب والمكالمات." : "Our support team is ready to assist you on WhatsApp and phone."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="px-5 py-2.5 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-[#D9C9B3] transition-colors"
            >
              {language === "ar" ? "تواصل معنا" : "Contact Us"}
            </Link>
            <Link
              href="/shop"
              className="px-5 py-2.5 bg-transparent border border-neutral-600 text-white font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-neutral-800 transition-colors"
            >
              {language === "ar" ? "تسوق الآن" : "Shop Collection"}
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
