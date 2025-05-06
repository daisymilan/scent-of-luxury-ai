
// Mock data for various KPIs and metrics for different roles
export interface SalesData {
  value: number;
  change: number;
  period: string;
}

export interface InventoryData {
  product: string;
  stock: number;
  location: string;
  status: 'Low' | 'Ok' | 'Overstocked';
}

export interface OrderData {
  id: string;
  customer: string;
  amount: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Flagged';
  date: string;
}

export interface MarketingData {
  campaign: string;
  platform: string;
  impressions: number;
  engagement: number;
  cost: number;
  roi: number;
}

// Role-based data access
export const getMockDataForRole = (role: string | undefined) => {
  // Default data that all roles can access
  const baseData = {
    canAccessSales: false,
    canAccessInventory: false,
    canAccessMarketing: false,
    canAccessOrders: false,
    salesSummary: { value: 0, change: 0, period: 'Monthly' },
    orders: [] as OrderData[],
    inventory: [] as InventoryData[],
    marketing: [] as MarketingData[]
  };
  
  switch (role) {
    case 'CEO':
    case 'CCO':
      // Full access
      return {
        ...baseData,
        canAccessSales: true,
        canAccessInventory: true,
        canAccessMarketing: true,
        canAccessOrders: true,
        salesSummary: { value: 158750, change: 12.4, period: 'Monthly' },
        orders: [
          { id: 'ORD-12345', customer: 'Luxury Retreat Spa', amount: 4250, status: 'Delivered', date: '2025-05-04' },
          { id: 'ORD-12346', customer: 'The Standard Hotel', amount: 3800, status: 'Shipped', date: '2025-05-05' },
          { id: 'ORD-12347', customer: 'Private Client', amount: 1200, status: 'Pending', date: '2025-05-06' },
          { id: 'ORD-12348', customer: 'Dubai Mall Kiosk', amount: 6500, status: 'Delivered', date: '2025-05-03' },
          { id: 'ORD-12349', customer: 'Online Customer', amount: 850, status: 'Flagged', date: '2025-05-06' }
        ],
        inventory: [
          { product: 'Moon Dust Eau de Parfum', stock: 254, location: 'Las Vegas', status: 'Ok' },
          { product: 'Dune Eau de Parfum', stock: 128, location: 'Las Vegas', status: 'Ok' },
          { product: 'Moon Dust Eau de Parfum', stock: 28, location: 'Nice', status: 'Low' },
          { product: 'Dahab Eau de Parfum', stock: 89, location: 'Dubai', status: 'Ok' },
          { product: 'Coda Eau de Parfum', stock: 312, location: 'Riyadh', status: 'Overstocked' }
        ],
        marketing: [
          { campaign: 'Summer Collection', platform: 'Instagram', impressions: 245000, engagement: 3.8, cost: 5000, roi: 220 },
          { campaign: 'Summer Collection', platform: 'TikTok', impressions: 180000, engagement: 4.2, cost: 4200, roi: 185 },
          { campaign: 'Dahab Launch', platform: 'Instagram', impressions: 320000, engagement: 5.1, cost: 7500, roi: 310 },
          { campaign: 'Retailer Promo', platform: 'LinkedIn', impressions: 45000, engagement: 2.8, cost: 3200, roi: 145 }
        ]
      };
      
    case 'Commercial Director':
      // Access to sales, inventory, and orders
      return {
        ...baseData,
        canAccessSales: true,
        canAccessInventory: true,
        canAccessOrders: true,
        salesSummary: { value: 158750, change: 12.4, period: 'Monthly' },
        orders: [
          { id: 'ORD-12345', customer: 'Luxury Retreat Spa', amount: 4250, status: 'Delivered', date: '2025-05-04' },
          { id: 'ORD-12346', customer: 'The Standard Hotel', amount: 3800, status: 'Shipped', date: '2025-05-05' },
          { id: 'ORD-12347', customer: 'Private Client', amount: 1200, status: 'Pending', date: '2025-05-06' },
          { id: 'ORD-12348', customer: 'Dubai Mall Kiosk', amount: 6500, status: 'Delivered', date: '2025-05-03' },
          { id: 'ORD-12349', customer: 'Online Customer', amount: 850, status: 'Flagged', date: '2025-05-06' }
        ],
        inventory: [
          { product: 'Moon Dust Eau de Parfum', stock: 254, location: 'Las Vegas', status: 'Ok' },
          { product: 'Dune Eau de Parfum', stock: 128, location: 'Las Vegas', status: 'Ok' },
          { product: 'Moon Dust Eau de Parfum', stock: 28, location: 'Nice', status: 'Low' },
          { product: 'Dahab Eau de Parfum', stock: 89, location: 'Dubai', status: 'Ok' },
          { product: 'Coda Eau de Parfum', stock: 312, location: 'Riyadh', status: 'Overstocked' }
        ]
      };
      
    case 'Regional Manager':
      // Access to inventory and orders
      return {
        ...baseData,
        canAccessInventory: true,
        canAccessOrders: true,
        orders: [
          { id: 'ORD-12345', customer: 'Luxury Retreat Spa', amount: 4250, status: 'Delivered', date: '2025-05-04' },
          { id: 'ORD-12346', customer: 'The Standard Hotel', amount: 3800, status: 'Shipped', date: '2025-05-05' },
          { id: 'ORD-12347', customer: 'Private Client', amount: 1200, status: 'Pending', date: '2025-05-06' },
          { id: 'ORD-12348', customer: 'Dubai Mall Kiosk', amount: 6500, status: 'Delivered', date: '2025-05-03' },
          { id: 'ORD-12349', customer: 'Online Customer', amount: 850, status: 'Flagged', date: '2025-05-06' }
        ],
        inventory: [
          { product: 'Moon Dust Eau de Parfum', stock: 254, location: 'Las Vegas', status: 'Ok' },
          { product: 'Dune Eau de Parfum', stock: 128, location: 'Las Vegas', status: 'Ok' },
          { product: 'Moon Dust Eau de Parfum', stock: 28, location: 'Nice', status: 'Low' },
          { product: 'Dahab Eau de Parfum', stock: 89, location: 'Dubai', status: 'Ok' },
          { product: 'Coda Eau de Parfum', stock: 312, location: 'Riyadh', status: 'Overstocked' }
        ]
      };
      
    case 'Marketing Manager':
      // Access to marketing data
      return {
        ...baseData,
        canAccessMarketing: true,
        marketing: [
          { campaign: 'Summer Collection', platform: 'Instagram', impressions: 245000, engagement: 3.8, cost: 5000, roi: 220 },
          { campaign: 'Summer Collection', platform: 'TikTok', impressions: 180000, engagement: 4.2, cost: 4200, roi: 185 },
          { campaign: 'Dahab Launch', platform: 'Instagram', impressions: 320000, engagement: 5.1, cost: 7500, roi: 310 },
          { campaign: 'Retailer Promo', platform: 'LinkedIn', impressions: 45000, engagement: 2.8, cost: 3200, roi: 145 }
        ]
      };
      
    default:
      // Limited access for other roles
      return baseData;
  }
};
