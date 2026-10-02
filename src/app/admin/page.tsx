"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useProducts } from "@/context/products-context";
import { CATEGORIES } from "@/data/mock-products";
import { EGYPTIAN_GOVERNORATES } from "@/data/egypt-governorates";
import { generateSupabaseSQL } from "@/lib/products-store";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  testDatabaseConnection,
  syncAllProductsToDatabase,
  DatabaseConnectionStatus,
} from "@/lib/database-service";
import {
  Coupon,
  DiscountType,
  getStoredCoupons,
  saveStoredCoupons,
  syncCouponToSupabase,
  deleteCouponFromSupabase,
} from "@/lib/coupons-store";
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
  UploadCloud,
  FolderUp,
  Image as ImageIcon,
  Star,
  Link as LinkIcon,
  Loader2,
  Percent,
  Gift,
  Power,
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
  images: string[];
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
  images: ["https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=800"],
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

  // Google Drive & Images State
  const [driveUrlInput, setDriveUrlInput] = useState("");
  const [isExtractingDrive, setIsExtractingDrive] = useState(false);
  const [driveError, setDriveError] = useState<string | null>(null);
  const [manualImageUrl, setManualImageUrl] = useState("");
  const [imageTab, setImageTab] = useState<"drive" | "upload" | "url">("drive");

  // SQL Export Modal State
  const [sqlModalContent, setSqlModalContent] = useState<string | null>(null);
  const [copiedSQL, setCopiedSQL] = useState(false);

  // Database Manager Modal State
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState<DatabaseConnectionStatus | null>(null);
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  const handleOpenDbManager = async () => {
    setIsDbModalOpen(true);
    setIsTestingDb(true);
    const status = await testDatabaseConnection();
    setDbStatus(status);
    setIsTestingDb(false);
  };

  const handleTestDbConnection = async () => {
    setIsTestingDb(true);
    const status = await testDatabaseConnection();
    setDbStatus(status);
    setIsTestingDb(false);
    showToast(status.message);
  };

  const handleSyncAllToSupabase = async () => {
    setIsSyncingAll(true);
    const result = await syncAllProductsToDatabase(products);
    setIsSyncingAll(false);
    if (result.success) {
      showToast(`تمت مزامنة ${result.count} منتج بنجاح إلى قاعدة بيانات Supabase!`);
    } else {
      showToast(result.error || "تعذرت المزامنة، تحقق من الاتصال");
    }
  };

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

  // Dynamic Coupons Management State
  const [couponsList, setCouponsList] = useState<Coupon[]>([]);
  const [couponSearch, setCouponSearch] = useState("");
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
  const [couponFormData, setCouponFormData] = useState<{
    code: string;
    discountType: DiscountType;
    discountValue: number;
    minOrderAmount: number;
    usageLimit?: number | string;
    isActive: boolean;
  }>({
    code: "",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 0,
    usageLimit: 100,
    isActive: true,
  });
  const [isSavingCoupon, setIsSavingCoupon] = useState(false);
  const [isSyncingCoupons, setIsSyncingCoupons] = useState(false);

  useEffect(() => {
    setCouponsList(getStoredCoupons());
  }, []);

  // Filtered coupons
  const filteredCoupons = couponsList.filter((c) =>
    c.code.toLowerCase().includes(couponSearch.toLowerCase().trim())
  );

  const handleOpenAddCouponModal = () => {
    setEditingCouponId(null);
    const randNum = Math.floor(10 + Math.random() * 90);
    setCouponFormData({
      code: `DRSH${randNum}`,
      discountType: "percentage",
      discountValue: 10,
      minOrderAmount: 0,
      usageLimit: 100,
      isActive: true,
    });
    setIsCouponModalOpen(true);
  };

  const handleOpenEditCouponModal = (c: Coupon) => {
    setEditingCouponId(c.id);
    setCouponFormData({
      code: c.code,
      discountType: c.discountType,
      discountValue: c.discountValue,
      minOrderAmount: c.minOrderAmount || 0,
      usageLimit: c.usageLimit !== undefined ? c.usageLimit : "",
      isActive: c.isActive,
    });
    setIsCouponModalOpen(true);
  };

  const handleGenerateRandomCode = () => {
    const prefixes = ["DRSH", "VIP", "SAVE", "DEAL", "EGY"];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const val = couponFormData.discountValue || 10;
    setCouponFormData((prev) => ({ ...prev, code: `${prefix}${val}` }));
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = couponFormData.code.trim().toUpperCase();
    if (!cleanCode) {
      showToast("يرجى إدخال كود الكوبون");
      return;
    }
    if (couponFormData.discountValue <= 0) {
      showToast("يرجى إدخال قيمة خصم أكبر من 0");
      return;
    }

    const parsedLimit =
      couponFormData.usageLimit !== "" && couponFormData.usageLimit !== undefined
        ? Number(couponFormData.usageLimit)
        : undefined;
    const finalLimit = parsedLimit && parsedLimit > 0 ? parsedLimit : undefined;

    setIsSavingCoupon(true);
    let updated: Coupon[];
    let targetCoupon: Coupon;

    if (editingCouponId) {
      updated = couponsList.map((c) => {
        if (c.id === editingCouponId) {
          targetCoupon = {
            ...c,
            code: cleanCode,
            discountType: couponFormData.discountType,
            discountValue: Number(couponFormData.discountValue),
            minOrderAmount: Number(couponFormData.minOrderAmount || 0),
            usageLimit: finalLimit,
            isActive: couponFormData.isActive,
          };
          return targetCoupon;
        }
        return c;
      });
    } else {
      if (couponsList.some((c) => c.code.toUpperCase() === cleanCode)) {
        showToast("هذا الكود مستخدم بالفعل، يرجى كتابة كود مختلف");
        setIsSavingCoupon(false);
        return;
      }
      targetCoupon = {
        id: `coup-${Date.now()}`,
        code: cleanCode,
        discountType: couponFormData.discountType,
        discountValue: Number(couponFormData.discountValue),
        minOrderAmount: Number(couponFormData.minOrderAmount || 0),
        usageLimit: finalLimit,
        timesUsed: 0,
        isActive: couponFormData.isActive,
      };
      updated = [targetCoupon, ...couponsList];
    }

    setCouponsList(updated);
    saveStoredCoupons(updated);

    if (isSupabaseConfigured) {
      await syncCouponToSupabase(targetCoupon!);
    }

    setIsSavingCoupon(false);
    setIsCouponModalOpen(false);
    showToast(editingCouponId ? "تم تحديث بيانات الكوبون بنجاح!" : "تم إنشاء وتفعيل الكوبون الجديد بنجاح!");
  };

  const handleToggleCouponStatus = async (coupon: Coupon) => {
    const newStatus = !coupon.isActive;
    const updated = couponsList.map((c) =>
      c.id === coupon.id ? { ...c, isActive: newStatus } : c
    );
    setCouponsList(updated);
    saveStoredCoupons(updated);
    if (isSupabaseConfigured) {
      await syncCouponToSupabase({ ...coupon, isActive: newStatus });
    }
    showToast(newStatus ? `تم تفعيل الكوبون ${coupon.code} بنجاح` : `تم تعطيل الكوبون ${coupon.code}`);
  };

  const handleDeleteCoupon = async (coupon: Coupon) => {
    if (!confirm(`هل أنت متأكد من حذف الكوبون "${coupon.code}" نهائياً؟`)) return;
    const updated = couponsList.filter((c) => c.id !== coupon.id);
    setCouponsList(updated);
    saveStoredCoupons(updated);
    if (isSupabaseConfigured) {
      await deleteCouponFromSupabase(coupon.code);
    }
    showToast(`تم حذف الكوبون ${coupon.code} بنجاح`);
  };

  const handleSyncAllCoupons = async () => {
    if (!isSupabaseConfigured) {
      showToast("يرجى التأكد من ربط Supabase أولاً");
      return;
    }
    setIsSyncingCoupons(true);
    let successCount = 0;
    for (const c of couponsList) {
      const ok = await syncCouponToSupabase(c);
      if (ok) successCount++;
    }
    setIsSyncingCoupons(false);
    showToast(`تمت مزامنة ${successCount} كوبون مع قاعدة بيانات Supabase!`);
  };

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
      images: ["https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=800"],
    });
    setDriveUrlInput("");
    setDriveError(null);
    setManualImageUrl("");
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
      images: p.images && p.images.length > 0 ? p.images : ["https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=800"],
      description: p.description,
      variantTitle: mainVar ? mainVar.title : "الافتراضي",
      isFeatured: Boolean(p.isFeatured),
      isNewArrival: Boolean(p.isNewArrival),
      isBestSeller: Boolean(p.isBestSeller),
    });
    setDriveUrlInput("");
    setDriveError(null);
    setManualImageUrl("");
    setIsModalOpen(true);
  };

  // Extract images from Google Drive
  const handleExtractDriveImages = async () => {
    if (!driveUrlInput.trim()) {
      setDriveError("يرجى إدخال رابط فولدر أو ملف من Google Drive");
      return;
    }
    setIsExtractingDrive(true);
    setDriveError(null);
    try {
      const res = await fetch("/api/drive-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: driveUrlInput.trim() }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.images) && data.images.length > 0) {
        setFormData((prev) => ({
          ...prev,
          images: Array.from(new Set([
            ...prev.images.filter((img) => !img.includes("photo-1524805444758")),
            ...data.images,
          ])),
        }));
        showToast(`تم استخراج ${data.images.length} صورة من Google Drive بنجاح!`);
        setDriveUrlInput("");
      } else {
        setDriveError(data.message || "تعذر استخراج الصور من الرابط");
      }
    } catch (err) {
      setDriveError("تعذر الاتصال بالخادم لاستخراج الصور");
    } finally {
      setIsExtractingDrive(false);
    }
  };

  // Handle local file uploads (Base64)
  const handleLocalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    fileList.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setFormData((prev) => ({
            ...prev,
            images: [
              ...prev.images.filter((img) => !img.includes("photo-1524805444758")),
              result,
            ],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
    showToast(`تمت إضافة ${fileList.length} صور من جهازك للمعرض!`);
  };

  // Add manual URL
  const handleAddManualUrl = () => {
    if (!manualImageUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, manualImageUrl.trim()],
    }));
    setManualImageUrl("");
    showToast("تمت إضافة رابط الصورة للمعرض");
  };

  // Add preset image
  const handleAddPreset = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      images: Array.from(new Set([...prev.images, url])),
    }));
    showToast("تمت إضافة الصورة المقترحة للمعرض");
  };

  // Set image as cover
  const handleSetCoverImage = (index: number) => {
    if (index === 0) return;
    setFormData((prev) => {
      const reordered = [...prev.images];
      const [chosen] = reordered.splice(index, 1);
      reordered.unshift(chosen);
      return { ...prev, images: reordered };
    });
    showToast("تم تعيين الصورة كغلاف رئيسي للمنتج");
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    setFormData((prev) => {
      const filtered = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: filtered.length > 0 ? filtered : ["https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=800"],
      };
    });
    showToast("تم حذف الصورة من المعرض");
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

    const finalImages = formData.images.length > 0
      ? formData.images
      : ["https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=800"];

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
          images: finalImages,
          description: formData.description,
          isFeatured: formData.isFeatured,
          isNewArrival: formData.isNewArrival,
          isBestSeller: formData.isBestSeller,
          variants: [newVariant],
        };
        updateProduct(updated);
        showToast(`تم تحديث المنتج "${formData.name}" ومعرض الصور بنجاح!`);
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
        images: finalImages,
        description: formData.description,
        isFeatured: formData.isFeatured,
        isNewArrival: formData.isNewArrival,
        isBestSeller: formData.isBestSeller,
        variants: [newVariant],
      };
      addProduct(newProd);
      showToast(`تمت إضافة منتج "${formData.name}" مع ${finalImages.length} صور إلى المتجر!`);
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
                <button
                  type="button"
                  onClick={handleOpenDbManager}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-xs border flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSupabaseConfigured
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30"
                      : "bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30"
                  }`}
                  title="إعداد وفحص الاتصال بقاعدة بيانات Supabase"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>{isSupabaseConfigured ? "قاعدة البيانات متصلة (Supabase)" : "إعداد وتوصيل Supabase"}</span>
                </button>
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
            <span>كوبونات الخصم ({couponsList.length})</span>
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

          <button
            onClick={handleOpenDbManager}
            className="px-4 py-2.5 text-xs font-bold rounded-sm transition-colors flex items-center gap-2 cursor-pointer bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 mr-auto"
          >
            <Database className="w-4 h-4 text-amber-400" />
            <span>ربط وتزامن Supabase</span>
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
          <div className="space-y-6">
            
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-[#1E293B] border border-slate-700/80 p-4 rounded-sm flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-xs block">إجمالي الكوبونات</span>
                  <span className="text-xl sm:text-2xl font-black text-white mt-1 block">
                    {couponsList.length}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-sm bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Tag className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-[#1E293B] border border-slate-700/80 p-4 rounded-sm flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-xs block">كوبونات مفعلة</span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-400 mt-1 block">
                    {couponsList.filter((c) => c.isActive).length}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-sm bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-[#1E293B] border border-slate-700/80 p-4 rounded-sm flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-xs block">كوبونات متوقفة</span>
                  <span className="text-xl sm:text-2xl font-black text-slate-300 mt-1 block">
                    {couponsList.filter((c) => !c.isActive).length}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-sm bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center">
                  <Power className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-[#1E293B] border border-slate-700/80 p-4 rounded-sm flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-xs block">مرات استخدام العملاء</span>
                  <span className="text-xl sm:text-2xl font-black text-amber-400 mt-1 block">
                    {couponsList.reduce((acc, c) => acc + (c.timesUsed || 0), 0)}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-sm bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Coupons Table Card */}
            <div className="bg-[#1E293B] border border-slate-700/80 rounded-sm overflow-hidden shadow-xs">
              
              {/* Header with Title and Actions */}
              <div className="p-4 bg-slate-800/80 border-b border-slate-700 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Tag className="w-4 h-4 text-amber-400" />
                    <span>كوبونات الخصم والعروض الترويجية</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    إدارة نسب ومبالغ الخصم، حدود الطلب، والتفعيل الفوري للمتجر والداتا بيز
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Search Box */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="بحث بكود الكوبون..."
                      value={couponSearch}
                      onChange={(e) => setCouponSearch(e.target.value)}
                      className="bg-slate-900 border border-slate-600 rounded-sm py-2 px-3 pl-8 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 w-44 sm:w-56"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>

                  {/* Supabase Sync Button */}
                  {isSupabaseConfigured && (
                    <button
                      type="button"
                      onClick={handleSyncAllCoupons}
                      disabled={isSyncingCoupons}
                      className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 rounded-sm text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      title="مزامنة كل الكوبونات مع جدول coupons في Supabase"
                    >
                      {isSyncingCoupons ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      ) : (
                        <Database className="w-3.5 h-3.5 text-blue-400" />
                      )}
                      <span>مزامنة مع الداتا بيز</span>
                    </button>
                  )}

                  {/* Add New Coupon Button */}
                  <button
                    type="button"
                    onClick={handleOpenAddCouponModal}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-sm text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>إنشاء كوبون خصم جديد</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-800 text-slate-400 font-semibold border-b border-slate-700">
                    <tr>
                      <th className="p-4">كود الكوبون</th>
                      <th className="p-4">نوع الخصم</th>
                      <th className="p-4">قيمة الخصم</th>
                      <th className="p-4">الحد الأدنى لقيمة الطلب</th>
                      <th className="p-4 text-center">مرات الاستخدام / الحد الأقصى</th>
                      <th className="p-4 text-center">الحالة</th>
                      <th className="p-4 text-center">الإجراءات والتحكم</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {filteredCoupons.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400">
                          <Tag className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                          <p className="font-semibold text-white">لا توجد كوبونات تطابق بحثك</p>
                          <p className="text-xs text-slate-500 mt-1">
                            يمكنك إنشاء كوبون جديد بالنقر على زر &quot;إنشاء كوبون خصم جديد&quot; أعلاه.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredCoupons.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                          {/* Code */}
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-black text-amber-400 text-sm tracking-wider px-2 py-0.5 bg-slate-900 border border-amber-500/20 rounded-xs">
                                {c.code}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(c.code);
                                  showToast(`تم نسخ الكود ${c.code}`);
                                }}
                                className="text-slate-400 hover:text-white p-1 rounded-xs transition-colors cursor-pointer"
                                title="نسخ الكود"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                          {/* Discount Type */}
                          <td className="p-4 text-slate-300">
                            {c.discountType === "percentage" ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-xs font-semibold">
                                <Percent className="w-3 h-3" />
                                <span>نسبة مئوية (%)</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xs font-semibold">
                                <span>مبلغ نقدي ثابت (ج.م)</span>
                              </span>
                            )}
                          </td>

                          {/* Discount Value */}
                          <td className="p-4 font-black text-white text-sm">
                            {c.discountType === "percentage" ? (
                              <span>{c.discountValue}%</span>
                            ) : (
                              <span>{c.discountValue} ج.م</span>
                            )}
                          </td>

                          {/* Minimum Order */}
                          <td className="p-4 text-slate-300">
                            {c.minOrderAmount && c.minOrderAmount > 0 ? (
                              <span className="font-semibold text-white">
                                {c.minOrderAmount} ج.م فأكثر
                              </span>
                            ) : (
                              <span className="text-slate-500">بدون حد أدنى (أي طلب)</span>
                            )}
                          </td>

                          {/* Times used & Usage Limit */}
                          <td className="p-4 text-center">
                            {c.usageLimit && c.usageLimit > 0 ? (
                              <div className="space-y-1.5 min-w-32 max-w-44 mx-auto text-right">
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="font-bold text-white">
                                    {c.timesUsed || 0} / {c.usageLimit} أوردر
                                  </span>
                                  {(c.timesUsed || 0) >= c.usageLimit ? (
                                    <span className="text-[9px] font-black text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded-xs border border-rose-500/20">
                                      مكتمل 100%
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-slate-400">
                                      متبقي {c.usageLimit - (c.timesUsed || 0)}
                                    </span>
                                  )}
                                </div>
                                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-700">
                                  <div
                                    className={`h-full transition-all ${
                                      (c.timesUsed || 0) >= c.usageLimit ? "bg-rose-500" : "bg-amber-400"
                                    }`}
                                    style={{
                                      width: `${Math.min(100, Math.round(((c.timesUsed || 0) / c.usageLimit) * 100))}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-xs text-[11px]">
                                <span className="font-bold text-white">{c.timesUsed || 0} أوردر</span>
                                <span className="text-slate-500 text-[10px]">(غير محدود ∞)</span>
                              </div>
                            )}
                          </td>

                          {/* Status */}
                          <td className="p-4 text-center">
                            {c.usageLimit && c.usageLimit > 0 && (c.timesUsed || 0) >= c.usageLimit ? (
                              <span className="px-2.5 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold rounded-xs inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                                <span>استنفد الحد (منتهي)</span>
                              </span>
                            ) : c.isActive ? (
                              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold rounded-xs inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span>مفعل ونشط</span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-bold rounded-xs inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                                <span>معطل مؤقتاً</span>
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* Quick Toggle Status */}
                              <button
                                type="button"
                                onClick={() => handleToggleCouponStatus(c)}
                                className={`px-2.5 py-1 text-[11px] font-bold rounded-xs border transition-colors cursor-pointer flex items-center gap-1 ${
                                  c.isActive
                                    ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-600"
                                    : "bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border-emerald-500/40"
                                }`}
                                title={c.isActive ? "إيقاف الكوبون مؤقتاً" : "تفعيل الكوبون الآن"}
                              >
                                <Power className="w-3 h-3" />
                                <span>{c.isActive ? "تعطيل" : "تفعيل"}</span>
                              </button>

                              {/* Edit Button */}
                              <button
                                type="button"
                                onClick={() => handleOpenEditCouponModal(c)}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 rounded-xs border border-slate-700 transition-colors cursor-pointer"
                                title="تعديل بيانات الكوبون"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete Button */}
                              <button
                                type="button"
                                onClick={() => handleDeleteCoupon(c)}
                                className="p-1.5 bg-slate-800 hover:bg-rose-900/40 text-rose-400 hover:text-rose-300 rounded-xs border border-slate-700 hover:border-rose-500/40 transition-colors cursor-pointer"
                                title="حذف الكوبون نهائياً"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

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

              {/* Product Media Gallery (Amazon Style) */}
              <div className="p-4 bg-slate-900/90 border border-slate-700 rounded-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-amber-400" />
                      <h4 className="text-xs font-black text-white uppercase tracking-wider">
                        معرض صور المنتج (Amazon-Style Gallery)
                      </h4>
                      <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold rounded-xs">
                        {formData.images.length} صور مضافة
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      يمكنك استيراد صور من مجلد Google Drive، أو الرفع من جهازك مباشرة، أو إضافة روابط
                    </p>
                  </div>

                  {/* Mode switcher tabs */}
                  <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-sm border border-slate-700">
                    <button
                      type="button"
                      onClick={() => setImageTab("drive")}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-xs transition-colors cursor-pointer flex items-center gap-1 ${
                        imageTab === "drive"
                          ? "bg-amber-500 text-slate-950 font-black shadow-xs"
                          : "text-slate-300 hover:text-white"
                      }`}
                    >
                      <Database className="w-3 h-3" />
                      <span>Google Drive</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageTab("upload")}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-xs transition-colors cursor-pointer flex items-center gap-1 ${
                        imageTab === "upload"
                          ? "bg-amber-500 text-slate-950 font-black shadow-xs"
                          : "text-slate-300 hover:text-white"
                      }`}
                    >
                      <UploadCloud className="w-3 h-3" />
                      <span>رفع من جهازك</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageTab("url")}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-xs transition-colors cursor-pointer flex items-center gap-1 ${
                        imageTab === "url"
                          ? "bg-amber-500 text-slate-950 font-black shadow-xs"
                          : "text-slate-300 hover:text-white"
                      }`}
                    >
                      <LinkIcon className="w-3 h-3" />
                      <span>رابط مباشر</span>
                    </button>
                  </div>
                </div>

                {/* Tab 1: Google Drive Importer */}
                {imageTab === "drive" && (
                  <div className="space-y-2 bg-slate-950/60 p-3 rounded-sm border border-slate-800">
                    <label className="block text-[11px] font-bold text-slate-300">
                      رابط فولدر Google Drive أو روابط الصور:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://drive.google.com/drive/folders/... أو روابط ملفات"
                        value={driveUrlInput}
                        onChange={(e) => {
                          setDriveUrlInput(e.target.value);
                          setDriveError(null);
                        }}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-sm py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleExtractDriveImages}
                        disabled={isExtractingDrive || !driveUrlInput.trim()}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black rounded-sm text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                      >
                        {isExtractingDrive ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>جارٍ الاستخراج...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>استخراج الصور تلقائياً</span>
                          </>
                        )}
                      </button>
                    </div>

                    {driveError && (
                      <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xs text-[11px] text-rose-300 flex items-start gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <div>
                          <span>{driveError}</span>
                          <span className="block text-[10px] text-slate-400 mt-0.5">
                            تأكد أن الفولدر مفتوح للعامة: من جوجل درايف اضغط Share ➔ اختر General Access: "Anyone with the link can view".
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-1">
                      <Info className="w-3 h-3 text-amber-400" />
                      <span>
                        يقوم النظام بتحويل روابط جوجل درايف تلقائياً لصور عالية الدقة سريعة العرض في صفحة المنتج.
                      </span>
                    </div>
                  </div>
                )}

                {/* Tab 2: Direct Local Upload */}
                {imageTab === "upload" && (
                  <div className="p-4 bg-slate-950/60 rounded-sm border border-dashed border-slate-700 text-center space-y-2">
                    <input
                      type="file"
                      id="product-images-upload"
                      multiple
                      accept="image/*"
                      onChange={handleLocalFileUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="product-images-upload"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-600 rounded-sm text-xs font-bold transition-all cursor-pointer"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>اختر عدة صور من جهازك أو الموبايل دفعة واحدة</span>
                    </label>
                    <p className="text-[10px] text-slate-400">
                      يمكنك تحديد صورة من الأمام، من الجانب، وتفاصيل الخامة (PNG, JPG, WebP)
                    </p>
                  </div>
                )}

                {/* Tab 3: Direct URL & Category Presets */}
                {imageTab === "url" && (
                  <div className="space-y-3 bg-slate-950/60 p-3 rounded-sm border border-slate-800">
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/... أو أي رابط صورة مباشر"
                        value={manualImageUrl}
                        onChange={(e) => setManualImageUrl(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-sm py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleAddManualUrl}
                        disabled={!manualImageUrl.trim()}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 font-bold rounded-sm text-xs transition-colors cursor-pointer shrink-0"
                      >
                        + إضافة الرابط
                      </button>
                    </div>

                    {PRESET_IMAGES[formData.categorySlug] && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-slate-400">صور سريعة مقترحة للقسم:</span>
                        {PRESET_IMAGES[formData.categorySlug].map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleAddPreset(preset.url)}
                            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] rounded-xs border border-slate-600 transition-colors cursor-pointer"
                          >
                            + {preset.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* The Live Thumbnails Matrix */}
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold text-slate-300 block">
                    الصور الحالية للمنتج (انقر على ⭐ لجعلها صورة الغلاف الرئيسية):
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {formData.images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className={`group relative rounded-sm overflow-hidden border transition-all ${
                          idx === 0
                            ? "border-amber-500 ring-2 ring-amber-500/40"
                            : "border-slate-700 hover:border-slate-500"
                        }`}
                      >
                        <div className="aspect-square relative bg-slate-950">
                          <Image
                            src={imgUrl}
                            alt=""
                            fill
                            className="object-cover"
                            unoptimized={imgUrl.startsWith("data:")}
                          />
                        </div>

                        {/* Top Badges */}
                        <div className="absolute top-1.5 right-1.5 left-1.5 flex items-center justify-between">
                          <span
                            className={`px-1.5 py-0.5 text-[9px] font-extrabold rounded-xs ${
                              idx === 0
                                ? "bg-amber-500 text-slate-950 font-black shadow-xs"
                                : "bg-black/70 text-slate-200"
                            }`}
                          >
                            {idx === 0 ? "الغلاف الرئيسي" : `#${idx + 1}`}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="w-5 h-5 bg-rose-600/90 hover:bg-rose-500 text-white rounded-xs flex items-center justify-center opacity-80 group-hover:opacity-100 transition-all cursor-pointer"
                            title="حذف هذه الصورة"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Bottom action to make cover */}
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetCoverImage(idx)}
                            className="w-full py-1 bg-slate-900/90 hover:bg-amber-500 hover:text-slate-950 text-slate-300 text-[9px] font-bold text-center border-t border-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-1"
                          >
                            <Star className="w-2.5 h-2.5" />
                            <span>تعيين كغلاف</span>
                          </button>
                        )}
                      </div>
                    ))}
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

      {/* ========================================================================= */}
      {/* Database Connection & Sync Manager Modal                                  */}
      {/* ========================================================================= */}
      {isDbModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-[#1E293B] border border-slate-700 rounded-sm w-full max-w-2xl overflow-hidden shadow-2xl my-8">
            <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-sm bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/40">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    إدارة وربط قاعدة بيانات Supabase (PostgreSQL 16)
                  </h3>
                  <p className="text-xs text-slate-400">
                    التحكم في الاتصال السحابي، رفع الكتالوج، وإعداد الجداول
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDbModalOpen(false)}
                className="w-8 h-8 rounded-sm bg-slate-700 hover:bg-slate-600 text-slate-300 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {/* Live Connection Status Box */}
              <div className="p-4 bg-slate-900 border border-slate-700 rounded-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-300">حالة الاتصال الحالية:</span>
                    {isTestingDb ? (
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-[11px] font-bold rounded-xs flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>جاري فحص الاتصال...</span>
                      </span>
                    ) : dbStatus?.isConnected ? (
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold rounded-xs flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>متصل بنجاح (Live PostgreSQL)</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold rounded-xs">
                        وضع محلي تجريبي (يحتاج إدخال مفاتيح .env.local)
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleTestDbConnection}
                    disabled={isTestingDb}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xs border border-slate-600 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${isTestingDb ? "animate-spin" : ""}`} />
                    <span>إعادة فحص الاتصال</span>
                  </button>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {dbStatus?.message || "انقر على إعادة فحص الاتصال لاختبار الوصول لقاعدة البيانات."}
                </p>

                {dbStatus?.latencyMs && (
                  <span className="text-[10px] text-slate-500 block mt-1 font-mono">
                    سرعة الاستجابة (Latency): {dbStatus.latencyMs}ms
                  </span>
                )}
              </div>

              {/* Sync Catalog CTA */}
              <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 border border-amber-500/30 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>مزامنة ورفع جميع المنتجات إلى Supabase</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    يرفع جميع الـ {products.length} منتجات المعروضة وصورها إلى جداول قاعدة البيانات بضغطة زر واحدة.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSyncAllToSupabase}
                  disabled={isSyncingAll}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black rounded-sm text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-md"
                >
                  {isSyncingAll ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>جاري المزامنة...</span>
                    </>
                  ) : (
                    <>
                      <Database className="w-3.5 h-3.5" />
                      <span>مزامنة الكتالوج الآن</span>
                    </>
                  )}
                </button>
              </div>

              {/* Step-by-Step Setup Guide */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  خطوات ربط قاعدة بيانات Supabase المجانية (في 3 دقائق):
                </h4>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="p-3 bg-slate-900 border border-slate-700/80 rounded-sm">
                    <div className="flex items-center gap-2 font-bold text-white mb-1">
                      <span className="w-5 h-5 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center text-[10px] font-black">1</span>
                      <span>إنشاء مشروع جديد مجاني:</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      ادخل على <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-amber-400 underline">supabase.com</a> وسجل دخول، ثم اضغط <b>New Project</b> وسمّه <b>drsh-store</b>.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900 border border-slate-700/80 rounded-sm">
                    <div className="flex items-center gap-2 font-bold text-white mb-1">
                      <span className="w-5 h-5 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center text-[10px] font-black">2</span>
                      <span>تشغيل سكريبت إنشاء الجداول (schema.sql):</span>
                    </div>
                    <p className="text-slate-400 text-[11px] mb-2">
                      من القائمة الجانبية في Supabase اختر <b>SQL Editor</b>، والصق محتويات ملف <code>supabase/schema.sql</code> واضغط <b>Run</b>.
                    </p>
                    <span className="text-[10px] text-emerald-400 font-mono block">
                      مسار الملف في المشروع: supabase/schema.sql
                    </span>
                  </div>

                  <div className="p-3 bg-slate-900 border border-slate-700/80 rounded-sm">
                    <div className="flex items-center gap-2 font-bold text-white mb-1">
                      <span className="w-5 h-5 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center text-[10px] font-black">3</span>
                      <span>وضع مفاتيح الاتصال في ملف .env.local:</span>
                    </div>
                    <p className="text-slate-400 text-[11px] mb-2">
                      من لوحة تحكم Supabase اذهب إلى <b>Project Settings ➔ API</b>، وانسخ الـ <b>Project URL</b> والـ <b>anon key</b> وضعهما في ملف <code>.env.local</code>:
                    </p>
                    <pre className="p-3 bg-slate-950 text-amber-300 font-mono text-[10px] rounded-xs overflow-x-auto dir-ltr text-left">
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="pt-2 border-t border-slate-700 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsDbModalOpen(false)}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-sm text-xs transition-colors cursor-pointer"
                >
                  إغلاق النافذة
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Add / Edit Coupon Modal                                                   */}
      {/* ========================================================================= */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-[#1E293B] border border-slate-700 rounded-sm w-full max-w-lg overflow-hidden shadow-2xl my-8">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-sm bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
                  <Tag className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    {editingCouponId ? "تعديل بيانات كوبون الخصم" : "إنشاء كوبون خصم جديد"}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {editingCouponId ? "تحديث نسبة أو قيمة وشروط الكوبون" : "إضافة كود خصم ترويجي للمتجر"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCouponModalOpen(false)}
                className="w-7 h-7 rounded-sm bg-slate-700 hover:bg-slate-600 text-slate-300 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveCoupon} className="p-5 space-y-4">
              
              {/* Coupon Code */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-200">
                    كود الخصم (Promo Code) <span className="text-amber-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateRandomCode}
                    className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>توليد كود تلقائي</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="مثال: DRSH20 أو SUMMER15"
                  value={couponFormData.code}
                  onChange={(e) =>
                    setCouponFormData({
                      ...couponFormData,
                      code: e.target.value.toUpperCase().replace(/\s+/g, ""),
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-600 rounded-sm py-2 px-3 text-sm text-amber-400 font-mono font-bold tracking-wider placeholder-slate-500 focus:outline-none focus:border-amber-400 uppercase"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  هذا الكود هو ما يكتبه المشتري في خانة كود الخصم بصفحة الدفع.
                </span>
              </div>

              {/* Discount Type Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  نوع الخصم <span className="text-amber-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCouponFormData({ ...couponFormData, discountType: "percentage" })}
                    className={`p-3 rounded-sm border text-right transition-colors cursor-pointer ${
                      couponFormData.discountType === "percentage"
                        ? "bg-amber-500/10 border-amber-500/60 text-white"
                        : "bg-slate-900 border-slate-700 text-slate-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs mb-1">
                      <Percent className="w-4 h-4 text-amber-400" />
                      <span>نسبة مئوية (%)</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      خصم نسبة من إجمالي المشتريات (مثال: 10% أو 20%)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCouponFormData({ ...couponFormData, discountType: "fixed_amount" })}
                    className={`p-3 rounded-sm border text-right transition-colors cursor-pointer ${
                      couponFormData.discountType === "fixed_amount"
                        ? "bg-amber-500/10 border-amber-500/60 text-white"
                        : "bg-slate-900 border-slate-700 text-slate-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs mb-1">
                      <Tag className="w-4 h-4 text-amber-400" />
                      <span>مبلغ نقدي ثابت (ج.م)</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      خصم مبلغ محدد بالجنيه (مثال: 50 ج.م أو 100 ج.م)
                    </span>
                  </button>
                </div>
              </div>

              {/* Discount Value & Min Order Amount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    قيمة الخصم ({couponFormData.discountType === "percentage" ? "%" : "ج.م"}) <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min={1}
                      max={couponFormData.discountType === "percentage" ? 99 : 10000}
                      value={couponFormData.discountValue}
                      onChange={(e) =>
                        setCouponFormData({
                          ...couponFormData,
                          discountValue: Number(e.target.value),
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-600 rounded-sm py-2 px-3 pl-8 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
                    />
                    <span className="absolute left-3 top-2 text-xs font-bold text-amber-400">
                      {couponFormData.discountType === "percentage" ? "%" : "ج.م"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    الحد الأدنى للطلب (ج.م)
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="0 = بدون حد أدنى"
                    value={couponFormData.minOrderAmount}
                    onChange={(e) =>
                      setCouponFormData({
                        ...couponFormData,
                        minOrderAmount: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-600 rounded-sm py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {couponFormData.minOrderAmount > 0
                      ? `يعمل فقط إذا كان السعر ${couponFormData.minOrderAmount} ج.م فأكثر.`
                      : "يعمل مع أي أوردر بدون حد أدنى."}
                  </span>
                </div>
              </div>

              {/* Usage Limit Control */}
              <div className="p-3 bg-slate-900 border border-slate-700 rounded-sm space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-200">
                      الحد الأقصى لعدد الطلبات (Usage Limit)
                    </label>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      يتوقف الكوبون تلقائياً فور وصول عدد الأوردرات المنفذة لهذا الحد.
                    </span>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[50, 100, 200, 500].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setCouponFormData({ ...couponFormData, usageLimit: num })}
                        className={`px-2 py-0.5 rounded-xs text-[10px] font-bold border transition-colors cursor-pointer ${
                          couponFormData.usageLimit === num
                            ? "bg-amber-500 text-slate-950 border-amber-400 font-black"
                            : "bg-slate-800 text-slate-300 border-slate-700 hover:text-white"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setCouponFormData({ ...couponFormData, usageLimit: "" })}
                      className={`px-2 py-0.5 rounded-xs text-[10px] font-bold border transition-colors cursor-pointer ${
                        couponFormData.usageLimit === "" || couponFormData.usageLimit === undefined || couponFormData.usageLimit === 0
                          ? "bg-blue-600 text-white border-blue-500"
                          : "bg-slate-800 text-slate-300 border-slate-700 hover:text-white"
                      }`}
                    >
                      غير محدود ∞
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min={1}
                      placeholder="مثال: 100 (أو اتركه فارغاً للاستخدام غير المحدود)"
                      value={couponFormData.usageLimit !== undefined ? couponFormData.usageLimit : ""}
                      onChange={(e) =>
                        setCouponFormData({
                          ...couponFormData,
                          usageLimit: e.target.value === "" ? "" : Number(e.target.value),
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-600 rounded-sm py-2 px-3 pl-16 text-xs text-white font-mono font-bold focus:outline-none focus:border-amber-400"
                    />
                    <span className="absolute left-3 top-2 text-[11px] font-bold text-slate-400">
                      أوردر
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-300 shrink-0 font-medium">
                    {couponFormData.usageLimit !== "" && Number(couponFormData.usageLimit) > 0 ? (
                      <span className="text-amber-400 font-bold">
                        صالح لأول {couponFormData.usageLimit} أوردر فقط
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-bold">
                        مفتوح لعدد غير محدود
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {/* Active Toggle */}
              <div className="p-3 bg-slate-900 border border-slate-700 rounded-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">
                    تفعيل الكوبون فوراً في المتجر
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    عند التفعيل، سيتمكن العملاء من تطبيق الكود فوراً في الـ Checkout.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={couponFormData.isActive}
                    onChange={(e) =>
                      setCouponFormData({ ...couponFormData, isActive: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {/* Live Preview Box */}
              <div className="p-3 bg-slate-950 border border-amber-500/20 rounded-sm">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>معاينة ما سيظهر للعميل:</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  كود الخصم <span className="font-mono font-bold text-amber-400">{couponFormData.code || "---"}</span> سيخصم{" "}
                  <b className="text-white">
                    {couponFormData.discountType === "percentage"
                      ? `${couponFormData.discountValue}% من الإجمالي`
                      : `${couponFormData.discountValue} ج.م`}
                  </b>
                  {couponFormData.minOrderAmount > 0
                    ? ` على الطلبات التي تبدأ من ${couponFormData.minOrderAmount} ج.م`
                    : " على أي طلب بدون حد أدنى"}
                  {couponFormData.usageLimit !== "" && Number(couponFormData.usageLimit) > 0
                    ? ` (متاح لأول ${couponFormData.usageLimit} أوردر فقط).`
                    : " (بدون حد أقصى للاستخدام)."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-700 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-sm text-xs transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSavingCoupon}
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-sm text-xs transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSavingCoupon ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>جارٍ الحفظ...</span>
                    </>
                  ) : (
                    <span>{editingCouponId ? "حفظ التعديلات" : "حفظ وتفعيل الكوبون"}</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
