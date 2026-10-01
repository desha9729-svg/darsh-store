export type Gender = 'men' | 'women' | 'unisex';

export interface ProductVariant {
  id: string;
  sku: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  attributes: {
    color?: string;
    size?: string;
    material?: string;
    [key: string]: string | undefined;
  };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  compareAtPrice?: number;
  category: string;
  categorySlug: string;
  gender: Gender;
  material?: string;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  images: string[];
  variants: ProductVariant[];
  sku: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  itemCount?: number;
}

export interface CartItem {
  id: string; // unique item cart id
  productId: string;
  variantId: string;
  productName: string;
  variantTitle: string;
  price: number;
  quantity: number;
  image: string;
  sku: string;
}

export interface EgyptianAddress {
  fullName: string;
  phone: string;
  secondaryPhone?: string;
  email?: string;
  governorate: string;
  city: string;
  streetAddress: string;
  buildingNo?: string;
  floorNo?: string;
  apartmentNo?: string;
  landmark?: string;
  notes?: string;
}

export type OrderStatus =
  | 'pending_confirmation'
  | 'confirmed'
  | 'preparing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export interface Order {
  id: string;
  orderNumber: string; // e.g. DRSH-10023
  items: CartItem[];
  customer: {
    fullName: string;
    phone: string;
    email?: string;
  };
  shippingAddress: EgyptianAddress;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: 'cod';
  status: OrderStatus;
  createdAt: string;
  bostaTrackingNumber?: string;
  bostaTrackingUrl?: string;
}
