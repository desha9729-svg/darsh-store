"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useProducts } from "@/context/products-context";
import { CATEGORIES } from "@/data/mock-products";
import { EGYPTIAN_GOVERNORATES } from "@/data/egypt-governorates";
import { generateSupabaseSQL } from "@/lib/products-store";
import { Product, Gender } from "@/types/ecommerce";
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
  Plus,
  Edit,
  Trash2,
  Copy,
  Check,
  X,
  Database,
  Eye,
  SlidersHorizontal,
  Sparkles,
  Layers,
  ArrowUpDown,
  ShoppingBag,
  Info,
} from "lucide-react";

// Preset curated images by category for 1-click photo selection
const PRESET_IMAGES: Record<string, { label: string; url: string }[]> = {
  watches: [
    { label: "ساعة سوداء مينيمال", url: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=800" },
    { label: "ساعة ستيل فضية", url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800" },
    { label: "ساعة جلد كلاسيك", url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800" },
  ],
  bags: [
    { label: "شنطة جلد سوداء", url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800" },
    { label: "شنطة سفر دافل", url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800" },
    { label: "شنطة كروس بني", url: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800" },
  ],
  jewelry: [
    { label: "خاتم تيتانيوم أسود", url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800" },
    { label: "إسورة كف معدنية", url: "https://images.unsplash.com/photo-1611591475887-8d07e60fa236?auto=format&fit=crop&q=80&w=800" },
    { label: "سلسلة فضية فخمة", url: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=800" },
  ],
  eyewear: [
    { label: "نظارة شمسية سوداء", url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800" },
    { label: "نظارة أفياتور فضية", url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800" },
  ],
  wallets: [
    { label: "محفظة جلد أسود", url: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800" },
    { label: "محفظة كروت جلد طبيعي", url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=800" },
  ],
  perfumes: [
    { label: "عطر عنبر ومسك فاخر", url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800" },
    { label: "عطر خشب الصندل", url: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800" },
  ],
};

interface ProductFormData {
  id?: string;
  name: string;
  categorySlug: string;
  gender: Gender;
  basePrice: number;
  compareAtPrice?: number;
  sku: string;
  stockQuantity: number;
  material: string;
  imageUrl: string;
  description: string;
  variantTitle: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
}

const DEFAULT_FORM_DATA: ProductFormData = {
  name: "",
  categorySlug: "watches",
  gender: "unisex",
  basePrice: 899,
  compareAtPrice: 1099,
  sku: "",
  stockQuantity: 15,
  material: "ستانلس ستيل 316L مقاوم للماء والصدأ",
  imageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=800",
  description: "قطعة مميزة بتصميم درش العصري، مصنعة بأعلى معايير الدقة والخامات المتينة مع ضمان كامل عند الاستلام.",
  variantTitle: "اللون الأسود المطفي الافتراضي",
  isFeatured: true,
  isNewArrival: true,
  isBestSeller: false,
};

export default function AdminDashboardPage() {
  const { products, addProduct, updateProduct, deleteProduct, updateStock } = useProducts();

  const [activeTab, setActiveTab] = useState<"products" | "orders" | "inventory" | "coupons" | "shipping">("products");
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [orderSearch, setOrderSearch] = useState("");

  // Product Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(DEFAULT_FORM_DATA);

  // SQL Export Modal State
  const [sqlModalContent, setSqlModalContent] = useState<string | null>(null);
  const [copiedSQL, setCopiedSQL] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

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

  const coupons = [
    { code: "WELCOME10", discount: "10% خصم", uses: 48, status: "نشط" },
    { code: "DRSH10", discount: "10% خصم", uses: 112, status: "نشط" },
    { code: "SAVE100", discount: "100 ج.م", uses: 25, status: "نشط" },
  ];

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast("تم تحديث حالة الأوردر بنجاح!");
  };

  // Inventory rows flattened from variants
  const inventoryItems = products.flatMap((p) =>
    p.variants.map((v) => ({
      productId: p.id,
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

  // Auto-generate SKU
  const generateSKU = (catSlug: string) => {
    const prefix = catSlug.slice(0, 3).toUpperCase();
    const rand = Math.floor(100 + Math.random() * 900);
    return `DRSH-${prefix}-${rand}`;
  };

  // Open modal to add product
  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setFormData({
      ...DEFAULT_FORM_DATA,
      sku: generateSKU("watches"),
    });
    setIsModalOpen(true);
  };

  // Open modal to edit product
  const handleOpenEditModal = (p: Product) => {
    setEditingProductId(p.id);
    const mainVar = p.variants[0];
    setFormData({
      id: p.id,
      name: p.name,
      categorySlug: p.categorySlug,
      gender: p.gender,
      basePrice: p.basePrice,
      compareAtPrice: p.compareAtPrice || 0,
      sku: p.sku,
      stockQuantity: mainVar ? mainVar.stockQuantity : 10,
      material: p.material || "",
      imageUrl: p.images[0] || "",
      description: p.description,
      variantTitle: mainVar ? mainVar.title : "الافتراضي",
      isFeatured: Boolean(p.isFeatured),
      isNewArrival: Boolean(p.isNewArrival),
      isBestSeller: Boolean(p.isBestSeller),
    });
    setIsModalOpen(true);
  };

  // Save product form
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("يرجى إدخال اسم المنتج");
      return;
    }

    const matchedCat = CATEGORIES.find((c) => c.slug === formData.categorySlug);
    const categoryName = matchedCat ? matchedCat.name : formData.categorySlug;
    const finalSKU = formData.sku.trim() || generateSKU(formData.categorySlug);

    const slug = formData.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newVariant = {
      id: `var-${Date.now()}`,
      sku: finalSKU,
      title: formData.variantTitle || "الافتراضي",
      price: Number(formData.basePrice),
      compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
      stockQuantity: Number(formData.stockQuantity),
      attributes: {
        color: formData.variantTitle,
        material: formData.material,
      },
    };

    if (editingProductId) {
      // Update existing
      const existing = products.find((p) => p.id === editingProductId);
      if (existing) {
        const updated: Product = {
          ...existing,
          name: formData.name,
          category: categoryName,
          categorySlug: formData.categorySlug,
          gender: formData.gender,
          basePrice: Number(formData.basePrice),
          compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
          sku: finalSKU,
          material: formData.material,
          images: [formData.imageUrl, ...(existing.images.slice(1))],
          description: formData.description,
          isFeatured: formData.isFeatured,
          isNewArrival: formData.isNewArrival,
          isBestSeller: formData.isBestSeller,
          variants: [newVariant],
        };
        updateProduct(updated);
        showToast(`تم تحديث المنتج "${formData.name}" بنجاح!`);
      }
    } else {
      // Add new
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        name: formData.name,
        slug: `${slug}-${Math.floor(100 + Math.random() * 900)}`,
        category: categoryName,
        categorySlug: formData.categorySlug,
        gender: formData.gender,
        basePrice: Number(formData.basePrice),
        compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
        sku: finalSKU,
        material: formData.material,
        images: [formData.imageUrl],
        description: formData.description,
        isFeatured: formData.isFeatured,
        isNewArrival: formData.isNewArrival,
        isBestSeller: formData.isBestSeller,
        variants: [newVariant],
      };
      addProduct(newProd);
      showToast(`تمت إضافة منتج "${formData.name}" بنجاح إلى المتجر والمخزون!`);
    }

    setIsModalOpen(false);
  };

  // Delete product
  const handleDeleteProduct = (p: Product) => {
    if (confirm(`هل أنت متأكد من حذف المنتج "${p.name}" نهائياً من المتجر والمخزون؟`)) {
      deleteProduct(p.id);
      showToast(`تم حذف المنتج "${p.name}".`);
    }
  };

  // Open Supabase SQL export modal
  const handleOpenSqlModal = (p: Product) => {
    const sql = generateSupabaseSQL(p);
    setSqlModalContent(sql);
    setCopiedSQL(false);
  };

  // Copy SQL
  const handleCopySQL = () => {
    if (sqlModalContent) {
      navigator.clipboard.writeText(sqlModalContent);
      setCopiedSQL(true);
      setTimeout(() => setCopiedSQL(false), 2500);
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    if (productCategoryFilter !== "all" && p.categorySlug !== productCategoryFilter) {
      return false;
    }
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSKU = p.sku.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      return matchName || matchSKU || matchCat;
    }
    return true;
  });

  // Filter orders
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
    <div className="min-h-screen bg-[#0F172A] text-slate-100 font-sans pb-16" dir="rtl">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-md shadow-2xl flex items-center gap-3 border border-emerald-400 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span className="font-bold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* 1. Dedicated Admin Top Navigation Header (Isolated) */}
      <header className="bg-[#1E293B] border-b border-slate-700/80 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Admin Brand / System Label */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-amber-500 text-slate-950 rounded-sm flex items-center justify-center font-black text-2xl shadow-md">
              D
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-wide text-white">
                  لوحة تحكم درش (DRSH Operations)
                </span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[11px] font-bold rounded-xs border border-emerald-500/40">
                  قاعدة البيانات نشطة
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                إدارة المنتجات والأصناف • متابعة أوردرات الدفع عند الاستلام • بوالص بوسطة
              </p>
            </div>
          </div>

          {/* Quick Actions in Header */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-sm text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>إضافة منتج جديد</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-sm text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors"
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
              <span className="font-bold">إجمالي المنتجات في الكتالوج</span>
              <ShoppingBag className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-3xl font-black text-white">{products.length}</span>
            <span className="text-[11px] text-amber-400 block mt-1 font-semibold">
              منتجات معروضة للبيع الفوري
            </span>
          </div>

          <div className="bg-[#1E293B] p-5 rounded-sm border border-slate-700/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-bold">طلبات بانتظار التأكيد (COD)</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-3xl font-black text-amber-400">
              {orders.filter((o) => o.status === "pending_confirmation").length}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              أوردرات تتطلب اتصال هاتفي
            </span>
          </div>

          <div className="bg-[#1E293B] p-5 rounded-sm border border-slate-700/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-bold">إجمالي المبيعات المحققة</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-3xl font-black text-white">{totalRevenue.toLocaleString()} ج.م</span>
            <span className="text-[11px] text-emerald-400 block mt-1">شحن لجميع المحافظات</span>
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
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2.5 text-xs font-bold rounded-sm transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === "products"
                ? "bg-amber-500 text-slate-950 shadow-md font-black"
                : "bg-[#1E293B] text-slate-300 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>إدارة المنتجات والأصناف ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2.5 text-xs font-bold rounded-sm transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === "orders"
                ? "bg-amber-500 text-slate-950 shadow-md font-black"
                : "bg-[#1E293B] text-slate-300 hover:text-white"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>إدارة الطلبات وبوالص الشحن ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-4 py-2.5 text-xs font-bold rounded-sm transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === "inventory"
                ? "bg-amber-500 text-slate-950 shadow-md font-black"
                : "bg-[#1E293B] text-slate-300 hover:text-white"
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>جرد المخزون الفعلي ({inventoryItems.length} صنف)</span>
          </button>

          <button
            onClick={() => setActiveTab("coupons")}
            className={`px-4 py-2.5 text-xs font-bold rounded-sm transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === "coupons"
                ? "bg-amber-500 text-slate-950 shadow-md font-black"
                : "bg-[#1E293B] text-slate-300 hover:text-white"
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>كوبونات الخصم ({coupons.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("shipping")}
            className={`px-4 py-2.5 text-xs font-bold rounded-sm transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === "shipping"
                ? "bg-amber-500 text-slate-950 shadow-md font-black"
                : "bg-[#1E293B] text-slate-300 hover:text-white"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>تسعيرة المحافظات (بوسطة)</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* Tab 0: Products Management (The Core Feature Requested)                   */}
        {/* ========================================================================= */}
        {activeTab === "products" && (
          <div className="space-y-4">
            
            {/* Action Bar & Filtering */}
            <div className="bg-[#1E293B] p-4 rounded-sm border border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="بحث باسم المنتج، الكود (SKU)، أو القسم..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="bg-slate-900 border border-slate-600 rounded-sm py-2 px-3 pl-8 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 w-72"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>

                {/* Category Filter Dropdown */}
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-600 rounded-sm py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="all">جميع الأقسام ({products.length})</option>
                  <option value="watches">ساعات (Watches)</option>
                  <option value="bags">حقائب وجلود (Bags)</option>
                  <option value="jewelry">مجوهرات وخواتم (Jewelry)</option>
                  <option value="eyewear">نظارات شمسية (Eyewear)</option>
                  <option value="wallets">محافظ وكروت (Wallets)</option>
                  <option value="perfumes">عطور فاخرة (Perfumes)</option>
                </select>
              </div>

              {/* Big "Add Product" CTA */}
              <button
                onClick={handleOpenAddModal}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-sm text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>إضافة منتج جديد للكتالوج</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-[#1E293B] border border-slate-700/80 rounded-sm overflow-hidden shadow-xs">
              <div className="p-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">قائمة المنتجات المعروضة بالمتجر</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    التحكم الكامل بالأسعار، المخزون، الصور، وتصدير أكواد SQL
                  </p>
                </div>
                <span className="text-xs font-bold text-amber-400">
                  {filteredProducts.length} منتج مطابق
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-800 text-slate-400 font-semibold border-b border-slate-700">
                    <tr>
                      <th className="p-4">المنتج</th>
                      <th className="p-4">القسم والجمهور</th>
                      <th className="p-4">سعر البيع</th>
                      <th className="p-4">الكمية بالمخزن</th>
                      <th className="p-4">الحالة</th>
                      <th className="p-4">الظهور</th>
                      <th className="p-4 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {filteredProducts.map((p) => {
                      const mainVariant = p.variants[0];
                      const stock = mainVariant ? mainVariant.stockQuantity : 0;
                      const isLow = stock <= 3 && stock > 0;
                      const isOut = stock === 0;

                      return (
                        <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                          {/* Product Info with Image */}
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-slate-800 rounded-sm overflow-hidden relative shrink-0 border border-slate-700">
                                {p.images[0] ? (
                                  <Image
                                    src={p.images[0]}
                                    alt={p.name}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500">
                                    لا صورة
                                  </div>
                                )}
                              </div>
                              <div>
                                <span className="font-bold text-white text-sm block">
                                  {p.name}
                                </span>
                                <span className="font-mono text-slate-400 text-[11px] block mt-0.5">
                                  SKU: {p.sku}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Category & Gender */}
                          <td className="p-4">
                            <span className="font-semibold text-slate-200 block">
                              {p.category}
                            </span>
                            <span className="text-[11px] text-slate-400 block mt-0.5">
                              {p.gender === "men"
                                ? "رجالي"
                                : p.gender === "women"
                                ? "حريمي"
                                : "للجنسين (Unisex)"}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-amber-400 text-sm">
                                {p.basePrice} ج.م
                              </span>
                              {p.compareAtPrice && p.compareAtPrice > p.basePrice && (
                                <span className="text-[11px] text-slate-400 line-through">
                                  {p.compareAtPrice} ج.م
                                </span>
                              )}
                            </div>
                            {p.compareAtPrice && p.compareAtPrice > p.basePrice && (
                              <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">
                                وفر {p.compareAtPrice - p.basePrice} ج.م
                              </span>
                            )}
                          </td>

                          {/* Stock with Quick Buttons */}
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateStock(p.sku, stock - 1)}
                                className="w-6 h-6 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xs flex items-center justify-center border border-slate-600 cursor-pointer"
                                title="إنقاص المخزون بواحد"
                              >
                                -
                              </button>
                              <span className="font-black text-white text-sm min-w-6 text-center">
                                {stock}
                              </span>
                              <button
                                onClick={() => updateStock(p.sku, stock + 1)}
                                className="w-6 h-6 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xs flex items-center justify-center border border-slate-600 cursor-pointer"
                                title="زيادة المخزون بواحد"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="p-4">
                            {isOut ? (
                              <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold rounded-xs">
                                نفد من المخزون
                              </span>
                            ) : isLow ? (
                              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold rounded-xs">
                                متبقي قليل ({stock})
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold rounded-xs">
                                متوفر في المخزن
                              </span>
                            )}
                          </td>

                          {/* Badges */}
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {p.isFeatured && (
                                <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[9px] font-bold rounded-xs">
                                  مميز بالرئيسية
                                </span>
                              )}
                              {p.isNewArrival && (
                                <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-300 border border-blue-500/30 text-[9px] font-bold rounded-xs">
                                  وصل حديثاً
                                </span>
                              )}
                              {p.isBestSeller && (
                                <span className="px-1.5 py-0.5 bg-purple-500/10 text-purple-300 border border-purple-500/30 text-[9px] font-bold rounded-xs">
                                  الأكثر طلباً
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* View in Store */}
                              <Link
                                href={`/product/${p.slug}`}
                                target="_blank"
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xs border border-slate-700 transition-colors"
                                title="معاينة المنتج في المتجر"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </Link>

                              {/* Edit Button */}
                              <button
                                onClick={() => handleOpenEditModal(p)}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 rounded-xs border border-slate-700 transition-colors cursor-pointer"
                                title="تعديل بيانات المنتج"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              {/* Supabase SQL Button */}
                              <button
                                onClick={() => handleOpenSqlModal(p)}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 rounded-xs border border-slate-700 transition-colors cursor-pointer"
                                title="توليد كود SQL لـ Supabase"
                              >
                                <Database className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={() => handleDeleteProduct(p)}
                                className="p-1.5 bg-slate-800 hover:bg-rose-900/40 text-rose-400 hover:text-rose-300 rounded-xs border border-slate-700 hover:border-rose-500/40 transition-colors cursor-pointer"
                                title="حذف المنتج"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Orders Management */}
        {activeTab === "orders" && (
          <div className="bg-[#1E293B] border border-slate-700/80 rounded-sm overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-800/80 border-b border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white">
                  أوردرات العملاء الواردة (الدفع عند الاستلام COD)
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
                              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xs transition-colors cursor-pointer"
                            >
                              تأكيد الطلب
                            </button>
                          )}
                          {o.status === "preparing" && (
                            <button
                              onClick={() => updateOrderStatus(o.id, "shipped")}
                              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xs transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Truck className="w-3 h-3" />
                              <span>إصدار بوليصة بوسطة</span>
                            </button>
                          )}
                          {o.status === "shipped" && (
                            <button
                              onClick={() => updateOrderStatus(o.id, "delivered")}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xs transition-colors cursor-pointer"
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
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateStock(item.sku, item.stock - 1)}
                            className="w-5 h-5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xs flex items-center justify-center border border-slate-600 cursor-pointer text-xs"
                          >
                            -
                          </button>
                          <span className="font-black text-white text-sm min-w-5 text-center">
                            {item.stock}
                          </span>
                          <button
                            onClick={() => updateStock(item.sku, item.stock + 1)}
                            className="w-5 h-5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xs flex items-center justify-center border border-slate-600 cursor-pointer text-xs"
                          >
                            +
                          </button>
                        </div>
                      </td>
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

      {/* ========================================================================= */}
      {/* Product Add / Edit Modal                                                  */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-[#1E293B] border border-slate-700 rounded-sm w-full max-w-2xl overflow-hidden shadow-2xl my-8">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-sm bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
                  {editingProductId ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4 stroke-[3]" />}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    {editingProductId ? "تعديل بيانات المنتج" : "إضافة منتج جديد لمتجر درش"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    أدخل تفاصيل ومواصفات المنتج لإدراجه فوراً في المتجر والمخزون
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-sm bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  اسم المنتج بالكامل <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: ساعة DRSH أوبسيديان الفاخرة ذات المينا الأسود"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-sm py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Category & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    القسم الرئيسي <span className="text-amber-400">*</span>
                  </label>
                  <select
                    value={formData.categorySlug}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      setFormData({
                        ...formData,
                        categorySlug: newCat,
                        sku: generateSKU(newCat),
                      });
                    }}
                    className="w-full bg-slate-900 border border-slate-600 rounded-sm py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="watches">ساعات (Watches)</option>
                    <option value="bags">حقائب وجلود (Bags)</option>
                    <option value="jewelry">مجوهرات وخواتم (Jewelry)</option>
                    <option value="eyewear">نظارات شمسية (Eyewear)</option>
                    <option value="wallets">محافظ وكروت (Wallets)</option>
                    <option value="perfumes">عطور فاخرة (Perfumes)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    الفئة المستهدفة <span className="text-amber-400">*</span>
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                    className="w-full bg-slate-900 border border-slate-600 rounded-sm py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="unisex">للجنسين (Unisex)</option>
                    <option value="men">رجالي (Men)</option>
                    <option value="women">حريمي (Women)</option>
                  </select>
                </div>
              </div>

              {/* Pricing & SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    سعر البيع (ج.م) <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-600 rounded-sm py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    السعر قبل الخصم (ج.م)
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="اختياري لعرض التخفيض"
                    value={formData.compareAtPrice || ""}
                    onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full bg-slate-900 border border-slate-600 rounded-sm py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-200">
                      كود الصنف (SKU)
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, sku: generateSKU(formData.categorySlug) })}
                      className="text-[10px] text-amber-400 hover:underline cursor-pointer"
                    >
                      توليد تلقائي
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-600 rounded-sm py-2 px-3 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Stock Quantity & Material */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    الكمية المتوفرة بالمخزن <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-600 rounded-sm py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    خامة المنتج / المواصفات
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: ستانلس ستيل 316L، جلد طبيعي، تيتانيوم"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-600 rounded-sm py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Image URL & Instant Preview */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  رابط صورة المنتج (Image URL) <span className="text-amber-400">*</span>
                </label>
                <div className="flex gap-3 items-start">
                  <div className="flex-1 space-y-2">
                    <input
                      type="url"
                      required
                      placeholder="https://images.unsplash.com/..."
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-600 rounded-sm py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                    />

                    {/* Quick Presets for this category */}
                    {PRESET_IMAGES[formData.categorySlug] && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-slate-400">صور سريعة مقترحة:</span>
                        {PRESET_IMAGES[formData.categorySlug].map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setFormData({ ...formData, imageUrl: preset.url })}
                            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] rounded-xs border border-slate-600 transition-colors cursor-pointer"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Preview */}
                  <div className="w-16 h-16 bg-slate-900 border border-slate-600 rounded-sm overflow-hidden relative shrink-0">
                    {formData.imageUrl ? (
                      <Image
                        src={formData.imageUrl}
                        alt="معاينة الصورة"
                        fill
                        className="object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500">
                        معاينة
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Variant / Color Title */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  الموديل أو اللون الافتراضي
                </label>
                <input
                  type="text"
                  placeholder="مثال: أسود مطفي (Matte Black) أو المقاس 40mm"
                  value={formData.variantTitle}
                  onChange={(e) => setFormData({ ...formData, variantTitle: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-sm py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  وصف المنتج ومميزاته
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-sm py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 leading-relaxed"
                />
              </div>

              {/* Badges / Visibility Flags */}
              <div className="p-3 bg-slate-900/80 border border-slate-700 rounded-sm space-y-2">
                <span className="block text-xs font-bold text-slate-300 mb-2">
                  خيارات الترويج والعرض:
                </span>
                <div className="flex flex-wrap gap-4 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="rounded-xs border-slate-600 text-amber-500 focus:ring-0"
                    />
                    <span>إظهار في قسم "المميزة" بالرئيسية</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isNewArrival}
                      onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                      className="rounded-xs border-slate-600 text-amber-500 focus:ring-0"
                    />
                    <span>وضع شارة "وصل حديثاً"</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isBestSeller}
                      onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                      className="rounded-xs border-slate-600 text-amber-500 focus:ring-0"
                    />
                    <span>وضع شارة "الأكثر مبيعاً"</span>
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-700 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-sm text-xs transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-sm text-xs shadow-md transition-all cursor-pointer"
                >
                  {editingProductId ? "تحديث ونشر التعديلات" : "حفظ وإضافة المنتج للمتجر"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Supabase SQL Export Modal                                                 */}
      {/* ========================================================================= */}
      {sqlModalContent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#1E293B] border border-slate-700 rounded-sm w-full max-w-xl overflow-hidden shadow-2xl">
            <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">
                  كود SQL جاهز للإدخال في قاعدة بيانات Supabase
                </h3>
              </div>
              <button
                onClick={() => setSqlModalContent(null)}
                className="w-7 h-7 rounded-sm bg-slate-700 hover:bg-slate-600 text-slate-300 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <p className="text-xs text-slate-400 leading-relaxed">
                يمكنك نسخ هذا الكود ولصقه مباشرة في **SQL Editor** داخل لوحة تحكم **Supabase** لتثبيت المنتج في قاعدة البيانات السحابية PostgreSQL:
              </p>

              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-sm text-emerald-400 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap leading-relaxed dir-ltr text-left">
                {sqlModalContent}
              </pre>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">
                  متوافق مع جداول `schema.sql` الخاصة بـ DRSH
                </span>
                <button
                  onClick={handleCopySQL}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-sm text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedSQL ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>تم نسخ الكود!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ كود SQL</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
