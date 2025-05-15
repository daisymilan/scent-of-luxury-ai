// Fix billing property's email to be optional in WooOrder interface
import { UserRole } from '@/contexts/AuthContext';

// Update the WooOrder billing interface to match WooCommerce API types
export interface WooOrder {
  id: number;
  number: string;
  status: string;
  date_created: string;
  total: string;
  customer_id: number;
  billing: {
    first_name?: string;
    last_name?: string;
    company?: string;
    email?: string; // Make email optional to match WooCommerce API
    city?: string;
    country?: string;
    address_1?: string;
    address_2?: string;
    state?: string;
    postcode?: string;
    phone?: string;
  };
  line_items: Array<{
    id: number;
    name: string;
    product_id: number;
    quantity: number;
    total: string;
  }>;
}

// Update the WooProduct interface to match WooCommerce API types
export interface WooProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  date_created: string;
  type: string;
  status: string;
  featured: boolean;
  catalog_visibility: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price?: string; // Make sale_price optional to match WooCommerce API
  price_html: string;
  on_sale: boolean;
  purchasable: boolean;
  total_sales: number;
  virtual: boolean;
  downloadable: boolean;
  categories: Array<{ id: number; name: string; slug: string }>;
  tags: Array<{ id: number; name: string; slug: string }>;
  images: Array<{ id: number; src: string; alt?: string }>;
  attributes: Array<any>;
  stock_quantity: number | null;
  in_stock: boolean;
  // Additional properties
  related_ids?: number[];
  stock_status?: string;
  has_options?: boolean;
  average_rating?: string;
  rating_count?: number;
}

// Mock data for testing purposes
export const mockOrders: WooOrder[] = [
  {
    id: 1,
    number: '123',
    status: 'processing',
    date_created: '2024-01-01T12:00:00',
    total: '150.00',
    customer_id: 1,
    billing: {
      first_name: 'John',
      last_name: 'Doe',
      company: 'Example Inc.',
      email: 'john.doe@example.com',
      city: 'New York',
      country: 'US',
      address_1: '123 Main St',
      address_2: '',
      state: 'NY',
      postcode: '10001',
      phone: '555-1234'
    },
    line_items: [
      {
        id: 1,
        name: 'Product A',
        product_id: 101,
        quantity: 2,
        total: '100.00'
      },
      {
        id: 2,
        name: 'Product B',
        product_id: 102,
        quantity: 1,
        total: '50.00'
      }
    ]
  },
  {
    id: 2,
    number: '124',
    status: 'completed',
    date_created: '2024-01-05T15:30:00',
    total: '75.00',
    customer_id: 2,
    billing: {
      first_name: 'Jane',
      last_name: 'Smith',
      company: 'Smith Corp',
      email: 'jane.smith@example.com',
      city: 'Los Angeles',
      country: 'US',
      address_1: '456 Elm St',
      address_2: '',
      state: 'CA',
      postcode: '90001',
      phone: '555-5678'
    },
    line_items: [
      {
        id: 3,
        name: 'Product C',
        product_id: 103,
        quantity: 3,
        total: '75.00'
      }
    ]
  },
  {
    id: 3,
    number: '125',
    status: 'processing',
    date_created: '2024-01-10T09:15:00',
    total: '200.00',
    customer_id: 1,
    billing: {
      first_name: 'John',
      last_name: 'Doe',
      company: 'Example Inc.',
      email: 'john.doe@example.com',
      city: 'New York',
      country: 'US',
      address_1: '123 Main St',
      address_2: '',
      state: 'NY',
      postcode: '10001',
      phone: '555-1234'
    },
    line_items: [
      {
        id: 4,
        name: 'Product D',
        product_id: 104,
        quantity: 1,
        total: '200.00'
      }
    ]
  },
  {
    id: 4,
    number: '126',
    status: 'on-hold',
    date_created: '2024-01-12T18:45:00',
    total: '50.00',
    customer_id: 3,
    billing: {
      first_name: 'Alice',
      last_name: 'Johnson',
      company: 'Johnson Ltd',
      email: 'alice.johnson@example.com',
      city: 'Chicago',
      country: 'US',
      address_1: '789 Oak St',
      address_2: '',
      state: 'IL',
      postcode: '60601',
      phone: '555-9012'
    },
    line_items: [
      {
        id: 5,
        name: 'Product E',
        product_id: 105,
        quantity: 2,
        total: '50.00'
      }
    ]
  },
  {
    id: 5,
    number: '127',
    status: 'completed',
    date_created: '2024-01-15T11:00:00',
    total: '120.00',
    customer_id: 2,
    billing: {
      first_name: 'Jane',
      last_name: 'Smith',
      company: 'Smith Corp',
      email: 'jane.smith@example.com',
      city: 'Los Angeles',
      country: 'US',
      address_1: '456 Elm St',
      address_2: '',
      state: 'CA',
      postcode: '90001',
      phone: '555-5678'
    },
    line_items: [
      {
        id: 6,
        name: 'Product F',
        product_id: 106,
        quantity: 4,
        total: '120.00'
      }
    ]
  }
];

export const mockProducts: WooProduct[] = [
  {
    id: 1,
    name: 'Awesome Wool Shirt',
    slug: 'awesome-wool-shirt',
    permalink: 'http://localhost:3000/product/awesome-wool-shirt/',
    date_created: '2024-05-04T17:28:15',
    type: 'simple',
    status: 'publish',
    featured: false,
    catalog_visibility: 'visible',
    description: '<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>\n',
    short_description: '<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>\n',
    sku: 'woo-beanie',
    price: '21.00',
    regular_price: '23.00',
    sale_price: '21.00',
    price_html: '<span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">$</span>21.00</bdi></span>',
    on_sale: true,
    purchasable: true,
    total_sales: 0,
    virtual: false,
    downloadable: false,
    categories: [{ id: 9, name: 'Clothing', slug: 'clothing' }],
    tags: [{ id: 17, name: 'beanie', slug: 'beanie' }],
    images: [
      {
        id: 19,
        src: 'http://localhost:3000/wp-content/uploads/2024/05/hoodie-with-logo-1.jpg',
        alt: 'Hoodie with Logo'
      }
    ],
    attributes: [],
    stock_quantity: null,
    in_stock: true
  },
  {
    id: 2,
    name: 'Patient Silicone Bag',
    slug: 'patient-silicone-bag',
    permalink: 'http://localhost:3000/product/patient-silicone-bag/',
    date_created: '2024-05-04T17:28:15',
    type: 'simple',
    status: 'publish',
    featured: false,
    catalog_visibility: 'visible',
    description: '<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>\n',
    short_description: '<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>\n',
    sku: '',
    price: '14.00',
    regular_price: '14.00',
    price_html: '<span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">$</span>14.00</bdi></span>',
    on_sale: false,
    purchasable: true,
    total_sales: 0,
    virtual: false,
    downloadable: false,
    categories: [{ id: 15, name: 'Music', slug: 'music' }],
    tags: [],
    images: [
      {
        id: 20,
        src: 'http://localhost:3000/wp-content/uploads/2024/05/T_4_front.jpg',
        alt: 'T 4 front'
      }
    ],
    attributes: [],
    stock_quantity: null,
    in_stock: true
  },
  {
    id: 3,
    name: 'Refined Plastic Car',
    slug: 'refined-plastic-car',
    permalink: 'http://localhost:3000/product/refined-plastic-car/',
    date_created: '2024-05-04T17:28:15',
    type: 'simple',
    status: 'publish',
    featured: false,
    catalog_visibility: 'visible',
    description: '<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>\n',
    short_description: '<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>\n',
    sku: 'woo-single',
    price: '43.00',
    regular_price: '43.00',
    price_html: '<span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">$</span>43.00</bdi></span>',
    on_sale: false,
    purchasable: true,
    total_sales: 0,
    virtual: false,
    downloadable: false,
    categories: [{ id: 12, name: 'Shoes', slug: 'shoes' }],
    tags: [],
    images: [
      {
        id: 21,
        src: 'http://localhost:3000/wp-content/uploads/2024/05/cd_4_angle.jpg',
        alt: 'cd 4 angle'
      }
    ],
    attributes: [],
    stock_quantity: null,
    in_stock: true
  },
  {
    id: 4,
    name: 'Sleek Cotton Shoes',
    slug: 'sleek-cotton-shoes',
    permalink: 'http://localhost:3000/product/sleek-cotton-shoes/',
    date_created: '2024-05-04T17:28:15',
    type: 'simple',
    status: 'publish',
    featured: false,
    catalog_visibility: 'visible',
    description: '<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>\n',
    short_description: '<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>\n',
    sku: 'woo-album',
    price: '40.00',
    regular_price: '40.00',
    price_html: '<span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">$</span>40.00</bdi></span>',
    on_sale: false,
    purchasable: true,
    total_sales: 0,
    virtual: false,
    downloadable: false,
    categories: [{ id: 15, name: 'Music', slug: 'music' }],
    tags: [],
    images: [
      {
        id: 22,
        src: 'http://localhost:3000/wp-content/uploads/2024/05/album-1.jpg',
        alt: 'Album'
      }
    ],
    attributes: [],
    stock_quantity: null,
    in_stock: true
  },
  {
    id: 5,
    name: 'Unbranded Plastic Chair',
    slug: 'unbranded-plastic-chair',
    permalink: 'http://localhost:3000/product/unbranded-plastic-chair/',
    date_created: '2024-05-04T17:28:15',
    type: 'simple',
    status: 'publish',
    featured: false,
    catalog_visibility: 'visible',
    description: '<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>\n',
    short_description: '<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>\n',
    sku: 'woo-tshirt',
    price: '18.00',
    regular_price: '18.00',
    price_html: '<span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">$</span>18.00</bdi></span>',
    on_sale: false,
    purchasable: true,
    total_sales: 0,
    virtual: false,
    downloadable: false,
    categories: [{ id: 9, name: 'Clothing', slug: 'clothing' }],
    tags: [{ id: 16, name: 'tshirt', slug: 'tshirt' }],
    images: [
      {
        id: 23,
        src: 'http://localhost:3000/wp-content/uploads/2024/05/T_2_front.jpg',
        alt: 'T 2 front'
      }
    ],
    attributes: [],
    stock_quantity: null,
    in_stock: true
  }
];

export const mockCustomerOrders: WooOrder[] = [
  {
    id: 6,
    number: '128',
    status: 'processing',
    date_created: '2024-01-01T12:00:00',
    total: '150.00',
    customer_id: 1,
    billing: {
      first_name: 'John',
      last_name: 'Doe',
      company: 'Example Inc.',
      email: 'john.doe@example.com',
      city: 'New York',
      country: 'US',
      address_1: '123 Main St',
      address_2: '',
      state: 'NY',
      postcode: '10001',
      phone: '555-1234'
    },
    line_items: [
      {
        id: 7,
        name: 'Product A',
        product_id: 101,
        quantity: 2,
        total: '100.00'
      },
      {
        id: 8,
        name: 'Product B',
        product_id: 102,
        quantity: 1,
        total: '50.00'
      }
    ]
  },
  {
    id: 7,
    number: '129',
    status: 'completed',
    date_created: '2024-01-05T15:30:00',
    total: '75.00',
    customer_id: 1,
    billing: {
      first_name: 'John',
      last_name: 'Doe',
      company: 'Example Inc.',
      email: 'john.doe@example.com',
      city: 'New York',
      country: 'US',
      address_1: '123 Main St',
      address_2: '',
      state: 'NY',
      postcode: '10001',
      phone: '555-1234'
    },
    line_items: [
      {
        id: 9,
        name: 'Product C',
        product_id: 103,
        quantity: 3,
        total: '75.00'
      }
    ]
  }
];

export const mockLeads = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '555-1234',
    company: 'Example Inc.',
    status: 'New',
    source: 'Website',
    date_created: '2024-01-01T12:00:00'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '555-5678',
    company: 'Smith Corp',
    status: 'Contacted',
    source: 'Referral',
    date_created: '2024-01-05T15:30:00'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone: '555-9012',
    company: 'Johnson Ltd',
    status: 'Qualified',
    source: 'Advertisement',
    date_created: '2024-01-10T09:15:00'
  },
  {
    id: 4,
    name: 'Bob Williams',
    email: 'bob.williams@example.com',
    phone: '555-3456',
    company: 'Williams Co',
    status: 'Negotiation',
    source: 'Trade Show',
    date_created: '2024-01-12T18:45:00'
  },
  {
    id: 5,
    name: 'Eve Brown',
    email: 'eve.brown@example.com',
    phone: '555-7890',
    company: 'Brown Group',
    status: 'Closed',
    source: 'Email Campaign',
    date_created: '2024-01-15T11:00:00'
  }
];

export const mockLeadOutreachData = [
  {
    id: 1,
    lead_id: 1,
    date: '2024-01-02T10:00:00',
    method: 'Email',
    notes: 'Initial contact email sent.'
  },
  {
    id: 2,
    lead_id: 2,
    date: '2024-01-06T14:00:00',
    method: 'Phone',
    notes: 'Follow-up phone call made.'
  },
  {
    id: 3,
    lead_id: 3,
    date: '2024-01-11T16:00:00',
    method: 'Meeting',
    notes: 'In-person meeting held.'
  },
  {
    id: 4,
    lead_id: 4,
    date: '2024-01-13T09:00:00',
    method: 'Email',
    notes: 'Proposal document sent.'
  },
  {
    id: 5,
    lead_id: 5,
    date: '2024-01-16T12:00:00',
    method: 'Phone',
    notes: 'Contract terms discussed.'
  }
];

// For user role testing
export const userRoles: UserRole[] = ['CEO', 'CCO', 'Commercial Director', 'Marketing Manager', 'Regional Manager', 'Social Media Manager', 'Customer Support', 'User'];

export const mockUserData = {
  id: 'user123',
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'CEO' as UserRole,
  avatarUrl: 'https://example.com/avatar.jpg',
  department: 'Executive',
  lastLogin: '2024-05-10T12:00:00Z',
  preferences: {
    theme: 'dark',
    notificationsEnabled: true
  }
};
