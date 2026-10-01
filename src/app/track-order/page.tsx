"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { formatPrice } from "@/lib/utils";
import {
  Search,
  Package,
  CheckCircle2,
  Truck,
  MapPin,
  Clock,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const queryOrder = searchParams.get("order") || "";
  const { language, t } = useLanguage();

  const [orderNumber, setOrderNumber] = useState(queryOrder);
  const [phone, setPhone] = useState("");
  const [searched, setSearched] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    if (queryOrder) {
      handleSearch(queryOrder);
    }
  }, [queryOrder]);

  const handleSearch = (orderNumToFind?: string) => {
    const num = (orderNumToFind || orderNumber).trim();
    if (!num) return;

    setSearched(true);
    try {
      const saved = localStorage.getItem(`drsh_order_${num}`);
      if (saved) {
        setOrderData(JSON.parse(saved));
        return;
      }
    } catch {
      // fallback
    }

    setOrderData({
      orderNumber: num,
      customerName: "Mohamed Ali",
      phone: phone || "01012345678",
      governorate: "Cairo",
      city: "New Cairo",
      streetAddress: "South 90th Street",
      items: [
        {
          id: "mock-1",
          productName: "DRSH Minimalist Obsidian Watch",
          variantTitle: "Obsidian Black / Black Leather",
          price: 899,
          quantity: 1,
        },
      ],
      subtotal: 899,
      shippingFee: 55,
      totalAmount: 954,
      status: "preparing",
      createdAt: new Date().toISOString(),
      bostaTrackingNumber: `BST-${num.replace("DRSH-", "") || "84920"}-EGY`,
      bostaTrackingUrl: `https://bosta.co/tracking-shipment/?track=BST-84920`,
    });
  };

  const steps = [
    {
      title: language === "ar" ? "تم تسجيل الطلب" : "Order Placed",
      desc: language === "ar" ? "تم استلام الطلب وتأكيد البيانات" : "Order received and validated",
      status: "completed",
    },
    {
      title: language === "ar" ? "تمت المراجعة" : "Confirmed",
      desc: language === "ar" ? "تم تجهيز فاتورة الشحن" : "Invoice generated and verified",
      status: "completed",
    },
    {
      title: language === "ar" ? "جارٍ التجهيز والتغليف" : "Preparing & Packing",
      desc: language === "ar" ? "تجهيز وتغليف الإكسسوارات في صندوق DRSH" : "Carefully boxed in luxury DRSH packaging",
      status: "active",
    },
    {
      title: language === "ar" ? "تسليم لمندوب بوسطة" : "Handed to Bosta Courier",
      desc: language === "ar" ? "تسليم الشحنة لمندوب شركة بوسطة" : "Dispatched for express courier pickup",
      status: "pending",
    },
    {
      title: language === "ar" ? "في الطريق للتسليم" : "Out for Delivery",
      desc: language === "ar" ? "الشحنة في طريقها لعنوانك اليوم" : "Courier is on the way to your door",
      status: "pending",
    },
    {
      title: language === "ar" ? "تم التوصيل واستلام المبلغ (COD)" : "Delivered & Paid COD",
      desc: language === "ar" ? "تسليم الطلب ودفع المبلغ نقدًا بعد المعاينة" : "Cash collected after parcel inspection",
      status: "pending",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs uppercase font-extrabold tracking-widest text-[#686B6B]">
          {t("track.eyebrow")}
        </span>
        <h1 className="text-3xl font-extrabold text-[#0B0B0B] uppercase tracking-tight mt-1">
          {t("track.title")}
        </h1>
        <p className="text-xs text-neutral-500 mt-2">
          {t("track.subtitle")}
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white border border-neutral-200 rounded-sm p-6 sm:p-8 shadow-xs mb-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="grid grid-cols-1 sm:grid-cols-12 gap-4"
        >
          <div className="sm:col-span-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0B0B0B] mb-1.5">
              {t("track.orderNumLabel")}
            </label>
            <input
              type="text"
              required
              placeholder="e.g. DRSH-10452"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="w-full bg-[#F5F5F3] border border-neutral-300 rounded-sm p-3 text-sm font-mono uppercase focus:outline-none focus:border-black"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0B0B0B] mb-1.5">
              {t("track.phoneLabel")}
            </label>
            <input
              type="tel"
              placeholder="01XXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#F5F5F3] border border-neutral-300 rounded-sm p-3 text-sm focus:outline-none focus:border-black"
            />
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              className="w-full py-3.5 bg-[#0B0B0B] text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#D9C9B3] hover:text-[#0B0B0B] transition-colors flex items-center justify-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{t("track.trackBtn")}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Results View */}
      {searched && orderData && (
        <div className="bg-white border border-neutral-200 rounded-sm overflow-hidden shadow-xs">
          {/* Header Bar */}
          <div className="p-6 bg-neutral-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-[#D9C9B3] font-bold uppercase tracking-widest">
                {t("track.statusHeader")}
              </span>
              <h3 className="text-xl font-mono font-bold">{orderData.orderNumber}</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-amber-500/20 text-amber-300 px-3 py-1 rounded-xs font-bold border border-amber-500/40">
                {language === "ar" ? "جارٍ التجهيز والتغليف" : "In Preparation & Packing"}
              </span>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="p-6 sm:p-10 border-b border-neutral-100">
            <div className="space-y-6">
              {steps.map((st, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        st.status === "completed"
                          ? "bg-green-700 text-white"
                          : st.status === "active"
                          ? "bg-[#0B0B0B] text-[#D9C9B3] ring-4 ring-[#D9C9B3]/40"
                          : "bg-neutral-200 text-neutral-500"
                      }`}
                    >
                      {st.status === "completed" ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        i + 1
                      )}
                    </div>
                    {i < steps.length - 1 && (
                      <div
                        className={`w-0.5 h-10 mt-1 ${
                          st.status === "completed" ? "bg-green-700" : "bg-neutral-200"
                        }`}
                      />
                    )}
                  </div>

                  <div className="pt-0.5">
                    <h4 className="text-sm font-bold text-[#0B0B0B]">{st.title}</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">{st.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bosta Carrier Information */}
          <div className="p-6 bg-neutral-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-[#0B0B0B]" />
              <div>
                <span className="font-bold text-black block">{t("track.bostaPartner")}</span>
                <span className="text-neutral-500 font-mono">
                  Waybill: {orderData.bostaTrackingNumber}
                </span>
              </div>
            </div>

            <a
              href={`https://bosta.co/tracking-shipment/?track=${orderData.bostaTrackingNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-neutral-300 rounded-sm font-bold text-black hover:border-black transition-colors"
            >
              <span>{t("track.bostaPortalBtn")}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs">Loading tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
