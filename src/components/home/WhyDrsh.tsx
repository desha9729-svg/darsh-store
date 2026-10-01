import React from "react";
import { CheckCircle2, Shield, Truck, Sparkles } from "lucide-react";

export function WhyDrsh() {
  const pillars = [
    {
      icon: Sparkles,
      titleEn: "Curated Selection",
      titleAr: "اختيارات متقنة",
      desc: "Every timepiece, ring, and leather bag is hand-selected with obsessive attention to silhouette, weight, and long-term durability.",
    },
    {
      icon: Shield,
      titleEn: "Cash on Delivery",
      titleAr: "دفع آمن عند الاستلام",
      desc: "Zero upfront online payment required. Pay in cash directly to your Bosta courier upon receiving your parcel.",
    },
    {
      icon: Truck,
      titleEn: "Nationwide Coverage",
      titleAr: "توصيل سريع لجميع المحافظات",
      desc: "Fast, tracked shipping covering Greater Cairo, Alexandria, Delta, and Upper Egypt within 24 to 72 hours.",
    },
    {
      icon: CheckCircle2,
      titleEn: "Parcel Inspection",
      titleAr: "حق المعاينة عند الاستلام",
      desc: "Shop with peace of mind. Inspect your items upon arrival to ensure exact match with product specifications.",
    },
  ];

  return (
    <section className="py-24 bg-[#0B0B0B] text-white relative overflow-hidden">
      {/* Decorative Brand Watermark */}
      <div className="absolute -right-20 -bottom-20 text-[260px] font-extrabold text-neutral-900 select-none pointer-events-none opacity-40 font-mono">
        D
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#D9C9B3]">
            The DRSH Standard
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 text-white">
            Why Shop With DRSH?
          </h2>
          <p className="mt-4 text-sm text-neutral-400">
            نحن نؤمن بأن الأناقة تكمن في التفاصيل؛ لذلك صممنا تجربة تسوق مريحة، سريعة، وموثوقة من أول نقرة وحتى باب بيتك.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-neutral-950/80 border border-neutral-800 p-8 rounded-sm hover:border-[#D9C9B3]/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 bg-[#D9C9B3]/10 border border-[#D9C9B3]/30 rounded-sm flex items-center justify-center text-[#D9C9B3] mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-wide">
                    {p.titleEn}
                  </h3>
                  <h4 className="text-xs text-[#D9C9B3] font-medium mt-0.5 mb-3">
                    {p.titleAr}
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-neutral-900 text-[10px] text-neutral-500 uppercase tracking-widest font-mono">
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
