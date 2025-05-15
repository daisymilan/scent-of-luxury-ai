
import { WooCommerceConfig, getWooCommerceConfig, WOO_API_BASE_URL } from './config';
import { fetchWooCommerceData } from './apiClient';
import { B2BKingGroup, B2BKingUser, B2BKingRule } from './types';

// Endpoint for B2BKing REST API
const B2BKING_API_BASE = `${WOO_API_BASE_URL}/b2bking`;

// Mock data for B2BKing when API endpoints return 404
const MOCK_B2BKING_GROUPS: B2BKingGroup[] = [
  {
    id: 1,
    name: 'Gold Tier Retailers',
    description: 'Premium retail partners with volume discounts',
    status: 'active',
    user_count: 12,
    rules_count: 5
  },
  {
    id: 2,
    name: 'Silver Tier Retailers',
    description: 'Mid-level retail partners',
    status: 'active',
    user_count: 24,
    rules_count: 3
  },
  {
    id: 3,
    name: 'Distributors',
    description: 'Wholesale distribution partners',
    status: 'active',
    user_count: 8,
    rules_count: 7
  }
];

const MOCK_B2BKING_USERS: B2BKingUser[] = [
  {
    id: 101,
    username: 'luxury_paris',
    first_name: 'Marie',
    last_name: 'Laurent',
    email: 'marie@luxuryparisfragrance.com',
    company: 'Luxury Paris Fragrances',
    position: 'Purchasing Manager',
    approved: true,
    group_id: 1,
    registration_date: '2023-08-15T10:30:00'
  },
  {
    id: 102,
    username: 'nordic_scents',
    first_name: 'Johan',
    last_name: 'Eriksson',
    email: 'johan@nordicscents.se',
    company: 'Nordic Scents AB',
    position: 'Owner',
    approved: true,
    group_id: 1,
    registration_date: '2023-09-22T14:15:00'
  },
  {
    id: 103,
    username: 'tokyo_luxury',
    first_name: 'Takeshi',
    last_name: 'Yamamoto',
    email: 'takeshi@tokyoluxury.jp',
    company: 'Tokyo Luxury Co.',
    position: 'Import Manager',
    approved: true,
    group_id: 2,
    registration_date: '2023-10-05T09:45:00'
  },
  {
    id: 104,
    username: 'fragrance_dist',
    first_name: 'Carlos',
    last_name: 'Rodriguez',
    email: 'carlos@fragrancedistributors.es',
    company: 'Fragrance Distributors S.L.',
    position: 'Operations Director',
    approved: false,
    group_id: 3,
    registration_date: '2024-01-10T11:20:00'
  }
];

const MOCK_B2BKING_RULES: B2BKingRule[] = [
  {
    id: 201,
    name: 'Gold Tier 20% Discount',
    description: 'Automatic 20% discount on all products',
    type: 'discount',
    who: [1],
    discount_value: 20,
    requires_approval: false,
    requires_login: true
  },
  {
    id: 202,
    name: 'Silver Tier 10% Discount',
    description: 'Automatic 10% discount on all products',
    type: 'discount',
    who: [2],
    discount_value: 10,
    requires_approval: false,
    requires_login: true
  },
  {
    id: 203,
    name: 'Distributor Minimum Order',
    description: 'Minimum order amount for distributors',
    type: 'minimum_order',
    who: [3],
    minimum_order: 1000,
    requires_approval: false,
    requires_login: true
  },
  {
    id: 204,
    name: 'Exclusive Product Access',
    description: 'Access to exclusive products',
    type: 'product_visibility',
    who: [1, 3],
    requires_approval: true,
    requires_login: true
  }
];

// Enhanced error handling for B2BKing API calls
const handleB2BKingApiCall = async <T,>(
  endpoint: string,
  mockData: T,
  config?: WooCommerceConfig
): Promise<T> => {
  const wooConfig = config || getWooCommerceConfig();
  if (!wooConfig) throw new Error('WooCommerce config not found');
  
  try {
    console.log(`Fetching B2BKing data for endpoint: ${endpoint}`);
    return await fetchWooCommerceData<T>(endpoint, wooConfig);
  } catch (error) {
    console.error(`Error fetching B2BKing data for ${endpoint}:`, error);
    
    // Check if error is 404 (endpoint not found) - B2BKing plugin might not be installed
    if (error instanceof Error && error.message.includes('404')) {
      console.warn(`B2BKing endpoint ${endpoint} not found. Using mock data.`);
      return mockData;
    }
    
    throw error;
  }
};

// Get all B2BKing customer groups
export const getB2BKingGroups = async (
  config?: WooCommerceConfig
): Promise<B2BKingGroup[]> => {
  return handleB2BKingApiCall<B2BKingGroup[]>('b2bking/groups', MOCK_B2BKING_GROUPS, config);
};

// Get a single B2BKing group by ID
export const getB2BKingGroupById = async (
  groupId: number,
  config?: WooCommerceConfig
): Promise<B2BKingGroup> => {
  try {
    return await handleB2BKingApiCall<B2BKingGroup>(`b2bking/groups/${groupId}`, 
      MOCK_B2BKING_GROUPS.find(group => group.id === groupId) || MOCK_B2BKING_GROUPS[0],
      config);
  } catch (error) {
    console.error(`Error fetching B2BKing group ${groupId}:`, error);
    // Return matching mock group if available, otherwise first mock group
    return MOCK_B2BKING_GROUPS.find(group => group.id === groupId) || MOCK_B2BKING_GROUPS[0];
  }
};

// Get all B2BKing users
export const getB2BKingUsers = async (
  config?: WooCommerceConfig
): Promise<B2BKingUser[]> => {
  return handleB2BKingApiCall<B2BKingUser[]>('b2bking/users', MOCK_B2BKING_USERS, config);
};

// Get a single B2BKing user by ID
export const getB2BKingUserById = async (
  userId: number,
  config?: WooCommerceConfig
): Promise<B2BKingUser> => {
  try {
    return await handleB2BKingApiCall<B2BKingUser>(`b2bking/users/${userId}`,
      MOCK_B2BKING_USERS.find(user => user.id === userId) || MOCK_B2BKING_USERS[0],
      config);
  } catch (error) {
    console.error(`Error fetching B2BKing user ${userId}:`, error);
    // Return matching mock user if available, otherwise first mock user
    return MOCK_B2BKING_USERS.find(user => user.id === userId) || MOCK_B2BKING_USERS[0];
  }
};

// Get all B2BKing rules
export const getB2BKingRules = async (
  config?: WooCommerceConfig
): Promise<B2BKingRule[]> => {
  return handleB2BKingApiCall<B2BKingRule[]>('b2bking/rules', MOCK_B2BKING_RULES, config);
};

// Get B2BKing rules by type
export const getB2BKingRulesByType = async (
  type: string,
  config?: WooCommerceConfig
): Promise<B2BKingRule[]> => {
  try {
    return await handleB2BKingApiCall<B2BKingRule[]>(`b2bking/rules?type=${type}`, 
      MOCK_B2BKING_RULES.filter(rule => rule.type === type),
      config);
  } catch (error) {
    console.error(`Error fetching B2BKing rules of type ${type}:`, error);
    // Return matching mock rules by type
    return MOCK_B2BKING_RULES.filter(rule => rule.type === type);
  }
};
