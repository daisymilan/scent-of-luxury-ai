
import { WooCustomer, WooOrder, WooProduct } from '@/utils/woocommerce/types';

// Type definitions for B2B leads
export interface B2BLeadDisplay {
  id: number;
  company: string;
  brand?: string;
  linkedInProfileUrl?: string;
  contact: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  email: string;
  linkedInCompanyUrl?: string;
  linkedInCompanyId?: string;
  website?: string;
  domain?: string;
  employeeCount?: string;
  industry?: string;
  companyHQ?: string;
  location?: string;
  openProfile?: boolean;
  premiumLinkedIn?: boolean;
  geoTag?: string;
  status: string;
  score: number;
  lastOrder?: string | null;
  totalSpent?: number;
  notes?: string;
  productInterests?: string[];
}

// Status color mapping
export const statusColors = {
  'New Lead': 'bg-blue-100 text-blue-800',
  'Contacted': 'bg-yellow-100 text-yellow-800',
  'Interested': 'bg-green-100 text-green-800',
  'Negotiating': 'bg-purple-100 text-purple-800',
  'Customer': 'bg-emerald-100 text-emerald-800',
  'Lost': 'bg-gray-100 text-gray-800',
};

export interface B2BLeadGenerationProps {
  wooCustomers: WooCustomer[] | null;
  wooOrders: WooOrder[] | null;
  wooProducts: WooProduct[] | null;
}

export interface SequenceStep {
  id: number;
  name: string;
  status: 'completed' | 'scheduled';
  scheduledDate: string;
}
