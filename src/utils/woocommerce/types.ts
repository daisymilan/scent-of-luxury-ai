/**
 * WooCommerce API Types
 */

export interface WooProduct {
  id: number;
  name: string;
  slug?: string;
  permalink?: string;
  sku?: string;  // Added sku property
  price: string;
  regular_price: string;
  sale_price: string;
  description?: string;
  short_description?: string;
  stock_quantity: number | null;
  stock_status: string;
  total_sales: number;
  date_created: string;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  images: Array<{
    id: number;
    src: string;
    alt: string;
  }>;
  attributes: Array<{
    id: number;
    name: string;
    options: string[];
  }>;
  meta_data?: Array<{
    id: number;
    key: string;
    value: any;
  }>;
}

export interface WooProductVariation {
  id: number;
  description: string;
  permalink: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  date_created: string;
  on_sale: boolean;
  purchasable: boolean;
  virtual: boolean;
  stock_quantity: number | null;
  stock_status: string;
  attributes: Array<{
    id: number;
    name: string;
    option: string;
  }>;
  image: {
    id: number;
    src: string;
    alt: string;
  };
}

export interface WooOrder {
  id: number;
  status: string;
  date_created: string;
  total: string;
  customer_id: number;
  billing: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  shipping?: {
    first_name: string;
    last_name: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  line_items: Array<{
    product_id: number;
    name: string;
    quantity: number;
    total: string;
    price: string;
  }>;
  payment_method?: string;
  payment_method_title?: string;
  transaction_id?: string;
  customer_note?: string;
}

export interface WooCustomer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  orders_count: number;
  total_spent: string;
  avatar_url: string;
  billing: {
    first_name: string;
    last_name: string;
    company?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
    email: string;
    phone?: string;
  };
  shipping?: {
    first_name: string;
    last_name: string;
    company?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  date_created: string;
  date_modified: string;
}

// B2BKing specific types
export interface B2BKingGroup {
  id: number;
  name: string;
  description: string;
  registered_date: string;
  status: string;
  user_count: number;
  rules_count: number;
}

export interface B2BKingUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  company: string;
  position: string;
  groups: number[];
  registration_date: string;
  last_login: string;
  approved: boolean;
  vat_number?: string;
}

export interface B2BKingRule {
  id: number;
  name: string;
  type: string;
  what: string;
  who: number[] | string;
  quantity_value?: number;
  discount_value?: number;
  minimum_order?: number;
  tax_exemption?: boolean;
  requires_approval?: boolean;
  requires_login?: boolean;
}
