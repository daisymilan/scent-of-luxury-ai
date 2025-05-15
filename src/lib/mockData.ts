
// Empty mock data types for compatibility
// This file exists to provide type definitions only

export interface WooOrder {
  id: number;
  customer_id: number;
  date_created: string;
  status: string;
  total: string;
  billing: {
    first_name: string;
    last_name: string;
    company?: string;
    email: string;
    city?: string;
    country?: string;
  };
  line_items: Array<{
    name: string;
    price?: number | string;
    quantity?: number;
    total?: number | string;
  }>;
}

export interface WooCustomer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  orders_count?: number;
  total_spent?: string;
  billing?: {
    company?: string;
    email?: string;
    city?: string;
    country?: string;
  };
  meta_data?: Array<{
    key: string;
    value: string;
  }>;
}

export interface WooProduct {
  id: number;
  name: string;
  price: string;
  regular_price: string;
  sale_price: string;
  sku?: string;
  images: Array<{
    src: string;
  }>;
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
