"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/data/mock-products";
import { EGYPTIAN_GOVERNORATES } from "@/data/egypt-governorates";
import {
  Package,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Truck,
  ExternalLink,
  Search,
  Tag,
  MapPin,
  RefreshCw,
  LogOut,
  ShieldAlert,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "inventory" | "coupons" | "shipping">("orders");
  const [orderSearch, setOrderSearch] = useState("");

  // Orders State
  const [orders, setOrders] = useState([
    {
      id: "ord-1",
      orderNumber: "DRSH-10452",
      customer: "مصطفى محمود",
      phone: "01098765432",
      governorate: "كفر الشيخ",
      city: "كفر الشيخ",
      address: "شارع الجيش - برج الفيروز - الدور 4",
      items: "ساعة Obsidian سوداء (1×)",
      total: 1299,
      status: "pending_confirmation",
      date: "اليوم 18:40",
      bostaTracking: "BST-10452-EGY",
    },
    {
      id: "ord-2",
      orderNumber: "DRSH-10451",
      customer: "كريم عادل",
      phone: "01234567890",
      governorate: "القاهرة",
      city: "المعادي",
      address: "شارع النصر - عمارة 12 - الدور 2",
      items: "خاتم تيتانيوم مقاس 9 (1×)",
      total: 899,
      status: "preparing",
      date: "اليوم 14:15",
      bostaTracking: "BST-10451-EGY",
    },
    {
      id: "ord-3",
      orderNumber: "DRSH-10448",
      customer: "نورهان سامي",
      phone: "01122334455",
      governorate: "الجيزة",
      city: "الدقي",
      address: "شارع التحرير - أمام محطة المترو",
      items: "حقيبة كروس جلدية بيج (1×)",
      total: 1450,
      status: "shipped",
      date: "أمس",
      bostaTracking: "BST-10448-EGY",
    },
    {
      id: "ord-4",
      orderNumber: "DRSH-10440",
      customer: "طارق يوسف",
      phone: "01001122334",
      governorate: "الإسكندرية",
      city: "سموحة",
      address: "شارع فيكتور عمانويل",
      items: "طقم الهدايا المتكامل (1×)",
      total: 2149,
      status: "delivered",
      date: "منذ يومين",
      bostaTracking: "BST-10440-EGY",
    },
  ]);

  // Coupons Data
  const coupons = [
    { code: "WELCOME10", discount: "10% خصم", uses: 48, status: "نشط" },
    { code: "DRSH10", discount: "10% خصم", uses: 112, status: "نشط" },
    { code: "SAVE100", discount: "100 ج.م", uses: 25, status: "نشط" },
  ];

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  // Inventory rows flattened from variants
  const inventoryItems = PRODUCTS.flatMap((p) =>
    p.variants.map((v) => ({
      productName: p.name,
      sku: v.sku,
      title: v.title,
      price: v.price,
      stock: v.stockQuantity,
      isLow: v.stockQuantity <= 3 && v.stockQuantity > 0,
      isOut: v.stockQuantity === 0,
    }))
  );

  const lowStockCount = inventoryItems.filter((i) => i.isLow || i.isOut).length;
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);

  const filteredOrders = orders.filter((o) => {
    if (!orderSearch.trim()) return true;
    const q = orderSearch.toLowerCase();
    return (
      o.orderNumber.toLowerCase().includes(q) ||
      o.customer.toLowerCase().includes(q) ||
      o.phone.includes(q) ||
      o.governorate.includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100" dir="rtl">
      
      {/* 1. Dedicated Admin Top Navigation Header (Isolated) */}
      <header className="bg-[#1E293B] border-b border-slate-700/80 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Admin Brand / System Label */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 text-slate-950 rounded-sm flex items-center justify-center font-black text-xl shadow-xs">
              D
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-wide text-white">
                  لوحة تحكم درش (DRSH Operations)
                </span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-xs border border-emerald-500/40">
                  قاعدة البيانات متصلة
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                النظام الإداري للمتجر • إدارة الطلبات والدفع عند الاستلام وبوالص بوسطة
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-sm text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <span>معاينة المتجر كعميل</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Main Admin Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-[#1E293B] p-5 rounded-sm border border-slate-700/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-bold">إجمالي طلبات الدفع عند الاستلام</span>
              <Package className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-3xl font-black text-white">{orders.length}</span>
            <span className="text-[11px] text-emerald-400 block mt-1 font-semibold">
              شحن لجميع المحافظات مع بوسطة
            </span>
          </div>

          <div className="bg-[#1E293B] p-5 rounded-sm border border-slate-700/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-bold">في انتظار التأكيد الهاتفي</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-3xl font-black text-amber-400">
              {orders.filter((o) => o.status === "pending_confirmation").length}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              طلبات جديدة تحتاج اتصال للبدء بالتجهيز
            </span>
          </div>

          <div className="bg-[#1E293B] p-5 rounded-sm border border-slate-700/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-bold">إجمالي المبيعات المحققة</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-3xl font-black text-white">{totalRevenue} ج.م</span>
            <span className="text-[11px] text-slate-400 block mt-1">قيمة الأوردرات النشطة</span>
          </div>

          <div className="bg-[#1E293B] p-5 rounded-sm border border-slate-700/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-bold">تنبيهات نواقص المخزون</span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <span className="text-3xl font-black text-rose-400">{lowStockCount}</span>
            <span className="text-[11px] text-rose-300 block mt-1 font-medium">
              أصناف تحتاج إعادة طلب
            </span>
          </div>
        </div>

        {/* 3. Operational Navigation Tabs (Arabic Only) */}
        <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-slate-700 pb-3">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2.5 text-xs font-bold rounded-sm transition-colors flex items-center gap-2 ${
              activeTab === "orders"
                ? "bg-amber-500 text-slate-950 shadow-xs"
                : "bg-[#1E293B] text-slate-300 hover:text-white"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>إدارة الطلبات وبوالص الشحن ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-4 py-2.5 text-xs font-bold rounded-sm transition-colors flex items-center gap-2 ${
              activeTab === "inventory"
                ? "bg-amber-500 text-slate-950 shadow-xs"
                : "bg-[#1E293B] text-slate-300 hover:text-white"
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>جرد المخزون الفعلي ({inventoryItems.length} صنف)</span>
          </button>

          <button
            onClick={() => setActiveTab("coupons")}
            className={`px-4 py-2.5 text-xs font-bold rounded-sm transition-colors flex items-center gap-2 ${
              activeTab === "coupons"
                ? "bg-amber-500 text-slate-950 shadow-xs"
                : "bg-[#1E293B] text-slate-300 hover:text-white"
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>كوبونات الخصم ({coupons.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("shipping")}
            className={`px-4 py-2.5 text-xs font-bold rounded-sm transition-colors flex items-center gap-2 ${
              activeTab === "shipping"
                ? "bg-amber-500 text-slate-950 shadow-xs"
                : "bg-[#1E293B] text-slate-300 hover:text-white"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>تسعيرة المحافظات (بوسطة)</span>
          </button>
        </div>

        {/* Tab 1: Orders Management */}
        {activeTab === "orders" && (
          <div className="bg-[#1E293B] border border-slate-700/80 rounded-sm overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-800/80 border-b border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white">
                  أوردرات العملاء الواردة (الدفع عند الاستلام)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  تحديث الحالات وإنشاء بوالص الشحن عبر شبكة بوسطة
                </p>
              </div>

              {/* Search Box */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="بحث برقم الأوردر، الاسم، أو الهاتف..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="bg-slate-900 border border-slate-600 rounded-sm py-2 px-3 pl-8 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 w-64"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-800 text-slate-400 font-semibold border-b border-slate-700">
                  <tr>
                    <th className="p-4">رقم الطلب</th>
                    <th className="p-4">بيانات العميل</th>
                    <th className="p-4">عنوان التوصيل</th>
                    <th className="p-4">المنتجات المطلوبة</th>
                    <th className="p-4">إجمالي المطلوب (COD)</th>
                    <th className="p-4">حالة الطلب</th>
                    <th className="p-4">بوليصة بوسطة</th>
                    <th className="p-4 text-center">إجراءات المتابعة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-amber-400">{o.orderNumber}</td>
                      <td className="p-4">
                        <span className="font-bold text-white block">{o.customer}</span>
                        <a href={`tel:${o.phone}`} className="text-slate-400 hover:text-white font-mono dir-ltr inline-block">
                          {o.phone}
                        </a>
                      </td>
                      <td className="p-4 text-slate-300">
                        <span className="font-semibold block">{o.governorate} - {o.city}</span>
                        <span className="text-[11px] text-slate-400">{o.address}</span>
                      </td>
                      <td className="p-4 text-slate-200">{o.items}</td>
                      <td className="p-4 font-black text-white text-sm">{o.total} ج.م</td>
                      <td className="p-4">
                        {o.status === "pending_confirmation" && (
                          <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xs font-bold">
                            قيد المراجعة
                          </span>
                        )}
                        {o.status === "preparing" && (
                          <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded-xs font-bold">
                            جارٍ التجهيز والتغليف
                          </span>
                        )}
                        {o.status === "shipped" && (
                          <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-xs font-bold">
                            خرج للشحن (بوسطة)
                          </span>
                        )}
                        {o.status === "delivered" && (
                          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xs font-bold">
                            تم التسليم والدفع نقدًا
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-mono text-slate-400 text-[11px]">{o.bostaTracking}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {o.status === "pending_confirmation" && (
                            <button
                              onClick={() => updateOrderStatus(o.id, "preparing")}
                              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xs transition-colors"
                            >
                              تأكيد الطلب
                            </button>
                          )}
                          {o.status === "preparing" && (
                            <button
                              onClick={() => updateOrderStatus(o.id, "shipped")}
                              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xs transition-colors flex items-center gap-1"
                            >
                              <Truck className="w-3 h-3" />
                              <span>إصدار بوليصة بوسطة</span>
                            </button>
                          )}
                          {o.status === "shipped" && (
                            <button
                              onClick={() => updateOrderStatus(o.id, "delivered")}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xs transition-colors"
                            >
                              تأكيد الاستلام والدفع
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Inventory Matrix */}
        {activeTab === "inventory" && (
          <div className="bg-[#1E293B] border border-slate-700/80 rounded-sm overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">مصفوفة جرد المخزون الفعلي</h3>
                <p className="text-xs text-slate-400">تحديث فوري لكميات الـ SKUs والأصناف المتوفرة</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-800 text-slate-400 font-semibold border-b border-slate-700">
                  <tr>
                    <th className="p-4">اسم المنتج</th>
                    <th className="p-4">كود الصنف (SKU)</th>
                    <th className="p-4">الموديل / المقاس / اللون</th>
                    <th className="p-4">سعر البيع</th>
                    <th className="p-4">الكمية بالمخزن</th>
                    <th className="p-4">حالة الصنف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {inventoryItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-bold text-white">{item.productName}</td>
                      <td className="p-4 font-mono text-slate-400">{item.sku}</td>
                      <td className="p-4 text-slate-300">{item.title}</td>
                      <td className="p-4 font-bold text-white">{item.price} ج.م</td>
                      <td className="p-4 font-black text-white text-sm">{item.stock}</td>
                      <td className="p-4">
                        {item.isOut ? (
                          <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold rounded-xs">
                            نفد من المخزون
                          </span>
                        ) : item.isLow ? (
                          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold rounded-xs">
                            مخزون حرج (متبقي قليل)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold rounded-xs">
                            متوفر
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Coupons */}
        {activeTab === "coupons" && (
          <div className="bg-[#1E293B] border border-slate-700/80 rounded-sm overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">كوبونات الخصم الترويجية</h3>
                <p className="text-xs text-slate-400">إدارة أكواد الخصم والحدود القصوى</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-800 text-slate-400 font-semibold border-b border-slate-700">
                  <tr>
                    <th className="p-4">كود الخصم</th>
                    <th className="p-4">قيمة الخصم</th>
                    <th className="p-4">مرات الاستخدام</th>
                    <th className="p-4">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {coupons.map((c, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-amber-400 text-sm">{c.code}</td>
                      <td className="p-4 font-bold text-white">{c.discount}</td>
                      <td className="p-4 text-slate-300">{c.uses} مرة</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold rounded-xs">
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Egyptian Shipping Rates Matrix */}
        {activeTab === "shipping" && (
          <div className="bg-[#1E293B] border border-slate-700/80 rounded-sm overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">
                  تسعيرة الشحن لـ 27 محافظة مصرية (Bosta Express)
                </h3>
                <p className="text-xs text-slate-400">
                  تكاليف الشحن المحسوبة تلقائياً للعميل عند اختيار المحافظة أثناء الـ Checkout
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
              {EGYPTIAN_GOVERNORATES.map((g) => (
                <div key={g.id} className="p-3 bg-slate-900 border border-slate-700 rounded-sm flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white text-xs block">{g.nameAr} ({g.nameEn})</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">مدة التوصيل: {g.deliveryDays}</span>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-black rounded-xs">
                    {g.fee} ج.م
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
