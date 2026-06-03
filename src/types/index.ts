export interface Beekeeper {
  id: string;
  name: string;
  region: string;
  story: string;
  photo_url: string | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  origin_region: string;
  beekeeper_id: string | null;
  beekeeper?: Beekeeper;
  price_pkr: number;
  price_usd: number;
  stock_qty: number;
  images: string[];
  is_active: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PaymentMethod = 'stripe' | 'jazzcash' | 'easypaisa' | 'cod';
export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type FulfillmentStatus = 'pending' | 'packed' | 'shipped' | 'delivered' | 'cancelled';

export interface Address {
  full_name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  province: string;
  postal_code?: string;
}

export interface Order {
  id: string;
  customer_id: string | null;
  items: CartItem[];
  total_pkr: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  fulfillment_status: FulfillmentStatus;
  address: Address;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  customer_id: string | null;
  rating: number;
  body: string;
  created_at: string;
}
