import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-[#F5F5F3] min-h-screen py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Brand Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="w-14 h-14 bg-[#0B0B0B] text-[#D9C9B3] rounded-sm flex items-center justify-center font-extrabold text-2xl mx-auto mb-6 shadow-md border border-[#D9C9B3]/40">
            D
          </div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#686B6B]">
            Our Story & Heritage
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0B0B0B] tracking-tight uppercase mt-2">
            About DRSH (درش)
          </h1>
          <p className="mt-4 text-base text-neutral-600 font-serif italic">
            &ldquo;MORE THAN JUST ACCESSORIES — Style is created by the details.&rdquo;
          </p>
        </div>

        {/* Narrative Card */}
        <div className="bg-white border border-neutral-200 rounded-sm p-8 sm:p-12 space-y-8 shadow-xs leading-relaxed text-sm text-neutral-700">
          <div>
            <h2 className="text-lg font-bold uppercase tracking-wider text-[#0B0B0B] mb-3">
              Who We Are
            </h2>
            <p>
              <strong>DRSH (درش)</strong> is a contemporary Egyptian fashion and lifestyle accessories brand founded on the belief that accessories shouldn&apos;t just be afterthoughts—they define the essence of personal style. From understated stainless steel timepieces and structured nappa leather bags, to faceted aerospace titanium rings and signature extraits de parfum, our pieces are curated for those who appreciate architectural lines and quiet confidence.
            </p>
          </div>

          <div className="p-6 bg-[#F4EFEA] border-l-4 border-[#0B0B0B] rounded-xs space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0B0B0B]">
              Our Philosophy (فلسفة درش)
            </h3>
            <p className="text-xs text-neutral-800 italic">
              &ldquo;الأناقة الحقيقية لا تحتاج إلى مبالغة أو صخب؛ هي نتاج العناية بأدق التفاصيل واختيار قطع متينة تعبر عن شخصيتك وتدوم طويلاً.&rdquo;
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold uppercase tracking-wider text-[#0B0B0B] mb-3">
              The Egyptian Experience
            </h2>
            <p>
              We designed the DRSH shopping experience specifically around the habits and peace of mind of the Egyptian shopper. No complicated online payment forms or prepaid credit card barriers. You discover what you love, order in seconds, and pay cash on delivery (COD) after inspecting your parcel delivered safely by Bosta logistics anywhere in Egypt.
            </p>
          </div>

          <div className="pt-6 border-t border-neutral-100 flex justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0B0B0B] text-white text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[#D9C9B3] hover:text-[#0B0B0B] transition-colors"
            >
              <span>Explore Our Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
