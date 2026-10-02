import { supabase, isSupabaseConfigured } from "./supabase";

export type DiscountType = "percentage" | "fixed_amount";

export interface Coupon {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number;
  usageLimit?: number;
  timesUsed: number;
  expiresAt?: string;
  isActive: boolean;
}

const STORAGE_KEY = "drsh_coupons_catalog_v1";

export const DEFAULT_COUPONS: Coupon[] = [
  {
    id: "coup-1",
    code: "WELCOME10",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 0,
    timesUsed: 48,
    isActive: true,
  },
  {
    id: "coup-2",
    code: "DRSH10",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 0,
    timesUsed: 112,
    isActive: true,
  },
  {
    id: "coup-3",
    code: "SAVE100",
    discountType: "fixed_amount",
    discountValue: 100,
    minOrderAmount: 800,
    timesUsed: 25,
    isActive: true,
  },
  {
    id: "coup-4",
    code: "DRSH15",
    discountType: "percentage",
    discountValue: 15,
    minOrderAmount: 1200,
    timesUsed: 14,
    isActive: true,
  },
];

/**
 * Loads stored coupons from localStorage or defaults.
 */
export function getStoredCoupons(): Coupon[] {
  if (typeof window === "undefined") return DEFAULT_COUPONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_COUPONS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch (err) {
    console.error("Error reading coupons from localStorage", err);
  }
  return DEFAULT_COUPONS;
}

/**
 * Saves coupons to localStorage and notifies listeners.
 */
export function saveStoredCoupons(coupons: Coupon[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(coupons));
    window.dispatchEvent(new Event("drsh-coupons-updated"));
  } catch (err) {
    console.error("Error saving coupons to localStorage", err);
  }
}

/**
 * Validates a coupon code against a cart subtotal and calculates discount.
 */
export function validateCoupon(
  code: string,
  subtotal: number,
  couponsList?: Coupon[]
): { valid: boolean; discountAmount: number; coupon?: Coupon; message: string } {
  const cleanCode = code.trim().toUpperCase();
  const list = couponsList || getStoredCoupons();

  const found = list.find((c) => c.code.toUpperCase() === cleanCode);

  if (!found) {
    return {
      valid: false,
      discountAmount: 0,
      message: "كود الخصم غير موجود أو تم إيقافه.",
    };
  }

  if (!found.isActive) {
    return {
      valid: false,
      discountAmount: 0,
      message: "عذراً، هذا الكوبون غير نشط حالياً.",
    };
  }

  if (found.expiresAt && new Date(found.expiresAt) < new Date()) {
    return {
      valid: false,
      discountAmount: 0,
      message: "عذراً، انتهت صلاحية هذا الكوبون.",
    };
  }

  if (found.minOrderAmount && subtotal < found.minOrderAmount) {
    return {
      valid: false,
      discountAmount: 0,
      message: `الحد الأدنى لقيمة المشتريات لتفعيل هذا الكوبون هو ${found.minOrderAmount} ج.م (المجموع الحالي: ${subtotal} ج.م).`,
    };
  }

  let discount = 0;
  if (found.discountType === "percentage") {
    discount = Math.round((subtotal * found.discountValue) / 100);
  } else {
    discount = Math.min(subtotal, found.discountValue);
  }

  return {
    valid: true,
    discountAmount: discount,
    coupon: found,
    message:
      found.discountType === "percentage"
        ? `تم تطبيق خصم ${found.discountValue}% بقيمة ${discount} ج.م!`
        : `تم تطبيق خصم بقيمة ${discount} ج.م!`,
  };
}

/**
 * Syncs a single coupon to Supabase.
 */
export async function syncCouponToSupabase(coupon: Coupon): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;

  try {
    const { error } = await supabase.from("coupons").upsert(
      {
        code: coupon.code.toUpperCase(),
        discount_type: coupon.discountType,
        discount_value: coupon.discountValue,
        min_order_amount: coupon.minOrderAmount,
        times_used: coupon.timesUsed,
        expires_at: coupon.expiresAt || null,
        is_active: coupon.isActive,
      },
      { onConflict: "code" }
    );
    return !error;
  } catch (err) {
    console.error("Error syncing coupon to Supabase:", err);
    return false;
  }
}

/**
 * Deletes a coupon from Supabase.
 */
export async function deleteCouponFromSupabase(code: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;

  try {
    const { error } = await supabase.from("coupons").delete().eq("code", code.toUpperCase());
    return !error;
  } catch (err) {
    console.error("Error deleting coupon from Supabase:", err);
    return false;
  }
}

/**
 * Fetches all coupons from Supabase.
 */
export async function fetchCouponsFromSupabase(): Promise<Coupon[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return null;

    return data.map((row: any) => ({
      id: row.id,
      code: row.code,
      discountType: row.discount_type as DiscountType,
      discountValue: Number(row.discount_value),
      minOrderAmount: Number(row.min_order_amount || 0),
      usageLimit: row.usage_limit || undefined,
      timesUsed: Number(row.times_used || 0),
      expiresAt: row.expires_at || undefined,
      isActive: Boolean(row.is_active),
    }));
  } catch (err) {
    console.error("Error fetching coupons from Supabase:", err);
    return null;
  }
}
