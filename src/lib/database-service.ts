import { supabase, isSupabaseConfigured } from "./supabase";
import { Product } from "@/types/ecommerce";

export interface DatabaseConnectionStatus {
  isConfigured: boolean;
  isConnected: boolean;
  message: string;
  latencyMs?: number;
  tablesFound?: string[];
}

/**
 * Pings Supabase to verify credentials and connectivity.
 */
export async function testDatabaseConnection(): Promise<DatabaseConnectionStatus> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      isConfigured: false,
      isConnected: false,
      message: "مفاتيح Supabase غير محددة في متغيرات البيئة (.env.local)",
    };
  }

  const startTime = Date.now();
  try {
    const { data, error } = await supabase
      .from("products")
      .select("id")
      .limit(1);

    const latencyMs = Date.now() - startTime;

    if (error) {
      // If table doesn't exist yet, credentials are valid but schema is missing
      if (error.code === "42P01" || error.message.includes("relation") || error.message.includes("does not exist")) {
        return {
          isConfigured: true,
          isConnected: true,
          latencyMs,
          message: "الاتصال بـ Supabase ناجح، ولكن الجداول لم تُنشأ بعد. قم بتشغيل schema.sql في الـ SQL Editor.",
        };
      }

      return {
        isConfigured: true,
        isConnected: false,
        latencyMs,
        message: `خطأ في الاتصال: ${error.message}`,
      };
    }

    return {
      isConfigured: true,
      isConnected: true,
      latencyMs,
      message: "متصل بنجاح بقاعدة بيانات Supabase (PostgreSQL 16) والبيانات نشطة!",
    };
  } catch (err: any) {
    return {
      isConfigured: true,
      isConnected: false,
      message: `تعذر الاتصال بـ Supabase: ${err?.message || "خطأ غير معروف"}`,
    };
  }
}

/**
 * Fetches all active products from Supabase with their variants and gallery images.
 */
export async function fetchProductsFromDatabase(): Promise<Product[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data: dbProducts, error } = await supabase
      .from("products")
      .select(`
        id,
        name,
        slug,
        description,
        base_price,
        compare_price,
        gender,
        material,
        is_featured,
        is_new_arrival,
        is_best_seller,
        categories (
          id,
          name,
          slug
        ),
        product_variants (
          id,
          sku,
          title,
          price,
          compare_price,
          stock_quantity,
          attributes
        ),
        product_images (
          image_url,
          sort_order
        )
      `)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error || !dbProducts) {
      console.warn("Could not fetch products from Supabase, falling back to local:", error);
      return null;
    }

    // Map Supabase rows to client Product interface
    const mapped: Product[] = dbProducts.map((p: any) => {
      const categoryData = Array.isArray(p.categories) ? p.categories[0] : p.categories;
      const sortedImages = (p.product_images || [])
        .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
        .map((img: any) => img.image_url);

      const variants = (p.product_variants || []).map((v: any) => ({
        id: v.id,
        sku: v.sku,
        title: v.title,
        price: Number(v.price),
        compareAtPrice: v.compare_price ? Number(v.compare_price) : undefined,
        stockQuantity: Number(v.stock_quantity || 0),
        attributes: v.attributes || {},
      }));

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description || "",
        basePrice: Number(p.base_price),
        compareAtPrice: p.compare_price ? Number(p.compare_price) : undefined,
        category: categoryData?.name || "General",
        categorySlug: categoryData?.slug || "general",
        gender: p.gender || "unisex",
        material: p.material || undefined,
        isFeatured: Boolean(p.is_featured),
        isNewArrival: Boolean(p.is_new_arrival),
        isBestSeller: Boolean(p.is_best_seller),
        images: sortedImages.length > 0 ? sortedImages : ["https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=800"],
        sku: p.sku || variants[0]?.sku || `DRSH-${p.id.slice(0, 5)}`,
        variants: variants.length > 0 ? variants : [
          {
            id: `var-${p.id}`,
            sku: p.sku || `DRSH-${p.id.slice(0, 5)}`,
            title: "الافتراضي",
            price: Number(p.base_price),
            compareAtPrice: p.compare_price ? Number(p.compare_price) : undefined,
            stockQuantity: 10,
            attributes: {},
          },
        ],
      };
    });

    return mapped.length > 0 ? mapped : null;
  } catch (err) {
    console.error("Error in fetchProductsFromDatabase:", err);
    return null;
  }
}

/**
 * Saves or updates a product, its primary variant, and gallery images in Supabase.
 */
export async function saveProductToDatabase(product: Product): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;

  try {
    // 1. Get or create category
    let categoryId: string | null = null;
    const { data: catData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", product.categorySlug)
      .limit(1)
      .maybeSingle();

    if (catData) {
      categoryId = catData.id;
    } else {
      const { data: newCat } = await supabase
        .from("categories")
        .insert({
          name: product.category,
          name_ar: product.category,
          slug: product.categorySlug,
          is_active: true,
        })
        .select("id")
        .single();
      categoryId = newCat?.id || null;
    }

    if (!categoryId) return false;

    // 2. Upsert product
    const { data: savedProd, error: prodErr } = await supabase
      .from("products")
      .upsert(
        {
          name: product.name,
          slug: product.slug,
          description: product.description,
          category_id: categoryId,
          brand: "DRSH",
          material: product.material,
          gender: product.gender,
          base_price: product.basePrice,
          compare_price: product.compareAtPrice || null,
          is_featured: Boolean(product.isFeatured),
          is_new_arrival: Boolean(product.isNewArrival),
          is_best_seller: Boolean(product.isBestSeller),
          is_active: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "slug" }
      )
      .select("id")
      .single();

    if (prodErr || !savedProd) {
      console.error("Error upserting product to Supabase:", prodErr);
      return false;
    }

    const prodId = savedProd.id;

    // 3. Upsert variant
    const primaryVariant = product.variants[0];
    if (primaryVariant) {
      await supabase
        .from("product_variants")
        .upsert(
          {
            product_id: prodId,
            sku: primaryVariant.sku,
            title: primaryVariant.title,
            price: primaryVariant.price,
            compare_price: primaryVariant.compareAtPrice || null,
            stock_quantity: primaryVariant.stockQuantity,
            attributes: primaryVariant.attributes || {},
            is_active: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "sku" }
        );
    }

    // 4. Update gallery images
    await supabase.from("product_images").delete().eq("product_id", prodId);

    if (product.images && product.images.length > 0) {
      const imageRows = product.images.map((imgUrl, index) => ({
        product_id: prodId,
        image_url: imgUrl,
        alt_text: `${product.name} - صورة ${index + 1}`,
        sort_order: index + 1,
      }));

      await supabase.from("product_images").insert(imageRows);
    }

    return true;
  } catch (err) {
    console.error("Error saving product to Supabase:", err);
    return false;
  }
}

/**
 * Syncs the entire local catalog into Supabase in one operation.
 */
export async function syncAllProductsToDatabase(products: Product[]): Promise<{ success: boolean; count: number; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, count: 0, error: "قاعدة بيانات Supabase غير متصلة" };
  }

  let successCount = 0;
  for (const product of products) {
    const ok = await saveProductToDatabase(product);
    if (ok) successCount++;
  }

  return {
    success: successCount > 0,
    count: successCount,
  };
}

/**
 * Deletes a product from Supabase.
 */
export async function deleteProductFromDatabase(slug: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;

  try {
    const { error } = await supabase.from("products").delete().eq("slug", slug);
    return !error;
  } catch (err) {
    console.error("Error deleting product from Supabase:", err);
    return false;
  }
}

/**
 * Creates a COD order in Supabase with address and items.
 */
export async function createOrderInDatabase(orderRecord: {
  orderNumber: string;
  address: any;
  items: any[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  status: string;
  bostaTrackingNumber: string;
}): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;

  try {
    // 1. Insert address
    const { data: addressRow, error: addrErr } = await supabase
      .from("addresses")
      .insert({
        full_name: orderRecord.address.fullName,
        phone_number: orderRecord.address.phone,
        secondary_phone: orderRecord.address.secondaryPhone || null,
        governorate: orderRecord.address.governorate,
        city: orderRecord.address.city,
        street_address: orderRecord.address.streetAddress,
        building_no: orderRecord.address.buildingNo || null,
        floor_no: orderRecord.address.floorNo || null,
        apartment_no: orderRecord.address.apartmentNo || null,
        landmark: orderRecord.address.landmark || null,
      })
      .select("id")
      .single();

    if (addrErr || !addressRow) {
      console.error("Error saving address to Supabase:", addrErr);
      return false;
    }

    // 2. Insert order
    const { data: orderRow, error: ordErr } = await supabase
      .from("orders")
      .insert({
        order_number: orderRecord.orderNumber,
        customer_name: orderRecord.address.fullName,
        customer_phone: orderRecord.address.phone,
        customer_email: orderRecord.address.email || null,
        shipping_address_id: addressRow.id,
        subtotal: orderRecord.subtotal,
        shipping_fee: orderRecord.shippingFee,
        discount_amount: orderRecord.discount,
        total_amount: orderRecord.totalAmount,
        payment_method: "cod",
        payment_status: "unpaid",
        status: "pending_confirmation",
        customer_notes: orderRecord.address.notes || null,
      })
      .select("id")
      .single();

    if (ordErr || !orderRow) {
      console.error("Error saving order to Supabase:", ordErr);
      return false;
    }

    // 3. Link Bosta shipment tracking
    await supabase.from("shipping_shipments").insert({
      order_id: orderRow.id,
      carrier: "bosta",
      tracking_number: orderRecord.bostaTrackingNumber,
      status: "created",
    });

    return true;
  } catch (err) {
    console.error("Error creating order in Supabase:", err);
    return false;
  }
}
