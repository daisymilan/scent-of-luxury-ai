
// Mock data types that are compatible with our WooCommerce API types

import { WooOrder as ApiWooOrder, WooCustomer as ApiWooCustomer, WooProduct as ApiWooProduct } from '@/utils/woocommerce/types';

// Make the mock types extend and be compatible with the API types
export interface WooOrder extends Omit<ApiWooOrder, 'billing' | 'line_items'> {
  billing: {
    first_name: string;
    last_name: string;
    company?: string;
    email: string;
    city?: string;
    country?: string;
    // Add other fields to ensure compatibility
    address_1?: string;
    address_2?: string;
    state?: string;
    postcode?: string;
    phone?: string;
  };
  line_items: Array<{
    name: string;
    price?: number | string;
    quantity?: number;
    total?: number | string;
    id?: number;
    product_id?: number;
  }>;
}

export interface WooCustomer extends Omit<ApiWooCustomer, 'billing'> {
  billing?: {
    company?: string;
    email?: string;
    city?: string;
    country?: string;
    // Add other fields to ensure compatibility
    first_name?: string;
    last_name?: string;
    address_1?: string;
    address_2?: string;
    state?: string;
    postcode?: string;
    phone?: string;
  };
}

export interface WooProduct extends Omit<ApiWooProduct, 'sale_price'> {
  sale_price: string;
}

// Empty SEO performance data structure
export const seoPerformance = {
  keywords: [
    { keyword: "", position: 0, volume: 0, change: 0 }
  ],
  pages: [
    { url: "", traffic: 0, conversion: 0 }
  ]
};

// Empty B2B leads array
export const b2bLeads: any[] = [];

// Empty abandoned carts array
export const abandonedCarts: any[] = [];
