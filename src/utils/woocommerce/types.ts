
/**
 * WooCommerce and B2BKing API Types
 */

// General WooCommerce Types
export interface WooProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  sale_price?: string;
  sku?: string;
  stock_quantity?: number;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  description: string;
  short_description?: string;
  categories?: { id: number; name: string; slug: string }[];
  images?: { id: number; src: string; name?: string; alt?: string }[];
  date_created?: string;
  total_sales?: number;
}

export interface WooProductVariation {
  id: number;
  name?: string;
  sku?: string;
  price: string;
  regular_price: string;
  sale_price?: string;
  description?: string;
  attributes: Array<{
    id: number;
    name: string;
    option: string;
  }>;
  stock_quantity?: number;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  image?: { id: number; src: string };
}

export interface WooOrder {
  id: number;
  status: string;
  date_created: string;
  total: string;
  customer_id: number;
  billing?: {
    first_name?: string;
    last_name?: string;
    company?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
    email?: string;
    phone?: string;
  };
  line_items: Array<{
    id: number;
    name: string;
    product_id: number;
    quantity: number;
    price: number;
    total?: string;
  }>;
}

export interface WooCustomer {
  id: number;
  date_created?: string;
  email: string;
  first_name: string;
  last_name: string;
  username?: string;
  orders_count?: number;
  total_spent?: string;
  billing?: {
    first_name?: string;
    last_name?: string;
    company?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
    email?: string;
    phone?: string;
  };
  shipping?: {
    first_name?: string;
    last_name?: string;
    company?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
    phone?: string;
  };
  meta_data?: Array<{
    key: string;
    value: any;
  }>;
}

// B2BKing Specific Types
export interface B2BKingGroup {
  id: number;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | string;
  user_count: number;
  rules_count: number;
  custom_data?: Record<string, any>;
}

export interface B2BKingUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  position?: string;
  approved: boolean;
  group_id?: number;
  registration_date: string;
  custom_fields?: Record<string, any>;
}

export interface B2BKingRule {
  id: number;
  name: string;
  description?: string;
  type: 'discount' | 'tax_exemption' | 'minimum_order' | 'product_visibility' | string;
  who: number[] | string;  // Could be group IDs or "all_registered", "everyone", etc.
  discount_value?: number;
  minimum_order?: number;
  requires_approval: boolean;
  requires_login: boolean;
  conditions?: Record<string, any>;
}
