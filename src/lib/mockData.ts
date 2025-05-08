
// Mock data to populate our dashboard
export const salesData = {
  daily: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [4200, 3800, 5100, 4900, 6200, 8100, 7400],
    change: 12.4,
    total: 39700
  },
  monthly: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [42000, 38000, 51000, 49000, 62000, 81000],
    change: 8.7,
    total: 323000
  }
};

export const topProducts = [
  { id: 1, name: 'Dune Fragrance', sales: 128, revenue: 22400, image: 'https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?q=80&w=100&auto=format&fit=crop' },
  { id: 2, name: 'Moon Elixir', sales: 97, revenue: 16490, image: 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?q=80&w=100&auto=format&fit=crop' },
  { id: 3, name: 'Velvet Noir', sales: 86, revenue: 15050, image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=100&auto=format&fit=crop' },
  { id: 4, name: 'Amber Woods', sales: 72, revenue: 12600, image: 'https://images.unsplash.com/photo-1592945403407-9cce5ab4c988?q=80&w=100&auto=format&fit=crop' },
];

export const inventoryStatus = [
  { id: 1, name: 'Dune Fragrance', stock: 84, status: 'Good', reorder: false },
  { id: 2, name: 'Moon Elixir', stock: 23, status: 'Low', reorder: true },
  { id: 3, name: 'Velvet Noir', stock: 56, status: 'Good', reorder: false },
  { id: 4, name: 'Amber Woods', stock: 12, status: 'Critical', reorder: true },
];

export const marketingPerformance = {
  channels: [
    { name: 'Instagram', reach: 28500, engagement: 3.8, conversion: 2.1 },
    { name: 'Facebook', reach: 15200, engagement: 2.2, conversion: 1.7 },
    { name: 'Email', reach: 12000, engagement: 4.5, conversion: 3.2 },
    { name: 'TikTok', reach: 45000, engagement: 5.2, conversion: 1.9 },
  ],
  campaigns: [
    { name: 'Summer Collection', performance: 92, roi: 3.4 },
    { name: 'Loyalty Program', performance: 87, roi: 5.1 },
    { name: 'Influencer Collab', performance: 94, roi: 2.8 },
  ]
};

// B2B leads with expanded data for WooCommerce integration
export const b2bLeads = [
  { 
    id: 1, 
    company: 'Luxury Boutiques Inc.', 
    contact: 'Sarah Miller', 
    email: 'sarah@luxuryboutiques.com', 
    status: 'New Lead', 
    score: 87,
    lastOrder: null,
    totalSpent: 0,
    notes: 'Initial contact from trade show',
    industry: 'Retail',
    location: 'New York, USA',
    productInterests: ['Dune Fragrance', 'Velvet Noir']
  },
  { 
    id: 2, 
    company: 'Heritage Hotels', 
    contact: 'James Wilson', 
    email: 'jwilson@heritagehotels.com', 
    status: 'Contacted', 
    score: 92,
    lastOrder: '2025-04-01',
    totalSpent: 4250,
    notes: 'Interested in custom hotel amenities',
    industry: 'Hospitality',
    location: 'London, UK',
    productInterests: ['Hotel Collection', 'Custom Blends']
  },
  { 
    id: 3, 
    company: 'Elite Spas Network', 
    contact: 'Emma Thompson', 
    email: 'emma@elitespas.com', 
    status: 'Negotiating', 
    score: 76,
    lastOrder: '2025-03-15',
    totalSpent: 2800,
    notes: 'Negotiations for spa-exclusive collection',
    industry: 'Wellness',
    location: 'Los Angeles, USA',
    productInterests: ['Wellness Collection', 'Amber Woods']
  },
  { 
    id: 4, 
    company: 'Prestige Retail Group', 
    contact: 'Michael Chen', 
    email: 'mchen@prestigeretail.com', 
    status: 'New Lead', 
    score: 81,
    lastOrder: null,
    totalSpent: 0,
    notes: 'Referral from Luxury Boutiques Inc.',
    industry: 'Retail',
    location: 'Toronto, Canada',
    productInterests: ['Moon Elixir', 'Dune Fragrance']
  },
  { 
    id: 5, 
    company: 'Azure Resorts', 
    contact: 'Diana Lopez', 
    email: 'diana@azureresorts.com', 
    status: 'Interested', 
    score: 89,
    lastOrder: '2025-02-20',
    totalSpent: 6750,
    notes: 'Interested in resort-wide implementation',
    industry: 'Hospitality',
    location: 'Miami, USA',
    productInterests: ['Hotel Collection', 'Custom Packaging']
  },
];

export const abandonedCarts = [
  { id: 1, customer: 'Alex Johnson', email: 'alex@example.com', products: ['Dune Fragrance', 'Gift Box Premium'], value: 320, time: '2 hours ago' },
  { id: 2, customer: 'Morgan Lewis', email: 'morgan@example.com', products: ['Moon Elixir'], value: 170, time: '4 hours ago' },
  { id: 3, customer: 'Taylor Reid', email: 'taylor@example.com', products: ['Velvet Noir', 'Amber Woods', 'Sample Collection'], value: 490, time: '1 day ago' },
  { id: 4, customer: 'Jordan Casey', email: 'jordan@example.com', products: ['Gift Card Premium'], value: 250, time: '2 days ago' },
];

export const seoPerformance = {
  keywords: [
    { keyword: 'luxury fragrances', position: 4, change: 2, volume: 4800 },
    { keyword: 'exclusive perfume brand', position: 2, change: 1, volume: 2200 },
    { keyword: 'niche fragrance collection', position: 5, change: -1, volume: 3100 },
    { keyword: 'min new york perfume', position: 1, change: 0, volume: 1900 },
  ],
  pages: [
    { url: '/collections/premium', traffic: 3240, conversion: 4.2 },
    { url: '/product/dune-fragrance', traffic: 1850, conversion: 5.7 },
    { url: '/about-us', traffic: 1200, conversion: 2.1 },
    { url: '/product/moon-elixir', traffic: 1640, conversion: 4.8 },
  ]
};

// WooCommerce API integration types for B2B
export interface WooCustomer {
  id: number;
  date_created: string;
  email: string;
  first_name: string;
  last_name: string;
  billing: {
    company: string;
    address_1: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  };
  meta_data: Array<{
    key: string;
    value: string;
  }>;
}

export interface WooOrder {
  id: number;
  status: string;
  date_created: string;
  customer_id: number;
  billing: {
    first_name: string;
    last_name: string;
    company: string;
    email: string;
  };
  total: string;
  line_items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export interface WooProduct {
  id: number;
  name: string;
  price: string;
  stock_quantity: number;
  images: Array<{
    src: string;
  }>;
}
