"use client";

import React from "react";
import { CheckCircle2, Shield, Truck, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export function WhyDrsh() {
  const { language, t } = useLanguage();

  const pillars = [
    {
      icon: Sparkles,
      title: t("whyDrsh.pillar1Title"),
      desc: t("whyDrsh.pillar1Desc"),
    },
    {
      icon: Shield,
      title: t("whyDrsh.pillar2Title"),
      desc: t("whyDrsh.pillar2Desc"),
    },
    {
      icon: Truck,
      title: t("whyDrsh.pillar3Title"),
      desc: t("whyDrsh.pillar3Desc"),
    },
    {
      icon: CheckCircle2,
      title: t("whyDrsh.pillar4Title"),
      desc: t("whyDrsh.pillar4Desc"),
    },
  ];

  return (
    <section className="py-12 sm:py-18 md:py-24 bg-[#0B0B0B] text-white relative overflow-hidden">
      {/* Decorative Brand Watermark */}
      <div className="absolute -right-20 -bottom-20 text-[260px] font-extrabold text-neutral-900 select-none pointer-events-none opacity-40 font-mono">
        D
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 md:mb-16">
          <span className="text-[11px] sm:text-xs uppercase font-extrabold tracking-widest text-[#D9C9B3]">
            {t("whyDrsh.eyebrow")}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mt-1.5 text-white">
            {t("whyDrsh.title")}
          </h2>
          <p className="mt-2.5 sm:mt-4 text-xs sm:text-sm text-neutral-400">
            {t("whyDrsh.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-neutral-950/80 border border-neutral-800 p-5 sm:p-7 md:p-8 rounded-sm hover:border-[#D9C9B3]/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#D9C9B3]/10 border border-[#D9C9B3]/30 rounded-sm flex items-center justify-center text-[#D9C9B3] mb-4 sm:mb-6">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                    {p.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed mt-2">
                    {p.desc}
                  </p>
                </div>
                <div className="mt-5 pt-3.5 border-t border-neutral-900 text-[10px] text-neutral-500 uppercase tracking-widest font-mono">
                  DRSH // Standard 0{idx + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
