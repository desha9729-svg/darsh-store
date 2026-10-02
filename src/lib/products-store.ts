import { Product } from "@/types/ecommerce";
import { PRODUCTS as DEFAULT_PRODUCTS } from "@/data/mock-products";

const STORAGE_KEY = "drsh_custom_products_v1";

/**
 * Safely retrieves products from localStorage on client, or returns defaults on server.
 */
export function getStoredProducts(): Product[] {
  if (typeof window === "undefined") {
    return DEFAULT_PRODUCTS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PRODUCTS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error("Error reading products from localStorage", err);
  }
  return DEFAULT_PRODUCTS;
}

/**
 * Saves products to localStorage and notifies all components across the app.
 */
export function saveStoredProducts(products: Product[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    window.dispatchEvent(new Event("drsh-products-updated"));
  } catch (err) {
    console.error("Error saving products to localStorage", err);
  }
}

/**
 * Resets back to the original default catalog.
 */
export function resetStoredProducts(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("drsh-products-updated"));
  } catch (err) {
    console.error("Error resetting products in localStorage", err);
  }
}

/**
 * Generates an SQL INSERT statement for Supabase from a Product object.
 */
export function generateSupabaseSQL(product: Product): string {
  const primaryVariant = product.variants[0];
  const stock = primaryVariant ? primaryVariant.stockQuantity : 10;
  const comparePrice = product.compareAtPrice ? `${product.compareAtPrice}` : "NULL";
  const desc = product.description.replace(/'/g, "''");
  const name = product.name.replace(/'/g, "''");
  const material = (product.material || "Stainless Steel / Genuine Leather").replace(/'/g, "''");

  return `
-- إضافة منتج جديد: ${product.name}
INSERT INTO products (
  name, slug, description, price, compare_price, 
  category_id, brand, material, gender, sku, 
  stock_quantity, status, featured
) VALUES (
  '${name}',
  '${product.slug}',
  '${desc}',
  ${product.basePrice},
  ${comparePrice},
  (SELECT id FROM categories WHERE slug = '${product.categorySlug}' LIMIT 1),
  'DRSH',
  '${material}',
  '${product.gender}',
  '${product.sku}',
  ${stock},
  'active',
  ${product.isFeatured ? "true" : "false"}
)
ON CONFLICT (slug) DO UPDATE SET
  price = EXCLUDED.price,
  compare_price = EXCLUDED.compare_price,
  stock_quantity = EXCLUDED.stock_quantity;
`.trim();
}
