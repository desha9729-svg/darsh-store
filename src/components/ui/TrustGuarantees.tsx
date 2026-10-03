"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { Eye, ShieldCheck, RefreshCw, Truck, ChevronRight } from "lucide-react";

interface TrustGuaranteesProps {
  variant?: "horizontal" | "compact" | "grid";
  showLink?: boolean;
}

export function TrustGuarantees({ variant = "horizontal", showLink = true }: TrustGuaranteesProps) {
  const { language, t, isRTL } = useLanguage();

  const items = [
    {
      icon: Eye,
      title: t("trustGuarantees.badgeInspect"),
      desc: t("trustGuarantees.badgeInspectDesc"),
    },
    {
      icon: ShieldCheck,
      title: t("trustGuarantees.badgeCod"),
      desc: t("trustGuarantees.badgeCodDesc"),
    },
    {
      icon: RefreshCw,
      title: t("trustGuarantees.badgeExchange"),
      desc: t("trustGuarantees.badgeExchangeDesc"),
    },
    {
      icon: Truck,
      title: t("trustGuarantees.badgeShipping"),
      desc: t("trustGuarantees.badgeShippingDesc"),
    },
  ];

  if (variant === "compact") {
    return (
      <div className="bg-[#F5F5F3] border border-neutral-200/90 rounded-sm p-3.5 space-y-2.5 text-xs text-[#0B0B0B]">
        {items.slice(0, 3).map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-white border border-neutral-300 flex items-center justify-center shrink-0 text-[#0B0B0B]">
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-[11px] sm:text-xs text-[#0B0B0B] block leading-none">
                  {item.title}
                </span>
                <span className="text-[10px] text-neutral-500 leading-tight block mt-0.5">
                  {item.desc}
                </span>
              </div>
            </div>
          );
        })}
        {showLink && (
          <div className="pt-2 border-t border-neutral-200 text-center">
            <Link
              href="/security"
              className="text-[11px] font-bold text-[#8C7A65] hover:text-black inline-flex items-center gap-1"
            >
              <span>{language === "ar" ? "تعرف على سياسة حماية المشتري الكاملة" : "Read Full Buyer Protection Policy"}</span>
              <ChevronRight className={`w-3 h-3 ${isRTL ? "rotate-180" : ""}`} />
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-200/90 rounded-sm p-4 sm:p-6 shadow-2xs">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-start gap-2.5 sm:gap-3 p-2 rounded-xs">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-sm bg-[#0B0B0B] text-[#D9C9B3] flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs sm:text-sm text-[#0B0B0B] leading-tight">
                  {item.title}
                </h4>
                <p className="text-[10px] sm:text-[11px] text-neutral-500 mt-1 leading-snug line-clamp-2">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      {showLink && (
        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
          <span>{language === "ar" ? "معايير أمان معتمدة لجميع المحافظات" : "Standard Buyer Protection Across Egypt"}</span>
          <Link
            href="/security"
            className="font-bold text-[#0B0B0B] hover:text-[#8C7A65] inline-flex items-center gap-1 uppercase tracking-wider"
          >
            <span>{language === "ar" ? "سياسة الأمان وحماية المشتري" : "Security Details"}</span>
            <ChevronRight className={`w-3 h-3 ${isRTL ? "rotate-180" : ""}`} />
          </Link>
        </div>
      )}
    </div>
  );
}
