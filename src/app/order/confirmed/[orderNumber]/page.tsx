"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";
import { formatPrice } from "@/lib/utils";
import { CheckCircle2, Truck, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";

export default function OrderConfirmedPage() {
  const params = useParams();
  const orderNumber = (params?.orderNumber as string) || "DRSH-10001";
  const [order, setOrder] = useState<any>(null);
  const { language, t, isRTL } = useLanguage();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`drsh_order_${orderNumber}`);
      if (saved) {
        setOrder(JSON.parse(saved));
      }
    } catch {
      // fallback
    }
  }, [orderNumber]);

  const priceLabel = (val: number) => {
    return language === "ar" ? `${val} ج.م` : formatPrice(val);
  };

  return (
    <div className="bg-[#F5F5F3] min-h-screen py-12 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Confirmation Card */}
        <div className="bg-white border border-neutral-200 rounded-sm p-8 sm:p-12 text-center shadow-xs">
          <div className="w-16 h-16 bg-[#0B0B0B] text-[#D9C9B3] rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs uppercase font-extrabold tracking-widest text-[#D9C9B3] bg-[#0B0B0B] px-3 py-1 rounded-xs inline-block mb-3">
            {t("confirmation.badge")}
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B0B0B] tracking-tight">
            {t("confirmation.title")}
          </h1>
          <p className="text-sm text-neutral-600 mt-2">
            {t("confirmation.subtitle")}
          </p>

          <div className="mt-6 inline-flex items-center gap-3 p-3 bg-neutral-50 border border-neutral-200 rounded-sm">
            <span className="text-xs text-[#686B6B] uppercase font-semibold">
              {t("confirmation.orderNumLabel")}
            </span>
            <span className="text-base font-extrabold text-[#0B0B0B] font-mono tracking-wider">
              {orderNumber}
            </span>
          </div>

          {/* Stepper Preview */}
          <div className="mt-8 pt-8 border-t border-neutral-100 grid grid-cols-3 gap-2 text-center">
            <div className="space-y-1">
              <div className="w-6 h-6 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center mx-auto">
                1
              </div>
              <span className="text-[11px] font-bold text-black block">{t("confirmation.step1")}</span>
              <span className="text-[10px] text-green-700 font-semibold">Confirmed</span>
            </div>
            <div className="space-y-1">
              <div className="w-6 h-6 rounded-full bg-[#D9C9B3] text-black text-xs font-bold flex items-center justify-center mx-auto">
                2
              </div>
              <span className="text-[11px] font-bold text-black block">{t("confirmation.step2")}</span>
              <span className="text-[10px] text-neutral-500">Pick & Pack</span>
            </div>
            <div className="space-y-1">
              <div className="w-6 h-6 rounded-full bg-neutral-200 text-neutral-600 text-xs font-bold flex items-center justify-center mx-auto">
                3
              </div>
              <span className="text-[11px] font-bold text-neutral-500 block">{t("confirmation.step3")}</span>
              <span className="text-[10px] text-neutral-400">Cash on Delivery</span>
            </div>
          </div>
        </div>

        {/* Order Details & Delivery Instructions */}
        <div className="mt-8 bg-white border border-neutral-200 rounded-sm p-6 sm:p-8 space-y-6 shadow-xs">
          <h2 className="text-base font-bold uppercase tracking-wider text-[#0B0B0B] pb-3 border-b border-neutral-100 flex items-center justify-between">
            <span>{t("confirmation.fulfillmentTitle")}</span>
            <ShieldCheck className="w-5 h-5 text-[#0B0B0B]" />
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <span className="text-[#686B6B] uppercase font-semibold block mb-1">
                {t("confirmation.paymentMethodLabel")}
              </span>
              <p className="font-extrabold text-[#0B0B0B] text-sm">
                {t("confirmation.paymentMethodVal")}
              </p>
              <p className="text-neutral-500 mt-1">
                {t("confirmation.paymentMethodNotice")}
              </p>
            </div>

            <div>
              <span className="text-[#686B6B] uppercase font-semibold block mb-1">
                {t("confirmation.carrierLabel")}
              </span>
              <p className="font-extrabold text-[#0B0B0B] text-sm">
                {t("confirmation.carrierVal")}
              </p>
              <p className="text-neutral-500 mt-1">
                Tracking: <span className="font-mono">{order?.bostaTrackingNumber || `BST-${orderNumber.replace("DRSH-", "")}`}</span>
              </p>
            </div>
          </div>

          {/* Delivery Address Summary */}
          {order && (
            <div className="p-4 bg-neutral-50 rounded-sm border border-neutral-200 text-xs space-y-1.5">
              <span className="font-bold text-black uppercase block mb-1">{t("confirmation.destLabel")}</span>
              <p className="text-neutral-800">
                <strong>{order.customerName}</strong> ({order.phone})
              </p>
              <p className="text-neutral-700">
                {order.streetAddress}, Bldg {order.buildingNo || "—"}, Floor {order.floorNo || "—"}, Apt {order.apartmentNo || "—"}, {order.city}, {order.governorate}
              </p>
              {order.landmark && (
                <p className="text-neutral-600">
                  <strong>Landmark:</strong> {order.landmark}
                </p>
              )}
            </div>
          )}

          {/* Items & Final Amount */}
          {order && order.items && (
            <div className="pt-4 border-t border-neutral-100 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-black">
                {t("confirmation.itemsLabel")}
              </h3>
              <div className="divide-y divide-neutral-100">
                {order.items.map((item: any) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 bg-neutral-100 rounded-xs overflow-hidden shrink-0">
                        <Image src={item.image} alt="" fill className="object-cover" />
                      </div>
                      <div>
                        <span className="font-semibold text-black block">{item.productName}</span>
                        <span className="text-[#686B6B]">{item.variantTitle} × {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-black">{priceLabel(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline text-sm font-extrabold text-black">
                <span>{t("confirmation.totalDueLabel")}</span>
                <span className="text-base text-[#0B0B0B]">{priceLabel(order.totalAmount)}</span>
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center gap-4">
            <Link
              href={`/track-order?order=${orderNumber}`}
              className="w-full sm:w-auto flex-1 py-3.5 px-6 bg-[#0B0B0B] text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#D9C9B3] hover:text-[#0B0B0B] transition-colors flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>{t("confirmation.trackBtn")}</span>
            </Link>

            <Link
              href="/shop"
              className="w-full sm:w-auto flex-1 py-3.5 px-6 bg-white border border-neutral-300 text-[#0B0B0B] text-xs font-bold uppercase tracking-wider rounded-sm hover:border-black transition-colors flex items-center justify-center gap-2"
            >
              <span>{t("confirmation.continueBtn")}</span>
              <ArrowRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
